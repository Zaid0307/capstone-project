import { longestWeekStreak, streakWorkouts, weekStreak, weeklyTargetOf, workoutCounts, workoutsPerWeek } from './consistency';
import { makePlan, makeWorkout } from './testing';

const TODAY = '2026-11-13'; // Friday of week 46
const done = (...dates) => dates.map(date => makeWorkout({ date }));

describe('weekStreak', () => {
  it('counts finished weeks reaching the target, back from last week', () => {
    const workouts = done('2026-10-27', '2026-10-29', '2026-11-03', '2026-11-06');
    expect(weekStreak(workouts, 2, TODAY)).toBe(2);
  });

  it('does not break the streak in the running week below target', () => {
    const workouts = done('2026-10-27', '2026-10-29', '2026-11-03', '2026-11-06', '2026-11-10');
    expect(weekStreak(workouts, 2, TODAY)).toBe(2);
  });

  it('extends the streak as soon as the running week reaches the target', () => {
    const workouts = done('2026-10-27', '2026-10-29', '2026-11-03', '2026-11-06', '2026-11-10', '2026-11-12');
    expect(weekStreak(workouts, 2, TODAY)).toBe(3);
  });

  it('is reset by a gap of one week', () => {
    const workouts = done('2026-10-20', '2026-10-27', '2026-11-10');
    expect(weekStreak(workouts, 1, TODAY)).toBe(1); // only the running week
    expect(weekStreak(done('2026-10-20', '2026-10-27'), 1, TODAY)).toBe(0);
  });

  it('ignores skipped workouts and works across the turn of the year', () => {
    const workouts = [...done('2026-12-21', '2026-12-31', '2027-01-05'), makeWorkout({ date: '2027-01-12', status: 'skipped' })];
    expect(weekStreak(workouts, 1, '2027-01-13')).toBe(3);
    expect(longestWeekStreak(workouts, 1, '2027-01-13')).toBe(3);
  });

  it('finds the longest streak in the history', () => {
    const workouts = done('2026-09-01', '2026-09-08', '2026-09-15', '2026-09-22', '2026-10-13', '2026-11-03');
    expect(longestWeekStreak(workouts, 1, TODAY)).toBe(4);
    expect(longestWeekStreak([], 1, TODAY)).toBe(0);
  });
});

describe('weekly target and counts', () => {
  it('takes a goal, else the most planned sessions of one active plan, else 1', () => {
    const weekdays = makePlan({ days: [{ id: 'a', weekday: 'monday' }, { id: 'b', weekday: 'thursday' }] });
    const rotation = makePlan({ type: 'rotation', days: [{ id: 'x' }, { id: 'y' }], schedule: { daysPerWeek: 3 } });
    expect(weeklyTargetOf([weekdays, rotation], 4)).toBe(4);
    expect(weeklyTargetOf([weekdays, rotation])).toBe(3);
    expect(weeklyTargetOf([{ ...weekdays, isActive: false }])).toBe(1);
    expect(weeklyTargetOf()).toBe(1);
  });

  it('leaves plans with only mobility, stretching or cardio out of the target', () => {
    const entry = exerciseId => ({ id: exerciseId, exerciseId, exercise: '', muscle: '', sets: [] });
    const weekdays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const strength = makePlan({
      id: 'strength',
      days: weekdays.slice(0, 4).map(weekday => ({ id: weekday, weekday, entries: [entry('barbell_squat'), entry('cat_cow')] })),
    });
    const mobility = makePlan({
      id: 'mobility',
      days: weekdays.map(weekday => ({ id: weekday, weekday, entries: [entry('cat_cow'), entry('wall_pec_stretch')] })),
    });
    // Strength 4 days + mobility 6 days: the goal is 4, not 10.
    expect(weeklyTargetOf([strength, mobility])).toBe(4);
    expect(weeklyTargetOf([mobility])).toBe(1);

    // Mobility workouts still count as workouts for the streak.
    const workouts = [
      ...['2026-11-02', '2026-11-03'].map(date => makeWorkout({ date, plan: { planId: 'strength', dayId: 'monday' } })),
      ...['2026-11-04', '2026-11-05'].map(date => makeWorkout({ date, plan: { planId: 'mobility', dayId: 'monday' } })),
    ];
    const counted = streakWorkouts(workouts, [strength, mobility]);
    expect(weekStreak(counted, weeklyTargetOf([strength, mobility]), TODAY)).toBe(1);
  });

  it('counts free workouts and workouts of active plans for the streak', () => {
    const active = makePlan({ id: 'active' });
    const archived = makePlan({ id: 'old', archived: true });
    const workouts = [
      makeWorkout({ id: 'free', date: '2026-11-02' }),
      makeWorkout({ id: 'mine', date: '2026-11-03', plan: { planId: 'active', dayId: 'a' } }),
      makeWorkout({ id: 'gone', date: '2026-11-04', plan: { planId: 'old', dayId: 'a' } }),
      makeWorkout({ id: 'deleted', date: '2026-11-05', plan: { planId: 'missing', dayId: 'a' } }),
    ];
    expect(streakWorkouts(workouts, [active, archived]).map(workout => workout.id)).toEqual(['free', 'mine']);
  });

  it('lists workouts per week including empty and running weeks', () => {
    const workouts = [...done('2026-11-02', '2026-11-03', '2026-11-12'), makeWorkout({ date: '2026-11-11', status: 'skipped' })];
    expect(workoutsPerWeek(workouts, { from: '2026-10-26', to: TODAY }, TODAY)).toEqual([
      { weekKey: '2026-W44', monday: '2026-10-26', count: 0, inProgress: false },
      { weekKey: '2026-W45', monday: '2026-11-02', count: 2, inProgress: false },
      { weekKey: '2026-W46', monday: '2026-11-09', count: 1, inProgress: true },
    ]);
    expect(workoutCounts([...workouts, ...done('2026-11-12')])).toEqual({ workouts: 4, trainingDays: 3 });
  });
});
