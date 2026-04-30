import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        
        // Destructure common fields and formType
        const {
            formType, // "buyer" or "seller"
            name,
            phone,
            email,
            optInWhatsapp,
            buyerType,
            sellerType,
            propertyType,
            bhk,
            budget,
            areas,
            timeline,
            propertyAddress,
            propertyDetails
        } = body;

        // Basic validation
        if (!formType || !name || !phone) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const submission = await prisma.onboardingSubmission.create({
            data: {
                formType,
                name,
                phone,
                email,
                optInWhatsapp: Boolean(optInWhatsapp),
                buyerType,
                sellerType,
                propertyType,
                bhk,
                budget,
                areas,
                timeline,
                propertyAddress,
                propertyDetails: propertyDetails ? JSON.stringify(propertyDetails) : null,
                status: 'pending'
            }
        });

        return NextResponse.json({ success: true, submissionId: submission.id }, { status: 201 });
    } catch (error) {
        console.error('Error creating onboarding submission:', error);
        return NextResponse.json({ error: 'Failed to submit form' }, { status: 500 });
    }
}
