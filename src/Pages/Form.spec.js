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
    const onAddWorkoutPlan = jest.fn();
    renderWithProviders(<Form onAddWorkoutPlan={onAddWorkoutPlan} />);

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

    expect(onAddWorkoutPlan).toHaveBeenCalledTimes(1);
    const plan = onAddWorkoutPlan.mock.calls[0][0];
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
    const onAddWorkoutPlan = jest.fn();
    renderWithProviders(<Form onAddWorkoutPlan={onAddWorkoutPlan} />);

    createPlan('Push', ['Monday', 'Friday']);
    addExercise('Monday', {
      muscle: 'Chest',
      exercise: 'Bench Press',
      weight: '60',
      repetitions: '8',
      sets: '4',
    });
    userEvent.click(screen.getByRole('button', { name: /save workout plan/i }));

    expect(onAddWorkoutPlan).not.toHaveBeenCalled();
    expect(screen.getByRole('alert')).toHaveTextContent(
      'Add at least one exercise for: Friday'
    );
  });

  it('removes an exercise before saving', () => {
    const onAddWorkoutPlan = jest.fn();
    renderWithProviders(<Form onAddWorkoutPlan={onAddWorkoutPlan} />);

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

    const [monday] = onAddWorkoutPlan.mock.calls[0][0].days;
    expect(monday.muscles[0].exercises.map(e => e.exercise)).toEqual([
      'Bench Press',
    ]);
  });
});
