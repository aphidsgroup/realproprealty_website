import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { isAdmin, verifyPassword, hashPassword, getSession } from '@/lib/auth';

export async function POST(request: Request) {
    try {
        if (!(await isAdmin())) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const session = await getSession();
        const { currentPassword, newEmail, newPassword } = await request.json();

        // 1. Verify current admin
        const admin = await prisma.user.findUnique({
            where: { id: session.userId }
        });

        if (!admin) {
            return NextResponse.json({ error: 'Admin not found' }, { status: 404 });
        }

        // 2. Verify password
        const isMatch = await verifyPassword(currentPassword, admin.passwordHash);
        if (!isMatch) {
            return NextResponse.json({ error: 'Incorrect current password' }, { status: 400 });
        }

        // 3. Update data
        const updateData: any = {};
        if (newEmail) {
            // Check if email taken
            const existing = await prisma.user.findUnique({ where: { email: newEmail } });
            if (existing && existing.id !== admin.id) {
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

        await prisma.user.update({
            where: { id: admin.id },
            data: updateData
        });

        // 4. Update session if email changed
        if (newEmail) {
            session.email = newEmail;
            await session.save();
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('[Update Admin Creds] ERROR:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
