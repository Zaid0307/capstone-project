import { toDateKey } from '../workoutLog';

// Calendar helpers for the analysis (docs/ux/03-analysen-und-architektur.md, 3.1).
// All dates are local calendar days as 'YYYY-MM-DD' keys. Arithmetic runs in UTC
// on those keys, so daylight saving time can never shift a day.

const DAY_MS = 24 * 60 * 60 * 1000;
const pad = number => String(number).padStart(2, '0');

const toUtc = dateKey => {
  const [year, month, day] = dateKey.split('-').map(Number);
  return Date.UTC(year, month - 1, day);
};

const fromUtc = time => {
  const date = new Date(time);
  return `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())}`;
};

// `today` may be passed as a date key or as a Date (then its local day counts).
export const asDateKey = value => (typeof value === 'string' ? value : toDateKey(value));

export const isDateKey = value =>
  typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value) && fromUtc(toUtc(value)) === value;

export const addDays = (dateKey, days) => fromUtc(toUtc(dateKey) + days * DAY_MS);

// Days from a to b (b − a), e.g. ('2026-11-01', '2026-11-03') → 2.
export const daysBetween = (a, b) => Math.round((toUtc(b) - toUtc(a)) / DAY_MS);

// 0 = Monday … 6 = Sunday.
export const weekdayIndex = dateKey => (new Date(toUtc(dateKey)).getUTCDay() + 6) % 7;

export const mondayOf = dateKey => addDays(dateKey, -weekdayIndex(dateKey));

export const monthKeyOf = dateKey => dateKey.slice(0, 7);

const weekKeyCache = new Map();

// ISO week key 'YYYY-Www': the week belongs to the year of its Thursday.
export function weekKeyOf(dateKey) {
  let key = weekKeyCache.get(dateKey);
  if (key) return key;
  const thursday = addDays(dateKey, 3 - weekdayIndex(dateKey));
  const year = Number(thursday.slice(0, 4));
  const week = Math.floor(daysBetween(`${year}-01-01`, thursday) / 7) + 1;
  key = `${year}-W${pad(week)}`;
  weekKeyCache.set(dateKey, key);
  return key;
}

// Mondays of all weeks that touch [from, to], oldest first.
export function weekMondays(from, to) {
  const mondays = [];
  for (let monday = mondayOf(from); monday <= to; monday = addDays(monday, 7)) mondays.push(monday);
  return mondays;
}
