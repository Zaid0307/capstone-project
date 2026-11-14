import { addDays, daysBetween, isDateKey, mondayOf, weekKeyOf, weekMondays } from './dates';

describe('analysis dates', () => {
  it('uses ISO weeks, also at the turn of the year', () => {
    expect(weekKeyOf('2026-11-13')).toBe('2026-W46');
    expect(weekKeyOf('2026-11-09')).toBe('2026-W46');
    expect(weekKeyOf('2026-11-15')).toBe('2026-W46');
    expect(weekKeyOf('2026-12-31')).toBe('2026-W53');
    expect(weekKeyOf('2027-01-03')).toBe('2026-W53');
    expect(weekKeyOf('2027-01-04')).toBe('2027-W01');
    expect(weekKeyOf('2024-12-30')).toBe('2025-W01');
  });

  it('counts days without daylight saving shifts', () => {
    expect(addDays('2026-10-24', 2)).toBe('2026-10-26');
    expect(addDays('2026-03-01', -1)).toBe('2026-02-28');
    expect(daysBetween('2026-03-28', '2026-03-30')).toBe(2);
    expect(mondayOf('2026-11-15')).toBe('2026-11-09');
    expect(weekMondays('2026-11-11', '2026-11-23')).toEqual(['2026-11-09', '2026-11-16', '2026-11-23']);
  });

  it('checks date keys', () => {
    expect(isDateKey('2026-02-28')).toBe(true);
    expect(isDateKey('2026-02-30')).toBe(false);
    expect(isDateKey('heute')).toBe(false);
    expect(isDateKey(null)).toBe(false);
  });
});
