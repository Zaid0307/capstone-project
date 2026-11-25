import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Route, Routes } from 'react-router-dom';
import ImportSharedPlanPage from './ImportSharedPlanPage';
import WorkoutPlanCard from '../components/workoutPlans/WorkoutPlanCard';
import { UndoProvider } from '../components/ui/UndoProvider';
import { createShareStore, isShareCode, sharablePlan } from '../components/workoutPlans/planSharing';
import { AuthProvider } from '../auth/AuthContext';
import { renderWithProviders } from '../test-utils';
import { templateById, templateToPlan } from '../data/planTemplates';
import { routes } from '../routes';

const signedIn = { user: { id: 'u1', email: 'a@example.com' } };

// A stand-in for Supabase: shared_plans as a list, get_shared_plan as the RPC.
function fakeClient({ session = signedIn, failInsert = false } = {}) {
  const client = {
    rows: [],
    auth: {
      getSession: () => Promise.resolve({ data: { session } }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe() {} } } }),
    },
    from(table) {
      expect(table).toBe('shared_plans');
      return {
        insert: row => ({
          select: () => ({
            single: () => {
              if (failInsert) return Promise.resolve({ data: null, error: { message: 'offline' } });
              const stored = { code: `ABCD${2345 + client.rows.length}`, expires_at: '2026-12-25T10:00:00Z', ...row };
              client.rows.push(stored);
              return Promise.resolve({ data: stored, error: null });
            },
          }),
        }),
      };
    },
    rpc(name, { share_code: code }) {
      expect(name).toBe('get_shared_plan');
      const row = client.rows.find(item => item.code === code);
      return Promise.resolve({ data: row ? [{ plan: row.plan, expires_at: row.expires_at }] : [], error: null });
    },
  };
  return client;
}

const plan = () => {
  const copy = { ...templateToPlan(templateById('hypertrophy_fullbody_3'), 'en'), id: 'p1', archived: false };
  copy.schedule = { ...copy.schedule, startDate: '2026-11-01' };
  copy.days[0].entries[0].sets[0].weight = 24;
  return copy;
};

function renderImport(client, code = 'ABCD2345') {
  const onImport = vi.fn();
  renderWithProviders(
    <AuthProvider client={client}>
      <Routes>
        <Route path="/plans/share/:code" element={<ImportSharedPlanPage onImport={onImport} />} />
        <Route path="/plans/:planId" element={<p>Plan view</p>} />
      </Routes>
    </AuthProvider>,
    { route: routes.sharedPlan(code) }
  );
  return { onImport };
}

describe('plan sharing', () => {
  it('shares a copy without weights, dates and archive state', async () => {
    const client = fakeClient();
    const { code } = await createShareStore(client).share(plan());
    expect(code).toBe('ABCD2345');
    const shared = client.rows[0].plan;
    expect(shared.schedule.startDate).toBeUndefined();
    expect(shared.archived).toBeUndefined();
    expect(shared.days[0].entries[0].sets.every(set => set.weight === null)).toBe(true);
    expect(sharablePlan(plan()).nameOfWorkout).toBe('Muscle building full body, 3 days');
  });

  it('accepts only well-formed codes, in any case and with spaces', () => {
    expect(isShareCode('abcd 2345')).toBe(true);
    expect(isShareCode('ABCD0OIL')).toBe(false);
    expect(isShareCode('ABC')).toBe(false);
  });

  it('shares from the plan menu and shows code and link', async () => {
    const client = fakeClient();
    renderWithProviders(
      <AuthProvider client={client}>
        <UndoProvider>
          <WorkoutPlanCard plan={plan()} />
        </UndoProvider>
      </AuthProvider>
    );
    const name = 'Muscle building full body, 3 days';
    await userEvent.click(await screen.findByRole('button', { name: `More actions for ${name}` }));
    await userEvent.click(screen.getByRole('button', { name: `Share workout plan ${name}` }));

    const panel = within(screen.getByRole('region', { name: `Share ${name}` }));
    expect(await panel.findByText('ABCD2345')).toBeInTheDocument();
    expect(panel.getByText(/\/plans\/share\/ABCD2345$/)).toBeInTheDocument();
    expect(panel.getByRole('button', { name: 'Copy link' })).toBeInTheDocument();
  });

  it('says so when sharing fails', async () => {
    const client = fakeClient({ failInsert: true });
    renderWithProviders(
      <AuthProvider client={client}>
        <UndoProvider>
          <WorkoutPlanCard plan={plan()} />
        </UndoProvider>
      </AuthProvider>
    );
    await userEvent.click(await screen.findByRole('button', { name: /^More actions for/ }));
    await userEvent.click(screen.getByRole('button', { name: /^Share workout plan/ }));
    expect(await screen.findByRole('alert')).toHaveTextContent('could not be shared');
  });

  it('offers no sharing without an account or a backend', async () => {
    renderWithProviders(
      <UndoProvider>
        <WorkoutPlanCard plan={plan()} />
      </UndoProvider>
    );
    await userEvent.click(screen.getByRole('button', { name: /^More actions for/ }));
    expect(screen.queryByRole('button', { name: /^Share workout plan/ })).not.toBeInTheDocument();
  });
});

describe('ImportSharedPlanPage', () => {
  it('previews a shared plan and takes it over as an own copy', async () => {
    const client = fakeClient();
    await createShareStore(client).share(plan());
    const { onImport } = renderImport(client, 'abcd2345');

    expect(await screen.findByRole('heading', { level: 1, name: 'Muscle building full body, 3 days' })).toBeInTheDocument();
    expect(screen.getByRole('list', { name: 'Exercises of Monday' })).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Take over as a copy' }));

    const copy = onImport.mock.calls[0][0];
    expect(copy.id).not.toBe('p1');
    expect(copy.days[0].id).not.toBe(client.rows[0].plan.days[0].id);
    expect(screen.getByText('Plan view')).toBeInTheDocument();
  });

  it('says so for an unknown or expired code', async () => {
    renderImport(fakeClient(), 'ZZZZ9999');
    expect(await screen.findByRole('alert')).toHaveTextContent('unknown or has expired');
  });

  it('asks guests to sign in', async () => {
    renderImport(fakeClient({ session: null }));
    expect(await screen.findByText('Sign in to take over a shared plan.')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'To the account' })).toHaveAttribute('href', routes.account);
  });

  it('explains that sharing needs the online version', () => {
    renderImport(null);
    expect(screen.getByText(/only|online version/i)).toBeInTheDocument();
  });
});
