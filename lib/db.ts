import { PrismaClient } from '@prisma/client';

/**
 * Auto-correct the Supabase pooler host.
 * The Supabase pooler migrated from aws-0 to aws-1 in ap-southeast-1.
 * This ensures the connection works regardless of which value is in the env var.
 */
function getCorrectDatabaseUrl(): string {
    let url = process.env.DATABASE_URL || '';
    // Fix: Supabase pooler host for ap-southeast-1 is aws-1, not aws-0
    url = url.replace(
        'aws-0-ap-southeast-1.pooler.supabase.com',
        'aws-1-ap-southeast-1.pooler.supabase.com'
    );
    return url;
}

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};

export const prisma =
    globalForPrisma.prisma ??
    new PrismaClient({
        log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
        datasourceUrl: getCorrectDatabaseUrl(),
    });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
