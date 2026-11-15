import { EXERCISES, exerciseById, exerciseGroups } from '../data/exerciseLibrary';
import { EQUIPMENT } from '../data/equipment';

// Finding exercises in the library: text search, filters that depend on each
// other (muscle group ↔ equipment) and variants of an exercise.

export const ALL = 'all';

// Kind of training an exercise needs, derived from its equipment and category.
// Benches, mats, racks, balls and the like do not count; strength exercises
// without a load are bodyweight.
const TYPE_BY_EQUIPMENT = {
  dumbbells: 'dumbbell',
  kettlebell: 'kettlebell',
  barbell: 'barbell',
  ez_bar: 'barbell',
  trap_bar: 'barbell',
  landmine: 'barbell',
  medicine_ball: 'otherWeight',
  slam_ball: 'otherWeight',
  weight_plate: 'otherWeight',
  sandbag: 'otherWeight',
  weighted_vest: 'otherWeight',
  ankle_weights: 'otherWeight',
  resistance_band: 'band',
  resistance_tube: 'band',
  miniband: 'band',
  assist_band: 'band',
  cable_machine: 'cable',
};
// Any other equipment of these kinds sets the type.
const TYPE_BY_KIND = {
  machine: 'machine',
  cardio_machine: 'cardio',
  combat: 'boxing',
};
// Categories with their own kind of training, whatever the equipment.
// Plyometrics (jumps, throws) get their own chip next to cardio.
const TYPE_BY_CATEGORY = {
  plyometric: 'plyometric',
  cardio: 'cardio',
  boxing: 'boxing',
  mobility: 'mobility',
  stretch: 'mobility',
  yoga: 'mobility',
  pilates: 'pilates',
};
// Bodyweight even with this equipment: it only holds the body (pull-up bar,
// dip station, rings, suspension trainer, ab wheel …).
const BODYWEIGHT_KIND = 'bodyweight_aid';
const BODYWEIGHT_CATEGORIES = new Set(['strength', 'isometric', 'plyometric']);

export const TRAINING_TYPES = [
  'bodyweight',
  'dumbbell',
  'kettlebell',
  'barbell',
  'otherWeight',
  'band',
  'cable',
  'machine',
  'plyometric',
  'cardio',
  'boxing',
  'mobility',
  'pilates',
];

function equipmentType(item) {
  const kind = EQUIPMENT[item]?.kind;
  return TYPE_BY_EQUIPMENT[item] ?? TYPE_BY_KIND[kind] ?? (kind === BODYWEIGHT_KIND ? 'bodyweight' : null);
}

export function exerciseTypes(exercise) {
  const types = new Set(exercise.equipment.map(equipmentType).filter(Boolean));
  const loaded = [...types].some(type => type !== 'bodyweight');
  if (!loaded && BODYWEIGHT_CATEGORIES.has(exercise.category)) types.add('bodyweight');
  if (TYPE_BY_CATEGORY[exercise.category]) types.add(TYPE_BY_CATEGORY[exercise.category]);
  if (types.size === 0) types.add('bodyweight');
  return TRAINING_TYPES.filter(type => types.has(type));
}

// Several types can be chosen; an exercise matches if it has any of them.
const matchesTypes = (exercise, types) =>
  types.length === 0 || exerciseTypes(exercise).some(type => types.includes(type));

const nameIn = (exercise, language) => exercise.name[language] ?? exercise.name.en;

// Names and aliases in both languages, lower case, built once per exercise.
const searchTexts = new WeakMap();
function searchText(exercise) {
  if (!searchTexts.has(exercise)) {
    const aliases = Object.values(exercise.aliases ?? {}).flat();
    searchTexts.set(exercise, [...Object.values(exercise.name), ...aliases].join(' ').toLowerCase());
  }
  return searchTexts.get(exercise);
}

function matchesQuery(exercise, query) {
  const words = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  if (words.length === 0) return true;
  const text = searchText(exercise);
  return words.every(word => text.includes(word));
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

// Variants of an exercise: first those the catalog names (variants, easier and
// harder version), then other exercises for mostly the same muscles, e.g. with
// dumbbells, cable or band instead of a barbell, the most similar first.
export function exerciseVariants(exercise, exercises = EXERCISES) {
  const named = [...(exercise.variants ?? []), exercise.regression, exercise.progression]
    .filter(Boolean)
    .map(exerciseById)
    .filter(other => other && other.id !== exercise.id && exercises.includes(other));
  const seen = new Set([exercise.id, ...named.map(other => other.id)]);
  const similar =
    exercise.muscles.primary.length === 0
      ? []
      : exercises
          .filter(other => !seen.has(other.id) && other.muscles.primary.length > 0)
          .map(other => ({ exercise: other, similarity: muscleSimilarity(exercise, other) }))
          .filter(({ similarity }) => similarity >= VARIANT_SIMILARITY)
          .sort((a, b) => b.similarity - a.similarity)
          .map(({ exercise: other }) => other);
  return [...new Map([...named, ...similar].map(other => [other.id, other])).values()];
}
