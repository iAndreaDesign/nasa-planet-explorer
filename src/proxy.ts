import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

/** Next.js 16 Proxy (formerly Middleware): redirects unprefixed URLs to the detected locale. */
export default createMiddleware(routing);

export const config = {
  // Everything except API routes, Next.js internals and files with an extension.
  matcher: '/((?!api|_next|_vercel|.*\\..*).*)',
};
