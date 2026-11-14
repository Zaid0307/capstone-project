import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Route, Routes, useLocation } from 'react-router-dom';
import AnalysisPage from './AnalysisPage';
import { renderWithProviders } from '../test-utils';
import { TODAY, samplePlans, sampleWorkouts } from '../components/analysis/sampleData';

function LocationProbe() {
  const location = useLocation();
  return <div data-testid="location">{location.pathname + location.search}</div>;
}

function renderAnalysis({ plans = samplePlans(), workouts = sampleWorkouts(), route = '/analysis', language } = {}) {
  renderWithProviders(
    <Routes>
      <Route
        path="/analysis"
        element={
          <>
            <AnalysisPage plans={plans} workouts={workouts} today={TODAY} />
            <LocationProbe />
          </>
        }
      />
    </Routes>,
    { route, language }
  );
}

const location = () => screen.getByTestId('location').textContent;
const card = name => screen.getByRole('region', { name });
const kpi = name => within(card('Key numbers')).getByText(name).parentElement;

describe('AnalysisPage', () => {
  it('explains the page when there are no workouts yet', () => {
    renderAnalysis({ plans: [], workouts: [] });
    expect(screen.getByText('No workouts yet. Once you train, your progress shows up here.')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Start a workout' })).toHaveAttribute('href', '/diary');
  });

  it('shows the standard dashboard with sample data', () => {
    renderAnalysis();
    expect(screen.getByRole('heading', { level: 1, name: 'Analysis' })).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent('10 workouts');
    expect(kpi('Workouts')).toHaveTextContent('10');
    expect(kpi('Working sets')).toHaveTextContent('26');
    // No workouts before the range: no comparison yet.
    expect(within(card('Key numbers')).getByText(/Comparison with the previous period needs/)).toBeInTheDocument();
    const streak = card('Streak and schedule');
    expect(within(streak).getByText(/of \d+ planned sessions/)).toBeInTheDocument();
    // Most training days of one active plan (strength 2, mobility 1), not the sum.
    expect(within(streak).getByText('Goal: 2 workouts per week')).toBeInTheDocument();
    expect(within(streak).getByText(/Goal: the most training days per week/)).toBeInTheDocument();
    expect(within(card('Muscles you train')).getByText('Muscle figure coming soon')).toBeInTheDocument();
    expect(within(card('Muscles you train')).getByText('Chest')).toBeInTheDocument();
    const records = card('New personal records');
    expect(within(records).getAllByRole('link', { name: 'Barbell bench press' })[0]).toHaveAttribute(
      'href',
      '/analysis/exercise/barbell_bench_press'
    );
    expect(within(records).getAllByRole('link', { name: 'Bulgarian split squat' })).toHaveLength(2);
  });

  it('keeps the filters in the URL and updates the content', async () => {
    renderAnalysis();
    await userEvent.selectOptions(screen.getByLabelText('Time range'), '4w');
    expect(location()).toBe('/analysis?range=4w');
    expect(screen.getByRole('status')).toHaveTextContent('6 workouts');
    // 6 workouts against 3 in the same number of days before (23.9.–18.10.).
    expect(kpi('Workouts')).toHaveTextContent('▲ 100 % vs previous');
    await userEvent.click(screen.getByRole('button', { name: 'Strength' }));
    expect(location()).toBe('/analysis?range=4w&plans=strength');
    expect(screen.getByRole('status')).toHaveTextContent('4 workouts');
    // With exactly one plan the plan duration can be chosen.
    expect(screen.getByRole('option', { name: 'Plan duration' })).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Reset filters' }));
    expect(location()).toBe('/analysis?range=4w');
  });

  it('reads filters from the URL and shows a message when nothing matches', async () => {
    renderAnalysis({ route: '/analysis?plans=mobility' });
    expect(screen.getAllByText('No workouts match these filters.').length).toBeGreaterThan(1);
    const message = screen.getAllByText('No workouts match these filters.')[0].parentElement;
    await userEvent.click(within(message).getByRole('button', { name: 'Reset filters' }));
    expect(location()).toBe('/analysis');
    expect(kpi('Workouts')).toHaveTextContent('10');
  });

  it('switches a chart to a table with the same numbers', async () => {
    renderAnalysis();
    const chartCard = card('Workouts per week');
    const chart = within(chartCard).getByRole('img', { name: 'Workouts per week' });
    expect(chart).toHaveAccessibleDescription(/Workouts per week, 12 weeks, average/);
    const toggle = within(chartCard).getByRole('button', { name: 'Show as table' });
    expect(toggle).toHaveAttribute('aria-pressed', 'false');
    await userEvent.click(toggle);
    expect(toggle).toHaveAttribute('aria-pressed', 'true');
    expect(within(chartCard).queryByRole('img')).not.toBeInTheDocument();
    const table = within(chartCard).getByRole('table', { name: 'Workouts per week' });
    const rows = within(table).getAllByRole('row');
    expect(rows).toHaveLength(13);
    expect(rows[12]).toHaveTextContent('Week 46 (11/9) (in progress)2');
    await userEvent.click(toggle);
    expect(within(chartCard).getByRole('img')).toBeInTheDocument();
  });

  it('uses German texts and number formats', () => {
    renderAnalysis({ language: 'de' });
    expect(screen.getByRole('heading', { level: 1, name: 'Auswertung' })).toBeInTheDocument();
    expect(within(card('Kennzahlen')).getByText('Volumen').parentElement).toHaveTextContent(/\d\.\d{3} kg/);
    expect(within(card('Welche Muskeln du trainierst')).getByText('Muskelfigur folgt')).toBeInTheDocument();
  });
});
