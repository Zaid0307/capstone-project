import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DayExercisesForm from './DayExercisesForm';
import { renderWithProviders } from '../../test-utils';

async function fillExercise({ muscle = 'Legs', exercise, weight, repetitions, sets }) {
  if (muscle) {
    await userEvent.selectOptions(screen.getByLabelText(/muscle/i), muscle);
  }
  await userEvent.type(screen.getByLabelText(/exercise:/i), exercise);
  await userEvent.type(screen.getByLabelText(/weight/i), weight);
  await userEvent.type(screen.getByLabelText(/repetitions/i), repetitions);
  await userEvent.type(screen.getByLabelText(/sets/i), sets);
}

describe('DayExercisesForm', () => {
  beforeEach(() => localStorage.clear());

  it('shows empty fields, no muscle selected and an add button', async () => {
    renderWithProviders(
      <DayExercisesForm day="monday" onAddExercise={vi.fn()} />
    );

    const inputMuscle = screen.getByRole('combobox', { name: /muscle/i });
    expect(inputMuscle).toHaveValue('');
    expect(inputMuscle).toBeRequired();
    expect(screen.getByLabelText(/exercise:/i)).toHaveValue('');
    expect(screen.getByLabelText(/weight/i)).toHaveAttribute('type', 'number');
    expect(screen.getByLabelText(/repetitions/i)).toHaveAttribute(
      'type',
      'number'
    );
    expect(screen.getByLabelText(/sets/i)).toHaveAttribute('type', 'number');
    expect(screen.getByText(/no exercises added yet/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /add exercise/i })
    ).toBeInTheDocument();
  });

  it('adds an exercise, accepts decimal weights and keeps the muscle selected', async () => {
    const onAddExercise = vi.fn();
    renderWithProviders(
      <DayExercisesForm day="monday" onAddExercise={onAddExercise} />
    );

    await fillExercise({
      exercise: ' Squat ',
      weight: '12.5',
      repetitions: '10',
      sets: '3',
    });
    expect(screen.getByLabelText(/weight/i)).toBeValid();
    await userEvent.click(screen.getByRole('button', { name: /add exercise/i }));

    expect(onAddExercise).toHaveBeenCalledWith({
      id: expect.any(String),
      muscle: 'legs',
      exercise: 'Squat',
      weight: '12.5',
      repetitions: '10',
      sets: '3',
    });
    expect(screen.getByLabelText(/exercise:/i)).toHaveValue('');
    expect(screen.getByRole('combobox', { name: /muscle/i })).toHaveValue(
      'legs'
    );
  });

  it('does not add an exercise without a muscle', async () => {
    const onAddExercise = vi.fn();
    renderWithProviders(
      <DayExercisesForm day="monday" onAddExercise={onAddExercise} />
    );

    await fillExercise({
      muscle: null,
      exercise: 'Squat',
      weight: '20',
      repetitions: '10',
      sets: '3',
    });
    await userEvent.click(screen.getByRole('button', { name: /add exercise/i }));

    expect(onAddExercise).not.toHaveBeenCalled();
  });

  it('lists the exercises of the day and removes one', async () => {
    const onRemoveExercise = vi.fn();
    renderWithProviders(
      <DayExercisesForm
        day="monday"
        onAddExercise={vi.fn()}
        onRemoveExercise={onRemoveExercise}
        exercises={[
          {
            id: 'e1',
            muscle: 'chest',
            exercise: 'Bench Press',
            weight: '60',
            repetitions: '8',
            sets: '4',
          },
        ]}
      />
    );

    const list = screen.getByRole('list', { name: /monday/i });
    expect(within(list).getByText('Bench Press')).toBeInTheDocument();
    expect(within(list).getByText('Chest')).toBeInTheDocument();

    await userEvent.click(
      screen.getByRole('button', { name: /remove bench press/i })
    );
    expect(onRemoveExercise).toHaveBeenCalledWith('e1');
  });

  describe('editing an exercise', () => {
    const benchPress = {
      id: 'e1',
      muscle: 'chest',
      exercise: 'Bench Press',
      weight: '60',
      repetitions: '8',
      sets: '4',
    };

    async function renderWithExercise(props = {}) {
      renderWithProviders(
        <DayExercisesForm
          day="monday"
          exercises={[benchPress]}
          onAddExercise={vi.fn()}
          onUpdateExercise={vi.fn()}
          onRemoveExercise={vi.fn()}
          {...props}
        />
      );
      await userEvent.click(screen.getByRole('button', { name: /edit bench press/i }));
    }

    it('loads the exercise into the form and saves the changes', async () => {
      const onUpdateExercise = vi.fn();
      const onAddExercise = vi.fn();
      await renderWithExercise({ onUpdateExercise, onAddExercise });

      expect(screen.getByRole('combobox', { name: /muscle/i })).toHaveValue(
        'chest'
      );
      expect(screen.getByLabelText(/weight/i)).toHaveValue(60);
      await userEvent.clear(screen.getByLabelText(/repetitions/i));
      await userEvent.type(screen.getByLabelText(/repetitions/i), '10');
      await userEvent.click(screen.getByRole('button', { name: /save exercise/i }));

      expect(onUpdateExercise).toHaveBeenCalledWith({
        ...benchPress,
        repetitions: '10',
      });
      expect(onAddExercise).not.toHaveBeenCalled();
      expect(
        screen.getByRole('button', { name: /add exercise/i })
      ).toBeInTheDocument();
    });

    it('can be cancelled', async () => {
      const onUpdateExercise = vi.fn();
      await renderWithExercise({ onUpdateExercise });

      await userEvent.click(screen.getByRole('button', { name: /cancel/i }));

      expect(screen.getByLabelText(/exercise:/i)).toHaveValue('');
      expect(
        screen.queryByRole('button', { name: /save exercise/i })
      ).not.toBeInTheDocument();
      expect(onUpdateExercise).not.toHaveBeenCalled();
    });

    it('stops editing when the exercise is removed', async () => {
      const onRemoveExercise = vi.fn();
      await renderWithExercise({ onRemoveExercise });

      await userEvent.click(
        screen.getByRole('button', { name: /remove bench press/i })
      );

      expect(onRemoveExercise).toHaveBeenCalledWith('e1');
      expect(
        screen.getByRole('button', { name: /add exercise/i })
      ).toBeInTheDocument();
    });
  });
});
