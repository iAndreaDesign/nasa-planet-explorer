import { isConfigError } from '@/lib/config/env';
import { isApiError } from '@/lib/http/fetchJson';

export type LoadResult<T> = { status: 'ok'; data: T } | { status: 'config-error' } | { status: 'error' };

/**
 * Runs a data loader for one page area and turns failures into states, so that one failing API
 * never breaks the rest of the page (spec `app-shell`). Logged messages never contain credentials:
 * ConfigError only names the variable and ApiError URLs are sanitised.
 */
export async function safeLoad<T>(area: string, load: () => Promise<T>): Promise<LoadResult<T>> {
  try {
    return { status: 'ok', data: await load() };
  } catch (error) {
    if (isConfigError(error)) {
      console.error(`[${area}] configuration error: ${error.message}`);
      return { status: 'config-error' };
    }
    const detail = isApiError(error) ? error.message : error instanceof Error ? error.name : 'unknown error';
    console.error(`[${area}] failed to load data: ${detail}`);
    return { status: 'error' };
  }
}
