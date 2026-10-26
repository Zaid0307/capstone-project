import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CreateForm from './CreateForm';
import { renderWithProviders } from '../../test-utils';

const WEEKDAY_LABELS = [
  /monday/i,
  /tuesday/i,
  /wednesday/i,
  /thursday/i,
  /friday/i,
  /saturday/i,
  /sunday/i,
];

describe('CreateForm', () => {
  beforeEach(() => localStorage.clear());

  it('shows a name field, 7 unchecked day checkboxes, a description and a submit button', () => {
    renderWithProviders(<CreateForm onSubmit={jest.fn()} />);

    const inputTitle = screen.getByLabelText(/Workout plan name/i);
    expect(inputTitle).toHaveAttribute('type', 'text');
    expect(inputTitle).toHaveValue('');
    expect(inputTitle).toBeRequired();

    WEEKDAY_LABELS.forEach(label => {
      const checkbox = screen.getByLabelText(label);
      expect(checkbox).toHaveAttribute('type', 'checkbox');
      expect(checkbox).not.toBeChecked();
    });

    const inputDescription = screen.getByLabelText(/description/i);
    expect(inputDescription).toHaveAttribute('type', 'text');
    expect(inputDescription).not.toBeRequired();

    expect(screen.getByRole('button', { name: /create/i })).toHaveAttribute(
      'type',
      'submit'
    );
  });

  it('submits the plan with the days in week order', () => {
    const onSubmit = jest.fn();
    renderWithProviders(<CreateForm onSubmit={onSubmit} />);

    userEvent.type(screen.getByLabelText(/Workout plan name/i), ' Push Pull ');
    userEvent.type(screen.getByLabelText(/description/i), 'Three days');
    userEvent.click(screen.getByLabelText(/friday/i));
    userEvent.click(screen.getByLabelText(/monday/i));
    userEvent.click(screen.getByLabelText(/wednesday/i));
    userEvent.click(screen.getByLabelText(/wednesday/i));
    userEvent.click(screen.getByRole('button', { name: /create/i }));

    expect(onSubmit).toHaveBeenCalledTimes(1);
    const plan = onSubmit.mock.calls[0][0];
    expect(plan).toMatchObject({
      nameOfWorkout: 'Push Pull',
      description: 'Three days',
    });
    expect(plan.id).toEqual(expect.any(String));
    expect(plan.days.map(({ day }) => day)).toEqual(['monday', 'friday']);
    expect(new Set(plan.days.map(({ id }) => id)).size).toBe(2);
  });

  it('does not submit without a name', () => {
    const onSubmit = jest.fn();
    renderWithProviders(<CreateForm onSubmit={onSubmit} />);

    userEvent.type(screen.getByLabelText(/Workout plan name/i), '   ');
    userEvent.click(screen.getByLabelText(/monday/i));
    userEvent.click(screen.getByRole('button', { name: /create/i }));

    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('does not submit without a training day and shows a hint', () => {
    const onSubmit = jest.fn();
    renderWithProviders(<CreateForm onSubmit={onSubmit} />);

    userEvent.type(screen.getByLabelText(/Workout plan name/i), 'Push');
    userEvent.click(screen.getByRole('button', { name: /create/i }));

    expect(onSubmit).not.toHaveBeenCalled();
    expect(screen.getByRole('alert')).toHaveTextContent(
      /at least one training day/i
    );

    userEvent.click(screen.getByLabelText(/monday/i));
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('is shown in German', () => {
    renderWithProviders(<CreateForm onSubmit={jest.fn()} />, {
      language: 'de',
    });

    expect(screen.getByLabelText(/Name des Trainingsplans/i)).toBeInTheDocument();
    expect(screen.getByLabelText('Montag')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Erstellen' })
    ).toBeInTheDocument();
  });
});
