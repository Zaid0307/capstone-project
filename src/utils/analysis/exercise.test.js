import { exerciseBests, firstToLast, sessionMetric } from './exercise';
import { toSetRows } from './setRows';
import { sessionBest } from './strength';
import { loggedExercise, makeWorkout, set, sideSet } from './testing';

const squat = (date, sets) => makeWorkout({ date, exercises: [loggedExercise({ exerciseId: 'barbell_squat', sets })] });

describe('exerciseBests', () => {
  it('keeps the best value per type with the first date it was reached', () => {
    const rows = toSetRows([
      squat('2026-11-02', [set({ weight: 100, reps: 5 }), set({ weight: 90, reps: 8 })]),
      squat('2026-11-05', [set({ weight: 100, reps: 5 })]),
      squat('2026-11-09', [set({ weight: 105, reps: 3 })]),
    ]);
    const bests = exerciseBests(rows, 'barbell_squat');
    const of = type => bests.find(best => best.type === type);
    expect(of('heaviestWeight')).toMatchObject({ value: 105, date: '2026-11-09' });
    expect(of('bestE1rm').value).toBeCloseTo(116.67, 2);
    expect(of('bestE1rm').date).toBe('2026-11-02');
    expect(of('bestSetVolume')).toMatchObject({ value: 720, date: '2026-11-02' });
    expect(of('bestSessionVolume')).toMatchObject({ value: 1220, date: '2026-11-02' });
    expect(of('mostReps')).toBeUndefined();
  });

  it('keeps sides apart and counts reps without weight', () => {
    const rows = toSetRows([
      makeWorkout({
        date: '2026-11-02',
        exercises: [loggedExercise({ exerciseId: 'bulgarian_split_squat', sets: [sideSet({ weight: 20, reps: 10 }, { weight: 20, reps: 8 })] })],
      }),
      makeWorkout({ date: '2026-11-03', exercises: [loggedExercise({ exerciseId: 'push_up', sets: [set({ reps: 20 })] })] }),
    ]);
    const split = exerciseBests(rows, 'bulgarian_split_squat').filter(best => best.type === 'heaviestWeight');
    expect(split.map(best => best.side)).toEqual(['left', 'right']);
    expect(exerciseBests(rows, 'push_up')).toEqual([{ type: 'mostReps', side: null, value: 20, date: '2026-11-03', workoutId: expect.any(String) }]);
  });
});

describe('sessionMetric and firstToLast', () => {
  it('reads metrics of a session and the change over time', () => {
    const [session] = sessionBest(toSetRows([squat('2026-11-02', [set({ weight: 100, reps: 5 })])]));
    expect(sessionMetric(session, 'weight')).toBe(100);
    expect(sessionMetric(session, 'volume')).toBe(500);
    expect(sessionMetric(session, 'reps')).toBe(5);
    expect(firstToLast([100, null, 110])).toEqual({ first: 100, last: 110, difference: 10, percent: 0.1 });
    expect(firstToLast([100])).toBeNull();
  });
});
