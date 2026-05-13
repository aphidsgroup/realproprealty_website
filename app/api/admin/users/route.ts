import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { isAdminOrManager } from '@/lib/auth';

export const runtime = 'nodejs';

export async function GET() {
    try {
        if (!(await isAdminOrManager())) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const users = await prisma.user.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                _count: {
                    select: { shortlists: true }
                }
            }
        });

        return NextResponse.json(users);
    } catch (error) {
        console.error('[Admin Users API] Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
