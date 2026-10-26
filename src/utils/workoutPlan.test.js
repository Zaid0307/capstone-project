import {
  buildWorkoutPlan,
  deleteDay,
  deletePlan,
  getDaysWithoutExercises,
  groupExercisesByMuscle,
  muscleLabel,
  normalizeMuscle,
  sortDays,
  splitWorkoutPlan,
  updatePlan,
} from './workoutPlan';
import { translate } from '../i18n/translations';

const t = (key, values) => translate('de', key, values);

const plans = [
  {
    id: 'plan1',
    nameOfWorkout: 'Push',
    days: [
      { id: 'p1-mon', day: 'monday', muscles: [] },
      { id: 'p1-thu', day: 'thursday', muscles: [] },
    ],
  },
  {
    id: 'plan2',
    nameOfWorkout: 'Pull',
    days: [
      { id: 'p2-tue', day: 'tuesday', muscles: [] },
      { id: 'p2-fri', day: 'friday', muscles: [] },
    ],
  },
];

describe('deleteDay', () => {
  it('removes the day only from the given plan', () => {
    const result = deleteDay(plans, 'plan2', 'p2-fri');

    expect(result[0]).toBe(plans[0]);
    expect(result[1].days.map(day => day.id)).toEqual(['p2-tue']);
  });

  it('does not mutate the original plans', () => {
    deleteDay(plans, 'plan2', 'p2-fri');
    expect(plans[1].days).toHaveLength(2);
  });
});

describe('deletePlan', () => {
  it('removes the plan with the given id', () => {
    expect(deletePlan(plans, 'plan1').map(plan => plan.id)).toEqual([
      'plan2',
    ]);
  });
});

describe('sortDays', () => {
  it('sorts days in week order', () => {
    const days = [{ day: 'sunday' }, { day: 'monday' }, { day: 'friday' }];
    expect(sortDays(days).map(({ day }) => day)).toEqual([
      'monday',
      'friday',
      'sunday',
    ]);
  });
});

describe('groupExercisesByMuscle', () => {
  it('groups exercises by muscle in a fixed order', () => {
    const groups = groupExercisesByMuscle([
      { id: 'a', muscle: 'legs', exercise: 'Squat' },
      { id: 'b', muscle: 'chest', exercise: 'Bench Press' },
      { id: 'c', muscle: 'legs', exercise: 'Lunge' },
    ]);

    expect(groups.map(group => group.name)).toEqual(['chest', 'legs']);
    expect(groups[1].exercises.map(exercise => exercise.id)).toEqual([
      'a',
      'c',
    ]);
    groups.forEach(group => expect(group.id).toEqual(expect.any(String)));
  });
});

describe('buildWorkoutPlan', () => {
  const plan = {
    id: 'plan',
    nameOfWorkout: 'Full body',
    description: '',
    days: [
      { id: 'd1', day: 'monday' },
      { id: 'd2', day: 'wednesday' },
    ],
  };

  it('adds the grouped exercises to every day', () => {
    const result = buildWorkoutPlan(plan, {
      monday: [{ id: 'a', muscle: 'chest', exercise: 'Bench Press' }],
      wednesday: [{ id: 'b', muscle: 'legs', exercise: 'Squat' }],
    });

    expect(result.days[0]).toMatchObject({
      id: 'd1',
      day: 'monday',
      muscles: [{ name: 'chest', exercises: [{ exercise: 'Bench Press' }] }],
    });
    expect(result.days[1].muscles[0].name).toBe('legs');
  });

  it('reports days without exercises', () => {
    expect(
      getDaysWithoutExercises(plan, {
        monday: [{ id: 'a', muscle: 'chest', exercise: 'Bench Press' }],
        wednesday: [],
      })
    ).toEqual(['wednesday']);
  });
});

describe('splitWorkoutPlan', () => {
  it('turns a saved plan into details and exercises per day', () => {
    const { details, exercisesByDay } = splitWorkoutPlan({
      id: 'plan',
      nameOfWorkout: 'Push',
      days: [
        {
          id: 'd2',
          day: 'friday',
          muscles: [
            {
              id: 'm1',
              name: 'Stomach',
              exercises: [{ exercise: 'Crunch', muscle: 'Stomach' }],
            },
          ],
        },
        { id: 'd1', day: 'monday' },
      ],
    });

    expect(details).toEqual({
      id: 'plan',
      nameOfWorkout: 'Push',
      description: '',
      days: [
        { id: 'd1', day: 'monday' },
        { id: 'd2', day: 'friday' },
      ],
    });
    expect(exercisesByDay.monday).toEqual([]);
    expect(exercisesByDay.friday).toEqual([
      { id: expect.any(String), exercise: 'Crunch', muscle: 'abs' },
    ]);
  });

  it('survives a round trip through buildWorkoutPlan', () => {
    const plan = buildWorkoutPlan(
      { id: 'p', nameOfWorkout: 'Legs', description: '', days: [{ id: 'd', day: 'monday' }] },
      { monday: [{ id: 'e', muscle: 'legs', exercise: 'Squat' }] }
    );
    const { details, exercisesByDay } = splitWorkoutPlan(plan);
    expect(details.days).toEqual([{ id: 'd', day: 'monday' }]);
    expect(exercisesByDay).toEqual({
      monday: [{ id: 'e', muscle: 'legs', exercise: 'Squat' }],
    });
  });
});

describe('updatePlan', () => {
  it('replaces the plan with the same id', () => {
    const updated = { ...plans[1], nameOfWorkout: 'Pull v2' };
    const result = updatePlan(plans, updated);
    expect(result[0]).toBe(plans[0]);
    expect(result[1]).toBe(updated);
  });
});

describe('muscle names', () => {
  it('maps names from older saved plans', () => {
    expect(normalizeMuscle('Stomach')).toBe('abs');
    expect(normalizeMuscle('Arms')).toBe('arms');
  });

  it('translates known muscles and keeps unknown names', () => {
    expect(muscleLabel('Stomach', t)).toBe('Bauch');
    expect(muscleLabel('chest', t)).toBe('Brust');
    expect(muscleLabel('Neck', t)).toBe('Neck');
  });
});
