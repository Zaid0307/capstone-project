import { migratePlan } from '../utils/workoutPlan';

const TABLE = 'plans';

function toRow(plan, userId) {
  return {
    user_id: userId,
    id: plan.id,
    schema_version: plan.schemaVersion,
    template_id: plan.template?.id ?? null,
    data: plan,
  };
}

function check({ error }) {
  if (error) throw error;
}

// Plan store backed by the backend (Supabase). Same methods as the local plan
// store. `client` is a Supabase client (or anything with the same query API),
// `userId` the signed-in user. Row level security in the database makes sure a
// user only ever reaches their own plans.
export function createRemotePlanStore(client, userId) {
  const plans = () => client.from(TABLE);

  return {
    async list() {
      const result = await plans().select('data').order('created_at', { ascending: true });
      check(result);
      return result.data.map(row => migratePlan(row.data));
    },
    async create(plan) {
      check(await plans().insert(toRow(plan, userId)));
      return plan;
    },
    async update(plan) {
      const { user_id: _user, ...changes } = toRow(plan, userId);
      check(await plans().update(changes).eq('id', plan.id));
      return plan;
    },
    async remove(planId) {
      check(await plans().delete().eq('id', planId));
    },
  };
}

// Copies plans that exist only locally into another store, e.g. on the first
// sign-in. Plans that already exist there (same id) are left alone.
export async function copyMissingPlans(fromStore, toStore) {
  const [source, target] = await Promise.all([fromStore.list(), toStore.list()]);
  const existing = new Set(target.map(plan => plan.id));
  const missing = source.filter(plan => !existing.has(plan.id));
  for (const plan of missing) {
    await toStore.create(plan);
  }
  return missing.length;
}
