import { isConfigError } from '@/lib/config/env';
import { isApiError } from '@/lib/http/fetchJson';
import { isValidBodyId } from '@/services/solarSystem/mappers';
import { getMoon } from '@/services/solarSystem/solarSystem';

export type MoonErrorCode = 'invalid-id' | 'not-found' | 'config-error' | 'upstream-error';

function errorResponse(error: MoonErrorCode, status: number) {
  return Response.json({ error }, { status, headers: { 'Cache-Control': 'no-store' } });
}

/**
 * Server-side proxy for moon data (spec `planet-moons`): the browser never sees
 * `SOLAR_SYSTEM_API_TOKEN`. Only validated body ids are forwarded to a fixed host.
 */
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!isValidBodyId(id)) return errorResponse('invalid-id', 400);

  try {
    const moon = await getMoon(id);
    return Response.json(moon, {
      headers: { 'Cache-Control': 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400' },
    });
  } catch (error) {
    if (isConfigError(error)) {
      console.error(`[moons] configuration error: ${error.message}`);
      return errorResponse('config-error', 503);
    }
    if (isApiError(error) && error.status === 404) return errorResponse('not-found', 404);

    console.error(`[moons] failed to load ${id}: ${isApiError(error) ? error.message : 'unexpected error'}`);
    return errorResponse('upstream-error', 502);
  }
}
