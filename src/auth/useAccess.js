import { useAuth } from './AuthContext';

// The free version without an account: only plans and exercises. Training,
// diary, calendar and analyses need an account (owner's decision 15.11.2026),
// because their data should be kept safely and on every device.
// Without a configured backend (local development, tests) everything is open.
export function useIsGuest() {
  const { isConfigured, user } = useAuth();
  return isConfigured && !user;
}
