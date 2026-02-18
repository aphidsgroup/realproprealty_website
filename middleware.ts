import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Allow login page and API routes
    if (pathname === '/admin/login' || pathname.startsWith('/api/')) {
        return NextResponse.next();
    }

    // Protect all /admin routes - check for session cookie
    if (pathname.startsWith('/admin')) {
        const sessionCookie = request.cookies.get('realprop_session');

        if (!sessionCookie?.value) {
            return NextResponse.redirect(new URL('/admin/login', request.url));
        }

        // Cookie exists - let the page handle full session validation
        return NextResponse.next();
    }

    return NextResponse.next();
}

export const config = {
    matcher: '/admin/:path*',
};
