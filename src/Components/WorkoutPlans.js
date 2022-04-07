import styled from 'styled-components';
import SpaceBetween from './Styles/SpaceBetween';

export default function WorkoutPlans({ item }) {
  return (
    <WorkoutBox>
      <NameOfWorkoutplan>{item.nameOfWorkout}</NameOfWorkoutplan>
      <Day>{item.days[0].day}</Day>
      <SpaceBetween>
        <Muscle>Muscle</Muscle>
        <ItemMuscle>{item.days[0].muscle}</ItemMuscle>
      </SpaceBetween>
      <StyledBox>
        <SpaceBetween>
          <p>Exercise</p>
          <p>{item.days[0].exercise}</p>
        </SpaceBetween>
        <SpaceBetween>
          <p>Weight</p>
          <p>{item.days[0].weight} Kg</p>
        </SpaceBetween>
        <SpaceBetween>
          <p>Repetitions</p>
          <p>{item.days[0].repetitions}</p>
        </SpaceBetween>
        <SpaceBetween>
          <p>Sets</p>
          <p>{item.days[0].sets}</p>
        </SpaceBetween>
      </StyledBox>
    </WorkoutBox>
  );
}

const StyledBox = styled.div`
  display: flex;
  flex-direction: column;
  margin: 5px;
  box-shadow: rgba(0, 0, 0, 0.05) 0px 0px 0px 1px,
    rgb(209, 213, 219) 0px 0px 0px 1px inset;
  border-radius: 5px;
`;

const NameOfWorkoutplan = styled.h2`
  display: flex;
  justify-content: center;
  border: 2px solid Black;
  border-radius: 5px;
`;

const Day = styled.p`
  border-bottom: 1px solid lightgray;
  margin-left: 10px;
  margin-top: 5px;
`;

const Muscle = styled.p`
  margin-left: 5px;
`;

const ItemMuscle = styled.p`
  margin-right: 5px;
`;

const WorkoutBox = styled.div`
  margin-top: 10px;
  border: 1px solid gray;
  border-radius: 5px;
  padding: 2px;
`;
