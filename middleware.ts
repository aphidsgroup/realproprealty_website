import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Allow public pages and API routes
    if (
        pathname === '/admin/login' ||
        pathname === '/login' ||
        pathname === '/signup' ||
        pathname.startsWith('/api/')
    ) {
        return NextResponse.next();
    }

    // Check for session cookie
    const sessionCookie = request.cookies.get('realprop_session');

    // Protect /admin routes — require session cookie (role check done server-side)
    if (pathname.startsWith('/admin')) {
        if (!sessionCookie?.value) {
            return NextResponse.redirect(new URL('/admin/login', request.url));
        }
        return NextResponse.next();
    }

    // Protect /manager routes
    if (pathname.startsWith('/manager')) {
        if (!sessionCookie?.value) {
            return NextResponse.redirect(new URL('/admin/login', request.url));
        }
        return NextResponse.next();
    }

    // Protect /dashboard routes (user)
    if (pathname.startsWith('/dashboard')) {
        if (!sessionCookie?.value) {
            return NextResponse.redirect(new URL('/login', request.url));
        }
        return NextResponse.next();
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*', '/manager/:path*', '/dashboard/:path*'],
};
