import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSession, verifyPassword } from '@/lib/auth';

export const runtime = 'nodejs';

export async function POST(request: Request) {
    try {
        const { email, password } = await request.json();

        if (!email || !password) {
            return NextResponse.json(
                { error: 'Email and password are required' },
                { status: 400 }
            );
        }

        const manager = await prisma.manager.findUnique({ where: { email } });

        if (!manager || !manager.isActive) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        const isValid = await verifyPassword(password, manager.passwordHash);
        if (!isValid) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        const session = await getSession();
        session.userId = manager.id;
        session.email = manager.email;
        session.name = manager.name;
        session.role = 'manager';
        session.isLoggedIn = true;
        await session.save();

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('[Manager Login] ERROR:', error);
        return NextResponse.json({ error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown') }, { status: 500 });
    }
}
