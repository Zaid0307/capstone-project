import { useCallback, useState } from 'react';

export const PREFILL_STORAGE_KEY = 'workoutPrefill';
export const PREFILL_MODES = ['last', 'average'];

function readChoices() {
  try {
    const value = JSON.parse(window.localStorage.getItem(PREFILL_STORAGE_KEY));
    return value && typeof value === 'object' ? value : {};
  } catch {
    return {};
  }
}

// Which values the open sets of an exercise are filled with, remembered on this
// device per exercise; the last choice is the default for other exercises.
export function usePrefillChoice() {
  const [choices, setChoices] = useState(readChoices);
  const modeOf = useCallback(
    key => (PREFILL_MODES.includes(choices[key]) ? choices[key] : PREFILL_MODES.includes(choices.default) ? choices.default : 'last'),
    [choices]
  );
  const choose = useCallback((key, mode) => {
    setChoices(current => {
      const next = { ...current, [key]: mode, default: mode };
      try {
        window.localStorage.setItem(PREFILL_STORAGE_KEY, JSON.stringify(next));
      } catch {
        // Without storage the choice lasts until the page is left.
      }
      return next;
    });
  }, []);
  return { modeOf, choose };
}
