import { describeFailure } from '../lib/networkError';

// Wraps a backend store (plans or workouts) so that someone signed in can keep
// working without a connection:
// - A change that fails because the network is gone is put into a queue in the
//   browser storage instead of failing. The queue is sent in order as soon as
//   the device is online again (or with the next change).
// - Several changes to the same entry are merged, so nothing is sent twice.
// - The last list from the backend is kept, so the app still opens offline;
//   queued changes are shown on top of it.
// Other errors (e.g. refused by the backend) still fail as before.

const RETRY_DELAY = 30000;

const isConnectionError = error => ['offline', 'network'].includes(describeFailure(error));
// Postgres "unique violation": the entry was already created, e.g. when the
// answer to an earlier attempt got lost.
const isAlreadyThere = error => error?.code === '23505';

function readList(storage, key) {
  try {
    const value = JSON.parse(storage.getItem(key));
    return Array.isArray(value) ? value : null;
  } catch {
    return null;
  }
}

// Applies queued changes to a list of entries (each with an `id`).
export function applyChanges(items, changes) {
  return changes.reduce((list, { op, id, item }) => {
    if (op === 'remove') return list.filter(entry => entry.id !== id);
    if (list.some(entry => entry.id === id)) return list.map(entry => (entry.id === id ? item : entry));
    return [...list, item];
  }, items);
}

// Adds a change to the queue, merged with a waiting change to the same entry.
// `busySeq` is the change being sent right now; it is never merged into.
export function addChange(queue, change, busySeq = null) {
  const index = queue.findIndex(entry => entry.id === change.id && entry.seq !== busySeq);
  if (index === -1) return [...queue, change];
  const waiting = queue[index];
  let merged;
  if (change.op === 'remove') merged = waiting.op === 'create' ? null : { ...change };
  else if (waiting.op === 'create') merged = { ...change, op: 'create' };
  else merged = { ...change, op: change.op === 'create' ? 'update' : change.op };
  const next = [...queue];
  if (merged) next[index] = merged;
  else next.splice(index, 1);
  return next;
}

export function createOfflineQueueStore(remote, { name, userId, storage = window.localStorage, win = window } = {}) {
  const queueKey = `pendingChanges:${name}:${userId}`;
  const cacheKey = `accountCopy:${name}:${userId}`;
  const listeners = new Set();
  let busySeq = null;
  let flushing = null;
  let runAgain = false;
  // Set after a change failed for lack of connection; then new changes only
  // queue up and are sent when the device is online again (or on a later retry).
  let isUnreachable = false;
  let retryTimer = null;
  let seq = Date.now();

  const readQueue = () => readList(storage, queueKey) ?? [];
  const writeQueue = queue => {
    if (queue.length) storage.setItem(queueKey, JSON.stringify(queue));
    else storage.removeItem(queueKey);
    listeners.forEach(listener => listener(queue.length));
  };
  const updateCache = changes => {
    const cached = readList(storage, cacheKey);
    if (cached) storage.setItem(cacheKey, JSON.stringify(applyChanges(cached, changes)));
  };

  async function send({ op, id, item }) {
    if (op === 'remove') return remote.remove(id);
    if (op === 'update') return remote.update(item);
    try {
      return await remote.create(item);
    } catch (error) {
      if (isAlreadyThere(error)) return remote.update(item);
      throw error;
    }
  }

  function scheduleRetry() {
    if (retryTimer || !win?.setTimeout) return;
    retryTimer = win.setTimeout(() => {
      retryTimer = null;
      flush();
    }, RETRY_DELAY);
  }

  async function runQueue() {
    for (;;) {
      const [next] = readQueue();
      if (!next) return;
      busySeq = next.seq;
      try {
        await send(next);
        isUnreachable = false;
        updateCache([next]);
      } catch (error) {
        if (isConnectionError(error)) {
          isUnreachable = true;
          scheduleRetry();
          return;
        }
        // Refused for good: drop it, so the rest can still be sent.
        console.warn('GetFit!: a change saved offline was refused by the server.', error);
      } finally {
        busySeq = null;
      }
      writeQueue(readQueue().filter(entry => entry.seq !== next.seq));
    }
  }

  // Sends the queue. A request while it is already running runs it once more
  // afterwards, so changes added in the meantime are not left behind.
  function flush() {
    if (flushing) {
      runAgain = true;
      return flushing;
    }
    flushing = (async () => {
      do {
        runAgain = false;
        await runQueue();
      } while (runAgain && !isUnreachable);
    })().finally(() => {
      flushing = null;
    });
    return flushing;
  }

  async function change(op, id, item) {
    const entry = { seq: (seq += 1), op, id, item };
    if (readQueue().length === 0) {
      try {
        await send(entry);
        isUnreachable = false;
        updateCache([entry]);
        return;
      } catch (error) {
        if (!isConnectionError(error)) throw error;
        isUnreachable = true;
        scheduleRetry();
      }
    }
    // Waiting changes go first, so the order stays the same.
    writeQueue(addChange(readQueue(), entry, busySeq));
    if (!isUnreachable) flush();
  }

  win?.addEventListener?.('online', () => {
    isUnreachable = false;
    flush();
  });

  return {
    async list() {
      await flush();
      let items;
      try {
        items = await remote.list();
        storage.setItem(cacheKey, JSON.stringify(items));
      } catch (error) {
        const cached = readList(storage, cacheKey);
        if (!isConnectionError(error) || !cached) throw error;
        items = cached;
      }
      return applyChanges(items, readQueue());
    },
    create: async item => {
      await change('create', item.id, item);
      return item;
    },
    update: async item => {
      await change('update', item.id, item);
      return item;
    },
    remove: id => change('remove', id),
    flush,
    pendingCount: () => readQueue().length,
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
}
