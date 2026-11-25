import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Route, Routes } from 'react-router-dom';
import PlanViewPage from './PlanViewPage';
import WorkoutPlanCard from '../components/workoutPlans/WorkoutPlanCard';
import { UndoProvider } from '../components/ui/UndoProvider';
import { renderWithProviders } from '../test-utils';
import { templateById, templateToPlan } from '../data/planTemplates';
import { routes } from '../routes';

const templatePlan = () => ({ ...templateToPlan(templateById('hypertrophy_fullbody_3'), 'en'), id: 'p1' });

describe('PlanViewPage', () => {
  beforeEach(() => localStorage.clear());

  it('shows the days with all exercises, the muscle load and the template hints', () => {
    renderWithProviders(<PlanViewPage plans={[templatePlan()]} planId="p1" />);

    expect(screen.getByRole('heading', { level: 1, name: 'Muscle building full body, 3 days' })).toBeInTheDocument();
    const days = within(screen.getByRole('region', { name: 'Training days' }));
    expect(days.getAllByRole('heading', { level: 3 }).map(heading => heading.textContent)).toEqual([
      'Monday',
      'Wednesday',
      'Friday',
    ]);
    // Days are open from the start: the exercises are visible without a tap.
    expect(days.getByRole('list', { name: 'Exercises of Monday' })).toHaveTextContent(/Goblet squat/i);
    expect(screen.getByRole('heading', { name: 'Muscle load' })).toBeInTheDocument();
    expect(screen.getByRole('region', { name: 'Notes from the template' })).toHaveTextContent(/Double progression/);
    // No editing on this page.
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
  });

  it('calls onTrain and onEdit with the plan', async () => {
    const onTrain = vi.fn();
    const onEdit = vi.fn();
    renderWithProviders(<PlanViewPage plans={[templatePlan()]} planId="p1" onTrain={onTrain} onEdit={onEdit} />);
    const name = 'Muscle building full body, 3 days';

    await userEvent.click(screen.getByRole('button', { name: `Train with ${name}` }));
    expect(onTrain).toHaveBeenCalledWith(expect.objectContaining({ id: 'p1' }));
    await userEvent.click(screen.getByRole('button', { name: `Edit workout plan ${name}` }));
    expect(onEdit).toHaveBeenCalledWith(expect.objectContaining({ id: 'p1' }));
  });

  it('reads the plan from the address and opens the editor by default', async () => {
    renderWithProviders(
      <Routes>
        <Route path="/plans/:planId" element={<PlanViewPage plans={[templatePlan()]} />} />
        <Route path="/plans/:planId/edit" element={<p>Editor open</p>} />
      </Routes>,
      { route: routes.planView('p1') }
    );

    await userEvent.click(screen.getByRole('button', { name: /^Edit workout plan/ }));
    expect(screen.getByText('Editor open')).toBeInTheDocument();
  });

  it('offers no training for an archived plan', () => {
    renderWithProviders(<PlanViewPage plans={[{ ...templatePlan(), archived: true }]} planId="p1" />);
    expect(screen.queryByRole('button', { name: /^Train with/ })).not.toBeInTheDocument();
    expect(screen.getByText(/This plan is archived/)).toBeInTheDocument();
  });

  it('says so when the plan does not exist', () => {
    renderWithProviders(<PlanViewPage plans={[]} planId="missing" />);
    expect(screen.getByRole('alert')).toHaveTextContent('This workout plan does not exist.');
    expect(screen.getByRole('link', { name: 'Back to my workout plans' })).toHaveAttribute('href', routes.plans);
  });

  it('is opened from the plan name in the plan list', async () => {
    renderWithProviders(
      <UndoProvider>
        <Routes>
          <Route path={routes.plans} element={<WorkoutPlanCard plan={templatePlan()} />} />
          <Route path="/plans/:planId" element={<PlanViewPage plans={[templatePlan()]} />} />
        </Routes>
      </UndoProvider>,
      { route: routes.plans }
    );

    const link = screen.getByRole('link', { name: 'Muscle building full body, 3 days' });
    expect(link).toHaveAttribute('href', routes.planView('p1'));
    await userEvent.click(link);
    expect(screen.getByRole('region', { name: 'Training days' })).toBeInTheDocument();
  });

  it('marks supersets', () => {
    const plan = templatePlan();
    const [first, second, ...rest] = plan.days[0].entries;
    plan.days[0].entries = [{ ...first, groupId: 'g', restSeconds: 0 }, { ...second, groupId: 'g' }, ...rest];
    renderWithProviders(<PlanViewPage plans={[plan]} planId="p1" />);
    const monday = within(screen.getByRole('list', { name: 'Exercises of Monday' }));
    expect(monday.getAllByLabelText('Superset A').map(tag => tag.textContent)).toEqual(['A1', 'A2']);
    expect(monday.getByText(/straight on, no rest/)).toBeInTheDocument();
  });

  it('shows plans saved by older versions', () => {
    const oldPlan = {
      id: 'old',
      nameOfWorkout: 'Old plan',
      days: [{ day: 'monday', muscles: [{ name: 'Chest', exercises: [{ exercise: 'Bench', sets: '3', repetitions: '10' }] }] }],
    };
    renderWithProviders(<PlanViewPage plans={[oldPlan]} planId="old" />);
    expect(screen.getByRole('heading', { level: 1, name: 'Old plan' })).toBeInTheDocument();
    expect(screen.getByRole('list', { name: 'Exercises of Monday' })).toHaveTextContent('Bench');
    expect(screen.queryByRole('region', { name: 'Notes from the template' })).not.toBeInTheDocument();
  });
});
