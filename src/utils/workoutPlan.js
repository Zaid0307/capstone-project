import { nanoid } from 'nanoid';
import { MUSCLE_GROUP_NAMES } from '../data/muscleGroups';
import { EXERCISES, exerciseGroups } from '../data/exerciseLibrary';

export const WEEKDAYS = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
];

// Version 2: days hold a flat list of entries. Version 1 (older app versions)
// nested exercises under muscles and stored all values as text.
export const PLAN_SCHEMA_VERSION = 2;

// Plans saved by older versions use 'Arms', 'Stomach', … as muscle names.
const LEGACY_MUSCLE_NAMES = { stomach: 'abs' };

export function normalizeMuscle(name = '') {
  const lowerCaseName = name.toLowerCase();
  return LEGACY_MUSCLE_NAMES[lowerCaseName] ?? lowerCaseName;
}

export function muscleLabel(name, t) {
  const muscle = normalizeMuscle(name);
  return MUSCLE_GROUP_NAMES.includes(muscle) ? t(`muscle.${muscle}`) : name;
}

export function dayLabel(day, t) {
  return WEEKDAYS.includes(day) ? t(`day.${day}`) : day;
}

export function sortDays(days) {
  return [...days].sort(
    (a, b) => WEEKDAYS.indexOf(a.day) - WEEKDAYS.indexOf(b.day)
  );
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

export function libraryExercise(exerciseId) {
  return EXERCISES.find(exercise => exercise.id === exerciseId) ?? null;
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

function toNumber(value) {
  if (value === '' || value === null || value === undefined) return null;
  const number = Number(String(value).replace(',', '.'));
  return Number.isFinite(number) ? number : null;
}

function entryFromLegacy(exercise, muscleName) {
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

// Brings a plan saved by any app version into the current shape.
export function migratePlan(plan) {
  if (plan.schemaVersion === PLAN_SCHEMA_VERSION) return plan;
  return {
    id: plan.id ?? nanoid(),
    schemaVersion: PLAN_SCHEMA_VERSION,
    nameOfWorkout: plan.nameOfWorkout ?? '',
    description: plan.description ?? '',
    days: (plan.days ?? []).map(day => ({
      id: day.id ?? nanoid(),
      day: day.day,
      entries: (day.muscles ?? []).flatMap(muscle =>
        (muscle.exercises ?? []).map(exercise => entryFromLegacy(exercise, muscle.name))
      ),
    })),
  };
}

// Groups entries by muscle group in the fixed group order, for display.
export function groupEntriesByMuscle(entries) {
  return MUSCLE_GROUP_NAMES.filter(muscle => entries.some(entry => entry.muscle === muscle)).map(
    muscle => ({ name: muscle, entries: entries.filter(entry => entry.muscle === muscle) })
  );
}

export function getDaysWithoutExercises(details, entriesByDay) {
  return details.days
    .map(({ day }) => day)
    .filter(day => !entriesByDay[day]?.length);
}

export function buildWorkoutPlan(details, entriesByDay) {
  return {
    ...details,
    schemaVersion: PLAN_SCHEMA_VERSION,
    days: details.days.map(({ id, day }) => ({ id, day, entries: entriesByDay[day] ?? [] })),
  };
}

// Turns a saved plan back into the editable shape used by the form.
export function splitWorkoutPlan(plan) {
  const current = migratePlan(plan);
  const entriesByDay = Object.fromEntries(current.days.map(({ day, entries }) => [day, entries]));
  const { days, ...rest } = current;
  return {
    details: { ...rest, days: sortDays(days).map(({ id, day }) => ({ id, day })) },
    entriesByDay,
  };
}

export function removeDay(plan, dayId) {
  return { ...plan, days: plan.days.filter(day => day.id !== dayId) };
}
