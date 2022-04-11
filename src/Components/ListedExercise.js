import styled from 'styled-components';
import SpaceBetween from './Styles/SpaceBetween';

export default function ListedExercise({ newCards }) {
  return (
    <StyledBox>
      <SpaceBetween>
        <p>Exercise:</p> <p>{newCards.exercise}</p>
      </SpaceBetween>
      <SpaceBetween>
        <p>Weight:</p> <p>{newCards.weight} Kg</p>
      </SpaceBetween>
      <SpaceBetween>
        <p>Repetitions:</p> <p>{newCards.repetitions}</p>
      </SpaceBetween>
      <SpaceBetween>
        <p>Sets:</p> <p>{newCards.sets}</p>
      </SpaceBetween>
    </StyledBox>
  );
}

const StyledBox = styled.div`
  border: 1px solid lightgray;
  padding: 2px;
  margin: 5px 0 5px 0;
  border-radius: 5px;
`;
