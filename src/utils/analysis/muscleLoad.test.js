import {
  contributionTo,
  customExerciseSets,
  effectiveSets,
  effectiveSetsByWeek,
  loadLevel,
  muscleContributions,
  pairEffectiveSets,
} from './muscleLoad';
import { toSetRows } from './setRows';
import { loggedExercise, makeWorkout, set, sideSet } from './testing';

const rowsOf = (exercises, date = '2026-11-13') => toSetRows([makeWorkout({ date, exercises })]);
const working = (count, values = { weight: 50, reps: 10 }) => Array.from({ length: count }, () => set(values));

describe('effective sets of logged workouts', () => {
  it('leave stretching and cardio out of the muscle load', () => {
    const rows = rowsOf([
      loggedExercise({ exerciseId: 'wall_pec_stretch', sets: [set({ seconds: 30 }), set({ seconds: 30 })] }),
      loggedExercise({ exerciseId: 'jump_rope', sets: [set({ seconds: 120 })] }),
      loggedExercise({ exerciseId: 'barbell_bench_press', sets: working(2) }),
    ]);
    expect(effectiveSets(rows).chest).toBe(2);
  });
});

describe('muscleContributions', () => {
  it('gives primary muscles 1 and secondary muscles 0.5', () => {
    const { leaves } = muscleContributions('barbell_bench_press');
    expect(leaves.pectoralis_major_sternocostal).toBe(1);
    expect(leaves.pectoralis_major_clavicular).toBe(0.5);
    expect(leaves.triceps_brachii_long).toBe(0.5);
    expect(leaves.latissimus_dorsi).toBeUndefined();
  });

  it('takes the maximum for whole muscles and groups instead of the sum', () => {
    const bench = muscleContributions('barbell_bench_press');
    expect(contributionTo(bench, 'pectoralis_major')).toBe(1);
    expect(contributionTo(bench, 'triceps_brachii')).toBe(0.5);
    expect(contributionTo(bench, 'chest')).toBe(1);
    expect(contributionTo(bench, 'arms')).toBe(0.5);

    const squat = muscleContributions('barbell_squat');
    expect(squat.groups).toMatchObject({ legs: 1, back: 0.5, abs: 0.5 });
    expect(contributionTo(squat, 'quadriceps_femoris')).toBe(1);
    expect(contributionTo(squat, 'erector_spinae')).toBe(0.5);
  });

  it('counts own exercises only for their group', () => {
    expect(muscleContributions(null, 'legs')).toEqual({ leaves: {}, muscles: {}, groups: { legs: 1 }, custom: true });
    expect(muscleContributions(null, 'other').groups).toEqual({});
  });
});

describe('effectiveSets', () => {
  it('sums the shares of countable sets per level', () => {
    const rows = rowsOf([
      loggedExercise({ exerciseId: 'barbell_bench_press', muscle: 'chest', sets: [set({ type: 'warmup', weight: 20, reps: 10 }), ...working(3), set({ weight: 50 })] }),
    ]);

    expect(effectiveSets(rows, { level: 'whole' })).toMatchObject({ pectoralis_major: 3, triceps_brachii: 1.5, deltoid: 1.5 });
    expect(effectiveSets(rows, { level: 'leaf' })).toMatchObject({ pectoralis_major_sternocostal: 3, triceps_brachii_long: 1.5 });
    expect(effectiveSets(rows, { level: 'group' })).toEqual({ chest: 3, shoulders: 1.5, arms: 1.5 });
    expect(effectiveSets(rows, { level: 'group', warmups: true }).chest).toBe(4);
  });

  it('counts a per-side set once', () => {
    const rows = rowsOf([
      loggedExercise({ exerciseId: 'one_arm_dumbbell_row', sets: [sideSet({ weight: 30, reps: 10 }, { weight: 30, reps: 10 })] }),
    ]);
    expect(effectiveSets(rows, { level: 'whole' }).latissimus_dorsi).toBe(1);
    expect(effectiveSets(rows).back).toBe(1);
  });

  it('counts own exercises in their group only and reports them', () => {
    const rows = rowsOf([loggedExercise({ exercise: 'Sled push', muscle: 'legs', sets: working(2) })]);
    expect(effectiveSets(rows)).toEqual({ legs: 2 });
    expect(effectiveSets(rows, { level: 'leaf' })).toEqual({});
    expect(customExerciseSets(rows)).toEqual({ legs: 2 });
  });

  it('groups effective sets by week', () => {
    const rows = [
      ...rowsOf([loggedExercise({ exerciseId: 'push_up', sets: working(2) })], '2026-11-09'),
      ...rowsOf([loggedExercise({ exerciseId: 'push_up', sets: working(1) })], '2026-11-16'),
    ];
    const byWeek = effectiveSetsByWeek(rows);
    expect(byWeek['2026-W46'].chest).toBe(2);
    expect(byWeek['2026-W47'].chest).toBe(1);
  });

  it('takes the maximum per set over the muscles of a balance pair side', () => {
    const rows = rowsOf([loggedExercise({ exerciseId: 'barbell_bench_press', sets: working(2) })]);
    // Pectoralis major (1) vs. back muscles (0): each bench set counts once, not per part.
    expect(pairEffectiveSets(rows, [['pectoralis_major'], ['latissimus_dorsi', 'rhomboids']])).toEqual([2, 0]);
    expect(pairEffectiveSets(rows, [['deltoid_anterior'], ['deltoid_posterior']])).toEqual([1, 0]);
  });
});

describe('loadLevel', () => {
  it('maps sets per week to the five map levels', () => {
    expect([0, 0.5, 3.9, 4, 9.5, 10, 20, 20.5].map(loadLevel)).toEqual([0, 1, 1, 2, 2, 3, 3, 4]);
  });
});
