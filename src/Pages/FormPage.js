import SimpleForm from '../Components/SimpleForm';
import ExerciseInputs from '../Components/ExerciseInputs';

export default function FormPage({ onCreateCard }) {
  return (
    <>
      <SimpleForm onCreateCard={onCreateCard} />
    </>
  );
}
