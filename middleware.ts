import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';

interface SessionData {
    userId: string;
    email: string;
    isLoggedIn: boolean;
}

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Allow login page
    if (pathname === '/admin/login') {
        return NextResponse.next();
    }

    // Protect all /admin routes
    if (pathname.startsWith('/admin')) {
        try {
            const session = await getIronSession<SessionData>(await cookies(), {
                password: process.env.SESSION_SECRET || 'default-secret-change-me-in-production-please',
                cookieName: 'realprop_session',
                cookieOptions: {
                    secure: process.env.NODE_ENV === 'production',
                    httpOnly: true,
                    sameSite: 'lax' as const,
                    maxAge: 60 * 60 * 24 * 7,
                },
            });

            if (!session.isLoggedIn) {
                return NextResponse.redirect(new URL('/admin/login', request.url));
            }
        } catch (error) {
            console.error('Middleware session error:', error);
            return NextResponse.redirect(new URL('/admin/login', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: '/admin/:path*',
};
