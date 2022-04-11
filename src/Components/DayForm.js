import ScreenReaderOnly from './Styles/ScreenReaderOnly';
import SpaceBetween from './Styles/SpaceBetween';
import Center from './Styles/Center';
import styled from 'styled-components';
import { useState } from 'react';
import ListedExercise from './ListedExercise';

export default function DayForm({ onSubmit, day }) {
  const [exercises, setExercises] = useState([]);
  const [muscle, setMuscle] = useState('');
  const [exercise, setExercise] = useState({
    exercise: '',
    weight: '',
    repetitions: '',
    sets: '',
  });

  function handleSubmit(event) {
    event.preventDefault();
    setExercises([...exercises, exercise]);
    setExercise({
      exercise: '',
      weight: '',
      repetitions: '',
      sets: '',
    });
    setMuscle('');
  }

  function handleOnChange(event) {
    const { name, value } = event.target;
    setExercise({ ...exercise, [name]: value });
  }

  function handleAddExercise() {
    setExercises([...exercises, exercise]);
    const newDay = {
      day,
      muscles: {
        name: muscle,
        exercises,
      },
    };
    onSubmit(newDay);

    setExercise({
      exercise: '',
      weight: '',
      repetitions: '',
      sets: '',
    });
    // setMuscle('');
    // setExercise([]);
  }

  return (
    <>
      <FormBox>
        <ScreenReaderOnly id="formSpan" Create your workout sessions />
        <form
          autoComplete="off"
          aria-labelledby="formSpan"
          onSubmit={handleSubmit}
        >
          <StyledCenterBox>{day}</StyledCenterBox>
          <SpaceBetween>
            <Lable htmlFor={`muscle${day}`}>Muscle:</Lable>
            <select
              id={`muscle${day}`}
              name="selectList"
              required
              defaultValue={'default'}
              onChange={event => setMuscle(event.target.value)}
              // value={muscle}
            >
              <option value={'default'} disabled>
                Choose an option
              </option>
              <option value="Arms">Arms</option>
              <option value="Back">Back</option>
              <option value="Chest">Chest</option>
              <option value="Legs">Legs</option>
              <option value="Shoulders">Shoulders</option>
              <option value="Stomach">Stomach</option>
            </select>
          </SpaceBetween>
          <SpaceBetween>
            <Lable htmlFor={`exercise${day}`}>Exercise:</Lable>
            <StyledInput
              id={`exercise${day}`}
              name="exercise"
              required
              maxlenght={20}
              type="text"
              placeholder="Dumbbell Incline Curl "
              value={exercise.exercise}
              onChange={handleOnChange}
            />
          </SpaceBetween>
          <SpaceBetween>
            <Lable htmlFor={`weight${day}`}>Weight:</Lable>
            <StyledInput
              id={`weight${day}`}
              name="weight"
              required
              maxlenght={5}
              min="0"
              type="number"
              placeholder="12,5 ... 80 for Bodyweight"
              value={exercise.weight}
              onChange={handleOnChange}
            />
          </SpaceBetween>
          <SpaceBetween>
            <Lable htmlFor={`repetitions${day}`}>Repetitions:</Lable>
            <StyledInput
              id={`repetitions${day}`}
              name="repetitions"
              required
              maxlenght={2}
              type="number"
              min="0"
              placeholder="12"
              value={exercise.repetitions}
              onChange={handleOnChange}
            />
          </SpaceBetween>
          <SpaceBetween>
            <Lable htmlFor={`sets${day}`}>Sets:</Lable>
            <StyledInput
              id={`sets${day}`}
              name="sets"
              required
              maxlenght={2}
              type="number"
              min="0"
              placeholder="3"
              value={exercise.sets}
              onChange={handleOnChange}
            />
          </SpaceBetween>
          <Center>
            <OnClickButton type="button" onClick={handleAddExercise}>
              add exercise
            </OnClickButton>
          </Center>
        </form>

        {muscle && <StyledMuscleName>{muscle}</StyledMuscleName>}

        {exercises.map((newCards, index) => (
          <ListedExercise key={`card${index}`} newCards={newCards} />
        ))}
      </FormBox>
    </>
  );
}

const StyledMuscleName = styled.div`
  display: flex;
  justify-content: center;
  border: 1px solid lightgray;
  border-radius: 5px;
  margin-top: 5px;
  padding-top: 3px;
`;
const FormBox = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 5px;
  margin: 0 15px 15px 15px;
  padding: 5px;
  background-color: #d5dee8;
  box-shadow: rgba(0, 0, 0, 0.56) 0px 22px 70px 4px;
  /* border: 1px solid lightgray;
  padding: 2px;
  margin: 5px 0 5px 0;
  border-radius: 5px; */
`;

const StyledInput = styled.input`
  box-sizing: border-box;
  border: none;
  border-bottom: 0.5px solid #5e888c;
  font-size: 1rem;
  padding-left: 0.25rem;
  padding-top: 0.25rem;
  background-color: transparent;
  width: 220px;
  &::placeholder {
    color: red;
  }
  &:focus {
    border-color: #496b73;
    outline: none;
  }
`;

const OnClickButton = styled.button`
  display: inline-flex;
  border: none;
  outline: none;
  border-radius: 5px;
  overflow: hidden;
  font-size: 1rem;
  font-weight: 500;
  padding: 5px;
  background-color: #283a45;
  color: #d5dee8;
  &:hover {
    background-color: #496b73;
    color: #b5dff5;
  }
`;

const Lable = styled.label`
  color: #496b73;
`;

const StyledCenterBox = styled.div`
  display: flex;
  background-color: #5e888c;
  color: #283a45;
  width: 100%;
  justify-content: center;
  box-shadow: rgba(0, 0, 0, 0.45) 0px 25px 20px -20px;
  padding: 5px;
  border-radius: 5px;
`;
