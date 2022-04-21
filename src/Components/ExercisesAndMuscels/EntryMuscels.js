import styled from 'styled-components';

export default function EntryMuscels({ handleActiveMuscle }) {
  return (
    <StyledDiv>
      <StyledRow>
        <Button onClick={() => handleActiveMuscle('chest')}>
          <img
            src="https://visualpharm.com/assets/331/Chest-595b40b65ba036ed117d38eb.svg"
            alt="chest"
            width="80"
          />
          Chest
        </Button>
        <Button onClick={() => handleActiveMuscle('back')}>
          <img
            src="https://visualpharm.com/assets/301/Bodybuilder-595b40b65ba036ed117d3784.svg"
            alt="back"
            width="80"
          />
          Back
        </Button>
      </StyledRow>
      <StyledRow>
        <Button onClick={() => handleActiveMuscle('abs')}>
          <img
            src="https://visualpharm.com/assets/875/Prelum-595b40b85ba036ed117da1a7.svg"
            alt="abs"
            width="80"
          />
          Abs
        </Button>
        <Button onClick={() => handleActiveMuscle('shoulders')}>
          <img
            src="https://visualpharm.com/assets/824/Shoulders-595b40b85ba036ed117da331.svg"
            alt="shoulders"
            width="80"
          />
          Shoulders
        </Button>
      </StyledRow>
      <StyledRow>
        <Button onClick={() => handleActiveMuscle('arms')}>
          <img
            src="https://visualpharm.com/assets/13/Flex%20Biceps-595b40b75ba036ed117d9cfe.svg"
            alt="arms"
            width="80"
          />
          Arms
        </Button>
        <Button onClick={() => handleActiveMuscle('legs')}>
          <img
            src="https://visualpharm.com/assets/568/Leg-595b40b75ba036ed117d9ee5.svg"
            alt="legs"
            width="80"
          />
          Legs
        </Button>
      </StyledRow>
    </StyledDiv>
  );
}

const StyledDiv = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 20px;
  background: radial-gradient(#85c1c7, #5e888c, #344b59);
`;

const Button = styled.button`
  display: inline-flex;
  flex-direction: column;
  border: none;
  outline: none;
  background-color: #d5dee8;
  box-shadow: rgba(0, 0, 0, 0.4) 0px 2px 4px,
    rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset;
  border-radius: 15px;
  padding: 5px;
`;

const StyledRow = styled.div`
  display: flex;
  gap: 20px;
`;
