import {
  EXERCISES,
  LEGACY_EXERCISE_IDS,
  countsForMuscleLoad,
  exerciseById,
  exerciseGroups,
  exercisesByGroup,
  isPerSideExercise,
  usesWeight,
} from './exerciseLibrary';
import details from './exerciseDetails.json';
import { describeExercise } from './exerciseDetails';
import existingIds from '../../scripts/existing_exercise_ids.json';
import planTemplates from './planTemplates.json';
import { INSPIRED_TEMPLATES } from './inspiredTemplates';
import { MUSCLES } from './muscles';
import { EQUIPMENT } from './equipment';
import { MUSCLE_GROUP_NAMES } from './muscleGroups';

const ROLES = ['primary', 'secondary', 'stabilizers', 'stretched'];
const find = id => EXERCISES.find(exercise => exercise.id === id);

describe('exercise library', () => {
  it('contains the 431 exercises of the catalog V2, each once', () => {
    const ids = EXERCISES.map(exercise => exercise.id);
    expect(ids).toHaveLength(431);
    expect(new Set(ids).size).toBe(431);
  });

  it('keeps every exercise ID of the first library', () => {
    expect(existingIds).toHaveLength(99);
    for (const id of existingIds) expect(find(id), id).toBeDefined();
  });

  it('resolves the IDs of merged duplicates to the kept exercise', () => {
    expect(LEGACY_EXERCISE_IDS).toEqual({ incline_y_raise: 'prone_y_raise' });
    expect(find('incline_y_raise')).toBeUndefined();
    expect(exerciseById('incline_y_raise').id).toBe('prone_y_raise');
    expect(exerciseById('unknown')).toBeNull();
  });

  it.each(EXERCISES.map(exercise => [exercise.id, exercise]))(
    '%s has names, a description and instructions in both languages',
    (id, exercise) => {
      const detail = details[id];
      for (const language of ['de', 'en']) {
        expect(exercise.name[language].trim()).not.toBe('');
        expect(describeExercise(detail, language).length).toBeGreaterThan(30);
        expect(detail.execution.steps.length).toBeGreaterThanOrEqual(3);
        for (const step of detail.execution.steps) expect(step[language].trim()).not.toBe('');
      }
      expect(describeExercise(detail, 'de')).not.toBe(describeExercise(detail, 'en'));
    }
  );

  it('has details for exactly the exercises of the library', () => {
    expect(Object.keys(details).sort()).toEqual(EXERCISES.map(exercise => exercise.id).sort());
  });

  it('only refers to known equipment and to the finest muscles, each in one role', () => {
    const wholes = new Set(Object.values(MUSCLES).map(muscle => muscle.parent).filter(Boolean));
    for (const exercise of EXERCISES) {
      const all = ROLES.flatMap(role => exercise.muscles[role]);
      for (const muscle of all) {
        expect(MUSCLES, `${exercise.id}: ${muscle}`).toHaveProperty(muscle);
        expect(wholes.has(muscle), `${exercise.id}: ${muscle} has parts`).toBe(false);
      }
      expect(new Set(all).size, `${exercise.id}: a muscle in two roles`).toBe(all.length);
      for (const item of exercise.equipment) {
        expect(EQUIPMENT, `${exercise.id}: ${item}`).toHaveProperty(item);
      }
    }
  });

  it('links only to exercises in the library', () => {
    for (const exercise of EXERCISES) {
      for (const ref of [...exercise.variants, exercise.regression, exercise.progression].filter(Boolean)) {
        expect(find(ref), `${exercise.id} -> ${ref}`).toBeDefined();
      }
    }
  });

  it('uses only exercises of the library in the plan templates', () => {
    const ids = [
      ...planTemplates.flatMap(template => template.days.flatMap(day => day.entries.map(entry => entry.exerciseId))),
      ...INSPIRED_TEMPLATES.flatMap(template => template.days.flatMap(day => day.entries.map(entry => entry.exerciseId))),
    ].filter(Boolean);
    expect(ids.length).toBeGreaterThan(100);
    for (const id of new Set(ids)) expect(exerciseById(id), id).not.toBeNull();
  });

  it('keeps the old equipment names and adds the new equipment', () => {
    expect(EQUIPMENT.barbell).toEqual({ de: 'Langhantel', en: 'Barbell', kind: 'free_weight' });
    expect(EQUIPMENT.rack.de).toBe('Hantelablage / Rack');
    expect(EQUIPMENT.kettlebell.en).toBe('Kettlebell');
    expect(Object.keys(EQUIPMENT)).toHaveLength(81);
  });

  it('assigns every muscle to one of the six muscle groups', () => {
    for (const [id, muscle] of Object.entries(MUSCLES)) {
      expect(MUSCLE_GROUP_NAMES, id).toContain(muscle.group);
      expect(muscle.de && muscle.en && muscle.latin).toBeTruthy();
    }
    expect(Object.keys(MUSCLES)).toHaveLength(93);
  });

  it('leaves only exercises that are no muscle building without primary muscles', () => {
    const withoutPrimary = EXERCISES.filter(exercise => exercise.muscles.primary.length === 0);
    expect(withoutPrimary.length).toBeGreaterThan(0);
    for (const exercise of withoutPrimary) {
      expect(['stretch', 'yoga', 'mobility', 'cardio', 'boxing', 'plyometric'], exercise.id).toContain(exercise.category);
      // They still name the muscles they load or stretch.
      const others = ['secondary', 'stabilizers', 'stretched'].flatMap(role => exercise.muscles[role]);
      expect(others.length, exercise.id).toBeGreaterThan(0);
    }
    // Without primary muscles, an exercise belongs to the groups it stretches; only
    // exercises that neither work nor stretch a muscle (cardio, boxing) have no group.
    const withoutGroup = withoutPrimary.filter(exercise => exercise.muscles.stretched.length === 0);
    expect(EXERCISES.filter(exercise => exerciseGroups(exercise).length === 0)).toEqual(withoutGroup);
  });

  it('marks the trained muscles of isolation exercises as primary', () => {
    expect(find('leg_extension').muscles.primary.sort()).toEqual(
      ['rectus_femoris', 'vastus_intermedius', 'vastus_lateralis', 'vastus_medialis']
    );
    expect(find('dumbbell_lateral_raise').muscles.primary).toEqual(['deltoid_lateral']);
    expect(find('incline_barbell_press').muscles.primary).toEqual(['pectoralis_major_clavicular']);
    // The short head of biceps femoris does not cross the hip: hinges do not train it.
    expect(find('romanian_deadlift').muscles.primary).not.toContain('biceps_femoris_short');
    expect(find('lying_leg_curl').muscles.primary).toContain('biceps_femoris_short');
  });

  it('puts an exercise into the groups of its primary muscles', () => {
    expect(exerciseGroups(find('barbell_bench_press'))).toEqual(['chest']);
    expect(exerciseGroups(find('hip_thrust'))).toEqual(['legs']);
    expect(exerciseGroups(find('plank'))).toEqual(['abs']);
    // A stretch belongs to the group it stretches (hip flexors → legs).
    expect(exerciseGroups(find('hip_flexor_stretch'))).toEqual(['legs']);
  });

  it('takes per-side logging from the catalog', () => {
    expect(isPerSideExercise('one_arm_dumbbell_row')).toBe(true);
    expect(isPerSideExercise('bulgarian_split_squat')).toBe(true);
    expect(isPerSideExercise('barbell_bench_press')).toBe(false);
    for (const exercise of EXERCISES) expect(isPerSideExercise(exercise.id)).toBe(exercise.perSide);
  });

  it('counts only strength and holds as muscle building and gives weight only where a load moves', () => {
    expect(countsForMuscleLoad('strength')).toBe(true);
    expect(countsForMuscleLoad('isometric')).toBe(true);
    expect(countsForMuscleLoad('plyometric')).toBe(false);
    expect(countsForMuscleLoad('yoga')).toBe(false);
    expect(countsForMuscleLoad(undefined)).toBe(true);
    expect(usesWeight('barbell_bench_press')).toBe(true);
    expect(usesWeight('jump_rope')).toBe(false);
    expect(usesWeight(null)).toBe(true);
    expect(usesWeight('own exercise')).toBe(true);
    const plyometric = EXERCISES.filter(exercise => exercise.category === 'plyometric');
    for (const exercise of plyometric) {
      const withLoad = exercise.equipment.some(item => EQUIPMENT[item].kind === 'free_weight');
      expect(usesWeight(exercise.id), exercise.id).toBe(withLoad);
    }
    expect(plyometric.some(exercise => usesWeight(exercise.id))).toBe(true);
    expect(plyometric.some(exercise => !usesWeight(exercise.id))).toBe(true);
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
