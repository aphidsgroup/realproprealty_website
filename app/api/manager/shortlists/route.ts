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

        const shortlists = await prisma.shortlist.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                user: { select: { name: true, email: true, phone: true } },
                property: { select: { title: true, slug: true, areaName: true } },
            },
        });

        return NextResponse.json({ shortlists });
    } catch (error) {
        console.error('[Manager Shortlists] ERROR:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
