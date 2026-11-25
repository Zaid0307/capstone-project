import { usePlanStore } from '../storage/PlanStoreContext';
import useStoredList from '../storage/useStoredList';
import { removeDay } from '../utils/workoutPlan';

// The user's plans and the actions on them. Changes show immediately and are
// then saved in the plan store; if saving fails, the plans are reloaded and
// `retry` repeats the failed change (or loads again when loading failed).
export default function useWorkoutPlans() {
  const store = usePlanStore();
  const { items: plans, isLoading, error, save, retry } = useStoredList(store);

  const findPlan = planId => plans.find(plan => plan.id === planId);

  return {
    plans,
    isLoading,
    error,
    retry,
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
