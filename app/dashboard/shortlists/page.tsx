'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { formatPrice, formatSize } from '@/lib/utils';

interface ShortlistedProperty {
    id: string;
    property: {
        id: string;
        slug: string;
        title: string;
        areaName: string;
        city: string;
        priceInr: number;
        sizeSqft: number;
        bedrooms: number | null;
        images: string | null;
        isNegotiable: boolean;
    };
    createdAt: string;
}

export default function MyShortlistsPage() {
    const [shortlists, setShortlists] = useState<ShortlistedProperty[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/shortlist')
            .then(res => res.json())
            .then(data => { setShortlists(data.shortlists || []); setLoading(false); })
            .catch(() => setLoading(false));
    }, []);

    const handleRemove = async (propertyId: string) => {
        await fetch('/api/shortlist', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ propertyId }),
        });
        setShortlists(prev => prev.filter(s => s.property.id !== propertyId));
    };

    if (loading) return <div className="p-8 text-center">Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
                <div className="max-w-4xl mx-auto flex items-center gap-4">
                    <Link href="/dashboard" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                        ← Back
                    </Link>
                    <h1 className="text-xl font-bold text-gray-900 dark:text-white">My Shortlists</h1>
                </div>
            </header>

            <div className="max-w-4xl mx-auto px-4 py-8">
                {shortlists.length === 0 ? (
                    <div className="text-center py-16">
                        <p className="text-4xl mb-4">💛</p>
                        <p className="text-xl font-bold text-gray-900 dark:text-white mb-2">No shortlisted properties</p>
                        <p className="text-gray-500 dark:text-gray-400 mb-6">Browse properties and tap the heart to save them here.</p>
                        <Link href="/list" className="px-6 py-3 bg-gray-900 text-orange-500 rounded-xl font-semibold hover:bg-black transition-colors border border-gray-800">
                            Browse Properties
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {shortlists.map(({ property, createdAt }) => {
                            const images = property.images ? JSON.parse(property.images) : [];
                            const cover = images[0] || null;
                            return (
                                <div key={property.id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden flex">
                                    {cover && (
                                        <div className="relative w-32 h-32 flex-shrink-0">
                                            <Image src={cover} alt={property.title} fill className="object-cover" sizes="128px" />
                                        </div>
                                    )}
                                    <div className="flex-1 p-4 flex items-center justify-between">
                                        <Link href={`/p/${property.slug}`} className="flex-1">
                                            <h3 className="font-bold text-gray-900 dark:text-white hover:text-primary-600 transition-colors">{property.title}</h3>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">{property.areaName}, {property.city}</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="font-bold text-primary-600 dark:text-primary-400">{formatPrice(property.priceInr)}</span>
                                                {property.isNegotiable && <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-bold rounded-full">Negotiable</span>}
                                                <span className="text-sm text-gray-500">• {formatSize(property.sizeSqft)}</span>
                                            </div>
                                            <p className="text-xs text-gray-400 mt-1">Saved {new Date(createdAt).toLocaleDateString()}</p>
                                        </Link>
                                        <button onClick={() => handleRemove(property.id)} className="ml-4 p-2 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors" title="Remove">
                                            ✕
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
