import styled from 'styled-components';
import WorkoutPlans from '../Components/WorkoutPlans';

export default function WorkoutplansPage({ data }) {
  return (
    <Background>
      {data.map(function (item, index) {
        return (
          <>
            <div key={`plan${index}`}>
              <WorkoutPlans item={item} />
            </div>
          </>
        );
      })}
    </Background>
  );
}

const Background = styled.div`
  background: radial-gradient(#07080d, #5e888c, #344b59);
  height: 100%;
`;
