import MusclesMap from './MusclesMap';
import styled from 'styled-components';

export default function WorkoutPlanMuscles({ day }) {
  return (
    <>
      {day.muscles.map(function (muscle, index) {
        return (
          <Card key={`muscle${index}`}>
            <MusclesMap muscle={muscle} />
          </Card>
        );
      })}
    </>
  );
}

const Card = styled.div`
  display: flex;
  flex-direction: column;
  box-shadow: rgba(14, 30, 37, 0.12) 0px 2px 4px 0px,
    rgba(14, 30, 37, 0.32) 0px 2px 16px 0px;
  border-radius: 15px;
  margin: 5px 0px 10px 0px;
  width: 95%;
`;
