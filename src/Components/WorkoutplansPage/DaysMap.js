import styled from 'styled-components';
import { BiShow } from 'react-icons/bi';
import { BiHide } from 'react-icons/bi';
import WorkoutPlanMuscles from './WorkouPlanMuscles';
import { useState } from 'react';
import { MdOutlineDeleteForever } from 'react-icons/md';
import { useTranslation } from '../../i18n/LanguageContext';
import { dayLabel } from '../../utils/workoutPlan';

export default function DaysMap({ day, handleDeleteDays, itemId }) {
  const { t } = useTranslation();
  const [showDay, setShowDay] = useState(false);
  const label = dayLabel(day.day, t);

  return (
    <StyledDayBox>
      <TestDayContainer>
        <StyledDay>{label.toUpperCase()}</StyledDay>
        <DeleteButton
          aria-label={t('plans.deleteDay', { day: label })}
          onClick={() => handleDeleteDays(day.id, itemId)}
        >
          <MdOutlineDeleteForever />
        </DeleteButton>
        <Button
          aria-label={t(showDay ? 'plans.hide' : 'plans.show', { name: label })}
          aria-expanded={showDay}
          onClick={() => setShowDay(!showDay)}
        >
          {showDay ? <BiHide /> : <BiShow />}
        </Button>
      </TestDayContainer>
      {showDay ? <WorkoutPlanMuscles day={day} /> : null}
    </StyledDayBox>
  );
}

const StyledDayBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #283a45;
  width: 100%;
  justify-content: center;
  border-radius: 15px;
  margin: 10px 0;
  box-shadow: rgba(60, 64, 67, 0.3) 0px 2px 6px 2px,
    rgba(60, 64, 67, 0.15) 0px 2px 6px 2px;
`;

const TestDayContainer = styled.div`
  position: relative;
  justify-content: center;
  display: flex;
  width: 100%;
  border-radius: 15px;
  padding: 10px;
`;

const StyledDay = styled.p`
  letter-spacing: 0.2em;
  font-size: 1.4rem;
  font-weight: bold;
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
