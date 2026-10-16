'use client';

import { useCallback, useRef, useState } from 'react';
import type { Moon, MoonRef } from '@/services/solarSystem/types';

export type MoonState = { status: 'loading' } | { status: 'ok'; moon: Moon } | { status: 'error' };

function isMoon(value: unknown): value is Moon {
  return typeof value === 'object' && value !== null && typeof (value as { name?: unknown }).name === 'string';
}

async function fetchMoon(id: string): Promise<Moon> {
  const response = await fetch(`/api/moons/${encodeURIComponent(id)}`);
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const data: unknown = await response.json();
  if (!isMoon(data)) throw new Error('Invalid moon response');
  return data;
}

/**
 * Loads moons on demand through the server proxy and keeps the results for the lifetime of the
 * component, so collapsing and expanding again does not repeat successful requests.
 */
export function useMoonData() {
  const [states, setStates] = useState<Record<string, MoonState>>({});
  const requested = useRef(new Set<string>());

  const load = useCallback((refs: readonly MoonRef[]) => {
    for (const { id } of refs) {
      if (id === null || requested.current.has(id)) continue;
      requested.current.add(id);
      setStates((current) => ({ ...current, [id]: { status: 'loading' } }));

      fetchMoon(id)
        .then((moon) => setStates((current) => ({ ...current, [id]: { status: 'ok', moon } })))
        .catch(() => {
          // Failed ids may be retried on the next expansion.
          requested.current.delete(id);
          setStates((current) => ({ ...current, [id]: { status: 'error' } }));
        });
    }
  }, []);

  return { states, load };
}
