import Button from './Button';
import ScreenReaderOnly from './Styles/ScreenReaderOnly';
import SpaceBetween from './Styles/SpaceBetween';
import Center from './Styles/Center';
import styled from 'styled-components';
//import { IoIosAddCircleOutline } from 'react-icons/io';

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
      <FormBox>
        <ScreenReaderOnly id="formSpan" Create your workout sessions />
        <form
          autoComplete="off"
          aria-labelledby="formSpan"
          onSubmit={handleSubmit}
        >
          <StyledDay>{day}</StyledDay>
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
            <label htmlFor={`muscle${day}`}>Muscle:</label>
            <Input
              id={`muscle${day}`}
              name="muscle"
              required
              maxlenght={20}
              type="text"
              placeholder="add ur muscle"
            />
          </SpaceBetween>
          <SpaceBetween>
            <label htmlFor={`exercise${day}`}>Exercise:</label>
            <Input
              id={`exercise${day}`}
              name="exercise"
              required
              maxlenght={20}
              type="text"
              placeholder="add ur exercise"
              //value=""
              //onChange={}
            />
          </SpaceBetween>
          <SpaceBetween>
            <label htmlFor={`weight${day}`}>Weight:</label>
            <Input
              id={`weight${day}`}
              name="weight"
              required
              maxlenght={5}
              type="text"
              placeholder="add your weight"
              //value=""
              //onChange={}
            />
          </SpaceBetween>
          <SpaceBetween>
            <label htmlFor={`repetitions${day}`}>Repetitions:</label>
            <Input
              id={`repetitions${day}`}
              name="repetitions"
              required
              maxlenght={2}
              type="text"
              placeholder="add your repetitions"
              //value=""
              //onChange={}
            />
          </SpaceBetween>
          <SpaceBetween>
            <label htmlFor={`sets${day}`}>Sets:</label>
            <Input
              id={`sets${day}`}
              name="sets"
              required
              maxlenght={2}
              type="text"
              placeholder="add your sets"
              //value=""
              //onChange={}
            />
          </SpaceBetween>
          <Center>
            <button type="submit">Save</button>
          </Center>
        </form>
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

const FormBox = styled.div`
  border: 1px solid lightgray;
  padding: 2px;
  margin: 5px 0 5px 0;
  border-radius: 5px;
`;

const Input = styled.input`
  width: 230px;
`;
