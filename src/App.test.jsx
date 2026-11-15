import { fireEvent, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';
import { renderWithProviders } from './test-utils';
import { LEGACY_STORAGE_KEY, STORAGE_KEY } from './storage/localPlanStore';
import { toDateKey } from './utils/workoutLog';
import { templateById, templateToPlan } from './data/planTemplates';

const savedPlans = [
  {
    id: 'plan1',
    nameOfWorkout: 'Push',
    description: 'Chest and arms',
    days: [
      {
        id: 'p1-mon',
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
    ],
  },
  {
    id: 'plan2',
    nameOfWorkout: 'Legacy',
    description: '',
    // Saved by an older version: click order, no muscles on a day,
    // capitalised muscle names.
    days: [
      { id: 'p2-fri', day: 'friday' },
      {
        id: 'p2-tue',
        day: 'tuesday',
        muscles: [{ name: 'Stomach', exercises: [{ exercise: 'Crunch' }] }],
      },
    ],
  },
];

async function renderApp(route) {
  renderWithProviders(<App />, { route });
}

// Edit, duplicate, archive and delete sit in the ⋮ menu of a plan card.
async function planAction(planName, action) {
  await userEvent.click(screen.getByRole('button', { name: `More actions for ${planName}` }));
  await userEvent.click(screen.getByRole('button', { name: action }));
}

function savePlans(plans) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(plans));
}

function readPlans() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY));
}

describe('App', () => {
  beforeEach(() => {
    localStorage.clear();
    window.confirm = vi.fn(() => true);
  });

  afterEach(() => {
    delete window.confirm;
  });

  describe('workout plans page', () => {
    it('shows a hint when there are no plans', async () => {
      await renderApp('/plans');
      expect(
        screen.getByText(/you have no workout plans yet/i)
      ).toBeInTheDocument();
    });

    it('shows a plan with its days and exercises', async () => {
      savePlans(savedPlans);
      await renderApp('/plans');

      await userEvent.click(screen.getByRole('button', { name: 'Show Push' }));
      expect(screen.getByText('Chest and arms')).toBeInTheDocument();
      await userEvent.click(screen.getByRole('button', { name: 'Show Monday' }));
      const list = screen.getByRole('list', { name: 'Exercises of Monday' });
      expect(within(list).getByText('Bench Press')).toBeInTheDocument();
      expect(within(list).getByText('Chest · 4 × 8 · 60 kg')).toBeInTheDocument();
    });

    it('duplicates a plan', async () => {
      savePlans(savedPlans);
      await renderApp('/plans');

      await planAction('Push', 'Duplicate workout plan Push');

      expect(screen.getByRole('heading', { name: 'Push (copy)' })).toBeInTheDocument();
      const plans = readPlans();
      expect(plans.map(plan => plan.nameOfWorkout)).toEqual(['Push', 'Legacy', 'Push (copy)']);
      expect(plans[2].id).not.toBe('plan1');
      expect(plans[2].days[0].entries[0].exercise).toBe('Bench Press');
    });

    it('shows plans saved by older versions without crashing', async () => {
      savePlans(savedPlans);
      await renderApp('/plans');

      await userEvent.click(screen.getByRole('button', { name: 'Show Legacy' }));
      const dayButtons = screen.getAllByRole('button', { name: /^Show / });
      expect(dayButtons.map(button => button.getAttribute('aria-label'))).toEqual(
        ['Show Push', 'Show Tuesday', 'Show Friday']
      );

      await userEvent.click(screen.getByRole('button', { name: 'Show Friday' }));
      await userEvent.click(screen.getByRole('button', { name: 'Show Tuesday' }));
      expect(screen.getByText('Crunch')).toBeInTheDocument();
      expect(screen.getByText('Abs · 1 × 1')).toBeInTheDocument();
    });

    it('summarizes each plan and sorts the most recently trained first', async () => {
      savePlans(savedPlans);
      localStorage.setItem(
        'workoutLog',
        JSON.stringify([
          {
            id: 'w1',
            date: toDateKey(),
            status: 'done',
            plan: { planId: 'plan2', planName: 'Legacy', dayId: 'p2-tue', dayName: '', weekday: 'tuesday' },
            note: '',
            exercises: [],
          },
        ])
      );
      await renderApp('/plans');

      const cards = within(screen.getByRole('list', { name: 'Active plans' })).getAllByRole('article');
      expect(cards.map(card => within(card).getByRole('heading', { level: 2 }).textContent)).toEqual(['Legacy', 'Push']);
      expect(cards[0]).toHaveTextContent('Tue Fri · 2 days');
      expect(cards[0]).toHaveTextContent('1 exercise · last: today');
      expect(cards[1]).toHaveTextContent('never trained');
    });

    it('changes days only in the editor, not in the list', async () => {
      savePlans(savedPlans);
      await renderApp('/plans');

      await userEvent.click(screen.getByRole('button', { name: 'Show Legacy' }));
      expect(screen.queryByRole('button', { name: /^Delete (Tuesday|Friday)$/ })).not.toBeInTheDocument();
    });

    it('closes the actions menu with Escape', async () => {
      savePlans(savedPlans);
      await renderApp('/plans');

      const more = screen.getByRole('button', { name: 'More actions for Push' });
      await userEvent.click(more);
      expect(more).toHaveAttribute('aria-expanded', 'true');
      await userEvent.keyboard('{Escape}');
      expect(more).toHaveAttribute('aria-expanded', 'false');
      expect(more).toHaveFocus();
    });

    it('deletes a whole plan and can undo it', async () => {
      savePlans(savedPlans);
      await renderApp('/plans');

      await planAction('Push', 'Delete workout plan Push');

      expect(readPlans().map(plan => plan.id)).toEqual(['plan2']);
      expect(screen.queryByRole('heading', { name: 'Push' })).not.toBeInTheDocument();
      expect(screen.getByText('Workout plan Push deleted')).toBeInTheDocument();

      await userEvent.click(screen.getByRole('button', { name: 'Undo' }));
      expect(screen.getByRole('heading', { name: 'Push' })).toBeInTheDocument();
      expect(readPlans().map(plan => plan.id).sort()).toEqual(['plan1', 'plan2']);
    });
  });

  describe('plans copied from a template', () => {
    it('shows cardio and boxing exercises under Other', async () => {
      const plan = templateToPlan(templateById('boxing_technical_3'), 'en');
      savePlans([plan]);
      await renderApp('/plans');

      await userEvent.click(screen.getByRole('button', { name: `Show ${plan.nameOfWorkout}` }));
      const day = plan.days.find(item => item.entries.some(entry => entry.muscle === 'other'));
      const dayName = day.weekday[0].toUpperCase() + day.weekday.slice(1);
      await userEvent.click(screen.getByRole('button', { name: `Show ${dayName}` }));

      const entry = day.entries.find(item => item.muscle === 'other');
      expect(screen.getAllByText(entry.exercise).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/^Other · /).length).toBeGreaterThan(0);
    });

    it('shows the safety hint without expanding the plan', async () => {
      const plan = templateToPlan(templateById('hypertrophy_fullbody_3'), 'en');
      savePlans([plan]);
      await renderApp('/plans');

      expect(screen.getByRole('heading', { name: 'Safety' })).toBeInTheDocument();
      expect(screen.getByText(plan.hints.safety)).toBeInTheDocument();
      expect(screen.getByText(/check with a doctor/i)).toBeInTheDocument();
      expect(screen.queryByRole('heading', { name: 'Progression' })).not.toBeInTheDocument();
    });

    it('shows the template hints and day names of an expanded plan', async () => {
      const plan = templateToPlan(templateById('hypertrophy_fullbody_3'), 'en');
      savePlans([plan]);
      await renderApp('/plans');

      await userEvent.click(screen.getByRole('button', { name: `Show ${plan.nameOfWorkout}` }));

      expect(screen.getByRole('heading', { name: 'Progression' })).toBeInTheDocument();
      expect(screen.getByText(plan.hints.progression)).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: 'Recovery' })).toBeInTheDocument();
      expect(screen.getAllByText(plan.days[0].name).length).toBeGreaterThan(0);
    });

    it('shows rest and repetitions in reserve of a template exercise', async () => {
      const plan = templateToPlan(templateById('hypertrophy_fullbody_3'), 'en');
      savePlans([plan]);
      await renderApp('/plans');

      await userEvent.click(screen.getByRole('button', { name: `Show ${plan.nameOfWorkout}` }));
      await userEvent.click(screen.getByRole('button', { name: 'Show Monday' }));
      expect(screen.getAllByText('Rest 120 s · Reps in reserve: 2').length).toBeGreaterThan(0);
    });
  });

  describe('plans without a template', () => {
    it('show no hint sections', async () => {
      savePlans(savedPlans);
      await renderApp('/plans');

      await userEvent.click(screen.getByRole('button', { name: 'Show Push' }));
      expect(screen.queryByRole('heading', { name: 'Safety' })).not.toBeInTheDocument();
      expect(screen.queryByRole('heading', { name: 'Progression' })).not.toBeInTheDocument();
    });
  });

  describe('editing a plan', () => {
    it('changes the weight of one set and saves the plan in place', async () => {
      savePlans(savedPlans);
      await renderApp('/plans');

      await planAction('Push', 'Edit workout plan Push');
      expect(screen.getByRole('heading', { name: 'Edit workout plan' })).toBeInTheDocument();
      await userEvent.click(screen.getByRole('button', { name: 'Details of Bench Press' }));
      const firstSet = within(screen.getByRole('group', { name: 'Set 1' }));
      await userEvent.clear(firstSet.getByLabelText('kg'));
      await userEvent.type(firstSet.getByLabelText('kg'), '65');
      await userEvent.click(screen.getByRole('button', { name: 'Save changes' }));

      expect(screen.getByRole('heading', { name: 'Push' })).toBeInTheDocument();
      const [push, legacy] = readPlans();
      expect(push.id).toBe('plan1');
      const [bench] = push.days[0].entries;
      expect(bench).toMatchObject({ id: 'e1', exercise: 'Bench Press' });
      expect(bench.sets.map(set => set.weight)).toEqual([65, 60, 60, 60]);
      expect(legacy.days.map(day => day.id)).toEqual(['p2-fri', 'p2-tue']);
    });

    it('names what is missing in a plan saved by an older version', async () => {
      savePlans(savedPlans);
      await renderApp('/plans/plan2/edit');

      await userEvent.click(screen.getByRole('button', { name: 'Save changes' }));

      expect(screen.getByRole('alert')).toHaveTextContent('Friday: Add at least one exercise.');
      expect(screen.getByRole('button', { name: /^Friday( .+)? \d+$/, pressed: true })).toBeInTheDocument();
      expect(readPlans()).toEqual(savedPlans);
    });

    it('shows a message for an unknown plan', async () => {
      await renderApp('/plans/missing/edit');

      expect(screen.getByRole('alert')).toHaveTextContent(
        /this workout plan does not exist/i
      );
      await userEvent.click(
        screen.getByRole('link', { name: /back to my workout plans/i })
      );
      expect(
        screen.getByText(/you have no workout plans yet/i)
      ).toBeInTheDocument();
    });
  });

  describe('creating a plan', () => {
    it('creates an empty plan with a day and an exercise', async () => {
      await renderApp('/plans/new');

      await userEvent.click(screen.getByRole('button', { name: 'Empty plan' }));
      // The selection for day A is open right away.
      await userEvent.type(screen.getByLabelText('Search'), 'barbell back squat');
      await userEvent.click(screen.getByRole('button', { name: 'Select Barbell back squat' }));
      await userEvent.click(screen.getByRole('button', { name: 'Add (1)' }));
      await userEvent.clear(screen.getByLabelText('Name of the plan'));
      await userEvent.type(screen.getByLabelText('Name of the plan'), 'Legs');
      await userEvent.click(screen.getByRole('button', { name: 'Create workout plan' }));

      // A finished plan goes straight into the training diary.
      expect(screen.getByRole('heading', { name: 'Training diary' })).toBeInTheDocument();
      expect(screen.getByLabelText('Plan')).toHaveDisplayValue('Legs');
      const [plan] = readPlans();
      expect(plan.schedule).toMatchObject({ type: 'rotation', daysPerWeek: 3 });
      expect(plan.days).toHaveLength(1);
      expect(plan.days[0]).toMatchObject({ name: 'Day A', weekday: null });
      expect(plan.days[0].entries[0]).toMatchObject({ exerciseId: 'barbell_squat', muscle: 'legs' });
      expect(plan.days[0].entries[0].sets).toHaveLength(3);
    });

    it('groups the templates into categories, including anime-inspired fan plans', async () => {
      await renderApp('/plans/new');

      const chips = within(screen.getByRole('group', { name: 'Categories' }));
      await userEvent.click(chips.getByRole('button', { name: /^Anime-inspired \d+$/ }));
      expect(screen.getByRole('heading', { level: 3, name: 'Anime-inspired' })).toBeInTheDocument();
      expect(screen.queryByRole('heading', { level: 3, name: 'Boxing' })).not.toBeInTheDocument();
      expect(screen.getByRole('heading', { name: 'Hero 100 starter (inspired by One Punch Man)' })).toBeInTheDocument();

      await userEvent.click(screen.getByRole('button', { name: 'Use template Hero 100 starter (inspired by One Punch Man)' }));
      expect(screen.getByLabelText('Name of the plan')).toHaveValue('Hero 100 starter (inspired by One Punch Man)');
    });

    it('starts from a template', async () => {
      await renderApp('/plans/new');

      await userEvent.click(
        screen.getByRole('button', { name: 'Use template Muscle building full body, 3 days' })
      );
      expect(screen.getByLabelText('Name of the plan')).toHaveValue('Muscle building full body, 3 days');
      await userEvent.click(screen.getByRole('button', { name: 'Create workout plan' }));

      const [plan] = readPlans();
      expect(plan.template.id).toBe('hypertrophy_fullbody_3');
      expect(plan.days.map(day => day.weekday)).toEqual(['monday', 'wednesday', 'friday']);
    });

    it('starts an empty plan with a name, day A and the exercise selection', async () => {
      savePlans([{ ...savedPlans[0], nameOfWorkout: 'My plan 1' }]);
      await renderApp('/plans/new');

      await userEvent.click(screen.getByRole('button', { name: 'Empty plan' }));
      expect(screen.getByRole('dialog', { name: 'Exercises for Day A' })).toBeInTheDocument();
      await userEvent.click(screen.getByRole('button', { name: 'Close exercise selection' }));
      expect(screen.getByLabelText('Name of the plan')).toHaveValue('My plan 2');
      expect(screen.getByLabelText('Name of the day')).toHaveValue('Day A');

      await userEvent.clear(screen.getByLabelText('Name of the plan'));
      await userEvent.click(screen.getByRole('button', { name: 'Create workout plan' }));

      const alert = screen.getByRole('alert');
      expect(alert).toHaveTextContent('Give the plan a name.');
      expect(alert).toHaveTextContent('Day A: Add at least one exercise.');
      expect(screen.getByLabelText('Name of the plan')).toHaveAttribute('aria-invalid', 'true');
      expect(readPlans()).toHaveLength(1);
    });

    it('keeps an unsaved new plan as a draft until it is cancelled', async () => {
      await renderApp('/plans/new');

      await userEvent.click(screen.getByRole('button', { name: 'Empty plan' }));
      await userEvent.click(screen.getByRole('button', { name: 'Close exercise selection' }));
      await userEvent.clear(screen.getByLabelText('Name of the plan'));
      await userEvent.type(screen.getByLabelText('Name of the plan'), 'Unfinished');
      // The editor hides the navigation; leaving keeps the draft.
      await userEvent.click(screen.getByRole('button', { name: 'Back to plans' }));
      await userEvent.click(screen.getByRole('button', { name: 'Keep draft' }));
      await userEvent.click(screen.getByRole('button', { name: 'New workout plan' }));

      expect(screen.getByText('Your unsaved changes have been restored.')).toBeInTheDocument();
      expect(screen.getByLabelText('Name of the plan')).toHaveValue('Unfinished');

      await userEvent.click(screen.getByRole('button', { name: 'Back to plans' }));
      await userEvent.click(screen.getByRole('button', { name: 'Discard and leave' }));
      await userEvent.click(screen.getByRole('button', { name: 'New workout plan' }));
      expect(screen.getByRole('button', { name: 'Empty plan' })).toBeInTheDocument();
    });
  });

  describe('training diary', () => {
    const readWorkouts = () => JSON.parse(localStorage.getItem('workoutLog'));
    // Opens the dialog for a missed training and confirms it, optionally with a reason.
    async function recordMissed(reason) {
      await userEvent.click(screen.getByRole('button', { name: 'Record as missed' }));
      const dialog = within(screen.getByRole('dialog', { name: 'Record training as missed' }));
      if (reason) await userEvent.click(dialog.getByRole('button', { name: reason }));
      await userEvent.click(dialog.getByRole('button', { name: 'Record as missed' }));
    }

    it('starts a training from a plan, logs sets and keeps the entry', async () => {
      savePlans(savedPlans);
      await renderApp('/plans');

      await userEvent.click(screen.getByRole('button', { name: 'Train with Push' }));
      expect(screen.getByLabelText('Plan')).toHaveDisplayValue('Push');
      fireEvent.change(screen.getByLabelText('Date'), { target: { value: '2026-11-16' } });
      await userEvent.click(screen.getByRole('button', { name: 'Start training' }));

      expect(screen.getByRole('heading', { name: 'Push · Monday' })).toBeInTheDocument();
      await userEvent.clear(screen.getByLabelText('Set 1: kg'));
      await userEvent.type(screen.getByLabelText('Set 1: kg'), '62.5');
      // A set counts as done as soon as its repetitions are entered; no extra button.
      await userEvent.type(screen.getByLabelText('Set 1: Reps'), '8');
      expect(screen.getByText('1 of 4 sets')).toBeInTheDocument();
      await userEvent.click(screen.getByRole('button', { name: 'Finish training' }));

      // The summary after finishing.
      expect(screen.getByRole('heading', { level: 1, name: 'Training saved' })).toBeInTheDocument();
      expect(screen.getByText('1 of 4')).toBeInTheDocument();
      expect(screen.getByText('Bench Press: 3 sets fewer')).toBeInTheDocument();
      expect(readWorkouts()[0].finishedAt).toEqual(expect.any(String));
      await userEvent.click(screen.getByRole('button', { name: 'Done' }));
      expect(screen.getByRole('heading', { level: 1, name: 'Today' })).toBeInTheDocument();
      await userEvent.click(screen.getByRole('link', { name: 'All diary entries' }));

      expect(screen.getByRole('link', { name: 'Push · Monday' })).toBeInTheDocument();
      expect(screen.getByText(/Trained · 1 of 4 sets · 500 kg · Plan followed 25 %/)).toBeInTheDocument();
      const [workout] = readWorkouts();
      expect(workout).toMatchObject({ schemaVersion: 2, date: '2026-11-16', status: 'done', plan: { planId: 'plan1' } });
      expect(workout.exercises[0].sets[0]).toMatchObject({ weight: 62.5, reps: 8, completedAt: expect.any(String) });

      // Entries stay editable.
      await userEvent.click(screen.getByRole('link', { name: 'Push · Monday' }));
      expect(screen.getByLabelText('Set 1: Reps')).toHaveValue(8);
    });

    it('always starts with choosing the plan', async () => {
      savePlans(savedPlans);
      await renderApp('/diary');

      expect(screen.getByLabelText('Plan')).toHaveValue('');
      expect(screen.getByRole('button', { name: 'Start training' })).toBeDisabled();
      await userEvent.selectOptions(screen.getByLabelText('Plan'), 'plan2');
      expect(screen.getByRole('button', { name: 'Start training' })).toBeEnabled();
      expect(within(screen.getByLabelText('Training day')).getAllByRole('option').map(option => option.textContent)).toEqual([
        'Tuesday',
        'Friday',
      ]);
    });

    it('logs one-arm exercises per side and removes sets that were not done', async () => {
      const plan = templateToPlan(templateById('hypertrophy_fullbody_3'), 'en');
      savePlans([plan]);
      await renderApp(`/diary?plan=${plan.id}`);
      fireEvent.change(screen.getByLabelText('Date'), { target: { value: '2026-11-16' } });
      await userEvent.click(screen.getByRole('button', { name: 'Start training' }));

      const row = plan.days[0].entries.find(entry => entry.exerciseId === 'one_arm_dumbbell_row');
      expect(row).toBeDefined();
      const card = within(screen.getByText('One-arm dumbbell row').closest('li'));
      await userEvent.type(card.getByLabelText('Set 1 left: Reps'), '12');
      await userEvent.type(card.getByLabelText('Set 1 right: Reps'), '10');
      await userEvent.click(card.getByRole('button', { name: 'Remove set 3' }));

      const logged = JSON.parse(localStorage.getItem('workoutLog'))[0].exercises.find(
        exercise => exercise.exerciseId === 'one_arm_dumbbell_row'
      );
      expect(logged.perSide).toBe(true);
      expect(logged.sets).toHaveLength(row.sets.length - 1);
      expect(logged.sets[0].sides.left.reps).toBe(12);
      expect(logged.sets[0].sides.right.reps).toBe(10);
    });

    it('filters entries and week numbers by plan', async () => {
      savePlans(savedPlans);
      await renderApp('/diary?plan=plan1');
      await recordMissed();
      await userEvent.selectOptions(screen.getByLabelText('Plan'), 'plan2');
      await recordMissed();

      expect(screen.getAllByRole('link', { name: /^(Push|Legacy) · / })).toHaveLength(2);
      const filter = within(screen.getByRole('group', { name: 'Show plans' }));
      await userEvent.click(filter.getByRole('button', { name: 'Legacy' }));
      expect(screen.getAllByRole('link', { name: /^(Push|Legacy) · / }).map(link => link.textContent)).toEqual([
        expect.stringMatching(/^Legacy/),
      ]);
      await userEvent.click(filter.getByRole('button', { name: 'All plans' }));
      expect(screen.getAllByRole('link', { name: /^(Push|Legacy) · / })).toHaveLength(2);
    });

    it('records a missed day and a moved training', async () => {
      savePlans(savedPlans);
      await renderApp('/diary?plan=plan1');

      fireEvent.change(screen.getByLabelText('Date'), { target: { value: '2026-11-17' } });
      expect(screen.getByText(/it will be recorded as moved/)).toBeInTheDocument();
      await recordMissed('Ill');

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      expect(screen.getByText('Missed · Ill')).toBeInTheDocument();
      expect(readWorkouts()[0]).toMatchObject({ status: 'skipped', note: 'Ill', date: '2026-11-17' });

      await userEvent.click(screen.getByRole('button', { name: 'Start training' }));
      expect(screen.getByText('Moved (planned for Monday)')).toBeInTheDocument();
    });

    it('skips an exercise and adds another one during training', async () => {
      savePlans(savedPlans);
      await renderApp('/diary?plan=plan1');

      await userEvent.click(screen.getByRole('button', { name: 'Start training' }));
      await userEvent.click(screen.getByRole('button', { name: 'Skip Bench Press' }));
      await userEvent.click(screen.getByRole('button', { name: 'Add exercise' }));
      await userEvent.type(screen.getByLabelText('Search'), 'push-up');
      await userEvent.click(screen.getByRole('button', { name: 'Select Push-up' }));
      await userEvent.click(screen.getByRole('button', { name: 'Add (1)' }));

      const [workout] = readWorkouts();
      expect(workout.exercises.map(exercise => [exercise.exercise || exercise.exerciseId, exercise.skipped])).toEqual([
        ['Bench Press', true],
        ['push_up', false],
      ]);
    });

    it('says so when a training cannot be saved', async () => {
      savePlans(savedPlans);
      await renderApp('/diary?plan=plan1');
      const setItem = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('QuotaExceededError');
      });

      await recordMissed();

      expect(await screen.findByRole('alert')).toHaveTextContent('Not saved.');
      setItem.mockRestore();
    });

    it('opens the running training instead of starting a second one and discards an empty one', async () => {
      savePlans(savedPlans);
      await renderApp('/diary?plan=plan1');
      await userEvent.click(screen.getByRole('button', { name: 'Start training' }));
      const title = screen.getByRole('heading', { level: 1 }).textContent;
      expect(screen.getByText('0 of 4 sets')).toBeInTheDocument();
      const goToday = () =>
        userEvent.click(within(screen.getByRole('navigation', { name: 'Main navigation' })).getByRole('link', { name: 'Today' }));
      await goToday();

      const banner = within(screen.getByRole('region', { name: 'Training in progress' }));
      expect(banner.getByText(new RegExp(`^${title} · for \\d+ min$`))).toBeInTheDocument();
      // An empty training does not count as a training of this week.
      expect(within(screen.getByRole('region', { name: 'This week' })).getAllByRole('definition')[0]).toHaveTextContent('0');

      // Starting another plan opens the running training instead.
      await userEvent.click(screen.getByRole('link', { name: 'All diary entries' }));
      await userEvent.selectOptions(screen.getByLabelText('Plan'), 'plan2');
      await userEvent.click(screen.getByRole('button', { name: 'Start training' }));
      expect(screen.getByRole('heading', { level: 1, name: title })).toBeInTheDocument();
      expect(readWorkouts()).toHaveLength(1);

      await goToday();
      await userEvent.click(screen.getByRole('link', { name: 'All diary entries' }));
      await userEvent.click(screen.getByRole('button', { name: 'Discard' }));
      expect(readWorkouts()).toEqual([]);
      expect(screen.queryByRole('region', { name: 'Training in progress' })).not.toBeInTheDocument();
    });

    it('deletes an entry and can undo it', async () => {
      savePlans(savedPlans);
      await renderApp('/diary?plan=plan1');

      await recordMissed();
      await userEvent.click(screen.getByRole('button', { name: /^Delete entry of/ }));
      expect(readWorkouts()).toEqual([]);

      await userEvent.click(screen.getByRole('button', { name: 'Undo' }));
      expect(readWorkouts()).toHaveLength(1);
    });
  });

  describe('exercise overview', () => {
    it('shows the exercises of a muscle group from the own library', async () => {
      await renderApp('/exercises');

      await userEvent.click(screen.getByRole('link', { name: 'Chest' }));
      expect(
        screen.getByRole('heading', { name: 'Barbell bench press' })
      ).toBeInTheDocument();
      // The descriptions are loaded on demand.
      expect(
        await screen.findByText(/Back on the bench, feet planted/)
      ).toBeInTheDocument();
      expect(
        screen.getAllByRole('img', { name: /no image available/i }).length
      ).toBeGreaterThan(0);

      await userEvent.click(screen.getByRole('link', { name: 'Legs' }));
      expect(
        screen.getByRole('heading', { name: 'Barbell back squat' })
      ).toBeInTheDocument();
      expect(
        screen.queryByRole('heading', { name: 'Barbell bench press' })
      ).not.toBeInTheDocument();

      await userEvent.click(
        screen.getByRole('link', { name: /back to muscle groups/i })
      );
      expect(screen.getAllByRole('link', { name: 'Chest' })).toHaveLength(1);
    });

    it('sorts the exercises of a group by name', async () => {
      await renderApp('/exercises/arms');

      const names = screen
        .getAllByRole('heading', { level: 2 })
        .map(heading => heading.textContent);
      expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b, 'en')));
      expect(names).toContain('Hammer curl');
    });
  });

  describe('calendar and analysis', () => {
    it('opens the calendar and the analysis from the navigation', async () => {
      await renderApp('/today');
      // Every page renders its own navigation, so it is looked up again after each move.
      const navigation = () => within(screen.getByRole('navigation', { name: 'Main navigation' }));

      await userEvent.click(navigation().getByRole('link', { name: 'Calendar' }));
      expect(screen.getByRole('heading', { level: 1, name: 'Calendar' })).toBeInTheDocument();
      expect(screen.getByRole('grid')).toBeInTheDocument();

      await userEvent.click(navigation().getByRole('link', { name: 'Analysis' }));
      expect(screen.getByRole('heading', { level: 1, name: 'Analysis' })).toBeInTheDocument();
    });

    it('opens the analysis of one exercise', async () => {
      await renderApp('/analysis/exercise/barbell_squat');
      expect(screen.getByRole('heading', { level: 1, name: /Barbell back squat/ })).toBeInTheDocument();
    });
  });

  describe('today and settings', () => {
    it('shows the navigation with five areas', async () => {
      await renderApp('/today');
      const navigation = within(screen.getByRole('navigation', { name: 'Main navigation' }));
      expect(navigation.getAllByRole('link').map(link => link.textContent)).toEqual([
        'Today',
        'Calendar',
        'Plans',
        'Analysis',
        'Exercises',
      ]);
    });

    it('starts the training of an active plan with one tap', async () => {
      const plan = templateToPlan(templateById('hypertrophy_fullbody_3'), 'en');
      // Every weekday has a training day, so today is never a rest day in this test.
      plan.days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map(weekday => ({
        ...plan.days[0],
        id: `day-${weekday}`,
        weekday,
      }));
      savePlans([plan]);
      await renderApp('/today');

      await userEvent.click(screen.getByRole('button', { name: 'Start training' }));
      expect(JSON.parse(localStorage.getItem('workoutLog'))).toHaveLength(1);
      expect(screen.getByRole('heading', { name: /^Muscle building full body/ })).toBeInTheDocument();
    });

    it('chooses the figure in the settings', async () => {
      await renderApp('/settings');
      await userEvent.click(screen.getByRole('radio', { name: 'Woman' }));
      expect(localStorage.getItem('figure')).toBe('"female"');
    });
  });

  describe('archive', () => {
    it('archives a plan, keeps it out of the diary and can use it again', async () => {
      savePlans(savedPlans);
      await renderApp('/plans');

      await planAction('Push', 'Archive Push');
      expect(readPlans()[0].archived).toBe(true);
      expect(within(screen.getByRole('list', { name: 'Archived plans' })).getByRole('heading', { name: 'Push' })).toBeInTheDocument();

      await planAction('Push', 'Use Push again');
      expect(readPlans()[0].archived).toBe(false);
    });
  });

  describe('language', () => {
    it('switches the app to German and loads German exercise names', async () => {
      await renderApp('/settings');

      await userEvent.click(screen.getByRole('radio', { name: 'Deutsch' }));
      expect(localStorage.getItem('language')).toBe('"de"');

      await userEvent.click(screen.getByRole('link', { name: 'Übungen' }));
      await userEvent.click(screen.getByRole('link', { name: 'Brust' }));
      expect(
        screen.getByRole('heading', { name: 'Langhantel-Bankdrücken' })
      ).toBeInTheDocument();
      expect(
        await screen.findByText(/Rücken auf der Bank, Füße fest am Boden/)
      ).toBeInTheDocument();

      expect(
        screen.getByRole('link', { name: 'Pläne' })
      ).toBeInTheDocument();
      expect(document.documentElement.lang).toBe('de');
    });
  });

  describe('older versions', () => {
    it('takes over plans saved under the old storage key', async () => {
      localStorage.setItem(LEGACY_STORAGE_KEY, JSON.stringify(savedPlans));
      await renderApp('/plans');

      expect(screen.getByRole('heading', { name: 'Push' })).toBeInTheDocument();
      await planAction('Push', 'Delete workout plan Push');
      expect(readPlans().map(plan => plan.id)).toEqual(['plan2']);
    });

    it.each([
      ['/home', 'link', 'Chest'],
      ['/Workoutplans', 'button', /new workout plan/i],
      ['/Create_Plan', 'button', /empty plan/i],
    ])('redirects %s to the new page', async (path, role, name) => {
      await renderApp(path);
      expect(screen.getByRole(role, { name })).toBeInTheDocument();
    });

    it('opens a muscle group directly by its address', async () => {
      await renderApp('/exercises/chest');
      expect(
        screen.getByRole('heading', { name: 'Barbell bench press' })
      ).toBeInTheDocument();
    });

    it('sends unknown addresses to a sensible page', async () => {
      await renderApp('/exercises/tail');
      expect(screen.getAllByRole('link', { name: 'Chest' })).toHaveLength(1);
    });
  });
});
