import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth';

export const runtime = 'nodejs';

// GET: Get user's shortlisted properties
export async function GET() {
    try {
        const session = await getSession();
        if (!session.isLoggedIn || session.role !== 'user') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const shortlists = await prisma.shortlist.findMany({
            where: { userId: session.userId },
            include: {
                property: true,
            },
            orderBy: { createdAt: 'desc' },
        });

        return NextResponse.json({ shortlists });
    } catch (error) {
        console.error('[Shortlist GET] ERROR:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// POST: Toggle shortlist (add or remove)
export async function POST(request: Request) {
    try {
        const session = await getSession();
        if (!session.isLoggedIn || session.role !== 'user') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { propertyId } = await request.json();

        if (!propertyId) {
            return NextResponse.json({ error: 'Property ID is required' }, { status: 400 });
        }

        // Check if already shortlisted
        const existing = await prisma.shortlist.findUnique({
            where: {
                userId_propertyId: {
                    userId: session.userId,
                    propertyId,
                },
            },
        });

        if (existing) {
            // Remove from shortlist
            await prisma.shortlist.delete({ where: { id: existing.id } });
            return NextResponse.json({ action: 'removed', propertyId });
        } else {
            // Add to shortlist
            await prisma.shortlist.create({
                data: {
                    userId: session.userId,
                    propertyId,
                },
            });
            return NextResponse.json({ action: 'added', propertyId });
        }
    } catch (error) {
        console.error('[Shortlist POST] ERROR:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
