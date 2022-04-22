import img from '../Img/fitness.png';
import styled from 'styled-components';

export default function LandingPage({ handleLandingpage }) {
  return (
    <BackgroundImg>
      <TextContent>Create your Workoutplan</TextContent>

      <Button onClick={handleLandingpage}>Let´s Go</Button>
    </BackgroundImg>
  );
}

const BackgroundImg = styled.div`
  background-image: url(${img});
  background-size: cover;
  background-repeat: no-repeat;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
`;

const TextContent = styled.h1`
  text-align: center;
  color: white;
`;

const Button = styled.button`
  display: inline-flex;
  border: none;
  outline: none;
  border-radius: 5px;
  overflow: hidden;
  font-size: 1rem;
  font-weight: 500;
  padding: 5px;
  justify-content: center;
  width: 150px;
  background-color: #283a45;
  color: #d5dee8;
`;
