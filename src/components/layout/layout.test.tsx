import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { renderWithIntl as withIntl } from '@/test/intl';
import { Footer } from './Footer/Footer';
import { Header } from './Header/Header';
import { MAIN_CONTENT_ID, SkipLink } from './SkipLink/SkipLink';

vi.mock('@/i18n/navigation', () => import('@/test/mocks').then((m) => m.navigationMock));

describe('Header', () => {
  it('renders a banner with the title linking to the home page', () => {
    withIntl(<Header />);

    const banner = screen.getByRole('banner');
    expect(within(banner).getByRole('link', { name: 'NASA Planet Explorer' })).toHaveAttribute('href', '/');
  });

  it('includes the language switcher and no other navigation or search', () => {
    withIntl(<Header />, 'es');

    expect(screen.getAllByRole('navigation')).toHaveLength(1);
    expect(screen.getByRole('navigation', { name: 'Idioma' })).toBeInTheDocument();
    expect(screen.queryByRole('search')).not.toBeInTheDocument();
    expect(screen.queryByRole('searchbox')).not.toBeInTheDocument();
  });

  it('hides the decorative logo from assistive technologies', () => {
    const { container } = withIntl(<Header />);

    expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
  });
});

describe('Footer', () => {
  it.each([
    ['en', 'Images and planetary data provided by NASA and Solar System OpenData.'],
    ['es', 'Imágenes y datos planetarios proporcionados por NASA y Solar System OpenData.'],
  ] as const)('renders the translated credits (%s)', (locale, credits) => {
    withIntl(<Footer />, locale);

    const footer = screen.getByRole('contentinfo');
    expect(within(footer).getByText('NASA Planet Explorer')).toBeInTheDocument();
    expect(within(footer).getByText(credits)).toBeInTheDocument();
  });
});

describe('SkipLink', () => {
  it('is the first focusable element and targets the main content', async () => {
    const user = userEvent.setup();
    withIntl(
      <>
        <SkipLink />
        <Header />
      </>,
      'es',
    );

    await user.tab();
    const skipLink = screen.getByRole('link', { name: 'Saltar al contenido' });
    expect(skipLink).toHaveFocus();
    expect(skipLink).toHaveAttribute('href', `#${MAIN_CONTENT_ID}`);
  });
});
