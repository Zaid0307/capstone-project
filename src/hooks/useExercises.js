import { useCallback, useEffect, useState } from 'react';
import { fetchExercises } from '../api/wger';

export default function useExercises(language) {
  const [attempt, setAttempt] = useState(0);
  const [result, setResult] = useState({ request: null, groups: null, error: null });
  // Each language and retry is its own request; it is loading until its result arrives.
  const request = `${language}:${attempt}`;

  useEffect(() => {
    let isCurrent = true;

    fetchExercises(language)
      .then(groups => {
        if (isCurrent) setResult({ request, groups, error: null });
      })
      .catch(error => {
        if (isCurrent) setResult({ request, groups: null, error });
      });

    return () => {
      isCurrent = false;
    };
  }, [language, request]);

  const reload = useCallback(() => setAttempt(count => count + 1), []);
  const isLoading = result.request !== request;

  return {
    // While another language loads, the previous exercises stay visible.
    groups: result.groups,
    isLoading,
    error: isLoading ? null : result.error,
    reload,
  };
}
