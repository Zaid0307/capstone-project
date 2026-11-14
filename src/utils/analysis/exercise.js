import { groupBySession, isCountable } from './setRows';
import { RECORD_TYPES } from './records';
import { estimateOneRepMax } from './strength';

// Numbers of one exercise for its detail page (docs/ux/03-analysen-und-architektur.md, 4.4).

const sideOrder = side => (side === null ? 0 : side === 'left' ? 1 : 2);

// The current best per record type (3.4) and side, with the first date it was
// reached: [{ type, side, value, date, workoutId }], in the order of RECORD_TYPES.
// Unlike personalRecords, the first session counts too (it is the best so far).
export function exerciseBests(rows, exerciseKey) {
  const usable = rows.filter(row => row.exerciseKey === exerciseKey && isCountable(row));
  const sorted = usable.every((row, index) => index === 0 || usable[index - 1].date <= row.date)
    ? usable
    : [...usable].sort((a, b) => a.date.localeCompare(b.date));
  const bests = new Map();
  const raise = (type, side, value, row) => {
    if (value === null || value === undefined || !(value > 0)) return;
    const key = `${type}|${side}`;
    const current = bests.get(key);
    if (!current || value > current.value) bests.set(key, { type, side, value, date: row.date, workoutId: row.workoutId });
  };
  for (const session of groupBySession(sorted)) {
    let sessionVolume = 0;
    for (const row of session.rows) {
      if (row.weight > 0 && row.reps >= 1) {
        raise('heaviestWeight', row.side, row.weight, row);
        raise('bestE1rm', row.side, estimateOneRepMax(row.weight, row.reps), row);
        raise('bestSetVolume', row.side, row.weight * row.reps, row);
        sessionVolume += row.weight * row.reps;
      } else if (row.reps >= 1) {
        raise('mostReps', row.side, row.reps, row);
      }
      if (row.seconds > 0) raise('longestHold', row.side, row.seconds, row);
    }
    raise('bestSessionVolume', session.side, sessionVolume, session.rows[0]);
  }
  return [...bests.values()].sort(
    (a, b) => RECORD_TYPES.indexOf(a.type) - RECORD_TYPES.indexOf(b.type) || sideOrder(a.side) - sideOrder(b.side)
  );
}

// The value of a metric for a session from sessionBest:
// 'e1rm' | 'weight' (top set weight) | 'volume' | 'reps' | 'seconds' (longest hold).
export function sessionMetric(session, metric) {
  switch (metric) {
    case 'e1rm':
      return session.e1rm;
    case 'weight':
      return session.topSet?.weight > 0 ? session.topSet.weight : null;
    case 'volume':
      return session.volume;
    case 'reps':
      return session.reps;
    case 'seconds':
      return session.seconds;
    default:
      return null;
  }
}

// Change from the first to the last value: { first, last, difference, percent } or null.
export function firstToLast(values) {
  const known = values.filter(value => value !== null && value !== undefined);
  if (known.length < 2) return null;
  const first = known[0];
  const last = known[known.length - 1];
  return { first, last, difference: last - first, percent: first > 0 ? (last - first) / first : null };
}
