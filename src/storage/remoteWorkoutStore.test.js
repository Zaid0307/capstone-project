import { copyMissingWorkouts, createRemoteWorkoutStore } from './remoteWorkoutStore';
import { createLocalWorkoutStore } from './localWorkoutStore';

// A small stand-in for the Supabase query API. Like row level security, every
// query only sees the rows of the signed-in user.
function fakeSupabase({ signedInAs, rows = [], failWith = null }) {
  const result = data => Promise.resolve(failWith ? { data: null, error: failWith } : { data, error: null });
  const own = () => rows.filter(row => row.user_id === signedInAs);

  return {
    rows,
    from(name) {
      expect(name).toBe('workouts');
      return {
        select: () => ({
          order: (column, { ascending }) =>
            result([...own()].sort((a, b) => (ascending ? 1 : -1) * a[column].localeCompare(b[column]))),
        }),
        insert(row) {
          if (row.user_id === signedInAs && !failWith) rows.push(row);
          return result(null);
        },
        update: changes => ({
          eq(column, value) {
            if (!failWith) own().filter(row => row[column] === value).forEach(row => Object.assign(row, changes));
            return result(null);
          },
        }),
        delete: () => ({
          eq(column, value) {
            if (!failWith) {
              const keep = rows.filter(row => !(row.user_id === signedInAs && row[column] === value));
              rows.splice(0, rows.length, ...keep);
            }
            return result(null);
          },
        }),
      };
    },
  };
}

const workout = (id, date, values = {}) => ({
  id,
  date,
  status: 'done',
  plan: { planId: 'plan-1', planName: 'Push', dayId: 'd1', dayName: '', weekday: 'monday' },
  note: '',
  exercises: [],
  ...values,
});

function memoryStorage() {
  const data = new Map();
  return { getItem: key => data.get(key) ?? null, setItem: (key, value) => data.set(key, value) };
}

describe('remote workout store', () => {
  it('creates, lists by date, updates and removes the workouts of the signed-in user', async () => {
    const client = fakeSupabase({ signedInAs: 'user-a' });
    const store = createRemoteWorkoutStore(client, 'user-a');

    await store.create(workout('late', '2026-11-20'));
    await store.create(workout('early', '2026-11-16'));
    await store.update(workout('late', '2026-11-20', { status: 'skipped', note: 'Ill' }));
    await store.remove('early');

    expect(await store.list()).toEqual([workout('late', '2026-11-20', { status: 'skipped', note: 'Ill' })]);
    expect(client.rows[0]).toMatchObject({ user_id: 'user-a', date: '2026-11-20', status: 'skipped', plan_id: 'plan-1' });
  });

  it('never shows or changes workouts of other users', async () => {
    const rows = [{ user_id: 'user-b', id: 'theirs', date: '2026-11-16', data: workout('theirs', '2026-11-16') }];
    const store = createRemoteWorkoutStore(fakeSupabase({ signedInAs: 'user-a', rows }), 'user-a');

    expect(await store.list()).toEqual([]);
    await store.update(workout('theirs', '2026-11-16', { note: 'changed' }));
    await store.remove('theirs');
    expect(rows).toHaveLength(1);
    expect(rows[0].data.note).toBe('');
  });

  it('reports errors of the backend', async () => {
    const failure = new Error('network down');
    const store = createRemoteWorkoutStore(fakeSupabase({ signedInAs: 'user-a', failWith: failure }), 'user-a');
    await expect(store.list()).rejects.toBe(failure);
    await expect(store.create(workout('one', '2026-11-16'))).rejects.toBe(failure);
  });
});

describe('copyMissingWorkouts', () => {
  it('copies the local diary to the account once, without duplicates', async () => {
    const local = createLocalWorkoutStore(memoryStorage());
    await local.create(workout('a', '2026-11-16'));
    await local.create(workout('b', '2026-11-17'));
    const remote = createRemoteWorkoutStore(fakeSupabase({ signedInAs: 'user-a' }), 'user-a');
    await remote.create(workout('b', '2026-11-17', { note: 'already there' }));

    expect(await copyMissingWorkouts(local, remote)).toBe(1);
    expect(await copyMissingWorkouts(local, remote)).toBe(0);
    expect((await remote.list()).map(item => item.id)).toEqual(['a', 'b']);
  });
});
