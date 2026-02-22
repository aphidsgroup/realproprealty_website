'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface SearchBarProps {
    areas: string[];
}

export default function SearchBar({ areas }: SearchBarProps) {
    const router = useRouter();
    const [query, setQuery] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    // Filter areas based on query
    const filteredAreas = query.trim()
        ? areas.filter(a => a.toLowerCase().includes(query.toLowerCase()))
        : areas;

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
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <div ref={wrapperRef} className="relative">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-1">
                <div className="flex items-center gap-2">
                    <div className="flex-1 flex items-center gap-3 px-3">
                        <svg className="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
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
                            className="flex-1 py-3 bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none text-base"
                        />
                    </div>
                    <button
                        onClick={() => handleSearch()}
                        className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-semibold py-3 px-5 rounded-lg transition-all duration-300"
                    >
                        Search
                    </button>
                </div>
            </div>

            {/* Area Suggestions Dropdown */}
            {isOpen && filteredAreas.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 z-50 max-h-64 overflow-y-auto">
                    <div className="p-2">
                        <p className="px-3 py-1.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Areas
                        </p>
                        {filteredAreas.map((area) => (
                            <button
                                key={area}
                                onClick={() => handleSearch(area)}
                                className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-primary-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white transition-colors flex items-center gap-3"
                            >
                                <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <span className="font-medium">{area}</span>
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
