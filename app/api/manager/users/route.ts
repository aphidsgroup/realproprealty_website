import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth';

export const runtime = 'nodejs';

export async function GET() {
    try {
        const session = await getSession();
        if (!session.isLoggedIn || (session.role !== 'manager' && session.role !== 'admin')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const users = await prisma.user.findMany({
            orderBy: { createdAt: 'desc' },
            select: { id: true, name: true, email: true, phone: true, createdAt: true },
        });

        return NextResponse.json({ users });
    } catch (error) {
        console.error('[Manager Users] ERROR:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
