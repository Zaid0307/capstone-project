import { useState } from 'react';
import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Route, Routes, useLocation } from 'react-router-dom';
import CalendarPage from './CalendarPage';
import { UndoProvider } from '../components/ui/UndoProvider';
import { renderWithProviders } from '../test-utils';
import { TODAY, samplePlans, sampleWorkouts } from '../components/analysis/sampleData';

function LocationProbe() {
  const location = useLocation();
  return <div data-testid="location">{location.pathname + location.search}</div>;
}

function renderCalendar({ plans = samplePlans(), workouts = sampleWorkouts(), route = '/calendar' } = {}) {
  renderWithProviders(
    <Routes>
      <Route
        path="/calendar"
        element={
          <>
            <CalendarPage plans={plans} workouts={workouts} today={TODAY} />
            <LocationProbe />
          </>
        }
      />
    </Routes>,
    { route }
  );
}

// Calendar with a diary in state, as App.jsx wires it.
function EditableCalendar({ initialWorkouts }) {
  const [workouts, setWorkouts] = useState(initialWorkouts);
  return (
    <UndoProvider>
      <CalendarPage
        plans={samplePlans()}
        workouts={workouts}
        today={TODAY}
        onAddWorkout={workout => setWorkouts(current => [...current, workout])}
        onDeleteWorkout={workoutId => setWorkouts(current => current.filter(workout => workout.id !== workoutId))}
      />
      <output data-testid="workouts">{JSON.stringify(workouts)}</output>
    </UndoProvider>
  );
}

function renderEditable(route) {
  renderWithProviders(
    <Routes>
      <Route path="/calendar" element={<EditableCalendar initialWorkouts={sampleWorkouts()} />} />
    </Routes>,
    { route }
  );
}

const storedWorkouts = () => JSON.parse(screen.getByTestId('workouts').textContent);

const location = () => screen.getByTestId('location').textContent;
const grid = () => screen.getByRole('grid');
const day = name => within(grid()).getByRole('button', { name });

describe('CalendarPage', () => {
  it('shows an empty month without data', () => {
    renderCalendar({ plans: [], workouts: [] });
    expect(screen.getByRole('heading', { level: 2, name: 'November 2026' })).toBeInTheDocument();
    expect(within(grid()).getAllByRole('button')).toHaveLength(42);
    expect(day(/^Today, Friday, November 13, Rest day$/)).toHaveAttribute('aria-current', 'date');
    expect(screen.getByText('No entries in November 2026.')).toBeInTheDocument();
    expect(screen.getByRole('list', { name: 'Legend' })).toHaveTextContent('On plan');
  });

  it('shows the status of each day with text', () => {
    renderCalendar();
    expect(day(/November 9, With deviations: Strength · Day A/)).toBeInTheDocument();
    expect(day(/November 5, Missed: Strength · Day B \(Reason: sick\)/)).toBeInTheDocument();
    expect(day(/November 7, Missed: Mobility · Flow/)).toBeInTheDocument();
    expect(day(/November 11, Other training: Free training/)).toBeInTheDocument();
    // Thursday of the running week is still open, Saturday is ahead.
    expect(day(/November 12, Planned: Strength · Day B/)).toBeInTheDocument();
    expect(day(/November 14, Planned: Mobility · Flow/)).toBeInTheDocument();
  });

  it('shows plan versus actual of a chosen day and puts the day in the URL', async () => {
    renderCalendar();
    await userEvent.click(day(/November 9,/));
    expect(location()).toContain('day=2026-11-09');
    const details = screen.getByRole('region', { name: 'Monday, November 9' });
    expect(within(details).getByText('Strength · Day A – done')).toBeInTheDocument();
    const table = within(details).getByRole('table', { name: /Barbell bench press/ });
    expect(within(table).getAllByRole('columnheader').map(cell => cell.textContent)).toEqual(['Set', 'Target', 'Actual', 'Result']);
    // 77.5 kg is more than 105 % of the planned 60 kg.
    expect(within(table).getAllByText('more than planned')).toHaveLength(2);
    expect(within(table).getByText('77.5 kg × 6')).toBeInTheDocument();
    expect(within(table).getByText('too few reps')).toBeInTheDocument();
    expect(within(table).getAllByText('60 kg × 8–12 reps')).toHaveLength(3);
    expect(within(details).getByRole('link', { name: 'Open workout' })).toHaveAttribute('href', '/diary/bench-7');
  });

  it('offers to log a training on an empty past day', async () => {
    renderCalendar();
    await userEvent.click(day(/November 10,/));
    const details = screen.getByRole('region', { name: 'Tuesday, November 10' });
    expect(within(details).getByText('Rest day – no training entered.')).toBeInTheDocument();
    expect(within(details).getByRole('link', { name: 'Log training' })).toHaveAttribute('href', '/diary');
  });

  it('moves between days and months with the keyboard', async () => {
    renderCalendar({ route: '/calendar?day=2026-11-09' });
    const monday = day(/November 9,/);
    expect(monday).toHaveAttribute('tabindex', '0');
    monday.focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(location()).toContain('day=2026-11-10');
    expect(day(/November 10,/)).toHaveFocus();
    await userEvent.keyboard('{ArrowDown}');
    expect(day(/November 17,/)).toHaveFocus();
    await userEvent.keyboard('{End}');
    expect(day(/November 22,/)).toHaveFocus();
    await userEvent.keyboard('{PageDown}');
    expect(screen.getByRole('heading', { level: 2, name: 'December 2026' })).toBeInTheDocument();
    expect(location()).toContain('month=2026-12');
    expect(day(/December 22,/)).toHaveFocus();
    await userEvent.keyboard('{ArrowLeft}');
    expect(day(/December 21,/)).toHaveFocus();
  });

  it('filters by plans through the URL', async () => {
    renderCalendar();
    await userEvent.click(screen.getByRole('button', { name: 'Mobility' }));
    expect(location()).toContain('plans=mobility');
    expect(day(/November 9, Rest day/)).toBeInTheDocument();
    expect(day(/November 7, Missed: Mobility · Flow/)).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'All plans' }));
    expect(location()).not.toContain('plans=');
    expect(day(/November 9, With deviations/)).toBeInTheDocument();
  });

  it('lists the entries of the month by week, newest first', () => {
    renderCalendar();
    const list = screen.getByRole('list', { name: 'Entries in November 2026' });
    const headings = within(list).getAllByRole('heading', { level: 3 }).map(heading => heading.textContent);
    expect(headings[0]).toBe('Week 46 · 2 workouts · 1/3 planned');
    expect(headings[1]).toBe('Week 45 · 2 workouts · 1/3 planned');
    const links = within(list).getAllByRole('link').map(link => link.getAttribute('href'));
    expect(links.slice(0, 2)).toEqual(['/diary/free-1', '/diary/bench-7']);
  });

  it('offers no changes without the diary actions', async () => {
    renderCalendar({ route: '/calendar?day=2026-11-12' });
    const details = screen.getByRole('region', { name: 'Thursday, November 12' });
    expect(within(details).queryByRole('button', { name: 'Record as missed' })).not.toBeInTheDocument();
    await userEvent.click(day(/November 9,/));
    expect(screen.queryByRole('button', { name: /^Delete/ })).not.toBeInTheDocument();
  });

  it('records a planned day as missed with a reason', async () => {
    renderEditable('/calendar?day=2026-11-12');
    const details = () => screen.getByRole('region', { name: 'Thursday, November 12' });
    const opener = within(details()).getByRole('button', { name: 'Record as missed' });

    await userEvent.click(opener);
    let dialog = screen.getByRole('dialog', { name: 'Record training as missed' });
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAccessibleDescription(/Strength · Day B/);
    expect(within(dialog).getByRole('button', { name: 'Ill' })).toHaveFocus();
    await userEvent.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    await waitFor(() => expect(opener).toHaveFocus());

    await userEvent.click(opener);
    dialog = within(screen.getByRole('dialog'));
    await userEvent.click(dialog.getByRole('button', { name: 'Injured' }));
    await userEvent.click(dialog.getByRole('button', { name: 'Ill' }));
    expect(dialog.getByRole('button', { name: 'Ill' })).toHaveAttribute('aria-pressed', 'true');
    expect(dialog.getByRole('button', { name: 'Injured' })).toHaveAttribute('aria-pressed', 'false');
    await userEvent.type(dialog.getByLabelText('Details (optional)'), 'cold');
    await userEvent.click(dialog.getByRole('button', { name: 'Record as missed' }));

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(storedWorkouts().at(-1)).toMatchObject({ status: 'skipped', date: '2026-11-12', note: 'Ill: cold', plan: { planId: 'strength' } });
    expect(within(details()).getByText('Strength · Day B – missed (reason: Ill: cold)')).toBeInTheDocument();
    expect(within(details()).queryByRole('button', { name: 'Record as missed' })).not.toBeInTheDocument();
    expect(day(/November 12, Missed: Strength · Day B \(Reason: Ill: cold\)/)).toBeInTheDocument();
    await waitFor(() => expect(within(details()).getByRole('heading', { level: 3 })).toHaveFocus());
  });

  it('does not offer to record future or already recorded days as missed', async () => {
    renderEditable('/calendar?day=2026-11-14');
    expect(screen.queryByRole('button', { name: 'Record as missed' })).not.toBeInTheDocument();
    await userEvent.click(day(/November 5,/));
    expect(screen.queryByRole('button', { name: 'Record as missed' })).not.toBeInTheDocument();
  });

  it('deletes a workout of the day and can undo it', async () => {
    renderEditable('/calendar?day=2026-11-09');
    const count = storedWorkouts().length;
    const details = () => screen.getByRole('region', { name: 'Monday, November 9' });

    await userEvent.click(within(details()).getByRole('button', { name: 'Delete Strength · Day A' }));
    expect(storedWorkouts()).toHaveLength(count - 1);
    expect(within(details()).queryByRole('link', { name: 'Open workout' })).not.toBeInTheDocument();
    expect(screen.getByText(/^Strength · Day A of .+ deleted$/)).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'Undo' }));
    expect(storedWorkouts()).toHaveLength(count);
    expect(within(details()).getByRole('link', { name: 'Open workout' })).toBeInTheDocument();
  });
});
