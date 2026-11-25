// The app's exercise library: the exercise catalog V2 (design-handoff/uebungskatalog-v2),
// imported by scripts/import_exercise_catalog.py. Every exercise names its muscles in
// four roles (primary, secondary, stabilizers, stretched); the long texts (setup and
// execution) live in exerciseDetails.json and are loaded on demand (see
// exerciseDetails.js). The texts are editorial and have not been reviewed by a trainer.
import catalog from './exerciseCatalog.json';
import { EQUIPMENT } from './equipment';
import { MUSCLES } from './muscles';
import { MUSCLE_GROUP_NAMES } from './muscleGroups';
import { registerExerciseLibrary } from './exerciseLibraryLoader';

export const EXERCISES = catalog.exercises;

// IDs of merged duplicates point to the exercise that was kept, so plans that
// use the old ID still find it.
export const LEGACY_EXERCISE_IDS = catalog.legacyIds;

const EXERCISES_BY_ID = new Map(EXERCISES.map(exercise => [exercise.id, exercise]));

export const resolveExerciseId = exerciseId => LEGACY_EXERCISE_IDS[exerciseId] ?? exerciseId;

export const exerciseById = exerciseId => EXERCISES_BY_ID.get(resolveExerciseId(exerciseId)) ?? null;

// An exercise belongs to the muscle groups of its primary muscles. Stretches and
// yoga poses without primary muscles belong to the groups they stretch, so they
// can be found by muscle group too (they still never count as training sets).
// Cardio and boxing without muscle data belong to no group.
export function exerciseGroups(exercise) {
  const source = exercise.muscles.primary.length ? exercise.muscles.primary : exercise.muscles.stretched ?? [];
  const groups = new Set(source.map(id => MUSCLES[id].group));
  return MUSCLE_GROUP_NAMES.filter(group => groups.has(group));
}

function localize(exercise, language) {
  return {
    id: exercise.id,
    name: exercise.name[language] ?? exercise.name.en,
    category: exercise.category,
    equipment: exercise.equipment,
    muscles: exercise.muscles,
    image: null,
  };
}

// Exercises done for one arm, leg or side at a time: repetitions and weight are
// logged per side (left and right). Comes from `perSide` in the catalog.
export const PER_SIDE_EXERCISE_IDS = new Set(EXERCISES.filter(exercise => exercise.perSide).map(exercise => exercise.id));

export const isPerSideExercise = exerciseId => PER_SIDE_EXERCISE_IDS.has(resolveExerciseId(exerciseId));

// Only strength work counts as training sets for the muscle load (sets per
// muscle, hints, muscle figure). Stretching, mobility, yoga, Pilates, boxing,
// cardio and plyometrics (jumps, throws: power and coordination, not muscle
// building) are logged and analysed, but are no sets for a muscle.
// Own exercises (no category) count for the group they were given.
export const LOAD_CATEGORIES = new Set(['strength', 'isometric']);

// Stretching, mobility, yoga, Pilates, boxing and cardio have no weight field.
// Plyometric exercises have one only when they move a load (medicine ball, slam
// ball, kettlebell, weighted vest …); box jumps and skips do not.
const WITHOUT_WEIGHT = new Set(['stretch', 'mobility', 'yoga', 'pilates', 'boxing', 'cardio']);
const isLoad = item => EQUIPMENT[item]?.kind === 'free_weight';
export function usesWeight(exerciseId) {
  const exercise = exerciseId ? exerciseById(exerciseId) : null;
  if (!exercise) return true;
  if (WITHOUT_WEIGHT.has(exercise.category)) return false;
  if (exercise.category === 'plyometric') return exercise.equipment.some(isLoad);
  return true;
}
export const countsForMuscleLoad = category => category === null || category === undefined || LOAD_CATEGORIES.has(category);

// Exercises per muscle group in the given language, sorted by name.
export function exercisesByGroup(language) {
  const groups = Object.fromEntries(MUSCLE_GROUP_NAMES.map(group => [group, []]));
  for (const exercise of EXERCISES) {
    for (const group of exerciseGroups(exercise)) {
      groups[group].push(localize(exercise, language));
    }
  }
  for (const group of MUSCLE_GROUP_NAMES) {
    groups[group].sort((a, b) => a.name.localeCompare(b.name, language));
  }
  return groups;
}

// Fills the holder of exerciseLibraryLoader.js for the code that runs without a
// static import of the catalog (utils/workoutPlan.js).
registerExerciseLibrary({
  EXERCISES,
  exerciseById,
  exerciseGroups,
  isPerSideExercise,
  countsForMuscleLoad,
});
