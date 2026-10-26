import { nanoid } from 'nanoid';
import { MUSCLE_GROUP_NAMES } from '../api/wger';

export const WEEKDAYS = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
];

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

export function groupExercisesByMuscle(exercises) {
  const muscles = MUSCLE_GROUP_NAMES.filter(muscle =>
    exercises.some(exercise => exercise.muscle === muscle)
  );
  return muscles.map(muscle => ({
    id: nanoid(),
    name: muscle,
    exercises: exercises.filter(exercise => exercise.muscle === muscle),
  }));
}

export function getDaysWithoutExercises(plan, exercisesByDay) {
  return plan.days
    .map(({ day }) => day)
    .filter(day => !exercisesByDay[day]?.length);
}

export function buildWorkoutPlan(plan, exercisesByDay) {
  return {
    ...plan,
    days: plan.days.map(day => ({
      ...day,
      muscles: groupExercisesByMuscle(exercisesByDay[day.day] ?? []),
    })),
  };
}

export function deletePlan(plans, planId) {
  return plans.filter(plan => plan.id !== planId);
}

export function deleteDay(plans, planId, dayId) {
  return plans.map(plan =>
    plan.id === planId
      ? { ...plan, days: plan.days.filter(day => day.id !== dayId) }
      : plan
  );
}
