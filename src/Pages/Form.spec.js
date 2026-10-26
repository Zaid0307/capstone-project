import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Form from './Form';
import { renderWithProviders } from '../test-utils';

function createPlan(name, days) {
  userEvent.type(screen.getByLabelText(/Workout plan name/i), name);
  days.forEach(day => userEvent.click(screen.getByLabelText(day)));
  userEvent.click(screen.getByRole('button', { name: /create/i }));
}

function addExercise(dayName, { muscle, exercise, weight, repetitions, sets }) {
  const dayForm = screen.getByRole('form', {
    name: new RegExp(`exercises for ${dayName}`, 'i'),
  });
  const form = within(dayForm);
  userEvent.selectOptions(form.getByLabelText(/muscle/i), muscle);
  userEvent.type(form.getByLabelText(/exercise:/i), exercise);
  userEvent.type(form.getByLabelText(/weight/i), weight);
  userEvent.type(form.getByLabelText(/repetitions/i), repetitions);
  userEvent.type(form.getByLabelText(/sets/i), sets);
  userEvent.click(form.getByRole('button', { name: /add exercise/i }));
}

describe('Form page', () => {
  beforeEach(() => localStorage.clear());

  it('creates a complete workout plan', () => {
    const onSave = jest.fn();
    renderWithProviders(<Form onSave={onSave} />);

    createPlan('Upper / Lower', ['Thursday', 'Monday']);

    expect(
      screen.getByRole('heading', { name: 'Upper / Lower' })
    ).toBeInTheDocument();
    const dayForms = screen.getAllByRole('form');
    expect(dayForms.map(form => form.getAttribute('aria-labelledby'))).toEqual(
      ['formSpanmonday', 'formSpanthursday']
    );

    addExercise('Monday', {
      muscle: 'Chest',
      exercise: 'Bench Press',
      weight: '60',
      repetitions: '8',
      sets: '4',
    });
    addExercise('Monday', {
      muscle: 'Arms',
      exercise: 'Curl',
      weight: '12.5',
      repetitions: '12',
      sets: '3',
    });
    addExercise('Thursday', {
      muscle: 'Legs',
      exercise: 'Squat',
      weight: '80',
      repetitions: '5',
      sets: '5',
    });

    userEvent.click(screen.getByRole('button', { name: /save workout plan/i }));

    expect(onSave).toHaveBeenCalledTimes(1);
    const plan = onSave.mock.calls[0][0];
    expect(plan.nameOfWorkout).toBe('Upper / Lower');
    expect(plan.days).toHaveLength(2);
    expect(plan.days[0]).toMatchObject({
      day: 'monday',
      muscles: [
        { name: 'chest', exercises: [{ exercise: 'Bench Press' }] },
        { name: 'arms', exercises: [{ exercise: 'Curl', weight: '12.5' }] },
      ],
    });
    expect(plan.days[1]).toMatchObject({
      day: 'thursday',
      muscles: [{ name: 'legs', exercises: [{ exercise: 'Squat' }] }],
    });
  });

  it('does not save while a day has no exercises', () => {
    const onSave = jest.fn();
    renderWithProviders(<Form onSave={onSave} />);

    createPlan('Push', ['Monday', 'Friday']);
    addExercise('Monday', {
      muscle: 'Chest',
      exercise: 'Bench Press',
      weight: '60',
      repetitions: '8',
      sets: '4',
    });
    userEvent.click(screen.getByRole('button', { name: /save workout plan/i }));

    expect(onSave).not.toHaveBeenCalled();
    expect(screen.getByRole('alert')).toHaveTextContent(
      'Add at least one exercise for: Friday'
    );
  });

  it('removes an exercise before saving', () => {
    const onSave = jest.fn();
    renderWithProviders(<Form onSave={onSave} />);

    createPlan('Push', ['Monday']);
    addExercise('Monday', {
      muscle: 'Chest',
      exercise: 'Bench Press',
      weight: '60',
      repetitions: '8',
      sets: '4',
    });
    addExercise('Monday', {
      muscle: 'Chest',
      exercise: 'Typo',
      weight: '1',
      repetitions: '1',
      sets: '1',
    });
    userEvent.click(screen.getByRole('button', { name: /remove typo/i }));
    userEvent.click(screen.getByRole('button', { name: /save workout plan/i }));

    const [monday] = onSave.mock.calls[0][0].days;
    expect(monday.muscles[0].exercises.map(e => e.exercise)).toEqual([
      'Bench Press',
    ]);
  });

  it('keeps the exercises when going back to change the days', () => {
    const onSave = jest.fn();
    renderWithProviders(<Form onSave={onSave} />);

    createPlan('Push', ['Monday']);
    addExercise('Monday', {
      muscle: 'Chest',
      exercise: 'Bench Press',
      weight: '60',
      repetitions: '8',
      sets: '4',
    });
    userEvent.click(screen.getByRole('button', { name: /edit name and days/i }));
    expect(screen.getByLabelText('Monday')).toBeChecked();
    userEvent.click(screen.getByLabelText('Friday'));
    userEvent.click(screen.getByRole('button', { name: /next/i }));

    addExercise('Friday', {
      muscle: 'Legs',
      exercise: 'Squat',
      weight: '80',
      repetitions: '5',
      sets: '5',
    });
    userEvent.click(screen.getByRole('button', { name: /save workout plan/i }));

    const plan = onSave.mock.calls[0][0];
    expect(plan.days.map(day => day.day)).toEqual(['monday', 'friday']);
    expect(plan.days[0].muscles[0].exercises[0].exercise).toBe('Bench Press');
  });
});

describe('Form page in edit mode', () => {
  const plan = {
    id: 'plan1',
    nameOfWorkout: 'Push',
    description: 'Chest day',
    days: [
      {
        id: 'day-mon',
        day: 'monday',
        muscles: [
          {
            id: 'm1',
            name: 'chest',
            exercises: [
              {
                id: 'e1',
                muscle: 'chest',
                exercise: 'Bench Press',
                weight: '60',
                repetitions: '8',
                sets: '4',
              },
            ],
          },
        ],
      },
      {
        id: 'day-thu',
        day: 'thursday',
        muscles: [
          {
            id: 'm2',
            name: 'arms',
            exercises: [
              {
                id: 'e2',
                muscle: 'arms',
                exercise: 'Curl',
                weight: '10',
                repetitions: '12',
                sets: '3',
              },
            ],
          },
        ],
      },
    ],
  };

  beforeEach(() => localStorage.clear());

  it('shows the saved exercises of every day', () => {
    renderWithProviders(<Form initialPlan={plan} onSave={jest.fn()} />);

    expect(screen.getByRole('heading', { name: 'Push' })).toBeInTheDocument();
    expect(
      within(screen.getByRole('list', { name: 'Monday' })).getByText(
        'Bench Press'
      )
    ).toBeInTheDocument();
    expect(
      within(screen.getByRole('list', { name: 'Thursday' })).getByText('Curl')
    ).toBeInTheDocument();
  });

  it('changes an exercise and keeps the ids of plan, days and exercises', () => {
    const onSave = jest.fn();
    renderWithProviders(<Form initialPlan={plan} onSave={onSave} />);

    userEvent.click(screen.getByRole('button', { name: /edit bench press/i }));
    const monday = within(
      screen.getByRole('form', { name: /exercises for monday/i })
    );
    expect(monday.getByLabelText(/exercise:/i)).toHaveValue('Bench Press');
    userEvent.clear(monday.getByLabelText(/weight/i));
    userEvent.type(monday.getByLabelText(/weight/i), '62.5');
    userEvent.click(monday.getByRole('button', { name: /save exercise/i }));
    userEvent.click(screen.getByRole('button', { name: /save changes/i }));

    const saved = onSave.mock.calls[0][0];
    expect(saved.id).toBe('plan1');
    expect(saved.description).toBe('Chest day');
    expect(saved.days.map(day => day.id)).toEqual(['day-mon', 'day-thu']);
    expect(saved.days[0].muscles[0].exercises).toEqual([
      {
        id: 'e1',
        muscle: 'chest',
        exercise: 'Bench Press',
        weight: '62.5',
        repetitions: '8',
        sets: '4',
      },
    ]);
  });

  it('changes name and days', () => {
    const onSave = jest.fn();
    renderWithProviders(<Form initialPlan={plan} onSave={onSave} />);

    userEvent.click(screen.getByRole('button', { name: /edit name and days/i }));
    expect(screen.getByLabelText(/Workout plan name/i)).toHaveValue('Push');
    userEvent.clear(screen.getByLabelText(/Workout plan name/i));
    userEvent.type(screen.getByLabelText(/Workout plan name/i), 'Push v2');
    userEvent.click(screen.getByLabelText('Thursday'));
    userEvent.click(screen.getByRole('button', { name: /next/i }));
    userEvent.click(screen.getByRole('button', { name: /save changes/i }));

    const saved = onSave.mock.calls[0][0];
    expect(saved.nameOfWorkout).toBe('Push v2');
    expect(saved.days.map(day => day.id)).toEqual(['day-mon']);
  });
});
