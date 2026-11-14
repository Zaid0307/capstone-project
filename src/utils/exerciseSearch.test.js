import {
  ALL,
  TRAINING_TYPES,
  exerciseTypes,
  exerciseVariants,
  filterExercises,
  filterOptions,
  muscleSimilarity,
} from './exerciseSearch';
import { EXERCISES, exerciseGroups } from '../data/exerciseLibrary';
import { PLAN_MUSCLES } from './workoutPlan';

const byId = id => EXERCISES.find(exercise => exercise.id === id);
const ids = list => list.map(exercise => exercise.id);

describe('filterExercises', () => {
  it('finds exercises by German or English words in any order', () => {
    expect(ids(filterExercises({ query: 'squat barbell' }, 'en'))).toContain('barbell_squat');
    expect(ids(filterExercises({ query: 'kniebeuge langhantel' }, 'de'))).toContain('barbell_squat');
  });

  it('combines muscle group and equipment', () => {
    const found = filterExercises({ muscle: 'legs', equipment: 'barbell' }, 'en');
    expect(found.length).toBeGreaterThan(0);
    for (const exercise of found) {
      expect(exerciseGroups(exercise)).toContain('legs');
      expect(exercise.equipment).toContain('barbell');
    }
  });

  it('puts exercises without a muscle group under other', () => {
    for (const exercise of filterExercises({ muscle: 'other' }, 'en')) {
      expect(exerciseGroups(exercise)).toEqual([]);
    }
  });
});

describe('filterOptions', () => {
  it('offers only equipment that the chosen muscle group uses', () => {
    const { equipmentCounts } = filterOptions({ muscle: 'arms' }, PLAN_MUSCLES);
    const armEquipment = new Set(
      EXERCISES.filter(exercise => exerciseGroups(exercise).includes('arms')).flatMap(exercise => exercise.equipment)
    );
    expect(new Set(Object.keys(equipmentCounts))).toEqual(armEquipment);
    expect(equipmentCounts.leg_press_machine).toBeUndefined();
  });

  it('counts per muscle group what the chosen equipment offers', () => {
    const { muscleCounts } = filterOptions({ equipment: 'leg_press_machine' }, PLAN_MUSCLES);
    expect(muscleCounts.legs).toBeGreaterThan(0);
    expect(muscleCounts.chest).toBe(0);
  });

  it('every count matches the filtered list', () => {
    const filters = { query: 'press', muscle: 'chest', equipment: ALL };
    const { muscleCounts, equipmentCounts } = filterOptions(filters, PLAN_MUSCLES);
    for (const muscle of PLAN_MUSCLES) {
      expect(muscleCounts[muscle]).toBe(filterExercises({ ...filters, muscle }, 'en').length);
    }
    for (const [equipment, count] of Object.entries(equipmentCounts)) {
      expect(count).toBe(filterExercises({ ...filters, equipment }, 'en').length);
    }
  });
});

describe('kinds of training', () => {
  it('derives the kind of training from the equipment', () => {
    expect(exerciseTypes(byId('dumbbell_curl'))).toEqual(['dumbbell']);
    expect(exerciseTypes(byId('preacher_curl'))).toEqual(['barbell']);
    expect(exerciseTypes(byId('band_dumbbell_lateral_raise'))).toEqual(['dumbbell', 'band']);
    expect(exerciseTypes(byId('push_up'))).toEqual(['bodyweight']);
    expect(exerciseTypes(byId('assisted_pull_up'))).toEqual(['bodyweight', 'band']);
    expect(exerciseTypes(byId('leg_press'))).toEqual(['machine']);
    expect(exerciseTypes(byId('barbell_squat'))).toEqual(['barbell']);
  });

  it('gives every exercise at least one kind', () => {
    for (const exercise of EXERCISES) {
      expect(exerciseTypes(exercise).length, exercise.id).toBeGreaterThan(0);
    }
  });

  it('shows exercises of any chosen kind', () => {
    const found = filterExercises({ types: ['band', 'dumbbell'] }, 'en');
    expect(found.length).toBeGreaterThan(0);
    for (const exercise of found) {
      expect(exerciseTypes(exercise).some(type => ['band', 'dumbbell'].includes(type))).toBe(true);
    }
    expect(ids(found)).not.toContain('barbell_squat');
  });

  it('counts each kind with the other filters', () => {
    const { typeCounts, muscleCounts } = filterOptions({ muscle: 'arms', types: ['band'] }, PLAN_MUSCLES);
    for (const type of TRAINING_TYPES) {
      expect(typeCounts[type]).toBe(filterExercises({ muscle: 'arms', types: [type] }, 'en').length);
    }
    expect(typeCounts.machine).toBe(0);
    expect(muscleCounts.arms).toBe(filterExercises({ muscle: 'arms', types: ['band'] }, 'en').length);
  });
});

describe('variants', () => {
  it('rates identical muscles as 1 and unrelated muscles as 0', () => {
    expect(muscleSimilarity(byId('barbell_squat'), byId('barbell_squat'))).toBe(1);
    expect(muscleSimilarity(byId('barbell_squat'), byId('barbell_bench_press'))).toBe(0);
  });

  it('lists exercises for the same muscles with other equipment', () => {
    const variants = exerciseVariants(byId('barbell_bench_press'));
    expect(ids(variants)).toContain('dumbbell_bench_press');
    expect(ids(variants)).not.toContain('barbell_bench_press');
    expect(ids(variants)).not.toContain('barbell_squat');
  });

  it('has no variants for exercises without primary muscles', () => {
    const withoutMuscles = EXERCISES.find(exercise => exercise.muscles.primary.length === 0);
    expect(exerciseVariants(withoutMuscles)).toEqual([]);
  });
});
