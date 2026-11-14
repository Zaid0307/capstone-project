import {
  completeWeeks,
  countSets,
  customExerciseSets,
  defaultFilters,
  effectiveSets,
  filterRows,
  filterWorkouts,
  isCountable,
  isPlanActive,
  longestWeekStreak,
  mondayOf,
  mostSkipped,
  personalRecords,
  planSchedule,
  plannedGroupSets,
  pooledAdherence,
  previousRange,
  rangeOf,
  recordsInRange,
  scheduleAdherence,
  streakWorkouts,
  timeBuckets,
  toSetRows,
  volume,
  volumePerBucket,
  weekStreak,
  weeklyTargetOf,
  weeksIn,
  workoutCounts,
  workoutsPerBucket,
  adherencePerBucket,
} from '../../utils/analysis';

// Averages and comparisons need at least three finished weeks (spec 3.12).
export const MIN_WEEKS = 3;
const MAX_RECORDS = 5;
const TOP_EXERCISES = 5;

export const byDate = (a, b) => a.date.localeCompare(b.date) || (a.createdAt ?? '').localeCompare(b.createdAt ?? '');

// Plans the plan filter picked (all when none is picked).
export const selectedPlans = (plans, filters) =>
  filters.plans.length ? plans.filter(plan => filters.plans.includes(plan.id)) : plans;

// Records of one workout, exercise and side shown together ("e1RM, weight").
function groupRecords(records) {
  const groups = new Map();
  for (const record of records) {
    const key = `${record.workoutId}|${record.exerciseKey}|${record.side}`;
    if (!groups.has(key)) groups.set(key, { key, exerciseKey: record.exerciseKey, side: record.side, date: record.date, workoutId: record.workoutId, records: [] });
    groups.get(key).records.push(record);
  }
  return [...groups.values()];
}

// Everything the standard dashboard shows, from plans, workouts, filters and today.
// allRows can be passed in when the caller caches toSetRows.
export function dashboardData({ plans, workouts, filters, today, allRows }) {
  const sorted = [...workouts].sort(byDate);
  const rowsOfAll = allRows ?? toSetRows(sorted);
  const range = rangeOf(filters, today, { workouts: sorted, plans });
  const previous = previousRange(range);
  const planWorkouts = filterWorkouts(sorted, { ...defaultFilters(), plans: filters.plans });
  const current = filterWorkouts(sorted, filters, range);
  const before = filterWorkouts(sorted, filters, previous);
  const rows = filterRows(rowsOfAll, filters, range);
  const previousRows = filterRows(rowsOfAll, filters, previous);
  const warmups = { warmups: filters.warmups };

  const firstDate = planWorkouts.find(workout => workout.status === 'done')?.date ?? null;
  const fullWeeks = firstDate ? completeWeeks(range, today, firstDate) : 0;
  const hasHistoryBefore = firstDate !== null && firstDate <= previous.to;
  const compare = filters.range !== 'all' && fullWeeks >= MIN_WEEKS && hasHistoryBefore;

  const kpis = [
    { key: 'workouts', value: workoutCounts(current).workouts, previous: workoutCounts(before).workouts },
    { key: 'sets', value: countSets(rows, warmups), previous: countSets(previousRows, warmups) },
    { key: 'volume', value: volume(rows, warmups), previous: volume(previousRows, warmups) },
    { key: 'adherence', value: pooledAdherence(current).value, previous: pooledAdherence(before).value },
  ];

  const chosenPlans = selectedPlans(plans, filters);
  const weeklyTarget = weeklyTargetOf(chosenPlans);
  // Without a plan filter, workouts of active plans and free workouts count for the
  // streak; with one, the workouts of the chosen plans do.
  const streakBase = filters.plans.length ? planWorkouts : streakWorkouts(planWorkouts, plans);
  const schedule = scheduleAdherence(chosenPlans, planWorkouts, range, today);
  const startFromFirstWorkout = chosenPlans.some(plan => isPlanActive(plan) && !planSchedule(plan).startDate);

  const buckets = timeBuckets(range, today);
  const activeFrom = firstDate && mondayOf(firstDate) > range.from ? mondayOf(firstDate) : range.from;
  const weeks = weeksIn({ from: activeFrom > range.to ? range.to : activeFrom, to: range.to });
  const groupTotals = effectiveSets(rows, { level: 'group' });

  const records = groupRecords(
    recordsInRange(personalRecords(filterRows(rowsOfAll, filters, null)), range).reverse()
  ).slice(0, MAX_RECORDS);

  const sessionsByExercise = new Map();
  for (const row of rows) {
    if (!isCountable(row)) continue;
    if (!sessionsByExercise.has(row.exerciseKey)) sessionsByExercise.set(row.exerciseKey, new Set());
    sessionsByExercise.get(row.exerciseKey).add(row.workoutId);
  }
  const exercises = [...sessionsByExercise]
    .map(([exerciseKey, ids]) => ({ exerciseKey, sessions: ids.size }))
    .sort((a, b) => b.sessions - a.sessions || a.exerciseKey.localeCompare(b.exerciseKey))
    .slice(0, TOP_EXERCISES);

  return {
    range,
    previous,
    compare,
    fullWeeks,
    hasAnyWorkout: sorted.some(workout => workout.status === 'done'),
    workoutCount: current.filter(workout => workout.status === 'done').length,
    kpis,
    streak: {
      weeklyTarget,
      current: weekStreak(streakBase, weeklyTarget, today),
      longest: longestWeekStreak(streakBase, weeklyTarget, today),
    },
    schedule: { ...schedule, startFromFirstWorkout },
    workoutsSeries: workoutsPerBucket(current, buckets),
    volumeSeries: volumePerBucket(rows, buckets, warmups),
    adherenceSeries: adherencePerBucket(current, buckets),
    groupSets: Object.fromEntries(Object.entries(groupTotals).map(([group, sets]) => [group, sets / weeks])),
    plannedGroupSets: plannedGroupSets(chosenPlans),
    customSets: customExerciseSets(rows),
    records,
    skipped: mostSkipped(rows),
    exercises,
  };
}
