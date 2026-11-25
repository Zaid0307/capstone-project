import { countsAsTraining, workoutSummary } from '../workoutLog';
import { WEEKDAYS, dayWeekdays } from '../workoutPlan';
import { addDays, asDateKey, mondayOf, weekKeyOf, weekdayIndex } from './dates';

// Plan adherence (content) and schedule adherence (dates)
// (docs/ux/03-analysen-und-architektur.md, 3.5 and 3.6).
//
// Plans may carry schedule data that is added later by the plan editor:
// schedule.startDate, schedule.endDate, schedule.daysPerWeek and plan.isActive
// (or plan.archived). Every field is optional: missing isActive counts as active,
// missing daysPerWeek as the number of plan days, missing startDate as the date of
// the first workout of the plan. Several plans may be active at the same time.

export const ON_PLAN_THRESHOLD = 0.8;

// 'onPlan' (≥ 80 % of planned sets met), 'deviated', 'other' (no plan targets) or
// 'skipped' (planned training that did not happen).
// Choice: a plan workout without any planned working set counts as 'other', like a
// free workout, because there is nothing to compare with.
export function workoutStatus(workout) {
  if (workout.status === 'skipped') return 'skipped';
  const { adherence } = workoutSummary(workout);
  if (!workout.plan || adherence === null) return 'other';
  return adherence >= ON_PLAN_THRESHOLD ? 'onPlan' : 'deviated';
}

// Met and planned working sets of done workouts, pooled (set-weighted), not the mean
// of the percentages. value is null without planned sets.
export function pooledAdherence(workouts) {
  let met = 0;
  let planned = 0;
  for (const workout of workouts) {
    if (!countsAsTraining(workout)) continue;
    const summary = workoutSummary(workout);
    if (!summary.plannedSets) continue;
    planned += summary.plannedSets;
    // adherence = met / planned, rounding removes the floating point error.
    met += Math.round(summary.adherence * summary.plannedSets);
  }
  return { met, planned, value: planned ? met / planned : null };
}

// Pooled adherence per ISO week, keyed by week ('2026-W46').
export function adherenceByWeek(workouts) {
  const byWeek = {};
  for (const workout of workouts) (byWeek[weekKeyOf(workout.date)] ??= []).push(workout);
  return Object.fromEntries(Object.entries(byWeek).map(([week, items]) => [week, pooledAdherence(items)]));
}

// Plan schedule fields ------------------------------------------------------------

// Reads the optional schedule fields; they may sit on plan.schedule or on the plan.
export function planSchedule(plan) {
  const schedule = plan.schedule ?? {};
  const days = plan.days ?? [];
  return {
    type: schedule.type === 'rotation' ? 'rotation' : 'weekdays',
    startDate: schedule.startDate ?? plan.startDate ?? null,
    endDate: schedule.endDate ?? plan.endDate ?? null,
    daysPerWeek: schedule.daysPerWeek ?? plan.daysPerWeek ?? days.length,
  };
}

export const isPlanActive = plan => (plan.isActive ?? !plan.archived) !== false;

// Choice: a plan counts for the schedule while it is active; an inactive plan with an
// end date still counts up to that date (it was active then). An inactive plan
// without end date is left out completely.
const plansForSchedule = plans => plans.filter(plan => isPlanActive(plan) || planSchedule(plan).endDate);

function firstWorkoutDate(planId, workouts) {
  let first = null;
  for (const workout of workouts) {
    if (workout.plan?.planId === planId && (first === null || workout.date < first)) first = workout.date;
  }
  return first;
}

// The days of a plan that can be scheduled: [from, to] or null.
function scheduledSpan(plan, range, today, workouts) {
  const schedule = planSchedule(plan);
  const start = schedule.startDate ?? firstWorkoutDate(plan.id, workouts);
  if (!start) return null;
  const yesterday = addDays(asDateKey(today), -1);
  const from = [range.from, start].filter(Boolean).sort().pop();
  const to = [range.to, schedule.endDate, yesterday].filter(Boolean).sort()[0];
  return from <= to ? { from, to, schedule } : null;
}

// Planned sessions of all active plans in a range, up to yesterday.
// Weekday plans: one entry per date whose weekday is a plan day { planId, dayId, date, weekKey }.
// Rotation plans: daysPerWeek entries per complete week inside the span { planId, dayId: null, date: null, weekKey }.
// Without startDate the first workout of the plan starts the schedule, so the
// workouts are needed (optional fourth argument; without them such plans plan nothing).
export function scheduledSessions(plans, range, today, workouts = []) {
  const sessions = [];
  for (const plan of plansForSchedule(plans)) {
    const span = scheduledSpan(plan, range, today, workouts);
    if (!span) continue;
    const { from, to, schedule } = span;
    if (schedule.type === 'rotation') {
      // Choice: only weeks completely inside the span count ("pro vollständiger Woche").
      let monday = weekdayIndex(from) === 0 ? from : addDays(mondayOf(from), 7);
      for (; addDays(monday, 6) <= to; monday = addDays(monday, 7)) {
        for (let index = 0; index < schedule.daysPerWeek; index++) {
          sessions.push({ planId: plan.id, dayId: null, date: null, weekKey: weekKeyOf(monday) });
        }
      }
      continue;
    }
    // One entry per weekday; a day trained on several weekdays appears for each of them.
    const dayByWeekday = new Map();
    for (const day of plan.days ?? []) {
      for (const weekday of dayWeekdays(day)) {
        if (!dayByWeekday.has(weekday)) dayByWeekday.set(weekday, day);
      }
    }
    if (!dayByWeekday.size) continue;
    for (let date = from; date <= to; date = addDays(date, 1)) {
      const day = dayByWeekday.get(WEEKDAYS[weekdayIndex(date)]);
      if (day) sessions.push({ planId: plan.id, dayId: day.id, date, weekKey: weekKeyOf(date) });
    }
  }
  return sessions;
}

// Done planned sessions / planned sessions. A planned weekday is done when a done
// workout of the same plan and day exists in the same ISO week (also when moved);
// each workout covers at most one planned day. Rotation: min(workouts of the plan in
// the week, daysPerWeek). Returns totals and the same numbers per plan and per week.
export function scheduleAdherence(plans, workouts, range, today) {
  const sessions = scheduledSessions(plans, range, today, workouts);
  const todayKey = asDateKey(today);
  // Done workouts per plan + week (+ day), counted up to today.
  const available = new Map();
  for (const workout of workouts) {
    if (!countsAsTraining(workout) || !workout.plan || workout.date > todayKey) continue;
    const week = weekKeyOf(workout.date);
    for (const key of [`${workout.plan.planId}|${week}`, `${workout.plan.planId}|${week}|${workout.plan.dayId}`]) {
      available.set(key, (available.get(key) ?? 0) + 1);
    }
  }
  const total = { planned: 0, done: 0 };
  const byPlan = {};
  const byWeek = {};
  const add = (session, done) => {
    for (const bucket of [total, (byPlan[session.planId] ??= { planned: 0, done: 0 }), (byWeek[session.weekKey] ??= { planned: 0, done: 0 })]) {
      bucket.planned += 1;
      bucket.done += done ? 1 : 0;
    }
  };
  for (const session of sessions) {
    const key = session.dayId === null
      ? `${session.planId}|${session.weekKey}`
      : `${session.planId}|${session.weekKey}|${session.dayId}`;
    const left = available.get(key) ?? 0;
    if (left > 0) available.set(key, left - 1);
    add(session, left > 0);
  }
  const withValue = bucket => ({ ...bucket, value: bucket.planned ? bucket.done / bucket.planned : null });
  return {
    ...withValue(total),
    byPlan: Object.fromEntries(Object.entries(byPlan).map(([id, bucket]) => [id, withValue(bucket)])),
    byWeek: Object.fromEntries(Object.entries(byWeek).map(([week, bucket]) => [week, withValue(bucket)])),
  };
}
