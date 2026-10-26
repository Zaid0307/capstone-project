import { useState } from 'react';
import { useLocalStorage } from 'usehooks-ts';
import { deleteDay, deletePlan, updatePlan } from '../utils/workoutPlan';

export const STORAGE_KEY = 'workoutPlans';
// Older versions stored the plans under this key.
export const LEGACY_STORAGE_KEY = 'data';

function readLegacyPlans() {
  try {
    const plans = JSON.parse(localStorage.getItem(LEGACY_STORAGE_KEY));
    return Array.isArray(plans) ? plans : [];
  } catch {
    return [];
  }
}

export default function useWorkoutPlans() {
  const [initialPlans] = useState(readLegacyPlans);
  const [plans, setPlans] = useLocalStorage(STORAGE_KEY, initialPlans);

  return {
    plans,
    addPlan: plan => setPlans([...plans, plan]),
    updatePlan: plan => setPlans(updatePlan(plans, plan)),
    deletePlan: planId => setPlans(deletePlan(plans, planId)),
    deleteDay: (planId, dayId) => setPlans(deleteDay(plans, planId, dayId)),
  };
}
