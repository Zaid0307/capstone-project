import { createClient } from '@supabase/supabase-js';

// Cleans a configured value: drops an invisible byte order mark (BOM) and
// surrounding spaces, which sneak in when values are pasted into a dashboard.
// Returns null when nothing is left or when the value still contains characters
// outside ISO-8859-1: such a value cannot be sent in an HTTP header, so every
// request (e.g. signing up) would fail with "non ISO-8859-1 code point".
export function cleanEnvValue(value) {
  if (typeof value !== 'string') return null;
  const cleaned = value.replace(/^\uFEFF/, '').trim();
  if (!cleaned) return null;
  // eslint-disable-next-line no-control-regex
  if (/[^\u0000-\u00FF]/.test(cleaned)) return null;
  return cleaned;
}

// Checks both values and explains in the console why the backend stays off.
export function readBackendConfig(rawUrl, rawKey, log = console) {
  if (!rawUrl || !rawKey) return null;
  const url = cleanEnvValue(rawUrl);
  const anonKey = cleanEnvValue(rawKey);
  if (!url || !anonKey) {
    log.error(
      'GetFit!: VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY contains invalid characters ' +
        '(outside ISO-8859-1). The account features are off; the app keeps working on this device.'
    );
    return null;
  }
  return { url, anonKey };
}

// The backend connection. Only set up when the project URL and the public (anon)
// key are configured (.env.local locally, environment variables on Vercel).
// Without them the app works fully offline with the browser storage.
const config = readBackendConfig(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY);

export const isBackendConfigured = Boolean(config);

// Read before the client starts: it removes the tokens from the address once it
// has taken them over. "type=recovery" marks the link from the reset e-mail.
export const openedFromRecoveryLink =
  typeof window !== 'undefined' && /(^|[#&?])type=recovery(&|$)/.test(window.location.hash + window.location.search);

export const supabase = config
  ? createClient(config.url, config.anonKey, { auth: { persistSession: true, autoRefreshToken: true } })
  : null;
