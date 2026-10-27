import { copyMissingPlans, createRemotePlanStore } from './remotePlanStore';
import { createLocalPlanStore } from './localPlanStore';
import { PLAN_SCHEMA_VERSION } from '../utils/workoutPlan';

// A small stand-in for the Supabase query API. Like row level security, every
// query only sees the rows of the signed-in user.
function fakeSupabase({ signedInAs, rows = [], failWith = null }) {
  const table = rows;
  const result = data => Promise.resolve(failWith ? { data: null, error: failWith } : { data, error: null });
  const own = () => table.filter(row => row.user_id === signedInAs);

  return {
    rows: table,
    from(name) {
      expect(name).toBe('plans');
      return {
        select: () => ({
          order: (column, { ascending }) =>
            result(
              [...own()].sort((a, b) => (ascending ? 1 : -1) * a[column].localeCompare(b[column]))
            ),
        }),
        insert(row) {
          if (row.user_id !== signedInAs) return result(null);
          if (!failWith) table.push({ ...row, created_at: new Date(Date.now() + table.length).toISOString() });
          return result(null);
        },
        update: changes => ({
          eq(column, value) {
            if (!failWith) {
              own().filter(row => row[column] === value).forEach(row => Object.assign(row, changes));
            }
            return result(null);
          },
        }),
        delete: () => ({
          eq(column, value) {
            if (!failWith) {
              const keep = table.filter(row => !(row.user_id === signedInAs && row[column] === value));
              table.splice(0, table.length, ...keep);
            }
            return result(null);
          },
        }),
      };
    },
  };
}

const plan = (id, name = id) => ({
  id,
  schemaVersion: PLAN_SCHEMA_VERSION,
  nameOfWorkout: name,
  description: '',
  template: id === 'tpl' ? { id: 'hypertrophy_fullbody_3', version: '1.0.0' } : undefined,
  days: [{ id: `${id}-d`, day: 'monday', entries: [] }],
});

function memoryStorage() {
  const data = new Map();
  return { getItem: key => data.get(key) ?? null, setItem: (key, value) => data.set(key, value) };
}

describe('remote plan store', () => {
  it('creates, lists, updates and removes the plans of the signed-in user', async () => {
    const client = fakeSupabase({ signedInAs: 'user-a' });
    const store = createRemotePlanStore(client, 'user-a');

    await store.create(plan('one'));
    await store.create(plan('tpl'));
    await store.update(plan('one', 'renamed'));
    await store.remove('tpl');

    expect(await store.list()).toEqual([plan('one', 'renamed')]);
    expect(client.rows[0]).toMatchObject({ user_id: 'user-a', id: 'one', schema_version: PLAN_SCHEMA_VERSION });
  });

  it('stores the template a plan was copied from', async () => {
    const client = fakeSupabase({ signedInAs: 'user-a' });
    await createRemotePlanStore(client, 'user-a').create(plan('tpl'));
    expect(client.rows[0].template_id).toBe('hypertrophy_fullbody_3');
  });

  it('never shows or changes plans of other users', async () => {
    const rows = [{ user_id: 'user-b', id: 'theirs', data: plan('theirs'), created_at: '2026-01-01' }];
    const client = fakeSupabase({ signedInAs: 'user-a', rows });
    const store = createRemotePlanStore(client, 'user-a');

    expect(await store.list()).toEqual([]);
    await store.update(plan('theirs', 'hacked'));
    await store.remove('theirs');
    expect(rows).toHaveLength(1);
    expect(rows[0].data.nameOfWorkout).toBe('theirs');
  });

  it('migrates plans saved in an older plan model', async () => {
    const legacy = { id: 'old', nameOfWorkout: 'Old', days: [{ id: 'd', day: 'monday' }] };
    const client = fakeSupabase({
      signedInAs: 'user-a',
      rows: [{ user_id: 'user-a', id: 'old', data: legacy, created_at: '2026-01-01' }],
    });

    const [migrated] = await createRemotePlanStore(client, 'user-a').list();
    expect(migrated).toMatchObject({ id: 'old', schemaVersion: PLAN_SCHEMA_VERSION });
  });

  it('reports errors of the backend', async () => {
    const failure = new Error('network down');
    const store = createRemotePlanStore(fakeSupabase({ signedInAs: 'user-a', failWith: failure }), 'user-a');

    await expect(store.list()).rejects.toBe(failure);
    await expect(store.create(plan('one'))).rejects.toBe(failure);
  });
});

describe('copyMissingPlans', () => {
  it('copies local plans to the account once, without duplicates', async () => {
    const local = createLocalPlanStore(memoryStorage());
    await local.create(plan('a'));
    await local.create(plan('b'));
    const remote = createRemotePlanStore(fakeSupabase({ signedInAs: 'user-a' }), 'user-a');
    await remote.create(plan('b', 'already there'));

    expect(await copyMissingPlans(local, remote)).toBe(1);
    expect(await copyMissingPlans(local, remote)).toBe(0);

    const names = (await remote.list()).map(item => item.nameOfWorkout).sort();
    expect(names).toEqual(['a', 'already there']);
  });
});
