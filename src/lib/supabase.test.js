import { cleanEnvValue, readBackendConfig } from './supabase';

describe('cleanEnvValue', () => {
  it('drops a byte order mark and surrounding spaces', () => {
    expect(cleanEnvValue('﻿https://example.supabase.co \n')).toBe('https://example.supabase.co');
    expect(cleanEnvValue('  key  ')).toBe('key');
  });

  it('rejects empty values and characters outside ISO-8859-1', () => {
    expect(cleanEnvValue(undefined)).toBeNull();
    expect(cleanEnvValue('﻿  ')).toBeNull();
    expect(cleanEnvValue('key–with-dash')).toBeNull();
    expect(cleanEnvValue('ke﻿y')).toBeNull();
  });
});

describe('readBackendConfig', () => {
  it('returns the cleaned values', () => {
    expect(readBackendConfig('﻿https://x.supabase.co', '﻿anon ')).toEqual({
      url: 'https://x.supabase.co',
      anonKey: 'anon',
    });
  });

  it('stays off without values and explains invalid ones in the console', () => {
    const log = { error: vi.fn() };
    expect(readBackendConfig(undefined, undefined, log)).toBeNull();
    expect(log.error).not.toHaveBeenCalled();
    expect(readBackendConfig('https://x.supabase.co', 'k…', log)).toBeNull();
    expect(log.error).toHaveBeenCalledWith(expect.stringContaining('ISO-8859-1'));
  });
});
