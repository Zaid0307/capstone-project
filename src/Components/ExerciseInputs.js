import { useState } from 'react';
import SpaceBetween from './Styles/SpaceBetween';
import Button from './Styles/Button';
import styled from 'styled-components';

export default function ExerciseInputs() {
  const [exerciseInputs, setExerciseInputs] = useState([
    { Exercise: '', Weight: '', Repetitions: '', Sets: '' },
  ]);
  console.log(exerciseInputs);

  const handleChangeInput = (index, event) => {
    const values = [...exerciseInputs];
    values[index][event.target.name] = event.target.value;
    setExerciseInputs(values);
  };

  const handleAddExercise = () => {
    setExerciseInputs([
      ...exerciseInputs,
      { Exercise: '', Weight: '', Repetitions: '', Sets: '' },
    ]);
  };

  const handleRemoveExercise = targetIndex => {
    const values = exerciseInputs.filter(
      (input, valuesIndex) => valuesIndex !== targetIndex
    );
    setExerciseInputs(values);
  };

  return (
    <>
      {exerciseInputs.map((exerciseInputs, index) => (
        <StyledBox key={index}>
          <SpaceBetween>
            <Button
              name="remove exercise"
              onClick={() => handleRemoveExercise(index)}
            />
            <Label htmlFor="exercise">Exercise</Label>
            <Input
              name="Exercise"
              required
              maxLength={20}
              id="exercise"
              type="text"
              placeholder="add ur exercise"
              value={exerciseInputs.Exercise}
              onChange={event => handleChangeInput(index, event)}
            />
          </SpaceBetween>
          <SpaceBetween>
            <Label htmlFor="weight">Weight</Label>
            <Input
              name="Weight"
              required
              maxLength={20}
              id="weight"
              type="text"
              placeholder="add ur weight"
              value={exerciseInputs.Weight}
              onChange={event => handleChangeInput(index, event)}
            />
          </SpaceBetween>
          <SpaceBetween>
            <Label htmlFor="rep etitions">Repetitions</Label>
            <Input
              name="Repetitions"
              required
              maxLength={20}
              id="repetitions"
              type="text"
              placeholder="add ur repetitions"
              value={exerciseInputs.Repetitions}
              onChange={event => handleChangeInput(index, event)}
            />
          </SpaceBetween>
          <SpaceBetween>
            <Label htmlFor="sets">Sets</Label>
            <Input
              name="Sets"
              required
              maxLength={20}
              id="sets"
              type="text"
              placeholder="add ur sets"
              value={exerciseInputs.Sets}
              onChange={event => handleChangeInput(index, event)}
            />
          </SpaceBetween>
          <Button name="add exercise" onClick={() => handleAddExercise()} />
        </StyledBox>
      ))}
    </>
  );
}

const StyledBox = styled.div`
  display: flex;
  flex-direction: column;
  margin: 5px;
  box-shadow: rgba(0, 0, 0, 0.05) 0px 0px 0px 1px,
    rgb(209, 213, 219) 0px 0px 0px 1px inset;
  border-radius: 5px;
`;

const Input = styled.input`
  width: 250px;
`;

const Label = styled.label`
  font-size: 1rem;
`;
