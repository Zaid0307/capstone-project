import {
  adherencePerBucket,
  compareValues,
  completeWeeks,
  mostSkipped,
  plannedGroupSets,
  timeBuckets,
  volumePerBucket,
  workoutsPerBucket,
} from './series';
import { toSetRows } from './setRows';
import { loggedExercise, makePlan, makeWorkout, repsDose, set, target } from './testing';

const TODAY = '2026-11-13';
const planned = target(repsDose(8, 12), 50);

describe('time buckets', () => {
  it('uses weeks up to 26 weeks and marks the running week', () => {
    const buckets = timeBuckets({ from: '2026-08-24', to: TODAY }, TODAY);
    expect(buckets).toHaveLength(12);
    expect(buckets[0]).toMatchObject({ key: '2026-W35', from: '2026-08-24', unit: 'week', inProgress: false });
    expect(buckets[11]).toMatchObject({ key: '2026-W46', inProgress: true });
  });

  it('uses months for longer ranges', () => {
    const buckets = timeBuckets({ from: '2025-11-17', to: TODAY }, TODAY);
    expect(buckets[0]).toMatchObject({ key: '2025-11', unit: 'month' });
    expect(buckets[buckets.length - 1]).toMatchObject({ key: '2026-11', inProgress: true, to: '2026-11-30' });
  });

  it('counts workouts, volume and pooled adherence per bucket', () => {
    const buckets = timeBuckets({ from: '2026-11-02', to: TODAY }, TODAY);
    const workouts = [
      makeWorkout({ date: '2026-11-03', plan: { planId: 'a', dayId: 'd' }, exercises: [loggedExercise({ exerciseId: 'barbell_bench_press', sets: [set({ weight: 50, reps: 10, planned }), set({ weight: 50, reps: 4, planned })] })] }),
      makeWorkout({ date: '2026-11-10', exercises: [loggedExercise({ exerciseId: 'barbell_bench_press', sets: [set({ weight: 60, reps: 5 })] })] }),
      makeWorkout({ date: '2026-11-11', status: 'skipped' }),
    ];
    expect(workoutsPerBucket(workouts, buckets).map(item => item.value)).toEqual([1, 1]);
    expect(volumePerBucket(toSetRows(workouts), buckets).map(item => item.value)).toEqual([700, 300]);
    const adherence = adherencePerBucket(workouts, buckets);
    expect(adherence[0]).toMatchObject({ met: 1, planned: 2, value: 0.5 });
    expect(adherence[1].value).toBeNull();
  });
});

describe('completeWeeks', () => {
  it('counts finished weeks from the first workout', () => {
    expect(completeWeeks({ from: '2026-08-24', to: TODAY }, TODAY)).toBe(11);
    expect(completeWeeks({ from: '2026-08-24', to: TODAY }, TODAY, '2026-11-02')).toBe(1);
    expect(completeWeeks({ from: '2026-11-09', to: TODAY }, TODAY)).toBe(0);
  });
});

describe('plannedGroupSets', () => {
  it('counts the maximum share per group and set, times the weekly factor', () => {
    const entry = (exerciseId, sets) => ({ id: exerciseId, exerciseId, exercise: '', muscle: '', sets: Array.from({ length: sets }, () => ({ type: 'working', dose: repsDose() })) });
    const plan = makePlan({ days: [{ id: 'a', weekday: 'monday', entries: [entry('barbell_bench_press', 3)] }] });
    const totals = plannedGroupSets([plan]);
    expect(totals.chest).toBe(3);
    expect(totals.arms).toBe(1.5);
    const rotation = makePlan({ type: 'rotation', schedule: { daysPerWeek: 3 }, days: [{ id: 'a', entries: [entry('barbell_bench_press', 2)] }, { id: 'b', entries: [] }] });
    expect(plannedGroupSets([rotation]).chest).toBe(3);
    expect(plannedGroupSets([{ ...plan, isActive: false }]).chest).toBe(0);
  });
});

describe('mostSkipped', () => {
  it('counts planned sets that were not done', () => {
    const workouts = [
      makeWorkout({
        date: '2026-11-03',
        plan: { planId: 'a', dayId: 'd' },
        exercises: [
          loggedExercise({ exerciseId: 'push_up', skipped: true, sets: [set({ planned }), set({ planned })] }),
          loggedExercise({ exerciseId: 'barbell_bench_press', sets: [set({ weight: 50, reps: 10, planned }), set({ planned })] }),
        ],
      }),
    ];
    expect(mostSkipped(toSetRows(workouts))).toEqual([
      { exerciseKey: 'push_up', exerciseId: 'push_up', sets: 2 },
      { exerciseKey: 'barbell_bench_press', exerciseId: 'barbell_bench_press', sets: 1 },
    ]);
  });
});

describe('compareValues', () => {
  it('gives a relative change only with a previous value', () => {
    expect(compareValues(12, 10)).toEqual({ difference: 2, percent: 0.2, isNew: false });
    expect(compareValues(3, 0)).toEqual({ difference: 3, percent: null, isNew: true });
    expect(compareValues(null, 2)).toBeNull();
  });
});
