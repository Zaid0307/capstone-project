import { migrateWorkout } from '../utils/workoutLog';

export const WORKOUT_STORAGE_KEY = 'workoutLog';

function read(storage) {
  try {
    const value = JSON.parse(storage.getItem(WORKOUT_STORAGE_KEY));
    // Older entries are migrated when read; they are saved in the new format on the next change.
    return Array.isArray(value) ? value.map(migrateWorkout) : [];
  } catch {
    return [];
  }
}

// Training diary backed by the browser's localStorage. Same asynchronous methods
// as the plan store (list, create, update, remove), so a backend store can
// replace it later; snapshot() lets the app show the diary in the first render.
export function createLocalWorkoutStore(storage = window.localStorage) {
  const write = workouts => storage.setItem(WORKOUT_STORAGE_KEY, JSON.stringify(workouts));

  return {
    snapshot: () => read(storage),
    async list() {
      return read(storage);
    },
    async create(workout) {
      write([...read(storage), workout]);
      return workout;
    },
    async update(workout) {
      write(read(storage).map(existing => (existing.id === workout.id ? workout : existing)));
      return workout;
    },
    async remove(workoutId) {
      write(read(storage).filter(workout => workout.id !== workoutId));
    },
  };
}
