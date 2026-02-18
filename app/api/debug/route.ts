import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
    const dbUrl = process.env.DATABASE_URL || '';
    const directUrl = process.env.DIRECT_URL || '';

    // Mask the password but show enough to debug
    const maskUrl = (url: string) => {
        try {
            const parsed = new URL(url);
            const user = parsed.username;
            const pass = parsed.password;
            const maskedPass = pass ? pass.substring(0, 6) + '***' + pass.substring(pass.length - 3) : 'EMPTY';
            return {
                protocol: parsed.protocol,
                username: user,
                password_preview: maskedPass,
                password_length: pass.length,
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
        connection_test: {
            connected: false,
            error: null as string | null,
            propertyCount: 0,
            adminCount: 0,
            settingsExist: false,
        },
    };

    try {
        const propertyCount = await prisma.property.count();
        const adminCount = await prisma.admin.count();
        const settings = await prisma.siteSettings.findUnique({ where: { id: 'default' } });

        diagnostics.connection_test.connected = true;
        diagnostics.connection_test.propertyCount = propertyCount;
        diagnostics.connection_test.adminCount = adminCount;
        diagnostics.connection_test.settingsExist = !!settings;
    } catch (error) {
        diagnostics.connection_test.connected = false;
        diagnostics.connection_test.error = error instanceof Error ? error.message : String(error);
    }

    return NextResponse.json(diagnostics, { status: 200 });
}
