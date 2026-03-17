import Link from 'next/link';
import { prisma } from '@/lib/db';
import { parseAmenities } from '@/lib/utils';
import PropertyCard from '@/components/PropertyCard';
import FilterSheet from '@/components/FilterSheet';
import ListHeader from '@/components/ListHeader';
import SiteHeader from '@/components/SiteHeader';
import FloatingShortlistButton from '@/components/FloatingShortlistButton';
import SortButton from '@/components/SortButton';
import { DealType, UsageType } from '@/lib/types';

// ISR: Cache page at edge, revalidate every 30 seconds
export const revalidate = 30;

interface ListPageProps {
    searchParams: Promise<{
        use?: UsageType;
        area?: string;
        subtype?: string;
        minPrice?: string;
        maxPrice?: string;
        minSize?: string;
        maxSize?: string;
        amenities?: string;
        bhk?: string;
        sort?: string;
    }>;
}

async function getProperties(filters: {
    use?: UsageType;
    area?: string;     // comma-separated areas
    subtype?: string;  // property subtype (apartment, villa, office, etc.)
    minPrice?: number;
    maxPrice?: number;
    minSize?: number;
    maxSize?: number;
    amenities?: string[];
    bhk?: string;      // maps to bedrooms field
}) {
    try {
        const where: any = {
            isPublished: true,
        };

        if (filters.use) where.usageType = filters.use;
        if (filters.subtype) where.propertySubtype = { contains: filters.subtype, mode: 'insensitive' };

        // Multi-area: comma-separated values use "in" query
        if (filters.area) {
            const areaList = filters.area.split(',').map(a => a.trim()).filter(Boolean);
            if (areaList.length === 1) {
                where.areaName = areaList[0];
            } else if (areaList.length > 1) {
                where.areaName = { in: areaList };
            }
        }

        if (filters.minPrice) where.priceInr = { ...where.priceInr, gte: filters.minPrice };
        if (filters.maxPrice) where.priceInr = { ...where.priceInr, lte: filters.maxPrice };
        if (filters.minSize) where.sizeSqft = { ...where.sizeSqft, gte: filters.minSize };
        if (filters.maxSize) where.sizeSqft = { ...where.sizeSqft, lte: filters.maxSize };
        if (filters.bhk) {
            if (filters.bhk === '4+ BHK') {
                where.bedrooms = { gte: 4 };
            } else {
                const beds = parseInt(filters.bhk);
                if (!isNaN(beds)) where.bedrooms = beds;
            }
        }

        const properties = await prisma.property.findMany({
            where,
            orderBy: { createdAt: 'desc' },
        });

        return properties;

        // Filter by amenities (client-side since Supabase doesn't support JSON queries easily)
        // NOTE: amenity filtering removed as it's unused with the early return above
    } catch (error) {
        console.error('Error fetching properties:', error);
        return [];
    }
}

async function getUniqueAreas() {
    try {
        const properties = await prisma.property.findMany({
            where: { isPublished: true },
            select: { areaName: true },
            distinct: ['areaName'],
        });
        return properties.map(p => p.areaName).sort();
    } catch (error) {
        console.error('Error fetching areas:', error);
        return [];
    }
}

async function getAmenitiesVocabulary() {
    try {
        const settings = await prisma.siteSettings.findUnique({
            where: { id: 'default' },
        });
        return settings ? JSON.parse(settings.amenitiesVocabulary) : [];
    } catch (error) {
        console.error('Error fetching amenities:', error);
        return [];
    }
}

export default async function ListPage({ searchParams }: ListPageProps) {
    const params = await searchParams;

    const filters = {
        use: params.use,
        area: params.area,
        subtype: params.subtype,
        minPrice: params.minPrice ? parseInt(params.minPrice) : undefined,
        maxPrice: params.maxPrice ? parseInt(params.maxPrice) : undefined,
        minSize: params.minSize ? parseInt(params.minSize) : undefined,
        maxSize: params.maxSize ? parseInt(params.maxSize) : undefined,
        amenities: params.amenities?.split(',').filter(Boolean),
        bhk: params.bhk,
    };

    const [allProperties, areas, amenitiesVocab] = await Promise.all([
        getProperties(filters),
        getUniqueAreas(),
        getAmenitiesVocabulary(),
    ]);

    // Server-side sorting
    const sortBy = params.sort || 'newest';
    const properties = [...allProperties].sort((a, b) => {
        switch (sortBy) {
            case 'price_low': return a.priceInr - b.priceInr;
            case 'price_high': return b.priceInr - a.priceInr;
            case 'size_large': return b.sizeSqft - a.sizeSqft;
            case 'size_small': return a.sizeSqft - b.sizeSqft;
            case 'newest':
            default: return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
    });

    return (
        <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <SiteHeader />
            {/* Header */}
            <ListHeader areas={areas} currentUse={params.use} currentArea={params.area} />

            {/* Results */}
            <div className="container mx-auto px-4 py-6 pb-24">
                {/* Results Count + Sort */}
                <div className="flex items-center justify-between mb-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        {properties.length} {properties.length === 1 ? 'property' : 'properties'} found
                    </p>
                    <SortButton />
                </div>

                {/* Properties Grid */}
                {properties.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {properties.map((property) => (
                            <PropertyCard key={property.id} property={property} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <svg className="w-16 h-16 mx-auto text-gray-400 dark:text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                            No properties found
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            Try adjusting your filters to see more results
                        </p>
                        <Link
                            href="/list"
                            className="inline-block px-6 py-3 bg-gray-900 hover:bg-black text-orange-500 font-semibold rounded-xl transition-colors border border-gray-800"
                        >
                            Clear All Filters
                        </Link>
                    </div>
                )}
            </div>

            {/* Filter Sheet */}
            <FilterSheet areas={areas} amenitiesVocab={amenitiesVocab} />

            {/* Floating Shortlist */}
            <FloatingShortlistButton />
        </main>
    );
}
