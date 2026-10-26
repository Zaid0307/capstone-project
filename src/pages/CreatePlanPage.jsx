import PageLayout from '../components/layout/PageLayout';
import PlanForm from '../components/planForm/PlanForm';

export default function CreatePlanPage({ onSave }) {
  return (
    <PageLayout>
      <PlanForm onSave={onSave} />
    </PageLayout>
  );
}
