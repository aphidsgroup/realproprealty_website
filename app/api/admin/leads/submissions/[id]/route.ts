import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { isAdminOrManager } from '@/lib/auth';

export const runtime = 'nodejs';

export async function DELETE(
    request: Request,
    context: { params: Promise<{ id: string }> }
) {
    if (!(await isAdminOrManager())) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { id } = await context.params;
        await prisma.onboardingSubmission.delete({ where: { id } });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting submission:', error);
        return NextResponse.json({ error: 'Failed to delete submission' }, { status: 500 });
    }
}
