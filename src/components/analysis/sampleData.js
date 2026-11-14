import { addDays } from '../../utils/analysis/dates';
import { loggedExercise, makePlan, makeWorkout, repsDose, set, sideSet, target } from '../../utils/analysis/testing';

// Sample plans and workouts for the tests of the calendar and analysis pages.
// TODAY is Friday 13 November 2026 (week 46).
export const TODAY = '2026-11-13';

const benchTarget = target(repsDose(8, 12), 60);
const entry = (id, exerciseId, sets = 3) => ({
  id,
  exerciseId,
  exercise: '',
  muscle: '',
  restSeconds: null,
  sets: Array.from({ length: sets }, () => ({ type: 'working', dose: repsDose(8, 12), weight: 60, rirTarget: null })),
});

export function samplePlans() {
  return [
    {
      ...makePlan({
        id: 'strength',
        days: [
          { id: 'mon', name: 'Day A', weekday: 'monday', entries: [entry('e1', 'barbell_bench_press'), entry('e2', 'barbell_squat')] },
          { id: 'thu', name: 'Day B', weekday: 'thursday', entries: [entry('e3', 'barbell_row')] },
        ],
        schedule: { startDate: '2026-08-01' },
      }),
      nameOfWorkout: 'Strength',
    },
    {
      ...makePlan({ id: 'mobility', days: [{ id: 'sat', name: 'Flow', weekday: 'saturday', entries: [] }], schedule: { startDate: '2026-10-01' } }),
      nameOfWorkout: 'Mobility',
    },
  ];
}

// A bench press workout of the strength plan on Monday (day A) with rising weight.
function strengthWorkout(date, weight, reps, id) {
  return makeWorkout({
    id,
    date,
    plan: { planId: 'strength', planName: 'Strength', dayId: 'mon', dayName: 'Day A', weekday: 'monday' },
    exercises: [
      loggedExercise({
        exerciseId: 'barbell_bench_press',
        exercise: 'Bench press',
        muscle: 'chest',
        sets: [set({ weight, reps, planned: benchTarget }), set({ weight, reps, planned: benchTarget }), set({ weight, reps: reps - 4, planned: benchTarget })],
      }),
    ],
  });
}

// Eight weeks of Monday workouts (2026-09-21 … 2026-11-09), a free workout with a
// per-side exercise, and a skipped Thursday with a reason.
export function sampleWorkouts() {
  const workouts = [];
  for (let week = 0; week < 8; week++) {
    const date = addDays('2026-09-21', week * 7);
    workouts.push(strengthWorkout(date, 60 + week * 2.5, 10, `bench-${week}`));
  }
  workouts.push(
    makeWorkout({
      id: 'free-1',
      date: '2026-11-11',
      exercises: [
        loggedExercise({
          exerciseId: 'bulgarian_split_squat',
          exercise: 'Split squat',
          muscle: 'legs',
          sets: [sideSet({ weight: 20, reps: 10 }, { weight: 20, reps: 8 })],
        }),
      ],
    }),
    makeWorkout({
      id: 'free-2',
      date: '2026-11-04',
      exercises: [
        loggedExercise({
          exerciseId: 'bulgarian_split_squat',
          exercise: 'Split squat',
          muscle: 'legs',
          sets: [sideSet({ weight: 17.5, reps: 10 }, { weight: 17.5, reps: 10 })],
        }),
      ],
    }),
    {
      ...makeWorkout({ id: 'skipped-1', date: '2026-11-05', status: 'skipped', plan: { planId: 'strength', planName: 'Strength', dayId: 'thu', dayName: 'Day B', weekday: 'thursday' } }),
      note: 'sick',
    }
  );
  return workouts;
}
