import { useCallback, useEffect, useState } from 'react';
import { usePlanStore } from '../storage/PlanStoreContext';
import { removeDay } from '../utils/workoutPlan';

// The user's plans and the actions on them. Changes show immediately and are
// then saved in the plan store; if saving fails, the plans are reloaded.
export default function useWorkoutPlans() {
  const store = usePlanStore();
  const [plans, setPlans] = useState(() => store.snapshot?.() ?? []);
  const [isLoading, setIsLoading] = useState(() => !store.snapshot);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (store.snapshot) return undefined;
    let isCurrent = true;
    store
      .list()
      .then(loaded => {
        if (isCurrent) setPlans(loaded);
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
  }, [store]);

  const save = useCallback(
    async (change, request) => {
      setError(null);
      setPlans(change);
      try {
        await request();
      } catch (saveError) {
        setError(saveError);
        setPlans(await store.list());
      }
    },
    [store]
  );

  const findPlan = planId => plans.find(plan => plan.id === planId);

  return {
    plans,
    isLoading,
    error,
    addPlan: plan => save(current => [...current, plan], () => store.create(plan)),
    updatePlan: plan =>
      save(
        current => current.map(existing => (existing.id === plan.id ? plan : existing)),
        () => store.update(plan)
      ),
    deletePlan: planId =>
      save(
        current => current.filter(plan => plan.id !== planId),
        () => store.remove(planId)
      ),
    deleteDay: (planId, dayId) => {
      const plan = findPlan(planId);
      if (!plan) return undefined;
      const updated = removeDay(plan, dayId);
      return save(
        current => current.map(existing => (existing.id === planId ? updated : existing)),
        () => store.update(updated)
      );
    },
  };
}
