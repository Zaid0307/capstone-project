import { MUSCLES, resolveMuscleId } from '../../data/muscles';
import { MUSCLE_GROUP_NAMES } from '../../data/muscleGroups';
import { libraryExercise } from '../workoutPlan';
import { isCountable, isFirstRowOfSet } from './setRows';
import { countsForMuscleLoad } from '../../data/exerciseLibrary';

// Muscle contributions and effective sets (docs/ux/03-analysen-und-architektur.md, 3.3).
//
// One set of an exercise gives each leaf muscle (head/part, or muscle without parts)
// 1 for a primary and 0.5 for a secondary muscle; listed in both counts 1.
// Going up – whole muscle (e.g. pectoralis_major) or muscle group – takes the
// MAXIMUM per set, not the sum, so one bench press set is 1 set for the whole
// pectoralis major (not 2) and 0.5 for the triceps (not 1.5).
// Own exercises without database id count 1 for their group (exercise.muscle) only.
//
// Muscle data is read at analysis time from the library, never stored in workouts.

export const PRIMARY_SHARE = 1;
export const SECONDARY_SHARE = 0.5;

const ancestorsOf = id => {
  const ancestors = [];
  for (let parent = MUSCLES[id]?.parent; parent; parent = MUSCLES[parent]?.parent) ancestors.push(parent);
  return ancestors;
};

const raise = (target, key, value) => {
  if ((target[key] ?? 0) < value) target[key] = value;
};

const EMPTY = Object.freeze({ leaves: {}, muscles: {}, groups: {}, custom: false });
const cache = new Map();

// What one set of an exercise gives each muscle and group:
// { leaves: { leafId: share }, muscles: { anyMuscleId: max share }, groups: { group: max share }, custom }
// `muscles` holds leaves, intermediate and whole muscles. Computed once per exercise.
// fallbackGroup is the group of an own exercise (exercise.muscle / entry.muscle).
export function muscleContributions(exerciseId, fallbackGroup = null) {
  // Called for every row, so the cache (exercise id → group → result) is checked
  // before the (linear) library search.
  let byGroup = cache.get(exerciseId ?? null);
  if (!byGroup) cache.set(exerciseId ?? null, (byGroup = new Map()));
  const cached = byGroup.get(fallbackGroup ?? null);
  if (cached) return cached;
  let result = EMPTY;
  const exercise = exerciseId ? libraryExercise(exerciseId) : null;
  if (exercise) {
    const leaves = {};
    // Secondary first, so a muscle in both lists ends at 1.
    for (const id of exercise.muscles.secondary.flatMap(resolveMuscleId)) raise(leaves, id, SECONDARY_SHARE);
    for (const id of exercise.muscles.primary.flatMap(resolveMuscleId)) raise(leaves, id, PRIMARY_SHARE);
    const muscles = {};
    const groups = {};
    for (const [id, share] of Object.entries(leaves)) {
      for (const muscle of [id, ...ancestorsOf(id)]) raise(muscles, muscle, share);
      raise(groups, MUSCLES[id].group, share);
    }
    result = { leaves, muscles, groups, custom: false };
  } else if (MUSCLE_GROUP_NAMES.includes(fallbackGroup)) {
    result = { leaves: {}, muscles: {}, groups: { [fallbackGroup]: PRIMARY_SHARE }, custom: true };
  }
  byGroup.set(fallbackGroup ?? null, result);
  return result;
}

export const rowContributions = row => muscleContributions(row.exerciseId, row.groupOfEntry);

// Share of one set for a muscle (any level) or a group id.
export function contributionTo(contributions, id) {
  return MUSCLE_GROUP_NAMES.includes(id) ? contributions.groups[id] ?? 0 : contributions.muscles[id] ?? 0;
}

const WHOLE_IDS = new Set(Object.keys(MUSCLES).filter(id => !MUSCLES[id].parent));

function sharesAt(contributions, level) {
  if (level === 'group') return contributions.groups;
  if (level === 'leaf') return contributions.leaves;
  if (level === 'whole') {
    const shares = {};
    for (const [id, share] of Object.entries(contributions.muscles)) if (WHOLE_IDS.has(id)) shares[id] = share;
    return shares;
  }
  return contributions.muscles; // 'muscle': every muscle id, leaf to whole
}

const levelCache = new Map();
const cachedShares = (contributions, level) => {
  let byLevel = levelCache.get(contributions);
  if (!byLevel) levelCache.set(contributions, (byLevel = {}));
  return (byLevel[level] ??= Object.entries(sharesAt(contributions, level)));
};

// Effective sets per muscle or group over countable sets, counting a per-side set once.
// level: 'group' | 'whole' (muscles without parent) | 'leaf' | 'muscle' (every muscle id).
// Returns { [id]: sets }.
export function effectiveSets(rows, options = {}) {
  const level = options.level ?? 'group';
  // Count the sets per exercise first and multiply the shares once per exercise:
  // far fewer steps than adding every share of every set (shares are 1 or 0.5, so
  // the products are exact).
  const setsByExercise = new Map();
  for (const row of rows) {
    if (!isFirstRowOfSet(row) || !isCountable(row, options) || !countsForMuscleLoad(row.category)) continue;
    const contributions = rowContributions(row);
    setsByExercise.set(contributions, (setsByExercise.get(contributions) ?? 0) + 1);
  }
  const totals = {};
  for (const [contributions, sets] of setsByExercise) {
    for (const [id, share] of cachedShares(contributions, level)) totals[id] = (totals[id] ?? 0) + share * sets;
  }
  return totals;
}

// Effective sets per ISO week: { [weekKey]: { [id]: sets } } (matrix group × week, 3.8).
export function effectiveSetsByWeek(rows, options = {}) {
  const byWeek = {};
  for (const row of rows) (byWeek[row.weekKey] ??= []).push(row);
  return Object.fromEntries(Object.entries(byWeek).map(([week, items]) => [week, effectiveSets(items, options)]));
}

// Countable sets of own exercises per group: they appear in groups only (3.12).
export function customExerciseSets(rows, { warmups = false } = {}) {
  const totals = {};
  for (const row of rows) {
    if (!isFirstRowOfSet(row) || !isCountable(row, { warmups }) || !rowContributions(row).custom) continue;
    totals[row.groupOfEntry] = (totals[row.groupOfEntry] ?? 0) + 1;
  }
  return totals;
}

// Effective sets for each side of a muscle pair: per set the maximum over the
// muscles of a side (3.3, balance pairs). sides: [[ids…], [ids…]] (any muscle or legacy id).
export function pairEffectiveSets(rows, sides, { warmups = false } = {}) {
  const sideIds = sides.map(ids => [...new Set(ids.flatMap(id => [id, ...resolveMuscleId(id)]))]);
  const totals = sides.map(() => 0);
  for (const row of rows) {
    if (!isFirstRowOfSet(row) || !isCountable(row, { warmups }) || !countsForMuscleLoad(row.category)) continue;
    const { muscles } = rowContributions(row);
    sideIds.forEach((ids, index) => {
      totals[index] += Math.max(0, ...ids.map(id => muscles[id] ?? 0));
    });
  }
  return totals;
}

// Map levels 0–4 from effective sets per week (3.3): 0 not trained, < 4 low,
// < 10 moderate, 10–20 in range, > 20 high.
export function loadLevel(setsPerWeek) {
  if (!(setsPerWeek > 0)) return 0;
  if (setsPerWeek < 4) return 1;
  if (setsPerWeek < 10) return 2;
  if (setsPerWeek <= 20) return 3;
  return 4;
}
