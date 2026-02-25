import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSession, verifyPassword } from '@/lib/auth';

export const runtime = 'nodejs';

export async function POST(request: Request) {
    try {
        const { emailOrPhone, password } = await request.json();

        if (!emailOrPhone || !password) {
            return NextResponse.json(
                { error: 'Email/Phone and password are required' },
                { status: 400 }
            );
        }

        // Find user by email or phone
        const user = await prisma.user.findFirst({
            where: {
                OR: [
                    { email: emailOrPhone },
                    { phone: emailOrPhone },
                ],
            },
        });

        if (!user || !user.passwordHash) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        const isValid = await verifyPassword(password, user.passwordHash);
        if (!isValid) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        const session = await getSession();
        session.userId = user.id;
        session.email = user.email || '';
        session.name = user.name || '';
        session.role = 'user';
        session.isLoggedIn = true;
        await session.save();

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('[User Login] ERROR:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
