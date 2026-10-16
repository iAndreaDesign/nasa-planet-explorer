import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { Moon, MoonRef } from '@/services/solarSystem/types';
import { renderWithIntl } from '@/test/intl';
import { MAX_MOONS, MoonsSection } from './MoonsSection';

const MOONS: Record<string, Moon> = {
  phobos: { id: 'phobos', name: 'Phobos', meanRadius: 11.1, mass: { value: 1.06, exponent: 16 }, density: 1.872, gravity: 0.0057 },
  deimos: { id: 'deimos', name: 'Deimos', meanRadius: 6.2, mass: { value: 1.4762, exponent: 15 }, density: null, gravity: null },
};
const MARS_MOONS: MoonRef[] = [
  { name: 'Phobos', id: 'phobos' },
  { name: 'Deïmos', id: 'deimos' },
];

let fetchMock: ReturnType<typeof vi.fn>;

function mockMoonApi(failing: readonly string[] = []) {
  fetchMock = vi.fn(async (input: RequestInfo | URL) => {
    const id = String(input).split('/').pop() ?? '';
    if (failing.includes(id)) return Response.json({ error: 'upstream-error' }, { status: 502 });
    const moon = MOONS[id] ?? { id, name: `Moon ${id}`, meanRadius: 1, mass: null, density: null, gravity: null };
    return Response.json(moon);
  });
  vi.stubGlobal('fetch', fetchMock);
}

const toggle = (name: RegExp | string) => screen.getByRole('button', { name });

beforeEach(() => mockMoonApi());
afterEach(() => vi.unstubAllGlobals());

describe('MoonsSection', () => {
  it('is collapsed by default and requests nothing', () => {
    renderWithIntl(<MoonsSection moons={MARS_MOONS} />);

    expect(toggle('Moons (2)')).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByText('Phobos')).not.toBeVisible();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('expands with the keyboard and loads each moon through the server proxy', async () => {
    const user = userEvent.setup();
    renderWithIntl(<MoonsSection moons={MARS_MOONS} />);

    await user.tab();
    expect(toggle('Moons (2)')).toHaveFocus();
    await user.keyboard('{Enter}');

    expect(toggle('Moons (2)')).toHaveAttribute('aria-expanded', 'true');
    expect(fetchMock.mock.calls.map(([url]) => String(url))).toEqual(['/api/moons/phobos', '/api/moons/deimos']);
    const phobos = await screen.findByRole('heading', { level: 3, name: 'Phobos' });
    const card = phobos.parentElement as HTMLElement;
    expect(within(card).getByText('Mean radius').nextElementSibling).toHaveTextContent('11.1 km');
    expect(within(card).getByText('Mass').nextElementSibling).toHaveTextContent('1.06 × 10¹⁶ kg');
    expect(within(card).getByText('Surface gravity').nextElementSibling).toHaveTextContent('0.0057 m/s²');
  });

  it('never sends credentials from the browser', async () => {
    const user = userEvent.setup();
    renderWithIntl(<MoonsSection moons={MARS_MOONS} />);

    await user.click(toggle('Moons (2)'));

    for (const [url, init] of fetchMock.mock.calls) {
      expect(String(url)).toMatch(/^\/api\/moons\//);
      expect(init).toBeUndefined();
    }
  });

  it('uses the English name from the moon data and shows missing values as "Not available"', async () => {
    const user = userEvent.setup();
    renderWithIntl(<MoonsSection moons={MARS_MOONS} />, 'es');

    await user.click(toggle('Lunas (2)'));

    const deimos = await screen.findByRole('heading', { level: 3, name: 'Deimos' });
    const card = deimos.parentElement as HTMLElement;
    expect(within(card).getByText('Densidad').nextElementSibling).toHaveTextContent('No disponible');
    expect(within(card).getByText('Radio medio').nextElementSibling).toHaveTextContent('6,2 km');
  });

  it('does not repeat successful requests when collapsed and expanded again', async () => {
    const user = userEvent.setup();
    renderWithIntl(<MoonsSection moons={MARS_MOONS} />);

    await user.click(toggle('Moons (2)'));
    await screen.findByRole('heading', { level: 3, name: 'Phobos' });
    await user.click(toggle('Moons (2)'));
    await user.click(toggle('Moons (2)'));

    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(screen.getByRole('heading', { level: 3, name: 'Phobos' })).toBeVisible();
  });

  it(`lists and requests at most ${MAX_MOONS} moons and says how many are shown`, async () => {
    const user = userEvent.setup();
    const many = Array.from({ length: 293 }, (_, index) => ({ name: `S${index}`, id: `s${index}` }));
    renderWithIntl(<MoonsSection moons={many} />, 'es');

    await user.click(toggle('Lunas (293)'));

    expect(fetchMock).toHaveBeenCalledTimes(MAX_MOONS);
    expect(screen.getAllByRole('listitem')).toHaveLength(MAX_MOONS);
    expect(screen.getByText('Mostrando 10 de 293 lunas.')).toBeInTheDocument();
  });

  it('shows "Moons (0)" and a message without requests for a planet without moons', async () => {
    const user = userEvent.setup();
    renderWithIntl(<MoonsSection moons={[]} />);

    await user.click(toggle('Moons (0)'));

    expect(screen.getByText('This planet has no known moons.')).toBeVisible();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('shows a loading state per moon and an error only for the moon that fails', async () => {
    let release = () => {};
    const gate = new Promise<void>((resolve) => {
      release = resolve;
    });
    fetchMock = vi.fn(async (input: RequestInfo | URL) => {
      await gate;
      return String(input).endsWith('/deimos')
        ? Response.json({ error: 'upstream-error' }, { status: 502 })
        : Response.json(MOONS.phobos);
    });
    vi.stubGlobal('fetch', fetchMock);
    const user = userEvent.setup();
    renderWithIntl(<MoonsSection moons={MARS_MOONS} />);

    await user.click(toggle('Moons (2)'));
    expect(screen.getAllByRole('status')).toHaveLength(2);
    expect(screen.getAllByRole('status')[0]).toHaveTextContent('Loading…');

    release();
    await waitFor(() => expect(screen.getByRole('alert')).toHaveTextContent('This moon could not be loaded.'));
    expect(screen.getByRole('heading', { level: 3, name: 'Phobos' })).toBeInTheDocument();
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it('retries a failed moon on the next expansion', async () => {
    mockMoonApi(['deimos']);
    const user = userEvent.setup();
    renderWithIntl(<MoonsSection moons={MARS_MOONS} />);

    await user.click(toggle('Moons (2)'));
    await screen.findByRole('alert');
    await user.click(toggle('Moons (2)'));
    await user.click(toggle('Moons (2)'));

    expect(fetchMock.mock.calls.map(([url]) => String(url))).toEqual([
      '/api/moons/phobos',
      '/api/moons/deimos',
      '/api/moons/deimos',
    ]);
  });

  it('does not request moons whose reference has no valid id', async () => {
    const user = userEvent.setup();
    renderWithIntl(<MoonsSection moons={[{ name: 'Odd', id: null }]} />);

    await user.click(toggle('Moons (1)'));

    expect(fetchMock).not.toHaveBeenCalled();
    expect(screen.getByRole('alert')).toHaveTextContent('No data is available for this moon.');
  });
});
