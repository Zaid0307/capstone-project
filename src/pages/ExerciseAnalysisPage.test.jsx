import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Route, Routes, useLocation } from 'react-router-dom';
import ExerciseAnalysisPage from './ExerciseAnalysisPage';
import { renderWithProviders } from '../test-utils';
import { TODAY, samplePlans, sampleWorkouts } from '../components/analysis/sampleData';

function LocationProbe() {
  const location = useLocation();
  return <div data-testid="location">{location.pathname + location.search}</div>;
}

function renderExercise(exerciseKey, { workouts = sampleWorkouts(), search = '' } = {}) {
  renderWithProviders(
    <Routes>
      <Route
        path="/analysis/exercise/:exerciseKey"
        element={
          <>
            <ExerciseAnalysisPage plans={samplePlans()} workouts={workouts} today={TODAY} />
            <LocationProbe />
          </>
        }
      />
    </Routes>,
    { route: `/analysis/exercise/${exerciseKey}${search}` }
  );
}

const card = name => screen.getByRole('region', { name });
const stat = name => within(card('Key numbers')).getByText(name).parentElement;

describe('ExerciseAnalysisPage', () => {
  it('shows an empty state for an exercise without sessions', () => {
    renderExercise('barbell_curl', { workouts: [] });
    expect(screen.getByRole('heading', { level: 1, name: 'Barbell curl' })).toBeInTheDocument();
    expect(screen.getByText("You haven't logged this exercise yet.")).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Add to a plan' })).toHaveAttribute('href', '/plans');
    expect(screen.getByRole('link', { name: 'Back to progress' })).toHaveAttribute('href', '/analysis');
  });

  it('shows key numbers, the estimated max over time and the sessions', () => {
    renderExercise('barbell_bench_press');
    expect(screen.getByRole('heading', { level: 1, name: 'Barbell bench press' })).toBeInTheDocument();
    expect(stat('Best estimated max')).toHaveTextContent('103.5 kg');
    expect(stat('Heaviest weight')).toHaveTextContent('77.5 kg');
    expect(stat('Sessions')).toHaveTextContent('8');
    expect(stat('Change of estimated max')).toHaveTextContent('+23.5 kg');

    const history = card('History: Estimated max');
    const chart = within(history).getByRole('img', { name: 'History: Estimated max' });
    expect(chart).toHaveAccessibleDescription('Barbell bench press: 8 sessions, first 80 kg, last 103.5 kg');
    expect(within(history).getByText(/^Axis starts at \d+(\.\d)? kg\.$/)).toBeInTheDocument();
    expect(within(history).getByRole('button', { name: 'Estimated max' })).toHaveAttribute('aria-pressed', 'true');

    const records = card('Personal records');
    expect(within(records).getByRole('table', { name: /Set records/ })).toHaveTextContent('1077.5 kg (11/9)');

    const sessions = within(card('Sessions')).getAllByRole('link');
    expect(sessions).toHaveLength(8);
    expect(sessions[0]).toHaveAttribute('href', '/diary/bench-7');
    expect(sessions[0]).toHaveTextContent('Strength · Day A');
    expect(within(card('Sessions')).getAllByText('77.5 × 10, 77.5 × 10, 77.5 × 6')).toHaveLength(1);
    expect(within(card('Sessions')).getAllByText(/target 3 × 8–12 · 60 kg/)).toHaveLength(8);
    expect(within(card('Sessions')).getAllByText('Record')).toHaveLength(7);
  });

  it('switches the metric and shows the numbers as a table', async () => {
    renderExercise('barbell_bench_press');
    await userEvent.click(screen.getByRole('button', { name: 'Volume' }));
    const history = card('History: Volume');
    expect(within(history).getByRole('img', { name: 'History: Volume' })).toBeInTheDocument();
    await userEvent.click(within(history).getByRole('button', { name: 'Show as table' }));
    const table = within(history).getByRole('table', { name: 'History: Volume' });
    const rows = within(table).getAllByRole('row');
    expect(rows).toHaveLength(9);
    // 60 × 10 + 60 × 10 + 60 × 6
    expect(rows[1]).toHaveTextContent('Mon, Sep 21, 20261,560 kg');
  });

  it('keeps left and right apart for per-side exercises', async () => {
    renderExercise('bulgarian_split_squat');
    expect(stat('Best estimated max')).toHaveTextContent('L 26.5 kg · R 25.5 kg');
    const history = card('History: Estimated max');
    expect(within(history).getByText(/Left: circles and solid line/)).toBeInTheDocument();
    await userEvent.click(within(history).getByRole('button', { name: 'Show as table' }));
    const table = within(history).getByRole('table');
    expect(within(table).getAllByRole('columnheader').map(cell => cell.textContent)).toEqual(['Date', 'Left', 'Right']);
  });

  it('filters by range through the URL', async () => {
    renderExercise('barbell_bench_press', { search: '?range=4w' });
    expect(stat('Sessions')).toHaveTextContent('4');
    await userEvent.selectOptions(screen.getByLabelText('Time range'), '12w');
    expect(screen.getByTestId('location')).toHaveTextContent(/^\/analysis\/exercise\/barbell_bench_press$/);
    expect(stat('Sessions')).toHaveTextContent('8');
  });
});
