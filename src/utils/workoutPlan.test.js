import {
  PLAN_SCHEMA_VERSION,
  buildWorkoutPlan,
  entryName,
  findLibraryExercise,
  formatDose,
  getDaysWithoutExercises,
  groupEntriesByMuscle,
  migratePlan,
  muscleLabel,
  normalizeMuscle,
  removeDay,
  sortDays,
  splitWorkoutPlan,
} from './workoutPlan';
import { translate } from '../i18n/translations';

const t = (key, values) => translate('de', key, values);

const entry = (id, muscle, extra = {}) => ({
  id,
  exerciseId: null,
  exercise: id,
  muscle,
  sets: 3,
  dose: { unit: 'repetitions', min: 8, max: 12 },
  weight: null,
  restSeconds: null,
  ...extra,
});

// A plan as saved by app versions before the plan model 2.
const legacyPlan = {
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

describe('migratePlan', () => {
  it('turns a legacy plan into the current model', () => {
    const plan = migratePlan(legacyPlan);

    expect(plan.schemaVersion).toBe(PLAN_SCHEMA_VERSION);
    expect(plan.days.map(day => day.id)).toEqual(['d-fri', 'd-mon']);
    expect(plan.days[0].entries).toEqual([
      {
        id: 'e1',
        exerciseId: 'barbell_bench_press',
        exercise: 'Barbell bench press',
        muscle: 'chest',
        sets: 4,
        dose: { unit: 'repetitions', min: 8, max: 8 },
        weight: 60,
        restSeconds: null,
      },
      {
        id: 'e2',
        exerciseId: null,
        exercise: 'My own fly',
        muscle: 'chest',
        sets: 3,
        dose: { unit: 'repetitions', min: 12, max: 12 },
        weight: null,
        restSeconds: null,
      },
      expect.objectContaining({ exercise: 'Crunch', muscle: 'abs', weight: 0, id: expect.any(String) }),
    ]);
    expect(plan.days[1].entries).toEqual([]);
  });

  it('leaves current plans untouched', () => {
    const plan = migratePlan(legacyPlan);
    expect(migratePlan(plan)).toBe(plan);
  });
});

describe('library helpers', () => {
  it('finds library exercises by German or English name, ignoring case', () => {
    expect(findLibraryExercise('langhantel-bankdrücken').id).toBe('barbell_bench_press');
    expect(findLibraryExercise('  PLANK ').id).toBe('plank');
    expect(findLibraryExercise('Something else')).toBeNull();
    expect(findLibraryExercise('')).toBeNull();
  });

  it('shows library names in the current language and free text as written', () => {
    const library = entry('e1', 'chest', { exerciseId: 'barbell_bench_press', exercise: 'whatever' });
    expect(entryName(library, 'de')).toBe('Langhantel-Bankdrücken');
    expect(entryName(library, 'en')).toBe('Barbell bench press');
    expect(entryName(entry('Mein Curl', 'arms'), 'de')).toBe('Mein Curl');
  });
});

describe('formatDose', () => {
  it('shows ranges, single values and durations', () => {
    expect(formatDose({ unit: 'repetitions', min: 8, max: 12 })).toBe('8–12');
    expect(formatDose({ unit: 'repetitions', min: 10, max: 10 })).toBe('10');
    expect(formatDose({ unit: 'seconds', value: 45 })).toBe('45 s');
  });
});

describe('groupEntriesByMuscle', () => {
  it('groups entries by muscle group in a fixed order', () => {
    const groups = groupEntriesByMuscle([entry('a', 'legs'), entry('b', 'chest'), entry('c', 'legs')]);
    expect(groups.map(group => group.name)).toEqual(['chest', 'legs']);
    expect(groups[1].entries.map(item => item.id)).toEqual(['a', 'c']);
  });
});

describe('building and splitting plans', () => {
  const details = {
    id: 'p',
    nameOfWorkout: 'Legs',
    description: '',
    days: [
      { id: 'd1', day: 'monday' },
      { id: 'd2', day: 'thursday' },
    ],
  };

  it('builds a current plan from details and entries per day', () => {
    const plan = buildWorkoutPlan(details, { monday: [entry('a', 'legs')] });
    expect(plan.schemaVersion).toBe(PLAN_SCHEMA_VERSION);
    expect(plan.days).toEqual([
      { id: 'd1', day: 'monday', entries: [entry('a', 'legs')] },
      { id: 'd2', day: 'thursday', entries: [] },
    ]);
  });

  it('survives a round trip and sorts the days by weekday', () => {
    const plan = buildWorkoutPlan(
      { ...details, days: [...details.days].reverse() },
      { monday: [entry('a', 'legs')] }
    );
    const { details: split, entriesByDay } = splitWorkoutPlan(plan);
    expect(split.days).toEqual(details.days);
    expect(entriesByDay.monday).toEqual([entry('a', 'legs')]);
  });

  it('splits legacy plans after migrating them', () => {
    const { details: split, entriesByDay } = splitWorkoutPlan(legacyPlan);
    expect(split.days.map(day => day.day)).toEqual(['monday', 'friday']);
    expect(entriesByDay.friday).toHaveLength(3);
  });

  it('reports days without exercises', () => {
    expect(getDaysWithoutExercises(details, { monday: [entry('a', 'legs')], thursday: [] })).toEqual([
      'thursday',
    ]);
  });
});

describe('removeDay', () => {
  it('removes one day and keeps the plan otherwise unchanged', () => {
    const plan = migratePlan(legacyPlan);
    const result = removeDay(plan, 'd-mon');
    expect(result.days.map(day => day.id)).toEqual(['d-fri']);
    expect(plan.days).toHaveLength(2);
  });
});

describe('days and muscle names', () => {
  it('sorts days in week order', () => {
    const days = [{ day: 'sunday' }, { day: 'monday' }, { day: 'friday' }];
    expect(sortDays(days).map(({ day }) => day)).toEqual(['monday', 'friday', 'sunday']);
  });

  it('maps names from older saved plans and translates known muscles', () => {
    expect(normalizeMuscle('Stomach')).toBe('abs');
    expect(muscleLabel('Stomach', t)).toBe('Bauch');
    expect(muscleLabel('Neck', t)).toBe('Neck');
  });
});
