import { render, screen } from '@testing-library/react';
import CreateForm from './CreateForm';

describe('CreateForm', () => {
  it('shows 2 input fields with the type (text), 7 checkboxes with the txpe (checkbox) and the default value (false). Show one Submit Button', () => {
    render(<CreateForm />);

    const inputTitle = screen.getByLabelText(/Workout plan name/i);
    const checkboxMonday = screen.getByLabelText(/monday/i);
    const checkboxTuseday = screen.getByLabelText(/tuseday/i);
    const checkboxWednesday = screen.getByLabelText(/wednesday/i);
    const checkboxThursday = screen.getByLabelText(/thursday/i);
    const checkboxFriday = screen.getByLabelText(/friday/i);
    const checkboxSaturday = screen.getByLabelText(/saturday/i);
    const checkboxSunday = screen.getByLabelText(/sunday/i);
    const inputDescription = screen.getByLabelText(/description/i);
    const submitButton = screen.getByRole('button', {
      name: /Create Workout Plan/i,
    });

    expect(inputTitle).toBeInTheDocument();
    expect(inputTitle).toHaveAttribute('type', 'text');
    expect(inputTitle).toHaveValue('');
    expect(checkboxMonday).toBeInTheDocument();
    expect(checkboxMonday).toHaveAttribute('type', 'checkbox');
    expect(checkboxMonday.checked).toEqual(false);
    expect(checkboxTuseday).toBeInTheDocument();
    expect(checkboxTuseday).toHaveAttribute('type', 'checkbox');
    expect(checkboxTuseday.checked).toEqual(false);
    expect(checkboxWednesday).toBeInTheDocument();
    expect(checkboxWednesday).toHaveAttribute('type', 'checkbox');
    expect(checkboxWednesday.checked).toEqual(false);
    expect(checkboxThursday).toBeInTheDocument();
    expect(checkboxThursday).toHaveAttribute('type', 'checkbox');
    expect(checkboxThursday.checked).toEqual(false);
    expect(checkboxFriday).toBeInTheDocument();
    expect(checkboxFriday).toHaveAttribute('type', 'checkbox');
    expect(checkboxFriday.checked).toEqual(false);
    expect(checkboxSaturday).toBeInTheDocument();
    expect(checkboxSaturday).toHaveAttribute('type', 'checkbox');
    expect(checkboxSaturday.checked).toEqual(false);
    expect(checkboxSunday).toBeInTheDocument();
    expect(checkboxSunday).toHaveAttribute('type', 'checkbox');
    expect(checkboxSunday.checked).toEqual(false);
    expect(inputDescription).toBeInTheDocument();
    expect(inputDescription).toHaveAttribute('type', 'text');
    expect(inputTitle).toHaveValue('');

    expect(submitButton).toBeInTheDocument();
  });
});
