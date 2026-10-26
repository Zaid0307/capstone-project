import styled from 'styled-components';
import { BiShow } from 'react-icons/bi';
import { BiHide } from 'react-icons/bi';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import WorkoutPlanDay from './WorkoutPlanDay';
import { MdOutlineDeleteForever, MdOutlineEdit } from 'react-icons/md';
import { useTranslation } from '../../i18n/LanguageContext';
import { dayLabel } from '../../utils/workoutPlan';

export default function WorkoutPlans({
  item,
  handleDeleteCard,
  handleDeleteDays,
}) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [showTitle, setShowTitle] = useState(false);
  const name = item.nameOfWorkout;

  function handleDelete() {
    if (window.confirm(t('plans.confirmDelete', { name }))) {
      handleDeleteCard(item.id);
    }
  }

  function handleDeleteDay(dayId, planId) {
    const { day } = item.days.find(day => day.id === dayId);
    const question = t('plans.confirmDeleteDay', {
      day: dayLabel(day, t),
      name,
    });
    if (window.confirm(question)) {
      handleDeleteDays(dayId, planId);
    }
  }

  return (
    <WorkoutBox>
      <Day>
        <StyledCenterBox>
          <PlanName>{name}</PlanName>
          <EditButton
            aria-label={t('plans.edit', { name })}
            onClick={() => navigate(`/Workoutplans/${item.id}/edit`)}
          >
            <MdOutlineEdit />
          </EditButton>
          <DeleteButton
            aria-label={t('plans.delete', { name })}
            onClick={handleDelete}
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
            <WorkoutPlanDay item={item} handleDeleteDays={handleDeleteDay} />
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
  padding: 5px 105px;
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
const EditButton = styled.button`
  text-decoration: none;
  background-color: transparent;
  border: none;
  outline: none;
  position: absolute;
  right: 75px;
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
