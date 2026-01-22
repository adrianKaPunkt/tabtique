import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  // matcht alles außer next internals + assets
  matcher: ['/((?!api|_next|.*\\..*).*)'],
};
