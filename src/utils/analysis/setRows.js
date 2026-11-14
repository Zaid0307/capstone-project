import { SIDES, isSetDone, meetsTarget } from '../workoutLog';
import { libraryExercise } from '../workoutPlan';
import { monthKeyOf, weekKeyOf } from './dates';
import { workoutStatus } from './adherence';

// The flat set list every analysis is computed from
// (docs/ux/03-analysen-und-architektur.md, 1.5 and 3.1–3.2).
//
// SetRow {
//   workoutId, date, weekKey ('2026-W46'), monthKey ('2026-11'),
//   planId | 'free', dayId | null, workoutStatus ('done' | 'skipped'),
//   trainingStatus ('onPlan' | 'deviated' | 'other' | 'skipped'),
//   exerciseRowId, exerciseKey, exerciseId | null, category | null, groupOfEntry,
//   skipped (exercise skipped), perSide,
//   setIndex, type ('working' | 'warmup'), done (isSetDone of the whole set),
//   side: null | 'left' | 'right',          – one row per side, same setIndex
//   weight, reps, seconds,                    – values of this row (this side)
//   planned: { dose, weight, rirTarget } | null, meetsTarget
// }
//
// trainingStatus is not in the spec's row list; it is added so the status filter
// (3.9) can work on rows alone.

// Database id, or 'custom:' + the lower-case, URL-encoded name for own exercises.
export function exerciseKeyOf({ exerciseId, exercise }) {
  return exerciseId || `custom:${encodeURIComponent((exercise ?? '').trim().toLowerCase())}`;
}

const categoryCache = new Map();
function categoryOf(exerciseId) {
  if (!exerciseId) return null;
  if (!categoryCache.has(exerciseId)) categoryCache.set(exerciseId, libraryExercise(exerciseId)?.category ?? null);
  return categoryCache.get(exerciseId);
}

export function toSetRows(workouts) {
  const rows = [];
  for (const workout of workouts) {
    const weekKey = weekKeyOf(workout.date);
    const monthKey = monthKeyOf(workout.date);
    const planId = workout.plan?.planId ?? 'free';
    const dayId = workout.plan?.dayId ?? null;
    const trainingStatus = workoutStatus(workout);
    for (const exercise of workout.exercises ?? []) {
      const exerciseKey = exerciseKeyOf(exercise);
      const exerciseId = exercise.exerciseId ?? null;
      const category = categoryOf(exerciseId);
      const skipped = Boolean(exercise.skipped);
      const perSide = Boolean(exercise.sets?.some(set => set.sides));
      exercise.sets.forEach((set, setIndex) => {
        // A skipped exercise stays "planned, not done" even if values were typed in.
        const done = !skipped && isSetDone(set);
        const met = !skipped && meetsTarget(set);
        // Rows are written out field by field: this runs for every set of the history.
        const row = (side, values) => ({
          workoutId: workout.id,
          date: workout.date,
          weekKey,
          monthKey,
          planId,
          dayId,
          workoutStatus: workout.status,
          trainingStatus,
          exerciseRowId: exercise.id,
          exerciseKey,
          exerciseId,
          category,
          groupOfEntry: exercise.muscle ?? null,
          skipped,
          perSide,
          setIndex,
          type: set.type ?? 'working',
          done,
          side,
          weight: values?.weight ?? null,
          reps: values?.reps ?? null,
          seconds: values?.seconds ?? null,
          planned: set.planned ?? null,
          meetsTarget: met,
        });
        if (set.sides) {
          for (const side of SIDES) rows.push(row(side, set.sides[side]));
        } else {
          rows.push(row(null, set));
        }
      });
    }
  }
  return rows;
}

// The first row of a set; per-side sets have two rows but count as one set (3.2).
export const isFirstRowOfSet = row => row.side !== 'right';

// A done working set of a not skipped exercise in a done workout (3.1). Warm-up sets
// count only when the user includes them (volume, sets, repetitions).
export const isCountable = (row, { warmups = false } = {}) =>
  row.workoutStatus === 'done' &&
  !row.skipped &&
  row.done &&
  (row.type === 'working' || (warmups && row.type === 'warmup'));

// Rows grouped by workout, exercise and side ("session"), in the order first seen:
// [{ workoutId, date, exerciseKey, side, rows }]. Nested maps instead of string
// keys, because this runs over the whole history.
export function groupBySession(rows) {
  const byWorkout = new Map();
  const sessions = [];
  for (const row of rows) {
    let byExercise = byWorkout.get(row.workoutId);
    if (!byExercise) byWorkout.set(row.workoutId, (byExercise = new Map()));
    let bySide = byExercise.get(row.exerciseKey);
    if (!bySide) byExercise.set(row.exerciseKey, (bySide = new Map()));
    let session = bySide.get(row.side);
    if (!session) {
      session = { workoutId: row.workoutId, date: row.date, exerciseKey: row.exerciseKey, side: row.side, rows: [] };
      bySide.set(row.side, session);
      sessions.push(session);
    }
    session.rows.push(row);
  }
  return sessions;
}
