import styled from "styled-components";
import SpaceBetween from "./Styles/SpaceBetween";

export default function Exercise() {
  return (
    <StyledBox>
      <SpaceBetween>
        <label htmlFor="exercise">Exercise</label>
        <input
          name="exercise"
          required
          maxlength="20"
          id="exercise"
          type="text"
          placeholder="add ur exercise"
        />
      </SpaceBetween>
      <SpaceBetween>
        <label htmlFor="weight">Weight</label>
        <input
          name="weight"
          required
          maxlength="20"
          id="weight"
          type="text"
          placeholder="add ur weight"
        />
      </SpaceBetween>
      <SpaceBetween>
        <label htmlFor="repetitions">Repetitions</label>
        <input
          name="repetitions"
          required
          maxLength="20"
          id="repetitions"
          type="text"
          placeholder="add ur repetitions"
        />
      </SpaceBetween>
      <SpaceBetween>
        <label htmlFor="sets">Sets</label>
        <input
          name="sets"
          required
          maxlength="20"
          id="sets"
          type="text"
          placeholder="add ur sets"
        />
      </SpaceBetween>
    </StyledBox>
  );
}

const StyledBox = styled.div`
  display: flex;
  flex-direction: column;
  box-shadow: rgba(0, 0, 0, 0.05) 0px 0px 0px 1px,
    rgb(209, 213, 219) 0px 0px 0px 1px inset;
`;
