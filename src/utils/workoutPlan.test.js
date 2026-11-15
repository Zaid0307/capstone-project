import {
  PLAN_SCHEMA_VERSION,
  createEntry,
  createSet,
  dayTitle,
  entryName,
  findLibraryExercise,
  formatDose,
  migratePlan,
  muscleLabel,
  normalizeMuscle,
  orderedDays,
  planProblems,
  removeDay,
  summarizeSets,
  weeklySetsByMuscle,
} from './workoutPlan';
import { translate } from '../i18n/translations';

const t = (key, values) => translate('de', key, values);
const reps = (min, max = min) => ({ unit: 'repetitions', min, max });

// A plan as saved by app versions before plan model 2.
const version1Plan = {
  id: 'plan',
  nameOfWorkout: 'Push',
  description: 'Chest day',
  days: [
    {
      id: 'd-fri',
      day: 'friday',
      muscles: [
        {
          id: 'm1',
          name: 'chest',
          exercises: [
            { id: 'e1', muscle: 'chest', exercise: 'Barbell bench press', weight: '60', repetitions: '8', sets: '4' },
            { id: 'e2', muscle: 'chest', exercise: 'My own fly', weight: '', repetitions: '12', sets: '3' },
          ],
        },
        { name: 'Stomach', exercises: [{ exercise: 'Crunch', repetitions: '20', sets: '2', weight: '0' }] },
      ],
    },
    { id: 'd-mon', day: 'monday' },
  ],
};

// A plan as saved by plan model 2.
const version2Plan = {
  id: 'p2',
  schemaVersion: 2,
  nameOfWorkout: 'Legs',
  description: '',
  template: { id: 'x', version: 1 },
  days: [
    {
      id: 'd1',
      day: 'monday',
      name: 'Leg day',
      note: 'Warm up well',
      entries: [
        {
          id: 'e1',
          exerciseId: 'barbell_squat',
          exercise: 'Barbell squat',
          muscle: 'legs',
          sets: 2,
          dose: reps(6, 8),
          weight: 80,
          restSeconds: 120,
          rirTarget: 2,
        },
      ],
    },
  ],
};

describe('migratePlan', () => {
  it('turns a version 1 plan into the current model', () => {
    const plan = migratePlan(version1Plan);

    expect(plan.schemaVersion).toBe(PLAN_SCHEMA_VERSION);
    expect(plan.schedule).toEqual({ type: 'weekdays' });
    expect(plan.days.map(day => [day.id, day.weekday, day.name])).toEqual([
      ['d-fri', 'friday', ''],
      ['d-mon', 'monday', ''],
    ]);
    const [bench, fly, crunch] = plan.days[0].entries;
    expect(bench).toMatchObject({ id: 'e1', exerciseId: 'barbell_bench_press', muscle: 'chest' });
    expect(bench.sets).toHaveLength(4);
    expect(bench.sets[0]).toEqual({ type: 'working', dose: reps(8), weight: 60, rirTarget: null });
    expect(fly).toMatchObject({ exerciseId: null, exercise: 'My own fly' });
    expect(fly.sets[0].weight).toBeNull();
    expect(crunch).toMatchObject({ exercise: 'Crunch', muscle: 'abs' });
    expect(plan.days[1].entries).toEqual([]);
  });

  it('turns a version 2 plan into the current model and keeps everything', () => {
    const plan = migratePlan(version2Plan);

    expect(plan.template).toEqual({ id: 'x', version: 1 });
    expect(plan.days[0]).toMatchObject({ id: 'd1', weekday: 'monday', name: 'Leg day', note: 'Warm up well' });
    expect(plan.days[0].entries[0]).toEqual({
      id: 'e1',
      exerciseId: 'barbell_squat',
      exercise: 'Barbell squat',
      muscle: 'legs',
      restSeconds: 120,
      sets: [
        { type: 'working', dose: reps(6, 8), weight: 80, rirTarget: 2 },
        { type: 'working', dose: reps(6, 8), weight: 80, rirTarget: 2 },
      ],
    });
  });

  it('leaves current plans untouched', () => {
    const plan = migratePlan(version1Plan);
    expect(migratePlan(plan)).toBe(plan);
  });
});

describe('library helpers', () => {
  it('finds library exercises by German or English name, ignoring case', () => {
    expect(findLibraryExercise('langhantel-bankdrücken').id).toBe('barbell_bench_press');
    expect(findLibraryExercise('  FOREARM PLANK ').id).toBe('plank');
    expect(findLibraryExercise('Something else')).toBeNull();
    expect(findLibraryExercise('')).toBeNull();
  });

  it('shows library names in the current language and free text as written', () => {
    const library = { exerciseId: 'barbell_bench_press', exercise: 'whatever' };
    expect(entryName(library, 'de')).toBe('Langhantel-Bankdrücken');
    expect(entryName(library, 'en')).toBe('Barbell bench press');
    expect(entryName({ exerciseId: null, exercise: 'Mein Curl' }, 'de')).toBe('Mein Curl');
  });
});

describe('createEntry', () => {
  it('starts library exercises with 3 sets of 8–12 and their muscle group', () => {
    const entry = createEntry({ exerciseId: 'barbell_squat' });
    expect(entry).toMatchObject({ exerciseId: 'barbell_squat', muscle: 'legs', restSeconds: 90 });
    expect(entry.sets).toEqual([1, 2, 3].map(() => createSet(reps(8, 12))));
  });

  it('measures timed exercises in seconds', () => {
    expect(createEntry({ exerciseId: 'plank' }).sets[0].dose).toEqual({ unit: 'seconds', value: 30 });
  });

  it('keeps the muscle group of own exercises', () => {
    expect(createEntry({ exercise: 'Mein Curl', muscle: 'arms' })).toMatchObject({
      exerciseId: null,
      exercise: 'Mein Curl',
      muscle: 'arms',
    });
  });
});

describe('formatting', () => {
  it('shows ranges, single values and durations', () => {
    expect(formatDose(reps(8, 12))).toBe('8–12');
    expect(formatDose(reps(10))).toBe('10');
    expect(formatDose({ unit: 'seconds', value: 45 })).toBe('45 s');
  });

  it('summarizes sets', () => {
    const working = createSet(reps(8, 12), { weight: 62.5 });
    expect(summarizeSets([working, working, working], 'de')).toBe('3 × 8–12 · 62,5 kg');
    expect(summarizeSets([createSet(reps(12)), createSet(reps(10)), createSet(reps(8))])).toBe(
      '3 × 12 / 10 / 8'
    );
    expect(summarizeSets([createSet(reps(15), { type: 'warmup' }), createSet(reps(5)), createSet(reps(5))])).toBe(
      '1 + 2 × 5'
    );
  });
});

describe('days', () => {
  const plan = {
    schedule: { type: 'weekdays' },
    days: [
      { id: 'b', name: 'B', weekday: 'thursday', entries: [] },
      { id: 'a', name: 'A', weekday: 'monday', entries: [] },
    ],
  };

  it('orders weekday plans by weekday and rotation plans as stored', () => {
    expect(orderedDays(plan).map(day => day.id)).toEqual(['a', 'b']);
    expect(orderedDays({ ...plan, schedule: { type: 'rotation' } }).map(day => day.id)).toEqual(['b', 'a']);
  });

  it('titles days by weekday or by name', () => {
    expect(dayTitle(plan.days[0], plan.schedule, t)).toBe('Donnerstag');
    expect(dayTitle(plan.days[0], { type: 'rotation' }, t)).toBe('B');
  });

  it('removes one day', () => {
    expect(removeDay(plan, 'a').days.map(day => day.id)).toEqual(['b']);
  });
});

describe('weeklySetsByMuscle', () => {
  it('counts effective working sets per muscle group, in group order', () => {
    const squat = createEntry({ exerciseId: 'barbell_squat' });
    const bench = createEntry({ exerciseId: 'barbell_bench_press' });
    bench.sets[0] = { ...bench.sets[0], type: 'warmup' };
    const plan = {
      days: [
        { entries: [squat, bench] },
        { entries: [squat] },
      ],
    };
    // Squat: legs primary and secondary; back and abs only stabilize and do not
    // count. Bench press: chest primary, front shoulder and triceps secondary
    // (two working sets left).
    expect(weeklySetsByMuscle(plan)).toEqual([
      { muscle: 'chest', sets: 2 },
      { muscle: 'shoulders', sets: 1 },
      { muscle: 'arms', sets: 1 },
      { muscle: 'legs', sets: 6 },
    ]);
  });

  it('counts a bench press set as 1 for the chest and 0.5 for the arms', () => {
    const plan = { days: [{ entries: [createEntry({ exerciseId: 'barbell_bench_press' })] }] };
    const sets = Object.fromEntries(weeklySetsByMuscle(plan).map(item => [item.muscle, item.sets]));
    expect(sets.chest).toBe(3);
    expect(sets.arms).toBe(1.5);
  });

  it('counts own exercises fully for their chosen group', () => {
    const plan = {
      days: [{ entries: [createEntry({ exercise: 'Mein Curl', muscle: 'arms' }), createEntry({ exercise: 'Sled', muscle: '' })] }],
    };
    expect(weeklySetsByMuscle(plan)).toEqual([
      { muscle: 'arms', sets: 3 },
      { muscle: 'other', sets: 3 },
    ]);
  });

  it('leaves out stretching and mobility and spreads rotation days over the week', () => {
    const plan = {
      schedule: { type: 'rotation', daysPerWeek: 3 },
      days: [
        { entries: [createEntry({ exerciseId: 'barbell_bench_press' }), createEntry({ exerciseId: 'wall_pec_stretch' })] },
        { entries: [createEntry({ exerciseId: 'cat_cow' })] },
      ],
    };
    const sets = Object.fromEntries(weeklySetsByMuscle(plan).map(item => [item.muscle, item.sets]));
    expect(sets.chest).toBe(4.5);
    expect(sets.arms).toBe(2.25);
  });
});

describe('planProblems', () => {
  const valid = () => ({
    nameOfWorkout: 'Push',
    schedule: { type: 'weekdays' },
    days: [{ id: 'd', name: '', weekday: 'monday', entries: [createEntry({ exerciseId: 'plank' })] }],
  });

  it('accepts a complete plan', () => {
    expect(planProblems(valid())).toEqual([]);
  });

  it('names what is missing', () => {
    const plan = valid();
    plan.nameOfWorkout = ' ';
    plan.days.push({ id: 'e', name: '', weekday: null, entries: [] });
    expect(planProblems(plan)).toEqual([
      { type: 'name' },
      { type: 'noWeekday', dayId: 'e' },
      { type: 'emptyDay', dayId: 'e' },
    ]);
    expect(planProblems({ ...valid(), days: [] })).toEqual([{ type: 'noDays' }]);
  });

  it('needs day names on rotation plans and valid sets', () => {
    const plan = { ...valid(), schedule: { type: 'rotation' } };
    const entry = plan.days[0].entries[0];
    entry.sets = [createSet(reps(12, 8))];
    expect(planProblems(plan)).toEqual([
      { type: 'noDayName', dayId: 'd' },
      { type: 'invalidSets', dayId: 'd', entryId: entry.id },
    ]);
  });
});

describe('muscle names', () => {
  it('maps names from older saved plans and translates known muscles', () => {
    expect(normalizeMuscle('Stomach')).toBe('abs');
    expect(muscleLabel('Stomach', t)).toBe('Bauch');
    expect(muscleLabel('Neck', t)).toBe('Neck');
  });
});
