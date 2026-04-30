import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { isAdmin } from '@/lib/auth';

export const runtime = 'nodejs';

export async function GET() {
    try {
        if (!(await isAdmin())) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const requests = await prisma.changeRequest.findMany({
            where: { status: 'pending' },
            orderBy: { createdAt: 'desc' },
        });

        return NextResponse.json({ requests });
    } catch (error) {
        console.error('[ChangeRequests GET] ERROR:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
