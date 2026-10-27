import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PlanForm from './PlanForm';
import { renderWithProviders } from '../../test-utils';
import { PLAN_SCHEMA_VERSION } from '../../utils/workoutPlan';

async function createPlan(name, days) {
  await userEvent.type(screen.getByLabelText(/Workout plan name/i), name);
  for (const day of days) {
    await userEvent.click(screen.getByLabelText(day));
  }
  await userEvent.click(screen.getByRole('button', { name: /next/i }));
}

async function addExercise(dayName, { muscle, exercise, reps, sets, weight }) {
  const form = within(screen.getByRole('form', { name: new RegExp(`exercises for ${dayName}`, 'i') }));
  if (muscle) await userEvent.selectOptions(form.getByLabelText(/muscle/i), muscle);
  await userEvent.type(form.getByLabelText(/exercise:/i), exercise);
  await userEvent.type(form.getByLabelText(/repetitions from/i), reps);
  await userEvent.type(form.getByLabelText(/sets/i), sets);
  if (weight) await userEvent.type(form.getByLabelText(/weight/i), weight);
  await userEvent.click(form.getByRole('button', { name: /add exercise/i }));
}

const save = name => userEvent.click(screen.getByRole('button', { name }));

describe('PlanForm', () => {
  beforeEach(() => localStorage.clear());

  it('creates a complete workout plan', async () => {
    const onSave = vi.fn();
    renderWithProviders(<PlanForm onSave={onSave} />);

    await createPlan('Upper / Lower', ['Thursday', 'Monday']);

    expect(screen.getByRole('heading', { name: 'Upper / Lower' })).toBeInTheDocument();
    expect(screen.getAllByRole('form').map(form => form.getAttribute('aria-labelledby'))).toEqual([
      'dayExercises-monday',
      'dayExercises-thursday',
    ]);

    await addExercise('Monday', { exercise: 'Barbell bench press', reps: '8', sets: '4', weight: '60' });
    await addExercise('Monday', { muscle: 'Arms', exercise: 'My curl', reps: '12', sets: '3', weight: '12.5' });
    await addExercise('Thursday', { exercise: 'Barbell squat', reps: '5', sets: '5', weight: '80' });
    await save(/save workout plan/i);

    expect(onSave).toHaveBeenCalledTimes(1);
    const plan = onSave.mock.calls[0][0];
    expect(plan).toMatchObject({ nameOfWorkout: 'Upper / Lower', schemaVersion: PLAN_SCHEMA_VERSION });
    expect(plan.days[0]).toMatchObject({
      day: 'monday',
      entries: [
        { exerciseId: 'barbell_bench_press', muscle: 'chest', sets: 4, weight: 60 },
        { exerciseId: null, exercise: 'My curl', muscle: 'arms', weight: 12.5 },
      ],
    });
    expect(plan.days[1]).toMatchObject({
      day: 'thursday',
      entries: [{ exerciseId: 'barbell_squat', muscle: 'legs', dose: { unit: 'repetitions', min: 5, max: 5 } }],
    });
  });

  it('does not save while a day has no exercises', async () => {
    const onSave = vi.fn();
    renderWithProviders(<PlanForm onSave={onSave} />);

    await createPlan('Push', ['Monday', 'Friday']);
    await addExercise('Monday', { exercise: 'Push-up', reps: '10', sets: '3' });
    await save(/save workout plan/i);

    expect(onSave).not.toHaveBeenCalled();
    expect(screen.getByRole('alert')).toHaveTextContent('Add at least one exercise for: Friday');
  });

  it('removes an exercise before saving', async () => {
    const onSave = vi.fn();
    renderWithProviders(<PlanForm onSave={onSave} />);

    await createPlan('Push', ['Monday']);
    await addExercise('Monday', { exercise: 'Push-up', reps: '10', sets: '3' });
    await addExercise('Monday', { exercise: 'Typo', reps: '1', sets: '1' });
    await userEvent.click(screen.getByRole('button', { name: /remove typo/i }));
    await save(/save workout plan/i);

    const [monday] = onSave.mock.calls[0][0].days;
    expect(monday.entries.map(entry => entry.exerciseId)).toEqual(['push_up']);
  });

  it('keeps the exercises when going back to change the days', async () => {
    const onSave = vi.fn();
    renderWithProviders(<PlanForm onSave={onSave} />);

    await createPlan('Push', ['Monday']);
    await addExercise('Monday', { exercise: 'Push-up', reps: '10', sets: '3' });
    await userEvent.click(screen.getByRole('button', { name: /edit name and days/i }));
    expect(screen.getByLabelText('Monday')).toBeChecked();
    await userEvent.click(screen.getByLabelText('Friday'));
    await userEvent.click(screen.getByRole('button', { name: /next/i }));
    await addExercise('Friday', { exercise: 'Barbell squat', reps: '5', sets: '5' });
    await save(/save workout plan/i);

    const plan = onSave.mock.calls[0][0];
    expect(plan.days.map(day => day.day)).toEqual(['monday', 'friday']);
    expect(plan.days[0].entries[0].exerciseId).toBe('push_up');
  });
});

describe('PlanForm in edit mode', () => {
  // Saved by an older app version, so editing also migrates it.
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
            exercises: [{ id: 'e1', muscle: 'chest', exercise: 'Bench Press', weight: '60', repetitions: '8', sets: '4' }],
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
            exercises: [{ id: 'e2', muscle: 'arms', exercise: 'Curl', weight: '10', repetitions: '12', sets: '3' }],
          },
        ],
      },
    ],
  };

  beforeEach(() => localStorage.clear());

  it('shows the saved exercises of every day', () => {
    renderWithProviders(<PlanForm initialPlan={plan} onSave={vi.fn()} />);

    expect(screen.getByRole('heading', { name: 'Push' })).toBeInTheDocument();
    expect(within(screen.getByRole('list', { name: 'Monday' })).getByText('Bench Press')).toBeInTheDocument();
    expect(within(screen.getByRole('list', { name: 'Thursday' })).getByText('Curl')).toBeInTheDocument();
  });

  it('changes an exercise and keeps the ids of plan, days and exercises', async () => {
    const onSave = vi.fn();
    renderWithProviders(<PlanForm initialPlan={plan} onSave={onSave} />);

    await userEvent.click(screen.getByRole('button', { name: /edit bench press/i }));
    const monday = within(screen.getByRole('form', { name: /exercises for monday/i }));
    expect(monday.getByLabelText(/exercise:/i)).toHaveValue('Bench Press');
    await userEvent.clear(monday.getByLabelText(/weight/i));
    await userEvent.type(monday.getByLabelText(/weight/i), '62.5');
    await userEvent.click(monday.getByRole('button', { name: /save exercise/i }));
    await save(/save changes/i);

    const saved = onSave.mock.calls[0][0];
    expect(saved).toMatchObject({ id: 'plan1', description: 'Chest day', schemaVersion: PLAN_SCHEMA_VERSION });
    expect(saved.days.map(day => day.id)).toEqual(['day-mon', 'day-thu']);
    expect(saved.days[0].entries).toEqual([
      {
        id: 'e1',
        exerciseId: null,
        exercise: 'Bench Press',
        muscle: 'chest',
        sets: 4,
        dose: { unit: 'repetitions', min: 8, max: 8 },
        weight: 62.5,
        restSeconds: null,
      },
    ]);
  });

  it('changes name and days', async () => {
    const onSave = vi.fn();
    renderWithProviders(<PlanForm initialPlan={plan} onSave={onSave} />);

    await userEvent.click(screen.getByRole('button', { name: /edit name and days/i }));
    expect(screen.getByLabelText(/Workout plan name/i)).toHaveValue('Push');
    await userEvent.clear(screen.getByLabelText(/Workout plan name/i));
    await userEvent.type(screen.getByLabelText(/Workout plan name/i), 'Push v2');
    await userEvent.click(screen.getByLabelText('Thursday'));
    await userEvent.click(screen.getByRole('button', { name: /next/i }));
    await save(/save changes/i);

    const saved = onSave.mock.calls[0][0];
    expect(saved.nameOfWorkout).toBe('Push v2');
    expect(saved.days.map(day => day.id)).toEqual(['day-mon']);
  });
});
