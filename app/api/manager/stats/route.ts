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
        const leads = await prisma.onboardingSubmission.count({ where: { status: 'pending' } });
        const propertiesCount = await prisma.property.count();
        const properties = await prisma.property.findMany({
            orderBy: { createdAt: 'desc' },
            take: 10,
            select: {
                id: true,
                title: true,
                areaName: true,
                createdAt: true,
                price: true,
                isPublished: true,
                usageType: true
            }
        });
        
        const pendingSubmissions = await prisma.onboardingSubmission.findMany({
            where: { status: 'pending' },
            orderBy: { createdAt: 'desc' },
        });

        return NextResponse.json({ users, leads, propertiesCount, properties, pendingSubmissions });
    } catch (error) {
        console.error('[Manager Stats] ERROR:', error);
        return NextResponse.json({ users: 0, leads: 0, propertiesCount: 0, properties: [], pendingSubmissions: [] });
    }
}
