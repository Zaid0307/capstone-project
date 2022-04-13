import SpaceBetween from '../Styles/SpaceBetween';
import styled from 'styled-components';

export default function WorkoutplanExersice({ muscle }) {
  return (
    <>
      {muscle.exercises.map(function (info, index) {
        return (
          <StyledTest key={`info${index}`}>
            <SpaceBetween>
              <p>Exercise:</p>
              <p>{info.exercise}</p>
            </SpaceBetween>
            <SpaceBetween>
              <p>Weight:</p>
              <p>{info.weight} K.g.</p>
            </SpaceBetween>
            <SpaceBetween>
              <p>Repetitions:</p>
              <p>{info.repetitions}</p>
            </SpaceBetween>
            <SpaceBetween>
              <p>Sets:</p>
              <p>{info.sets}</p>
            </SpaceBetween>
          </StyledTest>
        );
      })}
    </>
  );
}

const StyledTest = styled.div`
  border: 1px solid snow;
  border-radius: 15px;
  padding: 5px;
`;
