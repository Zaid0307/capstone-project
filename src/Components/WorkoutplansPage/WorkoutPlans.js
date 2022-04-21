import styled from 'styled-components';
import { BiShow } from 'react-icons/bi';
import { BiHide } from 'react-icons/bi';
import { useState } from 'react';
import WorkoutPlanDay from './WorkoutPlanDay';

export default function WorkoutPlans({ item, handleDelete }) {
  const [showTitle, setShowTitle] = useState(false);

  return (
    <WorkoutBox>
      <Day>
        <StyledCenterBox>
          <p>{item.nameOfWorkout}</p>
          <button onClick={handleDelete}>delete</button>
          <Button onClick={() => setShowTitle(!showTitle)}>
            {showTitle ? <BiHide /> : <BiShow />}
          </Button>
        </StyledCenterBox>
        {showTitle ? <WorkoutPlanDay item={item} /> : null}
      </Day>
    </WorkoutBox>
  );
}
const Day = styled.div`
  margin: 10px;
  width: 100%;
`;

const StyledCenterBox = styled.div`
  display: flex;
  background-color: #5e888c;
  color: #283a45;
  width: 100%;
  justify-content: center;
  box-shadow: rgba(0, 0, 0, 0.45) 0px 25px 20px -20px;
  padding: 5px;
  border-radius: 15px;
`;

const WorkoutBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 15px;
  margin: 0 15px 15px 15px;
  padding: 5px;
  margin: 15px 10px;
  background-color: #d5dee8;
  box-shadow: rgba(0, 0, 0, 0.56) 0px 22px 70px 4px;
`;

const Button = styled.button`
  text-decoration: none;
  background-color: transparent;
  border: none;
  outline: none;
  position: absolute;
  right: 40px;
  color: #283a45;
`;
