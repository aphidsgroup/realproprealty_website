import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
    const dbUrl = process.env.DATABASE_URL || '';
    const directUrl = process.env.DIRECT_URL || '';

    const maskUrl = (url: string) => {
        try {
            const parsed = new URL(url);
            return {
                protocol: parsed.protocol,
                username: parsed.username,
                password_preview: parsed.password ? parsed.password.substring(0, 6) + '***' + parsed.password.substring(parsed.password.length - 3) : 'EMPTY',
                password_length: parsed.password.length,
                host: parsed.hostname,
                port: parsed.port,
                pathname: parsed.pathname,
                search: parsed.search,
            };
        } catch (e) {
            return { error: 'Could not parse URL', raw_preview: url.substring(0, 80) + '...' };
        }
    };

    const diagnostics: Record<string, any> = {
        timestamp: new Date().toISOString(),
        database_url: maskUrl(dbUrl),
        direct_url: maskUrl(directUrl),
        session_secret_set: !!process.env.SESSION_SECRET,
        node_env: process.env.NODE_ENV,
    };

    // Test 1: Normal Prisma connection (uses DATABASE_URL)
    diagnostics.test_database_url = { connected: false, error: null as string | null };
    try {
        const prismaMain = new PrismaClient({ datasourceUrl: dbUrl });
        const count = await prismaMain.property.count();
        diagnostics.test_database_url.connected = true;
        diagnostics.test_database_url.propertyCount = count;
        await prismaMain.$disconnect();
    } catch (error) {
        diagnostics.test_database_url.error = error instanceof Error ? error.message.substring(0, 300) : String(error);
    }

    // Test 2: Direct connection (uses DIRECT_URL, bypasses pooler)
    diagnostics.test_direct_url = { connected: false, error: null as string | null };
    try {
        const prismaDirect = new PrismaClient({ datasourceUrl: directUrl });
        const count = await prismaDirect.property.count();
        diagnostics.test_direct_url.connected = true;
        diagnostics.test_direct_url.propertyCount = count;
        await prismaDirect.$disconnect();
    } catch (error) {
        diagnostics.test_direct_url.error = error instanceof Error ? error.message.substring(0, 300) : String(error);
    }

    return NextResponse.json(diagnostics, { status: 200 });
}
