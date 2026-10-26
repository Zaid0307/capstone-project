import { Link, useParams } from 'react-router-dom';
import styled from 'styled-components';
import Form from './Form';
import Navigation from '../Components/Nav/Navigation';
import { useTranslation } from '../i18n/LanguageContext';

export default function EditPlanPage({ plans, onSave }) {
  const { t } = useTranslation();
  const { planId } = useParams();
  const plan = plans.find(plan => plan.id === planId);

  if (!plan) {
    return (
      <GridWrap>
        <Background>
          <Message role="alert">
            <p>{t('plans.notFound')}</p>
            <Link to="/Workoutplans">{t('plans.backToPlans')}</Link>
          </Message>
        </Background>
        <Navigation />
      </GridWrap>
    );
  }

  return <Form key={plan.id} initialPlan={plan} onSave={onSave} />;
}

const GridWrap = styled.div`
  display: grid;
  grid-template-rows: auto 48px;
  height: 100vh;
`;

const Background = styled.div`
  background: radial-gradient(#85c1c7, #5e888c, #344b59);
  height: 100%;
`;

const Message = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  margin: 20px;
  padding: 15px;
  border-radius: 15px;
  background-color: #d5dee8;
  color: #283a45;
`;
