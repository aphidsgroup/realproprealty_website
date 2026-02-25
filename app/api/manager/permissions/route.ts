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

        const manager = await prisma.manager.findUnique({
            where: { id: session.userId },
            select: { permissions: true },
        });

        if (!manager) {
            return NextResponse.json({ error: 'Manager not found' }, { status: 404 });
        }

        return NextResponse.json({ permissions: JSON.parse(manager.permissions) });
    } catch (error) {
        console.error('[Manager Permissions] ERROR:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
