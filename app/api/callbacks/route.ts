import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, phone, propertyId, propertyTitle } = body;

        if (!name || !phone || !propertyId || !propertyTitle) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const callback = await prisma.callbackRequest.create({
            data: {
                name,
                phone,
                propertyId,
                propertyTitle,
            },
        });

        return NextResponse.json({ success: true, callback });
    } catch (error) {
        console.error('[CALLBACK_POST]', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function GET() {
    try {
        const callbacks = await prisma.callbackRequest.findMany({
            orderBy: { createdAt: 'desc' },
        });
        return NextResponse.json({ callbacks });
    } catch (error) {
        console.error('[CALLBACK_GET]', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
