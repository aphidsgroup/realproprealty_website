'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

const SORT_OPTIONS = [
    { value: 'newest', label: 'Newest First' },
    { value: 'price_low', label: 'Price: Low to High' },
    { value: 'price_high', label: 'Price: High to Low' },
    { value: 'size_large', label: 'Size: Large to Small' },
    { value: 'size_small', label: 'Size: Small to Large' },
];

export default function SortButton() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [open, setOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    const currentSort = searchParams.get('sort') || 'newest';
    const currentLabel = SORT_OPTIONS.find(o => o.value === currentSort)?.label || 'Sort';

    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    const handleSort = (value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('sort', value);
        router.push(`/list?${params.toString()}`);
        setOpen(false);
    };

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={() => setOpen(!open)}
                className="flex items-center gap-2 px-4 py-2.5 bg-gray-900 hover:bg-black text-orange-500 font-semibold rounded-xl shadow-md transition-all duration-200 border border-gray-800 text-sm"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                </svg>
                <span className="hidden sm:inline">{currentLabel}</span>
                <span className="sm:hidden">Sort</span>
            </button>

            {open && (
                <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 py-1 z-50 animate-fade-in">
                    {SORT_OPTIONS.map(opt => (
                        <button
                            key={opt.value}
                            onClick={() => handleSort(opt.value)}
                            className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${currentSort === opt.value
                                    ? 'bg-gray-900 text-orange-500 font-semibold'
                                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                }`}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
