import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';

export const runtime = 'nodejs';

export async function GET() {
    try {
        const session = await getSession();

        if (!session.isLoggedIn) {
            return NextResponse.json({ user: null });
        }

        return NextResponse.json({
            user: {
                id: session.userId,
                email: session.email,
                name: session.name || null,
                role: session.role,
            },
        });
    } catch {
        return NextResponse.json({ user: null });
    }
}
