import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { renderWithIntl } from '@/test/intl';
import { Badge } from './Badge/Badge';
import { Breadcrumb } from './Breadcrumb/Breadcrumb';
import { CelestialCard } from './CelestialCard/CelestialCard';
import { SectionHeader } from './SectionHeader/SectionHeader';
import { StatCard, StatGrid } from './StatCard/StatCard';
import { CardGridSkeleton, StatusMessage } from './StatusMessage/StatusMessage';

vi.mock('@/i18n/navigation', () => import('@/test/mocks').then((m) => m.navigationMock));
vi.mock('next/image', () => import('@/test/mocks').then((m) => m.nextImageMock));

const image = { src: '/mars.png', width: 388, height: 300 };

describe('CelestialCard', () => {
  it('is a single link to the detail page named after the body and its details', () => {
    renderWithIntl(<CelestialCard href="/planets/mars" name="Mars" image={image} details={['04 / Planet', '2 moons']} />);

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/planets/mars');
    expect(link).toHaveAccessibleName('Mars, 04 / Planet, 2 moons');
  });

  it('renders a decorative image and an optional eyebrow', () => {
    renderWithIntl(
      <CelestialCard href="/exoplanets/x" name="X b" image={image} eyebrow="Artist impression" details={['54.63 pc']} />,
    );

    expect(screen.getByRole('link')).toHaveAccessibleName('Artist impression, X b, 54.63 pc');
    expect(screen.getByRole('presentation', { hidden: true })).toHaveAttribute('alt', '');
  });

  it('can be activated with the keyboard', async () => {
    const user = userEvent.setup();
    renderWithIntl(<CelestialCard href="/planets/mars" name="Mars" image={image} details={[]} />);

    await user.tab();
    expect(screen.getByRole('link')).toHaveFocus();
  });
});

describe('SectionHeader', () => {
  it('renders an h2 with id, description and counter badge', () => {
    renderWithIntl(
      <SectionHeader id="solar-system" title="Solar System" description="Eight planets." count="08 planets" />,
    );

    const heading = screen.getByRole('heading', { level: 2, name: 'Solar System' });
    expect(heading).toHaveAttribute('id', 'solar-system');
    expect(screen.getByText('Eight planets.')).toBeInTheDocument();
    expect(screen.getByText('08 planets')).toBeInTheDocument();
  });

  it('omits optional parts', () => {
    const { container } = renderWithIntl(<SectionHeader id="x" title="Only title" />);

    expect(container.querySelectorAll('p')).toHaveLength(0);
  });
});

describe('StatCard', () => {
  it('renders label, value and unit inside a description list', () => {
    renderWithIntl(
      <StatGrid>
        <StatCard label="Gravity" value="3.71" unit="m/s²" />
      </StatGrid>,
    );

    const term = screen.getByRole('term');
    expect(term.closest('dl')).not.toBeNull();
    expect(term).toHaveTextContent('Gravity');
    expect(screen.getByRole('definition')).toHaveTextContent('3.71m/s²');
  });

  it.each([
    ['en', 'Not available'],
    ['es', 'No disponible'],
  ] as const)('shows the translated "Not available" for a null value (%s)', (locale, text) => {
    renderWithIntl(
      <StatGrid>
        <StatCard label="Density" value={null} unit="g/cm³" />
      </StatGrid>,
      locale,
    );

    expect(screen.getByRole('definition')).toHaveTextContent(text);
    expect(screen.queryByText('g/cm³')).not.toBeInTheDocument();
  });

  it('hides the decorative icon', () => {
    renderWithIntl(
      <StatGrid>
        <StatCard label="Mass" value="1" icon={<svg data-testid="icon" />} />
      </StatGrid>,
    );

    expect(screen.getByTestId('icon').parentElement).toHaveAttribute('aria-hidden', 'true');
  });
});

describe('Badge', () => {
  it('renders its content', () => {
    renderWithIntl(<Badge tone="primary">Planet</Badge>);

    expect(screen.getByText('Planet')).toBeInTheDocument();
  });
});

describe('Breadcrumb', () => {
  const items = [{ label: 'All planets', href: '/' }, { label: 'Solar System', href: '/#solar-system' }, { label: 'Mars' }];

  it('renders a translated navigation with links and the current page', () => {
    renderWithIntl(<Breadcrumb items={items} />, 'es');

    const nav = screen.getByRole('navigation', { name: 'Ruta de navegación' });
    expect(within(nav).getByRole('link', { name: 'All planets' })).toHaveAttribute('href', '/');
    expect(within(nav).getByRole('link', { name: 'Solar System' })).toHaveAttribute('href', '/#solar-system');
    expect(within(nav).getByText('Mars')).toHaveAttribute('aria-current', 'page');
    expect(within(nav).getAllByRole('listitem')).toHaveLength(3);
  });

  it('never links the last item', () => {
    renderWithIntl(<Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Here', href: '/here' }]} />);

    expect(screen.queryByRole('link', { name: 'Here' })).not.toBeInTheDocument();
  });
});

describe('StatusMessage', () => {
  it.each([
    ['error', 'alert', 'We could not load this data. Please try again later.'],
    ['config-error', 'alert', 'This section is not available: an API credential is missing in the server configuration.'],
    ['empty', 'status', 'There is nothing to show right now.'],
  ] as const)('renders the %s state', (variant, role, text) => {
    renderWithIntl(<StatusMessage variant={variant} />);

    expect(screen.getByRole(role)).toHaveTextContent(text);
  });

  it('translates the messages', () => {
    renderWithIntl(<StatusMessage variant="error" />, 'es');

    expect(screen.getByRole('alert')).toHaveTextContent('No hemos podido cargar estos datos.');
  });
});

describe('CardGridSkeleton', () => {
  it('announces loading and renders the requested number of placeholders', () => {
    const { container } = renderWithIntl(<CardGridSkeleton count={8} />, 'es');

    expect(screen.getByRole('status')).toHaveAttribute('aria-busy', 'true');
    expect(screen.getByRole('status')).toHaveTextContent('Cargando…');
    expect(container.querySelectorAll('[aria-hidden="true"]')).toHaveLength(8);
  });
});
