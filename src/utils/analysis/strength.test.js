import { toSetRows } from './setRows';
import { countSets, estimateOneRepMax, roundToHalf, sessionBest, totalReps, volume, weakerSide } from './strength';
import { loggedExercise, makeWorkout, set, sideSet } from './testing';

describe('estimateOneRepMax', () => {
  it('uses Epley up to 12 repetitions', () => {
    expect(estimateOneRepMax(100, 5)).toBeCloseTo(116.67, 2);
    expect(estimateOneRepMax(100, 1)).toBe(100);
    expect(estimateOneRepMax(60, 12)).toBeCloseTo(84);
  });

  it('gives no estimate above 12 repetitions or without weight', () => {
    expect(estimateOneRepMax(100, 13)).toBeNull();
    expect(estimateOneRepMax(0, 5)).toBeNull();
    expect(estimateOneRepMax(null, 5)).toBeNull();
    expect(estimateOneRepMax(100, 0)).toBeNull();
    expect(estimateOneRepMax(100, null)).toBeNull();
  });

  it('rounds to 0.5 kg only for display', () => {
    expect(roundToHalf(116.6667)).toBe(116.5);
    expect(roundToHalf(116.8)).toBe(117);
    expect(roundToHalf(null)).toBeNull();
  });
});

describe('volume, repetitions and sets', () => {
  const rows = toSetRows([
    makeWorkout({
      date: '2026-11-13',
      exercises: [
        loggedExercise({
          exerciseId: 'bulgarian_split_squat',
          sets: [sideSet({ weight: 20, reps: 10 }, { weight: 20, reps: 8 }), sideSet({ weight: 20, reps: 10 }, {})],
        }),
        loggedExercise({ exerciseId: 'push_up', sets: [set({ type: 'warmup', reps: 5 }), set({ reps: 15 }), set({ weight: null, reps: null })] }),
        loggedExercise({ exerciseId: 'barbell_squat', skipped: true, sets: [set({ weight: 100, reps: 5 })] }),
      ],
    }),
    makeWorkout({ date: '2026-11-12', status: 'skipped' }),
  ]);

  it('adds both sides and leaves out warm-ups unless asked', () => {
    expect(volume(rows)).toBe(20 * 10 + 20 * 8 + 20 * 10);
    expect(totalReps(rows)).toBe(10 + 8 + 10 + 15);
    expect(totalReps(rows, { warmups: true })).toBe(48);
  });

  it('counts a per-side set once and skips skipped exercises and empty sets', () => {
    expect(countSets(rows)).toBe(3);
    expect(countSets(rows, { warmups: true })).toBe(4);
  });
});

describe('sessionBest', () => {
  it('keeps the best numbers per workout, exercise and side', () => {
    const rows = toSetRows([
      makeWorkout({
        id: 'w1',
        date: '2026-11-13',
        exercises: [
          loggedExercise({
            exerciseId: 'barbell_bench_press',
            sets: [set({ type: 'warmup', weight: 120, reps: 1 }), set({ weight: 80, reps: 8 }), set({ weight: 90, reps: 3 }), set({ weight: 90, reps: 4 }), set({ weight: 60, reps: 20 })],
          }),
          loggedExercise({ exerciseId: 'one_arm_dumbbell_row', sets: [sideSet({ weight: 30, reps: 10 }, { weight: 28, reps: 10 })] }),
        ],
      }),
    ]);
    const [bench, left, right] = sessionBest(rows);

    expect(bench).toMatchObject({ workoutId: 'w1', exerciseKey: 'barbell_bench_press', side: null, topSet: { weight: 90, reps: 4 }, sets: 4 });
    expect(bench.e1rm).toBeCloseTo(102); // 90 × (1 + 4/30); 80 × 8 gives 101.3, 60 × 20 none
    expect(bench.volume).toBe(80 * 8 + 90 * 3 + 90 * 4 + 60 * 20);
    expect(left).toMatchObject({ side: 'left', topSet: { weight: 30, reps: 10 } });
    expect(right.e1rm).toBeCloseTo(28 * (1 + 10 / 30));
    expect(weakerSide(left.e1rm, right.e1rm)).toBe(right.e1rm);
    expect(weakerSide(40, null)).toBe(40);
    expect(weakerSide(null, undefined)).toBeNull();
  });
});
