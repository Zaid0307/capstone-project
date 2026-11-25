import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { clearAccountCopies } from '../storage/accountCopies';

// Version of the privacy notice a tester agrees to when creating an account.
export const PRIVACY_VERSION = '2026-11-test';

export const MIN_PASSWORD_LENGTH = 8;

// Google sign-in is shown only when switched on for the deployment.
export const isGoogleSignInEnabled = import.meta.env.VITE_GOOGLE_SIGN_IN === 'true';
// Remembers the privacy consent given before leaving for Google; it is stored
// in the account after coming back (see DataStores).
export const GOOGLE_CONSENT_KEY = 'privacyConsentBeforeGoogle';

const AuthContext = createContext({
  isConfigured: false,
  isReady: true,
  isRecovering: false,
  user: null,
});

// Sign-in state from the backend. `client` is the Supabase client or null when
// no backend is configured (then everyone works locally, nobody is signed in).
// After the link from the "reset password" e-mail, Supabase reports the event
// PASSWORD_RECOVERY; then `isRecovering` is true until a new password is set.
// `initialRecovery` covers the case that the event fired before this mounted.
export function AuthProvider({ client, initialRecovery = false, children }) {
  const [session, setSession] = useState(null);
  const [isReady, setIsReady] = useState(!client);
  const [isRecovering, setIsRecovering] = useState(Boolean(client && initialRecovery));

  useEffect(() => {
    if (!client) return undefined;
    let isCurrent = true;
    client.auth.getSession().then(({ data }) => {
      if (!isCurrent) return;
      setSession(data.session ?? null);
      setIsReady(true);
    });
    const { data } = client.auth.onAuthStateChange((event, nextSession) => {
      setSession(nextSession ?? null);
      if (event === 'PASSWORD_RECOVERY') setIsRecovering(true);
      if (event === 'SIGNED_OUT') setIsRecovering(false);
    });
    return () => {
      isCurrent = false;
      data.subscription.unsubscribe();
    };
  }, [client]);

  const value = useMemo(() => {
    const check = ({ error }) => {
      if (error) throw error;
    };
    return {
      isConfigured: Boolean(client),
      isReady,
      isRecovering,
      client,
      user: session?.user ?? null,
      async signIn(email, password) {
        check(await client.auth.signInWithPassword({ email, password }));
      },
      // Returns true when the e-mail address still has to be confirmed.
      async signUp(email, password) {
        const result = await client.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin, data: { privacy_version: PRIVACY_VERSION } },
        });
        check(result);
        if (result.data.session) await recordConsent(client);
        return !result.data.session;
      },
      // Leaves for Google and comes back signed in. The consent is noted first.
      async signInWithGoogle() {
        window.localStorage.setItem(GOOGLE_CONSENT_KEY, PRIVACY_VERSION);
        check(
          await client.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: window.location.origin } })
        );
      },
      async resetPassword(email) {
        check(await client.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/account` }));
      },
      // Sets the new password after the reset link; at least 8 characters.
      async updatePassword(password) {
        if (password.length < MIN_PASSWORD_LENGTH) throw new Error('Password too short');
        check(await client.auth.updateUser({ password }));
        setIsRecovering(false);
      },
      // Signing out also removes the account's data kept in this browser. Without
      // a connection, the session is ended on this device only.
      async signOut() {
        const userId = session?.user?.id;
        const result = await client.auth.signOut();
        if (result.error) check(await client.auth.signOut({ scope: 'local' }));
        clearAccountCopies(userId);
      },
      async deleteAccount() {
        const userId = session?.user?.id;
        check(await client.rpc('delete_own_account'));
        await client.auth.signOut();
        clearAccountCopies(userId);
      },
    };
  }, [client, isReady, isRecovering, session]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// The privacy consent is stored with its version, so a later change can ask again.
export async function recordConsent(client) {
  const { error } = await client.from('consents').insert({ kind: 'privacy_policy', version: PRIVACY_VERSION, granted: true });
  if (error) throw error;
}

export function useAuth() {
  return useContext(AuthContext);
}
