'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CHENNAI_AREAS } from '@/lib/chennai-areas';

interface SearchBarProps {
    areas: string[]; // DB areas (properties that actually exist)
}

export default function SearchBar({ areas }: SearchBarProps) {
    const router = useRouter();
    const [query, setQuery] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    // Merge DB areas with all Chennai areas
    const allAreas = [...new Set([...areas, ...CHENNAI_AREAS])].sort();

    // Filter based on query
    const filteredAreas = query.trim()
        ? allAreas.filter(a => a.toLowerCase().includes(query.toLowerCase()))
        : allAreas;

    // Split into available (have properties) and all areas
    const availableAreas = filteredAreas.filter(a => areas.includes(a));
    const otherAreas = filteredAreas.filter(a => !areas.includes(a));

    // Close dropdown on click outside
    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSearch = (area?: string) => {
        const searchArea = area || query.trim();
        if (searchArea) {
            router.push(`/list?area=${encodeURIComponent(searchArea)}`);
        } else {
            router.push('/list');
        }
        setIsOpen(false);
        setQuery('');
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') handleSearch();
        if (e.key === 'Escape') setIsOpen(false);
    };

    return (
        <div ref={wrapperRef} className="relative">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700 flex items-center h-14">
                {/* Search icon on left */}
                <div className="pl-4 pr-2 flex items-center">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>

                {/* Input */}
                <input
                    type="text"
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        setIsOpen(true);
                    }}
                    onFocus={() => setIsOpen(true)}
                    onKeyDown={handleKeyDown}
                    placeholder="Search by area..."
                    className="flex-1 h-full bg-transparent text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none text-sm"
                />

                {/* Search icon button on right */}
                <button
                    onClick={() => handleSearch()}
                    className="h-10 w-10 mr-2 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white flex items-center justify-center transition-all duration-300 flex-shrink-0"
                    aria-label="Search"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </button>
            </div>

            {/* Area Suggestions Dropdown */}
            {isOpen && filteredAreas.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 z-50 max-h-72 overflow-y-auto">
                    {availableAreas.length > 0 && (
                        <div className="p-2">
                            <p className="px-3 py-1.5 text-[10px] font-bold text-primary-500 uppercase tracking-wider">
                                Available Properties
                            </p>
                            {availableAreas.map((area) => (
                                <button
                                    key={area}
                                    onClick={() => handleSearch(area)}
                                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-primary-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white transition-colors flex items-center gap-3"
                                >
                                    <svg className="w-4 h-4 text-primary-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    <span className="font-medium text-sm">{area}</span>
                                </button>
                            ))}
                        </div>
                    )}

                    {otherAreas.length > 0 && (
                        <div className="p-2 border-t border-gray-100 dark:border-gray-700">
                            <p className="px-3 py-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                                All Chennai Areas
                            </p>
                            {otherAreas.slice(0, 15).map((area) => (
                                <button
                                    key={area}
                                    onClick={() => handleSearch(area)}
                                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 transition-colors flex items-center gap-3"
                                >
                                    <svg className="w-4 h-4 text-gray-300 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    <span className="text-sm">{area}</span>
                                </button>
                            ))}
                            {otherAreas.length > 15 && (
                                <p className="text-xs text-gray-400 text-center py-2">
                                    Type to search {otherAreas.length - 15} more areas...
                                </p>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
