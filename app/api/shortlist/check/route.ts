import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth';

export const runtime = 'nodejs';

// GET: Check if specific properties are shortlisted by current user
export async function GET(request: Request) {
    try {
        const session = await getSession();
        if (!session.isLoggedIn || session.role !== 'user') {
            return NextResponse.json({ shortlisted: [] });
        }

        const { searchParams } = new URL(request.url);
        const propertyIds = searchParams.get('propertyIds')?.split(',').filter(Boolean) || [];

        if (propertyIds.length === 0) {
            return NextResponse.json({ shortlisted: [] });
        }

        const shortlists = await prisma.shortlist.findMany({
            where: {
                userId: session.userId,
                propertyId: { in: propertyIds },
            },
            select: { propertyId: true },
        });

        return NextResponse.json({
            shortlisted: shortlists.map(s => s.propertyId),
        });
    } catch (error) {
        console.error('[Shortlist Check] ERROR:', error);
        return NextResponse.json({ shortlisted: [] });
    }
}
