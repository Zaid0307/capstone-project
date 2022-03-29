import styled from 'styled-components';
import ScreenReaderOnly from './Styles/ScreenReaderOnly';
import SpaceBetween from './Styles/SpaceBetween';
import Button from './Button';
import Center from './Styles/Center';
import { useState } from 'react';

export default function SimpleForm() {
  const [formData, setFormData] = useState([]);

  function handleSubmit(event) {
    event.preventDefault();
  }

  const handleOnChange = event => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    console.log(formData);
  };

  return (
    <FormBox>
      <CreateWorkout>Create Workout</CreateWorkout>
      <form aria-labelledby="Create ur Workout plan" onSubmit={handleSubmit}>
        <label htmlFor="day">
          <ScreenReaderOnly> Enter Day </ScreenReaderOnly>
        </label>
        <InputDay
          onChange={handleOnChange}
          id="day"
          name="day"
          required
          maxlength="20"
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
            maxLength="20"
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
              maxlength="20"
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
              maxlength="20"
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
              maxLength="20"
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
              maxlength="20"
              id="sets"
              type="text"
              placeholder="add ur sets"
            />
          </SpaceBetween>
        </StyledBox>
        <Center>
          <Button name="Click here" />
        </Center>
      </form>
    </FormBox>
  );
}

const CreateWorkout = styled.h2`
  display: flex;
  justify-content: center;
  border: 2px solid Black;
  margin-top: 0;
`;

const FormBox = styled.div`
  border: 1px solid Black;
  padding: 2px;
  margin: 5px;
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
`;

const Input = styled.input`
  width: 250px;
`;

const Label = styled.label`
  font-size: 1rem;
`;
