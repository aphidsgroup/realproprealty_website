import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { isAdmin, hashPassword } from '@/lib/auth';

export async function POST(request: Request) {
    try {
        if (!(await isAdmin())) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { managerId, newName, newEmail, newPassword } = await request.json();

        if (!managerId) {
            return NextResponse.json({ error: 'Manager ID is required' }, { status: 400 });
        }

        // 1. Verify manager exists
        const manager = await prisma.manager.findUnique({
            where: { id: managerId }
        });

        if (!manager) {
            return NextResponse.json({ error: 'Manager not found' }, { status: 404 });
        }

        // 2. Update data
        const updateData: any = {};
        if (newName) updateData.name = newName;
        if (newEmail) {
            const existing = await prisma.manager.findUnique({ where: { email: newEmail } });
            if (existing && existing.id !== manager.id) {
                return NextResponse.json({ error: 'Email already in use' }, { status: 409 });
            }
            updateData.email = newEmail;
        }
        if (newPassword) {
            updateData.passwordHash = await hashPassword(newPassword);
        }

        if (Object.keys(updateData).length === 0) {
            return NextResponse.json({ error: 'No updates provided' }, { status: 400 });
        }

        await prisma.manager.update({
            where: { id: managerId },
            data: updateData
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('[Update Manager Creds] ERROR:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
