import { EXERCISES, exerciseGroups, exercisesByGroup } from './exerciseLibrary';
import { MUSCLES } from './muscles';
import { EQUIPMENT } from './equipment';
import { MUSCLE_GROUP_NAMES } from './muscleGroups';

describe('exercise library', () => {
  it('contains the 99 exercises of the catalog, each once', () => {
    const ids = EXERCISES.map(exercise => exercise.id);
    expect(ids).toHaveLength(99);
    expect(new Set(ids).size).toBe(99);
  });

  it.each(EXERCISES.map(exercise => [exercise.id, exercise]))(
    '%s has names and descriptions in both languages',
    (id, exercise) => {
      for (const language of ['de', 'en']) {
        expect(exercise.name[language].trim()).not.toBe('');
        expect(exercise.description[language].length).toBeGreaterThan(40);
      }
      expect(exercise.description.de).not.toBe(exercise.description.en);
    }
  );

  it('only refers to known equipment and to the finest muscles (no wholes with parts)', () => {
    const wholes = new Set(Object.values(MUSCLES).map(muscle => muscle.parent).filter(Boolean));
    for (const exercise of EXERCISES) {
      const { primary, secondary } = exercise.muscles;
      for (const muscle of [...primary, ...secondary]) {
        expect(MUSCLES, `${exercise.id}: ${muscle}`).toHaveProperty(muscle);
        expect(wholes.has(muscle), `${exercise.id}: ${muscle} has parts`).toBe(false);
      }
      expect(new Set(primary).size, exercise.id).toBe(primary.length);
      expect(new Set(secondary).size, exercise.id).toBe(secondary.length);
      expect(primary.filter(muscle => secondary.includes(muscle))).toEqual([]);
      for (const item of exercise.equipment) {
        expect(EQUIPMENT, `${exercise.id}: ${item}`).toHaveProperty(item);
      }
    }
  });

  it('assigns every muscle to one of the six muscle groups', () => {
    for (const [id, muscle] of Object.entries(MUSCLES)) {
      expect(MUSCLE_GROUP_NAMES, id).toContain(muscle.group);
      expect(muscle.de && muscle.en && muscle.latin).toBeTruthy();
    }
    expect(Object.keys(MUSCLES)).toHaveLength(93);
  });

  it('leaves only cardio and boxing exercises without primary muscles', () => {
    const withoutPrimary = EXERCISES.filter(exercise => exercise.muscles.primary.length === 0);
    expect(withoutPrimary.map(exercise => exercise.category).sort()).toEqual(
      expect.arrayContaining(['boxing', 'cardio'])
    );
    expect(withoutPrimary.every(exercise => ['boxing', 'cardio'].includes(exercise.category))).toBe(true);
    expect(EXERCISES.filter(exercise => exerciseGroups(exercise).length === 0)).toEqual(withoutPrimary);
    // Cardio and boxing still name the muscles they load.
    expect(withoutPrimary.every(exercise => exercise.muscles.secondary.length > 0)).toBe(true);
  });

  it('marks only the trained muscle for isolation exercises', () => {
    const find = id => EXERCISES.find(exercise => exercise.id === id);
    expect(find('leg_extension').muscles.primary.sort()).toEqual(
      ['rectus_femoris', 'vastus_intermedius', 'vastus_lateralis', 'vastus_medialis']
    );
    expect(find('leg_extension').muscles.secondary).toEqual([]);
    expect(find('dumbbell_lateral_raise').muscles.primary).toEqual(['deltoid_lateral']);
    expect(find('hammer_curl').muscles.primary).toEqual(['brachialis', 'brachioradialis']);
    expect(find('incline_barbell_press').muscles.primary).toEqual(['pectoralis_major_clavicular']);
    // The short head of biceps femoris does not cross the hip: hinges do not train it.
    expect(find('romanian_deadlift').muscles.primary).not.toContain('biceps_femoris_short');
    expect(find('lying_leg_curl').muscles.primary).toContain('biceps_femoris_short');
  });

  it('puts an exercise into the groups of its primary muscles', () => {
    const find = id => EXERCISES.find(exercise => exercise.id === id);
    expect(exerciseGroups(find('barbell_bench_press'))).toEqual(['chest']);
    expect(exerciseGroups(find('parallel_bar_dip'))).toEqual(['chest', 'arms']);
    expect(exerciseGroups(find('hip_thrust'))).toEqual(['legs']);
    expect(exerciseGroups(find('plank'))).toEqual(['abs']);
    expect(exerciseGroups(find('jump_rope'))).toEqual([]);
  });

  it('lists every muscle group with exercises, translated and sorted', () => {
    const german = exercisesByGroup('de');
    for (const group of MUSCLE_GROUP_NAMES) {
      expect(german[group].length, group).toBeGreaterThanOrEqual(5);
      const names = german[group].map(exercise => exercise.name);
      expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b, 'de')));
    }
    expect(german.chest.map(exercise => exercise.name)).toContain('Langhantel-Bankdrücken');
    expect(exercisesByGroup('en').chest.map(exercise => exercise.name)).toContain('Barbell bench press');
  });
});
