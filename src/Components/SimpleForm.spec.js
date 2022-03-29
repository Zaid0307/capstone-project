import { render, screen } from '@testing-library/react';
import SimpleForm from './SimpleForm';

describe('Header', () => {
  it('shows a logo and a title', () => {
    render(<SimpleForm />);

    const inputDay = screen.getByLabelText(/Enter Day/i);
    const inputMuscle = screen.getByLabelText(/Muscle/i);
    const inputExercise = screen.getByLabelText(/exercise/i);
    const inputWeight = screen.getByLabelText(/weight/i);
    const inputRepetitions = screen.getByLabelText(/repetitions/i);
    const inputSets = screen.getByLabelText(/sets/i);

    const submitButton = screen.getByRole('button', { name: /Click here/i });

    expect(inputDay).toBeInTheDocument();
    expect(inputMuscle).toBeInTheDocument();
    expect(inputExercise).toBeInTheDocument();
    expect(inputWeight).toBeInTheDocument();
    expect(inputRepetitions).toBeInTheDocument();
    expect(inputSets).toBeInTheDocument();

    expect(submitButton).toBeInTheDocument();
  });
});
