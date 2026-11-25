import { useWorkoutStore } from '../storage/WorkoutStoreContext';
import useStoredList from '../storage/useStoredList';

// The training diary and the actions on it. Changes show immediately and are
// then saved; if saving fails, the diary is reloaded from the store and
// `retry` repeats the failed change (or loads again when loading failed).
// The local store shows its data in the first render, the backend store loads it.
export default function useWorkoutLog(store) {
  const contextStore = useWorkoutStore();
  const workoutStore = store ?? contextStore;
  const { items: workouts, isLoading, error, save, retry } = useStoredList(workoutStore);

  return {
    workouts,
    isLoading,
    error,
    retry,
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
