import {
  WORKOUT_SCHEMA_VERSION,
  addLoggedSet,
  addWarmupSet,
  averagePerformance,
  countsAsTraining,
  FEELINGS,
  restsAfter,
  updateLoggedExercise,
  updateWorkout,
  setSuggestions,
  finishWorkout,
  isWorkoutRunning,
  migrateWorkout,
  openPlannedSets,
  runningWorkout,
  workoutDeviations,
  workoutDuration,
  workoutProgress,
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
    // Values start empty; the plan's weight is only suggested (setSuggestions).
    expect(bench.sets[0]).toMatchObject({ weight: null, reps: null, planned: { weight: 60 } });
    expect(isSetDone(bench.sets[0])).toBe(false);
    expect(setSuggestions(bench, null)[bench.sets[0].id]).toEqual({ weight: 60, reps: 8, seconds: null });
  });

  it('finds the last workout of the same exercise', () => {
    const { plan, monday } = weekdayPlan();
    const first = logAllSets(createWorkoutFromPlan(plan, monday, MONDAY), { reps: 10, weight: 65 });
    expect(lastLoggedExercise([first], { exerciseId: 'barbell_bench_press' }).id).toBe(first.exercises[0].id);
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

describe('supersets', () => {
  it('keeps the groupId of the plan and rests only after the last exercise of a superset', () => {
    const { plan, monday } = weekdayPlan();
    const day = {
      ...monday,
      entries: [
        { ...createEntry({ exerciseId: 'barbell_bench_press' }), groupId: 'g1' },
        { ...createEntry({ exerciseId: 'barbell_row' }), groupId: 'g1' },
        createEntry({ exerciseId: 'barbell_squat' }),
      ],
    };
    const workout = createWorkoutFromPlan(plan, day, MONDAY);
    const [first, second, third] = workout.exercises;
    expect([first.groupId, second.groupId, third.groupId]).toEqual(['g1', 'g1', null]);
    expect(restsAfter(workout, first.id)).toBe(false);
    expect(restsAfter(workout, second.id)).toBe(true);
    expect(restsAfter(workout, third.id)).toBe(true);
    // Added exercises never join a superset.
    expect(extraExercise(createEntry({ exerciseId: 'barbell_squat' })).groupId).toBeNull();
  });
});

describe('days on several weekdays (plan model 4)', () => {
  // Full body on Monday and Thursday.
  function fullBodyPlan() {
    let plan = { ...createEmptyPlan(), nameOfWorkout: 'Full body' };
    const added = addDay(plan, { name: 'Full body', weekdays: ['monday', 'thursday'] });
    plan = addEntry(added.plan, added.day.id, createEntry({ exerciseId: 'barbell_squat' }));
    return { plan, day: plan.days[0] };
  }

  it('suggests the day on each of its weekdays and does not count it as moved there', () => {
    const { plan, day } = fullBodyPlan();
    expect(suggestDay(plan, THURSDAY).id).toBe(day.id);
    const thursday = createWorkoutFromPlan(plan, day, THURSDAY);
    expect(thursday.plan).toMatchObject({ weekday: 'thursday', weekdays: ['monday', 'thursday'] });
    expect(isMoved(thursday)).toBe(false);
    expect(isMoved(createWorkoutFromPlan(plan, day, '2026-11-17'))).toBe(true);
  });

  it('still reads entries saved with one weekday', () => {
    const old = { date: THURSDAY, plan: { planId: 'p', weekday: 'monday' } };
    expect(isMoved(old)).toBe(true);
    expect(isMoved({ ...old, date: MONDAY })).toBe(false);
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

  it('suggests more weight only when no set at the top was taken to failure (RIR 0)', () => {
    const { plan, monday } = weekdayPlan();
    const withRir = rirs => {
      let before = trained([12, 12, 12]);
      const [bench] = before.exercises;
      bench.sets.forEach((item, index) => {
        before = updateLoggedSet(before, bench.id, item.id, { rir: rirs[index] });
      });
      const today = createWorkoutFromPlan(plan, monday, '2026-11-23', [before]);
      return previousPerformance([before, today], today, today.exercises[0]).suggestion;
    };
    expect(withRir([2, 1, 0])).toBeNull();
    expect(withRir([2, 1, 1])).toEqual({ from: 60, to: 62.5 });
    // Sets without an RIR entry count by repetitions alone.
    expect(withRir([null, 1, null])).toEqual({ from: 60, to: 62.5 });
  });

  it('suggests last time position for position for the open sets only', () => {
    const before = trained([12, 10, 9]);
    const { plan, monday } = weekdayPlan();
    let today = createWorkoutFromPlan(plan, monday, '2026-11-23');
    const benchId = today.exercises[0].id;
    today = updateLoggedSet(today, benchId, today.exercises[0].sets[0].id, { weight: 62.5, reps: 8 });
    const [bench] = today.exercises;
    const suggestions = setSuggestions(bench, previousPerformance([before, today], today, bench));
    expect(suggestions[bench.sets[0].id]).toBeUndefined();
    expect(suggestions[bench.sets[1].id]).toEqual({ weight: 60, reps: 10, seconds: null });
    expect(suggestions[bench.sets[2].id]).toEqual({ weight: 60, reps: 9, seconds: null });
    // Suggestions are not entries: the sets stay open.
    expect(isSetDone(bench.sets[1])).toBe(false);
  });

  it('averages each set position over the last five trainings', () => {
    const dates = ['2026-10-05', '2026-10-12', '2026-10-19', '2026-10-26', '2026-11-02', '2026-11-09'];
    // The oldest training (20 reps) is the sixth and is left out.
    const reps = [[20, 20], [10, 8], [10, 9], [11, 9], [12, 10], [12, 9]];
    const history = dates.map((date, index) => {
      const { plan, monday } = weekdayPlan();
      let workout = createWorkoutFromPlan(plan, monday, date);
      const [bench] = workout.exercises;
      workout = updateLoggedSet(workout, bench.id, bench.sets[0].id, { weight: 55 + index, reps: reps[index][0] });
      return updateLoggedSet(workout, bench.id, bench.sets[1].id, { weight: 55 + index, reps: reps[index][1] });
    });
    const { plan, monday } = weekdayPlan();
    const today = createWorkoutFromPlan(plan, monday, '2026-11-16');
    const average = averagePerformance([...history, today], today, today.exercises[0], { sessions: 5 });
    expect(average.sessions).toBe(5);
    expect(average.sets).toEqual([
      { weight: 58, reps: 11, seconds: null },
      { weight: 58, reps: 9, seconds: null },
    ]);
    expect(average.overall).toEqual({ weight: 58, reps: 10, seconds: null });
    expect(averagePerformance([today], today, today.exercises[0])).toBeNull();
  });

  it('has nothing to show the first time', () => {
    const { plan, monday } = weekdayPlan();
    const today = createWorkoutFromPlan(plan, monday, MONDAY);
    expect(previousPerformance([today], today, today.exercises[0])).toBeNull();
  });
});

describe('warm-up sets', () => {
  it('go before the working sets and do not count as working sets', () => {
    const { plan, monday } = weekdayPlan();
    let workout = createWorkoutFromPlan(plan, monday, MONDAY);
    const benchId = workout.exercises[0].id;
    workout = addWarmupSet(workout, benchId);
    workout = addWarmupSet(workout, benchId);
    const sets = workout.exercises[0].sets;
    expect(sets.map(set => set.type)).toEqual(['warmup', 'warmup', 'working', 'working', 'working']);
    expect(sets[0]).toMatchObject({ planned: null, weight: null, reps: null });

    workout = updateLoggedSet(workout, benchId, sets[0].id, { weight: 40, reps: 10 });
    expect(workoutProgress(workout)).toEqual({ done: 0, total: 3 });
    expect(workoutSummary(workout)).toMatchObject({ plannedSets: 3, doneSets: 0, volume: 0 });
  });
});

describe('notes and feeling', () => {
  it('keeps a note per exercise and a feeling per training, both optional', () => {
    const { plan, monday } = weekdayPlan();
    let workout = createWorkoutFromPlan(plan, monday, MONDAY);
    const [bench] = workout.exercises;
    expect(bench.note).toBeUndefined();
    expect(workout.feeling).toBeUndefined();
    workout = updateLoggedExercise(workout, bench.id, { note: 'Elbows tucked' });
    workout = updateWorkout(workout, { feeling: 4 });
    expect(workout.exercises[0].note).toBe('Elbows tucked');
    expect(workout.feeling).toBe(4);
    expect(FEELINGS).toEqual([1, 2, 3, 4, 5]);
  });
});

describe('openPlannedSets', () => {
  it('counts planned working sets without values, not those of skipped exercises', () => {
    const { plan, monday } = weekdayPlan();
    let workout = createWorkoutFromPlan(plan, monday, MONDAY);
    const [bench] = workout.exercises;
    expect(openPlannedSets(workout)).toBe(3);
    workout = updateLoggedSet(workout, bench.id, bench.sets[0].id, { reps: 10 });
    workout = addLoggedSet(workout, bench.id);
    expect(openPlannedSets(workout)).toBe(2);
    expect(openPlannedSets(setExerciseSkipped(workout, bench.id, true))).toBe(0);
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
      left: { weight: null, reps: null, seconds: null },
      right: { weight: null, reps: null, seconds: null },
    });
    // The plan's weight is suggested for both sides.
    expect(setSuggestions(row, null)[row.sets[0].id].left).toMatchObject({ weight: 20 });

    workout = updateLoggedSide(workout, row.id, row.sets[0].id, 'left', { reps: 12, weight: 20 });
    expect(isSetDone(workout.exercises[0].sets[0])).toBe(true);
    // Only one side reached the target: the set does not count as following the plan.
    expect(workoutSummary(workout)).toMatchObject({ doneSets: 1, volume: 240, adherence: 0 });

    workout = updateLoggedSide(workout, row.id, row.sets[0].id, 'right', { reps: 10, weight: 22.5 });
    expect(workoutSummary(workout)).toMatchObject({ volume: 240 + 225, adherence: 1 / 3 });
  });

  it('suggests each side its own values from last time and on average', () => {
    const { plan, day } = rowPlan();
    let first = createWorkoutFromPlan(plan, day, MONDAY);
    const [row] = first.exercises;
    first = updateLoggedSide(first, row.id, row.sets[0].id, 'left', { reps: 10, weight: 22 });
    first = updateLoggedSide(first, row.id, row.sets[0].id, 'right', { reps: 10, weight: 24 });
    let second = createWorkoutFromPlan(plan, day, '2026-11-18');
    const [row2] = second.exercises;
    second = updateLoggedSide(second, row2.id, row2.sets[0].id, 'left', { reps: 9, weight: 23 });
    second = updateLoggedSide(second, row2.id, row2.sets[0].id, 'right', { reps: 8, weight: 24 });
    const third = createWorkoutFromPlan(plan, day, '2026-11-23');
    const [today] = third.exercises;
    const all = [first, second, third];

    const last = setSuggestions(today, previousPerformance(all, third, today));
    expect(last[today.sets[0].id]).toEqual({
      left: { weight: 23, reps: 9, seconds: null },
      right: { weight: 24, reps: 8, seconds: null },
    });
    const average = averagePerformance(all, third, today);
    expect(average.sessions).toBe(2);
    expect(average.sets[0]).toEqual({
      left: { weight: 22.5, reps: 9.5, seconds: null },
      right: { weight: 24, reps: 9, seconds: null },
    });
    // Repetitions are suggested as whole numbers.
    expect(setSuggestions(today, average)[today.sets[0].id].left).toEqual({ weight: 22.5, reps: 10, seconds: null });
  });

  it('switches an exercise between per side and both sides together', () => {
    const { plan, monday } = weekdayPlan();
    let workout = createWorkoutFromPlan(plan, monday, MONDAY);
    const [bench] = workout.exercises;
    workout = updateLoggedSet(workout, bench.id, bench.sets[0].id, { reps: 8, weight: 60 });
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
  it('adds empty sets and removes sets', () => {
    const { plan, monday } = weekdayPlan();
    let workout = createWorkoutFromPlan(plan, monday, MONDAY);
    const [bench] = workout.exercises;
    workout = addLoggedSet(workout, bench.id);
    expect(workout.exercises[0].sets[3]).toMatchObject({ weight: null, planned: null, reps: null });
    // An added set without plan targets is suggested the last known position.
    const added = workout.exercises[0];
    expect(setSuggestions(added, null)[added.sets[3].id]).toEqual({ weight: 60, reps: 8, seconds: null });
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

describe('running training (schema version 2)', () => {
  it('starts running, gets an end time once and keeps it', () => {
    const { plan, monday } = weekdayPlan();
    const workout = createWorkoutFromPlan(plan, monday, MONDAY);
    expect(workout).toMatchObject({ schemaVersion: WORKOUT_SCHEMA_VERSION, finishedAt: null });
    expect(workout.startedAt).toEqual(expect.any(String));
    expect(isWorkoutRunning(workout)).toBe(true);
    expect(runningWorkout([workout])).toBe(workout);

    const finished = finishWorkout(workout);
    expect(finished.finishedAt).toEqual(expect.any(String));
    expect(isWorkoutRunning(finished)).toBe(false);
    expect(runningWorkout([finished])).toBeNull();
    expect(finishWorkout(finished)).toBe(finished);
  });

  it('never runs a skipped training', () => {
    const { plan, thursday } = weekdayPlan();
    const skipped = createSkippedWorkout(plan, thursday, THURSDAY);
    expect(skipped).toMatchObject({ startedAt: null, finishedAt: null });
    expect(isWorkoutRunning(skipped)).toBe(false);
  });

  it('measures the duration from start to end', () => {
    const workout = { startedAt: '2026-11-16T17:00:00.000Z', finishedAt: '2026-11-16T18:05:00.000Z' };
    expect(workoutDuration(workout)).toBe(65 * 60000);
    expect(workoutDuration({ startedAt: '2026-11-16T17:00:00.000Z', finishedAt: null }, Date.parse('2026-11-16T17:42:00.000Z'))).toBe(42 * 60000);
    expect(workoutDuration({ startedAt: null, finishedAt: null })).toBeNull();
  });

  it('keeps the time a set first became done', () => {
    const { plan, monday } = weekdayPlan();
    let workout = createWorkoutFromPlan(plan, monday, MONDAY);
    const [bench] = workout.exercises;
    expect(bench.sets[0].completedAt).toBeNull();
    workout = updateLoggedSet(workout, bench.id, bench.sets[0].id, { weight: 62.5 });
    expect(workout.exercises[0].sets[0].completedAt).toBeNull();
    workout = updateLoggedSet(workout, bench.id, bench.sets[0].id, { reps: 8 });
    const completedAt = workout.exercises[0].sets[0].completedAt;
    expect(completedAt).toEqual(expect.any(String));
    workout = updateLoggedSet(workout, bench.id, bench.sets[0].id, { reps: 9 });
    expect(workout.exercises[0].sets[0].completedAt).toBe(completedAt);

    workout = setExercisePerSide(workout, bench.id, true);
    const second = workout.exercises[0].sets[1];
    workout = updateLoggedSide(workout, bench.id, second.id, 'left', { reps: 10 });
    expect(workout.exercises[0].sets[1].completedAt).toEqual(expect.any(String));
  });

  it('counts a training only with at least one done set', () => {
    const { plan, monday } = weekdayPlan();
    const workout = createWorkoutFromPlan(plan, monday, MONDAY);
    expect(countsAsTraining(workout)).toBe(false);
    expect(workoutProgress(workout)).toEqual({ done: 0, total: 3 });
    const [bench] = workout.exercises;
    const logged = updateLoggedSet(workout, bench.id, bench.sets[0].id, { reps: 8 });
    expect(countsAsTraining(logged)).toBe(true);
    expect(workoutProgress(logged)).toEqual({ done: 1, total: 3 });
    // Values in a skipped exercise do not count.
    expect(countsAsTraining(setExerciseSkipped(logged, bench.id, true))).toBe(false);
  });

  it('lists skipped exercises and missing sets as deviations', () => {
    const { plan, monday } = weekdayPlan();
    let workout = createWorkoutFromPlan(plan, monday, MONDAY);
    const [bench] = workout.exercises;
    workout = updateLoggedSet(workout, bench.id, bench.sets[0].id, { reps: 8 });
    expect(workoutDeviations(workout)).toEqual([{ exerciseId: bench.id, type: 'missingSets', count: 2 }]);
    workout = logAllSets(workout, { reps: 10, weight: 60 });
    expect(workoutDeviations(workout)).toEqual([]);
    workout = setExerciseSkipped(workout, bench.id, true);
    expect(workoutDeviations(workout)).toEqual([{ exerciseId: bench.id, type: 'skipped', count: 0 }]);
    // Added exercises are no deviation.
    workout = addLoggedExercise(workout, extraExercise(createEntry({ exerciseId: 'barbell_squat' })));
    expect(workoutDeviations(workout)).toHaveLength(1);
  });
});

describe('migrateWorkout', () => {
  const v1 = {
    id: 'w1',
    date: MONDAY,
    status: 'done',
    plan: null,
    note: 'Good',
    exercises: [
      {
        id: 'e1',
        exerciseId: 'barbell_bench_press',
        exercise: '',
        plannedEntryId: null,
        skipped: false,
        perSide: true,
        sets: [{ id: 's1', type: 'working', planned: null, weight: null, reps: null, seconds: null, sides: { left: { weight: 10, reps: 12, seconds: null }, right: { weight: 10, reps: 11, seconds: null } } }],
      },
    ],
    createdAt: '2026-11-16T17:00:00.000Z',
    updatedAt: '2026-11-16T18:00:00.000Z',
  };

  it('reads version 1 as finished, without inventing a start time, and keeps every value', () => {
    const migrated = migrateWorkout(v1);
    expect(migrated).toMatchObject({ schemaVersion: 2, startedAt: null, finishedAt: '2026-11-16T18:00:00.000Z', note: 'Good' });
    expect(migrated.exercises[0].sets[0]).toEqual({ ...v1.exercises[0].sets[0], completedAt: null });
    expect(isWorkoutRunning(migrated)).toBe(false);
    expect(countsAsTraining(migrated)).toBe(true);
  });

  it('leaves skipped days without times and current workouts unchanged', () => {
    expect(migrateWorkout({ ...v1, status: 'skipped', exercises: [] })).toMatchObject({ startedAt: null, finishedAt: null });
    const current = migrateWorkout(v1);
    expect(migrateWorkout(current)).toBe(current);
  });
});
