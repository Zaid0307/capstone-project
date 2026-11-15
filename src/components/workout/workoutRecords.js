import { exerciseKeyOf, toSetRows } from '../../utils/analysis/setRows';
import { personalRecords } from '../../utils/analysis/records';

// Record types shown after a training (02-tagebuch 3.3): heaviest weight, best
// estimated maximum (Epley), most repetitions without weight and longest hold.
export const SUMMARY_RECORD_TYPES = ['heaviestWeight', 'bestE1rm', 'mostReps', 'longestHold'];

const byDateThenCreated = (a, b) => a.date.localeCompare(b.date) || (a.createdAt ?? '').localeCompare(b.createdAt ?? '');

// New personal records set in this workout, compared with all earlier workouts:
// [{ exercise (the logged exercise), side, type, value, previous }].
export function newRecordsOf(workout, workouts) {
  const history = [...workouts.filter(item => item.id !== workout.id), workout].sort(byDateThenCreated);
  return personalRecords(toSetRows(history))
    .filter(record => record.workoutId === workout.id && SUMMARY_RECORD_TYPES.includes(record.type))
    .map(({ exerciseKey, side, type, value, previous }) => ({
      exercise: workout.exercises.find(item => exerciseKeyOf(item) === exerciseKey) ?? null,
      side,
      type,
      value,
      previous,
    }))
    .filter(record => record.exercise);
}
