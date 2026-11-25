import { migratePlan } from '../../utils/workoutPlan';
import { routes } from '../../routes';

// Sharing plans through the backend (supabase/migrations/0003_shared_plans.sql):
// the owner stores a copy under a short code; friends with an account read it
// with get_shared_plan(code) and take it over as their own copy.

const TABLE = 'shared_plans';
const CODE_PATTERN = /^[A-HJKMNP-Z2-9]{8}$/;
const UNIQUE_VIOLATION = '23505';

// What a friend gets: the plan without personal values (weights, start and end
// date, archive state).
export function sharablePlan(plan) {
  const { archived: _archived, isActive: _isActive, ...rest } = migratePlan(plan);
  const { startDate: _start, endDate: _end, ...schedule } = rest.schedule ?? { type: 'weekdays' };
  return {
    ...rest,
    schedule,
    days: rest.days.map(day => ({
      ...day,
      entries: day.entries.map(entry => ({
        ...entry,
        sets: entry.sets.map(set => ({ ...set, weight: null })),
      })),
    })),
  };
}

// Codes are typed in upper case without spaces; look-alikes are not used.
export function normalizeShareCode(code = '') {
  return code.replace(/\s+/g, '').toUpperCase();
}

export const isShareCode = code => CODE_PATTERN.test(normalizeShareCode(code));

export function shareLink(code, origin = window.location.origin) {
  return `${origin}${routes.sharedPlan(code)}`;
}

function check({ error }) {
  if (error) throw error;
}

// `client` is the Supabase client (or a fake with the same API in tests).
export function createShareStore(client) {
  return {
    // Stores a copy of the plan; returns { code, expiresAt }. A clash of random
    // codes is very unlikely; one more try covers it.
    async share(plan) {
      for (let attempt = 0; attempt < 2; attempt += 1) {
        const result = await client.from(TABLE).insert({ plan: sharablePlan(plan) }).select('code, expires_at').single();
        if (result.error?.code === UNIQUE_VIOLATION && attempt === 0) continue;
        check(result);
        return { code: result.data.code, expiresAt: result.data.expires_at };
      }
      throw new Error('No free share code');
    },
    // The shared plan for a code: { plan, expiresAt }, or null when the code is
    // unknown or expired.
    async load(code) {
      if (!isShareCode(code)) return null;
      const result = await client.rpc('get_shared_plan', { share_code: normalizeShareCode(code) });
      check(result);
      const [row] = result.data ?? [];
      return row ? { plan: migratePlan(row.plan), expiresAt: row.expires_at } : null;
    },
  };
}
