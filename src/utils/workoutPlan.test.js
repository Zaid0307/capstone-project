import {
  PLAN_SCHEMA_VERSION,
  combinePlans,
  supersetLabels,
  exerciseFitsEquipment,
  planEquipment,
  createEntry,
  createSet,
  dayTitle,
  dayWeekdays,
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
  withWeekdays,
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

  it('turns the one weekday of a version 3 day into a list and keeps it mirrored', () => {
    const version3 = {
      id: 'v3',
      schemaVersion: 3,
      nameOfWorkout: 'Old',
      description: '',
      schedule: { type: 'weekdays' },
      days: [
        { id: 'a', name: 'A', weekday: 'monday', entries: [] },
        { id: 'b', name: 'B', weekday: null, entries: [] },
      ],
    };
    const plan = migratePlan(version3);
    expect(plan.schemaVersion).toBe(PLAN_SCHEMA_VERSION);
    expect(plan.days.map(day => [day.weekdays, day.weekday])).toEqual([
      [['monday'], 'monday'],
      [[], null],
    ]);
    expect(migratePlan(version1Plan).days[0].weekdays).toEqual(['friday']);
  });

  it('leaves current plans untouched', () => {
    const plan = migratePlan(version1Plan);
    expect(migratePlan(plan)).toBe(plan);
  });
});

describe('library helpers', () => {
  it('finds older exercises by German or English name, ignoring case', () => {
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

  it('trains one day on several weekdays', () => {
    const fullBody = withWeekdays({ id: 'f', name: 'Full body', entries: [] }, ['thursday', 'monday']);
    expect(fullBody).toMatchObject({ weekdays: ['monday', 'thursday'], weekday: 'monday' });
    expect(dayWeekdays({ weekday: 'friday' })).toEqual(['friday']);
    expect(dayTitle(fullBody, { type: 'weekdays' }, t)).toBe('Montag, Donnerstag');
    const plan2 = { schedule: { type: 'weekdays' }, days: [plan.days[0], { ...fullBody }] };
    expect(orderedDays(plan2).map(day => day.id)).toEqual(['f', 'b']);
  });

  it('counts a day trained on two weekdays twice per week', () => {
    const squat = createEntry({ exerciseId: 'barbell_squat' });
    const twice = { schedule: { type: 'weekdays' }, days: [withWeekdays({ entries: [squat] }, ['monday', 'thursday'])] };
    const once = { schedule: { type: 'weekdays' }, days: [withWeekdays({ entries: [squat] }, ['monday'])] };
    const legs = plan => weeklySetsByMuscle(plan).find(item => item.muscle === 'legs').sets;
    expect(legs(twice)).toBe(2 * legs(once));
  });

  it('adds up several plans as one week, each with its own schedule', () => {
    const squat = createEntry({ exerciseId: 'barbell_squat' });
    const gym = { schedule: { type: 'weekdays' }, days: [withWeekdays({ entries: [squat] }, ['monday', 'thursday'])] };
    const home = { schedule: { type: 'rotation', daysPerWeek: 3 }, days: [{ name: 'A', entries: [squat] }] };
    const legs = plan => weeklySetsByMuscle(plan).find(item => item.muscle === 'legs').sets;
    expect(legs(combinePlans([gym, home]))).toBe(legs(gym) + legs(home));
    expect(legs(home)).toBe(3 * legs({ ...home, schedule: { type: 'rotation', daysPerWeek: 1 } }));
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

describe('supersetLabels', () => {
  it('names supersets A1/A2, B1/B2 and leaves single exercises out', () => {
    const entries = [{ groupId: 'x' }, { groupId: 'x' }, {}, { groupId: 'y' }, { groupId: 'y' }, { groupId: 'y' }, { groupId: 'z' }];
    expect(supersetLabels(entries).map(item => item?.label ?? null)).toEqual(['A1', 'A2', null, 'B1', 'B2', 'B3', null]);
    expect(supersetLabels(entries)[1]).toMatchObject({ group: 'A', position: 1, size: 2 });
    // Members that are not next to each other are no superset.
    expect(supersetLabels([{ groupId: 'x' }, {}, { groupId: 'x' }])).toEqual([null, null, null]);
  });
});

describe('place and equipment', () => {
  it('has all equipment in a gym and in plans without a setup', () => {
    expect(planEquipment({})).toBeNull();
    expect(planEquipment({ setup: { place: 'gym', equipment: null } })).toBeNull();
    expect(planEquipment({ setup: { place: 'home', equipment: ['dumbbells'] } })).toEqual(['dumbbells']);
  });

  it('fits exercises whose equipment is all there; mat and wall always are', () => {
    const exercise = equipment => ({ equipment });
    expect(exerciseFitsEquipment(exercise(['barbell', 'rack']), null)).toBe(true);
    expect(exerciseFitsEquipment(exercise(['dumbbells']), ['dumbbells'])).toBe(true);
    expect(exerciseFitsEquipment(exercise(['mat']), [])).toBe(true);
    expect(exerciseFitsEquipment(exercise(['barbell', 'rack']), ['barbell'])).toBe(false);
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
    // An emptied weekday list counts, even if an old mirrored weekday is left.
    const emptied = { ...valid(), days: [{ ...valid().days[0], weekdays: [] }] };
    expect(planProblems(emptied)).toEqual([{ type: 'noWeekday', dayId: 'd' }]);
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
