import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const runtime = 'nodejs';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { 
            formType, 
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

        if (!formType || !name || !phone) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const submission = await prisma.onboardingSubmission.create({
            data: {
                formType,
                name,
                phone,
                email,
                optInWhatsapp: !!optInWhatsapp,
                buyerType,
                sellerType,
                propertyType,
                bhk,
                budget,
                areas,
                timeline,
                propertyAddress,
                propertyDetails: typeof propertyDetails === 'object' ? JSON.stringify(propertyDetails) : propertyDetails
            }
        });

        return NextResponse.json({ success: true, id: submission.id });
    } catch (error) {
        console.error('[Forms Submit API] Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
