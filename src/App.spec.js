import { act, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';
import { mockWgerFetch, renderWithProviders } from './test-utils';

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

// Renders the app and waits until the exercise request has settled.
async function renderApp(route) {
  renderWithProviders(<App />, { route });
  await act(() => new Promise(resolve => setTimeout(resolve, 0)));
}

function savePlans(plans) {
  localStorage.setItem('data', JSON.stringify(plans));
}

function readPlans() {
  return JSON.parse(localStorage.getItem('data'));
}

describe('App', () => {
  beforeEach(() => {
    localStorage.clear();
    mockWgerFetch();
    window.confirm = jest.fn(() => true);
  });

  afterEach(() => {
    delete global.fetch;
    delete window.confirm;
  });

  describe('workout plans page', () => {
    it('shows a hint when there are no plans', async () => {
      await renderApp('/Workoutplans');
      expect(
        screen.getByText(/you have no workout plans yet/i)
      ).toBeInTheDocument();
    });

    it('shows a plan with its days, muscles and exercises', async () => {
      savePlans(savedPlans);
      await renderApp('/Workoutplans');

      userEvent.click(screen.getByRole('button', { name: 'Show Push' }));
      expect(screen.getByText('Chest and arms')).toBeInTheDocument();
      userEvent.click(screen.getByRole('button', { name: 'Show Monday' }));
      userEvent.click(screen.getByRole('button', { name: 'Show Chest' }));
      expect(screen.getByText('Bench Press')).toBeInTheDocument();
      expect(screen.getByText('60 kg')).toBeInTheDocument();
    });

    it('shows plans saved by older versions without crashing', async () => {
      savePlans(savedPlans);
      await renderApp('/Workoutplans');

      userEvent.click(screen.getByRole('button', { name: 'Show Legacy' }));
      const dayButtons = screen.getAllByRole('button', { name: /^Show / });
      expect(dayButtons.map(button => button.getAttribute('aria-label'))).toEqual(
        ['Show Push', 'Show Tuesday', 'Show Friday']
      );

      userEvent.click(screen.getByRole('button', { name: 'Show Friday' }));
      userEvent.click(screen.getByRole('button', { name: 'Show Tuesday' }));
      userEvent.click(screen.getByRole('button', { name: 'Show Abs' }));
      expect(screen.getByText('Crunch')).toBeInTheDocument();
    });

    it('deletes a day only from its own plan', async () => {
      savePlans(savedPlans);
      await renderApp('/Workoutplans');

      userEvent.click(screen.getByRole('button', { name: 'Show Legacy' }));
      userEvent.click(screen.getByRole('button', { name: 'Delete Friday' }));

      expect(window.confirm).toHaveBeenCalledWith(
        'Do you really want to delete Friday from "Legacy"?'
      );
      const [push, legacy] = readPlans();
      expect(push).toEqual(savedPlans[0]);
      expect(legacy.days.map(day => day.id)).toEqual(['p2-tue']);
      expect(
        screen.queryByRole('button', { name: 'Delete Friday' })
      ).not.toBeInTheDocument();
    });

    it('deletes a whole plan', async () => {
      savePlans(savedPlans);
      await renderApp('/Workoutplans');

      userEvent.click(
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
      window.confirm = jest.fn(() => false);
      savePlans(savedPlans);
      await renderApp('/Workoutplans');

      userEvent.click(
        screen.getByRole('button', { name: 'Delete workout plan Push' })
      );
      userEvent.click(screen.getByRole('button', { name: 'Show Legacy' }));
      userEvent.click(screen.getByRole('button', { name: 'Delete Friday' }));

      expect(window.confirm).toHaveBeenCalledTimes(2);
      expect(readPlans()).toEqual(savedPlans);
      expect(screen.getByRole('heading', { name: 'Push' })).toBeInTheDocument();
    });
  });

  describe('editing a plan', () => {
    it('changes an exercise and saves the plan in place', async () => {
      savePlans(savedPlans);
      await renderApp('/Workoutplans');

      userEvent.click(
        screen.getByRole('button', { name: 'Edit workout plan Push' })
      );
      userEvent.click(screen.getByRole('button', { name: /edit bench press/i }));
      userEvent.clear(screen.getByLabelText(/weight/i));
      userEvent.type(screen.getByLabelText(/weight/i), '65');
      userEvent.click(screen.getByRole('button', { name: /save exercise/i }));
      userEvent.click(screen.getByRole('button', { name: /save changes/i }));

      expect(screen.getByRole('heading', { name: 'Push' })).toBeInTheDocument();
      const [push, legacy] = readPlans();
      expect(push.id).toBe('plan1');
      expect(push.days[0].muscles[0].exercises[0]).toMatchObject({
        id: 'e1',
        exercise: 'Bench Press',
        weight: '65',
      });
      expect(legacy).toEqual(savedPlans[1]);
    });

    it('edits a plan saved by an older version', async () => {
      savePlans(savedPlans);
      await renderApp('/Workoutplans/plan2/edit');

      expect(
        within(screen.getByRole('list', { name: 'Tuesday' })).getByText('Crunch')
      ).toBeInTheDocument();
      expect(screen.getByText(/no exercises added yet/i)).toBeInTheDocument();

      userEvent.click(screen.getByRole('button', { name: /save changes/i }));
      expect(screen.getByRole('alert')).toHaveTextContent(
        'Add at least one exercise for: Friday'
      );
    });

    it('shows a message for an unknown plan', async () => {
      await renderApp('/Workoutplans/missing/edit');

      expect(screen.getByRole('alert')).toHaveTextContent(
        /this workout plan does not exist/i
      );
      userEvent.click(
        screen.getByRole('link', { name: /back to my workout plans/i })
      );
      expect(
        screen.getByText(/you have no workout plans yet/i)
      ).toBeInTheDocument();
    });
  });

  it('creates a plan and shows it on the plans page', async () => {
    await renderApp('/Create_Plan');

    userEvent.type(screen.getByLabelText(/Workout plan name/i), 'Legs');
    userEvent.click(screen.getByLabelText('Saturday'));
    userEvent.click(screen.getByRole('button', { name: /create/i }));

    userEvent.selectOptions(screen.getByLabelText(/muscle/i), 'Legs');
    userEvent.type(screen.getByLabelText(/exercise:/i), 'Squat');
    userEvent.type(screen.getByLabelText(/weight/i), '80');
    userEvent.type(screen.getByLabelText(/repetitions/i), '5');
    userEvent.type(screen.getByLabelText(/sets/i), '5');
    userEvent.click(screen.getByRole('button', { name: /add exercise/i }));
    userEvent.click(screen.getByRole('button', { name: /save workout plan/i }));

    expect(screen.getByRole('heading', { name: 'Legs' })).toBeInTheDocument();
    expect(readPlans()).toHaveLength(1);
    expect(readPlans()[0].days[0].muscles[0].exercises[0].exercise).toBe(
      'Squat'
    );
  });

  describe('exercise overview', () => {
    it('loads the exercises of a muscle group from wger', async () => {
      await renderApp('/home');

      userEvent.click(screen.getByRole('button', { name: 'Chest' }));
      expect(
        await screen.findByRole('heading', { name: 'Bench Press' })
      ).toBeInTheDocument();
      expect(screen.getByText('Lie on the bench.')).toBeInTheDocument();
      expect(screen.getByRole('img', { name: 'Bench Press' })).toHaveAttribute(
        'src',
        'https://wger.de/bench.png'
      );

      userEvent.click(screen.getByRole('button', { name: 'Legs' }));
      expect(
        screen.getByRole('heading', { name: 'Squat' })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('img', { name: /no image available/i })
      ).toBeInTheDocument();

      userEvent.click(
        screen.getByRole('button', { name: /back to muscle groups/i })
      );
      expect(screen.getAllByRole('button', { name: 'Chest' })).toHaveLength(1);
    });

    it('shows an error and loads again on retry', async () => {
      mockWgerFetch({ fail: true });
      await renderApp('/home');

      userEvent.click(screen.getByRole('button', { name: 'Chest' }));
      expect(await screen.findByRole('alert')).toHaveTextContent(
        /could not be loaded/i
      );

      mockWgerFetch();
      userEvent.click(screen.getByRole('button', { name: /try again/i }));
      expect(
        await screen.findByRole('heading', { name: 'Bench Press' })
      ).toBeInTheDocument();
    });
  });

  describe('language', () => {
    it('switches the app to German and loads German exercise names', async () => {
      await renderApp('/home');

      userEvent.click(
        screen.getByRole('button', { name: /switch language to german/i })
      );
      expect(localStorage.getItem('language')).toBe('"de"');

      userEvent.click(screen.getByRole('button', { name: 'Brust' }));
      expect(
        await screen.findByRole('heading', { name: 'Bankdrücken' })
      ).toBeInTheDocument();

      const nav = screen.getByRole('navigation');
      expect(
        within(nav).getByRole('link', { name: 'Meine Trainingspläne' })
      ).toBeInTheDocument();
    });
  });
});
