// Tells apart why saving or loading failed, so the message can say what to do.
// 'offline': the device has no connection; 'network': the server could not be
// reached; 'other': anything else (e.g. browser storage full or blocked).
export function describeFailure(error, isOnline = typeof navigator === 'undefined' ? true : navigator.onLine) {
  if (!error) return null;
  if (isOnline === false) return 'offline';
  const message = `${error.name ?? ''} ${error.message ?? ''}`;
  if (/failed to fetch|networkerror|network request failed|load failed|fetch failed/i.test(message)) return 'network';
  return 'other';
}
