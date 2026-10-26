import { EXERCISES, exerciseGroups, exercisesByGroup } from './exerciseLibrary';
import { MUSCLES } from './muscles';
import { EQUIPMENT } from './equipment';
import { MUSCLE_GROUP_NAMES } from './muscleGroups';

describe('exercise library', () => {
  it('contains the 97 exercises of the catalog, each once', () => {
    const ids = EXERCISES.map(exercise => exercise.id);
    expect(ids).toHaveLength(97);
    expect(new Set(ids).size).toBe(97);
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

  it('only refers to known muscles and equipment', () => {
    for (const exercise of EXERCISES) {
      const { primary, secondary } = exercise.muscles;
      for (const muscle of [...primary, ...secondary]) {
        expect(MUSCLES, `${exercise.id}: ${muscle}`).toHaveProperty(muscle);
      }
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
    expect(Object.keys(MUSCLES)).toHaveLength(39);
  });

  it('leaves only cardio and boxing exercises without primary muscles', () => {
    const withoutGroup = EXERCISES.filter(exercise => exerciseGroups(exercise).length === 0);
    expect(withoutGroup.map(exercise => exercise.category).sort()).toEqual(
      expect.arrayContaining(['boxing', 'cardio'])
    );
    expect(withoutGroup.every(exercise => ['boxing', 'cardio'].includes(exercise.category))).toBe(true);
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
