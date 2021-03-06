import { useState, useEffect } from 'react';
import styled from 'styled-components';

export default function NavEntryMuscels({ handleActiveMuscle, activeMuscle }) {
  const [isActive, setIsActive] = useState(activeMuscle);

  return (
    <Box>
      <Button onClick={() => window.location.reload()}>
        <img
          src="https://visualpharm.com/assets/638/Back-595b40b65ba036ed117d28f8.svg"
          alt="goBack"
          width="30"
        />
      </Button>
      <Button
        name="chest"
        onClick={() => {
          setIsActive('chest');
          handleActiveMuscle('chest');
        }}
        isActive={isActive === 'chest'}
      >
        <img
          src="https://visualpharm.com/assets/331/Chest-595b40b65ba036ed117d38eb.svg"
          alt="chest"
          width="30"
        />
      </Button>
      <Button
        onClick={() => {
          setIsActive('back');
          handleActiveMuscle('back');
        }}
        isActive={isActive === 'back'}
      >
        <img
          src="https://visualpharm.com/assets/301/Bodybuilder-595b40b65ba036ed117d3784.svg"
          alt="back"
          width="30"
        />
      </Button>
      <Button
        isActive={isActive === 'abs'}
        onClick={() => {
          setIsActive('abs');
          handleActiveMuscle('abs');
        }}
      >
        <img
          src="https://visualpharm.com/assets/875/Prelum-595b40b85ba036ed117da1a7.svg"
          alt="abs"
          width="30"
        />
      </Button>
      <Button
        isActive={isActive === 'shoulders'}
        onClick={() => {
          setIsActive('shoulders');
          handleActiveMuscle('shoulders');
        }}
      >
        <img
          src="https://visualpharm.com/assets/824/Shoulders-595b40b85ba036ed117da331.svg"
          alt="shoulders"
          width="30"
        />
      </Button>
      <Button
        isActive={isActive === 'arms'}
        onClick={() => {
          setIsActive('arms');
          handleActiveMuscle('arms');
        }}
      >
        <img
          src="https://visualpharm.com/assets/13/Flex%20Biceps-595b40b75ba036ed117d9cfe.svg"
          alt="arms"
          width="30"
        />
      </Button>
      <Button
        isActive={isActive === 'legs'}
        onClick={() => {
          setIsActive('legs');
          handleActiveMuscle('legs');
        }}
      >
        <img
          src="https://visualpharm.com/assets/568/Leg-595b40b75ba036ed117d9ee5.svg"
          alt="legs"
          width="30"
        />
      </Button>
    </Box>
  );
}

const Button = styled.button`
  display: inline-flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: ${props => (props.isActive ? '#d5dee8' : 'transparent')};
  border-radius: 15px;
  border: none;
  outline: none;
  color: #283a45;
  width: 100%;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 6px -1px,
    rgba(0, 0, 0, 0.06) 0px 2px 4px -1px;
`;

const Box = styled.div`
  position: sticky;
  top: 0;
  width: 100%;
  height: 48px;
  display: flex;
  justify-content: space-between;
  padding: 5px;
  margin: 5px;
  background-color: #496b73;
`;
