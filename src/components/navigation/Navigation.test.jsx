import { screen, within } from '@testing-library/react';
import Navigation from './Navigation';
import { AuthProvider } from '../../auth/AuthContext';
import { renderWithProviders } from '../../test-utils';

function fakeClient(session) {
  return {
    auth: {
      getSession: () => Promise.resolve({ data: { session } }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe() {} } } }),
    },
  };
}

const linkNames = () =>
  within(screen.getByRole('navigation', { name: 'Main navigation' }))
    .getAllByRole('link')
    .map(link => link.textContent);

describe('Navigation', () => {
  it('shows only plans, exercises and sign-in without an account', async () => {
    renderWithProviders(
      <AuthProvider client={fakeClient(null)}>
        <Navigation />
      </AuthProvider>
    );
    await screen.findByRole('link', { name: 'Sign in' });
    expect(linkNames()).toEqual(['Plans', 'Exercises', 'Sign in']);
  });

  it('shows all five areas when signed in', async () => {
    renderWithProviders(
      <AuthProvider client={fakeClient({ user: { id: 'u1', email: 'a@example.com' } })}>
        <Navigation />
      </AuthProvider>
    );
    await screen.findByRole('link', { name: 'Analysis' });
    expect(linkNames()).toEqual(['Today', 'Calendar', 'Plans', 'Analysis', 'Exercises']);
  });
});
