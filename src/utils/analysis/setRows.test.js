import { workoutSummary } from '../workoutLog';
import { exerciseKeyOf, isCountable, isFirstRowOfSet, toSetRows } from './setRows';
import { loggedExercise, makeWorkout, repsDose, secondsDose, set, sideSet, target } from './testing';

describe('toSetRows', () => {
  it('makes one row per set with workout, week and exercise data', () => {
    const workout = makeWorkout({
      date: '2026-12-31',
      plan: { planId: 'p1', dayId: 'd1' },
      exercises: [
        loggedExercise({
          exerciseId: 'barbell_squat',
          muscle: 'legs',
          sets: [set({ type: 'warmup', weight: 40, reps: 10 }), set({ weight: 100, reps: 5, planned: target(repsDose(5, 5), 100) })],
        }),
      ],
    });
    const rows = toSetRows([workout]);

    expect(rows).toHaveLength(2);
    expect(rows[1]).toMatchObject({
      workoutId: workout.id,
      date: '2026-12-31',
      weekKey: '2026-W53',
      monthKey: '2026-12',
      planId: 'p1',
      dayId: 'd1',
      workoutStatus: 'done',
      trainingStatus: 'onPlan',
      exerciseKey: 'barbell_squat',
      category: 'strength',
      groupOfEntry: 'legs',
      setIndex: 1,
      type: 'working',
      done: true,
      side: null,
      weight: 100,
      reps: 5,
      meetsTarget: true,
    });
    expect(rows[0].type).toBe('warmup');
  });

  it('gives a per-side set two rows with the same set index, counted as one set', () => {
    const rows = toSetRows([
      makeWorkout({
        date: '2027-01-04',
        exercises: [loggedExercise({ exerciseId: 'bulgarian_split_squat', sets: [sideSet({ weight: 20, reps: 8 }, { weight: 20, reps: 7 })] })],
      }),
    ]);

    expect(rows.map(row => [row.side, row.setIndex, row.reps])).toEqual([['left', 0, 8], ['right', 0, 7]]);
    expect(rows[0]).toMatchObject({ weekKey: '2027-W01', planId: 'free', dayId: null, perSide: true, trainingStatus: 'other' });
    expect(rows.filter(isFirstRowOfSet)).toHaveLength(1);
  });

  it('marks a per-side set as done when only one side is entered', () => {
    const rows = toSetRows([
      makeWorkout({ date: '2026-11-13', exercises: [loggedExercise({ exerciseId: 'step_up', sets: [sideSet({ reps: 10 }, {})] })] }),
    ]);
    expect(rows.map(row => row.done)).toEqual([true, true]);
    expect(rows[1].reps).toBeNull();
  });

  it('keeps skipped exercises as not done rows and skipped workouts without countable rows', () => {
    const rows = toSetRows([
      makeWorkout({
        date: '2026-11-13',
        plan: { planId: 'p1', dayId: 'd1' },
        exercises: [loggedExercise({ exerciseId: 'push_up', skipped: true, sets: [set({ reps: 10, planned: target() })] })],
      }),
      makeWorkout({ date: '2026-11-12', status: 'skipped', plan: { planId: 'p1', dayId: 'd2' } }),
    ]);

    expect(rows).toHaveLength(1);
    expect(rows[0]).toMatchObject({ skipped: true, done: false, meetsTarget: false });
    expect(rows.filter(row => isCountable(row))).toHaveLength(0);
  });

  it('only counts warm-up sets when asked to', () => {
    const [warmup] = toSetRows([
      makeWorkout({ date: '2026-11-13', exercises: [loggedExercise({ exerciseId: 'push_up', sets: [set({ type: 'warmup', reps: 5 })] })] }),
    ]);
    expect(isCountable(warmup)).toBe(false);
    expect(isCountable(warmup, { warmups: true })).toBe(true);
  });

  it('builds keys for own exercises from their name', () => {
    expect(exerciseKeyOf({ exerciseId: null, exercise: ' Hula Hoop ' })).toBe('custom:hula%20hoop');
    expect(exerciseKeyOf({ exerciseId: 'push_up', exercise: 'Push-up' })).toBe('push_up');
  });

  it('decides "meets target" exactly like workoutSummary', () => {
    const planned = target(repsDose(8, 12), 50);
    const workout = makeWorkout({
      date: '2026-11-13',
      plan: { planId: 'p1', dayId: 'd1' },
      exercises: [
        loggedExercise({
          exerciseId: 'barbell_bench_press',
          sets: [
            set({ weight: 50, reps: 8, planned }),
            set({ weight: 47.5, reps: 8, planned }), // 95 %
            set({ weight: 47, reps: 12, planned }),
            set({ weight: 50, reps: 7, planned }),
          ],
        }),
        loggedExercise({
          exerciseId: 'side_plank',
          sets: [
            sideSet({ seconds: 30 }, { seconds: 30 }, { planned: target(secondsDose(30)) }),
            sideSet({ seconds: 30 }, { seconds: 20 }, { planned: target(secondsDose(30)) }),
          ],
        }),
      ],
    });
    const rows = toSetRows([workout]).filter(isFirstRowOfSet);
    const met = rows.filter(row => row.meetsTarget).length;

    expect(rows.map(row => row.meetsTarget)).toEqual([true, true, false, false, true, false]);
    expect(met / 6).toBeCloseTo(workoutSummary(workout).adherence);
  });
});
