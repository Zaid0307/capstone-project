import { Link, useParams } from 'react-router-dom';
import PageLayout from '../components/layout/PageLayout';
import PlanForm from '../components/planForm/PlanForm';
import Message from '../components/ui/Message';
import { useTranslation } from '../i18n/LanguageContext';
import { routes } from '../routes';

export default function EditPlanPage({ plans, onSave }) {
  const { t } = useTranslation();
  const { planId } = useParams();
  const plan = plans.find(plan => plan.id === planId);

  return (
    <PageLayout>
      {plan ? (
        <PlanForm key={plan.id} initialPlan={plan} onSave={onSave} />
      ) : (
        <Message role="alert">
          <p>{t('plans.notFound')}</p>
          <Link to={routes.plans}>{t('plans.backToPlans')}</Link>
        </Message>
      )}
    </PageLayout>
  );
}
