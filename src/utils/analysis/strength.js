import { groupBySession, isCountable, isFirstRowOfSet } from './setRows';

// Strength numbers (docs/ux/03-analysen-und-architektur.md, 3.2 and 3.4).
// Volume and repetitions add both sides of a per-side set; e1RM and session bests
// are kept per side (side null for normal sets).

export const MAX_E1RM_REPS = 12;

// Epley: w × (1 + r / 30) for 1 ≤ r ≤ 12 and w > 0; r = 1 gives w. Above 12
// repetitions or without weight there is no estimate (null). Not rounded.
export function estimateOneRepMax(weight, reps) {
  if (!(weight > 0) || !(reps >= 1) || reps > MAX_E1RM_REPS) return null;
  return reps === 1 ? weight : weight * (1 + reps / 30);
}

// For display: rounded to 0.5 kg.
export const roundToHalf = value => (value === null || value === undefined ? null : Math.round(value * 2) / 2);

// Σ weight × reps over countable sets (sides added). Empty weight counts 0.
export function volume(rows, { warmups = false } = {}) {
  let total = 0;
  for (const row of rows) if (isCountable(row, { warmups })) total += (row.weight ?? 0) * (row.reps ?? 0);
  return total;
}

// Σ reps over countable sets (sides added).
export function totalReps(rows, { warmups = false } = {}) {
  let total = 0;
  for (const row of rows) if (isCountable(row, { warmups })) total += row.reps ?? 0;
  return total;
}

// Countable sets, a per-side set counting once.
export function countSets(rows, { warmups = false } = {}) {
  let total = 0;
  for (const row of rows) if (isFirstRowOfSet(row) && isCountable(row, { warmups })) total += 1;
  return total;
}

// The heavier set; at the same weight the one with more repetitions (top set, 3.4).
const isHeavier = (row, best) =>
  !best || (row.weight ?? 0) > (best.weight ?? 0) || ((row.weight ?? 0) === (best.weight ?? 0) && (row.reps ?? 0) > (best.reps ?? 0));

// One entry per workout, exercise and side with the best numbers of that session,
// in the order of the rows (oldest first when the workouts are sorted by date):
// { workoutId, date, exerciseKey, side, e1rm, topSet: { weight, reps }, volume, reps, seconds, sets }
// e1rm is the maximum over the countable working sets (null if none qualifies).
// Warm-up sets never count here. A side row without own values is left out.
export function sessionBest(rows) {
  const usable = rows.filter(row => isCountable(row) && (row.reps !== null || row.seconds !== null));
  return groupBySession(usable).map(({ rows: sessionRows, ...session }) => {
    const best = { ...session, e1rm: null, topSet: null, volume: 0, reps: 0, seconds: null, sets: sessionRows.length };
    for (const row of sessionRows) {
      const e1rm = estimateOneRepMax(row.weight, row.reps);
      if (e1rm !== null && (best.e1rm === null || e1rm > best.e1rm)) best.e1rm = e1rm;
      if (row.reps !== null && isHeavier(row, best.topSet)) best.topSet = { weight: row.weight, reps: row.reps };
      best.volume += (row.weight ?? 0) * (row.reps ?? 0);
      best.reps += row.reps ?? 0;
      if (row.seconds !== null && (best.seconds === null || row.seconds > best.seconds)) best.seconds = row.seconds;
    }
    return best;
  });
}

// Overview value of a per-side exercise: the weaker side (3.2). A missing side is
// left out, not counted as 0.
export function weakerSide(left, right) {
  const values = [left, right].filter(value => value !== null && value !== undefined);
  return values.length ? Math.min(...values) : null;
}
