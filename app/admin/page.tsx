import Link from 'next/link';
import { prisma } from '@/lib/db';

// Force dynamic rendering - don't pre-render at build time
export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function getStats() {
    try {
        const [
            totalProperties, 
            publishedProperties, 
            residentialProperties, 
            commercialProperties,
            totalLeads,
            pendingSubmissions
        ] = await Promise.all([
            prisma.property.count(),
            prisma.property.count({ where: { isPublished: true } }),
            prisma.property.count({ where: { usageType: 'residential', isPublished: true } }),
            prisma.property.count({ where: { usageType: 'commercial', isPublished: true } }),
            prisma.lead.count(),
            prisma.onboardingSubmission.count({ where: { status: 'pending' } })
        ]);
        return { totalProperties, publishedProperties, residentialProperties, commercialProperties, totalLeads, pendingSubmissions };
    } catch (error) {
        console.error('Error fetching stats:', error);
        return { totalProperties: 0, publishedProperties: 0, residentialProperties: 0, commercialProperties: 0, totalLeads: 0, pendingSubmissions: 0 };
    }
}

async function getRecentProperties() {
    try {
        return await prisma.property.findMany({
            orderBy: { createdAt: 'desc' },
            take: 5,
        });
    } catch (error) {
        console.error('Error fetching recent properties:', error);
        return [];
    }
}

export default async function AdminDashboard() {
    const stats = await getStats();
    const recentProperties = await getRecentProperties();

    return (
        <div className="container mx-auto px-4 py-8 max-w-7xl">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                    Dashboard
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    Welcome to Realprop Realty CMS
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
                {/* Total Properties */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-5">
                    <div className="flex items-start justify-between mb-2">
                        <h3 className="text-xs font-semibold text-gray-400 dark:text-gray-400">Total Properties</h3>
                        <svg className="w-4 h-4 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                    </div>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.totalProperties}</p>
                </div>

                {/* Published */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-5">
                    <div className="flex items-start justify-between mb-2">
                        <h3 className="text-xs font-semibold text-gray-400 dark:text-gray-400">Published</h3>
                        <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.publishedProperties}</p>
                </div>

                {/* Residential */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-5">
                    <div className="flex items-start justify-between mb-2">
                        <h3 className="text-xs font-semibold text-gray-400 dark:text-gray-400">Residential</h3>
                        <svg className="w-4 h-4 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                    </div>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.residentialProperties}</p>
                </div>

                {/* Commercial */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-5">
                    <div className="flex items-start justify-between mb-2">
                        <h3 className="text-xs font-semibold text-gray-400 dark:text-gray-400">Commercial</h3>
                        <svg className="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.commercialProperties}</p>
                </div>

                {/* Total Leads */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-5">
                    <div className="flex items-start justify-between mb-2">
                        <h3 className="text-xs font-semibold text-gray-400 dark:text-gray-400">Total Leads</h3>
                        <svg className="w-4 h-4 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                    </div>
                    <div className="flex items-end gap-2">
                        <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.totalLeads}</p>
                        <Link href="/admin/leads" className="text-[10px] text-primary-600 font-semibold mb-1 hover:underline">View all →</Link>
                    </div>
                </div>

                {/* Pending Submissions */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-5">
                    <div className="flex items-start justify-between mb-2">
                        <h3 className="text-xs font-semibold text-gray-400 dark:text-gray-400">Pending Submissions</h3>
                        <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                    <div className="flex items-end gap-2">
                        <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.pendingSubmissions}</p>
                        <Link href="/admin/verification-forms" className="text-[10px] text-primary-600 font-semibold mb-1 hover:underline">Verify now →</Link>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white dark:bg-gray-800 rounded-[2rem] shadow-sm border border-gray-100 dark:border-gray-700 p-6 mb-8">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
                <div className="flex flex-wrap gap-3">
                    <Link
                        href="/admin/properties/new"
                        className="flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Add Property
                    </Link>

                    <Link
                        href="/admin/properties"
                        className="flex items-center gap-2 px-6 py-3 bg-[#f3f4f6] dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-white font-semibold rounded-xl transition-colors"
                    >
                        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                        </svg>
                        Properties
                    </Link>
                    
                    <Link
                        href="/admin/leads"
                        className="flex items-center gap-2 px-6 py-3 bg-[#f3f4f6] dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-white font-semibold rounded-xl transition-colors"
                    >
                        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        Leads
                    </Link>
                    
                    <Link
                        href="/admin/users"
                        className="flex items-center gap-2 px-6 py-3 bg-[#f3f4f6] dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-white font-semibold rounded-xl transition-colors"
                    >
                        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                        Users
                    </Link>

                    <Link
                        href="/admin/managers"
                        className="flex items-center gap-2 px-6 py-3 bg-[#f3f4f6] dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-white font-semibold rounded-xl transition-colors"
                    >
                        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        Managers
                    </Link>

                    <Link
                        href="/admin/verification-forms"
                        className="flex items-center gap-2 px-6 py-3 bg-[#f3f4f6] dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-white font-semibold rounded-xl transition-colors"
                    >
                        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Forms
                    </Link>

                    <Link
                        href="/admin/settings"
                        className="flex items-center gap-2 px-6 py-3 bg-[#f3f4f6] dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-white font-semibold rounded-xl transition-colors"
                    >
                        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Settings
                    </Link>
                </div>
            </div>

            {/* Recent Properties */}
            <div className="bg-white dark:bg-gray-800 rounded-[2rem] shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                <div className="flex items-center justify-between mb-4 px-2">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">Recent Properties</h2>
                    <Link
                        href="/admin/properties"
                        className="text-sm font-semibold text-primary-600 hover:text-primary-700 transition-colors"
                    >
                        View All →
                    </Link>
                </div>

                {recentProperties.length > 0 ? (
                    <div className="space-y-2">
                        {recentProperties.map((property) => (
                            <Link
                                key={property.id}
                                href={`/admin/properties/${property.id}/edit`}
                                className="flex items-center justify-between p-4 bg-[#f8fafc] dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-xl transition-colors group"
                            >
                                <div>
                                    <h3 className="font-bold text-gray-900 dark:text-white text-sm">
                                        {property.title}
                                    </h3>
                                    <p className="text-[13px] text-gray-500 dark:text-gray-400 mt-1">
                                        {property.areaName} • <span className="uppercase text-[10px] tracking-wider font-bold">{property.usageType === 'residential' ? 'BUY' : 'SELL'}</span> • {property.usageType}
                                    </p>
                                </div>
                                <div>
                                    {property.isPublished ? (
                                        <span className="px-3 py-1 bg-green-50 text-green-700 text-xs font-bold rounded-full border border-green-100">
                                            Published
                                        </span>
                                    ) : (
                                        <span className="px-3 py-1 bg-gray-100 text-gray-500 text-xs font-bold rounded-full">
                                            Draft
                                        </span>
                                    )}
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500 dark:text-gray-400 text-center py-8 text-sm">
                        No properties yet. Create your first property!
                    </p>
                )}
            </div>
        </div>
    );
}
