import { createContext, useContext, useEffect, useMemo, useState } from 'react';

// Version of the privacy notice a tester agrees to when creating an account.
export const PRIVACY_VERSION = '2026-11-test';

const AuthContext = createContext({
  isConfigured: false,
  isReady: true,
  user: null,
});

// Sign-in state from the backend. `client` is the Supabase client or null when
// no backend is configured (then everyone works locally, nobody is signed in).
export function AuthProvider({ client, children }) {
  const [session, setSession] = useState(null);
  const [isReady, setIsReady] = useState(!client);

  useEffect(() => {
    if (!client) return undefined;
    let isCurrent = true;
    client.auth.getSession().then(({ data }) => {
      if (!isCurrent) return;
      setSession(data.session ?? null);
      setIsReady(true);
    });
    const { data } = client.auth.onAuthStateChange((_event, nextSession) => setSession(nextSession ?? null));
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
      async resetPassword(email) {
        check(await client.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/account` }));
      },
      async signOut() {
        check(await client.auth.signOut());
      },
      async deleteAccount() {
        check(await client.rpc('delete_own_account'));
        await client.auth.signOut();
      },
    };
  }, [client, isReady, session]);

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
