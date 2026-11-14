import { MUSCLES } from '../../data/muscles';
import { MUSCLE_GROUP_NAMES } from '../../data/muscleGroups';
import { addDays, asDateKey, daysBetween, isDateKey, mondayOf } from './dates';
import { planSchedule, workoutStatus } from './adherence';
import { contributionTo, rowContributions } from './muscleLoad';

// Analysis filters and their URL form (docs/ux/03-analysen-und-architektur.md, 3.9).
//
// Filters { range, from, to, plans[], day, status[], kind[], group, muscle, exercise, warmups }
// Between filters AND, within one filter OR. Workout filters (range, plans, day,
// status) pick workouts; set filters (kind, group, muscle, exercise, warm-ups) pick rows.
// parseFilters always returns every field (null / [] / false when not set), so
// parseFilters(filtersToSearch(x)) equals x for every parsed x.

export const RANGES = ['4w', '12w', '6m', '1y', 'all', 'plan', 'custom'];
export const DEFAULT_RANGE = '12w';
export const STATUSES = ['onPlan', 'deviated', 'other'];

// Exercise kinds of the filter and the library categories behind them. 'custom' are
// own exercises without database id.
export const KIND_CATEGORIES = {
  strength: ['strength', 'isometric'],
  mobility: ['mobility', 'stretch', 'yoga', 'pilates'],
  cardio: ['cardio', 'boxing'],
  custom: [],
};
export const KINDS = Object.keys(KIND_CATEGORIES);

// Weeks of the preset ranges. Choice: 6 months and 1 year are 26 and 52 ISO weeks,
// so every preset starts on a Monday and the weekly charts have no partial first week.
const RANGE_WEEKS = { '4w': 4, '12w': 12, '6m': 26, '1y': 52 };

export const defaultFilters = () => ({
  range: DEFAULT_RANGE,
  from: null,
  to: null,
  plans: [],
  day: null,
  status: [],
  kind: [],
  group: null,
  muscle: null,
  exercise: null,
  warmups: false,
});

const listParam = (params, name, allowed) => {
  const values = (params.get(name) ?? '').split(',').filter(Boolean);
  return [...new Set(allowed ? values.filter(value => allowed.includes(value)) : values)];
};

const singlePlan = plans => plans.length === 1 && plans[0] !== 'free' && plans[0] !== 'activity';

// Reads filters from URL search parameters (URLSearchParams or '?a=b' string).
// Invalid values fall back to their default.
export function parseFilters(searchParams) {
  const params = searchParams instanceof URLSearchParams ? searchParams : new URLSearchParams(searchParams ?? '');
  const filters = defaultFilters();
  filters.plans = listParam(params, 'plans');
  const from = params.get('from');
  const to = params.get('to');
  const range = params.get('range');
  if (isDateKey(from) && isDateKey(to) && from <= to) {
    Object.assign(filters, { range: 'custom', from, to });
  } else if (RANGES.includes(range) && range !== 'custom' && (range !== 'plan' || singlePlan(filters.plans))) {
    filters.range = range;
  }
  // The day filter exists only when exactly one plan is chosen.
  if (singlePlan(filters.plans) && params.get('day')) filters.day = params.get('day');
  filters.status = listParam(params, 'status', STATUSES);
  filters.kind = listParam(params, 'kind', KINDS);
  if (MUSCLE_GROUP_NAMES.includes(params.get('group'))) filters.group = params.get('group');
  if (MUSCLES[params.get('muscle')]) filters.muscle = params.get('muscle');
  if (params.get('exercise')) filters.exercise = params.get('exercise');
  filters.warmups = params.get('warmups') === '1';
  return withGroup(filters, filters.group).filters;
}

// URL search string without '?'; default values are left out.
export function filtersToSearch(filters) {
  const params = new URLSearchParams();
  if (filters.range === 'custom') {
    params.set('from', filters.from);
    params.set('to', filters.to);
  } else if (filters.range && filters.range !== DEFAULT_RANGE) {
    params.set('range', filters.range);
  }
  if (filters.plans?.length) params.set('plans', filters.plans.join(','));
  if (filters.day) params.set('day', filters.day);
  if (filters.status?.length) params.set('status', filters.status.join(','));
  if (filters.kind?.length) params.set('kind', filters.kind.join(','));
  if (filters.group) params.set('group', filters.group);
  if (filters.muscle) params.set('muscle', filters.muscle);
  if (filters.exercise) params.set('exercise', filters.exercise);
  if (filters.warmups) params.set('warmups', '1');
  return params.toString();
}

// Sets the group; a muscle outside the new group is removed. removedMuscle tells
// the page what to announce in its live region.
export function withGroup(filters, group) {
  const next = { ...filters, group: group ?? null };
  const removedMuscle = next.group && next.muscle && MUSCLES[next.muscle]?.group !== next.group ? next.muscle : null;
  if (removedMuscle) next.muscle = null;
  return { filters: next, removedMuscle };
}

// "Reset filters" keeps the range.
export const resetFilters = filters => ({
  ...defaultFilters(),
  range: filters.range,
  from: filters.from,
  to: filters.to,
});

// Ranges -----------------------------------------------------------------------------

function earliestDate(workouts, planId) {
  let first = null;
  for (const workout of workouts) {
    if (planId && workout.plan?.planId !== planId) continue;
    if (first === null || workout.date < first) first = workout.date;
  }
  return first;
}

// The closed range [from, to] of the filters. Presets end today and start on the
// Monday of the first week ('12w' = this week and the 11 before). 'all' starts at
// the first workout, 'plan' at the plan's startDate (else its first workout) and
// ends at its endDate or today. context: { workouts, plans }.
export function rangeOf(filters, today, { workouts = [], plans = [] } = {}) {
  const todayKey = asDateKey(today);
  const weeks = RANGE_WEEKS[filters.range];
  if (weeks) return { from: addDays(mondayOf(todayKey), -7 * (weeks - 1)), to: todayKey };
  if (filters.range === 'custom' && filters.from && filters.to) return { from: filters.from, to: filters.to };
  if (filters.range === 'all') return { from: earliestDate(workouts) ?? todayKey, to: todayKey };
  if (filters.range === 'plan') {
    const planId = filters.plans[0];
    const plan = plans.find(item => item.id === planId);
    const schedule = plan ? planSchedule(plan) : {};
    const from = schedule.startDate ?? earliestDate(workouts, planId) ?? todayKey;
    const to = schedule.endDate && schedule.endDate < todayKey ? schedule.endDate : todayKey;
    return { from, to: to < from ? from : to };
  }
  return rangeOf({ ...filters, range: DEFAULT_RANGE }, todayKey);
}

// The range of the same length directly before (comparison, 3.10).
export function previousRange({ from, to }) {
  const length = daysBetween(from, to) + 1;
  const previousTo = addDays(from, -1);
  return { from: addDays(previousTo, -(length - 1)), to: previousTo };
}

export const inRange = (date, range) => !range || ((!range.from || date >= range.from) && (!range.to || date <= range.to));

// Filtering --------------------------------------------------------------------------

// Plan key of a workout for the plan filter: plan id, 'free' or 'activity'.
export const workoutPlanKey = workout => (workout.kind === 'activity' ? 'activity' : workout.plan?.planId ?? 'free');

// Workouts matching the workout filters (range, plans, day, status). Skipped entries
// stay (the calendar needs them) unless a status filter is set.
export function filterWorkouts(workouts, filters, range = null) {
  return workouts.filter(
    workout =>
      inRange(workout.date, range) &&
      (!filters.plans.length || filters.plans.includes(workoutPlanKey(workout))) &&
      (!filters.day || workout.plan?.dayId === filters.day) &&
      (!filters.status.length || filters.status.includes(workoutStatus(workout)))
  );
}

const kindOfRow = row => {
  if (!row.category) return 'custom';
  return KINDS.find(kind => KIND_CATEGORIES[kind].includes(row.category)) ?? null;
};

// Rows matching all filters: the workout filters (on the row's workout fields) and
// the set filters. Group and muscle pick sets of exercises with a share > 0 there;
// warm-up rows stay only with `warmups`.
export function filterRows(rows, filters, range = null) {
  const muscleOrGroup = [filters.group, filters.muscle].filter(Boolean);
  return rows.filter(
    row =>
      inRange(row.date, range) &&
      (!filters.plans.length || filters.plans.includes(row.planId)) &&
      (!filters.day || row.dayId === filters.day) &&
      (!filters.status.length || filters.status.includes(row.trainingStatus)) &&
      (filters.warmups || row.type !== 'warmup') &&
      (!filters.kind.length || filters.kind.includes(kindOfRow(row))) &&
      (!filters.exercise || row.exerciseKey === filters.exercise) &&
      muscleOrGroup.every(id => contributionTo(rowContributions(row), id) > 0)
  );
}
