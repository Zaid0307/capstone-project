import styled from "styled-components";
import SpaceBetween from "./Styles/SpaceBetween.js";

export default function Exercise() {
  return (
    <StyledBox>
      <SpaceBetween>
        <label>Exercise</label>
        <input type="text" placeholder="add ur exercise" />
      </SpaceBetween>
      <SpaceBetween>
        <label>Weight</label>
        <input type="text" placeholder="add ur weight" />
      </SpaceBetween>
      <SpaceBetween>
        <label>Repetitions</label>
        <input type="text" placeholder="add ur repetitions" />
      </SpaceBetween>
      <SpaceBetween>
        <label>Sets</label>
        <input type="text" placeholder="add ur sets" />
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
