import styled from 'styled-components';
import WorkoutPlans from '../Components/WorkoutplansPage/WorkoutPlans';
import { BsPlusCircle } from 'react-icons/bs';
import Center from '../Components/Styles/Center';
import { useNavigate } from 'react-router-dom';
import Navigation from '../Components/Nav/Navigation';
import { useTranslation } from '../i18n/LanguageContext';

export default function WorkoutplansPage({
  data,
  handleDeleteCard,
  handleDeleteDays,
}) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  function handleCreateWorkout() {
    navigate('/Create_Plan');
  }
  return (
    <GridWrap>
      <Background>
        {data.length === 0 && <EmptyText>{t('plans.empty')}</EmptyText>}
        {data.map(item => (
          <WorkoutPlans
            key={item.id}
            item={item}
            handleDeleteCard={handleDeleteCard}
            handleDeleteDays={handleDeleteDays}
          />
        ))}
        <Center>
          <Button onClick={handleCreateWorkout}>
            <BsPlusCircle size={20} />
            <span>{t('plans.create')}</span>
          </Button>
        </Center>
      </Background>
      <Navigation />
    </GridWrap>
  );
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

const EmptyText = styled.p`
  padding: 20px;
  text-align: center;
  color: #d5dee8;
`;

const Button = styled.button`
  text-decoration: none;
  color: #d5dee8;
  background-color: transparent;
  border: none;
  outline: none;
  display: flex;
  border: 1px solid;
  border-radius: 15px;
  gap: 5px;
  padding: 5px;
  margin-top: 15px;
  box-shadow: rgba(0, 0, 0, 0.17) 0px -23px 25px 0px inset,
    rgba(0, 0, 0, 0.15) 0px -36px 30px 0px inset,
    rgba(0, 0, 0, 0.1) 0px -79px 40px 0px inset, rgba(0, 0, 0, 0.06) 0px 2px 1px,
    rgba(0, 0, 0, 0.09) 0px 4px 2px, rgba(0, 0, 0, 0.09) 0px 8px 4px,
    rgba(0, 0, 0, 0.09) 0px 16px 8px, rgba(0, 0, 0, 0.09) 0px 32px 16px;
`;
