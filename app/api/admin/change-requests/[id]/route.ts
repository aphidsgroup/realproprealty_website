import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/db';
import { isAdmin, getSession } from '@/lib/auth';

export const runtime = 'nodejs';

export async function POST(
    request: Request,
    context: { params: Promise<{ id: string }> }
) {
    const session = await getSession();
    if (!session.isLoggedIn || session.role !== 'admin') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { id } = await context.params;
        const { action } = await request.json(); // "approve" or "reject"

        const req = await prisma.changeRequest.findUnique({ where: { id } });
        if (!req) return NextResponse.json({ error: 'Change request not found' }, { status: 404 });

        if (action === 'reject') {
            await prisma.changeRequest.update({
                where: { id },
                data: { status: 'rejected', reviewedBy: session.userId }
            });
            return NextResponse.json({ success: true, message: 'Rejected' });
        }

        if (action === 'approve') {
            // Apply the actual changes
            if (req.entityType === 'property') {
                if (req.type === 'delete_property') {
                    const property = await prisma.property.findUnique({ where: { id: req.entityId } });
                    await prisma.property.delete({ where: { id: req.entityId } });
                    revalidatePath('/');
                    revalidatePath('/list');
                    if (property?.slug) revalidatePath(`/p/${property.slug}`);
                } else if (req.type === 'edit_property') {
                    const data = JSON.parse(req.changes);
                    const updatedProperty = await prisma.property.update({
                        where: { id: req.entityId },
                        data
                    });
                    revalidatePath('/');
                    revalidatePath('/list');
                    revalidatePath(`/p/${updatedProperty.slug}`);
                }
            }
            
            // Mark as approved
            await prisma.changeRequest.update({
                where: { id },
                data: { status: 'approved', reviewedBy: session.userId }
            });
            
            return NextResponse.json({ success: true, message: 'Approved and applied' });
        }

        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    } catch (error) {
        console.error('[ChangeRequests Action] ERROR:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
