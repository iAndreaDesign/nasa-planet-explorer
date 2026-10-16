import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    // APOD images (`hdurl`); query strings such as ?w=…&h=… are part of their URLs.
    remotePatterns: [{ protocol: 'https', hostname: 'assets.science.nasa.gov', pathname: '/**' }],
  },
};

export default withNextIntl(nextConfig);
