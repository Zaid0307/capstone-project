import { nanoid } from 'nanoid';
import { MUSCLE_GROUP_NAMES } from '../data/muscleGroups';
import { EXERCISES, countsForMuscleLoad, exerciseGroups, isPerSideExercise } from '../data/exerciseLibrary';
import { MUSCLES, resolveMuscleId } from '../data/muscles';

// Plan model 3 (docs/konzept-plaene-training-auswertung.md, section 7.1):
//
// plan  { id, schemaVersion, nameOfWorkout, description, schedule, days, template?, hints? }
// day   { id, name, weekday | null, note?, entries }        – entries in training order
// entry { id, exerciseId | null, exercise, muscle, note?, restSeconds | null, perSide?, sets }
//   perSide: done for one arm, leg or side at a time (logged left and right)
// schedule { type: 'weekdays' | 'rotation', daysPerWeek?, startDate?, endDate? } – daysPerWeek: trainings per
//   week of a rotation plan; dates as 'YYYY-MM-DD'
// archived?: true for plans no longer in use. Several plans can be active at the same time.
// set   { type: 'working' | 'warmup', dose, weight | null, rirTarget | null }
// dose  { unit: 'repetitions', min, max } | { unit: 'seconds', value }
//
// Version 2 had one dose and a set count per entry and every day was a weekday.
// Version 1 (older app versions) nested exercises under muscles, all as text.
export const PLAN_SCHEMA_VERSION = 3;

export const WEEKDAYS = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
];

// 'weekdays': every day has a fixed weekday. 'rotation': days follow each other
// in their order, on whatever days the user trains.
export const SCHEDULE_TYPES = ['weekdays', 'rotation'];

export const SET_TYPES = ['working', 'warmup'];

// Exercise categories that are usually measured in time instead of repetitions.
const TIMED_CATEGORIES = ['isometric', 'stretch', 'yoga', 'cardio', 'boxing'];

// Plans saved by older versions use 'Arms', 'Stomach', … as muscle names.
const LEGACY_MUSCLE_NAMES = { stomach: 'abs' };

export function normalizeMuscle(name = '') {
  const lowerCaseName = name.toLowerCase();
  return LEGACY_MUSCLE_NAMES[lowerCaseName] ?? lowerCaseName;
}

// Muscle groups an entry of a plan can belong to: the six groups plus 'other'
// for exercises without a muscle group, such as cardio and boxing.
export const PLAN_MUSCLES = [...MUSCLE_GROUP_NAMES, 'other'];

export function muscleLabel(name, t) {
  const muscle = normalizeMuscle(name);
  return PLAN_MUSCLES.includes(muscle) ? t(`muscle.${muscle}`) : name;
}

export function dayLabel(weekday, t) {
  return WEEKDAYS.includes(weekday) ? t(`day.${weekday}`) : weekday;
}

// Title of a day: its weekday on weekday plans, else its name.
export function dayTitle(day, schedule, t) {
  if (schedule?.type !== 'rotation' && day.weekday) return dayLabel(day.weekday, t);
  return day.name || t('planEditor.unnamedDay');
}

// Plans in use: not archived. Several can be active at once (e.g. gym and home).
export const isPlanActive = plan => !plan.archived && plan.isActive !== false;

// Days in training order: by weekday on weekday plans, else as stored.
export function orderedDays(plan) {
  if (plan.schedule?.type === 'rotation') return plan.days;
  const position = day => (day.weekday ? WEEKDAYS.indexOf(day.weekday) : WEEKDAYS.length);
  return [...plan.days].sort((a, b) => position(a) - position(b));
}

// Finds a library exercise by its German or English name, ignoring case.
export function findLibraryExercise(name) {
  const wanted = name.trim().toLowerCase();
  if (!wanted) return null;
  return (
    EXERCISES.find(exercise =>
      Object.values(exercise.name).some(value => value.toLowerCase() === wanted)
    ) ?? null
  );
}

const EXERCISES_BY_ID = new Map(EXERCISES.map(exercise => [exercise.id, exercise]));

export function libraryExercise(exerciseId) {
  return EXERCISES_BY_ID.get(exerciseId) ?? null;
}

export function defaultMuscleOf(exerciseId) {
  const exercise = libraryExercise(exerciseId);
  return exercise ? exerciseGroups(exercise)[0] ?? '' : '';
}

// The name to show: the library name in the current language, else the free text.
export function entryName(entry, language) {
  const exercise = entry.exerciseId && libraryExercise(entry.exerciseId);
  return exercise ? exercise.name[language] ?? exercise.name.en : entry.exercise;
}

export function formatDose(dose) {
  if (dose.unit === 'seconds') return `${dose.value} s`;
  return dose.min === dose.max ? `${dose.min}` : `${dose.min}–${dose.max}`;
}

const sameDose = (a, b) => JSON.stringify(a) === JSON.stringify(b);

// Short summary of an entry's sets, e.g. "3 × 8–12 · 60 kg" or "1 + 3 × 8–12".
export function summarizeSets(sets, language = 'en') {
  const working = sets.filter(set => set.type === 'working');
  const warmups = sets.length - working.length;
  const shown = working.length ? working : sets;
  const doses = shown.every(set => sameDose(set.dose, shown[0].dose))
    ? formatDose(shown[0].dose)
    : shown.map(set => formatDose(set.dose)).join(' / ');
  const weights = [...new Set(shown.map(set => set.weight).filter(weight => weight !== null))];
  const weight = weights.length
    ? ` · ${weights.map(value => value.toLocaleString(language)).join(' / ')} kg`
    : '';
  const count = warmups && working.length ? `${warmups} + ${working.length}` : `${shown.length}`;
  return `${count} × ${doses}${weight}`;
}

// Older entries have no perSide field; then the library decides.
export const entryIsPerSide = entry => entry.perSide ?? isPerSideExercise(entry.exerciseId);

export function defaultDoseFor(exerciseId) {
  const exercise = libraryExercise(exerciseId);
  return exercise && TIMED_CATEGORIES.includes(exercise.category)
    ? { unit: 'seconds', value: 30 }
    : { unit: 'repetitions', min: 8, max: 12 };
}

export function createSet(dose, { type = 'working', weight = null, rirTarget = null } = {}) {
  return { type, dose: { ...dose }, weight, rirTarget };
}

// A new entry with sensible starting values: 3 sets, 8–12 repetitions (30 s for
// timed exercises), 90 s rest. Library exercises take their muscle group from the library.
export function createEntry({ exerciseId = null, exercise = '', muscle } = {}) {
  const dose = defaultDoseFor(exerciseId);
  return {
    id: nanoid(),
    exerciseId,
    exercise,
    muscle: muscle ?? (defaultMuscleOf(exerciseId) || 'other'),
    restSeconds: 90,
    perSide: isPerSideExercise(exerciseId),
    sets: [createSet(dose), createSet(dose), createSet(dose)],
  };
}

export function createDay({ name = '', weekday = null } = {}) {
  return { id: nanoid(), name, weekday, entries: [] };
}

const DAY_LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

// Suggested name of a rotation day by its position: "Day A", "Day B", …
export function defaultDayName(index, t) {
  return t('planEditor.day.defaultName', { letter: DAY_LETTERS[index] ?? index + 1 });
}

// Suggested name of a new plan: "My plan 1", or the next free number.
export function suggestPlanName(plans, t) {
  const names = new Set(plans.map(plan => plan.nameOfWorkout?.trim()));
  let number = 1;
  while (names.has(t('planEditor.suggestedName', { number }))) number += 1;
  return t('planEditor.suggestedName', { number });
}

// The start of an empty plan: a name, rotation three times a week and "Day A",
// so the first step is choosing exercises, not filling in a form.
export function createStarterPlan({ name, dayName }) {
  return {
    ...createEmptyPlan(),
    nameOfWorkout: name,
    schedule: { type: 'rotation', daysPerWeek: 3 },
    days: [createDay({ name: dayName })],
  };
}

export function createEmptyPlan() {
  return {
    id: nanoid(),
    schemaVersion: PLAN_SCHEMA_VERSION,
    nameOfWorkout: '',
    description: '',
    schedule: { type: 'weekdays' },
    days: [],
  };
}

function toNumber(value) {
  if (value === '' || value === null || value === undefined) return null;
  const number = Number(String(value).replace(',', '.'));
  return Number.isFinite(number) ? number : null;
}

// Version 1 entry (all text) → version 2 entry.
function entryFromVersion1(exercise, muscleName) {
  const repetitions = toNumber(exercise.repetitions) ?? 1;
  const match = findLibraryExercise(exercise.exercise ?? '');
  return {
    id: exercise.id ?? nanoid(),
    exerciseId: match?.id ?? null,
    exercise: exercise.exercise ?? '',
    muscle: normalizeMuscle(exercise.muscle ?? muscleName),
    sets: toNumber(exercise.sets) ?? 1,
    dose: { unit: 'repetitions', min: repetitions, max: repetitions },
    weight: toNumber(exercise.weight),
    restSeconds: null,
  };
}

// Version 2 entry → version 3 entry: the one dose becomes one target per set.
function entryFromVersion2({ sets, dose, weight, rirTarget, ...entry }) {
  const count = Math.max(1, sets ?? 1);
  return {
    ...entry,
    restSeconds: entry.restSeconds ?? null,
    sets: Array.from({ length: count }, () =>
      createSet(dose, { weight: weight ?? null, rirTarget: rirTarget ?? null })
    ),
  };
}

// Brings a plan saved by any app version into the current shape.
export function migratePlan(plan) {
  if (plan.schemaVersion === PLAN_SCHEMA_VERSION) return plan;
  const isVersion2 = plan.schemaVersion === 2;
  const { days = [], ...rest } = plan;
  return {
    ...rest,
    id: plan.id ?? nanoid(),
    schemaVersion: PLAN_SCHEMA_VERSION,
    nameOfWorkout: plan.nameOfWorkout ?? '',
    description: plan.description ?? '',
    schedule: { type: 'weekdays' },
    days: days.map(day => {
      const entries = isVersion2
        ? day.entries ?? []
        : (day.muscles ?? []).flatMap(muscle =>
            (muscle.exercises ?? []).map(exercise => entryFromVersion1(exercise, muscle.name))
          );
      return {
        id: day.id ?? nanoid(),
        name: day.name ?? '',
        weekday: WEEKDAYS.includes(day.day) ? day.day : null,
        ...(day.note ? { note: day.note } : {}),
        entries: entries.map(entryFromVersion2),
      };
    }),
  };
}

// How often each training day happens per week. Weekday plans: once. Rotation
// plans: trainings per week spread over the days, e.g. days A and B at three
// trainings a week count 1.5 times each.
export function weeklyDayFactor(plan) {
  const perWeek = plan.schedule?.daysPerWeek;
  const dayCount = plan.days?.length ?? 0;
  if (plan.schedule?.type !== 'rotation' || !perWeek || dayCount === 0) return 1;
  return perWeek / dayCount;
}

// Strength exercises and own exercises count for the muscle load, stretching,
// mobility, Pilates, boxing and cardio do not.
export function entryCountsForMuscleLoad(entry) {
  return countsForMuscleLoad(entry.exerciseId ? libraryExercise(entry.exerciseId)?.category : null);
}

// Share of one set per muscle group: 1 if a primary muscle of the group is
// trained, 0.5 if only secondary ones are, the highest share per group (never
// the sum). Same rule as muscleContributions in analysis/muscleLoad.js, kept
// here so the plan model does not depend on the analysis modules.
// Own exercises without library data count fully for their chosen group.
function groupSharesOf(entry) {
  const exercise = entry.exerciseId ? libraryExercise(entry.exerciseId) : null;
  const shares = {};
  const raise = (ids, share) => {
    for (const id of ids.flatMap(resolveMuscleId)) {
      const group = MUSCLES[id]?.group;
      if (group && (shares[group] ?? 0) < share) shares[group] = share;
    }
  };
  if (exercise) {
    raise(exercise.muscles?.secondary ?? [], 0.5);
    raise(exercise.muscles?.primary ?? [], 1);
  }
  if (Object.keys(shares).length > 0) return shares;
  const muscle = normalizeMuscle(entry.muscle ?? '');
  return { [PLAN_MUSCLES.includes(muscle) ? muscle : 'other']: 1 };
}

// Effective working sets per muscle group in one week (primary muscle 1,
// secondary muscle 0.5 per set), times how often the day happens per week.
export function weeklySetsByMuscle(plan) {
  const factor = weeklyDayFactor(plan);
  const totals = {};
  for (const day of plan.days ?? []) {
    for (const entry of day.entries ?? []) {
      const working = (entry.sets ?? []).filter(set => set.type === 'working').length;
      if (!working || !entryCountsForMuscleLoad(entry)) continue;
      for (const [muscle, share] of Object.entries(groupSharesOf(entry))) {
        totals[muscle] = (totals[muscle] ?? 0) + share * working * factor;
      }
    }
  }
  return PLAN_MUSCLES.filter(muscle => totals[muscle]).map(muscle => ({
    muscle,
    sets: totals[muscle],
  }));
}

const validDose = dose =>
  dose.unit === 'seconds'
    ? dose.value > 0
    : dose.min > 0 && dose.max >= dose.min;

// What is missing before the plan can be saved. Each problem names where it is.
export function planProblems(plan) {
  const problems = [];
  if (!plan.nameOfWorkout.trim()) problems.push({ type: 'name' });
  if (plan.days.length === 0) problems.push({ type: 'noDays' });
  for (const day of plan.days) {
    if (plan.schedule.type === 'weekdays' && !day.weekday) {
      problems.push({ type: 'noWeekday', dayId: day.id });
    }
    if (plan.schedule.type === 'rotation' && !day.name.trim()) {
      problems.push({ type: 'noDayName', dayId: day.id });
    }
    if (day.entries.length === 0) problems.push({ type: 'emptyDay', dayId: day.id });
    for (const entry of day.entries) {
      if (entry.sets.length === 0 || !entry.sets.every(set => validDose(set.dose))) {
        problems.push({ type: 'invalidSets', dayId: day.id, entryId: entry.id });
      }
    }
  }
  return problems;
}

export function removeDay(plan, dayId) {
  return { ...plan, days: plan.days.filter(day => day.id !== dayId) };
}
