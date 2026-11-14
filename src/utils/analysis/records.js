import { groupBySession, isCountable } from './setRows';
import { MAX_E1RM_REPS, estimateOneRepMax } from './strength';

// Personal records and set records (docs/ux/03-analysen-und-architektur.md, 3.4).
// Never stored: always recomputed from all rows, so deleting or changing a workout
// changes the records. Computed chronologically per exercise and – for per-side
// exercises – per side, over countable working sets, without range filter
// (recordsInRange then picks the records that were set in a range).
//
// A record is set when a value is truly greater than every earlier value (a tie is
// none). The first session of an exercise only sets starting values.
// Choice: the same holds per type – the first session that has a value of a type
// (e.g. the first weighted set after bodyweight sessions) sets its starting value.

export const RECORD_TYPES = ['heaviestWeight', 'bestE1rm', 'bestSetVolume', 'bestSessionVolume', 'mostReps', 'longestHold'];

const hasWeight = row => row.weight > 0;

function sessionValues(rows) {
  const values = {};
  const raise = (type, value) => {
    if (value !== null && value !== undefined && !(values[type] >= value)) values[type] = value;
  };
  let sessionVolume = null;
  for (const row of rows) {
    if (hasWeight(row) && row.reps >= 1) {
      raise('heaviestWeight', row.weight);
      raise('bestE1rm', estimateOneRepMax(row.weight, row.reps));
      raise('bestSetVolume', row.weight * row.reps);
      sessionVolume = (sessionVolume ?? 0) + row.weight * row.reps;
    }
    if (!hasWeight(row) && row.reps >= 1) raise('mostReps', row.reps);
    if (row.seconds > 0) raise('longestHold', row.seconds);
  }
  raise('bestSessionVolume', sessionVolume);
  return values;
}

// Rows grouped into sessions (workout + exercise + side), oldest first. Rows of the
// same date keep their order.
function sessionsOf(rows) {
  let countable = rows.filter(row => isCountable(row));
  // Rows usually come in date order already; sorting only when needed saves time.
  const sorted = countable.every((row, index) => index === 0 || countable[index - 1].date <= row.date);
  if (!sorted) {
    countable = countable
      .map((row, index) => ({ row, index }))
      .sort((a, b) => (a.row.date < b.row.date ? -1 : a.row.date > b.row.date ? 1 : a.index - b.index))
      .map(item => item.row);
  }
  return groupBySession(countable);
}

// All records, oldest first: { exerciseKey, side, type, value, previous, date, workoutId }.
export function personalRecords(rows) {
  const bests = new Map();
  const records = [];
  for (const session of sessionsOf(rows)) {
    const trackKey = `${session.exerciseKey}|${session.side}`;
    const best = bests.get(trackKey) ?? {};
    for (const [type, value] of Object.entries(sessionValues(session.rows))) {
      const previous = best[type];
      if (previous !== undefined && value > previous) {
        records.push({ exerciseKey: session.exerciseKey, side: session.side, type, value, previous, date: session.date, workoutId: session.workoutId });
      }
      if (previous === undefined || value > previous) best[type] = value;
    }
    bests.set(trackKey, best);
  }
  return records;
}

// Records set within [from, to] (records are computed over all time first).
export const recordsInRange = (records, { from, to }) =>
  records.filter(record => (!from || record.date >= from) && (!to || record.date <= to));

// Set records: for each repetition count 1–12 (exact count) the heaviest weight,
// with the first date it was lifted. Per side for per-side exercises.
// Returns [{ reps, side, weight, date, workoutId }] sorted by side, then reps.
export function repRecords(rows, exerciseKey) {
  const best = new Map();
  const ordered = sessionsOf(rows.filter(row => row.exerciseKey === exerciseKey)).flatMap(session => session.rows);
  for (const row of ordered) {
    if (!hasWeight(row) || !(row.reps >= 1) || row.reps > MAX_E1RM_REPS || !Number.isInteger(row.reps)) continue;
    const key = `${row.side}|${row.reps}`;
    const current = best.get(key);
    if (!current || row.weight > current.weight) {
      best.set(key, { reps: row.reps, side: row.side, weight: row.weight, date: row.date, workoutId: row.workoutId });
    }
  }
  const sideOrder = side => (side === null ? 0 : side === 'left' ? 1 : 2);
  return [...best.values()].sort((a, b) => sideOrder(a.side) - sideOrder(b.side) || a.reps - b.reps);
}
