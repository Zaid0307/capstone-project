import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { BiPlusCircle } from 'react-icons/bi';
import PageLayout from '../components/layout/PageLayout';
import WorkoutPlanCard from '../components/workoutPlans/WorkoutPlanCard';
import Button from '../components/ui/Button';
import Message from '../components/ui/Message';
import PageTitle from '../components/ui/PageTitle';
import { space } from '../styles/tokens';
import { useTranslation } from '../i18n/LanguageContext';
import { routes } from '../routes';

export default function WorkoutPlansPage({ plans, onDeletePlan, onDeleteDay }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const isEmpty = plans.length === 0;

  const createButton = (
    <Button onClick={() => navigate(routes.newPlan)}>
      <BiPlusCircle aria-hidden="true" />
      {t('plans.create')}
    </Button>
  );

  return (
    <PageLayout>
      <Header>
        <PageTitle>{t('plans.title')}</PageTitle>
        {/* The empty state has its own button, so there is only one clear action. */}
        {!isEmpty && createButton}
      </Header>
      {isEmpty ? (
        <Message>
          <p>{t('plans.empty')}</p>
          {createButton}
        </Message>
      ) : (
        <PlanList>
          {plans.map(plan => (
            <li key={plan.id}>
              <WorkoutPlanCard
                plan={plan}
                onDeletePlan={onDeletePlan}
                onDeleteDay={onDeleteDay}
              />
            </li>
          ))}
        </PlanList>
      )}
    </PageLayout>
  );
}

const Header = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: ${space.md};
`;

const PlanList = styled.ul`
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: ${space.md};
  list-style: none;
`;
