import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const runtime = 'nodejs';

export async function POST(request: Request) {
    try {
        const body = await request.json();

        const { name, phone, email, propertyType, bhk, budget, location, timeline, source } = body;

        if (!name || !phone) {
            return NextResponse.json({ error: 'Name and phone are required' }, { status: 400 });
        }

        const lead = await prisma.leadFormResponse.create({
            data: {
                name,
                phone,
                email: email || null,
                propertyType: propertyType || null,
                bhk: bhk || null,
                budget: budget || null,
                location: location || null,
                timeline: timeline || null,
                source: source || 'website',
            },
        });

        return NextResponse.json({ id: lead.id }, { status: 201 });
    } catch (error) {
        console.error('[Leads POST] ERROR:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
