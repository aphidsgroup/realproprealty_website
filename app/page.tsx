import Link from 'next/link';
import Image from 'next/image';
import { prisma } from '@/lib/db';
import { parseAmenities } from '@/lib/utils';
import PropertyCarousel from '@/components/PropertyCarousel';
import SearchBar from '@/components/SearchBar';

// ISR: Cache page at edge, revalidate every 60 seconds in background
export const revalidate = 60;

async function getSiteSettings() {
    try {
        const settings = await prisma.siteSettings.findUnique({
            where: { id: 'default' },
        });
        return settings;
    } catch (error) {
        console.error('Error fetching site settings:', error);
        return null;
    }
}

async function getFeaturedProperties() {
    try {
        const properties = await prisma.property.findMany({
            where: {
                isPublished: true,
            },
            orderBy: [
                { isFeatured: 'desc' },
                { createdAt: 'desc' },
            ],
            take: 10,
        });
        return properties;
    } catch (error) {
        console.error('Error fetching featured properties:', error);
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

export default async function HomePage() {
    const [settings, featuredProperties, areas] = await Promise.all([
        getSiteSettings(),
        getFeaturedProperties(),
        getUniqueAreas(),
    ]);

    const whatsappUrl = `https://wa.me/${settings?.whatsappNumber?.replace(/[^0-9]/g, '')}?text=${encodeURIComponent('Hi, I want to know more about properties - Realprop Realty')}`;
    const callUrl = `tel:${settings?.phoneNumber}`;

    return (
        <main className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900">
            <div className="container mx-auto px-4 py-8 max-w-2xl">
                {/* Header */}
                <header className="text-center mb-8 animate-fade-in">
                    <div className="mb-4">
                        <div className="w-32 h-32 mx-auto flex items-center justify-center">
                            <Image
                                src="/logo.png"
                                alt="Realprop Realty Logo"
                                width={128}
                                height={128}
                                className="object-contain"
                                priority
                            />
                        </div>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                        Your Trusted<br />Real Estate Partner
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-400">
                        {settings?.tagline || '360° Tours • Premium Properties • Chennai'}
                    </p>
                </header>

                {/* Search */}
                <div className="mb-6">
                    <SearchBar areas={areas} />
                </div>

                {/* Browse by Category */}
                <div className="mb-8">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                        Browse by Category
                    </h2>
                    <div className="grid grid-cols-3 gap-3">
                        <Link
                            href="/list?subtype=apartment"
                            className="flex flex-col items-center bg-white dark:bg-gray-800 hover:bg-primary-50 dark:hover:bg-gray-700 rounded-2xl shadow-sm hover:shadow-md border border-gray-100 dark:border-gray-700 transition-all duration-300 p-4"
                        >
                            <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center mb-2">
                                <svg className="w-6 h-6 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01M16 18h.01" />
                                </svg>
                            </div>
                            <span className="text-xs font-semibold text-gray-800 dark:text-gray-200">Apartment</span>
                        </Link>

                        <Link
                            href="/list?subtype=villa"
                            className="flex flex-col items-center bg-white dark:bg-gray-800 hover:bg-primary-50 dark:hover:bg-gray-700 rounded-2xl shadow-sm hover:shadow-md border border-gray-100 dark:border-gray-700 transition-all duration-300 p-4"
                        >
                            <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center mb-2">
                                <svg className="w-6 h-6 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                </svg>
                            </div>
                            <span className="text-xs font-semibold text-gray-800 dark:text-gray-200">Villa / House</span>
                        </Link>

                        <Link
                            href="/list?subtype=office"
                            className="flex flex-col items-center bg-white dark:bg-gray-800 hover:bg-primary-50 dark:hover:bg-gray-700 rounded-2xl shadow-sm hover:shadow-md border border-gray-100 dark:border-gray-700 transition-all duration-300 p-4"
                        >
                            <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center mb-2">
                                <svg className="w-6 h-6 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                            </div>
                            <span className="text-xs font-semibold text-gray-800 dark:text-gray-200">Office Space</span>
                        </Link>

                        <Link
                            href="/list?subtype=shop"
                            className="flex flex-col items-center bg-white dark:bg-gray-800 hover:bg-primary-50 dark:hover:bg-gray-700 rounded-2xl shadow-sm hover:shadow-md border border-gray-100 dark:border-gray-700 transition-all duration-300 p-4"
                        >
                            <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center mb-2">
                                <svg className="w-6 h-6 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                </svg>
                            </div>
                            <span className="text-xs font-semibold text-gray-800 dark:text-gray-200">Shop / Retail</span>
                        </Link>

                        <Link
                            href="/list?subtype=warehouse"
                            className="flex flex-col items-center bg-white dark:bg-gray-800 hover:bg-primary-50 dark:hover:bg-gray-700 rounded-2xl shadow-sm hover:shadow-md border border-gray-100 dark:border-gray-700 transition-all duration-300 p-4"
                        >
                            <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center mb-2">
                                <svg className="w-6 h-6 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                                </svg>
                            </div>
                            <span className="text-xs font-semibold text-gray-800 dark:text-gray-200">Warehouse</span>
                        </Link>

                        <Link
                            href="/list?subtype=plot"
                            className="flex flex-col items-center bg-white dark:bg-gray-800 hover:bg-primary-50 dark:hover:bg-gray-700 rounded-2xl shadow-sm hover:shadow-md border border-gray-100 dark:border-gray-700 transition-all duration-300 p-4"
                        >
                            <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center mb-2">
                                <svg className="w-6 h-6 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                                </svg>
                            </div>
                            <span className="text-xs font-semibold text-gray-800 dark:text-gray-200">Plot / Land</span>
                        </Link>
                    </div>
                </div>

                {/* Browse by Type */}
                <div className="mb-8">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                        Browse by Type
                    </h2>
                    <div className="grid grid-cols-2 gap-3">
                        <Link
                            href="/list?use=residential"
                            className="flex flex-col items-center bg-white dark:bg-gray-800 hover:bg-primary-50 dark:hover:bg-gray-700 rounded-2xl shadow-sm hover:shadow-md border border-gray-100 dark:border-gray-700 transition-all duration-300 p-5"
                        >
                            <div className="w-14 h-14 rounded-xl bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center mb-2">
                                <svg className="w-7 h-7 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                </svg>
                            </div>
                            <span className="font-semibold text-sm text-gray-900 dark:text-white">Residential</span>
                        </Link>

                        <Link
                            href="/list?use=commercial"
                            className="flex flex-col items-center bg-white dark:bg-gray-800 hover:bg-accent-50 dark:hover:bg-gray-700 rounded-2xl shadow-sm hover:shadow-md border border-gray-100 dark:border-gray-700 transition-all duration-300 p-5"
                        >
                            <div className="w-14 h-14 rounded-xl bg-accent-50 dark:bg-accent-900/30 flex items-center justify-center mb-2">
                                <svg className="w-7 h-7 text-accent-600 dark:text-accent-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                            </div>
                            <span className="font-semibold text-sm text-gray-900 dark:text-white">Commercial</span>
                        </Link>
                    </div>
                </div>

                {/* Featured Properties Carousel */}
                {featuredProperties.length > 0 && (
                    <div className="mb-8">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                            Featured Properties
                        </h2>
                        <PropertyCarousel properties={featuredProperties} />
                    </div>
                )}

                {/* Contact Actions */}
                <div className="grid grid-cols-2 gap-3 mb-8">
                    <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold py-3.5 px-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                        </svg>
                        <span className="text-sm">WhatsApp</span>
                    </a>
                    <a
                        href={callUrl}
                        className="flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3.5 px-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        <span className="text-sm">Call Us</span>
                    </a>
                </div>

                {/* Footer */}
                <footer className="text-center text-sm text-gray-500 dark:text-gray-400 mt-12">
                    <p>© 2026 {settings?.brandName || 'Realprop Realty'}. All rights reserved.</p>
                </footer>
            </div>
        </main>
    );
}
