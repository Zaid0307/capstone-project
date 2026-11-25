// The browser keeps two things per account (see offlineQueue.js): a copy of the
// last loaded data (`accountCopy:<name>:<userId>`) and the changes that still
// wait to be sent (`pendingChanges:<name>:<userId>`). Both go on sign-out.

const PREFIXES = ['accountCopy:', 'pendingChanges:'];

function keysOf(storage, userId, prefixes) {
  const keys = [];
  for (let index = 0; index < storage.length; index += 1) {
    const key = storage.key(index);
    if (key && prefixes.some(prefix => key.startsWith(prefix)) && key.endsWith(`:${userId}`)) keys.push(key);
  }
  return keys;
}

// Number of changes of this account that were not sent yet.
export function countPendingChanges(userId, storage = window.localStorage) {
  return keysOf(storage, userId, ['pendingChanges:']).reduce((sum, key) => {
    try {
      const list = JSON.parse(storage.getItem(key));
      return sum + (Array.isArray(list) ? list.length : 0);
    } catch {
      return sum;
    }
  }, 0);
}

export function clearAccountCopies(userId, storage = window.localStorage) {
  if (!userId) return 0;
  const keys = keysOf(storage, userId, PREFIXES);
  keys.forEach(key => storage.removeItem(key));
  return keys.length;
}
