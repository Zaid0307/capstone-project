import { useEffect, useState } from 'react';

// The current time, renewed every `intervalMs` while `isActive` (e.g. for the
// duration of a running training). Minutes are shown, so a slow tick is enough.
export default function useNow(isActive = true, intervalMs = 15000) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    if (!isActive) return undefined;
    const id = setInterval(() => setNow(Date.now()), intervalMs);
    return () => clearInterval(id);
  }, [isActive, intervalMs]);
  return now;
}
