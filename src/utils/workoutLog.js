import { nanoid } from 'nanoid';
import { WEEKDAYS, entryIsPerSide, entryName, libraryExercise, orderedDays } from './workoutPlan';

// Training diary (docs/konzept-plaene-training-auswertung.md, section 4 and 7.2).
// A workout is what really happened on a date. It keeps a copy of the plan's
// targets, so it can be compared with the plan even after the plan changed.
//
// workout  { id, schemaVersion, date, status, plan | null, note, exercises,
//            startedAt, finishedAt, createdAt, updatedAt }
//   status: 'done' (trained) | 'skipped' (planned training did not happen)
//   startedAt, finishedAt: ISO times or null. A 'done' workout with startedAt and
//            without finishedAt is running (docs/ux/02-tagebuch.md, 3.1 and 5).
//   plan:   { planId, planName, dayId, dayName, weekday | null }
// exercise { id, exerciseId | null, exercise, muscle, plannedEntryId | null, plannedWorkingSets, skipped, restSeconds, perSide, sets }
//   plannedWorkingSets: working sets the plan asked for; stays when sets are removed
// set      { id, type, planned | null, weight, reps, seconds, completedAt, sides? }
//   completedAt: ISO time when the set first got repetitions or seconds, or null
//   planned: the target of the plan for this set ({ dose, weight, rirTarget }) or null if added
//   sides:   only for exercises done per side: { left: values, right: values },
//            values = { weight, reps, seconds }; weight/reps/seconds of the set stay null
// A set counts as done as soon as repetitions or seconds are entered.
export const WORKOUT_SCHEMA_VERSION = 2;

// Reads workouts of older versions (done when reading, like migratePlan); nothing
// is lost. Version 1 had no times: a done workout counts as finished (finishedAt =
// its last change), startedAt stays null because no start time is invented.
export function migrateWorkout(workout) {
  if (!workout || (workout.schemaVersion ?? 1) >= WORKOUT_SCHEMA_VERSION) return workout;
  return {
    ...workout,
    schemaVersion: WORKOUT_SCHEMA_VERSION,
    startedAt: workout.startedAt ?? null,
    finishedAt:
      workout.finishedAt ?? (workout.status === 'done' ? workout.updatedAt ?? workout.createdAt ?? null : null),
    exercises: (workout.exercises ?? []).map(exercise => ({
      ...exercise,
      sets: (exercise.sets ?? []).map(set => ({ ...set, completedAt: set.completedAt ?? null })),
    })),
  };
}

export const SIDES = ['left', 'right'];

const pad = number => String(number).padStart(2, '0');

// The local calendar date, e.g. '2026-11-13'.
export function toDateKey(date = new Date()) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function weekdayOf(dateKey) {
  const [year, month, day] = dateKey.split('-').map(Number);
  // getDay(): 0 = Sunday … 6 = Saturday; WEEKDAYS starts with Monday.
  return WEEKDAYS[(new Date(year, month - 1, day).getDay() + 6) % 7];
}

const now = () => new Date().toISOString();
const emptyValues = (weight = null) => ({ weight, reps: null, seconds: null });
const hasAmount = values => values.reps !== null || values.seconds !== null;

// The values of a set: one entry, or one per side.
export const setValues = set => (set.sides ? SIDES.map(side => set.sides[side] ?? emptyValues()) : [set]);

export const isSetDone = set => setValues(set).some(hasAmount);

// A training that was started and not finished yet.
export const isWorkoutRunning = workout =>
  workout.status === 'done' && Boolean(workout.startedAt) && !workout.finishedAt;

// A started training counts only once at least one set is done (02-tagebuch 5).
export const hasDoneSets = workout =>
  workout.exercises.some(exercise => !exercise.skipped && exercise.sets.some(isSetDone));

export const countsAsTraining = workout => workout.status === 'done' && hasDoneSets(workout);

// The running training, if there is one (the newest, should there be several).
export function runningWorkout(workouts) {
  return (
    workouts
      .filter(isWorkoutRunning)
      .sort((a, b) => b.startedAt.localeCompare(a.startedAt))[0] ?? null
  );
}

// Milliseconds from start to end (or to `now` while running); null without start.
export function workoutDuration(workout, nowTime = Date.now()) {
  if (!workout.startedAt) return null;
  const end = workout.finishedAt ? Date.parse(workout.finishedAt) : nowTime;
  return Math.max(0, end - Date.parse(workout.startedAt));
}

// Sets and done sets of the whole training (skipped exercises left out), for the
// progress line "3 of 12 sets".
export function workoutProgress(workout) {
  const sets = workout.exercises.filter(exercise => !exercise.skipped).flatMap(exercise => exercise.sets);
  return { done: sets.filter(isSetDone).length, total: sets.length };
}

function planReference(plan, day) {
  return {
    planId: plan.id,
    planName: plan.nameOfWorkout,
    dayId: day.id,
    dayName: day.name,
    weekday: plan.schedule?.type === 'rotation' ? null : day.weekday ?? null,
  };
}

// The newest logged exercise for the same exercise (library id or own name).
export function lastLoggedExercise(workouts, { exerciseId, exercise }) {
  const sameExercise = item =>
    exerciseId ? item.exerciseId === exerciseId : !item.exerciseId && item.exercise === exercise;
  return (
    [...workouts]
      .filter(workout => workout.status === 'done')
      .sort((a, b) => b.date.localeCompare(a.date) || b.updatedAt.localeCompare(a.updatedAt))
      .flatMap(workout => workout.exercises)
      .find(item => !item.skipped && sameExercise(item) && item.sets.some(isSetDone)) ?? null
  );
}

// How much to add once the top of the range is reached: 2.5 kg on barbells and
// machines, 2 kg on dumbbells (the next pair is usually 2 kg heavier).
export function weightStep(exerciseId) {
  const equipment = libraryExercise(exerciseId)?.equipment ?? [];
  return equipment.includes('dumbbells') && !equipment.includes('barbell') ? 2 : 2.5;
}

// The same exercise in the latest finished workout before this one, for
// "Last time" and the suggestion to add weight (double progression: every
// working set reached the top of its rep range with weight → add a step).
export function previousPerformance(workouts, workout, exercise) {
  const earlier = workouts.filter(
    item =>
      item.id !== workout.id &&
      (item.date < workout.date || (item.date === workout.date && (item.createdAt ?? '') < (workout.createdAt ?? '')))
  );
  const last = lastLoggedExercise(earlier, exercise);
  if (!last) return null;
  const date = earlier.find(item => item.exercises.includes(last))?.date ?? null;
  const sets = last.sets.filter(set => set.type === 'working' && isSetDone(set));
  const ranged = last.sets.filter(set => set.type === 'working' && set.planned?.dose.unit === 'repetitions');
  const reachedTop =
    ranged.length > 0 &&
    ranged.every(set =>
      setValues(set).every(values => (values.weight ?? 0) > 0 && (values.reps ?? 0) >= set.planned.dose.max)
    );
  const heaviest = Math.max(0, ...sets.flatMap(set => setValues(set).map(values => values.weight ?? 0)));
  return {
    date,
    perSide: Boolean(last.perSide),
    sets: sets.map(set => (set.sides ? { left: set.sides.left, right: set.sides.right } : { weight: set.weight, reps: set.reps, seconds: set.seconds })),
    suggestion: reachedTop ? { from: heaviest, to: heaviest + weightStep(last.exerciseId) } : null,
  };
}

function newSet({ type = 'working', planned = null, perSide = false, weight = null, sideWeights = {} } = {}) {
  return {
    id: nanoid(),
    type,
    planned,
    completedAt: null,
    ...emptyValues(perSide ? null : weight),
    ...(perSide
      ? { sides: { left: emptyValues(sideWeights.left ?? weight), right: emptyValues(sideWeights.right ?? weight) } }
      : {}),
  };
}

// A logged exercise from a plan entry. Weights start with the last weight used
// for this exercise, else with the plan's weight; repetitions are left to enter.
export function exerciseFromEntry(entry, previous = null) {
  const perSide = entryIsPerSide(entry);
  const doneBefore = previous?.sets.filter(isSetDone) ?? [];
  const weightAt = (index, side) => {
    const set = doneBefore[index] ?? doneBefore[doneBefore.length - 1];
    if (!set) return undefined;
    return side ? set.sides?.[side]?.weight ?? set.weight : set.weight ?? set.sides?.left?.weight;
  };
  return {
    id: nanoid(),
    exerciseId: entry.exerciseId,
    exercise: entry.exercise,
    muscle: entry.muscle,
    plannedEntryId: entry.id,
    plannedWorkingSets: entry.sets.filter(target => target.type === 'working').length,
    skipped: false,
    restSeconds: entry.restSeconds ?? null,
    perSide,
    sets: entry.sets.map((target, index) =>
      newSet({
        type: target.type,
        planned: { dose: { ...target.dose }, weight: target.weight, rirTarget: target.rirTarget },
        perSide,
        weight: weightAt(index) ?? target.weight ?? null,
        sideWeights: { left: weightAt(index, 'left'), right: weightAt(index, 'right') },
      })
    ),
  };
}

// An exercise added during training, without plan targets.
export function extraExercise(entry) {
  const perSide = entryIsPerSide(entry);
  return {
    ...exerciseFromEntry(entry),
    plannedEntryId: null,
    plannedWorkingSets: 0,
    sets: entry.sets.map(() => newSet({ perSide })),
  };
}

function baseWorkout(date, status, plan, note = '') {
  const timestamp = now();
  return {
    id: nanoid(),
    schemaVersion: WORKOUT_SCHEMA_VERSION,
    date,
    status,
    plan,
    note,
    exercises: [],
    // A skipped training never runs; a started one runs until it is finished.
    startedAt: status === 'done' ? timestamp : null,
    finishedAt: null,
    createdAt: timestamp,
    updatedAt: timestamp,
  };
}

export function createWorkoutFromPlan(plan, day, date, workouts = []) {
  return {
    ...baseWorkout(date, 'done', planReference(plan, day)),
    exercises: day.entries.map(entry => exerciseFromEntry(entry, lastLoggedExercise(workouts, entry))),
  };
}

// A planned training that did not happen, e.g. because of illness.
export const createSkippedWorkout = (plan, day, date, note = '') =>
  baseWorkout(date, 'skipped', planReference(plan, day), note);

export const createFreeWorkout = date => baseWorkout(date, 'done', null);

// The plan day that fits a date: on weekday plans the day of that weekday, on
// rotation plans the day after the last one trained (or skipped).
export function suggestDay(plan, date, workouts = []) {
  const days = orderedDays(plan);
  if (days.length === 0) return null;
  if (plan.schedule?.type !== 'rotation') {
    return days.find(day => day.weekday === weekdayOf(date)) ?? days[0];
  }
  const last = [...workouts]
    .filter(workout => workout.plan?.planId === plan.id && workout.date <= date)
    .sort((a, b) => b.date.localeCompare(a.date) || b.createdAt.localeCompare(a.createdAt))[0];
  const index = days.findIndex(day => day.id === last?.plan.dayId);
  // A missed day comes again, so a rotation does not lose e.g. its leg day.
  if (last?.status === 'skipped' && index >= 0) return days[index];
  return days[(index + 1) % days.length];
}

// A training of a weekday plan done on another weekday counts as moved.
export function isMoved(workout) {
  return Boolean(workout.plan?.weekday) && workout.plan.weekday !== weekdayOf(workout.date);
}

// Within 5 % of the planned weight counts as done (concept 6.2). Per side,
// both sides have to reach the target.
export function meetsTarget(set) {
  if (!set.planned) return false;
  const { dose, weight } = set.planned;
  return setValues(set).every(values => {
    const amountOk =
      dose.unit === 'seconds' ? (values.seconds ?? 0) >= dose.value : (values.reps ?? 0) >= dose.min;
    const weightOk = weight === null || weight === undefined || (values.weight ?? 0) >= weight * 0.95;
    return amountOk && weightOk;
  });
}

const volumeOf = set => setValues(set).reduce((total, values) => total + (values.weight ?? 0) * (values.reps ?? 0), 0);
// Repetitions without added weight (push-ups, pull-ups …) and hold times: kg × reps
// would show 0 for them, so they get their own numbers.
const bodyweightRepsOf = set =>
  setValues(set).reduce((total, values) => total + (values.weight ? 0 : values.reps ?? 0), 0);
const secondsOf = set => setValues(set).reduce((total, values) => total + (values.seconds ?? 0), 0);

// Key numbers of one workout: planned and done working sets, volume (kg × reps),
// repetitions without added weight, hold time in seconds and how much of the plan
// was followed (0 to 1, null without plan targets).
export function workoutSummary(workout) {
  const working = workout.exercises
    .filter(exercise => !exercise.skipped)
    .flatMap(exercise => exercise.sets)
    .filter(set => set.type === 'working');
  // Counted from the plan, so removing a planned set lowers the adherence.
  const plannedSets = workout.exercises.reduce(
    (total, exercise) =>
      total +
      (exercise.plannedWorkingSets ??
        exercise.sets.filter(set => set.type === 'working' && set.planned).length),
    0
  );
  const done = working.filter(isSetDone);
  return {
    plannedSets,
    doneSets: done.length,
    volume: done.reduce((total, set) => total + volumeOf(set), 0),
    bodyweightReps: done.reduce((total, set) => total + bodyweightRepsOf(set), 0),
    seconds: done.reduce((total, set) => total + secondsOf(set), 0),
    adherence: plannedSets ? working.filter(meetsTarget).length / plannedSets : null,
  };
}

// Workouts of the chosen plans; an empty choice means all workouts.
export function filterWorkoutsByPlans(workouts, planIds) {
  if (!planIds.length) return workouts;
  return workouts.filter(workout => planIds.includes(workout.plan?.planId ?? 'free'));
}

// Changes ---------------------------------------------------------------------
// Like plan editing: each function returns a new workout.

const touch = workout => ({ ...workout, updatedAt: now() });

const mapExercise = (workout, exerciseId, change) =>
  touch({
    ...workout,
    exercises: workout.exercises.map(item => (item.id === exerciseId ? change(item) : item)),
  });

const mapSet = (workout, exerciseId, setId, change) =>
  mapExercise(workout, exerciseId, exercise => ({
    ...exercise,
    sets: exercise.sets.map(set => (set.id === setId ? change(set) : set)),
  }));

export function updateWorkout(workout, changes) {
  return touch({ ...workout, ...changes });
}

// Keeps the time a set first became done; later changes do not move it.
const withCompletedAt = set =>
  set.completedAt || !isSetDone(set) ? set : { ...set, completedAt: now() };

export function updateLoggedSet(workout, exerciseId, setId, changes) {
  return mapSet(workout, exerciseId, setId, set => withCompletedAt({ ...set, ...changes }));
}

export function updateLoggedSide(workout, exerciseId, setId, side, changes) {
  return mapSet(workout, exerciseId, setId, set =>
    withCompletedAt({
      ...set,
      sides: { ...set.sides, [side]: { ...set.sides[side], ...changes } },
    })
  );
}

// Ends a running training; an already finished one keeps its end time.
export function finishWorkout(workout) {
  return workout.finishedAt ? workout : touch({ ...workout, finishedAt: now() });
}

// What differs from the plan: skipped planned exercises and planned working sets
// that are missing or not done. [{ exerciseId, type: 'skipped' | 'missingSets', count }]
export function workoutDeviations(workout) {
  return workout.exercises.flatMap(exercise => {
    if (exercise.plannedEntryId === null || exercise.plannedEntryId === undefined) return [];
    if (exercise.skipped) return [{ exerciseId: exercise.id, type: 'skipped', count: 0 }];
    const planned =
      exercise.plannedWorkingSets ?? exercise.sets.filter(set => set.type === 'working' && set.planned).length;
    const done = exercise.sets.filter(set => set.type === 'working' && isSetDone(set)).length;
    return done < planned ? [{ exerciseId: exercise.id, type: 'missingSets', count: planned - done }] : [];
  });
}

export function addLoggedSet(workout, exerciseId) {
  return mapExercise(workout, exerciseId, exercise => {
    const last = exercise.sets[exercise.sets.length - 1];
    const set = newSet({
      perSide: exercise.perSide,
      weight: last?.weight ?? null,
      sideWeights: { left: last?.sides?.left.weight, right: last?.sides?.right.weight },
    });
    return { ...exercise, sets: [...exercise.sets, set] };
  });
}

// Puts a set back at its old position, e.g. when a removal is undone.
export function insertLoggedSet(workout, exerciseId, set, index) {
  return mapExercise(workout, exerciseId, exercise => {
    const sets = [...exercise.sets];
    sets.splice(Math.min(index, sets.length), 0, set);
    return { ...exercise, sets };
  });
}

export function removeLoggedSet(workout, exerciseId, setId) {
  return mapExercise(workout, exerciseId, exercise => ({
    ...exercise,
    sets: exercise.sets.filter(set => set.id !== setId),
  }));
}

// Switches an exercise between one entry per set and one per side. Values move
// along: one value becomes both sides, two sides become the left side's values.
export function setExercisePerSide(workout, exerciseId, perSide) {
  return mapExercise(workout, exerciseId, exercise => ({
    ...exercise,
    perSide,
    sets: exercise.sets.map(({ sides, ...set }) => {
      if (perSide) {
        const values = { weight: set.weight, reps: set.reps, seconds: set.seconds };
        return { ...set, ...emptyValues(), sides: { left: { ...values }, right: { ...values } } };
      }
      return { ...set, ...(sides?.left ?? emptyValues()) };
    }),
  }));
}

export function setExerciseSkipped(workout, exerciseId, skipped) {
  return mapExercise(workout, exerciseId, exercise => ({ ...exercise, skipped }));
}

export function addLoggedExercise(workout, exercise) {
  return touch({ ...workout, exercises: [...workout.exercises, exercise] });
}

export function insertLoggedExercise(workout, exercise, index) {
  const exercises = [...workout.exercises];
  exercises.splice(Math.min(index, exercises.length), 0, exercise);
  return touch({ ...workout, exercises });
}

export function removeLoggedExercise(workout, exerciseId) {
  return touch({ ...workout, exercises: workout.exercises.filter(item => item.id !== exerciseId) });
}

export const loggedExerciseName = (exercise, language) => entryName(exercise, language);
