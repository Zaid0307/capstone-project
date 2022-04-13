import styled from 'styled-components';
import WorkoutPlans from '../Components/WorkoutplansPage/WorkoutPlans';
import { BsPlusCircle } from 'react-icons/bs';
import Center from '../Components/Styles/Center';
import { useNavigate } from 'react-router-dom';

export default function WorkoutplansPage({ data }) {
  const navigate = useNavigate();

  function handleCreateWorkout() {
    navigate('/');
  }
  return (
    <Background>
      {data.map(function (item, index) {
        return (
          <div key={`plan${index}`}>
            <WorkoutPlans item={item} />
          </div>
        );
      })}
      <Center>
        <Button onClick={handleCreateWorkout}>
          <span>
            <BsPlusCircle size={20} />
          </span>
          <span>Create new Workoutplan</span>
        </Button>
      </Center>
    </Background>
  );
}

const Background = styled.div`
  background: radial-gradient(#85c1c7, #5e888c, #344b59);
  height: 100%;
`;

const Button = styled.button`
  text-decoration: none;
  background-color: transparent;
  border: none;
  outline: none;
  display: flex;
  border: 1px solid;
  border-radius: 15px;
  gap: 5px;
  padding: 5px;
  box-shadow: rgba(0, 0, 0, 0.17) 0px -23px 25px 0px inset,
    rgba(0, 0, 0, 0.15) 0px -36px 30px 0px inset,
    rgba(0, 0, 0, 0.1) 0px -79px 40px 0px inset, rgba(0, 0, 0, 0.06) 0px 2px 1px,
    rgba(0, 0, 0, 0.09) 0px 4px 2px, rgba(0, 0, 0, 0.09) 0px 8px 4px,
    rgba(0, 0, 0, 0.09) 0px 16px 8px, rgba(0, 0, 0, 0.09) 0px 32px 16px;
`;
