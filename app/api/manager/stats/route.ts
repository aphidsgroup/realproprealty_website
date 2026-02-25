import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth';

export const runtime = 'nodejs';

export async function GET() {
    try {
        const session = await getSession();
        if (!session.isLoggedIn || session.role !== 'manager') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const users = await prisma.user.count();
        const leads = await prisma.leadFormResponse.count();

        return NextResponse.json({ users, leads });
    } catch (error) {
        console.error('[Manager Stats] ERROR:', error);
        return NextResponse.json({ users: 0, leads: 0 });
    }
}
