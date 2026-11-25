import { EXPORT_FORMAT_VERSION, exportFileName } from '../utils/dataExport';

// "Export my data" for someone signed in: plans and diary come from the account
// (through the same stores the app uses), in the same JSON format as the export
// of the local data.
export async function buildStoreExport(planStore, workoutStore, now = new Date()) {
  const [plans, workouts] = await Promise.all([planStore.list(), workoutStore.list()]);
  return {
    app: 'GetFit!',
    format: EXPORT_FORMAT_VERSION,
    exportedAt: now.toISOString(),
    plans,
    workouts,
  };
}

// Offers a JSON document as a file download in the browser.
export function downloadJson(data, fileName = exportFileName()) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
