import { Routes, Route, useNavigate } from 'react-router-dom';
import Navigation from './Components/Navigation';
import FormPage from './Pages/FormPage';
import WorkoutplansPage from './Pages/WorkoutplansPage';
import styled from 'styled-components';
import { useLocalStorage } from 'usehooks-ts';

export default function App() {
  const [data, setData] = useLocalStorage('data', []);
  const navigate = useNavigate();

  return (
    <div>
      <Routes>
        <Route path="/" element={<FormPage onCreateCard={createCard} />} />
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

  function createCard(formData) {
    setData([...data, formData]);
    navigate('/Workoutplans');
  }
}

const FixedBox = styled.div`
  position: fixed;
  bottom: 0;
  width: 100%;
`;
