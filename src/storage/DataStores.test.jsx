import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DataStores from './DataStores';
import { AuthProvider } from '../auth/AuthContext';
import { renderWithProviders } from '../test-utils';

// A signed-in Supabase stand-in whose tables can be unreachable.
function fakeClient() {
  const client = {
    online: false,
    auth: {
      getSession: () => Promise.resolve({ data: { session: { user: { id: 'u1', email: 'a@example.com' } } } }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe() {} } } }),
      signOut: () => Promise.resolve({ error: null }),
    },
    from: () => ({
      select: () => ({
        order: () =>
          Promise.resolve(
            client.online ? { data: [], error: null } : { data: null, error: { message: 'TypeError: Failed to fetch' } }
          ),
      }),
      insert: () => Promise.resolve({ error: null }),
    }),
  };
  return client;
}

describe('DataStores', () => {
  beforeEach(() => window.localStorage.clear());

  it('explains a missing connection at the first sign-in and tries again', async () => {
    const client = fakeClient();
    renderWithProviders(
      <AuthProvider client={client}>
        <DataStores>
          <p>The app</p>
        </DataStores>
      </AuthProvider>
    );

    expect(await screen.findByRole('heading', { name: 'No connection' })).toBeInTheDocument();
    expect(screen.queryByText(/Failed to fetch/)).toBeNull();

    client.online = true;
    await userEvent.click(screen.getByRole('button', { name: 'Try again' }));
    expect(await screen.findByText('The app')).toBeInTheDocument();
  });
});
