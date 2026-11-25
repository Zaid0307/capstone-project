import { addDays, asDateKey, mondayOf, weekKeyOf, weekMondays } from './dates';
import { isPlanActive, planSchedule } from './adherence';
import { dayWeekdays, entryCountsForMuscleLoad } from '../workoutPlan';
import { countsAsTraining } from '../workoutLog';

// Workouts per week and the weekly streak (docs/ux/03-analysen-und-architektur.md, 3.5).
// Only workouts with at least one done set count (countsAsTraining); skipped,
// empty or just started ones never do. There is no daily streak on
// purpose: rest days are part of strength training.

const countByWeek = workouts => {
  const counts = new Map();
  for (const workout of workouts) {
    if (!countsAsTraining(workout)) continue;
    const week = weekKeyOf(workout.date);
    counts.set(week, (counts.get(week) ?? 0) + 1);
  }
  return counts;
};

// Planned training days per week of one plan: days with a weekday, or the
// trainings per week of a rotation plan.
const daysPerWeekOf = plan => {
  const schedule = planSchedule(plan);
  if (schedule.type === 'rotation') return schedule.daysPerWeek;
  // Every planned weekday counts: a day on Monday and Thursday is two trainings.
  return (plan.days ?? []).reduce((total, day) => total + dayWeekdays(day).length, 0);
};

// A plan counts for the weekly target unless all its exercises are non-strength
// work (mobility, stretching, Pilates, cardio, …). Its workouts still count.
const isStrengthPlan = plan => {
  const entries = (plan.days ?? []).flatMap(day => day.entries ?? []);
  return entries.length === 0 || entries.some(entryCountsForMuscleLoad);
};

// Weekly target: a goal "x workouts per week" if given, else the MOST planned
// training days per week among the active strength plans (not the sum: someone
// with a 4-day strength plan and a 6-day mobility plan aims at 4), else 1.
export function weeklyTargetOf(plans = [], goalPerWeek = null) {
  if (goalPerWeek > 0) return goalPerWeek;
  const planned = Math.max(0, ...plans.filter(plan => isPlanActive(plan) && isStrengthPlan(plan)).map(daysPerWeekOf));
  return planned > 0 ? planned : 1;
}

// Workouts that count for the streak: free workouts and workouts of any active
// plan. Workouts of archived or deleted plans do not.
export function streakWorkouts(workouts, plans = []) {
  const active = new Set(plans.filter(isPlanActive).map(plan => plan.id));
  return workouts.filter(workout => !workout.plan || active.has(workout.plan.planId));
}

// Consecutive finished weeks (back from last week) with workouts ≥ target. The
// running week adds one as soon as it reaches the target, but never breaks the
// streak; a finished week below the target sets it to 0.
export function weekStreak(workouts, weeklyTarget, today) {
  // A target below 1 would make every empty week count and never end the loop.
  const target = Math.max(1, weeklyTarget);
  const counts = countByWeek(workouts);
  const thisMonday = mondayOf(asDateKey(today));
  let streak = 0;
  for (let monday = addDays(thisMonday, -7); (counts.get(weekKeyOf(monday)) ?? 0) >= target; monday = addDays(monday, -7)) {
    streak += 1;
  }
  if ((counts.get(weekKeyOf(thisMonday)) ?? 0) >= target) streak += 1;
  return streak;
}

// Longest run of weeks reaching the target over the whole history (up to today).
export function longestWeekStreak(workouts, weeklyTarget, today) {
  const target = Math.max(1, weeklyTarget);
  const counts = countByWeek(workouts);
  const todayKey = asDateKey(today);
  const dates = workouts.filter(workout => countsAsTraining(workout) && workout.date <= todayKey).map(workout => workout.date);
  if (!dates.length) return 0;
  let longest = 0;
  let run = 0;
  for (const monday of weekMondays(dates.reduce((a, b) => (a < b ? a : b)), todayKey)) {
    run = (counts.get(weekKeyOf(monday)) ?? 0) >= target ? run + 1 : 0;
    longest = Math.max(longest, run);
  }
  return longest;
}

// Done workouts per ISO week of a range, oldest first, including empty weeks:
// [{ weekKey, monday, count, inProgress }]. inProgress marks the running week.
export function workoutsPerWeek(workouts, { from, to }, today) {
  const counts = countByWeek(workouts.filter(workout => workout.date >= from && workout.date <= to));
  const thisMonday = mondayOf(asDateKey(today));
  return weekMondays(from, to).map(monday => ({
    weekKey: weekKeyOf(monday),
    monday,
    count: counts.get(weekKeyOf(monday)) ?? 0,
    inProgress: monday === thisMonday,
  }));
}

// Number of done workouts and of different training days.
export function workoutCounts(workouts) {
  const done = workouts.filter(countsAsTraining);
  return { workouts: done.length, trainingDays: new Set(done.map(workout => workout.date)).size };
}
