import { act, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AccountPage, { SignInForms } from './AccountPage';
import { AuthProvider, GOOGLE_CONSENT_KEY, PRIVACY_VERSION, useAuth } from '../auth/AuthContext';
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
      signInWithOAuth(values) {
        client.calls.push(['oauth', values]);
        return Promise.resolve({ error: null });
      },
      updateUser(values) {
        client.calls.push(['updateUser', values]);
        return Promise.resolve({ data: {}, error: null });
      },
      emit: (event, nextSession) => listener(event, nextSession),
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

const renderPage = (client, props = {}) =>
  renderWithProviders(
    <AuthProvider client={client} {...props}>
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

  it('asks for a new password after the reset link and saves it', async () => {
    const session = { user: { id: 'u1', email: 'tester@example.com' } };
    const client = fakeClient({ session });
    renderPage(client);
    expect(await screen.findByText('Signed in as tester@example.com')).toBeInTheDocument();

    act(() => client.auth.emit('PASSWORD_RECOVERY', session));
    expect(screen.getByRole('heading', { name: 'New password' })).toBeInTheDocument();

    await userEvent.type(screen.getByLabelText('New password', { selector: 'input' }), 'short');
    await userEvent.click(screen.getByRole('button', { name: 'Save password' }));
    expect(screen.getByRole('alert')).toHaveTextContent('at least 8 characters');
    expect(client.calls).not.toContainEqual(['updateUser', expect.anything()]);

    await userEvent.type(screen.getByLabelText('New password', { selector: 'input' }), '-but-longer');
    await userEvent.click(screen.getByRole('button', { name: 'Save password' }));
    expect(client.calls).toContainEqual(['updateUser', { password: 'short-but-longer' }]);
    expect(await screen.findByRole('status')).toHaveTextContent('Your password has been changed.');
    expect(screen.getByText('Signed in as tester@example.com')).toBeInTheDocument();
  });

  it('shows the new password form when the page opened from the reset link', async () => {
    const client = fakeClient({ session: { user: { id: 'u1', email: 'tester@example.com' } } });
    renderPage(client, { initialRecovery: true });
    expect(await screen.findByRole('heading', { name: 'New password' })).toBeInTheDocument();
  });

  it('removes the account data kept in this browser on sign-out', async () => {
    window.localStorage.setItem('accountCopy:plans:u1', '[]');
    window.localStorage.setItem('accountCopy:plans:u2', '[]');
    const client = fakeClient({ session: { user: { id: 'u1', email: 'tester@example.com' } } });
    renderPage(client);

    await userEvent.click(await screen.findByRole('button', { name: 'Sign out' }));
    expect(await screen.findByRole('button', { name: 'Sign in' })).toBeInTheDocument();
    expect(window.localStorage.getItem('accountCopy:plans:u1')).toBeNull();
    expect(window.localStorage.getItem('accountCopy:plans:u2')).toBe('[]');
    window.localStorage.clear();
  });

  it('asks before signing out while changes still wait to be sent', async () => {
    window.localStorage.setItem('pendingChanges:plans:u1', JSON.stringify([{ seq: 1, op: 'remove', id: 'a' }]));
    const client = fakeClient({ session: { user: { id: 'u1', email: 'tester@example.com' } } });
    renderPage(client);

    await userEvent.click(await screen.findByRole('button', { name: 'Sign out' }));
    expect(screen.getByRole('alertdialog', { name: 'There are changes that have not been saved yet' })).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(client.calls).not.toContainEqual(['signOut']);

    await userEvent.click(screen.getByRole('button', { name: 'Sign out' }));
    await userEvent.click(screen.getByRole('button', { name: 'Sign out anyway' }));
    expect(client.calls).toContainEqual(['signOut']);
    expect(window.localStorage.getItem('pendingChanges:plans:u1')).toBeNull();
  });

  it('hides Google sign-in unless it is switched on', async () => {
    renderPage(fakeClient());
    await screen.findByRole('button', { name: 'Sign in' });
    expect(screen.queryByRole('button', { name: 'Sign in with Google' })).toBeNull();
  });

  it('signs in with Google only after the privacy consent', async () => {
    const client = fakeClient();
    function GoogleForms() {
      return <SignInForms auth={useAuth()} showGoogle />;
    }
    renderWithProviders(
      <AuthProvider client={client}>
        <GoogleForms />
      </AuthProvider>
    );

    const google = await screen.findByRole('button', { name: 'Sign in with Google' });
    expect(google).toBeDisabled();
    await userEvent.click(screen.getByRole('checkbox', { name: /If no account exists yet/ }));
    await userEvent.click(google);
    expect(client.calls).toContainEqual(['oauth', { provider: 'google', options: { redirectTo: window.location.origin } }]);
    expect(window.localStorage.getItem(GOOGLE_CONSENT_KEY)).toBe(PRIVACY_VERSION);
    window.localStorage.clear();
  });
});
