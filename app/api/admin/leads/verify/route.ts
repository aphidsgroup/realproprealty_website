import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { isAdmin } from '@/lib/auth';

export async function POST(request: Request) {
    try {
        if (!(await isAdmin())) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { submissionId } = await request.json();

        // Find the pending submission
        const submission = await prisma.onboardingSubmission.findUnique({
            where: { id: submissionId }
        });

        if (!submission) {
            return NextResponse.json({ error: 'Submission not found' }, { status: 404 });
        }

        // Bundle everything into the JSON message payload as requested
        const payload = {
            ...submission,
            verifiedAt: new Date().toISOString()
        };

        // Create the official Lead
        await prisma.lead.create({
            data: {
                leadType: submission.formType,
                name: submission.name,
                phone: submission.phone,
                email: submission.email,
                message: JSON.stringify(payload),
                status: 'new'
            }
        });

        // Update submission status
        await prisma.onboardingSubmission.update({
            where: { id: submissionId },
            data: { status: 'verified' }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('[Leads Verify] ERROR:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
