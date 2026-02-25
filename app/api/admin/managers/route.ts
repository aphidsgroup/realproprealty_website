import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { isAdmin, hashPassword } from '@/lib/auth';

export const runtime = 'nodejs';

// GET: List all managers
export async function GET() {
    try {
        if (!(await isAdmin())) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const managers = await prisma.manager.findMany({
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                name: true,
                email: true,
                permissions: true,
                isActive: true,
                createdAt: true,
            },
        });

        return NextResponse.json(managers);
    } catch (error) {
        console.error('[Managers GET] ERROR:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// POST: Create a new manager
export async function POST(request: Request) {
    try {
        if (!(await isAdmin())) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { name, email, password, permissions } = await request.json();

        if (!name || !email || !password) {
            return NextResponse.json({ error: 'Name, email, and password are required' }, { status: 400 });
        }

        const existing = await prisma.manager.findUnique({ where: { email } });
        if (existing) {
            return NextResponse.json({ error: 'Email already in use' }, { status: 409 });
        }

        const passwordHash = await hashPassword(password);
        const { getSession } = await import('@/lib/auth');
        const session = await getSession();

        const manager = await prisma.manager.create({
            data: {
                name,
                email,
                passwordHash,
                permissions: JSON.stringify(permissions || { viewUsers: true, viewShortlists: true, viewLeads: true }),
                createdBy: session.userId,
            },
        });

        return NextResponse.json({ id: manager.id, name: manager.name, email: manager.email }, { status: 201 });
    } catch (error) {
        console.error('[Managers POST] ERROR:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// PUT: Update manager
export async function PUT(request: Request) {
    try {
        if (!(await isAdmin())) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id, name, email, password, permissions, isActive } = await request.json();

        if (!id) {
            return NextResponse.json({ error: 'Manager ID is required' }, { status: 400 });
        }

        const updateData: Record<string, unknown> = {};
        if (name !== undefined) updateData.name = name;
        if (email !== undefined) updateData.email = email;
        if (permissions !== undefined) updateData.permissions = JSON.stringify(permissions);
        if (isActive !== undefined) updateData.isActive = isActive;
        if (password) updateData.passwordHash = await hashPassword(password);

        const manager = await prisma.manager.update({
            where: { id },
            data: updateData,
        });

        return NextResponse.json({ id: manager.id, name: manager.name, email: manager.email });
    } catch (error) {
        console.error('[Managers PUT] ERROR:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// DELETE: Remove a manager
export async function DELETE(request: Request) {
    try {
        if (!(await isAdmin())) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Manager ID is required' }, { status: 400 });
        }

        await prisma.manager.delete({ where: { id } });
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('[Managers DELETE] ERROR:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
