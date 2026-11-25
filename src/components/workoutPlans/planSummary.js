import { dayWeekdays, WEEKDAYS } from '../../utils/workoutPlan';

// 2024-01-01 was a Monday: used to get short weekday names in the chosen language.
export function shortWeekday(weekday, language) {
  const date = new Date(2024, 0, 1 + WEEKDAYS.indexOf(weekday));
  return new Intl.DateTimeFormat(language, { weekday: 'short' }).format(date);
}

// When a plan is trained: "Mon Wed Fri" on weekday plans, "3 × per week" on rotation plans.
export function scheduleText(plan, t, language) {
  if (plan.schedule.type === 'rotation') {
    return t('planEditor.summary.rotation', {
      count: plan.schedule.daysPerWeek ?? Math.max(1, Math.min(7, plan.days.length)),
    });
  }
  const used = new Set(plan.days.flatMap(dayWeekdays));
  return WEEKDAYS.filter(weekday => used.has(weekday))
    .map(weekday => shortWeekday(weekday, language))
    .join(' ');
}
