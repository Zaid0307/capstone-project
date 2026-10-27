import { LEGACY_STORAGE_KEY, STORAGE_KEY, createLocalPlanStore } from './localPlanStore';
import { PLAN_SCHEMA_VERSION } from '../utils/workoutPlan';

function memoryStorage(initial = {}) {
  const data = new Map(Object.entries(initial));
  return {
    getItem: key => (data.has(key) ? data.get(key) : null),
    setItem: (key, value) => data.set(key, String(value)),
    raw: key => data.get(key),
  };
}

const plan = (id, name = id) => ({
  id,
  schemaVersion: PLAN_SCHEMA_VERSION,
  nameOfWorkout: name,
  description: '',
  days: [{ id: `${id}-d`, day: 'monday', entries: [] }],
});

describe('local plan store', () => {
  it('starts empty', async () => {
    const store = createLocalPlanStore(memoryStorage());
    expect(store.snapshot()).toEqual([]);
    expect(await store.list()).toEqual([]);
  });

  it('creates, updates and removes plans', async () => {
    const storage = memoryStorage();
    const store = createLocalPlanStore(storage);

    await store.create(plan('a'));
    await store.create(plan('b'));
    await store.update(plan('a', 'renamed'));
    await store.remove('b');

    expect(await store.list()).toEqual([plan('a', 'renamed')]);
    expect(JSON.parse(storage.raw(STORAGE_KEY))).toEqual([plan('a', 'renamed')]);
  });

  it('reads plans saved under the old key and migrates them', async () => {
    const legacy = [{ id: 'old', nameOfWorkout: 'Old', days: [{ id: 'd', day: 'monday' }] }];
    const store = createLocalPlanStore(memoryStorage({ [LEGACY_STORAGE_KEY]: JSON.stringify(legacy) }));

    const [migrated] = await store.list();
    expect(migrated).toMatchObject({ id: 'old', schemaVersion: PLAN_SCHEMA_VERSION });
    expect(migrated.days[0].entries).toEqual([]);
  });

  it('prefers the current key over the old one', async () => {
    const store = createLocalPlanStore(
      memoryStorage({
        [STORAGE_KEY]: JSON.stringify([plan('new')]),
        [LEGACY_STORAGE_KEY]: JSON.stringify([plan('old')]),
      })
    );
    expect((await store.list()).map(item => item.id)).toEqual(['new']);
  });

  it('treats unreadable data as no plans', async () => {
    const store = createLocalPlanStore(memoryStorage({ [STORAGE_KEY]: '{not json' }));
    expect(await store.list()).toEqual([]);
  });
});
