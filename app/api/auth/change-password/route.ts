import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSession, verifyPassword, hashPassword } from '@/lib/auth';

export const runtime = 'nodejs';

export async function POST(request: Request) {
    try {
        const session = await getSession();
        if (!session.isLoggedIn) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { currentPassword, newPassword } = await request.json();

        if (!currentPassword || !newPassword) {
            return NextResponse.json({ error: 'Both current and new passwords are required' }, { status: 400 });
        }
        if (newPassword.length < 6) {
            return NextResponse.json({ error: 'New password must be at least 6 characters' }, { status: 400 });
        }

        let currentHash: string | null = null;

        if (session.role === 'admin') {
            const admin = await prisma.admin.findUnique({ where: { id: session.userId } });
            if (!admin) return NextResponse.json({ error: 'User not found' }, { status: 404 });
            currentHash = admin.passwordHash;
        } else if (session.role === 'manager') {
            const manager = await prisma.manager.findUnique({ where: { id: session.userId } });
            if (!manager) return NextResponse.json({ error: 'User not found' }, { status: 404 });
            currentHash = manager.passwordHash;
        } else if (session.role === 'user') {
            const user = await prisma.user.findUnique({ where: { id: session.userId } });
            if (!user || !user.passwordHash) return NextResponse.json({ error: 'User not found' }, { status: 404 });
            currentHash = user.passwordHash;
        }

        if (!currentHash) {
            return NextResponse.json({ error: 'Cannot verify current password' }, { status: 400 });
        }

        const isValid = await verifyPassword(currentPassword, currentHash);
        if (!isValid) {
            return NextResponse.json({ error: 'Current password is incorrect' }, { status: 401 });
        }

        const newHash = await hashPassword(newPassword);

        if (session.role === 'admin') {
            await prisma.admin.update({ where: { id: session.userId }, data: { passwordHash: newHash } });
        } else if (session.role === 'manager') {
            await prisma.manager.update({ where: { id: session.userId }, data: { passwordHash: newHash } });
        } else if (session.role === 'user') {
            await prisma.user.update({ where: { id: session.userId }, data: { passwordHash: newHash } });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('[Change Password] ERROR:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
