import { createContext, useContext } from 'react';
import { createLocalPlanStore } from './localPlanStore';

const PlanStoreContext = createContext(null);

// Lets the app use a different plan store, e.g. a backend store after login.
export function PlanStoreProvider({ store, children }) {
  return <PlanStoreContext.Provider value={store}>{children}</PlanStoreContext.Provider>;
}

let defaultStore;

export function usePlanStore() {
  const store = useContext(PlanStoreContext);
  if (store) return store;
  defaultStore ??= createLocalPlanStore();
  return defaultStore;
}
