import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { isAdminOrManager } from '@/lib/auth';

export const runtime = 'nodejs';

export async function GET() {
    try {
        if (!(await isAdminOrManager())) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const leads = await prisma.leadFormResponse.findMany({
            orderBy: { createdAt: 'desc' },
        });

        return NextResponse.json({ leads });
    } catch (error) {
        console.error('[Leads GET] ERROR:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
