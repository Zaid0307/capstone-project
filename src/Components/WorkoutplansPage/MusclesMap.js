import React, { useState } from 'react';
import styled from 'styled-components';
import { BiShow } from 'react-icons/bi';
import { BiHide } from 'react-icons/bi';
import WorkoutplanExersice from './WorkoutplanExercise';

export default function MusclesMap({ muscle, index }) {
  const [showMucsle, setShowMucsle] = useState(false);
  return (
    <Card key={`muscle${index}`}>
      <StyledMuscleBox>
        <StyledMuscle>{muscle.name}</StyledMuscle>
        <Button onClick={() => setShowMucsle(!showMucsle)}>
          {showMucsle ? <BiHide /> : <BiShow />}
        </Button>
      </StyledMuscleBox>
      {showMucsle ? <WorkoutplanExersice muscle={muscle} /> : null}
      {}
    </Card>
  );
}

const Card = styled.div`
  display: flex;
  flex-direction: column;
  box-shadow: rgba(14, 30, 37, 0.12) 0px 2px 4px 0px,
    rgba(14, 30, 37, 0.32) 0px 2px 16px 0px;
  border-radius: 15px;
  margin: 5px 0px 10px 0px;
  width: 95%;
`;

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
