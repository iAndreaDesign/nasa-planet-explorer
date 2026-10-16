/**
 * Server-only access to API credentials (PROJECT.md §5, spec `api-credentials`).
 * Values are never included in error messages.
 */

export const ENV_VARIABLES = {
  nasaApiKey: 'NASA_API_KEY',
  solarSystemToken: 'SOLAR_SYSTEM_API_TOKEN',
} as const;

export type EnvVariableName = (typeof ENV_VARIABLES)[keyof typeof ENV_VARIABLES];

export type ConfigErrorCode = 'missing-credential' | 'client-access';

export class ConfigError extends Error {
  readonly code: ConfigErrorCode;
  readonly variable: EnvVariableName;

  constructor(code: ConfigErrorCode, variable: EnvVariableName) {
    super(
      code === 'missing-credential'
        ? `Missing required environment variable ${variable}. Add it to your .env file (see .env.example).`
        : `Environment variable ${variable} can only be read on the server.`,
    );
    this.name = 'ConfigError';
    this.code = code;
    this.variable = variable;
  }
}

export function isConfigError(error: unknown): error is ConfigError {
  return error instanceof ConfigError;
}

function readRequiredVariable(variable: EnvVariableName): string {
  if (typeof window !== 'undefined') {
    throw new ConfigError('client-access', variable);
  }

  const value = process.env[variable]?.trim();
  if (!value) {
    throw new ConfigError('missing-credential', variable);
  }

  return value;
}

/** NASA key, sent as the `api_key` query parameter (APOD and Exoplanet Archive). */
export function getNasaApiKey(): string {
  return readRequiredVariable(ENV_VARIABLES.nasaApiKey);
}

/** Solar System OpenData token, sent as `Authorization: Bearer <token>`. */
export function getSolarSystemToken(): string {
  return readRequiredVariable(ENV_VARIABLES.solarSystemToken);
}
