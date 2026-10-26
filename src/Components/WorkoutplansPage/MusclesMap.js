import React, { useState } from 'react';
import styled from 'styled-components';
import { BiShow } from 'react-icons/bi';
import { BiHide } from 'react-icons/bi';
import WorkoutplanExersice from './WorkoutplanExercise';

export default function MusclesMap({ muscle }) {
  const [showMucsle, setShowMucsle] = useState(false);
  return (
    <>
      <StyledMuscleBox>
        <StyledMuscle>{muscle.name}</StyledMuscle>
        <Button onClick={() => setShowMucsle(!showMucsle)}>
          {showMucsle ? <BiHide /> : <BiShow />}
        </Button>
      </StyledMuscleBox>
      {showMucsle ? <WorkoutplanExersice muscle={muscle} /> : null}
    </>
  );
}

const StyledMuscleBox = styled.div`
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
  right: 40px;
  color: #283a45;
`;
