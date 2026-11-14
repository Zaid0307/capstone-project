import { useEffect, useState } from 'react';
import { migratePlan } from '../utils/workoutPlan';

const PREFIX = 'planDraft:';

// Draft key of a plan that is being created; existing plans use their id.
export const NEW_PLAN_DRAFT = 'new';

// Browser storage can be missing or blocked (private mode); drafts are a
// convenience, so failures are ignored.
function read(key) {
  try {
    const value = JSON.parse(window.localStorage.getItem(PREFIX + key));
    return value && typeof value === 'object' ? migratePlan(value) : null;
  } catch {
    return null;
  }
}

export function hasPlanDraft(key) {
  return read(key) !== null;
}

export function clearPlanDraft(key) {
  try {
    window.localStorage.removeItem(PREFIX + key);
  } catch {
    // Nothing to clear.
  }
}

// The plan being edited, saved as a draft on every change, so leaving the page
// loses nothing. Returns the plan, its setter and whether a draft was restored.
export default function usePlanDraft(key, initialPlan) {
  const [restored] = useState(() => read(key));
  const [plan, setPlan] = useState(restored ?? initialPlan);
  const [isRestored, setIsRestored] = useState(restored !== null);

  useEffect(() => {
    if (plan === initialPlan) return;
    try {
      window.localStorage.setItem(PREFIX + key, JSON.stringify(plan));
    } catch {
      // Draft not saved; editing still works.
    }
  }, [key, plan, initialPlan]);

  function discardDraft() {
    clearPlanDraft(key);
    setPlan(initialPlan);
    setIsRestored(false);
  }

  return { plan, setPlan, isRestored, discardDraft };
}
