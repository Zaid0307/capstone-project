import Button from './Button';
import ScreenReaderOnly from './Styles/ScreenReaderOnly';
import SpaceBetween from './Styles/SpaceBetween';
import Center from './Styles/Center';
import styled from 'styled-components';
import { IoIosAddCircleOutline } from 'react-icons/io';

export default function DayForm({ onSubmit, day }) {
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
    onSubmit(newDay);
  }

  return (
    <>
      <ScreenReaderOnly id="formSpan" Create your workout sessions />
      <form
        autoComplete="off"
        aria-labelledby="formSpan"
        onSubmit={handleSubmit}
      >
        <h3>{day}</h3>
        {/* <SpaceBetween>
          <div>
            <p>mucels</p>
          </div>
          <StyledRow>
            <button type="button">
              <IoIosAddCircleOutline />
            </button>
            <p>0</p>
            <Button name="-" />
          </StyledRow>
        </SpaceBetween> */}
        <SpaceBetween>
          <label htmlFor={`exercise${day.day}`}>Exercise</label>
          <input
            id={`exercise${day.day}`}
            name="exercise"
            required="required"
            maxlenght={20}
            type="text"
            placeholder="add ur exercise"
            //value=""
            //onChange={}
          />
        </SpaceBetween>
        <SpaceBetween>
          <label htmlFor={`weight${day.day}`}>Weight</label>
          <input
            id={`weight${day.day}`}
            name="weight"
            required="required"
            maxlenght={5}
            type="text"
            placeholder="add your weight"
            //value=""
            //onChange={}
          />
        </SpaceBetween>
        <SpaceBetween>
          <label htmlFor={`repetitions${day.day}`}>Repetitions</label>
          <input
            id={`repetitions${day.day}`}
            name="repetitions"
            required="required"
            maxlenght={2}
            type="text"
            placeholder="add your repetitions"
            //value=""
            //onChange={}
          />
        </SpaceBetween>
        <SpaceBetween>
          <label htmlFor={`sets${day.day}`}>Sets</label>
          <input
            id={`sets${day.day}`}
            name="sets"
            required="required"
            maxlenght={2}
            type="text"
            placeholder="add your sets"
            //value=""
            //onChange={}
          />
        </SpaceBetween>
        <Center>
          <Button
            name="Save"
            type="submit"
            //onClick={}
          />
        </Center>
      </form>
    </>
  );
}

const StyledRow = styled.div`
  display: flex;
  gap: 5px;
`;
