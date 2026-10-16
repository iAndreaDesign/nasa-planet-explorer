import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { renderWithIntl } from '@/test/intl';
import { LanguageSwitcher } from './LanguageSwitcher';

// Locale-aware Link/usePathname depend on the Next.js router; replace them with plain equivalents.
vi.mock('@/i18n/navigation', async () => ({
  ...(await import('@/test/mocks')).navigationMock,
  usePathname: () => '/planets/mars',
}));

function renderSwitcher(locale: 'en' | 'es') {
  return renderWithIntl(<LanguageSwitcher />, locale);
}

describe('LanguageSwitcher', () => {
  it('links to the current page in every language', () => {
    renderSwitcher('en');

    expect(screen.getByRole('link', { name: 'English' })).toHaveAttribute('href', '/en/planets/mars');
    expect(screen.getByRole('link', { name: 'Español' })).toHaveAttribute('href', '/es/planets/mars');
  });

  it('marks the active language and labels each link in its own language', () => {
    renderSwitcher('es');

    const spanish = screen.getByRole('link', { name: 'Español' });
    expect(spanish).toHaveAttribute('aria-current', 'true');
    expect(spanish).toHaveAttribute('lang', 'es');
    expect(screen.getByRole('link', { name: 'English' })).not.toHaveAttribute('aria-current');
  });

  it('exposes a translated navigation landmark', () => {
    renderSwitcher('es');

    expect(screen.getByRole('navigation', { name: 'Idioma' })).toBeInTheDocument();
  });

  it('is reachable with the keyboard', async () => {
    const user = userEvent.setup();
    renderSwitcher('en');

    await user.tab();
    expect(screen.getByRole('link', { name: 'English' })).toHaveFocus();
    await user.tab();
    expect(screen.getByRole('link', { name: 'Español' })).toHaveFocus();
  });
});
