import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const runtime = 'nodejs';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const { slug } = await params;
        
        const property = await prisma.property.findUnique({
            where: { slug },
            select: {
                id: true,
                viewCount: true,
                _count: {
                    select: { shortlists: true }
                }
            }
        });

        if (!property) {
            return NextResponse.json({ error: 'Property not found' }, { status: 404 });
        }

        return NextResponse.json({
            viewCount: property.viewCount,
            shortlistCount: property._count.shortlists
        });
    } catch (error) {
        console.error('[Stats GET] ERROR:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(
    request: Request,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const { slug } = await params;
        
        // Increment view count
        const property = await prisma.property.update({
            where: { slug },
            data: {
                viewCount: {
                    increment: 1
                }
            },
            select: { viewCount: true }
        });

        return NextResponse.json({ success: true, viewCount: property.viewCount });
    } catch (error) {
        console.error('[Stats POST] ERROR:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
