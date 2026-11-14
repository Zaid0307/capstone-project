import { personalRecords, recordsInRange, repRecords } from './records';
import { toSetRows } from './setRows';
import { loggedExercise, makeWorkout, set, sideSet } from './testing';

const session = (id, date, exerciseId, sets) => makeWorkout({ id, date, exercises: [loggedExercise({ exerciseId, sets })] });

describe('personalRecords', () => {
  it('sets starting values in the first session without records', () => {
    const rows = toSetRows([session('w1', '2026-11-02', 'barbell_squat', [set({ weight: 100, reps: 5 })])]);
    expect(personalRecords(rows)).toEqual([]);
  });

  it('reports values truly greater than all earlier ones, never ties', () => {
    const workouts = [
      session('w1', '2026-11-02', 'barbell_squat', [set({ weight: 100, reps: 5 })]),
      session('w2', '2026-11-05', 'barbell_squat', [set({ weight: 100, reps: 5 })]),
      session('w3', '2026-11-09', 'barbell_squat', [set({ weight: 105, reps: 3 })]),
    ];
    const records = personalRecords(toSetRows(workouts));

    expect(records.map(record => record.type)).toEqual(['heaviestWeight']);
    expect(records[0]).toEqual({ exerciseKey: 'barbell_squat', side: null, type: 'heaviestWeight', value: 105, previous: 100, date: '2026-11-09', workoutId: 'w3' });
  });

  it('finds every record type and works in date order', () => {
    const workouts = [
      session('w2', '2026-11-09', 'barbell_squat', [set({ weight: 100, reps: 6 }), set({ weight: 100, reps: 6 })]),
      session('w1', '2026-11-02', 'barbell_squat', [set({ weight: 100, reps: 5 })]),
    ];
    const types = personalRecords(toSetRows(workouts)).map(record => record.type);
    expect(types).toEqual(['bestE1rm', 'bestSetVolume', 'bestSessionVolume']);
  });

  it('keeps sides apart', () => {
    const workouts = [
      session('w1', '2026-11-02', 'one_arm_dumbbell_row', [sideSet({ weight: 30, reps: 10 }, { weight: 30, reps: 10 })]),
      session('w2', '2026-11-09', 'one_arm_dumbbell_row', [sideSet({ weight: 32, reps: 10 }, { weight: 30, reps: 10 })]),
    ];
    const records = personalRecords(toSetRows(workouts));
    expect(new Set(records.map(record => record.side))).toEqual(new Set(['left']));
    expect(records.find(record => record.type === 'heaviestWeight')).toMatchObject({ value: 32, previous: 30 });
  });

  it('counts most reps only without weight and longest hold only with seconds', () => {
    const workouts = [
      session('w1', '2026-11-02', 'push_up', [set({ reps: 20 }), set({ weight: 10, reps: 25 })]),
      session('w2', '2026-11-09', 'push_up', [set({ reps: 22 })]),
      session('w3', '2026-11-02', 'plank', [set({ seconds: 60 })]),
      session('w4', '2026-11-09', 'plank', [set({ seconds: 75 }), set({ type: 'warmup', seconds: 120 })]),
    ];
    const records = personalRecords(toSetRows(workouts));
    expect(records.map(record => [record.exerciseKey, record.type, record.value])).toEqual([
      ['push_up', 'mostReps', 22],
      ['plank', 'longestHold', 75],
    ]);
  });

  it('is recomputed: deleting a workout removes its record', () => {
    const workouts = [
      session('w1', '2026-11-02', 'barbell_squat', [set({ weight: 100, reps: 5 })]),
      session('w2', '2026-11-09', 'barbell_squat', [set({ weight: 110, reps: 5 })]),
    ];
    expect(personalRecords(toSetRows(workouts)).length).toBeGreaterThan(0);
    expect(personalRecords(toSetRows(workouts.slice(1)))).toEqual([]);
  });

  it('ignores skipped workouts and exercises', () => {
    const workouts = [
      session('w1', '2026-11-02', 'barbell_squat', [set({ weight: 100, reps: 5 })]),
      makeWorkout({ date: '2026-11-05', exercises: [loggedExercise({ exerciseId: 'barbell_squat', skipped: true, sets: [set({ weight: 200, reps: 5 })] })] }),
    ];
    expect(personalRecords(toSetRows(workouts))).toEqual([]);
  });

  it('shows records set in a range', () => {
    const records = [{ date: '2026-10-01' }, { date: '2026-11-10' }];
    expect(recordsInRange(records, { from: '2026-11-01', to: '2026-11-13' })).toEqual([{ date: '2026-11-10' }]);
  });
});

describe('repRecords', () => {
  it('gives the heaviest weight for each repetition count 1–12 with its first date', () => {
    const workouts = [
      session('w1', '2026-11-02', 'barbell_squat', [set({ weight: 100, reps: 5 }), set({ weight: 90, reps: 8 }), set({ weight: 60, reps: 15 })]),
      session('w2', '2026-11-09', 'barbell_squat', [set({ weight: 100, reps: 5 }), set({ weight: 95, reps: 8 })]),
      session('w3', '2026-11-09', 'push_up', [set({ weight: 200, reps: 5 })]),
    ];
    expect(repRecords(toSetRows(workouts), 'barbell_squat')).toEqual([
      { reps: 5, side: null, weight: 100, date: '2026-11-02', workoutId: 'w1' },
      { reps: 8, side: null, weight: 95, date: '2026-11-09', workoutId: 'w2' },
    ]);
  });
});
