import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/db';
import { isAuthenticated } from '@/lib/auth';
import { generateSlug } from '@/lib/utils';

export const runtime = 'nodejs';

export async function GET(request: Request) {
    if (!(await isAuthenticated())) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { searchParams } = new URL(request.url);
        const search = searchParams.get('search');

        const where: any = {};
        if (search) {
            where.OR = [
                { title: { contains: search, mode: 'insensitive' } },
                { areaName: { contains: search, mode: 'insensitive' } },
            ];
        }

        const properties = await prisma.property.findMany({
            where,
            orderBy: { createdAt: 'desc' },
        });

        return NextResponse.json(properties);
    } catch (error) {
        console.error('Error fetching properties:', error);
        const msg = error instanceof Error ? error.message : String(error);
        return NextResponse.json({ error: 'Internal server error', details: msg }, { status: 500 });
    }
}

/**
 * Sanitize incoming body to only include fields that exist in the Property schema.
 */
function sanitizePropertyData(body: any) {
    return {
        title: body.title || '',
        usageType: body.usageType || 'residential',
        propertySubtype: body.propertySubtype || null,
        areaName: body.areaName || '',
        city: body.city || 'Chennai',
        priceInr: typeof body.priceInr === 'number' ? body.priceInr : parseInt(body.priceInr) || 0,
        sizeSqft: typeof body.sizeSqft === 'number' ? body.sizeSqft : parseInt(body.sizeSqft) || 0,
        bedrooms: body.bedrooms ? (typeof body.bedrooms === 'number' ? body.bedrooms : parseInt(body.bedrooms)) : null,
        bathrooms: body.bathrooms ? (typeof body.bathrooms === 'number' ? body.bathrooms : parseInt(body.bathrooms)) : null,
        parking: body.parking || null,
        amenities: typeof body.amenities === 'string' ? body.amenities : JSON.stringify(body.amenities || []),
        facilities: typeof body.facilities === 'string' ? body.facilities : JSON.stringify(body.facilities || []),
        locationAdvantages: typeof body.locationAdvantages === 'string' ? body.locationAdvantages : JSON.stringify(body.locationAdvantages || []),
        constructionStatus: body.constructionStatus || null,
        tourEmbedUrl: body.tourEmbedUrl || '',
        images: typeof body.images === 'string' ? body.images : JSON.stringify(body.images || []),
        floorPlans: typeof body.floorPlans === 'string' ? body.floorPlans : JSON.stringify(body.floorPlans || []),
        isPublished: Boolean(body.isPublished),
        isFeatured: Boolean(body.isFeatured),
        isNegotiable: Boolean(body.isNegotiable),
        isVerified: Boolean(body.isVerified),
        isBachelorFriendly: Boolean(body.isBachelorFriendly),
        isPetFriendly: Boolean(body.isPetFriendly),
        isVegOnly: Boolean(body.isVegOnly),
    };
}

export async function POST(request: Request) {
    if (!(await isAuthenticated())) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();
        const data = sanitizePropertyData(body);

        // Generate slug from title
        let slug = body.slug || generateSlug(data.title);

        // Ensure slug is unique
        let counter = 1;
        let uniqueSlug = slug;
        while (await prisma.property.findUnique({ where: { slug: uniqueSlug } })) {
            uniqueSlug = `${slug}-${counter}`;
            counter++;
        }

        const property = await prisma.property.create({
            data: {
                ...data,
                slug: uniqueSlug,
            },
        });

        // Instant cache invalidation
        revalidatePath('/');
        revalidatePath('/list');

        return NextResponse.json(property, { status: 201 });
    } catch (error) {
        console.error('Error creating property:', error);
        const msg = error instanceof Error ? error.message : String(error);
        return NextResponse.json({ error: 'Failed to create property', details: msg }, { status: 500 });
    }
}
