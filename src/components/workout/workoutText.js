// Small text helpers shared by the training page, the banner and the summary.

// "42 min" or "1 h 05 min"; null stays null (no start time recorded).
export function formatDuration(milliseconds, t) {
  if (milliseconds === null || milliseconds === undefined) return null;
  const totalMinutes = Math.floor(milliseconds / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return hours
    ? t('duration.hours', { hours, minutes: String(minutes).padStart(2, '0') })
    : t('duration.minutes', { minutes });
}

// "Push · Monday" for plan workouts, "Free training" otherwise.
export function workoutTitle(workout, t) {
  return workout.plan
    ? `${workout.plan.planName} · ${workout.plan.dayName || t(`day.${workout.plan.weekday}`)}`
    : t('diary.freeWorkout');
}
