import {
  defaultFilters,
  filterRows,
  filterWorkouts,
  filtersToSearch,
  parseFilters,
  previousRange,
  rangeOf,
  resetFilters,
  withGroup,
} from './filters';
import { toSetRows } from './setRows';
import { loggedExercise, makePlan, makeWorkout, repsDose, set, target } from './testing';

const TODAY = '2026-11-13'; // a Friday

describe('parseFilters and filtersToSearch', () => {
  it('fills defaults for an empty URL', () => {
    expect(parseFilters('')).toEqual(defaultFilters());
    expect(filtersToSearch(defaultFilters())).toBe('');
  });

  it('reads every filter and survives a round trip', () => {
    const search = 'range=6m&plans=a1&day=d1&status=onPlan,deviated&kind=strength,mobility&group=legs&muscle=gluteus_maximus&exercise=barbell_squat&warmups=1';
    const filters = parseFilters(new URLSearchParams(search));

    expect(filters).toEqual({
      range: '6m',
      from: null,
      to: null,
      plans: ['a1'],
      day: 'd1',
      status: ['onPlan', 'deviated'],
      kind: ['strength', 'mobility'],
      group: 'legs',
      muscle: 'gluteus_maximus',
      exercise: 'barbell_squat',
      warmups: true,
    });
    expect(parseFilters(filtersToSearch(filters))).toEqual(filters);

    const custom = parseFilters('?from=2026-08-01&to=2026-10-31&plans=a1,free');
    expect(custom).toMatchObject({ range: 'custom', from: '2026-08-01', to: '2026-10-31', plans: ['a1', 'free'] });
    expect(parseFilters(filtersToSearch(custom))).toEqual(custom);
  });

  it('drops invalid values', () => {
    const filters = parseFilters('range=2w&status=good&kind=dance&group=neck&muscle=heart&from=2026-10-31&to=2026-08-01');
    expect(filters).toEqual(defaultFilters());
    // Plan range and day only with exactly one plan.
    expect(parseFilters('range=plan&plans=a,b&day=d1')).toMatchObject({ range: '12w', day: null });
    expect(parseFilters('range=plan&plans=a&day=d1')).toMatchObject({ range: 'plan', day: 'd1' });
  });

  it('removes a muscle outside the chosen group', () => {
    expect(parseFilters('group=chest&muscle=gluteus_maximus')).toMatchObject({ group: 'chest', muscle: null });
    const { filters, removedMuscle } = withGroup(parseFilters('group=legs&muscle=gluteus_maximus'), 'back');
    expect(removedMuscle).toBe('gluteus_maximus');
    expect(filters).toMatchObject({ group: 'back', muscle: null });
    expect(withGroup(parseFilters('muscle=gluteus_maximus'), 'legs').removedMuscle).toBeNull();
  });

  it('resets everything but the range', () => {
    const filters = parseFilters('range=4w&plans=a&group=legs&warmups=1');
    expect(resetFilters(filters)).toEqual({ ...defaultFilters(), range: '4w' });
  });
});

describe('rangeOf and previousRange', () => {
  it('starts presets on the Monday of the first week and ends today', () => {
    expect(rangeOf(defaultFilters(), TODAY)).toEqual({ from: '2026-08-24', to: TODAY });
    expect(rangeOf({ ...defaultFilters(), range: '4w' }, TODAY)).toEqual({ from: '2026-10-19', to: TODAY });
    expect(rangeOf({ ...defaultFilters(), range: '1y' }, TODAY).from).toBe('2025-11-17');
  });

  it('knows all time, custom and plan ranges', () => {
    const workouts = [makeWorkout({ date: '2026-03-02', plan: { planId: 'a', dayId: 'd' } }), makeWorkout({ date: '2025-12-01' })];
    expect(rangeOf({ ...defaultFilters(), range: 'all' }, TODAY, { workouts })).toEqual({ from: '2025-12-01', to: TODAY });
    expect(rangeOf(parseFilters('from=2026-01-01&to=2026-01-31'), TODAY)).toEqual({ from: '2026-01-01', to: '2026-01-31' });

    const planFilters = parseFilters('range=plan&plans=a');
    expect(rangeOf(planFilters, TODAY, { workouts, plans: [makePlan({ id: 'a' })] })).toEqual({ from: '2026-03-02', to: TODAY });
    const ended = makePlan({ id: 'a', schedule: { startDate: '2026-02-01', endDate: '2026-04-30' } });
    expect(rangeOf(planFilters, TODAY, { workouts, plans: [ended] })).toEqual({ from: '2026-02-01', to: '2026-04-30' });
  });

  it('gives the range of the same length directly before', () => {
    const range = rangeOf(defaultFilters(), TODAY);
    const previous = previousRange(range);
    expect(previous).toEqual({ from: '2026-06-03', to: '2026-08-23' });
    expect(previousRange({ from: '2026-03-01', to: '2026-03-31' })).toEqual({ from: '2026-01-29', to: '2026-02-28' });
  });
});

describe('filterWorkouts and filterRows', () => {
  const planned = target(repsDose(8, 12));
  const workouts = [
    makeWorkout({
      id: 'w1',
      date: '2026-11-10',
      plan: { planId: 'a', dayId: 'a1' },
      exercises: [
        loggedExercise({ exerciseId: 'barbell_squat', muscle: 'legs', sets: [set({ type: 'warmup', reps: 10 }), set({ weight: 80, reps: 10, planned })] }),
        loggedExercise({ exerciseId: 'hip_flexor_stretch', muscle: 'legs', sets: [set({ seconds: 30 })] }),
      ],
    }),
    makeWorkout({
      id: 'w2',
      date: '2026-11-11',
      plan: { planId: 'b', dayId: 'b1' },
      exercises: [loggedExercise({ exerciseId: 'barbell_bench_press', muscle: 'chest', sets: [set({ weight: 60, reps: 5, planned })] })],
    }),
    makeWorkout({ id: 'w3', date: '2026-11-12', exercises: [loggedExercise({ exercise: 'Sled push', muscle: 'legs', sets: [set({ reps: 20 })] })] }),
    makeWorkout({ id: 'w4', date: '2026-08-01', plan: { planId: 'a', dayId: 'a1' } }),
  ];
  const rows = toSetRows(workouts);
  const range = { from: '2026-11-09', to: TODAY };
  const ids = items => [...new Set(items.map(item => item.workoutId ?? item.id))];

  it('combines workout filters with AND and values with OR', () => {
    expect(ids(filterWorkouts(workouts, defaultFilters(), range))).toEqual(['w1', 'w2', 'w3']);
    expect(ids(filterWorkouts(workouts, parseFilters('plans=a,free'), range))).toEqual(['w1', 'w3']);
    expect(ids(filterWorkouts(workouts, parseFilters('plans=a,free&status=other'), range))).toEqual(['w3']);
    expect(ids(filterWorkouts(workouts, parseFilters('status=deviated'), null))).toEqual(['w2']);
    expect(ids(filterWorkouts(workouts, parseFilters('plans=a&day=a1'), null))).toEqual(['w1', 'w4']);
  });

  it('filters rows by kind, group, muscle, exercise and warm-ups', () => {
    expect(filterRows(rows, defaultFilters(), range)).toHaveLength(4);
    expect(filterRows(rows, parseFilters('warmups=1'), range)).toHaveLength(5);
    expect(filterRows(rows, parseFilters('kind=mobility'), range).map(row => row.exerciseKey)).toEqual(['hip_flexor_stretch']);
    expect(filterRows(rows, parseFilters('kind=custom,mobility'), range)).toHaveLength(2);
    // Squat counts for back (erector spinae as secondary muscle), the bench press not.
    expect(filterRows(rows, parseFilters('group=back'), range).map(row => row.exerciseKey)).toEqual(['barbell_squat']);
    expect(filterRows(rows, parseFilters('group=legs'), range).map(row => row.exerciseKey)).toEqual(['barbell_squat', 'hip_flexor_stretch', 'custom:sled%20push']);
    expect(filterRows(rows, parseFilters('muscle=triceps_brachii'), range).map(row => row.exerciseKey)).toEqual(['barbell_bench_press']);
    expect(filterRows(rows, parseFilters('exercise=barbell_squat&group=chest'), range)).toHaveLength(0);
    expect(filterRows(rows, parseFilters('plans=free'), range).map(row => row.workoutId)).toEqual(['w3']);
  });
});
