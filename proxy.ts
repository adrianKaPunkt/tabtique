import createMiddleware from 'next-intl/middleware';
import { clerkMiddleware } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

function isAdminPath(pathname: string) {
  const parts = pathname.split('/').filter(Boolean);

  // /admin/...
  if (parts[0] === 'admin') return true;

  // /{locale}/admin/...
  if (parts.length >= 2 && parts[1] === 'admin') return true;

  return false;
}

export default clerkMiddleware(async (auth, req) => {
  const { pathname } = req.nextUrl;

  // Skip middleware for API routes - let them pass through directly
  if (pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  // Protect admin routes: user must be signed in
  if (isAdminPath(req.nextUrl.pathname)) {
    await auth.protect();
  }

  // Run next-intl routing middleware for everything
  return intlMiddleware(req);
});

export const config = {
  matcher: [
    // Skip Next.js internals and static files
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
