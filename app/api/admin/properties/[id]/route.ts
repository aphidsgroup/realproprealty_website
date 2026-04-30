import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/db';
import { isAuthenticated, getSession } from '@/lib/auth';

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
    if (body.isNegotiable !== undefined) data.isNegotiable = Boolean(body.isNegotiable);
    if (body.isVerified !== undefined) data.isVerified = Boolean(body.isVerified);
    if (body.isBachelorFriendly !== undefined) data.isBachelorFriendly = Boolean(body.isBachelorFriendly);
    if (body.isPetFriendly !== undefined) data.isPetFriendly = Boolean(body.isPetFriendly);
    if (body.isVegOnly !== undefined) data.isVegOnly = Boolean(body.isVegOnly);
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
    const session = await getSession();
    if (!session.isLoggedIn || (session.role !== 'admin' && session.role !== 'manager')) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { id } = await context.params;
        const body = await request.json();
        const data = sanitizePropertyData(body);

        const property = await prisma.property.findUnique({ where: { id } });
        if (!property) return NextResponse.json({ error: 'Property not found' }, { status: 404 });

        if (session.role === 'manager') {
            // Intercept and create ChangeRequest
            await prisma.changeRequest.create({
                data: {
                    type: 'edit_property',
                    entityType: 'property',
                    entityId: id,
                    entityTitle: property.title,
                    changes: JSON.stringify(data),
                    reason: body.reason || 'Requested by manager via dashboard',
                    requestedBy: session.userId,
                    status: 'pending'
                }
            });
            return NextResponse.json({ success: true, pendingApproval: true, message: 'Change request submitted for admin approval.' });
        }

        // Admin proceeds directly
        const updatedProperty = await prisma.property.update({
            where: { id },
            data,
        });

        // Instant cache invalidation
        revalidatePath('/');
        revalidatePath('/list');
        revalidatePath(`/p/${updatedProperty.slug}`);

        return NextResponse.json(updatedProperty);
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
    const session = await getSession();
    if (!session.isLoggedIn || (session.role !== 'admin' && session.role !== 'manager')) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { id } = await context.params;
        const property = await prisma.property.findUnique({ where: { id } });
        if (!property) return NextResponse.json({ error: 'Property not found' }, { status: 404 });

        if (session.role === 'manager') {
            // Intercept and create ChangeRequest
            await prisma.changeRequest.create({
                data: {
                    type: 'delete_property',
                    entityType: 'property',
                    entityId: id,
                    entityTitle: property.title,
                    changes: JSON.stringify({ deleted: true }),
                    reason: 'Requested by manager via dashboard',
                    requestedBy: session.userId,
                    status: 'pending'
                }
            });
            return NextResponse.json({ success: true, pendingApproval: true, message: 'Deletion request submitted for admin approval.' });
        }

        await prisma.property.delete({ where: { id } });

        // Instant cache invalidation
        revalidatePath('/');
        revalidatePath('/list');
        if (property?.slug) revalidatePath(`/p/${property.slug}`);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting property:', error);
        const msg = error instanceof Error ? error.message : String(error);
        return NextResponse.json({ error: 'Failed to delete property', details: msg }, { status: 500 });
    }
}
