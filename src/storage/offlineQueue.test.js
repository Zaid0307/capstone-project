import { addChange, applyChanges, createOfflineQueueStore } from './offlineQueue';
import { createRemotePlanStore } from './remotePlanStore';

// A stand-in for the Supabase table API that can lose its connection. Errors
// look like the ones supabase-js returns (an object, not thrown).
function fakeClient() {
  const client = {
    online: true,
    rows: [],
    calls: [],
    from: () => {
      const result = value => (client.online ? value : { data: null, error: { message: 'TypeError: Failed to fetch' } });
      return {
        select: () => ({
          order: () => Promise.resolve(result({ data: client.rows.map(row => ({ data: row.data })), error: null })),
        }),
        insert: row => {
          client.calls.push(['insert', row.id]);
          if (!client.online) return Promise.resolve(result());
          if (client.rows.some(existing => existing.id === row.id)) {
            return Promise.resolve({ error: { code: '23505', message: 'duplicate key' } });
          }
          client.rows.push(row);
          return Promise.resolve({ error: null });
        },
        update: changes => ({
          eq: (column, id) => {
            client.calls.push(['update', id]);
            if (!client.online) return Promise.resolve(result());
            client.rows = client.rows.map(row => (row.id === id ? { ...row, ...changes } : row));
            return Promise.resolve({ error: null });
          },
        }),
        delete: () => ({
          eq: (column, id) => {
            client.calls.push(['delete', id]);
            if (!client.online) return Promise.resolve(result());
            client.rows = client.rows.filter(row => row.id !== id);
            return Promise.resolve({ error: null });
          },
        }),
      };
    },
  };
  return client;
}

function fakeWindow() {
  const listeners = {};
  return {
    addEventListener: (name, callback) => (listeners[name] = callback),
    fire: name => listeners[name]?.(),
  };
}

const plan = (id, name) => ({ id, nameOfWorkout: name, description: '', days: [] });

function setup() {
  const client = fakeClient();
  const win = fakeWindow();
  const store = createOfflineQueueStore(createRemotePlanStore(client, 'u1'), {
    name: 'plans',
    userId: 'u1',
    storage: window.localStorage,
    win,
  });
  return { client, win, store };
}

describe('offline queue store', () => {
  beforeEach(() => window.localStorage.clear());

  it('saves directly while online', async () => {
    const { client, store } = setup();
    await store.create(plan('a', 'Push'));
    expect(client.rows.map(row => row.id)).toEqual(['a']);
    expect(store.pendingCount()).toBe(0);
  });

  it('queues changes while offline, shows them and sends them in order once online', async () => {
    const { client, win, store } = setup();
    await store.create(plan('a', 'Push'));
    expect((await store.list()).map(p => p.id)).toEqual(['a']);

    client.online = false;
    const counts = [];
    store.subscribe(count => counts.push(count));
    await store.create(plan('b', 'Pull'));
    await store.update(plan('b', 'Pull 2'));
    await store.update(plan('a', 'Push 2'));
    await store.remove('a');
    await store.create(plan('c', 'Legs'));
    expect(store.pendingCount()).toBe(3);
    expect(counts.at(-1)).toBe(3);

    // The app still opens offline with the last list plus the queued changes.
    expect((await store.list()).map(p => p.nameOfWorkout)).toEqual(['Pull 2', 'Legs']);

    client.online = true;
    client.calls.length = 0;
    win.fire('online');
    await store.flush();
    expect(client.calls).toEqual([
      ['insert', 'b'],
      ['delete', 'a'],
      ['insert', 'c'],
    ]);
    expect(client.rows.map(row => row.data.nameOfWorkout)).toEqual(['Pull 2', 'Legs']);
    expect(store.pendingCount()).toBe(0);
    expect(counts.at(-1)).toBe(0);
  });

  it('does not create an entry twice when the server already has it', async () => {
    const { client, store } = setup();
    client.rows.push({ id: 'a', data: plan('a', 'Old') });
    client.online = false;
    await store.create(plan('a', 'New'));
    client.online = true;
    await store.flush();
    expect(client.rows).toHaveLength(1);
    expect(client.rows[0].data.nameOfWorkout).toBe('New');
  });

  it('keeps the queue in the browser storage across reloads', async () => {
    const first = setup();
    first.client.online = false;
    await first.store.create(plan('a', 'Push'));

    const second = setup();
    expect(second.store.pendingCount()).toBe(1);
    await second.store.flush();
    expect(second.client.rows.map(row => row.id)).toEqual(['a']);
  });

  it('still fails for errors that are not about the connection', async () => {
    const { store } = setup();
    const failing = createOfflineQueueStore(
      { create: () => Promise.reject({ message: 'permission denied' }) },
      { name: 'plans', userId: 'u2', storage: window.localStorage, win: fakeWindow() }
    );
    await expect(failing.create(plan('a', 'Push'))).rejects.toMatchObject({ message: 'permission denied' });
    expect(store.pendingCount()).toBe(0);
  });
});

describe('queue helpers', () => {
  it('merges changes to the same entry', () => {
    const create = { seq: 1, op: 'create', id: 'a', item: { id: 'a', v: 1 } };
    expect(addChange([create], { seq: 2, op: 'update', id: 'a', item: { id: 'a', v: 2 } })).toEqual([
      { seq: 2, op: 'create', id: 'a', item: { id: 'a', v: 2 } },
    ]);
    expect(addChange([create], { seq: 2, op: 'remove', id: 'a' })).toEqual([]);
    // The change being sent right now is never merged into.
    expect(addChange([create], { seq: 2, op: 'remove', id: 'a' }, 1)).toHaveLength(2);
  });

  it('applies changes to a list', () => {
    expect(
      applyChanges(
        [{ id: 'a' }, { id: 'b' }],
        [
          { op: 'remove', id: 'a' },
          { op: 'update', id: 'b', item: { id: 'b', v: 2 } },
          { op: 'create', id: 'c', item: { id: 'c' } },
        ]
      )
    ).toEqual([{ id: 'b', v: 2 }, { id: 'c' }]);
  });
});
