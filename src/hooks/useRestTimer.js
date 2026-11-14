import { useCallback, useEffect, useState } from 'react';
import { useLocalStorage } from 'usehooks-ts';

const STEP_SECONDS = 15;

// The rest timer between sets. Stored as an end time, so it keeps running after
// a reload or when the phone was locked: { endsAt, duration } (ms since epoch, s).
export default function useRestTimer() {
  const [timer, setTimer, removeTimer] = useLocalStorage('restTimer', null);
  const [now, setNow] = useState(() => Date.now());

  const isRunning = Boolean(timer);
  useEffect(() => {
    if (!isRunning) return undefined;
    const id = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(id);
  }, [isRunning]);

  const remaining = timer ? Math.max(0, Math.ceil((timer.endsAt - now) / 1000)) : 0;
  const isDone = isRunning && remaining === 0;

  // A short vibration when the rest is over, where the device supports it.
  useEffect(() => {
    if (!isDone) return;
    try {
      navigator.vibrate?.([200, 100, 200]);
    } catch {
      // Vibration is a bonus; some browsers forbid it.
    }
  }, [isDone]);

  const start = useCallback(
    seconds => {
      if (!seconds || seconds <= 0) return;
      setNow(Date.now());
      setTimer({ endsAt: Date.now() + seconds * 1000, duration: seconds });
    },
    [setTimer]
  );

  const adjust = useCallback(
    direction =>
      setTimer(current => {
        if (!current) return current;
        const endsAt = Math.max(Date.now(), current.endsAt + direction * STEP_SECONDS * 1000);
        return { ...current, endsAt, duration: Math.max(0, current.duration + direction * STEP_SECONDS) };
      }),
    [setTimer]
  );

  return { isRunning, isDone, remaining, duration: timer?.duration ?? 0, start, adjust, stop: removeTimer };
}

export { STEP_SECONDS };
