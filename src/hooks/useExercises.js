import { useCallback, useEffect, useState } from 'react';
import { fetchExercises } from '../api/wger';

export default function useExercises(language) {
  const [state, setState] = useState({
    groups: null,
    isLoading: true,
    error: null,
  });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let isCurrent = true;
    setState(previous => ({ ...previous, isLoading: true, error: null }));

    fetchExercises(language)
      .then(groups => {
        if (isCurrent) {
          setState({ groups, isLoading: false, error: null });
        }
      })
      .catch(error => {
        if (isCurrent) {
          setState({ groups: null, isLoading: false, error });
        }
      });

    return () => {
      isCurrent = false;
    };
  }, [language, attempt]);

  const reload = useCallback(() => setAttempt(count => count + 1), []);

  return { ...state, reload };
}
