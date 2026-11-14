import { createClient } from '@supabase/supabase-js';

// The backend connection. Only set up when the project URL and the public (anon)
// key are configured (.env.local locally, environment variables on Vercel).
// Without them the app works fully offline with the browser storage.
const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isBackendConfigured = Boolean(url && anonKey);

export const supabase = isBackendConfigured
  ? createClient(url, anonKey, { auth: { persistSession: true, autoRefreshToken: true } })
  : null;
