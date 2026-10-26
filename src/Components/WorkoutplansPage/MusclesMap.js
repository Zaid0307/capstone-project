import React, { useState } from 'react';
import styled from 'styled-components';
import { BiShow } from 'react-icons/bi';
import { BiHide } from 'react-icons/bi';
import WorkoutplanExersice from './WorkoutplanExercise';
import { useTranslation } from '../../i18n/LanguageContext';
import { muscleLabel } from '../../utils/workoutPlan';

export default function MusclesMap({ muscle }) {
  const { t } = useTranslation();
  const [showMucsle, setShowMucsle] = useState(false);
  const label = muscleLabel(muscle.name, t);

  return (
    <>
      <StyledMuscleBox>
        <StyledMuscle>{label}</StyledMuscle>
        <Button
          aria-label={t(showMucsle ? 'plans.hide' : 'plans.show', {
            name: label,
          })}
          aria-expanded={showMucsle}
          onClick={() => setShowMucsle(!showMucsle)}
        >
          {showMucsle ? <BiHide /> : <BiShow />}
        </Button>
      </StyledMuscleBox>
      {showMucsle ? <WorkoutplanExersice muscle={muscle} /> : null}
    </>
  );
}

const StyledMuscleBox = styled.div`
  position: relative;
  justify-content: center;
  display: flex;
  border-radius: 15px;
  padding: 10px;
`;

const StyledMuscle = styled.p`
  font-size: 1.1rem;
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
