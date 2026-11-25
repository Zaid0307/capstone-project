import { fireEvent, render, waitFor } from '@testing-library/react';
import { AuthProvider } from './AuthContext';
import ProfileSync from './ProfileSync';
import { LanguageProvider, useTranslation } from '../i18n/LanguageContext';

// A stand-in for Supabase with one profile row; records every update.
function fakeClient(row, { session = { user: { id: 'u1', email: 'a@example.com' } } } = {}) {
  const client = {
    row: { ...row },
    updates: [],
    auth: {
      getSession: () => Promise.resolve({ data: { session } }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe() {} } } }),
    },
    from(table) {
      expect(table).toBe('profiles');
      return {
        select: () => ({
          eq: (column, id) => ({
            single: () => Promise.resolve({ data: { ...client.row, id }, error: null }),
          }),
        }),
        update: changes => ({
          eq: (column, id) => {
            client.updates.push({ id, ...changes });
            Object.assign(client.row, changes);
            return Promise.resolve({ error: null });
          },
        }),
      };
    },
  };
  return client;
}

function LanguageProbe() {
  const { language, setLanguage } = useTranslation();
  return (
    <>
      <span data-testid="language">{language}</span>
      <button type="button" onClick={() => setLanguage('de')}>
        German
      </button>
    </>
  );
}

function renderSync(client) {
  return render(
    <LanguageProvider initialLanguage="en">
      <AuthProvider client={client}>
        <ProfileSync />
        <LanguageProbe />
      </AuthProvider>
    </LanguageProvider>
  );
}

const readFigure = () => JSON.parse(window.localStorage.getItem('figure'));

describe('ProfileSync', () => {
  beforeEach(() => window.localStorage.clear());

  it('takes over the settings stored in the account on sign-in', async () => {
    const client = fakeClient({ language: 'de', figure: 'female', created_at: 't0', updated_at: 't1' });
    const { getByTestId } = renderSync(client);

    await waitFor(() => expect(getByTestId('language')).toHaveTextContent('de'));
    await waitFor(() => expect(readFigure()).toBe('female'));
    expect(client.updates).toEqual([]);
  });

  it('stores the settings of this device in an account that has none yet, then keeps it up to date', async () => {
    const client = fakeClient({ language: 'de', figure: null, created_at: 't0', updated_at: 't0' });
    const { getByTestId, getByRole } = renderSync(client);

    await waitFor(() => expect(client.updates).toEqual([{ id: 'u1', language: 'en', figure: 'male' }]));
    expect(getByTestId('language')).toHaveTextContent('en');

    fireEvent.click(getByRole('button', { name: 'German' }));
    await waitFor(() => expect(client.updates).toHaveLength(2));
    expect(client.updates[1]).toEqual({ id: 'u1', language: 'de', figure: 'male' });
  });

  it('leaves the settings on this device alone without an account', async () => {
    const client = fakeClient({ language: 'de', figure: 'female', created_at: 't0', updated_at: 't1' }, { session: null });
    const { getByTestId, getByRole } = renderSync(client);
    fireEvent.click(getByRole('button', { name: 'German' }));
    await new Promise(resolve => setTimeout(resolve, 20));
    expect(getByTestId('language')).toHaveTextContent('de');
    expect(client.updates).toEqual([]);
  });
});
