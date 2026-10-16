/**
 * Module replacements for components that depend on the Next.js runtime.
 * Usage: `vi.mock('@/i18n/navigation', () => import('@/test/mocks').then((m) => m.navigationMock));`
 */
import type { AnchorHTMLAttributes, ImgHTMLAttributes } from 'react';

type LinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & { href: string; locale?: string };

export const navigationMock = {
  usePathname: () => '/',
  Link: ({ href, locale, ...props }: LinkProps) => <a href={locale ? `/${locale}${href}` : href} {...props} />,
};

type ImageProps = Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> & {
  src: string | { src: string };
  priority?: boolean;
  placeholder?: string;
};

export const nextImageMock = {
  default: ({ src, priority, placeholder, ...props }: ImageProps) => {
    void priority;
    void placeholder;
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text -- test double for next/image
    return <img src={typeof src === 'string' ? src : src.src} {...props} />;
  },
};
