import { WORKOUT_SCHEMA_VERSION } from '../utils/workoutLog';
import { WORKOUT_STORAGE_KEY, createLocalWorkoutStore } from './localWorkoutStore';

function memoryStorage(initial = {}) {
  const values = new Map(Object.entries(initial));
  return {
    getItem: key => (values.has(key) ? values.get(key) : null),
    setItem: (key, value) => values.set(key, String(value)),
    values,
  };
}

const oldEntry = { id: 'w1', date: '2026-11-02', status: 'done', plan: null, note: '', exercises: [] };

describe('local workout store', () => {
  it('keeps a copy of entries in an older format once before the first write', async () => {
    const raw = JSON.stringify([oldEntry]);
    const storage = memoryStorage({ [WORKOUT_STORAGE_KEY]: raw });
    const store = createLocalWorkoutStore(storage);

    const [migrated] = await store.list();
    expect(migrated.schemaVersion).toBe(WORKOUT_SCHEMA_VERSION);
    expect(storage.getItem('workoutLog.backup.v1')).toBeNull();

    await store.update({ ...migrated, note: 'changed' });
    expect(storage.getItem('workoutLog.backup.v1')).toBe(raw);
    expect(JSON.parse(storage.getItem(WORKOUT_STORAGE_KEY))[0].note).toBe('changed');

    // Only once: a later write does not replace the copy.
    storage.setItem(WORKOUT_STORAGE_KEY, JSON.stringify([{ ...oldEntry, note: 'other' }]));
    await store.create({ ...migrated, id: 'w2' });
    expect(storage.getItem('workoutLog.backup.v1')).toBe(raw);
  });

  it('makes no copy when everything is in the current format', async () => {
    const storage = memoryStorage();
    const store = createLocalWorkoutStore(storage);
    await store.create({ ...oldEntry, schemaVersion: WORKOUT_SCHEMA_VERSION });
    await store.create({ ...oldEntry, id: 'w2', schemaVersion: WORKOUT_SCHEMA_VERSION });
    expect([...storage.values.keys()]).toEqual([WORKOUT_STORAGE_KEY]);
  });
});
