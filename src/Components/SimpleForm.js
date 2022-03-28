import Exercise from "./Exercise";
import styled from "styled-components";
import ScreenReaderOnly from "./Styles/ScreenReaderOnly";
import SpaceBetween from "./Styles/SpaceBetween";
import Button from "./Button";
import Center from "./Styles/Center";
import { useState } from "react";

TestValue = [
  {
    day: "",
    muscle: "",
    exercise: "",
    weight: "",
    repetitions: "",
    sets: "",
  },
];

export default function SimpleForm() {
  const [formData, setFormData] = useState(TestValue);

  const handleOnChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <FormBox>
      <CreateWorkout>Create Workout</CreateWorkout>
      <form aria-labelledby="Create ur Workout plan" onSubmit={handleSubmit}>
        <label htmlFor="day">
          <ScreenReaderOnly>Enter Day</ScreenReaderOnly>
        </label>
        <input
          onChange={handleOnChange}
          id="day"
          name="day"
          required
          maxlength="20"
          type="text"
          placeholder="Add workout day"
        />
        <SpaceBetween>
          <label htmlFor="muscle">Muscle</label>
          <input
            onChange={handleOnChange}
            id="muscle"
            name="muscle"
            required
            maxLength="20"
            type="text"
            placeholder="Add the muscles you want to train"
          />
        </SpaceBetween>
        <Exercise />
        <Center>
          <Button name="Click here" />
        </Center>
      </form>
      <div>
        {TestValue.map((TestValue) => {
          const list = (
            <>
              <ul>
                <li>Day: {TestValue.day}</li>
                <li>Muscle: {TestValue.muscle}</li>
                <li>Exercise: {TestValue.exercise}</li>
                <li>Weight: {TestValue.weight}</li>
                <li>Repetitions: {TestValue.repetitions}</li>
                <li>Sets: {TestValue.sets}</li>
              </ul>
              <hr />
            </>
          );
          return list;
        })}
      </div>
    </FormBox>
  );
  function handleSubmit(event) {
    event.preventDefault();
  }
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
`;
