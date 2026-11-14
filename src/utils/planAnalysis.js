import { countsForMuscleLoad } from '../data/exerciseLibrary';
import * as muscleData from '../data/muscles';
import { MUSCLE_GROUP_NAMES } from '../data/muscleGroups';
import { entryCountsForMuscleLoad, libraryExercise, weeklyDayFactor, weeklySetsByMuscle } from './workoutPlan';

const { MUSCLES } = muscleData;
// Older muscle ids that were split into heads or parts (if the data defines them).
const LEGACY_MUSCLE_IDS = muscleData.LEGACY_MUSCLE_IDS ?? {};

// Rough guide from study summaries: about 10 or more working sets per muscle
// group and week for muscle growth (docs/konzept-plaene-training-auswertung.md, 3.7).
export const GUIDELINE_SETS = 10;
const HIGH_SETS = 25;
// A side counts as neglected when it gets less than half of its counterpart.
const IMBALANCE_RATIO = 0.5;
const IMBALANCE_MIN_SETS = 4;

const childrenOf = id => Object.keys(MUSCLES).filter(other => MUSCLES[other].parent === id);

// An id with all heads or parts below it, and old ids with what replaced them.
function expand(id) {
  const ids = [id, ...(LEGACY_MUSCLE_IDS[id] ?? [])];
  return ids.flatMap(item => [item, ...childrenOf(item).flatMap(expand)]);
}

// Muscles shown on their own: those without heads or parts below them. Deep
// muscles are included; they are marked, because a figure cannot show them from outside.
export const DETAIL_MUSCLES = Object.keys(MUSCLES).filter(id => childrenOf(id).length === 0);

// Muscle pairs that should stay in proportion, from neck to lower leg: mostly
// agonists and antagonists around the same joint. Each side lists muscle ids;
// heads and parts below them count too.
export const BALANCE_PAIRS = [
  { id: 'neckFrontBack', sides: [['sternocleidomastoid'], ['splenius_capitis', 'splenius_cervicis']] },
  { id: 'pushPull', sides: [['pectoralis_major'], ['latissimus_dorsi', 'rhomboids', 'trapezius_transverse']] },
  { id: 'shoulderFrontBack', sides: [['deltoid_anterior'], ['deltoid_posterior']] },
  { id: 'rotatorCuff', sides: [['subscapularis'], ['infraspinatus', 'teres_minor']] },
  { id: 'trapeziusUpperLower', sides: [['trapezius_descending', 'levator_scapulae'], ['trapezius_ascending']] },
  { id: 'upperArm', sides: [['biceps_brachii', 'brachialis'], ['triceps_brachii']] },
  { id: 'forearm', sides: [['forearm_flexors'], ['forearm_extensors']] },
  { id: 'trunkFrontBack', sides: [['rectus_abdominis', 'external_oblique', 'internal_oblique'], ['erector_spinae', 'multifidus']] },
  {
    id: 'hipFlexExtend',
    sides: [
      ['iliopsoas', 'rectus_femoris', 'tensor_fasciae_latae', 'sartorius'],
      ['gluteus_maximus', 'biceps_femoris_long', 'semitendinosus', 'semimembranosus'],
    ],
  },
  {
    id: 'hipAbductAdduct',
    sides: [
      ['gluteus_medius', 'gluteus_minimus', 'tensor_fasciae_latae'],
      ['adductors', 'gracilis', 'pectineus'],
    ],
  },
  {
    id: 'thighFrontBack',
    sides: [['quadriceps_femoris'], ['biceps_femoris', 'semitendinosus', 'semimembranosus']],
  },
  { id: 'lowerLeg', sides: [['tibialis_anterior', 'extensor_digitorum_longus'], ['triceps_surae']] },
];

// Share of one set for a muscle: 1 for primary, 0.5 for secondary muscles.
function muscleShare(exercise, id) {
  if (exercise.muscles.primary.includes(id)) return 1;
  return exercise.muscles.secondary.includes(id) ? 0.5 : 0;
}

// Library entries of the plan with their working sets per week.
function weeklyEntries(plan) {
  const factor = weeklyDayFactor(plan);
  return plan.days.flatMap(day =>
    day.entries
      .map(entry => ({
        exercise: entry.exerciseId && libraryExercise(entry.exerciseId),
        sets: entry.sets.filter(set => set.type === 'working').length * factor,
      }))
      .filter(item => item.exercise && countsForMuscleLoad(item.exercise.category))
  );
}

// Effective working sets per week for a set of muscles taken together (e.g. a
// whole muscle with its heads, or one side of a balance pair). A set counts once
// with the highest share among those muscles, never once per head: a bench press
// set is half a set for the triceps, not one and a half.
export function weeklySetsFor(plan, ids) {
  const muscles = [...new Set(ids.flatMap(expand))];
  return weeklyEntries(plan).reduce(
    (total, { exercise, sets }) => total + sets * Math.max(0, ...muscles.map(id => muscleShare(exercise, id))),
    0
  );
}

// Effective working sets per single muscle and week. Own exercises have no
// muscle data and only count for their muscle group.
export function weeklySetsPerMuscle(plan) {
  const totals = {};
  for (const { exercise, sets } of weeklyEntries(plan)) {
    for (const id of new Set([...exercise.muscles.primary, ...exercise.muscles.secondary])) {
      totals[id] = (totals[id] ?? 0) + sets * muscleShare(exercise, id);
    }
  }
  return totals;
}

// Everything the plan editor shows about a plan: sets per group, sets per
// muscle, and hints on gaps and imbalances. Hints are orientation, not rules.
export function analyzePlan(plan) {
  const groups = weeklySetsByMuscle(plan);
  const perMuscle = weeklySetsPerMuscle(plan);
  const muscles = DETAIL_MUSCLES.map(id => ({
    id,
    group: MUSCLES[id].group,
    isDeep: MUSCLES[id].view === 'deep',
    sets: perMuscle[id] ?? 0,
  }));
  const hints = [];
  // Plans without strength work (e.g. pure mobility) get no hints on muscle volume.
  const hasEntries = plan.days.some(day => day.entries.some(entryCountsForMuscleLoad));
  if (!hasEntries) return { groups, muscles, hints };

  const setsOfGroup = group => groups.find(item => item.muscle === group)?.sets ?? 0;
  for (const group of MUSCLE_GROUP_NAMES) {
    const sets = setsOfGroup(group);
    if (sets === 0) hints.push({ type: 'groupMissing', group, muscles: [] });
    else if (sets < GUIDELINE_SETS) hints.push({ type: 'groupLow', group, sets, muscles: [] });
    else if (sets > HIGH_SETS) hints.push({ type: 'groupHigh', group, sets, muscles: [] });
  }

  // Single muscles of trained groups that get no sets at all, e.g. the obliques
  // in a plan that only has crunches. Deep muscles stay out of the hints: they
  // are hard to target on their own and would make the list long.
  for (const group of MUSCLE_GROUP_NAMES) {
    if (setsOfGroup(group) === 0) continue;
    const untrained = muscles.filter(muscle => muscle.group === group && muscle.sets === 0 && !muscle.isDeep);
    if (untrained.length > 0) {
      hints.push({ type: 'musclesUntrained', group, muscles: untrained.map(muscle => muscle.id) });
    }
  }

  for (const pair of BALANCE_PAIRS) {
    const [first, second] = pair.sides.map(side => weeklySetsFor(plan, side));
    const larger = Math.max(first, second);
    const smaller = Math.min(first, second);
    if (larger >= IMBALANCE_MIN_SETS && smaller < larger * IMBALANCE_RATIO) {
      const weakSide = pair.sides[first < second ? 0 : 1];
      hints.push({
        type: 'imbalance',
        pair: pair.id,
        weakSide: first < second ? 0 : 1,
        sets: [first, second],
        muscles: [...new Set(weakSide.flatMap(expand))].filter(id => DETAIL_MUSCLES.includes(id)),
      });
    }
  }

  return { groups, muscles, hints };
}
