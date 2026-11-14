import { WORKOUT_SCHEMA_VERSION } from '../utils/workoutLog';

const TABLE = 'workouts';

function toRow(workout, userId) {
  return {
    user_id: userId,
    id: workout.id,
    schema_version: workout.schemaVersion ?? WORKOUT_SCHEMA_VERSION,
    date: workout.date,
    status: workout.status,
    plan_id: workout.plan?.planId ?? null,
    data: workout,
  };
}

function check({ error }) {
  if (error) throw error;
}

// Training diary backed by the backend (Supabase). Same methods as the local
// workout store. `client` is a Supabase client (or anything with the same query
// API), `userId` the signed-in user. Row level security in the database makes
// sure a user only ever reaches their own workouts.
export function createRemoteWorkoutStore(client, userId) {
  const workouts = () => client.from(TABLE);

  return {
    async list() {
      const result = await workouts().select('data').order('date', { ascending: true });
      check(result);
      return result.data.map(row => row.data);
    },
    async create(workout) {
      check(await workouts().insert(toRow(workout, userId)));
      return workout;
    },
    async update(workout) {
      const { user_id: _user, ...changes } = toRow(workout, userId);
      check(await workouts().update(changes).eq('id', workout.id));
      return workout;
    },
    async remove(workoutId) {
      check(await workouts().delete().eq('id', workoutId));
    },
  };
}

// Copies workouts that exist only locally into another store, e.g. on the first
// sign-in. Workouts that already exist there (same id) are left alone.
export async function copyMissingWorkouts(fromStore, toStore) {
  const [source, target] = await Promise.all([fromStore.list(), toStore.list()]);
  const existing = new Set(target.map(workout => workout.id));
  const missing = source.filter(workout => !existing.has(workout.id));
  for (const workout of missing) {
    await toStore.create(workout);
  }
  return missing.length;
}
