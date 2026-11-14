import {
  addLoggedSet,
  createFreeWorkout,
  createSkippedWorkout,
  createWorkoutFromPlan,
  extraExercise,
  addLoggedExercise,
  filterWorkoutsByPlans,
  isMoved,
  isSetDone,
  lastLoggedExercise,
  previousPerformance,
  removeLoggedSet,
  setExercisePerSide,
  setExerciseSkipped,
  suggestDay,
  toDateKey,
  updateLoggedSet,
  updateLoggedSide,
  weekdayOf,
  workoutSummary,
} from './workoutLog';
import { addDay, addEntry, updateAllSets } from './planEditing';
import { createEmptyPlan, createEntry } from './workoutPlan';

function weekdayPlan() {
  let plan = { ...createEmptyPlan(), nameOfWorkout: 'Upper Lower' };
  const monday = addDay(plan, { name: 'Upper', weekday: 'monday' });
  const thursday = addDay(monday.plan, { name: 'Lower', weekday: 'thursday' });
  plan = thursday.plan;
  const bench = createEntry({ exerciseId: 'barbell_bench_press' });
  plan = addEntry(plan, monday.day.id, bench);
  plan = updateAllSets(plan, monday.day.id, bench.id, { weight: 60 });
  plan = addEntry(plan, thursday.day.id, createEntry({ exerciseId: 'barbell_squat' }));
  return { plan, monday: plan.days[0], thursday: plan.days[1] };
}

// 2026-11-16 is a Monday, 2026-11-19 a Thursday.
const MONDAY = '2026-11-16';
const THURSDAY = '2026-11-19';

function logAllSets(workout, { reps, weight }) {
  let result = workout;
  for (const exercise of workout.exercises) {
    for (const set of exercise.sets) {
      result = updateLoggedSet(result, exercise.id, set.id, { reps, weight });
    }
  }
  return result;
}

describe('dates', () => {
  it('uses the local calendar date and knows its weekday', () => {
    expect(toDateKey(new Date(2026, 10, 16, 23, 30))).toBe(MONDAY);
    expect(weekdayOf(MONDAY)).toBe('monday');
    expect(weekdayOf('2026-11-22')).toBe('sunday');
  });
});

describe('starting a workout', () => {
  it('copies the plan targets and starts with the planned weight', () => {
    const { plan, monday } = weekdayPlan();
    const workout = createWorkoutFromPlan(plan, monday, MONDAY);

    expect(workout).toMatchObject({ date: MONDAY, status: 'done', plan: { planId: plan.id, dayName: 'Upper', weekday: 'monday' } });
    const [bench] = workout.exercises;
    expect(bench).toMatchObject({ exerciseId: 'barbell_bench_press', plannedEntryId: monday.entries[0].id, skipped: false });
    expect(bench.sets).toHaveLength(3);
    expect(bench.sets[0]).toMatchObject({ weight: 60, reps: null, planned: { weight: 60 } });
    expect(isSetDone(bench.sets[0])).toBe(false);
  });

  it('starts with the weights of the last workout of the same exercise', () => {
    const { plan, monday } = weekdayPlan();
    const first = logAllSets(createWorkoutFromPlan(plan, monday, MONDAY), { reps: 10, weight: 65 });
    const second = createWorkoutFromPlan(plan, monday, '2026-11-23', [first]);

    expect(lastLoggedExercise([first], { exerciseId: 'barbell_bench_press' }).id).toBe(first.exercises[0].id);
    expect(second.exercises[0].sets.map(set => set.weight)).toEqual([65, 65, 65]);
  });

  it('records a skipped day and a free workout', () => {
    const { plan, thursday } = weekdayPlan();
    expect(createSkippedWorkout(plan, thursday, THURSDAY, 'Ill')).toMatchObject({
      status: 'skipped',
      note: 'Ill',
      exercises: [],
      plan: { dayName: 'Lower' },
    });
    expect(createFreeWorkout(THURSDAY)).toMatchObject({ plan: null, status: 'done', exercises: [] });
  });
});

describe('suggestDay', () => {
  it('picks the day of the weekday on weekday plans', () => {
    const { plan, thursday } = weekdayPlan();
    expect(suggestDay(plan, THURSDAY).id).toBe(thursday.id);
  });

  it('picks the next day after the last one on rotation plans', () => {
    const { plan, monday, thursday } = weekdayPlan();
    const rotation = { ...plan, schedule: { type: 'rotation' } };
    expect(suggestDay(rotation, MONDAY).id).toBe(monday.id);
    const done = createWorkoutFromPlan(rotation, monday, MONDAY);
    expect(suggestDay(rotation, '2026-11-17', [done]).id).toBe(thursday.id);
    const second = createWorkoutFromPlan(rotation, thursday, '2026-11-17');
    expect(suggestDay(rotation, '2026-11-18', [done, second]).id).toBe(monday.id);
  });

  it('suggests a missed rotation day again', () => {
    const { plan, monday } = weekdayPlan();
    const rotation = { ...plan, schedule: { type: 'rotation' } };
    const missed = createSkippedWorkout(rotation, monday, MONDAY, 'Ill');
    expect(suggestDay(rotation, '2026-11-17', [missed]).id).toBe(monday.id);
  });
});

describe('workoutSummary for bodyweight and holds', () => {
  it('counts repetitions without weight and hold times instead of 0 kg', () => {
    let workout = createFreeWorkout(MONDAY);
    workout = addLoggedExercise(workout, extraExercise(createEntry({ exerciseId: 'push_up' })));
    workout = addLoggedExercise(workout, extraExercise(createEntry({ exerciseId: 'plank' })));
    const [pushUp, plank] = workout.exercises;
    workout = updateLoggedSet(workout, pushUp.id, pushUp.sets[0].id, { reps: 15 });
    workout = updateLoggedSet(workout, plank.id, plank.sets[0].id, { seconds: 45 });
    expect(workoutSummary(workout)).toMatchObject({ doneSets: 2, volume: 0, bodyweightReps: 15, seconds: 45 });
  });
});

describe('previousPerformance', () => {
  // Bench press is planned as 3 × 8–12 at 60 kg.
  function trained(reps, date = MONDAY) {
    const { plan, monday } = weekdayPlan();
    let workout = createWorkoutFromPlan(plan, monday, date);
    const [bench] = workout.exercises;
    bench.sets.forEach((item, index) => {
      workout = updateLoggedSet(workout, bench.id, item.id, { weight: 60, reps: reps[index] });
    });
    return workout;
  }

  it('shows the sets of the last time and no suggestion below the top of the range', () => {
    const before = trained([12, 10, 9]);
    const { plan, monday } = weekdayPlan();
    const today = createWorkoutFromPlan(plan, monday, '2026-11-23', [before]);
    const previous = previousPerformance([before, today], today, today.exercises[0]);
    expect(previous.date).toBe(MONDAY);
    expect(previous.sets.map(item => [item.weight, item.reps])).toEqual([[60, 12], [60, 10], [60, 9]]);
    expect(previous.suggestion).toBeNull();
  });

  it('suggests the next weight step once every working set reached the top', () => {
    const before = trained([12, 12, 12]);
    const { plan, monday } = weekdayPlan();
    const today = createWorkoutFromPlan(plan, monday, '2026-11-23', [before]);
    expect(previousPerformance([before, today], today, today.exercises[0]).suggestion).toEqual({ from: 60, to: 62.5 });
  });

  it('has nothing to show the first time', () => {
    const { plan, monday } = weekdayPlan();
    const today = createWorkoutFromPlan(plan, monday, MONDAY);
    expect(previousPerformance([today], today, today.exercises[0])).toBeNull();
  });
});

describe('workoutSummary', () => {
  it('counts sets, volume and how much of the plan was followed', () => {
    const { plan, monday } = weekdayPlan();
    let workout = createWorkoutFromPlan(plan, monday, MONDAY);
    expect(workoutSummary(workout)).toEqual({ plannedSets: 3, doneSets: 0, volume: 0, bodyweightReps: 0, seconds: 0, adherence: 0 });

    const [bench] = workout.exercises;
    workout = updateLoggedSet(workout, bench.id, bench.sets[0].id, { reps: 10, weight: 60 });
    workout = updateLoggedSet(workout, bench.id, bench.sets[1].id, { reps: 6, weight: 60 });
    workout = updateLoggedSet(workout, bench.id, bench.sets[2].id, { reps: 9, weight: 50 });

    // Set 2: too few repetitions, set 3: weight more than 5 % below the plan.
    expect(workoutSummary(workout)).toEqual({
      plannedSets: 3,
      doneSets: 3,
      volume: 600 + 360 + 450,
      bodyweightReps: 0,
      seconds: 0,
      adherence: 1 / 3,
    });
  });

  it('counts skipped exercises as not done and extra sets without a target', () => {
    const { plan, monday } = weekdayPlan();
    let workout = logAllSets(createWorkoutFromPlan(plan, monday, MONDAY), { reps: 10, weight: 60 });
    const [bench] = workout.exercises;
    workout = addLoggedSet(workout, bench.id);
    expect(workoutSummary(workout)).toMatchObject({ plannedSets: 3, doneSets: 3, adherence: 1 });

    workout = setExerciseSkipped(workout, bench.id, true);
    expect(workoutSummary(workout)).toMatchObject({ doneSets: 0, adherence: 0 });
  });

  it('counts removed planned sets as not done', () => {
    const { plan, monday } = weekdayPlan();
    let workout = logAllSets(createWorkoutFromPlan(plan, monday, MONDAY), { reps: 10, weight: 60 });
    const [bench] = workout.exercises;
    workout = removeLoggedSet(workout, bench.id, bench.sets[2].id);
    expect(workoutSummary(workout)).toMatchObject({ plannedSets: 3, doneSets: 2, adherence: 2 / 3 });
  });

  it('has no adherence without plan targets', () => {
    let workout = createFreeWorkout(MONDAY);
    workout = addLoggedExercise(workout, extraExercise(createEntry({ exerciseId: 'plank' })));
    expect(workout.exercises[0].sets.every(set => set.planned === null)).toBe(true);
    expect(workoutSummary(workout).adherence).toBeNull();
  });
});

describe('exercises per side', () => {
  function rowPlan() {
    let plan = { ...createEmptyPlan(), nameOfWorkout: 'Back' };
    const day = addDay(plan, { name: 'Back', weekday: 'monday' });
    const row = createEntry({ exerciseId: 'one_arm_dumbbell_row' });
    plan = addEntry(day.plan, day.day.id, row);
    plan = updateAllSets(plan, day.day.id, row.id, { weight: 20 });
    return { plan, day: plan.days[0] };
  }

  it('logs left and right separately for one-arm exercises', () => {
    const { plan, day } = rowPlan();
    expect(day.entries[0].perSide).toBe(true);
    let workout = createWorkoutFromPlan(plan, day, MONDAY);
    const [row] = workout.exercises;
    expect(row.perSide).toBe(true);
    expect(row.sets[0].sides).toEqual({
      left: { weight: 20, reps: null, seconds: null },
      right: { weight: 20, reps: null, seconds: null },
    });

    workout = updateLoggedSide(workout, row.id, row.sets[0].id, 'left', { reps: 12 });
    expect(isSetDone(workout.exercises[0].sets[0])).toBe(true);
    // Only one side reached the target: the set does not count as following the plan.
    expect(workoutSummary(workout)).toMatchObject({ doneSets: 1, volume: 240, adherence: 0 });

    workout = updateLoggedSide(workout, row.id, row.sets[0].id, 'right', { reps: 10, weight: 22.5 });
    expect(workoutSummary(workout)).toMatchObject({ volume: 240 + 225, adherence: 1 / 3 });
  });

  it('starts each side with its last weight', () => {
    const { plan, day } = rowPlan();
    let first = createWorkoutFromPlan(plan, day, MONDAY);
    const [row] = first.exercises;
    first = updateLoggedSide(first, row.id, row.sets[0].id, 'left', { reps: 10, weight: 22 });
    first = updateLoggedSide(first, row.id, row.sets[0].id, 'right', { reps: 10, weight: 24 });
    const second = createWorkoutFromPlan(plan, day, '2026-11-23', [first]);
    expect(second.exercises[0].sets[0].sides.left.weight).toBe(22);
    expect(second.exercises[0].sets[0].sides.right.weight).toBe(24);
  });

  it('switches an exercise between per side and both sides together', () => {
    const { plan, monday } = weekdayPlan();
    let workout = createWorkoutFromPlan(plan, monday, MONDAY);
    const [bench] = workout.exercises;
    workout = updateLoggedSet(workout, bench.id, bench.sets[0].id, { reps: 8 });
    workout = setExercisePerSide(workout, bench.id, true);
    expect(workout.exercises[0].sets[0].sides.right).toEqual({ weight: 60, reps: 8, seconds: null });
    workout = setExercisePerSide(workout, bench.id, false);
    expect(workout.exercises[0].sets[0]).toMatchObject({ weight: 60, reps: 8 });
    expect(workout.exercises[0].sets[0].sides).toBeUndefined();
  });
});

describe('filterWorkoutsByPlans', () => {
  it('keeps the workouts of the chosen plans, free workouts as "free"', () => {
    const { plan, monday } = weekdayPlan();
    const fromPlan = createWorkoutFromPlan(plan, monday, MONDAY);
    const free = createFreeWorkout(MONDAY);
    expect(filterWorkoutsByPlans([fromPlan, free], [])).toHaveLength(2);
    expect(filterWorkoutsByPlans([fromPlan, free], [plan.id])).toEqual([fromPlan]);
    expect(filterWorkoutsByPlans([fromPlan, free], ['free'])).toEqual([free]);
  });
});

describe('editing a workout', () => {
  it('adds sets with the last weight and removes sets', () => {
    const { plan, monday } = weekdayPlan();
    let workout = createWorkoutFromPlan(plan, monday, MONDAY);
    const [bench] = workout.exercises;
    workout = addLoggedSet(workout, bench.id);
    expect(workout.exercises[0].sets[3]).toMatchObject({ weight: 60, planned: null, reps: null });
    workout = removeLoggedSet(workout, bench.id, bench.sets[0].id);
    expect(workout.exercises[0].sets).toHaveLength(3);
  });

  it('knows when a weekday training was moved to another day', () => {
    const { plan, monday } = weekdayPlan();
    expect(isMoved(createWorkoutFromPlan(plan, monday, MONDAY))).toBe(false);
    expect(isMoved(createWorkoutFromPlan(plan, monday, '2026-11-17'))).toBe(true);
    expect(isMoved(createWorkoutFromPlan({ ...plan, schedule: { type: 'rotation' } }, monday, '2026-11-17'))).toBe(false);
  });
});
