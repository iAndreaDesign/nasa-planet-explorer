import type { ReactNode } from 'react';

/**
 * The `<html>` element is rendered by `app/[locale]/layout.tsx` so that `lang` matches the active locale.
 * This root layout only exists for `app/not-found.tsx` (requests outside any locale).
 */
export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return children;
}
