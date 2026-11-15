import { useEffect, useState } from 'react';

// Setup and execution texts of the exercises (about 220 kB gzipped). They are
// loaded on demand, so the main bundle only carries what lists and analyses need.
let loading = null;
let loaded = null;

export function loadExerciseDetails() {
  loading ??= import('./exerciseDetails.json').then(module => {
    loaded = module.default;
    return loaded;
  });
  return loading;
}

// All details by exercise ID, or null while they are loading.
export function useExerciseDetails() {
  const [details, setDetails] = useState(loaded);
  useEffect(() => {
    if (details) return undefined;
    let active = true;
    loadExerciseDetails().then(result => {
      if (active) setDetails(result);
    });
    return () => {
      active = false;
    };
  }, [details]);
  return details;
}

const textIn = (text, language) => text?.[language] ?? text?.en ?? '';

// A short description: the starting position and the first step.
export function describeExercise(detail, language) {
  if (!detail) return '';
  const { start, steps } = detail.execution;
  return [textIn(start, language), textIn(steps[0], language)].filter(Boolean).join(' ');
}
