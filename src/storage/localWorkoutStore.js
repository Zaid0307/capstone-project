import { WORKOUT_SCHEMA_VERSION, migrateWorkout } from '../utils/workoutLog';

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
export const backupKey = version => `${WORKOUT_STORAGE_KEY}.backup.v${version}`;

// Before the first write in a newer format, the stored diary is copied once as it
// is, e.g. to 'workoutLog.backup.v1' for entries of version 1 (02-tagebuch 5).
function backupBeforeMigration(storage) {
  try {
    const raw = storage.getItem(WORKOUT_STORAGE_KEY);
    const stored = JSON.parse(raw);
    if (!Array.isArray(stored)) return;
    const versions = stored.map(workout => workout?.schemaVersion ?? 1);
    const oldest = Math.min(WORKOUT_SCHEMA_VERSION, ...versions);
    if (oldest < WORKOUT_SCHEMA_VERSION && storage.getItem(backupKey(oldest)) === null) {
      storage.setItem(backupKey(oldest), raw);
    }
  } catch {
    // Unreadable data has nothing worth keeping; a full storage must not stop saving.
  }
}

export function createLocalWorkoutStore(storage = window.localStorage) {
  const write = workouts => {
    backupBeforeMigration(storage);
    storage.setItem(WORKOUT_STORAGE_KEY, JSON.stringify(workouts));
  };

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
