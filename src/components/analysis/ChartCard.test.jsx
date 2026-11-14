import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ChartCard from './ChartCard';
import ColumnChart from './ColumnChart';
import DataTable from './DataTable';
import { renderWithProviders } from '../../test-utils';

const data = [
  { key: 'a', label: '1.11.', value: 2, valueLabel: '2' },
  { key: 'b', label: '8.11.', value: 3, valueLabel: '3', inProgress: true },
];

function renderCard(props = {}) {
  renderWithProviders(
    <ChartCard
      title="Workouts per week"
      summary="Workouts per week, 2 weeks, last 3"
      renderChart={ids => <ColumnChart data={data} reference={{ value: 3, label: 'Goal 3' }} inProgressLabel="in progress" {...ids} />}
      table={<DataTable caption="Workouts per week" columns={['Week', 'Workouts']} rows={data.map(item => ({ key: item.key, cells: [item.label, item.valueLabel] }))} />}
      {...props}
    />
  );
}

describe('ChartCard', () => {
  it('shows the chart with name and description and switches to the table', async () => {
    renderCard();
    const chart = screen.getByRole('img', { name: 'Workouts per week' });
    expect(chart).toHaveAccessibleDescription('Workouts per week, 2 weeks, last 3');
    expect(chart).toHaveTextContent('Goal 3');
    expect(chart).toHaveTextContent('in progress');
    await userEvent.click(screen.getByRole('button', { name: 'Show as table' }));
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
    expect(screen.getByRole('table', { name: 'Workouts per week' })).toHaveTextContent('8.11.3');
    expect(screen.getByRole('button', { name: 'Show as table' })).toHaveAttribute('aria-pressed', 'true');
  });

  it('shows only its content without a chart', () => {
    renderCard({ renderChart: null, children: <p>No workouts match these filters.</p> });
    expect(screen.getByText('No workouts match these filters.')).toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});
