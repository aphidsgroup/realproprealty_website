'use client';

import Link from 'next/link';
import { useState, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CHENNAI_AREAS } from '@/lib/chennai-areas';

interface ListHeaderProps {
    areas: string[];      // DB areas (have properties)
    currentUse?: string;
    currentArea?: string; // Can be comma-separated for multi-area
}

export default function ListHeader({ areas, currentUse, currentArea }: ListHeaderProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [searchQuery, setSearchQuery] = useState('');
    const [showSearch, setShowSearch] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    const selectedAreas = currentArea ? currentArea.split(',').filter(Boolean) : [];

    // Merge DB areas with Chennai areas for search
    const allAreas = [...new Set([...areas, ...CHENNAI_AREAS])].sort();
    const filteredAreas = searchQuery.trim()
        ? allAreas.filter(a => a.toLowerCase().includes(searchQuery.toLowerCase()))
        : [];

    const handleAreaClick = (area: string) => {
        const params = new URLSearchParams(searchParams.toString());
        const current = params.get('area')?.split(',').filter(Boolean) || [];

        if (current.includes(area)) {
            const remaining = current.filter(a => a !== area);
            if (remaining.length > 0) {
                params.set('area', remaining.join(','));
            } else {
                params.delete('area');
            }
        } else {
            params.set('area', area);
        }
        router.push(`/list?${params.toString()}`);
        setShowSearch(false);
        setSearchQuery('');
    };

    const handleSearchSubmit = () => {
        if (searchQuery.trim()) {
            const params = new URLSearchParams(searchParams.toString());
            params.set('area', searchQuery.trim());
            router.push(`/list?${params.toString()}`);
            setShowSearch(false);
            setSearchQuery('');
        }
    };

    const clearAllAreas = () => {
        const params = new URLSearchParams(searchParams.toString());
        params.delete('area');
        router.push(`/list?${params.toString()}`);
    };

    return (
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-30 shadow-sm">
            <div className="container mx-auto px-4 py-3">
                {/* Top row */}
                <div className="flex items-center justify-between mb-3">
                    <Link href="/" className="flex items-center gap-2 text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        <span className="text-sm font-semibold">Back</span>
                    </Link>
                    <h1 className="text-lg font-bold text-gray-900 dark:text-white">Properties</h1>
                    <button
                        onClick={() => setShowSearch(!showSearch)}
                        className={`p-2 rounded-full transition-colors ${showSearch ? 'bg-primary-100 text-primary-600' : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400'}`}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </button>
                </div>

                {/* Search bar */}
                {showSearch && (
                    <div className="mb-3 animate-fade-in">
                        <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-xl overflow-hidden">
                            <div className="flex-1 flex items-center gap-2 px-3">
                                <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSearchSubmit()}
                                    placeholder="Search area..."
                                    autoFocus
                                    className="flex-1 py-2.5 bg-transparent text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none text-sm"
                                />
                            </div>
                            <button
                                onClick={handleSearchSubmit}
                                className="bg-primary-500 hover:bg-primary-600 text-white text-sm font-semibold py-2.5 px-4 transition-colors"
                            >
                                Search
                            </button>
                        </div>

                        {/* Search results */}
                        {filteredAreas.length > 0 && (
                            <div className="mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 max-h-48 overflow-y-auto">
                                {filteredAreas.slice(0, 10).map(area => (
                                    <button
                                        key={area}
                                        onClick={() => handleAreaClick(area)}
                                        className="w-full text-left px-4 py-2.5 hover:bg-primary-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white text-sm transition-colors flex items-center gap-2 border-b border-gray-100 dark:border-gray-700 last:border-0"
                                    >
                                        <svg className={`w-3.5 h-3.5 flex-shrink-0 ${areas.includes(area) ? 'text-primary-500' : 'text-gray-300'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        {area}
                                        {areas.includes(area) && (
                                            <span className="text-[10px] bg-green-100 text-green-600 px-1.5 py-0.5 rounded-full font-semibold ml-auto">Available</span>
                                        )}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Active area badges */}
                {selectedAreas.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5 mb-3">
                        {selectedAreas.map(area => (
                            <span
                                key={area}
                                className="inline-flex items-center gap-1 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 px-2.5 py-1 rounded-full text-xs font-semibold"
                            >
                                {area}
                                <button
                                    onClick={() => handleAreaClick(area)}
                                    className="hover:bg-primary-200 dark:hover:bg-primary-800 rounded-full p-0.5"
                                >
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </span>
                        ))}
                        <button
                            onClick={clearAllAreas}
                            className="text-xs text-gray-500 hover:text-red-500 font-medium transition-colors"
                        >
                            Clear all
                        </button>
                    </div>
                )}

                {/* Usage Type Toggle */}
                <div className="flex gap-2 mb-2">
                    <Link
                        href={`/list${currentArea ? `?area=${encodeURIComponent(currentArea)}&use=residential` : '?use=residential'}`}
                        className={`flex-1 px-4 py-2 rounded-xl font-semibold text-center text-sm transition-all duration-300 ${currentUse === 'residential' || !currentUse
                            ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-md'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                            }`}
                    >
                        Residential
                    </Link>
                    <Link
                        href={`/list${currentArea ? `?area=${encodeURIComponent(currentArea)}&use=commercial` : '?use=commercial'}`}
                        className={`flex-1 px-4 py-2 rounded-xl font-semibold text-center text-sm transition-all duration-300 ${currentUse === 'commercial'
                            ? 'bg-gradient-to-r from-accent-500 to-accent-600 text-white shadow-md'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                            }`}
                    >
                        Commercial
                    </Link>
                </div>

                {/* Area quick chips (DB areas only - these have properties) */}
                {areas.length > 0 && (
                    <div
                        ref={scrollRef}
                        className="flex gap-1.5 overflow-x-auto pb-1"
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                        {areas.map(area => (
                            <button
                                key={area}
                                onClick={() => handleAreaClick(area)}
                                className={`flex-shrink-0 px-2.5 py-1 rounded-full text-xs font-medium transition-all duration-200 ${selectedAreas.includes(area)
                                    ? 'bg-primary-500 text-white'
                                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                    }`}
                            >
                                {area}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </header>
    );
}
