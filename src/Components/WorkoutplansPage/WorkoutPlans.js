import styled from 'styled-components';
import { BiShow } from 'react-icons/bi';
import { BiHide } from 'react-icons/bi';
import { useState } from 'react';
import WorkoutPlanDay from './WorkoutPlanDay';
import { MdOutlineDeleteForever } from 'react-icons/md';
import { useTranslation } from '../../i18n/LanguageContext';

export default function WorkoutPlans({
  item,
  handleDeleteCard,
  handleDeleteDays,
}) {
  const { t } = useTranslation();
  const [showTitle, setShowTitle] = useState(false);
  const name = item.nameOfWorkout;

  return (
    <WorkoutBox>
      <Day>
        <StyledCenterBox>
          <PlanName>{name}</PlanName>
          <DeleteButton
            aria-label={t('plans.delete', { name })}
            onClick={() => handleDeleteCard(item.id)}
          >
            <MdOutlineDeleteForever />
          </DeleteButton>
          <Button
            aria-label={t(showTitle ? 'plans.hide' : 'plans.show', { name })}
            aria-expanded={showTitle}
            onClick={() => setShowTitle(!showTitle)}
          >
            {showTitle ? <BiHide /> : <BiShow />}
          </Button>
        </StyledCenterBox>
        {showTitle ? (
          <>
            {item.description && (
              <Description>{item.description}</Description>
            )}
            <WorkoutPlanDay item={item} handleDeleteDays={handleDeleteDays} />
          </>
        ) : null}
      </Day>
    </WorkoutBox>
  );
}
const Day = styled.div`
  margin: 10px;
  width: 100%;
`;

const PlanName = styled.h2`
  font-size: 1.1rem;
  font-weight: normal;
`;

const Description = styled.p`
  margin: 10px 5px 0;
  color: #283a45;
  text-align: center;
`;

const StyledCenterBox = styled.div`
  position: relative;
  display: flex;
  background-color: #5e888c;
  color: #283a45;
  width: 100%;
  justify-content: center;
  box-shadow: rgba(0, 0, 0, 0.45) 0px 25px 20px -20px;
  padding: 5px 80px;
  border-radius: 15px;
`;

const WorkoutBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 15px;
  padding: 5px;
  margin: 15px 10px;
  background-color: #d5dee8;
  box-shadow: rgba(0, 0, 0, 0.56) 0px 22px 70px 4px;
`;

const Button = styled.button`
  text-decoration: none;
  background-color: transparent;
  border: none;
  outline: none;
  position: absolute;
  right: 15px;
  color: #283a45;
`;
const DeleteButton = styled.button`
  text-decoration: none;
  background-color: transparent;
  border: none;
  outline: none;
  position: absolute;
  right: 45px;
  color: #283a45;
`;
