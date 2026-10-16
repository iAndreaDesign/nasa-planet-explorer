/**
 * Typed JSON fetch shared by the API services (server-side).
 * Errors never expose credentials: URLs are sanitised and request headers are not included.
 */

export type ApiErrorKind = 'http' | 'network' | 'invalid-response';

const REDACTED = '[redacted]';
const SENSITIVE_QUERY_PARAMS = ['api_key'];
const DEFAULT_TIMEOUT_MS = 10_000;

export function sanitizeUrl(url: URL | string): string {
  const parsed = new URL(url);
  for (const param of SENSITIVE_QUERY_PARAMS) {
    if (parsed.searchParams.has(param)) parsed.searchParams.set(param, REDACTED);
  }
  return parsed.toString();
}

export class ApiError extends Error {
  readonly kind: ApiErrorKind;
  readonly status: number | null;
  readonly url: string;

  constructor(kind: ApiErrorKind, url: URL | string, status: number | null = null) {
    const safeUrl = sanitizeUrl(url);
    const detail = kind === 'http' ? `HTTP ${status}` : kind === 'network' ? 'network error' : 'invalid response';
    super(`Request to ${safeUrl} failed: ${detail}`);
    this.name = 'ApiError';
    this.kind = kind;
    this.status = status;
    this.url = safeUrl;
  }
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

export interface FetchJsonOptions {
  headers?: Record<string, string>;
  /** Seconds before Next.js revalidates the cached response. */
  revalidate?: number;
  timeoutMs?: number;
}

export async function fetchJson(url: URL | string, options: FetchJsonOptions = {}): Promise<unknown> {
  const { headers, revalidate, timeoutMs = DEFAULT_TIMEOUT_MS } = options;

  let response: Response;
  try {
    response = await fetch(url, {
      headers: { Accept: 'application/json', ...headers },
      signal: AbortSignal.timeout(timeoutMs),
      ...(revalidate === undefined ? {} : { next: { revalidate } }),
    });
  } catch {
    // The original error is dropped on purpose: it may reference the request URL.
    throw new ApiError('network', url);
  }

  if (!response.ok) {
    throw new ApiError('http', url, response.status);
  }

  try {
    return (await response.json()) as unknown;
  } catch {
    throw new ApiError('invalid-response', url, response.status);
  }
}
