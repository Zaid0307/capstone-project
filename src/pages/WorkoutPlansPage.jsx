import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { BsPlusCircle } from 'react-icons/bs';
import PageLayout from '../components/layout/PageLayout';
import WorkoutPlanCard from '../components/workoutPlans/WorkoutPlanCard';
import Center from '../components/ui/Center';
import { colors } from '../styles/colors';
import { radii } from '../styles/tokens';
import { useTranslation } from '../i18n/LanguageContext';
import { routes } from '../routes';

export default function WorkoutPlansPage({ plans, onDeletePlan, onDeleteDay }) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <PageLayout>
      {plans.length === 0 && <EmptyText>{t('plans.empty')}</EmptyText>}
      {plans.map(plan => (
        <WorkoutPlanCard
          key={plan.id}
          plan={plan}
          onDeletePlan={onDeletePlan}
          onDeleteDay={onDeleteDay}
        />
      ))}
      <Center>
        <CreateButton onClick={() => navigate(routes.newPlan)}>
          <BsPlusCircle size={20} />
          <span>{t('plans.create')}</span>
        </CreateButton>
      </Center>
    </PageLayout>
  );
}

const EmptyText = styled.p`
  padding: 20px;
  text-align: center;
  color: ${colors.surface};
`;

const CreateButton = styled.button`
  display: flex;
  gap: 5px;
  padding: 5px;
  margin-top: 15px;
  border: 1px solid;
  border-radius: ${radii.large};
  color: ${colors.surface};
  background-color: transparent;
  box-shadow: rgba(0, 0, 0, 0.17) 0px -23px 25px 0px inset,
    rgba(0, 0, 0, 0.15) 0px -36px 30px 0px inset,
    rgba(0, 0, 0, 0.1) 0px -79px 40px 0px inset, rgba(0, 0, 0, 0.06) 0px 2px 1px,
    rgba(0, 0, 0, 0.09) 0px 4px 2px, rgba(0, 0, 0, 0.09) 0px 8px 4px,
    rgba(0, 0, 0, 0.09) 0px 16px 8px, rgba(0, 0, 0, 0.09) 0px 32px 16px;
`;
