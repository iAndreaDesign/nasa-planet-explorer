import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import '@/styles/globals.scss';

export const metadata: Metadata = {
  title: 'NASA Planet Explorer',
  description: 'Explore the planets of the Solar System and recently discovered exoplanets.',
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
