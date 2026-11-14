// Small factories for the analysis tests: hand-built workouts in the shape of
// workoutLog.js, without nanoid or the clock, so tests stay readable and stable.

let counter = 0;
const nextId = prefix => `${prefix}${++counter}`;

export const repsDose = (min = 8, max = 12) => ({ unit: 'repetitions', min, max });
export const secondsDose = value => ({ unit: 'seconds', value });
export const target = (dose = repsDose(), weight = null) => ({ dose, weight, rirTarget: null });

// set({ weight, reps }) – a working set; pass planned: target(...) for plan sets.
export const set = ({ type = 'working', weight = null, reps = null, seconds = null, planned = null } = {}) => ({
  id: nextId('s'),
  type,
  planned,
  weight,
  reps,
  seconds,
});

// A per-side set: left and right values { weight, reps, seconds }.
export const sideSet = (left, right, { type = 'working', planned = null } = {}) => ({
  id: nextId('s'),
  type,
  planned,
  weight: null,
  reps: null,
  seconds: null,
  sides: {
    left: { weight: null, reps: null, seconds: null, ...left },
    right: { weight: null, reps: null, seconds: null, ...right },
  },
});

export const loggedExercise = ({ exerciseId = null, exercise = '', muscle = '', skipped = false, sets = [], plannedWorkingSets } = {}) => ({
  id: nextId('e'),
  exerciseId,
  exercise,
  muscle,
  plannedEntryId: null,
  plannedWorkingSets:
    plannedWorkingSets ?? sets.filter(item => item.type === 'working' && item.planned).length,
  skipped,
  restSeconds: null,
  perSide: sets.some(item => item.sides),
  sets,
});

// plan: { planId, dayId, weekday? } or null for a free workout.
export const makeWorkout = ({ id, date, status = 'done', plan = null, exercises = [], kind } = {}) => ({
  id: id ?? nextId('w'),
  schemaVersion: 1,
  date,
  status,
  plan: plan && { planName: plan.planId, dayName: plan.dayId, weekday: null, ...plan },
  note: '',
  exercises,
  createdAt: `${date}T10:00:00.000Z`,
  updatedAt: `${date}T10:00:00.000Z`,
  ...(kind ? { kind } : {}),
});

// A minimal plan: days [{ id, weekday }], schedule fields optional.
export const makePlan = ({ id = nextId('p'), type = 'weekdays', days = [], ...rest } = {}) => ({
  id,
  schemaVersion: 3,
  nameOfWorkout: id,
  description: '',
  schedule: { type, ...rest.schedule },
  days: days.map(day => ({ name: day.id, weekday: null, entries: [], ...day })),
  ...Object.fromEntries(Object.entries(rest).filter(([key]) => key !== 'schedule')),
});
