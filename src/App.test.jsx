import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';
import { renderWithProviders } from './test-utils';
import { LEGACY_STORAGE_KEY, STORAGE_KEY } from './storage/localPlanStore';
import { migratePlan } from './utils/workoutPlan';
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

    it('shows a plan with its days, muscles and exercises', async () => {
      savePlans(savedPlans);
      await renderApp('/plans');

      await userEvent.click(screen.getByRole('button', { name: 'Show Push' }));
      expect(screen.getByText('Chest and arms')).toBeInTheDocument();
      await userEvent.click(screen.getByRole('button', { name: 'Show Monday' }));
      await userEvent.click(screen.getByRole('button', { name: 'Show Chest' }));
      expect(screen.getByText('Bench Press')).toBeInTheDocument();
      expect(screen.getByText('60 kg')).toBeInTheDocument();
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
      await userEvent.click(screen.getByRole('button', { name: 'Show Abs' }));
      expect(screen.getByText('Crunch')).toBeInTheDocument();
    });

    it('deletes a day only from its own plan', async () => {
      savePlans(savedPlans);
      await renderApp('/plans');

      await userEvent.click(screen.getByRole('button', { name: 'Show Legacy' }));
      await userEvent.click(screen.getByRole('button', { name: 'Delete Friday' }));

      expect(window.confirm).toHaveBeenCalledWith(
        'Do you really want to delete Friday from "Legacy"?'
      );
      const [push, legacy] = readPlans();
      expect(push).toEqual(migratePlan(savedPlans[0]));
      expect(legacy.days.map(day => day.id)).toEqual(['p2-tue']);
      expect(
        screen.queryByRole('button', { name: 'Delete Friday' })
      ).not.toBeInTheDocument();
    });

    it('deletes a whole plan', async () => {
      savePlans(savedPlans);
      await renderApp('/plans');

      await userEvent.click(
        screen.getByRole('button', { name: 'Delete workout plan Push' })
      );

      expect(window.confirm).toHaveBeenCalledWith(
        'Do you really want to delete the workout plan "Push"?'
      );
      expect(readPlans().map(plan => plan.id)).toEqual(['plan2']);
      expect(
        screen.queryByRole('heading', { name: 'Push' })
      ).not.toBeInTheDocument();
    });

    it('keeps plan and day when deleting is cancelled', async () => {
      window.confirm = vi.fn(() => false);
      savePlans(savedPlans);
      await renderApp('/plans');

      await userEvent.click(
        screen.getByRole('button', { name: 'Delete workout plan Push' })
      );
      await userEvent.click(screen.getByRole('button', { name: 'Show Legacy' }));
      await userEvent.click(screen.getByRole('button', { name: 'Delete Friday' }));

      expect(window.confirm).toHaveBeenCalledTimes(2);
      expect(readPlans()).toEqual(savedPlans);
      expect(screen.getByRole('heading', { name: 'Push' })).toBeInTheDocument();
    });

    it('offers to delete the whole plan when its last day is deleted', async () => {
      savePlans(savedPlans);
      await renderApp('/plans');

      await userEvent.click(screen.getByRole('button', { name: 'Show Push' }));
      await userEvent.click(screen.getByRole('button', { name: 'Delete Monday' }));

      expect(window.confirm).toHaveBeenCalledWith(
        'Monday is the last day of "Push". Do you want to delete the whole workout plan?'
      );
      expect(readPlans().map(plan => plan.id)).toEqual(['plan2']);
      expect(
        screen.queryByRole('heading', { name: 'Push' })
      ).not.toBeInTheDocument();
    });

    it('keeps the plan when deleting its last day is cancelled', async () => {
      window.confirm = vi.fn(() => false);
      savePlans(savedPlans);
      await renderApp('/plans');

      await userEvent.click(screen.getByRole('button', { name: 'Show Push' }));
      await userEvent.click(screen.getByRole('button', { name: 'Delete Monday' }));

      expect(readPlans()).toEqual(savedPlans);
      expect(
        screen.getByRole('button', { name: 'Delete Monday' })
      ).toBeInTheDocument();
    });
  });

  describe('plans copied from a template', () => {
    it('shows cardio and boxing exercises under Other with their targets', async () => {
      const plan = templateToPlan(templateById('boxing_technical_3'), 'en');
      savePlans([plan]);
      await renderApp('/plans');

      await userEvent.click(screen.getByRole('button', { name: `Show ${plan.nameOfWorkout}` }));
      const day = plan.days.find(item => item.entries.some(entry => entry.muscle === 'other'));
      const dayName = day.day[0].toUpperCase() + day.day.slice(1);
      await userEvent.click(screen.getByRole('button', { name: `Show ${dayName}` }));
      await userEvent.click(screen.getByRole('button', { name: 'Show Other' }));

      const entry = day.entries.find(item => item.muscle === 'other');
      expect(screen.getByText(entry.exercise)).toBeInTheDocument();
    });

    it('shows the repetitions in reserve of a template exercise', async () => {
      const plan = templateToPlan(templateById('hypertrophy_fullbody_3'), 'en');
      savePlans([plan]);
      await renderApp('/plans');

      await userEvent.click(screen.getByRole('button', { name: `Show ${plan.nameOfWorkout}` }));
      await userEvent.click(screen.getByRole('button', { name: 'Show Monday' }));
      await userEvent.click(screen.getByRole('button', { name: 'Show Legs' }));
      expect(screen.getAllByText('Reps in reserve:').length).toBeGreaterThan(0);
    });
  });

  describe('editing a plan', () => {
    it('changes an exercise and saves the plan in place', async () => {
      savePlans(savedPlans);
      await renderApp('/plans');

      await userEvent.click(
        screen.getByRole('button', { name: 'Edit workout plan Push' })
      );
      await userEvent.click(screen.getByRole('button', { name: /edit bench press/i }));
      await userEvent.clear(screen.getByLabelText(/weight/i));
      await userEvent.type(screen.getByLabelText(/weight/i), '65');
      await userEvent.click(screen.getByRole('button', { name: /save exercise/i }));
      await userEvent.click(screen.getByRole('button', { name: /save changes/i }));

      expect(screen.getByRole('heading', { name: 'Push' })).toBeInTheDocument();
      const [push, legacy] = readPlans();
      expect(push.id).toBe('plan1');
      expect(push.days[0].entries[0]).toMatchObject({
        id: 'e1',
        exercise: 'Bench Press',
        weight: 65,
      });
      expect(legacy).toMatchObject({
        id: 'plan2',
        days: [
          { id: 'p2-fri', entries: [] },
          { id: 'p2-tue', entries: [{ exercise: 'Crunch', muscle: 'abs' }] },
        ],
      });
    });

    it('edits a plan saved by an older version', async () => {
      savePlans(savedPlans);
      await renderApp('/plans/plan2/edit');

      expect(
        within(screen.getByRole('list', { name: 'Tuesday' })).getByText('Crunch')
      ).toBeInTheDocument();
      expect(screen.getByText(/no exercises added yet/i)).toBeInTheDocument();

      await userEvent.click(screen.getByRole('button', { name: /save changes/i }));
      expect(screen.getByRole('alert')).toHaveTextContent(
        'Add at least one exercise for: Friday'
      );
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

  it('creates a plan and shows it on the plans page', async () => {
    await renderApp('/plans/new');

    await userEvent.type(screen.getByLabelText(/Workout plan name/i), 'Legs');
    await userEvent.click(screen.getByLabelText('Saturday'));
    await userEvent.click(screen.getByRole('button', { name: /next/i }));

    await userEvent.type(screen.getByLabelText(/exercise:/i), 'Barbell squat');
    await userEvent.type(screen.getByLabelText(/repetitions from/i), '5');
    await userEvent.type(screen.getByLabelText(/sets/i), '5');
    await userEvent.type(screen.getByLabelText(/weight/i), '80');
    await userEvent.click(screen.getByRole('button', { name: /add exercise/i }));
    await userEvent.click(screen.getByRole('button', { name: /save workout plan/i }));

    expect(screen.getByRole('heading', { name: 'Legs' })).toBeInTheDocument();
    expect(readPlans()).toHaveLength(1);
    expect(readPlans()[0].days[0].entries[0]).toMatchObject({
      exerciseId: 'barbell_squat',
      muscle: 'legs',
      weight: 80,
    });
  });

  describe('exercise overview', () => {
    it('shows the exercises of a muscle group from the own library', async () => {
      await renderApp('/exercises');

      await userEvent.click(screen.getByRole('link', { name: 'Chest' }));
      expect(
        screen.getByRole('heading', { name: 'Barbell bench press' })
      ).toBeInTheDocument();
      expect(
        screen.getByText(/Lower the bar under control to your lower chest/)
      ).toBeInTheDocument();
      expect(
        screen.getAllByRole('img', { name: /no image available/i }).length
      ).toBeGreaterThan(0);

      await userEvent.click(screen.getByRole('link', { name: 'Legs' }));
      expect(
        screen.getByRole('heading', { name: 'Barbell squat' })
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
        .getAllByRole('heading', { level: 3 })
        .map(heading => heading.textContent);
      expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b, 'en')));
      expect(names).toContain('Hammer curl');
    });
  });

  describe('language', () => {
    it('switches the app to German and loads German exercise names', async () => {
      await renderApp('/exercises');

      await userEvent.click(
        screen.getByRole('button', { name: /switch language to german/i })
      );
      expect(localStorage.getItem('language')).toBe('"de"');

      await userEvent.click(screen.getByRole('link', { name: 'Brust' }));
      expect(
        screen.getByRole('heading', { name: 'Langhantel-Bankdrücken' })
      ).toBeInTheDocument();
      expect(
        screen.getByText(/Die Stange kontrolliert zur unteren Brust senken/)
      ).toBeInTheDocument();

      expect(
        screen.getByRole('link', { name: 'Meine Trainingspläne' })
      ).toBeInTheDocument();
      expect(document.documentElement.lang).toBe('de');
    });
  });

  describe('older versions', () => {
    it('takes over plans saved under the old storage key', async () => {
      localStorage.setItem(LEGACY_STORAGE_KEY, JSON.stringify(savedPlans));
      await renderApp('/plans');

      expect(screen.getByRole('heading', { name: 'Push' })).toBeInTheDocument();
      await userEvent.click(
        screen.getByRole('button', { name: 'Delete workout plan Push' })
      );
      expect(readPlans().map(plan => plan.id)).toEqual(['plan2']);
    });

    it.each([
      ['/home', 'link', 'Chest'],
      ['/Workoutplans', 'button', /create new workoutplan/i],
      ['/Create_Plan', 'button', /next/i],
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
