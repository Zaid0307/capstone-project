import { useState } from 'react';
import PageLayout from '../components/layout/PageLayout';
import PlanEditor from '../components/planEditor/PlanEditor';
import TemplatePicker from '../components/planEditor/TemplatePicker';
import { NEW_PLAN_DRAFT, hasPlanDraft } from '../hooks/usePlanDraft';
import { createEmptyPlan } from '../utils/workoutPlan';

// A new plan starts with the choice "empty or template", unless a draft of an
// unfinished new plan exists: then the editor opens with that draft.
export default function CreatePlanPage({ plans, onSave, onCancel }) {
  const [startPlan, setStartPlan] = useState(() =>
    hasPlanDraft(NEW_PLAN_DRAFT) ? createEmptyPlan() : null
  );

  return (
    <PageLayout isWide hideNavigation={Boolean(startPlan)}>
      {startPlan ? (
        <PlanEditor
          initialPlan={startPlan}
          draftKey={NEW_PLAN_DRAFT}
          isNew
          onSave={onSave}
          onCancel={onCancel}
        />
      ) : (
        <TemplatePicker plans={plans} onChoose={setStartPlan} />
      )}
    </PageLayout>
  );
}
