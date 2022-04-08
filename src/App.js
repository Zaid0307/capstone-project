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
      <Navigation />
    </GridWrap>
  );

  function createCard(newCard) {
    setData([...data, newCard]);
    navigate('/Workoutplans');
  }
}

const GridWrap = styled.div`
  display: grid;
  grid-template-rows: auto 48px;
  height: 100vh;
`;
