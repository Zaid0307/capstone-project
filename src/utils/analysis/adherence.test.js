import {
  adherenceByWeek,
  isPlanActive,
  planSchedule,
  pooledAdherence,
  scheduleAdherence,
  scheduledSessions,
  workoutStatus,
} from './adherence';
import { loggedExercise, makePlan, makeWorkout, repsDose, set, target } from './testing';

const TODAY = '2026-11-13'; // Friday of week 46
const planned = target(repsDose(8, 12), 50);
const met = () => set({ weight: 50, reps: 10, planned });
const missed = () => set({ weight: 50, reps: 5, planned });

function planWorkout(date, metCount, missedCount, plan = { planId: 'a', dayId: 'd1' }) {
  const sets = [...Array.from({ length: metCount }, met), ...Array.from({ length: missedCount }, missed)];
  return makeWorkout({ date, plan, exercises: [loggedExercise({ exerciseId: 'barbell_bench_press', sets })] });
}

describe('plan adherence', () => {
  it('pools sets instead of averaging percentages', () => {
    const workouts = [planWorkout('2026-11-09', 1, 1), planWorkout('2026-11-11', 9, 1)];
    const result = pooledAdherence(workouts);
    expect(result).toEqual({ met: 10, planned: 12, value: 10 / 12 });
    expect(result.value).toBeCloseTo(0.833, 3); // the mean of the percentages would be 0.7
  });

  it('counts skipped exercises as planned and ignores skipped workouts and free workouts', () => {
    const skippedExercise = makeWorkout({
      date: '2026-11-10',
      plan: { planId: 'a', dayId: 'd1' },
      exercises: [
        loggedExercise({ exerciseId: 'push_up', skipped: true, sets: [set({ reps: 10, planned }), set({ reps: 10, planned })] }),
        // One extra done set, so the workout counts as a training (countsAsTraining).
        loggedExercise({ exerciseId: 'plank', sets: [set({ seconds: 30 })] }),
      ],
    });
    const workouts = [
      planWorkout('2026-11-09', 2, 0),
      skippedExercise,
      makeWorkout({ date: '2026-11-11', status: 'skipped', plan: { planId: 'a', dayId: 'd2' } }),
      makeWorkout({ date: '2026-11-12', exercises: [loggedExercise({ exerciseId: 'push_up', sets: [set({ reps: 10 })] })] }),
    ];
    expect(pooledAdherence(workouts)).toEqual({ met: 2, planned: 4, value: 0.5 });
    expect(pooledAdherence([])).toEqual({ met: 0, planned: 0, value: null });
  });

  it('pools per week', () => {
    const byWeek = adherenceByWeek([planWorkout('2026-11-06', 1, 1), planWorkout('2026-11-09', 3, 0), planWorkout('2026-11-10', 0, 1)]);
    expect(byWeek['2026-W45'].value).toBe(0.5);
    expect(byWeek['2026-W46']).toEqual({ met: 3, planned: 4, value: 0.75 });
  });

  it('gives each workout a status', () => {
    expect(workoutStatus(planWorkout('2026-11-09', 4, 1))).toBe('onPlan');
    expect(workoutStatus(planWorkout('2026-11-09', 3, 1))).toBe('deviated');
    expect(workoutStatus(makeWorkout({ date: '2026-11-09' }))).toBe('other');
    expect(workoutStatus(makeWorkout({ date: '2026-11-09', status: 'skipped', plan: { planId: 'a', dayId: 'd1' } }))).toBe('skipped');
  });
});

describe('plan schedule fields', () => {
  it('works without the new fields', () => {
    const plan = makePlan({ days: [{ id: 'd1', weekday: 'monday' }, { id: 'd2', weekday: 'thursday' }] });
    expect(isPlanActive(plan)).toBe(true);
    expect(planSchedule(plan)).toEqual({ type: 'weekdays', startDate: null, endDate: null, daysPerWeek: 2 });
    expect(isPlanActive({ ...plan, isActive: false })).toBe(false);
    expect(isPlanActive({ ...plan, archived: true })).toBe(false);
  });
});

describe('schedule adherence', () => {
  const weekdayPlan = (schedule = { startDate: '2026-11-02' }, extra = {}) =>
    makePlan({ id: 'a', days: [{ id: 'd1', weekday: 'monday' }, { id: 'd2', weekday: 'thursday' }], schedule, ...extra });
  const range = { from: '2026-10-01', to: TODAY };

  it('plans weekday sessions from the start date up to yesterday', () => {
    const sessions = scheduledSessions([weekdayPlan()], range, TODAY);
    expect(sessions.map(session => [session.date, session.dayId, session.weekKey])).toEqual([
      ['2026-11-02', 'd1', '2026-W45'],
      ['2026-11-05', 'd2', '2026-W45'],
      ['2026-11-09', 'd1', '2026-W46'],
      ['2026-11-12', 'd2', '2026-W46'],
    ]);
    expect(scheduledSessions([weekdayPlan()], { from: '2026-10-01', to: '2026-10-31' }, TODAY)).toEqual([]);
    expect(scheduledSessions([weekdayPlan({ startDate: '2026-11-02', endDate: '2026-11-06' })], range, TODAY)).toHaveLength(2);
  });

  it('plans a day on each of its weekdays', () => {
    const plan = makePlan({ id: 'f', days: [{ id: 'full', weekdays: ['monday', 'thursday'] }], schedule: { startDate: '2026-11-02' } });
    expect(scheduledSessions([plan], range, TODAY).map(session => [session.date, session.dayId])).toEqual([
      ['2026-11-02', 'full'],
      ['2026-11-05', 'full'],
      ['2026-11-09', 'full'],
      ['2026-11-12', 'full'],
    ]);
  });

  it('counts a moved workout in the same week, each workout covering one planned day', () => {
    const d1 = { planId: 'a', dayId: 'd1' };
    const workouts = [
      planWorkout('2026-11-03', 1, 0, d1), // moved from Monday to Tuesday
      planWorkout('2026-11-04', 1, 0, d1), // a second d1 does not cover d2
      planWorkout('2026-11-05', 1, 0, { planId: 'a', dayId: 'd2' }),
      planWorkout('2026-11-09', 1, 0, d1),
      makeWorkout({ date: '2026-11-12', status: 'skipped', plan: { planId: 'a', dayId: 'd2' } }),
    ];
    const result = scheduleAdherence([weekdayPlan()], workouts, range, TODAY);
    expect(result).toMatchObject({ planned: 4, done: 3, value: 0.75 });
    expect(result.byWeek['2026-W45']).toMatchObject({ planned: 2, done: 2 });
    expect(result.byWeek['2026-W46']).toMatchObject({ planned: 2, done: 1 });
    expect(result.byPlan.a).toMatchObject({ planned: 4, done: 3 });
  });

  it('caps rotation plans at daysPerWeek per complete week', () => {
    const plan = makePlan({ id: 'r', type: 'rotation', days: [{ id: 'A' }, { id: 'B' }], schedule: { startDate: '2026-11-02', daysPerWeek: 3 } });
    const workouts = ['2026-11-02', '2026-11-03', '2026-11-05', '2026-11-07', '2026-11-10'].map(date => planWorkout(date, 1, 0, { planId: 'r', dayId: 'A' }));
    const result = scheduleAdherence([plan], workouts, range, TODAY);
    // Week 46 is not complete yet, so only week 45 is planned.
    expect(result).toMatchObject({ planned: 3, done: 3, value: 1 });
  });

  it('starts at the first workout without start date and handles several plans', () => {
    const second = makePlan({ id: 'b', days: [{ id: 'm', weekday: 'wednesday' }] });
    const workouts = [planWorkout('2026-11-04', 1, 0, { planId: 'b', dayId: 'm' })];
    const sessions = scheduledSessions([weekdayPlan(), second], range, TODAY, workouts);
    expect(sessions.filter(session => session.planId === 'b').map(session => session.date)).toEqual(['2026-11-04', '2026-11-11']);
    expect(scheduleAdherence([weekdayPlan(), second], workouts, range, TODAY).byPlan.b).toMatchObject({ planned: 2, done: 1 });
    // Without start date and workouts there is nothing to plan.
    expect(scheduledSessions([second], range, TODAY)).toEqual([]);
  });

  it('leaves out inactive plans, but counts ended plans up to their end date', () => {
    expect(scheduledSessions([weekdayPlan(undefined, { isActive: false })], range, TODAY)).toEqual([]);
    const ended = weekdayPlan({ startDate: '2026-11-02', endDate: '2026-11-08' }, { isActive: false });
    expect(scheduledSessions([ended], range, TODAY)).toHaveLength(2);
  });
});
