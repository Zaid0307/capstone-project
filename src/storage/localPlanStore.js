import { migratePlan } from '../utils/workoutPlan';

export const STORAGE_KEY = 'workoutPlans';
// Older versions stored the plans under this key.
export const LEGACY_STORAGE_KEY = 'data';

function readJson(storage, key) {
  try {
    const value = JSON.parse(storage.getItem(key));
    return Array.isArray(value) ? value : null;
  } catch {
    return null;
  }
}

// Plan store backed by the browser's localStorage. Every plan store offers the
// same asynchronous methods (list, create, update, remove), so a backend store
// can replace this one later. snapshot() exists only here: it lets the app show
// local plans in the very first render.
export function createLocalPlanStore(storage = window.localStorage) {
  function read() {
    const plans = readJson(storage, STORAGE_KEY) ?? readJson(storage, LEGACY_STORAGE_KEY) ?? [];
    return plans.map(migratePlan);
  }

  function write(plans) {
    storage.setItem(STORAGE_KEY, JSON.stringify(plans));
  }

  return {
    snapshot: read,
    async list() {
      return read();
    },
    async create(plan) {
      write([...read(), plan]);
      return plan;
    },
    async update(plan) {
      write(read().map(existing => (existing.id === plan.id ? plan : existing)));
      return plan;
    },
    async remove(planId) {
      write(read().filter(plan => plan.id !== planId));
    },
  };
}
