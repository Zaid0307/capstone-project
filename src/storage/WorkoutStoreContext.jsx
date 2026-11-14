import { createContext, useContext } from 'react';
import { createLocalWorkoutStore } from './localWorkoutStore';

const WorkoutStoreContext = createContext(null);

// Lets the app use a different diary store, e.g. the backend store after login.
export function WorkoutStoreProvider({ store, children }) {
  return <WorkoutStoreContext.Provider value={store}>{children}</WorkoutStoreContext.Provider>;
}

let defaultStore;

export function useWorkoutStore() {
  const store = useContext(WorkoutStoreContext);
  if (store) return store;
  defaultStore ??= createLocalWorkoutStore();
  return defaultStore;
}
