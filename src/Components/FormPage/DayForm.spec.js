import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DayForm from './DayForm';
import { renderWithProviders } from '../../test-utils';

function fillExercise({ muscle = 'Legs', exercise, weight, repetitions, sets }) {
  if (muscle) {
    userEvent.selectOptions(screen.getByLabelText(/muscle/i), muscle);
  }
  userEvent.type(screen.getByLabelText(/exercise:/i), exercise);
  userEvent.type(screen.getByLabelText(/weight/i), weight);
  userEvent.type(screen.getByLabelText(/repetitions/i), repetitions);
  userEvent.type(screen.getByLabelText(/sets/i), sets);
}

describe('DayForm', () => {
  beforeEach(() => localStorage.clear());

  it('shows empty fields, no muscle selected and an add button', () => {
    renderWithProviders(
      <DayForm day="monday" onAddExercise={jest.fn()} />
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

  it('adds an exercise, accepts decimal weights and keeps the muscle selected', () => {
    const onAddExercise = jest.fn();
    renderWithProviders(
      <DayForm day="monday" onAddExercise={onAddExercise} />
    );

    fillExercise({
      exercise: ' Squat ',
      weight: '12.5',
      repetitions: '10',
      sets: '3',
    });
    expect(screen.getByLabelText(/weight/i)).toBeValid();
    userEvent.click(screen.getByRole('button', { name: /add exercise/i }));

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

  it('does not add an exercise without a muscle', () => {
    const onAddExercise = jest.fn();
    renderWithProviders(
      <DayForm day="monday" onAddExercise={onAddExercise} />
    );

    fillExercise({
      muscle: null,
      exercise: 'Squat',
      weight: '20',
      repetitions: '10',
      sets: '3',
    });
    userEvent.click(screen.getByRole('button', { name: /add exercise/i }));

    expect(onAddExercise).not.toHaveBeenCalled();
  });

  it('lists the exercises of the day and removes one', () => {
    const onRemoveExercise = jest.fn();
    renderWithProviders(
      <DayForm
        day="monday"
        onAddExercise={jest.fn()}
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

    userEvent.click(
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

    function renderWithExercise(props = {}) {
      renderWithProviders(
        <DayForm
          day="monday"
          exercises={[benchPress]}
          onAddExercise={jest.fn()}
          onUpdateExercise={jest.fn()}
          onRemoveExercise={jest.fn()}
          {...props}
        />
      );
      userEvent.click(screen.getByRole('button', { name: /edit bench press/i }));
    }

    it('loads the exercise into the form and saves the changes', () => {
      const onUpdateExercise = jest.fn();
      const onAddExercise = jest.fn();
      renderWithExercise({ onUpdateExercise, onAddExercise });

      expect(screen.getByRole('combobox', { name: /muscle/i })).toHaveValue(
        'chest'
      );
      expect(screen.getByLabelText(/weight/i)).toHaveValue(60);
      userEvent.clear(screen.getByLabelText(/repetitions/i));
      userEvent.type(screen.getByLabelText(/repetitions/i), '10');
      userEvent.click(screen.getByRole('button', { name: /save exercise/i }));

      expect(onUpdateExercise).toHaveBeenCalledWith({
        ...benchPress,
        repetitions: '10',
      });
      expect(onAddExercise).not.toHaveBeenCalled();
      expect(
        screen.getByRole('button', { name: /add exercise/i })
      ).toBeInTheDocument();
    });

    it('can be cancelled', () => {
      const onUpdateExercise = jest.fn();
      renderWithExercise({ onUpdateExercise });

      userEvent.click(screen.getByRole('button', { name: /cancel/i }));

      expect(screen.getByLabelText(/exercise:/i)).toHaveValue('');
      expect(
        screen.queryByRole('button', { name: /save exercise/i })
      ).not.toBeInTheDocument();
      expect(onUpdateExercise).not.toHaveBeenCalled();
    });

    it('stops editing when the exercise is removed', () => {
      const onRemoveExercise = jest.fn();
      renderWithExercise({ onRemoveExercise });

      userEvent.click(
        screen.getByRole('button', { name: /remove bench press/i })
      );

      expect(onRemoveExercise).toHaveBeenCalledWith('e1');
      expect(
        screen.getByRole('button', { name: /add exercise/i })
      ).toBeInTheDocument();
    });
  });
});
