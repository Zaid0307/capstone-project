import { calendarMonth, dayStatus, monthGrid, setOutcome, shiftMonth } from './calendar';
import { loggedExercise, makePlan, makeWorkout, repsDose, secondsDose, set, sideSet, target } from './testing';

const TODAY = '2026-11-13'; // Friday of week 46
const planned = target(repsDose(8, 12), 50);
const planWorkout = (date, reps, dayId = 'mon', planId = 'a', extra = {}) =>
  makeWorkout({
    date,
    plan: { planId, dayId },
    exercises: [loggedExercise({ exerciseId: 'barbell_bench_press', sets: [set({ weight: 50, reps, planned })] })],
    ...extra,
  });

const plan = makePlan({
  id: 'a',
  days: [
    { id: 'mon', weekday: 'monday' },
    { id: 'thu', weekday: 'thursday' },
  ],
  schedule: { startDate: '2026-11-01' },
});

const findDay = (weeks, date) => weeks.flatMap(week => week.days).find(day => day.date === date);

describe('month grid', () => {
  it('starts on Monday and covers the month', () => {
    const weeks = monthGrid('2026-11');
    expect(weeks[0][0]).toBe('2026-10-26');
    expect(weeks[weeks.length - 1][6]).toBe('2026-12-06');
    expect(weeks).toHaveLength(6);
  });

  it('shifts months across years', () => {
    expect(shiftMonth('2026-12', 1)).toBe('2027-01');
    expect(shiftMonth('2026-01', -1)).toBe('2025-12');
  });
});

describe('calendarMonth', () => {
  it('marks done, moved, missed, open and planned days', () => {
    const workouts = [
      planWorkout('2026-11-02', 10), // Monday on plan
      // Week 46: Monday moved to Tuesday (covers Monday), Thursday not trained yet
      planWorkout('2026-11-10', 5),
    ];
    const weeks = calendarMonth([plan], workouts, '2026-11', TODAY);
    expect(findDay(weeks, '2026-11-02').status).toBe('onPlan');
    // Thursday of week 45 is over and was not trained.
    expect(findDay(weeks, '2026-11-05').status).toBe('missed');
    // Monday of week 46 was done on Tuesday: no status of its own.
    expect(findDay(weeks, '2026-11-09').planned[0].state).toBe('done');
    expect(findDay(weeks, '2026-11-09').status).toBe('rest');
    expect(findDay(weeks, '2026-11-10').status).toBe('deviated');
    // Thursday of the running week: still open, shown as planned.
    expect(findDay(weeks, '2026-11-12').planned[0].state).toBe('open');
    expect(findDay(weeks, '2026-11-12').status).toBe('planned');
    expect(findDay(weeks, '2026-11-16').status).toBe('planned');
    expect(findDay(weeks, '2026-11-13').isToday).toBe(true);
    // Days before the start date are rest days.
    expect(findDay(weeks, '2026-10-29').status).toBe('rest');
    const week46 = weeks.find(week => week.weekKey === '2026-W46');
    expect(week46).toMatchObject({ planned: 2, done: 1 });
  });

  it('marks a skipped entry as missed with its reason and counts several workouts', () => {
    const workouts = [
      { ...makeWorkout({ date: '2026-11-12', status: 'skipped', plan: { planId: 'a', dayId: 'thu' } }), note: 'krank' },
      makeWorkout({ date: '2026-11-11', exercises: [loggedExercise({ exercise: 'Run', sets: [set({ seconds: 600 })] })] }),
      makeWorkout({ date: '2026-11-11', exercises: [loggedExercise({ exercise: 'Swim', sets: [set({ seconds: 600 })] })] }),
    ];
    const weeks = calendarMonth([plan], workouts, '2026-11', TODAY);
    const thursday = findDay(weeks, '2026-11-12');
    expect(thursday.status).toBe('missed');
    expect(thursday.planned[0].skippedBy.note).toBe('krank');
    const wednesday = findDay(weeks, '2026-11-11');
    expect(wednesday.status).toBe('other');
    expect(wednesday.doneCount).toBe(2);
  });

  it('follows the status priority', () => {
    const onPlan = planWorkout('2026-11-02', 10);
    const deviated = planWorkout('2026-11-02', 5);
    expect(dayStatus({ workouts: [deviated, onPlan] })).toBe('onPlan');
    expect(dayStatus({ workouts: [], planned: [{ state: 'missed' }, { state: 'upcoming' }] })).toBe('missed');
    expect(dayStatus({})).toBe('rest');
  });

  it('does not count an empty or just started training as trained', () => {
    const empty = makeWorkout({ date: '2026-11-11', plan: { planId: 'a', dayId: 'thu' } });
    expect(dayStatus({ workouts: [empty] })).toBe('rest');
    const weeks = calendarMonth([plan], [{ ...empty, date: '2026-11-12' }], '2026-11', TODAY);
    const thursday = findDay(weeks, '2026-11-12');
    expect(thursday).toMatchObject({ status: 'planned', doneCount: 0 });
    expect(thursday.planned[0].state).toBe('open');
  });
});

describe('setOutcome', () => {
  it('compares a set with its target', () => {
    expect(setOutcome(set({ weight: 50, reps: 10, planned }))).toBe('met');
    expect(setOutcome(set({ weight: 50, reps: 13, planned }))).toBe('more');
    expect(setOutcome(set({ weight: 55, reps: 8, planned }))).toBe('more');
    expect(setOutcome(set({ weight: 50, reps: 6, planned }))).toBe('repsBelow');
    expect(setOutcome(set({ weight: 40, reps: 10, planned }))).toBe('weightBelow');
    expect(setOutcome(set({ planned }))).toBe('notDone');
    expect(setOutcome(set({ weight: 50, reps: 10, planned }), { skipped: true })).toBe('notDone');
    expect(setOutcome(set({ weight: 50, reps: 10 }))).toBe('extra');
    expect(setOutcome(set({ seconds: 20, planned: target(secondsDose(30)) }))).toBe('secondsBelow');
    expect(setOutcome(sideSet({ weight: 20, reps: 10 }, { weight: 20, reps: 6 }, { planned: target(repsDose(8, 12), 20) }))).toBe('repsBelow');
  });
});
