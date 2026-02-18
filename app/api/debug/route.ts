import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
    const diagnostics: Record<string, any> = {
        timestamp: new Date().toISOString(),
        env: {
            DATABASE_URL_SET: !!process.env.DATABASE_URL,
            DATABASE_URL_PREFIX: process.env.DATABASE_URL?.substring(0, 50) + '...',
            DIRECT_URL_SET: !!process.env.DIRECT_URL,
            SESSION_SECRET_SET: !!process.env.SESSION_SECRET,
            NODE_ENV: process.env.NODE_ENV,
        },
        database: {
            connected: false,
            error: null as string | null,
            propertyCount: 0,
            adminCount: 0,
            settingsExist: false,
        },
    };

    try {
        // Test database connection
        const propertyCount = await prisma.property.count();
        const adminCount = await prisma.admin.count();
        const settings = await prisma.siteSettings.findUnique({ where: { id: 'default' } });

        diagnostics.database.connected = true;
        diagnostics.database.propertyCount = propertyCount;
        diagnostics.database.adminCount = adminCount;
        diagnostics.database.settingsExist = !!settings;
    } catch (error) {
        diagnostics.database.connected = false;
        diagnostics.database.error = error instanceof Error ? error.message : String(error);
    }

    return NextResponse.json(diagnostics, { status: 200 });
}
