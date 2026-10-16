import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NextIntlClientProvider } from 'next-intl';
import type { AnchorHTMLAttributes } from 'react';
import { vi } from 'vitest';
import en from '../../../../messages/en.json';
import es from '../../../../messages/es.json';
import { LanguageSwitcher } from './LanguageSwitcher';

// Locale-aware Link/usePathname depend on the Next.js router; replace them with plain equivalents.
vi.mock('@/i18n/navigation', () => ({
  usePathname: () => '/planets/mars',
  Link: ({ href, locale, ...props }: AnchorHTMLAttributes<HTMLAnchorElement> & { locale: string }) => (
    <a href={`/${locale}${href}`} {...props} />
  ),
}));

function renderSwitcher(locale: 'en' | 'es') {
  return render(
    <NextIntlClientProvider locale={locale} messages={locale === 'en' ? en : es}>
      <LanguageSwitcher />
    </NextIntlClientProvider>,
  );
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
