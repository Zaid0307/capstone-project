import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import PageLayout from '../components/layout/PageLayout';
import PlanEditor from '../components/planEditor/PlanEditor';
import Message from '../components/ui/Message';
import { useTranslation } from '../i18n/LanguageContext';
import { migratePlan } from '../utils/workoutPlan';
import { routes } from '../routes';

export default function EditPlanPage({ plans, onSave, onCancel }) {
  const { t } = useTranslation();
  const { planId } = useParams();
  const plan = plans.find(item => item.id === planId);

  return (
    <PageLayout isWide hideNavigation={Boolean(plan)}>
      {plan ? (
        <Editor key={plan.id} plan={plan} otherPlans={plans} onSave={onSave} onCancel={onCancel} />
      ) : (
        <Message role="alert">
          <p>{t('plans.notFound')}</p>
          <Link to={routes.plans}>{t('plans.backToPlans')}</Link>
        </Message>
      )}
    </PageLayout>
  );
}

function Editor({ plan, otherPlans, onSave, onCancel }) {
  // Keep the start plan stable, so the editor can tell whether anything changed.
  const [initialPlan] = useState(() => migratePlan(plan));
  return (
    <PlanEditor
      initialPlan={initialPlan}
      draftKey={plan.id}
      otherPlans={otherPlans}
      onSave={onSave}
      onCancel={onCancel}
    />
  );
}
