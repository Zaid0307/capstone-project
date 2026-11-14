import { EXERCISES, exerciseGroups } from '../data/exerciseLibrary';

// Finding exercises in the library: text search, filters that depend on each
// other (muscle group ↔ equipment) and variants of an exercise.

export const ALL = 'all';

// Kind of training an exercise needs, derived from its equipment. Benches,
// mats, racks and the like do not count; exercises without a load are bodyweight.
const EQUIPMENT_TYPE = {
  dumbbells: 'dumbbell',
  barbell: 'barbell',
  ez_bar: 'barbell',
  resistance_band: 'band',
  miniband: 'band',
  assist_band: 'band',
  cable_machine: 'cable',
  chest_press_machine: 'machine',
  hack_squat_machine: 'machine',
  leg_curl_machine: 'machine',
  leg_extension_machine: 'machine',
  leg_press_machine: 'machine',
  pullover_machine: 'machine',
  smith_machine: 'machine',
  t_bar_station: 'machine',
  heavy_bag: 'boxing',
  treadmill: 'cardio',
  jump_rope: 'cardio',
};
// Bodyweight even with this equipment: it only holds the body.
const BODYWEIGHT_EQUIPMENT = ['pullup_bar', 'dip_station'];

export const TRAINING_TYPES = ['bodyweight', 'dumbbell', 'barbell', 'band', 'cable', 'machine', 'boxing', 'cardio'];

export function exerciseTypes(exercise) {
  const types = new Set(exercise.equipment.map(item => EQUIPMENT_TYPE[item]).filter(Boolean));
  if (types.size === 0 || exercise.equipment.some(item => BODYWEIGHT_EQUIPMENT.includes(item))) {
    types.add('bodyweight');
  }
  return TRAINING_TYPES.filter(type => types.has(type));
}

// Several types can be chosen; an exercise matches if it has any of them.
const matchesTypes = (exercise, types) =>
  types.length === 0 || exerciseTypes(exercise).some(type => types.includes(type));

const nameIn = (exercise, language) => exercise.name[language] ?? exercise.name.en;

function matchesQuery(exercise, query) {
  const words = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  const names = Object.values(exercise.name).join(' ').toLowerCase();
  return words.every(word => names.includes(word));
}

function matchesMuscle(exercise, muscle) {
  if (muscle === ALL) return true;
  const groups = exerciseGroups(exercise);
  return muscle === 'other' ? groups.length === 0 : groups.includes(muscle);
}

const matchesEquipment = (exercise, equipment) =>
  equipment === ALL || exercise.equipment.includes(equipment);

export function filterExercises(
  { query = '', muscle = ALL, equipment = ALL, types = [] },
  language,
  exercises = EXERCISES
) {
  return exercises
    .filter(
      exercise =>
        matchesQuery(exercise, query) &&
        matchesMuscle(exercise, muscle) &&
        matchesEquipment(exercise, equipment) &&
        matchesTypes(exercise, types)
    )
    .sort((a, b) => nameIn(a, language).localeCompare(nameIn(b, language), language));
}

// How many exercises each muscle group, each piece of equipment and each kind of
// training would show, given the other filters and the search text. So every
// filter only offers what fits the others.
export function filterOptions({ query = '', muscle = ALL, equipment = ALL, types = [] }, muscles, exercises = EXERCISES) {
  const found = exercises.filter(exercise => matchesQuery(exercise, query));

  const muscleCounts = Object.fromEntries(
    muscles.map(name => [
      name,
      found.filter(
        exercise =>
          matchesEquipment(exercise, equipment) && matchesTypes(exercise, types) && matchesMuscle(exercise, name)
      ).length,
    ])
  );

  const equipmentCounts = {};
  for (const exercise of found) {
    if (!matchesMuscle(exercise, muscle) || !matchesTypes(exercise, types)) continue;
    for (const item of new Set(exercise.equipment)) {
      equipmentCounts[item] = (equipmentCounts[item] ?? 0) + 1;
    }
  }

  // Each type counts on its own, so choosing "band" still shows how many
  // dumbbell exercises there are to add to the choice.
  const typeCounts = Object.fromEntries(
    TRAINING_TYPES.map(type => [
      type,
      found.filter(
        exercise =>
          matchesMuscle(exercise, muscle) && matchesEquipment(exercise, equipment) && matchesTypes(exercise, [type])
      ).length,
    ])
  );
  return { muscleCounts, equipmentCounts, typeCounts };
}

// Primary muscles count fully, secondary muscles half.
function muscleWeights(exercise) {
  const weights = {};
  for (const id of exercise.muscles.secondary) weights[id] = 0.5;
  for (const id of exercise.muscles.primary) weights[id] = 1;
  return weights;
}

// Weighted overlap of the trained muscles of two exercises, from 0 to 1.
export function muscleSimilarity(a, b) {
  const first = muscleWeights(a);
  const second = muscleWeights(b);
  let shared = 0;
  let total = 0;
  for (const id of new Set([...Object.keys(first), ...Object.keys(second)])) {
    shared += Math.min(first[id] ?? 0, second[id] ?? 0);
    total += Math.max(first[id] ?? 0, second[id] ?? 0);
  }
  return total === 0 ? 0 : shared / total;
}

const VARIANT_SIMILARITY = 0.5;

// Other exercises for mostly the same muscles, e.g. with dumbbells, cable or band
// instead of a barbell. The most similar come first.
export function exerciseVariants(exercise, exercises = EXERCISES) {
  if (exercise.muscles.primary.length === 0) return [];
  return exercises
    .filter(other => other.id !== exercise.id && other.muscles.primary.length > 0)
    .map(other => ({ exercise: other, similarity: muscleSimilarity(exercise, other) }))
    .filter(({ similarity }) => similarity >= VARIANT_SIMILARITY)
    .sort((a, b) => b.similarity - a.similarity)
    .map(({ exercise: other }) => other);
}
