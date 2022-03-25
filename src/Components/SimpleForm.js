import Exercise from "./Exercise";
import styled from "styled-components";
import ScreenReaderOnly from "./Styles/ScreenReaderOnly";
import SpaceBetween from "./Styles/SpaceBetween.js";

export default function SimpleForm() {
  return (
    <Box>
      <CreateWorkout>Create Workout</CreateWorkout>
      <form>
        <label>
          <ScreenReaderOnly>Enter Day</ScreenReaderOnly>
        </label>
        <input type="text" placeholder="Add workout day" />
        <SpaceBetween>
          <label>Muscle</label>
          <input type="text" placeholder="Add the muscles you want to train" />
        </SpaceBetween>
        <Exercise />
        <button>Create</button>
      </form>
    </Box>
  );
}

const CreateWorkout = styled.h2`
  display: flex;
  justify-content: center;
  border: 2px solid Black;
  margin-top: 0;
`;

const Box = styled.div`
  border: 1px solid Black;
  padding: 2px;
`;
