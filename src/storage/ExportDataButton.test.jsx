import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ExportDataButton from './ExportDataButton';
import { AuthProvider } from '../auth/AuthContext';
import { PlanStoreProvider } from './PlanStoreContext';
import { WorkoutStoreProvider } from './WorkoutStoreContext';
import { renderWithProviders } from '../test-utils';
import { EXPORT_FORMAT_VERSION } from '../utils/dataExport';

const session = { user: { id: 'u1', email: 'tester@example.com' } };
const fakeClient = () => ({
  auth: {
    getSession: () => Promise.resolve({ data: { session } }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe() {} } } }),
  },
});

function renderButton({ plans, workouts, download }) {
  return renderWithProviders(
    <AuthProvider client={fakeClient()}>
      <PlanStoreProvider store={plans}>
        <WorkoutStoreProvider store={workouts}>
          <ExportDataButton download={download} />
        </WorkoutStoreProvider>
      </PlanStoreProvider>
    </AuthProvider>
  );
}

describe('ExportDataButton', () => {
  it('exports plans and diary from the account in the local export format', async () => {
    const download = vi.fn();
    renderButton({
      plans: { list: () => Promise.resolve([{ id: 'p1' }]) },
      workouts: { list: () => Promise.resolve([{ id: 'w1' }]) },
      download,
    });

    await userEvent.click(await screen.findByRole('button', { name: 'Export my data from the account' }));
    expect(download).toHaveBeenCalledWith({
      app: 'GetFit!',
      format: EXPORT_FORMAT_VERSION,
      exportedAt: expect.any(String),
      plans: [{ id: 'p1' }],
      workouts: [{ id: 'w1' }],
    });
  });

  it('explains when the account cannot be reached', async () => {
    const download = vi.fn();
    renderButton({
      plans: { list: () => Promise.reject(new Error('Failed to fetch')) },
      workouts: { list: () => Promise.resolve([]) },
      download,
    });

    await userEvent.click(await screen.findByRole('button', { name: 'Export my data from the account' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('The export did not work: Failed to fetch');
    expect(download).not.toHaveBeenCalled();
  });
});
