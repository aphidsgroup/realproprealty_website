import bcrypt from 'bcryptjs';
import { getIronSession, IronSession, SessionOptions } from 'iron-session';
import { cookies } from 'next/headers';

export type UserRole = 'admin' | 'manager' | 'user';

export interface SessionData {
    userId: string;
    email: string;
    name?: string;
    role: UserRole;
    isLoggedIn: boolean;
}

const sessionOptions: SessionOptions = {
    password: process.env.SESSION_SECRET!,
    cookieName: 'realprop_session',
    cookieOptions: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 1 week
    },
};

export async function getSession(): Promise<IronSession<SessionData>> {
    return getIronSession<SessionData>(await cookies(), sessionOptions);
}

export async function hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
}

export async function isAuthenticated(): Promise<boolean> {
    const session = await getSession();
    return session.isLoggedIn === true;
}

export async function isAdmin(): Promise<boolean> {
    const session = await getSession();
    return session.isLoggedIn === true && session.role === 'admin';
}

export async function isManager(): Promise<boolean> {
    const session = await getSession();
    return session.isLoggedIn === true && session.role === 'manager';
}

export async function isUser(): Promise<boolean> {
    const session = await getSession();
    return session.isLoggedIn === true && session.role === 'user';
}

export async function isAdminOrManager(): Promise<boolean> {
    const session = await getSession();
    return session.isLoggedIn === true && (session.role === 'admin' || session.role === 'manager');
}

export async function getSessionRole(): Promise<UserRole | null> {
    const session = await getSession();
    if (!session.isLoggedIn) return null;
    return session.role;
}
