import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import { formatPrice, formatSize, parseFacilities, parseLocationAdvantages, buildWhatsAppUrl } from '@/lib/utils';
import ContactBar from '@/components/ContactBar';
import TeleportMeEmbed from '@/components/TeleportMeEmbed';
import PropertyCarousel from '@/components/PropertyCarousel';
import CarouselWrapper from '@/components/CarouselWrapper';
import ViewAllButton from '@/components/ViewAllButton';

interface PropertyPageProps {
    params: Promise<{
        slug: string;
    }>;
}

async function getProperty(slug: string) {
    const property = await prisma.property.findUnique({
        where: { slug, isPublished: true },
    });
    return property;
}

async function getSiteSettings() {
    const settings = await prisma.siteSettings.findUnique({
        where: { id: 'default' },
    });
    return settings;
}

async function getRelatedProperties(currentPropertyId: string, usageType: string, city: string) {
    const relatedProperties = await prisma.property.findMany({
        where: {
            isPublished: true,
            id: { not: currentPropertyId },
            OR: [
                { usageType: usageType },
                { city: city }
            ]
        },
        take: 6,
        orderBy: {
            createdAt: 'desc'
        }
    });
    return relatedProperties;
}

export default async function PropertyPage({ params }: PropertyPageProps) {
    const { slug } = await params;
    const property = await getProperty(slug);
    const settings = await getSiteSettings();
    const relatedProperties = await getRelatedProperties(property?.id || '', property?.usageType || '', property?.city || '');

    if (!property) {
        notFound();
    }


    const propertyUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/p/${property.slug}`;

    const whatsappUrl = buildWhatsAppUrl(
        settings?.whatsappNumber || '+919876543210',
        settings?.whatsappTemplate || 'Hi, I\'m interested in {propertyTitle}. Link: {propertyUrl}',
        property.title,
        propertyUrl
    );

    const callUrl = `tel:${settings?.phoneNumber || '+919876543210'}`;

    return (
        <main className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-24">
            {/* Header */}
            <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-30 shadow-sm">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <Link href="/list" className="flex items-center gap-2 text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            <span className="font-semibold">Back to Listings</span>
                        </Link>
                    </div>
                </div>
            </header>

            {/* Content */}
            <div className="container mx-auto px-4 py-6 max-w-4xl">
                {/* Title & Location */}
                <div className="mb-6">
                    <div className="flex items-start justify-between gap-4 mb-2">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            {property.title}
                        </h1>
                        <span className="px-3 py-1 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 text-sm font-semibold rounded-full capitalize whitespace-nowrap">
                            {property.usageType}
                        </span>
                    </div>
                    <p className="text-lg text-gray-600 dark:text-gray-400">
                        {property.areaName}, {property.city}
                    </p>
                    {property.propertySubtype && (
                        <p className="text-sm text-gray-500 dark:text-gray-500">
                            {property.propertySubtype}
                        </p>
                    )}
                </div>

                {/* 360° Tour */}
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                        360° Virtual Tour
                    </h2>
                    {/* Portrait on mobile (133% = 3:4 ratio), landscape on desktop (56.25% = 16:9 ratio) */}
                    <div className="relative w-full bg-gray-900 rounded-2xl overflow-hidden shadow-2xl md:pb-[56.25%] pb-[133%]">
                        {(() => {
                            const isTeleportMe = property.tourEmbedUrl.includes('tours.realprop360.in') || property.tourEmbedUrl.includes('teleportme');
                            console.log('Tour URL:', property.tourEmbedUrl);
                            console.log('Is TeleportMe?', isTeleportMe);

                            return isTeleportMe ? (
                                <TeleportMeEmbed tourUrl={property.tourEmbedUrl} />
                            ) : (
                                <iframe
                                    src={property.tourEmbedUrl}
                                    className="absolute top-0 left-0 w-full h-full"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                                    allowFullScreen
                                    loading="lazy"
                                    title={`360° Tour of ${property.title}`}
                                />
                            );
                        })()}
                    </div>
                </div>

                {/* Specs */}
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                        Specifications
                    </h2>
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6">
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Price</p>
                                <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                                    {formatPrice(property.priceInr)}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Size</p>
                                <p className="text-xl font-semibold text-gray-900 dark:text-white">
                                    {formatSize(property.sizeSqft)}
                                </p>
                            </div>
                            {property.bedrooms !== null && property.bedrooms > 0 && (
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Bedrooms</p>
                                    <p className="text-xl font-semibold text-gray-900 dark:text-white">
                                        {property.bedrooms} BHK
                                    </p>
                                </div>
                            )}
                            {property.bathrooms && (
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Bathrooms</p>
                                    <p className="text-xl font-semibold text-gray-900 dark:text-white">
                                        {property.bathrooms}
                                    </p>
                                </div>
                            )}
                            {property.parking && (
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Parking</p>
                                    <p className="text-xl font-semibold text-gray-900 dark:text-white">
                                        {property.parking}
                                    </p>
                                </div>
                            )}
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Type</p>
                                <p className="text-xl font-semibold text-gray-900 dark:text-white capitalize">
                                    {property.usageType}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Construction Status */}
                {property.constructionStatus && (
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                            Construction Status
                        </h2>
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6">
                            <div className="flex items-center gap-4">
                                <div className={`px-6 py-3 rounded-xl font-semibold text-lg ${property.constructionStatus === 'Ready to Move'
                                        ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                                        : property.constructionStatus === 'Under Construction'
                                            ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
                                            : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                                    }`}>
                                    {property.constructionStatus}
                                </div>
                                {property.constructionStatus === 'Ready to Move' && (
                                    <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span className="font-medium">Move-in Ready</span>
                                    </div>
                                )}
                                {property.constructionStatus === 'Under Construction' && (
                                    <div className="flex items-center gap-2 text-yellow-600 dark:text-yellow-400">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <span className="font-medium">In Progress</span>
                                    </div>
                                )}
                                {property.constructionStatus === 'Upcoming' && (
                                    <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        <span className="font-medium">Coming Soon</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Top Facilities */}
                {(() => {
                    const facilities = parseFacilities(property.facilities);
                    return facilities.length > 0 && (
                        <div className="mb-8">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                    Top Facilities
                                </h2>
                                <ViewAllButton
                                    count={facilities.length}
                                    title="Top Facilities"
                                    items={facilities.map(f => ({ name: f }))}
                                    type="facilities"
                                />
                            </div>
                            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6">
                                <CarouselWrapper scrollId="facilities-scroll">
                                    <div className="flex gap-4 pb-2">
                                        {facilities.map((facility, index) => (
                                            <div key={index} className="flex-shrink-0 w-48">
                                                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg h-full">
                                                    <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                                                        <svg className="w-5 h-5 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                        </svg>
                                                    </div>
                                                    <span className="text-sm font-medium text-gray-900 dark:text-white">{facility}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CarouselWrapper>
                            </div>
                        </div>
                    );
                })()}

                {/* Location Advantages */}
                {(() => {
                    const locations = parseLocationAdvantages(property.locationAdvantages);
                    const getCategoryIcon = (category: string) => {
                        const icons: Record<string, JSX.Element> = {
                            school: (
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                            ),
                            hospital: (
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                            ),
                            shopping: (
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                </svg>
                            ),
                            restaurant: (
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            ),
                            bank: (
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                </svg>
                            ),
                            metro: (
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                                </svg>
                            ),
                            bus: (
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            ),
                            airport: (
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                </svg>
                            ),
                            park: (
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                                </svg>
                            ),
                            supermarket: (
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            ),
                        };
                        return icons[category] || icons.school;
                    };

                    return locations.length > 0 && (
                        <div className="mb-8">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                    Location Advantages
                                </h2>
                                <ViewAllButton
                                    count={locations.length}
                                    title="Location Advantages"
                                    items={locations.map(loc => ({
                                        name: loc.name,
                                        category: loc.category,
                                        distance: loc.distance,
                                        icon: getCategoryIcon(loc.category)
                                    }))}
                                    type="locations"
                                />
                            </div>
                            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6">
                                <CarouselWrapper scrollId="locations-scroll">
                                    <div className="flex gap-4 pb-2">
                                        {locations.map((location, index) => (
                                            <div key={index} className="flex-shrink-0 w-72">
                                                <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg h-full">
                                                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0 text-blue-600 dark:text-blue-400">
                                                        {getCategoryIcon(location.category)}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h3 className="font-semibold text-gray-900 dark:text-white mb-1 truncate">{location.name}</h3>
                                                        <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">{location.category}</p>
                                                        <p className="text-sm font-medium text-primary-600 dark:text-primary-400 mt-1">{location.distance}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CarouselWrapper>
                            </div>
                        </div>
                    );
                })()}

                {/* Floor Plans / Layout Plans */}
                {(() => {
                    const floorPlans = property.floorPlans ? JSON.parse(property.floorPlans) : [];
                    return floorPlans.length > 0 && (
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                                Floor Plans / Layout Plans
                            </h2>
                            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {floorPlans.map((plan: string, index: number) => {
                                        const isPdf = plan.endsWith('.pdf');
                                        const fileName = plan.split('/').pop() || `Floor Plan ${index + 1}`;

                                        return (
                                            <div key={index} className="relative group">
                                                {isPdf ? (
                                                    <a
                                                        href={plan}
                                                        download
                                                        className="block bg-gray-100 dark:bg-gray-700 rounded-xl p-6 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                                                    >
                                                        <div className="flex flex-col items-center justify-center">
                                                            <svg className="w-16 h-16 text-red-500 mb-3" fill="currentColor" viewBox="0 0 20 20">
                                                                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                                                            </svg>
                                                            <p className="text-sm font-semibold text-gray-900 dark:text-white text-center mb-2">
                                                                {fileName}
                                                            </p>
                                                            <div className="flex items-center gap-2 text-primary-600 dark:text-primary-400">
                                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                                </svg>
                                                                <span className="text-sm font-medium">Download PDF</span>
                                                            </div>
                                                        </div>
                                                    </a>
                                                ) : (
                                                    <div className="relative">
                                                        <div className="relative w-full h-64 bg-gray-100 dark:bg-gray-700 rounded-xl overflow-hidden">
                                                            <Image
                                                                src={plan}
                                                                alt={`Floor plan ${index + 1}`}
                                                                fill
                                                                className="object-contain p-2"
                                                            />
                                                        </div>
                                                        <a
                                                            href={plan}
                                                            download
                                                            className="absolute bottom-2 right-2 bg-primary-500 hover:bg-primary-600 text-white px-3 py-2 rounded-lg flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                            </svg>
                                                            <span className="text-sm">Download</span>
                                                        </a>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    );
                })()}


                {/* Technical Services */}
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                        Technical Services on Request
                    </h2>
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                            Professional property services available on request. Contact us for detailed quotes.
                        </p>
                        <div className="space-y-4">
                            {/* Property Valuation */}
                            <div className="p-4 bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800 rounded-lg">
                                <div className="flex items-start gap-3">
                                    <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Property Valuation</h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Market price assessment and comparative analysis</p>
                                        <span className="text-xs text-green-600 dark:text-green-400 font-medium">Available on Request</span>
                                    </div>
                                </div>
                            </div>

                            {/* Legal Documents Verification */}
                            <div className="p-4 bg-purple-50 dark:bg-purple-900/10 border border-purple-200 dark:border-purple-800 rounded-lg">
                                <div className="flex items-start gap-3">
                                    <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Legal Documents Verification</h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Title verification, encumbrance check, and legal compliance</p>
                                        <span className="text-xs text-purple-600 dark:text-purple-400 font-medium">Available on Request</span>
                                    </div>
                                </div>
                            </div>

                            {/* Structural Auditing */}
                            <div className="p-4 bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 rounded-lg">
                                <div className="flex items-start gap-3 mb-4">
                                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                        </svg>
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Structural Auditing</h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Professional engineering assessments at multiple levels</p>
                                        <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">Available on Request</span>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    {/* CA - Condition Audit */}
                                    <div className="p-3 bg-white dark:bg-gray-800 rounded-lg border border-blue-200 dark:border-blue-700">
                                        <div className="flex items-center justify-between mb-2">
                                            <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Basic Visual & Safety Audit</h4>
                                            <span className="text-xs px-2 py-0.5 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 rounded font-medium">Basic</span>
                                        </div>
                                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 italic">Best for: Standard apartments</p>
                                        <ul className="space-y-1 text-xs text-gray-700 dark:text-gray-300">
                                            <li className="flex items-start gap-2">
                                                <span className="text-blue-600 dark:text-blue-400 mt-0.5">•</span>
                                                <span><strong>Visual Inspection:</strong> Checking for surface cracks, dampness (seepage), and spalling of concrete</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <span className="text-blue-600 dark:text-blue-400 mt-0.5">•</span>
                                                <span><strong>Plumbing & Electrical Check:</strong> Ensuring no major leakages that could affect the structure's life</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <span className="text-blue-600 dark:text-blue-400 mt-0.5">•</span>
                                                <span><strong>Carpet Area Verification:</strong> Measuring the actual usable area vs. what is on paper</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <span className="text-blue-600 dark:text-blue-400 mt-0.5">•</span>
                                                <span><strong>Deliverable:</strong> A simple "Condition Report" included with the 360° Virtual Tour</span>
                                            </li>
                                        </ul>
                                    </div>

                                    {/* IA - Integrity Audit */}
                                    <div className="p-3 bg-white dark:bg-gray-800 rounded-lg border border-blue-200 dark:border-blue-700">
                                        <div className="flex items-center justify-between mb-2">
                                            <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Premium Structural Integrity Audit</h4>
                                            <span className="text-xs px-2 py-0.5 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 rounded font-medium">Premium</span>
                                        </div>
                                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 italic">Best for: Individual houses (Villas) and older buildings (10+ years)</p>
                                        <ul className="space-y-1 text-xs text-gray-700 dark:text-gray-300">
                                            <li className="flex items-start gap-2">
                                                <span className="text-blue-600 dark:text-blue-400 mt-0.5">•</span>
                                                <span><strong>Rebound Hammer Test:</strong> Non-destructive testing (NDT) to check the surface hardness and compressive strength of the concrete</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <span className="text-blue-600 dark:text-blue-400 mt-0.5">•</span>
                                                <span><strong>Cover Meter Test:</strong> Checking the reinforcement (rebar) position and whether the concrete cover is sufficient to prevent rusting</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <span className="text-blue-600 dark:text-blue-400 mt-0.5">•</span>
                                                <span><strong>Dampness Mapping:</strong> Using thermal or moisture meters to find hidden leaks inside walls</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <span className="text-blue-600 dark:text-blue-400 mt-0.5">•</span>
                                                <span><strong>Deliverable:</strong> A "Health Certificate" for the building signed by a qualified person</span>
                                            </li>
                                        </ul>
                                    </div>

                                    {/* AA - Asset Audit */}
                                    <div className="p-3 bg-white dark:bg-gray-800 rounded-lg border border-blue-200 dark:border-blue-700">
                                        <div className="flex items-center justify-between mb-2">
                                            <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Full Technical & Legal Due Diligence</h4>
                                            <span className="text-xs px-2 py-0.5 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 rounded font-medium">Full Tech</span>
                                        </div>
                                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 italic">Best for: High-value investments and commercial properties</p>
                                        <ul className="space-y-1 text-xs text-gray-700 dark:text-gray-300">
                                            <li className="flex items-start gap-2">
                                                <span className="text-blue-600 dark:text-blue-400 mt-0.5">•</span>
                                                <span><strong>Ultrasonic Pulse Velocity (UPV) Test:</strong> To detect internal flaws, honeycombing, or cracks deep inside the pillars/beams</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <span className="text-blue-600 dark:text-blue-400 mt-0.5">•</span>
                                                <span><strong>Foundation Assessment:</strong> Checking for signs of settlement or soil-related shifts</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <span className="text-blue-600 dark:text-blue-400 mt-0.5">•</span>
                                                <span><strong>Legal-Technical Hybrid:</strong> Verifying the building's structural stability against the approved CMDA/DTCP plan</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <span className="text-blue-600 dark:text-blue-400 mt-0.5">•</span>
                                                <span><strong>Deliverable:</strong> A "Comprehensive Asset Report" providing total peace of mind to the buyer</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Contact Info */}
                <div className="bg-gradient-to-r from-primary-50 to-accent-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-6 text-center mb-8">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                        Interested in this property?
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                        Contact us via WhatsApp, call, or share this listing
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-500">
                        Use the buttons below to get in touch
                    </p>
                </div>

                {/* People Also Viewed */}
                {relatedProperties.length > 0 && (
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                            People Also Viewed
                        </h2>
                        <PropertyCarousel properties={relatedProperties} />
                    </div>
                )}
            </div>

            {/* Contact Bar */}
            <ContactBar
                whatsappUrl={whatsappUrl}
                callUrl={callUrl}
                propertyTitle={property.title}
            />
        </main>
    );
}
