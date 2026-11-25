import { nanoid } from 'nanoid';
import { WEEKDAYS, dayWeekdays, entryIsPerSide, entryName, libraryExercise, orderedDays, supersetLabels } from './workoutPlan';

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
//   feeling?: "How was it?" 1–5 or null; missing in older entries (= not rated)
// exercise { id, exerciseId | null, exercise, muscle, plannedEntryId | null, plannedWorkingSets, skipped, restSeconds, perSide, sets, note? }
//   note:   optional text about this exercise in this training; missing = ''
//   groupId: superset of the plan (supersetLabels in workoutPlan.js) or null; missing = none
//   plannedWorkingSets: working sets the plan asked for; stays when sets are removed
// set      { id, type, planned | null, weight, reps, seconds, rir?, completedAt, sides? }
//   type:    'working' | 'warmup'; warm-up sets do not count as working sets
//   rir:     optional repetitions in reserve (0–4) or null; missing in older entries
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

// Choices for the optional repetitions in reserve per set.
export const RIR_CHOICES = [0, 1, 2, 3, 4];

// "How was it?" per training: 1 (bad) to 5 (very good).
export const FEELINGS = [1, 2, 3, 4, 5];

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

// Working sets and done working sets of the whole training (skipped exercises and
// warm-up sets left out), for the progress line "3 of 12 sets".
export function workoutProgress(workout) {
  const sets = workout.exercises
    .filter(exercise => !exercise.skipped)
    .flatMap(exercise => exercise.sets)
    .filter(set => set.type !== 'warmup');
  return { done: sets.filter(isSetDone).length, total: sets.length };
}

// Planned working sets of exercises not skipped that have no values yet; finishing
// asks first while there are some (02-tagebuch 3.3).
export const openPlannedSets = workout =>
  workout.exercises
    .filter(exercise => !exercise.skipped)
    .flatMap(exercise => exercise.sets)
    .filter(set => set.type === 'working' && set.planned && !isSetDone(set)).length;

// weekdays: all weekdays the day is planned on (plan model 4); weekday: the one
// this training belongs to – the date's weekday if planned then, else the first.
function planReference(plan, day, date) {
  const weekdays = plan.schedule?.type === 'rotation' ? [] : dayWeekdays(day);
  const own = date && weekdays.includes(weekdayOf(date)) ? weekdayOf(date) : weekdays[0] ?? null;
  return {
    planId: plan.id,
    planName: plan.nameOfWorkout,
    dayId: day.id,
    dayName: day.name,
    weekday: own,
    weekdays,
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
  // A set at the top of the range with no reps left in reserve (RIR 0) was a grind:
  // stay at the weight. Without an RIR entry only the repetitions decide.
  const reachedTop =
    ranged.length > 0 &&
    ranged.every(
      set =>
        (set.rir === null || set.rir === undefined || set.rir >= 1) &&
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

// Suggested values for the open sets (E48) -----------------------------------
// Open sets show suggestions in their fields; they are not stored and do not
// count as done until the user changes a field or takes the suggestion over.

const roundTo1 = value => Math.round(value * 10) / 10;
const mean = numbers => (numbers.length ? roundTo1(numbers.reduce((a, b) => a + b, 0) / numbers.length) : null);
const workingDone = exercise => exercise.sets.filter(set => set.type === 'working' && isSetDone(set));
const plainValues = values => ({ weight: values?.weight ?? null, reps: values?.reps ?? null, seconds: values?.seconds ?? null });
const positionValues = set =>
  set.sides ? { left: plainValues(set.sides.left), right: plainValues(set.sides.right) } : plainValues(set);

// The same exercise in finished trainings before this one, newest first.
function earlierSessions(workouts, workout, { exerciseId, exercise }) {
  const sameExercise = item =>
    exerciseId ? item.exerciseId === exerciseId : !item.exerciseId && item.exercise === exercise;
  return workouts
    .filter(
      item =>
        item.id !== workout.id &&
        item.status === 'done' &&
        (item.date < workout.date || (item.date === workout.date && (item.createdAt ?? '') < (workout.createdAt ?? '')))
    )
    .sort((a, b) => b.date.localeCompare(a.date) || (b.updatedAt ?? '').localeCompare(a.updatedAt ?? ''))
    .flatMap(item =>
      item.exercises
        .filter(logged => !logged.skipped && sameExercise(logged) && workingDone(logged).length > 0)
        .map(logged => ({ date: item.date, exercise: logged }))
    );
}

function averageOf(valuesList) {
  return {
    weight: mean(valuesList.map(values => values.weight).filter(value => value !== null && value > 0)),
    reps: mean(valuesList.map(values => values.reps).filter(value => value !== null)),
    seconds: mean(valuesList.map(values => values.seconds).filter(value => value !== null)),
  };
}

// Average weight and repetitions (or seconds) per working-set position over the
// last `sessions` trainings with this exercise; per side for one-sided exercises.
// One decimal. null without history.
export function averagePerformance(workouts, workout, exercise, { sessions = 5 } = {}) {
  const recent = earlierSessions(workouts, workout, exercise).slice(0, sessions);
  if (recent.length === 0) return null;
  const perSession = recent.map(({ exercise: logged }) => workingDone(logged).map(positionValues));
  const positions = Math.max(...perSession.map(sets => sets.length));
  const sets = Array.from({ length: positions }, (_, index) => {
    const atPosition = perSession.map(sessionSets => sessionSets[index]).filter(Boolean);
    if (atPosition.some(values => 'left' in values)) {
      const side = name => averageOf(atPosition.map(values => ('left' in values ? values[name] : values)));
      return { left: side('left'), right: side('right') };
    }
    return averageOf(atPosition);
  });
  const all = perSession.flat().flatMap(values => ('left' in values ? [values.left, values.right] : [values]));
  return { sessions: recent.length, sets, overall: averageOf(all) };
}

// The plan's target of a set as values: lower end of the repetitions, the seconds
// and the planned weight. null for sets without plan targets.
function plannedValues(set) {
  if (!set.planned) return null;
  const { dose, weight } = set.planned;
  return {
    weight: weight ?? null,
    reps: dose.unit === 'repetitions' ? dose.min : null,
    seconds: dose.unit === 'seconds' ? dose.value : null,
  };
}

// Suggestions for the open working sets of an exercise, by set id: position for
// position from the chosen source ({ sets } of previousPerformance or
// averagePerformance), else the plan's values, else the last known position,
// else the suggestion of the set before.
// Repetitions and seconds are whole numbers; done and warm-up sets get none.
export function setSuggestions(exercise, source) {
  const history = source?.sets ?? [];
  const whole = values =>
    values && {
      weight: values.weight ?? null,
      reps: values.reps === null || values.reps === undefined ? null : Math.round(values.reps),
      seconds: values.seconds === null || values.seconds === undefined ? null : Math.round(values.seconds),
    };
  const suggestions = {};
  let position = 0;
  let before = null;
  for (const set of exercise.sets) {
    if (set.type === 'warmup') continue;
    const index = position;
    position += 1;
    // An added set takes over the suggestion of the set before it.
    const found = history[index] ?? plannedValues(set) ?? history[history.length - 1] ?? before;
    before = found;
    if (!found || isSetDone(set)) continue;
    const sided = 'left' in found;
    if (exercise.perSide) {
      suggestions[set.id] = {
        left: whole(sided ? found.left : found),
        right: whole(sided ? found.right : found),
      };
    } else {
      suggestions[set.id] = whole(sided ? found.left : found);
    }
  }
  return suggestions;
}

function newSet({ type = 'working', planned = null, perSide = false } = {}) {
  return {
    id: nanoid(),
    type,
    planned,
    rir: null,
    completedAt: null,
    ...emptyValues(),
    ...(perSide ? { sides: { left: emptyValues(), right: emptyValues() } } : {}),
  };
}

// A logged exercise from a plan entry. All values start empty: the training page
// suggests last time's values, the average or the plan's (setSuggestions).
export function exerciseFromEntry(entry) {
  const perSide = entryIsPerSide(entry);
  return {
    id: nanoid(),
    exerciseId: entry.exerciseId,
    exercise: entry.exercise,
    muscle: entry.muscle,
    plannedEntryId: entry.id,
    plannedWorkingSets: entry.sets.filter(target => target.type === 'working').length,
    // Superset of the plan: neighbours with the same groupId are done in turn.
    groupId: entry.groupId ?? null,
    skipped: false,
    restSeconds: entry.restSeconds ?? null,
    perSide,
    sets: entry.sets.map(target =>
      newSet({
        type: target.type,
        planned: { dose: { ...target.dose }, weight: target.weight, rirTarget: target.rirTarget },
        perSide,
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
    groupId: null,
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

export function createWorkoutFromPlan(plan, day, date) {
  return {
    ...baseWorkout(date, 'done', planReference(plan, day, date)),
    exercises: day.entries.map(entry => exerciseFromEntry(entry)),
  };
}

// A planned training that did not happen, e.g. because of illness.
export const createSkippedWorkout = (plan, day, date, note = '') =>
  baseWorkout(date, 'skipped', planReference(plan, day, date), note);

export const createFreeWorkout = date => baseWorkout(date, 'done', null);

// The plan day that fits a date: on weekday plans the day of that weekday, on
// rotation plans the day after the last one trained (or skipped).
export function suggestDay(plan, date, workouts = []) {
  const days = orderedDays(plan);
  if (days.length === 0) return null;
  if (plan.schedule?.type !== 'rotation') {
    return days.find(day => dayWeekdays(day).includes(weekdayOf(date))) ?? days[0];
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
// A day planned on several weekdays counts as moved only off all of them; entries
// saved before plan model 4 have one weekday only.
export function isMoved(workout) {
  const weekdays = workout.plan?.weekdays ?? (workout.plan?.weekday ? [workout.plan.weekday] : []);
  return weekdays.length > 0 && !weekdays.includes(weekdayOf(workout.date));
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

// A new set starts empty; the training page suggests values for it.
export function addLoggedSet(workout, exerciseId) {
  return mapExercise(workout, exerciseId, exercise => ({
    ...exercise,
    sets: [...exercise.sets, newSet({ perSide: exercise.perSide })],
  }));
}

// A warm-up set goes after the existing warm-up sets, before the working sets.
// It does not count as a working set (summary, adherence, records).
export function addWarmupSet(workout, exerciseId) {
  return mapExercise(workout, exerciseId, exercise => {
    const index = exercise.sets.filter(set => set.type === 'warmup').length;
    const sets = [...exercise.sets];
    sets.splice(index, 0, newSet({ type: 'warmup', perSide: exercise.perSide }));
    return { ...exercise, sets };
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

// Changes of one logged exercise, e.g. its note.
export function updateLoggedExercise(workout, exerciseId, changes) {
  return mapExercise(workout, exerciseId, exercise => ({ ...exercise, ...changes }));
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

// Whether the rest starts after a set of this exercise: always for single
// exercises, in a superset only after its last exercise (A1 → A2 → rest).
export function restsAfter(workout, exerciseId) {
  const index = workout.exercises.findIndex(item => item.id === exerciseId);
  const label = supersetLabels(workout.exercises)[index];
  return !label || label.position === label.size - 1;
}
