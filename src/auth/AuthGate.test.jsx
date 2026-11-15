import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AuthGate from './AuthGate';
import { AuthProvider } from './AuthContext';
import { renderWithProviders } from '../test-utils';

function fakeClient(session = null) {
  return {
    auth: {
      getSession: () => Promise.resolve({ data: { session } }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe() {} } } }),
    },
  };
}

const renderGate = (client, route = '/today') =>
  renderWithProviders(
    <AuthProvider client={client}>
      <AuthGate>
        <p>The app</p>
      </AuthGate>
    </AuthProvider>,
    { route }
  );

describe('AuthGate', () => {
  beforeEach(() => localStorage.clear());

  it('starts with signing in and lets you continue without an account', async () => {
    renderGate(fakeClient());
    expect(await screen.findByRole('heading', { name: 'Welcome to GetFit!' })).toBeInTheDocument();
    expect(screen.queryByText('The app')).not.toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'Continue without an account' }));
    expect(screen.getByText('The app')).toBeInTheDocument();
    expect(localStorage.getItem('continueWithoutAccount')).toBe('true');
  });

  it('shows the app right away when signed in, without a backend or on the privacy page', async () => {
    renderGate(fakeClient({ user: { id: 'u1', email: 'a@example.com' } }));
    expect(await screen.findByText('The app')).toBeInTheDocument();
  });

  it('shows the app without a backend', () => {
    renderGate(null);
    expect(screen.getByText('The app')).toBeInTheDocument();
  });

  it('keeps the privacy notice reachable before signing in', async () => {
    renderGate(fakeClient(), '/privacy');
    expect(await screen.findByText('The app')).toBeInTheDocument();
  });
});
