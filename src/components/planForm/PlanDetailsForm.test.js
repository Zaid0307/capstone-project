import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PlanDetailsForm from './PlanDetailsForm';
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

describe('PlanDetailsForm', () => {
  beforeEach(() => localStorage.clear());

  it('shows a name field, 7 unchecked day checkboxes, a description and a submit button', () => {
    renderWithProviders(<PlanDetailsForm onSubmit={jest.fn()} />);

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

    expect(screen.getByRole('button', { name: /next/i })).toHaveAttribute(
      'type',
      'submit'
    );
  });

  it('submits the plan with the days in week order', () => {
    const onSubmit = jest.fn();
    renderWithProviders(<PlanDetailsForm onSubmit={onSubmit} />);

    userEvent.type(screen.getByLabelText(/Workout plan name/i), ' Push Pull ');
    userEvent.type(screen.getByLabelText(/description/i), 'Three days');
    userEvent.click(screen.getByLabelText(/friday/i));
    userEvent.click(screen.getByLabelText(/monday/i));
    userEvent.click(screen.getByLabelText(/wednesday/i));
    userEvent.click(screen.getByLabelText(/wednesday/i));
    userEvent.click(screen.getByRole('button', { name: /next/i }));

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
    renderWithProviders(<PlanDetailsForm onSubmit={onSubmit} />);

    userEvent.type(screen.getByLabelText(/Workout plan name/i), '   ');
    userEvent.click(screen.getByLabelText(/monday/i));
    userEvent.click(screen.getByRole('button', { name: /next/i }));

    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('does not submit without a training day and shows a hint', () => {
    const onSubmit = jest.fn();
    renderWithProviders(<PlanDetailsForm onSubmit={onSubmit} />);

    userEvent.type(screen.getByLabelText(/Workout plan name/i), 'Push');
    userEvent.click(screen.getByRole('button', { name: /next/i }));

    expect(onSubmit).not.toHaveBeenCalled();
    expect(screen.getByRole('alert')).toHaveTextContent(
      /at least one training day/i
    );

    userEvent.click(screen.getByLabelText(/monday/i));
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('is prefilled when editing and keeps the ids', () => {
    const onSubmit = jest.fn();
    renderWithProviders(
      <PlanDetailsForm
        onSubmit={onSubmit}
        isEditing
        initialDetails={{
          id: 'plan1',
          nameOfWorkout: 'Push',
          description: 'Chest day',
          days: [
            { id: 'day-mon', day: 'monday' },
            { id: 'day-thu', day: 'thursday' },
          ],
        }}
      />
    );

    expect(
      screen.getByRole('heading', { name: /edit your workout plan/i })
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/Workout plan name/i)).toHaveValue('Push');
    expect(screen.getByLabelText(/description/i)).toHaveValue('Chest day');
    expect(screen.getByLabelText(/monday/i)).toBeChecked();
    expect(screen.getByLabelText(/thursday/i)).toBeChecked();
    expect(screen.getByLabelText(/friday/i)).not.toBeChecked();

    userEvent.click(screen.getByLabelText(/thursday/i));
    userEvent.click(screen.getByLabelText(/sunday/i));
    userEvent.click(screen.getByRole('button', { name: /next/i }));

    const plan = onSubmit.mock.calls[0][0];
    expect(plan.id).toBe('plan1');
    expect(plan.days[0]).toEqual({ id: 'day-mon', day: 'monday' });
    expect(plan.days[1].day).toBe('sunday');
    expect(plan.days[1].id).not.toBe('day-thu');
  });

  it('is shown in German', () => {
    renderWithProviders(<PlanDetailsForm onSubmit={jest.fn()} />, {
      language: 'de',
    });

    expect(screen.getByLabelText(/Name des Trainingsplans/i)).toBeInTheDocument();
    expect(screen.getByLabelText('Montag')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Weiter' })
    ).toBeInTheDocument();
  });
});
