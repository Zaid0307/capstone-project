import { useMemo } from 'react';
import { useTranslation } from '../../i18n/LanguageContext';
import { libraryExercise } from '../../utils/workoutPlan';

// Paths of the calendar and analysis pages (routes are registered in App.jsx).
export const paths = {
  calendar: '/calendar',
  analysis: '/analysis',
  exercise: exerciseKey => `/analysis/exercise/${encodeURIComponent(exerciseKey)}`,
  workout: workoutId => `/diary/${workoutId}`,
  diary: '/diary',
  plans: '/plans',
};

// Date keys are local calendar days; noon avoids any time zone shift.
export const dateOf = dateKey => new Date(`${dateKey}T12:00:00`);

// Number and date formats in the current language (de: 1.250 kg, 82,5 kg).
export function useFormat() {
  const { language } = useTranslation();
  return useMemo(() => {
    const number = (value, digits = 1) =>
      value === null || value === undefined || Number.isNaN(value)
        ? '–'
        : new Intl.NumberFormat(language, { maximumFractionDigits: digits }).format(value);
    const date = (dateKey, options = { day: 'numeric', month: 'numeric' }) =>
      new Intl.DateTimeFormat(language, options).format(dateOf(dateKey));
    return {
      number,
      kg: value => `${number(value)} kg`,
      percent: value => (value === null || value === undefined ? '–' : `${number(Math.round(value * 100), 0)} %`),
      date,
      dateShort: dateKey => date(dateKey, { day: 'numeric', month: 'short' }),
      dateMedium: dateKey => date(dateKey, { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }),
      dateLong: dateKey => date(dateKey, { weekday: 'long', day: 'numeric', month: 'long' }),
      month: monthKey => date(`${monthKey}-01`, { month: 'long', year: 'numeric' }),
      monthShort: monthKey => date(`${monthKey}-01`, { month: 'short' }),
    };
  }, [language]);
}

// Name of an exercise from its key: library name, else the decoded own name.
export function exerciseNameOf(exerciseKey, language) {
  const exercise = libraryExercise(exerciseKey);
  if (exercise) return exercise.name[language] ?? exercise.name.en;
  if (exerciseKey?.startsWith('custom:')) {
    const name = decodeURIComponent(exerciseKey.slice('custom:'.length));
    return name.charAt(0).toUpperCase() + name.slice(1);
  }
  return exerciseKey ?? '';
}

// Title of a workout: "Plan · Day" or "Free training".
export function workoutTitle(workout, t) {
  if (!workout.plan) return t('calendar.freeWorkout');
  const day = workout.plan.dayName || (workout.plan.weekday ? t(`day.${workout.plan.weekday}`) : '');
  return [workout.plan.planName, day].filter(Boolean).join(' · ');
}

// Text with a number: key.one for 1, key.other otherwise.
export const tCount = (t, key, count, values = {}) => t(`${key}.${count === 1 ? 'one' : 'other'}`, { count, ...values });
