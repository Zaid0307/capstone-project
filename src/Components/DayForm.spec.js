import { render, screen } from '@testing-library/react';
import DayForm from './DayForm';

describe('DayForm', () => {
  it('Show 5 empty input fields with the Type (Text) and one Submit Button', () => {
    render(<DayForm />);

    const inputMuscle = screen.getByLabelText(/Muscle/i);
    const inputExercise = screen.getByLabelText(/exercise/i);
    const inputWeight = screen.getByLabelText(/weight/i);
    const inputRepetitions = screen.getByLabelText(/repetitions/i);
    const inputSets = screen.getByLabelText(/sets/i);
    const submitButton = screen.getByRole('button', {
      name: /Save/i,
    });

    expect(inputMuscle).toBeInTheDocument();
    expect(inputMuscle).toHaveAttribute('type', 'text');
    expect(inputMuscle).toHaveValue('');
    expect(inputExercise).toBeInTheDocument();
    expect(inputExercise).toHaveAttribute('type', 'text');
    expect(inputExercise).toHaveValue('');
    expect(inputWeight).toBeInTheDocument();
    expect(inputWeight).toHaveAttribute('type', 'text');
    expect(inputWeight).toHaveValue('');
    expect(inputRepetitions).toBeInTheDocument();
    expect(inputRepetitions).toHaveAttribute('type', 'text');
    expect(inputRepetitions).toHaveValue('');
    expect(inputSets).toBeInTheDocument();
    expect(inputSets).toHaveAttribute('type', 'text');
    expect(inputSets).toHaveValue('');

    expect(submitButton).toBeInTheDocument();
  });
});
