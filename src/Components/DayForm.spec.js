import { render, screen } from '@testing-library/react';
import DayForm from './DayForm';
import userEvent from '@testing-library/user-event';

describe('DayForm', () => {
  it('Show 5 empty input fields with the Type (Text) and one Submit Button', () => {
    render(<DayForm />);

    const inputMuscle = screen.getByRole('combobox', { name: /Muscle:/i });
    const inputExercise = screen.getByLabelText(/exercise/i);
    const inputWeight = screen.getByLabelText(/weight/i);
    const inputRepetitions = screen.getByLabelText(/repetitions/i);
    const inputSets = screen.getByLabelText(/sets/i);
    const addExerciseButton = screen.getByRole('button', {
      name: /add exercise/i,
    });

    expect(inputMuscle).toHaveValue('Arms');
    userEvent.selectOptions(inputMuscle, 'Legs');
    expect(inputMuscle).toHaveValue('Legs');
    expect(inputExercise).toBeInTheDocument();
    expect(inputExercise).toHaveAttribute('type', 'text');
    expect(inputExercise).toHaveValue('');
    expect(inputWeight).toBeInTheDocument();
    expect(inputWeight).toHaveAttribute('type', 'text');
    expect(inputWeight).toHaveValue('');
    expect(inputRepetitions).toBeInTheDocument();
    expect(inputRepetitions).toHaveAttribute('type', 'number');
    expect(inputSets).toBeInTheDocument();
    expect(inputSets).toHaveAttribute('type', 'number');

    expect(addExerciseButton).toBeInTheDocument();
  });
});
