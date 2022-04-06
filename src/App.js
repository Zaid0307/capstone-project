import { Routes, Route, useNavigate } from 'react-router-dom';
import Navigation from './Components/Navigation';
import WorkoutplansPage from './Pages/WorkoutplansPage';
import styled from 'styled-components';
import { useLocalStorage } from 'usehooks-ts';
import Form from './Pages/Form';

export default function App() {
  const [data, setData] = useLocalStorage('data', []);

  const navigate = useNavigate();
  return (
    <GridWrap>
      <OverflowY>
        <Routes>
          <Route
            path="/"
            element={<Form onAddWorkoutPlan={createCard} />} /*path="/"
          element={<SimpleForm onCreateCards={createCards} />}*/
          />
          <Route
            path="/Workoutplans"
            element={<WorkoutplansPage data={data} />}
          />
        </Routes>
      </OverflowY>
      <FixedBox>
        <Navigation />
      </FixedBox>
    </GridWrap>
  );

  function createCard(newCard) {
    setData([...data, newCard]);
    navigate('/Workoutplans');
  }
}

const FixedBox = styled.div`
  position: fixed;
  bottom: 0;
  width: 100%;
`;

const GridWrap = styled.div`
  display: grid;
  grid-template-rows: auto 48px;
  height: 100vh;
`;

const OverflowY = styled.div`
  overflow-y: auto;
`;
