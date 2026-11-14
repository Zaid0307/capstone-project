import { LEGACY_STORAGE_KEY, STORAGE_KEY } from '../storage/localPlanStore';
import { WORKOUT_STORAGE_KEY } from '../storage/localWorkoutStore';

export const EXPORT_FORMAT_VERSION = 1;
const DRAFT_PREFIX = 'planDraft:';
const TRAINING_KEYS = [STORAGE_KEY, LEGACY_STORAGE_KEY, WORKOUT_STORAGE_KEY, 'restTimer'];

function readList(storage, key) {
  try {
    const value = JSON.parse(storage.getItem(key));
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

// All training data of this device as one JSON document: plans and diary.
// Settings (language, figure) are not part of it. Used for "Export my data".
export function buildExport(storage = window.localStorage, now = new Date()) {
  const plans = readList(storage, STORAGE_KEY);
  return {
    app: 'GetFit!',
    format: EXPORT_FORMAT_VERSION,
    exportedAt: now.toISOString(),
    plans: plans.length ? plans : readList(storage, LEGACY_STORAGE_KEY),
    workouts: readList(storage, WORKOUT_STORAGE_KEY),
  };
}

export function exportFileName(now = new Date()) {
  return `getfit-daten-${now.toISOString().slice(0, 10)}.json`;
}

// Offers the export as a file download in the browser.
export function downloadExport(storage = window.localStorage) {
  const blob = new Blob([JSON.stringify(buildExport(storage), null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = exportFileName();
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

// Deletes all training data on this device (plans, diary, drafts, rest timer).
// Language and figure stay. Returns the number of removed entries.
export function clearTrainingData(storage = window.localStorage) {
  const keys = [];
  for (let index = 0; index < storage.length; index += 1) {
    const key = storage.key(index);
    if (TRAINING_KEYS.includes(key) || key?.startsWith(DRAFT_PREFIX)) keys.push(key);
  }
  keys.forEach(key => storage.removeItem(key));
  return keys.length;
}
