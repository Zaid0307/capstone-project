import styled from 'styled-components';
import ScreenReaderOnly from './Styles/ScreenReaderOnly';
import InputWrapper from './Styles/SpaceBetween';
import Center from './Styles/Center';
import { useState } from 'react';

export default function SimpleForm({ onCreateCards }) {
  const [formData, setFormData] = useState({
    exercise: '',
    weight: '',
    repetitions: '',
    sets: '',
  });
  //add and remove new Card
  const [exerciseCards, setExerciseCards] = useState([]);

  const handleAddExercise = () => {
    console.log(formData);
    setExerciseCards([...exerciseCards, formData]);
    setFormData({ exercise: '', weight: '', repetitions: '', sets: '' });
  };

  const handleRemoveExercise = targetIndex => {
    const values = exerciseCards.filter(
      (input, valuesIndex) => valuesIndex !== targetIndex
    );
    setExerciseCards(values);
  };
  // add and remove new Card ends here

  function handleSubmit(event) {
    event.preventDefault();
    onCreateCards(exerciseCards);
  }

  const handleOnChange = event => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  console.log({ formData });
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
          <InputWrapper>
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
          </InputWrapper>
          <StyledBox>
            <InputWrapper>
              <Label htmlFor="exercise">Exercise</Label>
              <Input
                value={formData.exercise}
                onChange={handleOnChange}
                name="exercise"
                required
                maxLength={20}
                id="exercise"
                type="text"
                placeholder="add ur exercise"
              />
            </InputWrapper>
            <InputWrapper>
              <Label htmlFor="weight">Weight</Label>
              <Input
                value={formData.weight}
                onChange={handleOnChange}
                name="weight"
                required
                maxLength={20}
                id="weight"
                type="text"
                placeholder="add ur weight"
              />
            </InputWrapper>
            <InputWrapper>
              <Label htmlFor="repetitions">Repetitions</Label>
              <Input
                value={formData.repetitions}
                onChange={handleOnChange}
                name="repetitions"
                required
                maxLength={20}
                id="repetitions"
                type="text"
                placeholder="add ur repetitions"
              />
            </InputWrapper>
            <InputWrapper>
              <Label htmlFor="sets">Sets</Label>
              <Input
                value={formData.sets}
                onChange={handleOnChange}
                name="sets"
                required
                maxLength={20}
                id="sets"
                type="text"
                placeholder="add ur sets"
              />
            </InputWrapper>
          </StyledBox>
          <button type="button" onClick={handleAddExercise}>
            add
          </button>

          {exerciseCards.map((exerciseInputs, index) => (
            <StyledBox key={index}>
              <InputWrapper>
                <Label htmlFor="exercise">Exercise</Label>
                <Input
                  name="exercise"
                  required
                  maxLength={20}
                  id="exercise"
                  type="text"
                  value={exerciseInputs.exercise}
                  onChange={handleOnChange}
                />
              </InputWrapper>
              <InputWrapper>
                <Label htmlFor="weight">Weight</Label>
                <Input
                  name="weight"
                  required
                  maxLength={20}
                  id="weight"
                  type="text"
                  placeholder="add ur weight"
                  value={exerciseInputs.weight}
                  onChange={handleOnChange}
                />
              </InputWrapper>
              <InputWrapper>
                <Label htmlFor="rep etitions">Repetitions</Label>
                <Input
                  name="repetitions"
                  required
                  maxLength={20}
                  id="repetitions"
                  type="text"
                  placeholder="add ur repetitions"
                  value={exerciseInputs.repetitions}
                  onChange={handleOnChange}
                />
              </InputWrapper>
              <InputWrapper>
                <Label htmlFor="sets">Sets</Label>
                <Input
                  name="sets"
                  required
                  maxLength={20}
                  id="sets"
                  type="text"
                  placeholder="add ur sets"
                  value={exerciseInputs.sets}
                  onChange={handleOnChange}
                  // use this if handleOnChange not work. onChange={event => handleChangeInput(index, event)}
                />
              </InputWrapper>
              <button type="button" onClick={() => handleRemoveExercise(index)}>
                Remove
              </button>
            </StyledBox>
          ))}
        </FormBox>
        <Center>
          <button type="submit" onClick={handleSubmit}>
            Click here
          </button>
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
