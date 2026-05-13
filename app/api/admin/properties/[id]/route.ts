import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { isAuthenticated } from '@/lib/auth';

export const runtime = 'nodejs';

/**
 * Sanitize incoming body to only include fields that exist in the Property schema.
 */
function sanitizePropertyData(body: any) {
    const data: any = {};

    if (body.title !== undefined) data.title = body.title;
    if (body.usageType !== undefined) data.usageType = body.usageType;
    if (body.propertySubtype !== undefined) data.propertySubtype = body.propertySubtype || null;
    if (body.areaName !== undefined) data.areaName = body.areaName;
    if (body.city !== undefined) data.city = body.city;
    if (body.priceInr !== undefined) data.priceInr = typeof body.priceInr === 'number' ? body.priceInr : parseInt(body.priceInr) || 0;
    if (body.sizeSqft !== undefined) data.sizeSqft = typeof body.sizeSqft === 'number' ? body.sizeSqft : parseInt(body.sizeSqft) || 0;
    if (body.bedrooms !== undefined) data.bedrooms = body.bedrooms ? (typeof body.bedrooms === 'number' ? body.bedrooms : parseInt(body.bedrooms)) : null;
    if (body.bathrooms !== undefined) data.bathrooms = body.bathrooms ? (typeof body.bathrooms === 'number' ? body.bathrooms : parseInt(body.bathrooms)) : null;
    if (body.parking !== undefined) data.parking = body.parking || null;
    if (body.amenities !== undefined) data.amenities = typeof body.amenities === 'string' ? body.amenities : JSON.stringify(body.amenities || []);
    if (body.facilities !== undefined) data.facilities = typeof body.facilities === 'string' ? body.facilities : JSON.stringify(body.facilities || []);
    if (body.locationAdvantages !== undefined) data.locationAdvantages = typeof body.locationAdvantages === 'string' ? body.locationAdvantages : JSON.stringify(body.locationAdvantages || []);
    if (body.constructionStatus !== undefined) data.constructionStatus = body.constructionStatus || null;
    if (body.tourEmbedUrl !== undefined) data.tourEmbedUrl = body.tourEmbedUrl || '';
    if (body.images !== undefined) data.images = typeof body.images === 'string' ? body.images : JSON.stringify(body.images || []);
    if (body.floorPlans !== undefined) data.floorPlans = typeof body.floorPlans === 'string' ? body.floorPlans : JSON.stringify(body.floorPlans || []);
    if (body.isPublished !== undefined) data.isPublished = Boolean(body.isPublished);
    if (body.isFeatured !== undefined) data.isFeatured = Boolean(body.isFeatured);
    if (body.slug !== undefined) data.slug = body.slug;

    return data;
}

export async function GET(
    request: Request,
    context: { params: Promise<{ id: string }> }
) {
    if (!(await isAuthenticated())) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { id } = await context.params;
        const property = await prisma.property.findUnique({ where: { id } });

        if (!property) {
            return NextResponse.json({ error: 'Property not found' }, { status: 404 });
        }

        return NextResponse.json(property);
    } catch (error) {
        console.error('Error fetching property:', error);
        const msg = error instanceof Error ? error.message : String(error);
        return NextResponse.json({ error: 'Internal server error', details: msg }, { status: 500 });
    }
}

export async function PUT(
    request: Request,
    context: { params: Promise<{ id: string }> }
) {
    if (!(await isAuthenticated())) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { id } = await context.params;
        const body = await request.json();
        const data = sanitizePropertyData(body);

        const property = await prisma.property.update({
            where: { id },
            data,
        });

        return NextResponse.json(property);
    } catch (error) {
        console.error('Error updating property:', error);
        const msg = error instanceof Error ? error.message : String(error);
        return NextResponse.json({ error: 'Failed to update property', details: msg }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    context: { params: Promise<{ id: string }> }
) {
    if (!(await isAuthenticated())) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { id } = await context.params;
        await prisma.property.delete({ where: { id } });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting property:', error);
        const msg = error instanceof Error ? error.message : String(error);
        return NextResponse.json({ error: 'Failed to delete property', details: msg }, { status: 500 });
    }
}
