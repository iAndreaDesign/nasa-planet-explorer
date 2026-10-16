// @vitest-environment node
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ConfigError, getNasaApiKey, getSolarSystemToken, isConfigError } from './env';

const getters = [
  { name: 'NASA_API_KEY', read: getNasaApiKey },
  { name: 'SOLAR_SYSTEM_API_TOKEN', read: getSolarSystemToken },
] as const;

function captureError(read: () => string): ConfigError {
  try {
    read();
  } catch (error) {
    if (isConfigError(error)) return error;
    throw error;
  }
  throw new Error('Expected a ConfigError to be thrown');
}

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe.each(getters)('$name', ({ name, read }) => {
  it('returns the configured value', () => {
    vi.stubEnv(name, 'test-value-123');

    expect(read()).toBe('test-value-123');
  });

  it('trims surrounding whitespace', () => {
    vi.stubEnv(name, '  test-value-123\n');

    expect(read()).toBe('test-value-123');
  });

  it('throws a missing-credential ConfigError when the variable is not set', () => {
    vi.stubEnv(name, undefined);

    const error = captureError(read);
    expect(error.code).toBe('missing-credential');
    expect(error.variable).toBe(name);
    expect(error.message).toContain(name);
  });

  it.each(['', '   '])('throws when the variable is empty (%j)', (value) => {
    vi.stubEnv(name, value);

    expect(captureError(read).code).toBe('missing-credential');
  });

  it('refuses to read credentials in a browser context without leaking the value', () => {
    const secret = 'super-secret-value-987';
    vi.stubEnv(name, secret);
    vi.stubGlobal('window', {});

    const error = captureError(read);
    expect(error.code).toBe('client-access');
    expect(error.message).not.toContain(secret);
    expect(JSON.stringify(error)).not.toContain(secret);
  });
});
