// The app's own exercise library: 97 exercises with self-written descriptions in
// German and English. Exercise IDs and names come from the graphics package catalog
// (fitness-graphics-v0.7); descriptions and muscle assignments are editorial and
// have not been reviewed by a trainer.
import chestAndBack from './exercises/chestAndBack';
import shouldersAndArms from './exercises/shouldersAndArms';
import legs from './exercises/legs';
import coreMobilityCardio from './exercises/coreMobilityCardio';
import { MUSCLES } from './muscles';
import { MUSCLE_GROUP_NAMES } from './muscleGroups';

export const EXERCISES = [...chestAndBack, ...shouldersAndArms, ...legs, ...coreMobilityCardio];

// An exercise belongs to the muscle groups of its primary muscles.
// Cardio and boxing exercises have no primary muscles and belong to no group.
export function exerciseGroups(exercise) {
  const groups = new Set(exercise.muscles.primary.map(id => MUSCLES[id].group));
  return MUSCLE_GROUP_NAMES.filter(group => groups.has(group));
}

function localize(exercise, language) {
  return {
    id: exercise.id,
    name: exercise.name[language] ?? exercise.name.en,
    description: exercise.description[language] ?? exercise.description.en,
    category: exercise.category,
    equipment: exercise.equipment,
    muscles: exercise.muscles,
    image: null,
  };
}

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
