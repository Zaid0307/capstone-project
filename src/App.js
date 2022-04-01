import { Routes, Route, useNavigate } from 'react-router-dom';
import Navigation from './Components/Navigation';
import WorkoutplansPage from './Pages/WorkoutplansPage';
import styled from 'styled-components';
import { useLocalStorage } from 'usehooks-ts';
import SimpleForm from './Components/SimpleForm';

export default function App() {
  const [data, setData] = useLocalStorage('data', []);
  const navigate = useNavigate();

  return (
    <div>
      <Routes>
        <Route path="/" element={<SimpleForm onCreateCards={createCards} />} />
        <Route
          path="/Workoutplans"
          element={<WorkoutplansPage data={data} />}
        />
      </Routes>
      <FixedBox>
        <Navigation />
      </FixedBox>
    </div>
  );

  function createCards(newCards) {
    setData([...data, ...newCards]);
    navigate('/Workoutplans');
  }
}

const FixedBox = styled.div`
  position: fixed;
  bottom: 0;
  width: 100%;
`;
