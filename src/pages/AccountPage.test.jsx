import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AccountPage from './AccountPage';
import { AuthProvider } from '../auth/AuthContext';
import { renderWithProviders } from '../test-utils';

// A small stand-in for the Supabase auth API.
function fakeClient({ session = null, signUpSession = null } = {}) {
  let listener = () => {};
  const client = {
    calls: [],
    auth: {
      getSession: () => Promise.resolve({ data: { session } }),
      onAuthStateChange(callback) {
        listener = callback;
        return { data: { subscription: { unsubscribe() {} } } };
      },
      signInWithPassword(values) {
        client.calls.push(['signIn', values]);
        listener('SIGNED_IN', { user: { id: 'u1', email: values.email } });
        return Promise.resolve({ error: null });
      },
      signUp(values) {
        client.calls.push(['signUp', values]);
        return Promise.resolve({ data: { session: signUpSession }, error: null });
      },
      signOut() {
        client.calls.push(['signOut']);
        listener('SIGNED_OUT', null);
        return Promise.resolve({ error: null });
      },
      resetPasswordForEmail: email => {
        client.calls.push(['reset', email]);
        return Promise.resolve({ error: null });
      },
    },
    rpc: name => {
      client.calls.push(['rpc', name]);
      return Promise.resolve({ error: null });
    },
    from: () => ({ insert: () => Promise.resolve({ error: null }) }),
  };
  return client;
}

const renderPage = client =>
  renderWithProviders(
    <AuthProvider client={client}>
      <AccountPage />
    </AuthProvider>
  );

describe('AccountPage', () => {
  it('explains that there are no accounts without a backend', () => {
    renderPage(null);
    expect(screen.getByText(/Accounts are not available in this version/)).toBeInTheDocument();
  });

  it('creates an account only with consent and asks to confirm the e-mail', async () => {
    const client = fakeClient();
    renderPage(client);

    await userEvent.click(await screen.findByRole('button', { name: 'No account yet? Create one' }));
    await userEvent.type(screen.getByLabelText('E-mail'), 'tester@example.com');
    await userEvent.type(screen.getByLabelText('Password'), 'long-enough');
    const create = screen.getByRole('button', { name: 'Create account' });
    expect(create).toBeDisabled();

    await userEvent.click(screen.getByRole('checkbox', { name: /I agree to the privacy notice/ }));
    await userEvent.click(create);
    expect(client.calls[0]).toEqual(['signUp', expect.objectContaining({ email: 'tester@example.com', password: 'long-enough' })]);
    expect(await screen.findByRole('status')).toHaveTextContent('Confirm your address there');
  });

  it('signs in, shows the account and signs out', async () => {
    const client = fakeClient();
    renderPage(client);

    await userEvent.type(await screen.findByLabelText('E-mail'), 'tester@example.com');
    await userEvent.type(screen.getByLabelText('Password'), 'long-enough');
    await userEvent.click(screen.getByRole('button', { name: 'Sign in' }));
    expect(await screen.findByText('Signed in as tester@example.com')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'Sign out' }));
    expect(await screen.findByRole('button', { name: 'Sign in' })).toBeInTheDocument();
  });

  it('deletes the account only after a second confirmation', async () => {
    const client = fakeClient({ session: { user: { id: 'u1', email: 'tester@example.com' } } });
    renderPage(client);

    await userEvent.click(await screen.findByRole('button', { name: 'Delete account' }));
    await userEvent.click(screen.getByRole('button', { name: 'Delete account for good' }));
    expect(client.calls).toContainEqual(['rpc', 'delete_own_account']);
  });
});
