import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DayExercisesForm from './DayExercisesForm';
import { renderWithProviders } from '../../test-utils';

const field = label => screen.getByLabelText(label);

function renderForm(props = {}, options) {
  const handlers = { onAddEntry: vi.fn(), onUpdateEntry: vi.fn(), onRemoveEntry: vi.fn() };
  const view = renderWithProviders(<DayExercisesForm day="monday" {...handlers} {...props} />, options);
  return { ...handlers, ...view };
}

const benchPress = {
  id: 'e1',
  exerciseId: 'barbell_bench_press',
  exercise: 'Barbell bench press',
  muscle: 'chest',
  sets: 4,
  dose: { unit: 'repetitions', min: 6, max: 8 },
  weight: 60,
  restSeconds: 120,
};

describe('DayExercisesForm', () => {
  beforeEach(() => localStorage.clear());

  it('shows the fields with only muscle, exercise, repetitions and sets required', () => {
    renderForm();

    expect(screen.getByRole('combobox', { name: /muscle/i })).toHaveValue('');
    expect(screen.getByRole('combobox', { name: /muscle/i })).toBeRequired();
    expect(field(/exercise:/i)).toBeRequired();
    expect(screen.getByRole('combobox', { name: /measured by/i })).toHaveValue('repetitions');
    expect(field(/repetitions from/i)).toBeRequired();
    expect(field(/^to/i)).not.toBeRequired();
    expect(field(/sets/i)).toBeRequired();
    expect(field(/weight/i)).not.toBeRequired();
    expect(field(/rest/i)).not.toBeRequired();
    expect(screen.queryByLabelText(/duration/i)).not.toBeInTheDocument();
    expect(screen.getByText(/no exercises added yet/i)).toBeInTheDocument();
  });

  it('adds a library exercise and fills in its muscle group', async () => {
    const { onAddEntry } = renderForm();

    await userEvent.type(field(/exercise:/i), 'Barbell bench press');
    expect(screen.getByRole('combobox', { name: /muscle/i })).toHaveValue('chest');
    await userEvent.type(field(/repetitions from/i), '6');
    await userEvent.type(field(/^to/i), '8');
    await userEvent.type(field(/sets/i), '4');
    await userEvent.type(field(/weight/i), '62.5');
    await userEvent.type(field(/rest/i), '120');
    await userEvent.click(screen.getByRole('button', { name: /add exercise/i }));

    expect(onAddEntry).toHaveBeenCalledWith({
      ...benchPress,
      id: expect.any(String),
      weight: 62.5,
    });
    expect(field(/exercise:/i)).toHaveValue('');
    expect(screen.getByRole('combobox', { name: /muscle/i })).toHaveValue('chest');
  });

  it('adds a free-text exercise with a single repetition count and no weight', async () => {
    const { onAddEntry } = renderForm();

    await userEvent.selectOptions(screen.getByRole('combobox', { name: /muscle/i }), 'Legs');
    await userEvent.type(field(/exercise:/i), ' My squat ');
    await userEvent.type(field(/repetitions from/i), '10');
    await userEvent.type(field(/sets/i), '3');
    await userEvent.click(screen.getByRole('button', { name: /add exercise/i }));

    expect(onAddEntry).toHaveBeenCalledWith({
      id: expect.any(String),
      exerciseId: null,
      exercise: 'My squat',
      muscle: 'legs',
      sets: 3,
      dose: { unit: 'repetitions', min: 10, max: 10 },
      weight: null,
      restSeconds: null,
    });
  });

  it('switches timed exercises to a duration', async () => {
    const { onAddEntry } = renderForm();

    await userEvent.type(field(/exercise:/i), 'Plank');
    expect(screen.getByRole('combobox', { name: /measured by/i })).toHaveValue('seconds');
    await userEvent.type(field(/duration/i), '45');
    await userEvent.type(field(/sets/i), '3');
    await userEvent.click(screen.getByRole('button', { name: /add exercise/i }));

    expect(onAddEntry).toHaveBeenCalledWith(
      expect.objectContaining({ exerciseId: 'plank', muscle: 'abs', dose: { unit: 'seconds', value: 45 } })
    );
  });

  it('rejects a repetition range that ends below its start', async () => {
    const { onAddEntry } = renderForm();

    await userEvent.type(field(/exercise:/i), 'Barbell bench press');
    await userEvent.type(field(/repetitions from/i), '12');
    await userEvent.type(field(/^to/i), '8');
    await userEvent.type(field(/sets/i), '3');
    await userEvent.click(screen.getByRole('button', { name: /add exercise/i }));

    expect(onAddEntry).not.toHaveBeenCalled();
    expect(screen.getByRole('alert')).toHaveTextContent(/must not be lower/i);
  });

  it('does not add an exercise without a muscle', async () => {
    const { onAddEntry } = renderForm();

    await userEvent.type(field(/exercise:/i), 'Something');
    await userEvent.type(field(/repetitions from/i), '10');
    await userEvent.type(field(/sets/i), '3');
    await userEvent.click(screen.getByRole('button', { name: /add exercise/i }));

    expect(onAddEntry).not.toHaveBeenCalled();
  });

  it('suggests only exercises of the chosen muscle group', async () => {
    const { container } = renderForm();
    const options = () => [...container.querySelectorAll('datalist option')].map(option => option.value);

    expect(options().length).toBeGreaterThan(80);
    await userEvent.selectOptions(screen.getByRole('combobox', { name: /muscle/i }), 'Chest');
    expect(options()).toContain('Barbell bench press');
    expect(options()).not.toContain('Barbell squat');
  });

  it('lists the entries in the current language', () => {
    renderForm(
      { entries: [benchPress, { ...benchPress, id: 'e2', exerciseId: 'plank', muscle: 'abs', dose: { unit: 'seconds', value: 45 }, weight: null, restSeconds: null }] },
      { language: 'de' }
    );

    const list = screen.getByRole('list', { name: /montag/i });
    expect(within(list).getByText('Langhantel-Bankdrücken')).toBeInTheDocument();
    expect(within(list).getByText('6–8')).toBeInTheDocument();
    expect(within(list).getByText('60 kg')).toBeInTheDocument();
    expect(within(list).getByText('120 s')).toBeInTheDocument();
    expect(within(list).getByText('Unterarmstütz')).toBeInTheDocument();
    expect(within(list).getByText('45 s')).toBeInTheDocument();
  });

  it('offers Other for exercises without a muscle group', async () => {
    const { container, onAddEntry } = renderForm();

    await userEvent.selectOptions(screen.getByRole('combobox', { name: /muscle/i }), 'Other');
    const options = [...container.querySelectorAll('datalist option')].map(option => option.value);
    expect(options).toContain('Jump rope');
    expect(options).not.toContain('Barbell bench press');

    await userEvent.type(field(/exercise:/i), 'Jump rope');
    await userEvent.type(field(/duration/i), '60');
    await userEvent.type(field(/sets/i), '3');
    await userEvent.click(screen.getByRole('button', { name: /add exercise/i }));
    expect(onAddEntry).toHaveBeenCalledWith(expect.objectContaining({ exerciseId: 'jump_rope', muscle: 'other' }));
  });

  it('keeps fields the form does not edit, such as a template target', async () => {
    const { onUpdateEntry } = renderForm({ entries: [{ ...benchPress, rirTarget: 2 }] });

    await userEvent.click(screen.getByRole('button', { name: /edit barbell bench press/i }));
    await userEvent.click(screen.getByRole('button', { name: /save exercise/i }));

    expect(onUpdateEntry).toHaveBeenCalledWith({ ...benchPress, rirTarget: 2 });
  });

  describe('editing an entry', () => {
    async function startEditing(props) {
      const handlers = renderForm({ entries: [benchPress], ...props });
      await userEvent.click(screen.getByRole('button', { name: /edit barbell bench press/i }));
      return handlers;
    }

    it('loads the entry into the form and saves the changes', async () => {
      const { onUpdateEntry, onAddEntry } = await startEditing();

      expect(field(/exercise:/i)).toHaveValue('Barbell bench press');
      expect(field(/repetitions from/i)).toHaveValue(6);
      expect(field(/^to/i)).toHaveValue(8);
      expect(field(/weight/i)).toHaveValue(60);
      await userEvent.clear(field(/^to/i));
      await userEvent.type(field(/^to/i), '10');
      await userEvent.click(screen.getByRole('button', { name: /save exercise/i }));

      expect(onUpdateEntry).toHaveBeenCalledWith({
        ...benchPress,
        dose: { unit: 'repetitions', min: 6, max: 10 },
      });
      expect(onAddEntry).not.toHaveBeenCalled();
    });

    it('can be cancelled', async () => {
      const { onUpdateEntry } = await startEditing();

      await userEvent.click(screen.getByRole('button', { name: /cancel/i }));

      expect(field(/exercise:/i)).toHaveValue('');
      expect(screen.queryByRole('button', { name: /save exercise/i })).not.toBeInTheDocument();
      expect(onUpdateEntry).not.toHaveBeenCalled();
    });

    it('stops editing when the entry is removed', async () => {
      const { onRemoveEntry } = await startEditing();

      await userEvent.click(screen.getByRole('button', { name: /remove barbell bench press/i }));

      expect(onRemoveEntry).toHaveBeenCalledWith('e1');
      expect(screen.getByRole('button', { name: /add exercise/i })).toBeInTheDocument();
    });
  });
});
