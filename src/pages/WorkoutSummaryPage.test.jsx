import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Route, Routes } from 'react-router-dom';
import WorkoutSummaryPage from './WorkoutSummaryPage';
import { UndoProvider } from '../components/ui/UndoProvider';
import { renderWithProviders } from '../test-utils';

const planned = (weight = 60) => ({ dose: { unit: 'repetitions', min: 8, max: 12 }, weight, rirTarget: null });
const set = (id, values, target = planned()) => ({
  id,
  type: 'working',
  planned: target,
  weight: null,
  reps: null,
  seconds: null,
  completedAt: null,
  ...values,
});

function workout(id, date, exercises, values = {}) {
  return {
    id,
    schemaVersion: 2,
    date,
    status: 'done',
    plan: { planId: 'p1', planName: 'Push', dayId: 'd1', dayName: 'Upper', weekday: 'monday' },
    note: '',
    exercises,
    startedAt: `${date}T17:00:00.000Z`,
    finishedAt: `${date}T18:05:00.000Z`,
    createdAt: `${date}T17:00:00.000Z`,
    updatedAt: `${date}T18:05:00.000Z`,
    ...values,
  };
}

const exercise = (id, name, sets, values = {}) => ({
  id,
  exerciseId: null,
  exercise: name,
  muscle: 'chest',
  plannedEntryId: `entry-${id}`,
  plannedWorkingSets: sets.length,
  skipped: false,
  restSeconds: null,
  perSide: false,
  sets,
  ...values,
});

const earlier = workout('w0', '2026-11-09', [exercise('a0', 'Bench', [set('s0', { weight: 60, reps: 10 })])]);
const current = workout(
  'w1',
  '2026-11-16',
  [
    exercise('a1', 'Bench', [set('s1', { weight: 65, reps: 8 }), set('s2', {})]),
    exercise('b1', 'Rows', [set('s3', {})], { skipped: true }),
  ],
  { note: 'Felt strong' }
);

function renderSummary(workouts, { onDeleteWorkout = vi.fn(), onAddWorkout = vi.fn(), onUpdateWorkout } = {}) {
  renderWithProviders(
    <UndoProvider>
      <Routes>
        <Route
          path="/diary/:workoutId/summary"
          element={
            <WorkoutSummaryPage
              workouts={workouts}
              onAddWorkout={onAddWorkout}
              onUpdateWorkout={onUpdateWorkout}
              onDeleteWorkout={onDeleteWorkout}
            />
          }
        />
        <Route path="/diary/:workoutId" element={<h1>Training page</h1>} />
        <Route path="/today" element={<h1>Today page</h1>} />
      </Routes>
    </UndoProvider>,
    { route: `/diary/${workouts[workouts.length - 1].id}/summary` }
  );
}

describe('WorkoutSummaryPage', () => {
  it('shows duration, sets, volume, adherence, records and deviations', () => {
    renderSummary([earlier, current]);

    expect(screen.getByRole('heading', { level: 1, name: 'Training saved' })).toBeInTheDocument();
    expect(screen.getByText('1 h 05 min')).toBeInTheDocument();
    expect(screen.getByText('1 of 3')).toBeInTheDocument();
    expect(screen.getByText('520 kg')).toBeInTheDocument();
    expect(screen.getByText('33 %')).toBeInTheDocument();
    expect(screen.getByText('With deviations')).toBeInTheDocument();
    expect(screen.getByText('Bench: Weight 65 kg (before 60 kg)')).toBeInTheDocument();
    expect(screen.getByText('Bench: e1RM 82.5 kg (before 80 kg)')).toBeInTheDocument();
    expect(screen.getByText('Bench: 1 set fewer')).toBeInTheDocument();
    expect(screen.getByText('Rows: skipped')).toBeInTheDocument();
    expect(screen.getByText('Felt strong')).toBeInTheDocument();
  });

  it('asks "How was it?" from 1 to 5 and saves the choice with the training', async () => {
    const onUpdateWorkout = vi.fn();
    renderSummary([earlier, { ...current, feeling: 2 }], { onUpdateWorkout });
    const group = screen.getByRole('radiogroup', { name: 'How was it?' });
    expect(group).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: '2 Meh' })).toHaveAttribute('aria-checked', 'true');
    await userEvent.click(screen.getByRole('radio', { name: '4 Good' }));
    expect(onUpdateWorkout).toHaveBeenLastCalledWith(expect.objectContaining({ id: 'w1', feeling: 4 }));
  });

  it('goes to the today page with Done and back into the training with Edit', async () => {
    renderSummary([earlier, current]);
    await userEvent.click(screen.getByRole('button', { name: 'Edit' }));
    expect(screen.getByRole('heading', { name: 'Training page' })).toBeInTheDocument();
  });

  it('says that an empty training does not count and offers to discard it', async () => {
    const onDeleteWorkout = vi.fn();
    const empty = workout('w2', '2026-11-16', [exercise('a2', 'Bench', [set('s5', {})])]);
    renderSummary([empty], { onDeleteWorkout });

    expect(screen.getByText(/does not count as a training/)).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'New personal records' })).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Discard training' }));
    expect(onDeleteWorkout).toHaveBeenCalledWith('w2');
    expect(screen.getByRole('heading', { name: 'Today page' })).toBeInTheDocument();
  });

  it('shows "not recorded" for entries without a start time', async () => {
    renderSummary([workout('w3', '2026-11-16', [exercise('a3', 'Bench', [set('s6', { weight: 50, reps: 10 })])], { startedAt: null })]);
    expect(screen.getByText('not recorded')).toBeInTheDocument();
    expect(screen.getByText('No new personal record this time.')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Done' }));
    expect(screen.getByRole('heading', { name: 'Today page' })).toBeInTheDocument();
  });
});
