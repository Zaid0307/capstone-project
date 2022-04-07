import ScreenReaderOnly from './Styles/ScreenReaderOnly';
import SpaceBetween from './Styles/SpaceBetween';
import Center from './Styles/Center';
import styled from 'styled-components';
import { useState } from 'react';
import ListedExercise from './ListedExercise';

export default function DayForm({ onSubmit, day }) {
  const [createCard, setCreateCard] = useState([]);
  const [workOutData, setWorkOutData] = useState({
    exercise: '',
    weight: '',
    repetitions: '',
    sets: '',
  });

  function handleSubmit(event) {
    event.preventDefault();
    const form = event.target;
    const { exercise, weight, repetitions, sets } = form.elements;
    const newDay = {
      day,
      exercise: exercise.value,
      weight: weight.value,
      repetitions: repetitions.value,
      sets: sets.value,
    };

    onSubmit({ newDay });
  }

  function handleOnChange(event) {
    const { name, value } = event.target;
    setWorkOutData({ ...workOutData, [name]: value });
  }

  function handleAddExercise() {
    setCreateCard([...createCard, workOutData]);
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
          <StyledDay>{day}</StyledDay>
          <SpaceBetween>
            <label htmlFor={`muscle${day}`}>Muscle:</label>
            <select
              defaultValue="Arms"
              id={`muscle${day}`}
              name="selectList"
              required
              onChange={handleOnChange}
            >
              <option value="Arms">Arms</option>
              <option value="Back">Back</option>
              <option value="Chest">Chest</option>
              <option value="Legs">Legs</option>
              <option value="Shoulders">Shoulders</option>
              <option value="Stomach">Stomach</option>
            </select>
          </SpaceBetween>
          <SpaceBetween>
            <label htmlFor={`exercise${day}`}>Exercise:</label>
            <Input
              id={`exercise${day}`}
              name="exercise"
              required
              maxlenght={20}
              type="text"
              placeholder="Dumbbell Incline Curl "
              value={workOutData.exercise}
              onChange={handleOnChange}
            />
          </SpaceBetween>
          <SpaceBetween>
            <label htmlFor={`weight${day}`}>Weight:</label>
            <Input
              id={`weight${day}`}
              name="weight"
              required
              maxlenght={5}
              type="number"
              placeholder="12,5 ... 80 for Bodyweight"
              value={workOutData.weight}
              onChange={handleOnChange}
            />
          </SpaceBetween>
          <SpaceBetween>
            <label htmlFor={`repetitions${day}`}>Repetitions:</label>
            <Input
              id={`repetitions${day}`}
              name="repetitions"
              required
              maxlenght="2"
              type="number"
              min="0"
              placeholder="12"
              value={workOutData.repetitions}
              onChange={handleOnChange}
            />
          </SpaceBetween>
          <SpaceBetween>
            <label htmlFor={`sets${day}`}>Sets:</label>
            <Input
              id={`sets${day}`}
              name="sets"
              required
              maxlenght={2}
              type="number"
              min="0"
              placeholder="3"
              value={workOutData.sets}
              onChange={handleOnChange}
            />
          </SpaceBetween>
          <Center>
            <button type="button" onClick={handleAddExercise}>
              add exercise
            </button>
          </Center>
        </form>

        {!workOutData.selectList ? (
          ''
        ) : (
          <StyledMuscleName>{workOutData.selectList}</StyledMuscleName>
        )}

        {createCard.map((newCards, index) => (
          <ListedExercise key={`card${index}`} newCards={newCards} />
        ))}
      </FormBox>
    </>
  );
}

const StyledDay = styled.h2`
  display: flex;
  justify-content: center;
  border: 1.5px solid gray;
  border-radius: 5px;
  margin: 5px;
  padding-top: 3px;
`;
const StyledMuscleName = styled.div`
  display: flex;
  justify-content: center;
  border: 1px solid lightgray;
  border-radius: 5px;
  margin-top: 5px;
  padding-top: 3px;
`;
const FormBox = styled.div`
  border: 1px solid lightgray;
  padding: 2px;
  margin: 5px 0 5px 0;
  border-radius: 5px;
`;

const Input = styled.input`
  width: 230px;
`;
