import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { isAdminOrManager } from '@/lib/auth';

export const runtime = 'nodejs';

export async function PATCH(
    request: Request,
    context: { params: Promise<{ id: string }> }
) {
    if (!(await isAdminOrManager())) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { id } = await context.params;
        const body = await request.json();
        
        const lead = await prisma.lead.update({
            where: { id },
            data: { status: body.status }
        });

        return NextResponse.json(lead);
    } catch (error) {
        console.error('Error updating lead:', error);
        return NextResponse.json({ error: 'Failed to update lead' }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    context: { params: Promise<{ id: string }> }
) {
    if (!(await isAdminOrManager())) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { id } = await context.params;
        await prisma.lead.delete({ where: { id } });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting lead:', error);
        return NextResponse.json({ error: 'Failed to delete lead' }, { status: 500 });
    }
}
