import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSession, verifyPassword } from '@/lib/auth';

export const runtime = 'nodejs';

export async function POST(request: Request) {
    try {
        const { email, password } = await request.json();
        console.log('[Login] Attempt for email:', email);

        if (!email || !password) {
            return NextResponse.json(
                { error: 'Email and password are required' },
                { status: 400 }
            );
        }

        // Find admin user
        console.log('[Login] Looking up admin user...');
        const admin = await prisma.admin.findUnique({
            where: { email },
        });

        if (!admin) {
            console.log('[Login] Admin not found for email:', email);
            return NextResponse.json(
                { error: 'Invalid credentials' },
                { status: 401 }
            );
        }

        console.log('[Login] Admin found, verifying password...');

        // Verify password
        const isValid = await verifyPassword(password, admin.passwordHash);

        if (!isValid) {
            console.log('[Login] Invalid password');
            return NextResponse.json(
                { error: 'Invalid credentials' },
                { status: 401 }
            );
        }

        console.log('[Login] Password valid, creating session...');

        // Create session
        const session = await getSession();
        session.userId = admin.id;
        session.email = admin.email;
        session.isLoggedIn = true;
        await session.save();

        console.log('[Login] Session created successfully');
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('[Login] ERROR:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error('[Login] Error message:', errorMessage);
        console.error('[Login] Error stack:', error instanceof Error ? error.stack : 'N/A');
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
