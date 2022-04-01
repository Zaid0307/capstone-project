import styled from 'styled-components';
import ScreenReaderOnly from './Styles/ScreenReaderOnly';
import SpaceBetween from './Styles/SpaceBetween';
import Button from './Button';
import Center from './Styles/Center';
import { useState } from 'react';

export default function SimpleForm({ onCreateCard }) {
  const [formData, setFormData] = useState('');
  //add and remove new Card
  const [exerciseInputs, setExerciseInputs] = useState([
    { Exercise: '', Weight: '', Repetitions: '', Sets: '' },
  ]);

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
  // add and remove new Card ends here

  function handleSubmit(event) {
    event.preventDefault();
    onCreateCard(formData);
    event.target.reset();
  }

  const handleOnChange = event => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <>
      <CreateWorkout id="formTitle">Create Workout</CreateWorkout>
      <form
        autoComplete="off"
        aria-labelledby="formTitle"
        onSubmit={handleSubmit}
      >
        <FormBox>
          <label htmlFor="day">
            <ScreenReaderOnly> Enter Day </ScreenReaderOnly>
          </label>
          <InputDay
            onChange={handleOnChange}
            id="day"
            name="day"
            required
            maxLength={20}
            type="text"
            placeholder="Add workout day"
          />
          <SpaceBetween>
            <LabelMuscle htmlFor="muscle">Muscle</LabelMuscle>
            <InputMuscle
              onChange={handleOnChange}
              id="muscle"
              name="muscle"
              required
              maxLength={20}
              type="text"
              placeholder="Add the muscles"
            />
          </SpaceBetween>
          <StyledBox>
            <SpaceBetween>
              <Label htmlFor="exercise">Exercise</Label>
              <Input
                onChange={handleOnChange}
                name="exercise"
                required
                maxLength={20}
                id="exercise"
                type="text"
                placeholder="add ur exercise"
              />
            </SpaceBetween>
            <SpaceBetween>
              <Label htmlFor="weight">Weight</Label>
              <Input
                onChange={handleOnChange}
                name="weight"
                required
                maxLength={20}
                id="weight"
                type="text"
                placeholder="add ur weight"
              />
            </SpaceBetween>
            <SpaceBetween>
              <Label htmlFor="repetitions">Repetitions</Label>
              <Input
                onChange={handleOnChange}
                name="repetitions"
                required
                maxLength={20}
                id="repetitions"
                type="text"
                placeholder="add ur repetitions"
              />
            </SpaceBetween>
            <SpaceBetween>
              <Label htmlFor="sets">Sets</Label>
              <Input
                onChange={handleOnChange}
                name="sets"
                required
                maxLength={20}
                id="sets"
                type="text"
                placeholder="add ur sets"
              />
            </SpaceBetween>
          </StyledBox>
          {exerciseInputs.map((exerciseInputs, index) => (
            <StyledBox key={index}>
              <Button
                name="add exercise"
                type="button"
                onClick={() => handleAddExercise()}
              />
              <SpaceBetween>
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
              <Button
                name="remove exercise"
                type="button"
                onClick={() => handleRemoveExercise(index)}
              />
            </StyledBox>
          ))}
        </FormBox>
        <Center>
          <Button name="Click here" type="submit" onClick={handleSubmit} />
        </Center>
      </form>
    </>
  );
}

const CreateWorkout = styled.h2`
  display: flex;
  justify-content: center;
  border: 2px solid Black;
  border-radius: 5px;
  margin: 5px;
  padding-top: 3px;
`;

const FormBox = styled.div`
  border: 1px solid Black;
  padding: 2px;
  margin: 5px;
  border-radius: 5px;
`;

const InputMuscle = styled.input`
  margin-right: 5px;
  width: 250px;
`;

const LabelMuscle = styled.label`
  margin-left: 5px;
`;

const InputDay = styled.input`
  width: 250px;
  margin: 10px auto 5px 10px;
`;

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
