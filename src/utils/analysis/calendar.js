import { isSetDone, meetsTarget, setValues } from '../workoutLog';
import { addDays, asDateKey, mondayOf, weekKeyOf } from './dates';
import { scheduledSessions, workoutStatus } from './adherence';

// Calendar month with a status per day (docs/ux/03-analysen-und-architektur.md, 4.6).
//
// Status priority when several things happen on one day:
// onPlan > deviated > other > missed > planned > rest.
export const DAY_STATUSES = ['onPlan', 'deviated', 'other', 'missed', 'planned', 'rest'];

const pad = number => String(number).padStart(2, '0');

export const isMonthKey = value => typeof value === 'string' && /^\d{4}-(0[1-9]|1[0-2])$/.test(value);

// '2026-11' + 1 → '2026-12'.
export function shiftMonth(monthKey, delta) {
  const [year, month] = monthKey.split('-').map(Number);
  const index = year * 12 + (month - 1) + delta;
  return `${Math.floor(index / 12)}-${pad((index % 12) + 1)}`;
}

export function lastDayOfMonth(monthKey) {
  return addDays(`${shiftMonth(monthKey, 1)}-01`, -1);
}

// Weeks (Monday to Sunday) that touch the month: [[dateKey × 7], …].
export function monthGrid(monthKey) {
  const first = `${monthKey}-01`;
  const last = lastDayOfMonth(monthKey);
  const weeks = [];
  for (let monday = mondayOf(first); monday <= last; monday = addDays(monday, 7)) {
    weeks.push(Array.from({ length: 7 }, (_, index) => addDays(monday, index)));
  }
  return weeks;
}

// The status of a day from what happened and what was planned.
export function dayStatus({ workouts = [], planned = [] }) {
  const found = new Set();
  for (const workout of workouts) {
    const status = workoutStatus(workout);
    found.add(status === 'skipped' ? 'missed' : status);
  }
  for (const session of planned) {
    if (session.state === 'missed') found.add('missed');
    if (session.state === 'open' || session.state === 'upcoming') found.add('planned');
  }
  return DAY_STATUSES.find(status => found.has(status)) ?? 'rest';
}

const byDateThenCreated = (a, b) => a.date.localeCompare(b.date) || (a.createdAt ?? '').localeCompare(b.createdAt ?? '');

// The month as weeks of days.
// day  { date, inMonth, isToday, isFuture, status, workouts, doneCount, planned }
//   planned: sessions of weekday plans on this date
//            { planId, dayId, date, state, coveredBy, skippedBy }
//            state: 'done' (trained in the same week, also when moved), 'upcoming'
//            (today or later), 'open' (past, the week is still running) or 'missed'
//            (the week is over, or the day was entered as skipped)
// week { weekKey, days, planned, done } – planned/done sessions of the week,
//      including rotation plans (they have no fixed date).
// plans and workouts should already be filtered by the plan filter.
export function calendarMonth(plans, workouts, monthKey, today) {
  const todayKey = asDateKey(today);
  const grid = monthGrid(monthKey);
  const from = grid[0][0];
  const to = grid[grid.length - 1][6];
  // A "today" after the grid lets scheduledSessions plan future days as well.
  const sessions = scheduledSessions(plans, { from, to }, addDays(to, 1), workouts).map(session => ({
    ...session,
    state: 'upcoming',
    coveredBy: null,
    skippedBy: null,
  }));

  // Done plan workouts up to today, per plan + week (+ day), oldest first.
  const pool = new Map();
  const skippedPool = new Map();
  for (const workout of [...workouts].sort(byDateThenCreated)) {
    if (!workout.plan || workout.date < from || workout.date > to) continue;
    const week = weekKeyOf(workout.date);
    const target = workout.status === 'skipped' ? skippedPool : workout.date <= todayKey ? pool : null;
    if (!target) continue;
    for (const key of [`${workout.plan.planId}|${week}|${workout.plan.dayId}`, `${workout.plan.planId}|${week}`]) {
      if (!target.has(key)) target.set(key, []);
      target.get(key).push(workout);
    }
  }
  const used = new Set();
  const take = (key, date) => {
    const candidates = (pool.get(key) ?? []).filter(workout => !used.has(workout.id));
    // A workout on the planned date covers that date first, then the earliest one.
    const chosen = candidates.find(workout => workout.date === date) ?? candidates[0] ?? null;
    if (chosen) used.add(chosen.id);
    return chosen;
  };
  // Dated sessions first, so a workout on its own planned day covers that day.
  const ordered = [...sessions].sort((a, b) => (a.date === null) - (b.date === null) || (a.date ?? '').localeCompare(b.date ?? ''));
  for (const session of ordered) {
    const key = session.dayId === null ? `${session.planId}|${session.weekKey}` : `${session.planId}|${session.weekKey}|${session.dayId}`;
    session.coveredBy = take(key, session.date);
    if (session.coveredBy) {
      session.state = 'done';
      continue;
    }
    if (session.date === null) continue;
    session.skippedBy = (skippedPool.get(key) ?? []).find(workout => workout.date === session.date) ?? null;
    const weekOver = addDays(mondayOf(session.date), 6) < todayKey;
    if (session.skippedBy || (session.date < todayKey && weekOver)) session.state = 'missed';
    else if (session.date < todayKey) session.state = 'open';
  }

  const workoutsByDate = new Map();
  for (const workout of workouts) {
    if (workout.date < from || workout.date > to) continue;
    if (!workoutsByDate.has(workout.date)) workoutsByDate.set(workout.date, []);
    workoutsByDate.get(workout.date).push(workout);
  }
  const plannedByDate = new Map();
  for (const session of sessions) {
    if (!session.date) continue;
    if (!plannedByDate.has(session.date)) plannedByDate.set(session.date, []);
    plannedByDate.get(session.date).push(session);
  }

  return grid.map(dates => {
    const weekKey = weekKeyOf(dates[0]);
    const weekSessions = sessions.filter(session => session.weekKey === weekKey);
    return {
      weekKey,
      planned: weekSessions.length,
      done: weekSessions.filter(session => session.state === 'done').length,
      days: dates.map(date => {
        const dayWorkouts = (workoutsByDate.get(date) ?? []).sort(byDateThenCreated);
        const planned = plannedByDate.get(date) ?? [];
        return {
          date,
          inMonth: date.startsWith(monthKey),
          isToday: date === todayKey,
          isFuture: date > todayKey,
          status: dayStatus({ workouts: dayWorkouts, planned }),
          workouts: dayWorkouts,
          doneCount: dayWorkouts.filter(workout => workout.status === 'done').length,
          planned,
        };
      }),
    };
  });
}

// Plan versus actual of one logged set (4.6, 3.6):
// 'met' | 'more' (met and more than planned) | 'repsBelow' | 'secondsBelow' |
// 'weightBelow' | 'notDone' | 'extra' (added set without target).
export function setOutcome(set, { skipped = false } = {}) {
  if (skipped || !isSetDone(set)) return 'notDone';
  if (!set.planned) return 'extra';
  const { dose, weight } = set.planned;
  if (meetsTarget(set)) {
    const values = setValues(set);
    const more = values.some(
      item =>
        (dose.unit !== 'seconds' && dose.max !== undefined && (item.reps ?? 0) > dose.max) ||
        (weight > 0 && (item.weight ?? 0) > weight * 1.05)
    );
    return more ? 'more' : 'met';
  }
  const amountLow = setValues(set).some(item =>
    dose.unit === 'seconds' ? (item.seconds ?? 0) < dose.value : (item.reps ?? 0) < dose.min
  );
  if (amountLow) return dose.unit === 'seconds' ? 'secondsBelow' : 'repsBelow';
  return 'weightBelow';
}
