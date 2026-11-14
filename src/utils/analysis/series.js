import { MUSCLE_GROUP_NAMES } from '../../data/muscleGroups';
import { weeklySetsByMuscle } from '../workoutPlan';
import { addDays, asDateKey, daysBetween, mondayOf, monthKeyOf, weekKeyOf, weekMondays } from './dates';
import { isPlanActive, pooledAdherence } from './adherence';
import { isCountable, isFirstRowOfSet } from './setRows';

// Time series and plan targets for the dashboard
// (docs/ux/03-analysen-und-architektur.md, 3.5, 3.8, 3.11).

// Up to 26 weeks the charts show weeks, above that months (3.11).
export const MAX_WEEK_BARS = 26;

// Buckets of a range, oldest first: { key, from, to, unit: 'week' | 'month', inProgress }.
// The running week or month is marked as in progress.
export function timeBuckets({ from, to }, today) {
  const todayKey = asDateKey(today);
  const mondays = weekMondays(from, to);
  if (mondays.length <= MAX_WEEK_BARS) {
    return mondays.map(monday => ({
      key: weekKeyOf(monday),
      from: monday,
      to: addDays(monday, 6),
      unit: 'week',
      inProgress: monday <= todayKey && todayKey <= addDays(monday, 6),
    }));
  }
  const buckets = [];
  for (let month = monthKeyOf(from); month <= monthKeyOf(to); ) {
    const [year, number] = month.split('-').map(Number);
    const next = number === 12 ? `${year + 1}-01` : `${year}-${String(number + 1).padStart(2, '0')}`;
    const last = addDays(`${next}-01`, -1);
    buckets.push({ key: month, from: `${month}-01`, to: last, unit: 'month', inProgress: monthKeyOf(todayKey) === month });
    month = next;
  }
  return buckets;
}

const bucketIndex = (buckets, date) => buckets.findIndex(bucket => date >= bucket.from && date <= bucket.to);

// Done workouts per bucket: [{ ...bucket, value }].
export function workoutsPerBucket(workouts, buckets) {
  const counts = buckets.map(() => 0);
  for (const workout of workouts) {
    if (workout.status !== 'done') continue;
    const index = bucketIndex(buckets, workout.date);
    if (index >= 0) counts[index] += 1;
  }
  return buckets.map((bucket, index) => ({ ...bucket, value: counts[index] }));
}

// Volume (kg × reps) per bucket over countable rows: [{ ...bucket, value }].
export function volumePerBucket(rows, buckets, { warmups = false } = {}) {
  const totals = buckets.map(() => 0);
  for (const row of rows) {
    if (!isCountable(row, { warmups })) continue;
    const index = bucketIndex(buckets, row.date);
    if (index >= 0) totals[index] += (row.weight ?? 0) * (row.reps ?? 0);
  }
  return buckets.map((bucket, index) => ({ ...bucket, value: totals[index] }));
}

// Pooled plan adherence per bucket: [{ ...bucket, value (0–1 | null), met, planned }].
export function adherencePerBucket(workouts, buckets) {
  const groups = buckets.map(() => []);
  for (const workout of workouts) {
    const index = bucketIndex(buckets, workout.date);
    if (index >= 0) groups[index].push(workout);
  }
  return buckets.map((bucket, index) => ({ ...bucket, ...pooledAdherence(groups[index]) }));
}

// Weeks of a range that are over (Sunday before today), counted from the first
// workout in the range; the base of averages and comparisons (3.12).
export function completeWeeks({ from, to }, today, firstDate = from) {
  const todayKey = asDateKey(today);
  const start = mondayOf(firstDate > from ? firstDate : from);
  const lastSunday = addDays(mondayOf(todayKey), -1);
  const end = to < lastSunday ? to : lastSunday;
  if (end < start) return 0;
  return Math.floor((daysBetween(start, end) + 1) / 7);
}

// Number of weeks in a range (fractional at the edges), at least 1.
export const weeksIn = ({ from, to }) => Math.max(1, (daysBetween(from, to) + 1) / 7);

// Planned effective sets per week and muscle group of the given plans (3.8, Soll):
// per planned working set the maximum share per group (1 primary, 0.5 secondary),
// times how often the day happens per week. Only active plans count. Same numbers
// as the group bars in the plan editor (weeklySetsByMuscle).
export function plannedGroupSets(plans) {
  const totals = Object.fromEntries(MUSCLE_GROUP_NAMES.map(group => [group, 0]));
  for (const plan of plans) {
    if (!isPlanActive(plan)) continue;
    for (const { muscle, sets } of weeklySetsByMuscle(plan)) {
      if (muscle in totals) totals[muscle] += sets;
    }
  }
  return totals;
}

// Exercises with the most planned working sets that were not done (skipped
// exercises included), in done workouts: [{ exerciseKey, exerciseId, sets }].
export function mostSkipped(rows, limit = 3) {
  const counts = new Map();
  for (const row of rows) {
    if (row.workoutStatus !== 'done' || row.type !== 'working' || !row.planned || !isFirstRowOfSet(row) || row.done) continue;
    const entry = counts.get(row.exerciseKey) ?? { exerciseKey: row.exerciseKey, exerciseId: row.exerciseId, sets: 0 };
    entry.sets += 1;
    counts.set(row.exerciseKey, entry);
  }
  return [...counts.values()].sort((a, b) => b.sets - a.sets || a.exerciseKey.localeCompare(b.exerciseKey)).slice(0, limit);
}

// Comparison with the previous period (3.10): { difference, percent | null, isNew }.
// percent only when the previous value is above 0, else the value is "new".
export function compareValues(current, previous) {
  if (current === null || previous === null || current === undefined || previous === undefined) return null;
  const difference = current - previous;
  if (previous > 0) return { difference, percent: difference / previous, isNew: false };
  return { difference, percent: null, isNew: current > 0 };
}
