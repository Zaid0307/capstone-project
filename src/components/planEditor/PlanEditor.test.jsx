import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PlanEditor from './PlanEditor';
import { UndoProvider } from '../ui/UndoProvider';
import { renderWithProviders } from '../../test-utils';
import { addDay, addEntry } from '../../utils/planEditing';
import { createEmptyPlan, createEntry } from '../../utils/workoutPlan';

function planWithTwoDays() {
  let plan = { ...createEmptyPlan(), nameOfWorkout: 'Push Pull' };
  const monday = addDay(plan, { name: 'Push', weekday: 'monday' });
  const thursday = addDay(monday.plan, { name: 'Pull', weekday: 'thursday' });
  plan = thursday.plan;
  plan = addEntry(plan, monday.day.id, createEntry({ exerciseId: 'barbell_bench_press' }));
  plan = addEntry(plan, monday.day.id, createEntry({ exerciseId: 'dumbbell_shoulder_press' }));
  plan = addEntry(plan, thursday.day.id, createEntry({ exerciseId: 'barbell_row' }));
  return plan;
}

function renderEditor(initialPlan = planWithTwoDays()) {
  const onSave = vi.fn();
  const onCancel = vi.fn();
  renderWithProviders(
    <PlanEditor initialPlan={initialPlan} draftKey="test" onSave={onSave} onCancel={onCancel} />
  );
  return { onSave, onCancel };
}

const exerciseNames = name =>
  within(screen.getByRole('list', { name: `Exercises of ${name}` }))
    .getAllByRole('listitem')
    .filter(item => item.parentElement.tagName === 'OL')
    .map(item => item.querySelector('p').textContent);

const save = () => userEvent.click(screen.getByRole('button', { name: 'Save changes' }));

// Opens the ⋮ menu of an exercise or a day and picks one action.
async function menuAction(owner, action) {
  await userEvent.click(screen.getByRole('button', { name: `Actions for ${owner}` }));
  await userEvent.click(screen.getByRole('button', { name: action }));
}

describe('PlanEditor', () => {
  beforeEach(() => {
    localStorage.clear();
    window.confirm = vi.fn(() => true);
  });

  afterEach(() => {
    delete window.confirm;
  });

  it('opens the first day and switches between days', async () => {
    renderEditor();

    expect(screen.getByRole('button', { name: /^Monday( .+)? \d+$/, pressed: true })).toBeInTheDocument();
    expect(exerciseNames('Monday')).toEqual(['Barbell bench press', 'Dumbbell shoulder press']);

    await userEvent.click(screen.getByRole('button', { name: /^Thursday( .+)? \d+$/ }));
    expect(exerciseNames('Thursday')).toEqual(['Bent-over barbell row']);
  });

  it('moves, duplicates and removes exercises', async () => {
    const { onSave } = renderEditor();

    await menuAction('Dumbbell shoulder press', 'Move Dumbbell shoulder press up');
    expect(exerciseNames('Monday')).toEqual(['Dumbbell shoulder press', 'Barbell bench press']);
    const more = screen.getByRole('button', { name: 'Actions for Dumbbell shoulder press' });
    expect(more).toHaveFocus();
    await userEvent.click(more);
    expect(screen.getByRole('button', { name: 'Move Dumbbell shoulder press up' })).toBeDisabled();
    await userEvent.keyboard('{Escape}');

    await menuAction('Barbell bench press', 'Duplicate Barbell bench press');
    expect(exerciseNames('Monday')).toEqual([
      'Dumbbell shoulder press',
      'Barbell bench press',
      'Barbell bench press',
    ]);

    await menuAction('Dumbbell shoulder press', 'Remove Dumbbell shoulder press');
    expect(window.confirm).not.toHaveBeenCalled();
    expect(exerciseNames('Monday')).toEqual(['Barbell bench press', 'Barbell bench press']);

    await save();
    expect(onSave.mock.calls[0][0].days[0].entries).toHaveLength(2);
  });

  it('puts a removed exercise back at its place with undo', async () => {
    renderWithProviders(
      <UndoProvider>
        <PlanEditor initialPlan={planWithTwoDays()} draftKey="test" onSave={vi.fn()} onCancel={vi.fn()} />
      </UndoProvider>
    );

    await menuAction('Barbell bench press', 'Remove Barbell bench press');
    expect(exerciseNames('Monday')).toEqual(['Dumbbell shoulder press']);
    expect(screen.getByText('Barbell bench press removed')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Undo' }));
    expect(exerciseNames('Monday')).toEqual(['Barbell bench press', 'Dumbbell shoulder press']);
  });

  it('edits single sets, adds and removes sets', async () => {
    const { onSave } = renderEditor();

    await userEvent.click(screen.getByRole('button', { name: 'Details of Barbell bench press' }));
    const third = within(screen.getByRole('group', { name: 'Set 3' }));
    await userEvent.clear(third.getByLabelText('Reps'));
    await userEvent.type(third.getByLabelText('Reps'), '6');
    await userEvent.type(third.getByLabelText('kg'), '80');
    await userEvent.click(screen.getByRole('button', { name: 'Add set' }));
    await userEvent.selectOptions(
      within(screen.getByRole('group', { name: 'Set 1' })).getByLabelText('Type'),
      'warmup'
    );
    await userEvent.click(screen.getByRole('button', { name: 'Remove set 2' }));

    expect(screen.getByText('1 + 2 × 6–12 · 80 kg · sets differ, change them in the details')).toBeInTheDocument();
    await save();
    const [bench] = onSave.mock.calls[0][0].days[0].entries;
    expect(bench.sets.map(set => [set.type, set.dose.min, set.dose.max, set.weight])).toEqual([
      ['warmup', 8, 12, null],
      ['working', 6, 12, 80],
      ['working', 6, 12, 80],
    ]);
  });

  it('switches an exercise to time', async () => {
    renderEditor();

    await userEvent.click(screen.getByRole('button', { name: 'Details of Barbell bench press' }));
    await userEvent.selectOptions(screen.getByLabelText('Measured by'), 'seconds');

    const quick = within(screen.getByRole('group', { name: 'Sets of Barbell bench press' }));
    expect(quick.getByLabelText('Seconds')).toHaveValue(30);
    expect(within(screen.getByRole('group', { name: 'Set 3' })).getByLabelText('Seconds')).toHaveValue(30);
  });

  it('marks a reversed set range and swaps it when the field is left', async () => {
    const { onSave } = renderEditor();

    await userEvent.click(screen.getByRole('button', { name: 'Details of Barbell bench press' }));
    const first = within(screen.getByRole('group', { name: 'Set 1' }));
    const before = first.getByLabelText('Reps').value;
    await userEvent.clear(first.getByLabelText('to'));
    await userEvent.type(first.getByLabelText('to'), '5');
    expect(first.getByLabelText('to')).toHaveAttribute('aria-invalid', 'true');

    // Leaving the field turns e.g. "8 to 5" into "5 to 8".
    await userEvent.tab();
    expect(first.getByLabelText('Reps')).toHaveValue(5);
    expect(first.getByLabelText('to')).toHaveValue(Number(before));

    await save();
    expect(onSave).toHaveBeenCalled();
  });

  it('moves an exercise to another day', async () => {
    renderEditor();

    await menuAction('Barbell bench press', 'Move to another day');
    expect(screen.getByRole('button', { name: 'Back' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Move Barbell bench press to Thursday' })).toHaveFocus();
    await userEvent.click(screen.getByRole('button', { name: 'Move Barbell bench press to Thursday' }));

    expect(exerciseNames('Monday')).toEqual(['Dumbbell shoulder press']);
    await userEvent.click(screen.getByRole('button', { name: /^Thursday( .+)? \d+$/ }));
    expect(exerciseNames('Thursday')).toEqual(['Bent-over barbell row', 'Barbell bench press']);
  });

  it('adds several exercises at once and own exercises', async () => {
    const { onSave } = renderEditor();

    await userEvent.click(screen.getByRole('button', { name: 'Add exercise' }));
    expect(screen.getByRole('dialog', { name: /^Exercises for / })).toBeInTheDocument();
    await userEvent.selectOptions(screen.getByLabelText('Muscle group'), 'arms');
    const results = within(screen.getByRole('list', { name: 'Exercises' }));
    expect(results.queryByRole('button', { name: 'Select Barbell squat' })).not.toBeInTheDocument();
    await userEvent.click(results.getByRole('button', { name: 'Select Hammer curl' }));
    await userEvent.click(results.getByRole('button', { name: 'Select Dumbbell curl' }));
    expect(screen.getByRole('button', { name: 'Add (2)' })).toBeEnabled();

    await userEvent.type(screen.getByLabelText('Search'), 'no such exercise');
    expect(screen.getByText(/No exercises found/)).toBeInTheDocument();

    await userEvent.type(screen.getByLabelText('Name of your exercise'), 'Wrist roller');
    await userEvent.selectOptions(screen.getByLabelText('Muscle group of your exercise'), 'arms');
    await userEvent.click(screen.getByRole('button', { name: 'Add own exercise' }));
    expect(screen.getByText('Added: Wrist roller')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Add (2)' }));

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(exerciseNames('Monday')).toEqual([
      'Barbell bench press',
      'Dumbbell shoulder press',
      'Wrist roller',
      'Hammer curl',
      'Dumbbell curl',
    ]);
    await save();
    expect(onSave.mock.calls[0][0].days[0].entries[2]).toMatchObject({
      exerciseId: null,
      exercise: 'Wrist roller',
      muscle: 'arms',
    });
  });

  it('replaces an exercise and keeps its sets', async () => {
    const { onSave } = renderEditor();

    const quick = within(screen.getByRole('group', { name: 'Sets of Barbell bench press' }));
    await userEvent.type(quick.getByLabelText('kg'), '70');
    await menuAction('Barbell bench press', 'Replace exercise');
    const dialog = within(screen.getByRole('dialog', { name: 'Replace Barbell bench press' }));
    await userEvent.click(dialog.getByRole('button', { name: 'Select Dumbbell bench press' }));
    await userEvent.click(dialog.getByRole('button', { name: 'Replace' }));

    expect(exerciseNames('Monday')).toEqual(['Dumbbell bench press', 'Dumbbell shoulder press']);
    await save();
    const [replaced] = onSave.mock.calls[0][0].days[0].entries;
    expect(replaced.exerciseId).toBe('dumbbell_bench_press');
    expect(replaced.sets.map(set => set.weight)).toEqual([70, 70, 70]);
  });

  it('offers only equipment that fits the chosen muscle group, and the other way round', async () => {
    renderEditor();

    await userEvent.click(screen.getByRole('button', { name: 'Add exercise' }));
    const equipment = screen.getByLabelText('Equipment');
    expect(within(equipment).getByRole('option', { name: /^Leg press machine/ })).toBeInTheDocument();

    await userEvent.selectOptions(screen.getByLabelText('Muscle group'), 'arms');
    expect(within(equipment).queryByRole('option', { name: /^Leg press machine/ })).not.toBeInTheDocument();
    expect(within(equipment).getByRole('option', { name: /^Dumbbells \(\d+\)$/ })).toBeInTheDocument();

    await userEvent.selectOptions(screen.getByLabelText('Muscle group'), 'all');
    await userEvent.selectOptions(equipment, within(equipment).getByRole('option', { name: /^Leg press machine/ }));
    const muscles = within(screen.getByLabelText('Muscle group'));
    expect(muscles.getByRole('option', { name: /^All/ })).toHaveTextContent(`(${within(screen.getByRole('list', { name: 'Exercises' })).getAllByRole('listitem').length})`);
    expect(muscles.getByRole('option', { name: /^Legs \(\d+\)$/ })).toBeInTheDocument();
    expect(muscles.queryByRole('option', { name: /^Chest/ })).not.toBeInTheDocument();
  });

  it('filters by kind of training, several at once', async () => {
    renderEditor();

    await userEvent.click(screen.getByRole('button', { name: 'Add exercise' }));
    const kinds = within(screen.getByRole('group', { name: 'Kind' }));
    await userEvent.click(kinds.getByRole('button', { name: /^Bands \d+$/ }));
    const results = () => within(screen.getByRole('list', { name: 'Exercises' }));
    expect(results().getByRole('button', { name: 'Select Band biceps curl' })).toBeInTheDocument();
    expect(results().queryByRole('button', { name: 'Select Hammer curl' })).not.toBeInTheDocument();

    await userEvent.click(kinds.getByRole('button', { name: /^Dumbbells \d+$/ }));
    expect(results().getByRole('button', { name: 'Select Hammer curl' })).toBeInTheDocument();
    expect(results().queryByRole('button', { name: 'Select Barbell squat' })).not.toBeInTheDocument();
    expect(kinds.getByRole('button', { name: /^Bands \d+$/ })).toHaveAttribute('aria-pressed', 'true');
  });

  it('edits all sets of an exercise in its quick row', async () => {
    const { onSave } = renderEditor();

    const quick = within(screen.getByRole('group', { name: 'Sets of Barbell bench press' }));
    expect(within(quick.getByRole('group', { name: 'Sets' })).getByText('3')).toBeInTheDocument();
    await userEvent.click(quick.getByRole('button', { name: 'One set more' }));
    await userEvent.click(quick.getByRole('button', { name: 'One set more' }));
    await userEvent.clear(quick.getByLabelText('Reps'));
    await userEvent.type(quick.getByLabelText('Reps'), '5');
    // A comma works as decimal separator, too.
    await userEvent.type(quick.getByLabelText('kg'), '100,5');
    expect(quick.getByLabelText('kg')).toHaveValue('100,5');

    await save();
    const [bench] = onSave.mock.calls[0][0].days[0].entries;
    expect(bench.sets).toHaveLength(5);
    expect(bench.sets.map(set => [set.weight, set.dose.min, set.dose.max])).toEqual([1, 2, 3, 4, 5].map(() => [100.5, 5, 12]));
  });

  it('shows an exercise with its muscles and variants and adds it from there', async () => {
    const { onSave } = renderEditor();

    await userEvent.click(screen.getByRole('button', { name: 'Add exercise' }));
    await userEvent.type(screen.getByLabelText('Search'), 'barbell bench press');
    await userEvent.click(screen.getByRole('button', { name: 'Show Barbell bench press' }));

    const preview = within(screen.getByRole('region', { name: 'Barbell bench press' }));
    expect(preview.getByRole('img', { name: 'The animation of Barbell bench press follows.' })).toBeInTheDocument();
    expect(preview.getByText('Mainly trains')).toBeInTheDocument();
    const variants = within(preview.getByRole('list', { name: 'Variants of Barbell bench press' }));
    await userEvent.click(variants.getByRole('button', { name: /Show Dumbbell bench press/ }));

    const variant = within(screen.getByRole('region', { name: 'Dumbbell bench press' }));
    await userEvent.click(variant.getByRole('button', { name: 'Select' }));
    expect(variant.getByRole('button', { name: 'Selected' })).toHaveAttribute('aria-pressed', 'true');
    await userEvent.click(screen.getByRole('button', { name: 'Add (1)' }));

    await save();
    expect(onSave.mock.calls[0][0].days[0].entries.map(entry => entry.exerciseId)).toContain('dumbbell_bench_press');
  });

  it('shows the load of the chosen day and of the whole plan at the bottom', async () => {
    renderEditor();

    const analysis = within(screen.getByRole('complementary', { name: 'Analysis of the plan' }));
    expect(analysis.getByRole('button', { name: 'Monday', pressed: true })).toBeInTheDocument();
    const dayMuscles = analysis.getByRole('region', { name: 'Trained muscles: Monday' });
    expect(dayMuscles).toHaveTextContent('Pectoralis major, sternocostal part');
    expect(dayMuscles).not.toHaveTextContent('Latissimus dorsi');
    expect(analysis.queryByRole('region', { name: 'Hints' })).not.toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: /^Thursday( .+)? \d+$/ }));
    expect(analysis.getByRole('region', { name: 'Trained muscles: Thursday' })).toHaveTextContent('Latissimus dorsi');

    await userEvent.click(analysis.getByRole('button', { name: 'Whole plan' }));
    expect(analysis.getByRole('region', { name: 'Sets per muscle group: Whole plan' })).toBeInTheDocument();
    const hints = within(analysis.getByRole('region', { name: 'Hints' }));
    await userEvent.click(hints.getByRole('button', { name: /^Show all \d+ hints$/ }));
    expect(hints.getByText('No exercises for Legs.')).toBeInTheDocument();
  });

  it('closes the actions menu with Escape and with a tap outside', async () => {
    renderEditor();

    const more = screen.getByRole('button', { name: 'Actions for Barbell bench press' });
    await userEvent.click(more);
    expect(more).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('button', { name: 'Move Barbell bench press up' })).toBeDisabled();
    await userEvent.keyboard('{Escape}');
    expect(more).toHaveAttribute('aria-expanded', 'false');
    expect(more).toHaveFocus();

    await userEvent.click(more);
    await userEvent.click(screen.getByLabelText('Name of the plan'));
    expect(more).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByRole('button', { name: 'Duplicate Barbell bench press' })).not.toBeInTheDocument();
  });

  it('sorts exercises with arrow buttons and announces the new place', async () => {
    const { onSave } = renderEditor();

    await userEvent.click(screen.getByRole('button', { name: 'Add exercise' }));
    await userEvent.click(screen.getByRole('button', { name: 'Select Hammer curl' }));
    await userEvent.click(screen.getByRole('button', { name: 'Add (1)' }));

    await userEvent.click(screen.getByRole('button', { name: 'Sort' }));
    const order = () =>
      within(screen.getByRole('list', { name: 'Order of Monday' }))
        .getAllByRole('listitem')
        .map(item => item.querySelectorAll('span')[1].textContent);
    expect(order()).toEqual(['Barbell bench press', 'Dumbbell shoulder press', 'Hammer curl']);

    const down = screen.getByRole('button', { name: 'Move Barbell bench press down' });
    await userEvent.click(down);
    expect(order()).toEqual(['Dumbbell shoulder press', 'Barbell bench press', 'Hammer curl']);
    expect(screen.getByText('Barbell bench press is now at position 2 of 3')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Move Barbell bench press down' })).toHaveFocus();

    // At the end the down arrow is disabled, so the up arrow takes the focus.
    await userEvent.keyboard('{Enter}');
    expect(order()).toEqual(['Dumbbell shoulder press', 'Hammer curl', 'Barbell bench press']);
    expect(screen.getByRole('button', { name: 'Move Barbell bench press down' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Move Barbell bench press up' })).toHaveFocus();

    await userEvent.click(screen.getByRole('button', { name: 'Done' }));
    expect(exerciseNames('Monday')).toEqual(['Dumbbell shoulder press', 'Hammer curl', 'Barbell bench press']);
    await save();
    expect(onSave.mock.calls[0][0].days[0].entries.map(entry => entry.exerciseId)).toEqual([
      'dumbbell_shoulder_press',
      'hammer_curl',
      'barbell_bench_press',
    ]);
  });

  it('duplicates and deletes days', async () => {
    renderEditor();

    await menuAction('Monday', 'Duplicate day');
    // The copy has no weekday yet, so it needs one before saving.
    expect(screen.getByRole('button', { name: /^Push \(copy\) \d+$/, pressed: true })).toBeInTheDocument();
    expect(screen.getByLabelText('Weekday')).toHaveValue('');
    expect(exerciseNames('Push (copy)')).toHaveLength(2);

    await menuAction('Push (copy)', 'Delete Push (copy)');
    expect(window.confirm).not.toHaveBeenCalled();
    expect(screen.queryByRole('button', { name: /^Push \(copy\) \d+$/ })).not.toBeInTheDocument();
  });

  it('orders rotation days freely and names new days A, B, …', async () => {
    const { onSave } = renderEditor({ ...createEmptyPlan(), nameOfWorkout: 'Rotation' });

    await userEvent.click(screen.getByRole('button', { name: /^Description, schedule and dates/ }));
    await userEvent.click(screen.getByRole('radio', { name: /In rotation/ }));
    await userEvent.click(screen.getByRole('button', { name: 'Add day' }));
    await userEvent.click(screen.getByRole('button', { name: 'Close exercise selection' }));
    await userEvent.click(screen.getByRole('button', { name: 'Add day' }));
    expect(screen.getByLabelText('Name of the day')).toHaveValue('Day B');

    await menuAction('Day B', 'Move day earlier');
    const tabs = within(screen.getByRole('group', { name: 'Choose a training day' }))
      .getAllByRole('button', { pressed: false })
      .concat(screen.getAllByRole('button', { pressed: true }));
    expect(tabs.map(tab => tab.textContent)).toEqual(expect.arrayContaining(['Day B 0', 'Day A 0']));

    await save();
    expect(onSave).not.toHaveBeenCalled();
    expect(screen.getByRole('alert')).toHaveTextContent('Day B: Add at least one exercise.');
  });

  it('offers to save, keep a draft or discard when leaving with changes', async () => {
    const { onCancel } = renderEditor();

    await userEvent.click(screen.getByRole('button', { name: 'Back to plans' }));
    expect(onCancel).toHaveBeenCalledTimes(1);

    await userEvent.type(screen.getByLabelText('Name of the plan'), '!');
    await userEvent.click(screen.getByRole('button', { name: 'Back to plans' }));
    const dialog = within(screen.getByRole('alertdialog', { name: 'You have unsaved changes.' }));
    await userEvent.click(dialog.getByRole('button', { name: 'Keep editing' }));
    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
    expect(onCancel).toHaveBeenCalledTimes(1);

    await userEvent.click(screen.getByRole('button', { name: 'Back to plans' }));
    await userEvent.click(screen.getByRole('button', { name: 'Discard and leave' }));
    expect(onCancel).toHaveBeenCalledTimes(2);
  });

  it('undoes changes step by step, typing counts as one step', async () => {
    renderEditor();
    const undo = screen.getByRole('button', { name: 'Undo last change' });
    expect(undo).toBeDisabled();

    await userEvent.type(screen.getByLabelText('Name of the plan'), ' A');
    await menuAction('Barbell bench press', 'Remove Barbell bench press');
    expect(exerciseNames('Monday')).toEqual(['Dumbbell shoulder press']);

    await userEvent.click(undo);
    expect(exerciseNames('Monday')).toEqual(['Barbell bench press', 'Dumbbell shoulder press']);
    await userEvent.click(undo);
    expect(screen.getByLabelText('Name of the plan')).toHaveValue('Push Pull');
    expect(undo).toBeDisabled();
  });
});
