import { useCallback, useEffect, useState } from 'react';
import { useWorkoutStore } from '../storage/WorkoutStoreContext';

// The training diary and the actions on it. Changes show immediately and are
// then saved; if saving fails, the diary is reloaded from the store. The local
// store shows its data in the first render, the backend store loads it.
export default function useWorkoutLog(store) {
  const contextStore = useWorkoutStore();
  const workoutStore = store ?? contextStore;
  const [workouts, setWorkouts] = useState(() => workoutStore.snapshot?.() ?? []);
  const [isLoading, setIsLoading] = useState(() => !workoutStore.snapshot);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (workoutStore.snapshot) return undefined;
    let isCurrent = true;
    workoutStore
      .list()
      .then(loaded => {
        if (isCurrent) setWorkouts(loaded);
      })
      .catch(loadError => {
        if (isCurrent) setError(loadError);
      })
      .finally(() => {
        if (isCurrent) setIsLoading(false);
      });
    return () => {
      isCurrent = false;
    };
  }, [workoutStore]);

  const save = useCallback(
    async (change, request) => {
      setError(null);
      setWorkouts(change);
      try {
        await request();
      } catch (saveError) {
        setError(saveError);
        setWorkouts(await workoutStore.list());
      }
    },
    [workoutStore]
  );

  return {
    workouts,
    isLoading,
    error,
    addWorkout: workout => save(current => [...current, workout], () => workoutStore.create(workout)),
    updateWorkout: workout =>
      save(
        current => current.map(existing => (existing.id === workout.id ? workout : existing)),
        () => workoutStore.update(workout)
      ),
    deleteWorkout: workoutId =>
      save(
        current => current.filter(workout => workout.id !== workoutId),
        () => workoutStore.remove(workoutId)
      ),
  };
}
