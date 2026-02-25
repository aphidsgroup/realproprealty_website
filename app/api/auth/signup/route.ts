import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSession, hashPassword } from '@/lib/auth';

export const runtime = 'nodejs';

export async function POST(request: Request) {
    try {
        const { name, email, phone, password } = await request.json();

        if (!password || (!email && !phone)) {
            return NextResponse.json(
                { error: 'Password and either email or phone are required' },
                { status: 400 }
            );
        }

        if (password.length < 6) {
            return NextResponse.json(
                { error: 'Password must be at least 6 characters' },
                { status: 400 }
            );
        }

        // Check if user already exists
        if (email) {
            const existingEmail = await prisma.user.findUnique({ where: { email } });
            if (existingEmail) {
                return NextResponse.json({ error: 'Email already registered' }, { status: 409 });
            }
        }
        if (phone) {
            const existingPhone = await prisma.user.findUnique({ where: { phone } });
            if (existingPhone) {
                return NextResponse.json({ error: 'Phone number already registered' }, { status: 409 });
            }
        }

        const passwordHash = await hashPassword(password);

        const user = await prisma.user.create({
            data: {
                name: name || null,
                email: email || null,
                phone: phone || null,
                passwordHash,
            },
        });

        // Auto-login after signup
        const session = await getSession();
        session.userId = user.id;
        session.email = user.email || '';
        session.name = user.name || '';
        session.role = 'user';
        session.isLoggedIn = true;
        await session.save();

        return NextResponse.json({ success: true, user: { id: user.id, name: user.name, email: user.email } }, { status: 201 });
    } catch (error) {
        console.error('[Signup] ERROR:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
