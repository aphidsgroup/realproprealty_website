'use client';

import { useState, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CHENNAI_AREAS } from '@/lib/chennai-areas';

interface FilterSheetProps {
    areas: string[];       // DB areas (have properties)
    amenitiesVocab: string[];
}

// Budget presets for SALE properties (Chennai market rates)
const BUDGET_OPTIONS = [
    { label: 'Under ₹30 Lakhs', min: 0, max: 3000000 },
    { label: '₹30L - ₹50L', min: 3000000, max: 5000000 },
    { label: '₹50L - ₹75L', min: 5000000, max: 7500000 },
    { label: '₹75L - ₹1 Cr', min: 7500000, max: 10000000 },
    { label: '₹1 Cr - ₹1.5 Cr', min: 10000000, max: 15000000 },
    { label: '₹1.5 Cr - ₹2.5 Cr', min: 15000000, max: 25000000 },
    { label: '₹2.5 Cr - ₹5 Cr', min: 25000000, max: 50000000 },
    { label: '₹5 Cr+', min: 50000000, max: 0 },
];

const SIZE_OPTIONS = [
    { label: 'Under 500 sq ft', min: 0, max: 500 },
    { label: '500-1000 sq ft', min: 500, max: 1000 },
    { label: '1000-1500 sq ft', min: 1000, max: 1500 },
    { label: '1500-2500 sq ft', min: 1500, max: 2500 },
    { label: '2500+ sq ft', min: 2500, max: 0 },
];

const BHK_OPTIONS = ['1 BHK', '2 BHK', '3 BHK', '4 BHK', '4+ BHK'];

export default function FilterSheet({ areas, amenitiesVocab }: FilterSheetProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isOpen, setIsOpen] = useState(false);
    const [areaSearch, setAreaSearch] = useState('');

    // Get current filter values from URL
    const [selectedAreas, setSelectedAreas] = useState<string[]>(
        searchParams.get('area')?.split(',').filter(Boolean) || []
    );
    const [budgetRange, setBudgetRange] = useState(
        searchParams.get('minPrice') && searchParams.get('maxPrice')
            ? `${searchParams.get('minPrice')}-${searchParams.get('maxPrice')}`
            : ''
    );
    const [sizeRange, setSizeRange] = useState(
        searchParams.get('minSize') && searchParams.get('maxSize')
            ? `${searchParams.get('minSize')}-${searchParams.get('maxSize')}`
            : ''
    );
    const [selectedBHK, setSelectedBHK] = useState(
        searchParams.get('bhk') || ''
    );

    // Merge DB areas with all Chennai areas for selection
    const allAreas = useMemo(() => {
        return [...new Set([...areas, ...CHENNAI_AREAS])].sort();
    }, [areas]);

    const filteredAreaList = useMemo(() => {
        if (!areaSearch.trim()) return allAreas;
        return allAreas.filter(a => a.toLowerCase().includes(areaSearch.toLowerCase()));
    }, [allAreas, areaSearch]);

    const toggleArea = (area: string) => {
        setSelectedAreas(prev => {
            if (prev.includes(area)) {
                return prev.filter(a => a !== area);
            }
            if (prev.length >= 5) return prev; // Max 5
            return [...prev, area];
        });
    };

    const handleApply = () => {
        const params = new URLSearchParams();

        // Preserve usage type
        const use = searchParams.get('use');
        if (use) params.set('use', use);

        // Areas (comma separated)
        if (selectedAreas.length > 0) params.set('area', selectedAreas.join(','));

        // Budget
        if (budgetRange) {
            const [min, max] = budgetRange.split('-');
            if (min && min !== '0') params.set('minPrice', min);
            if (max && max !== '0') params.set('maxPrice', max);
        }

        // Size
        if (sizeRange) {
            const [min, max] = sizeRange.split('-');
            if (min && min !== '0') params.set('minSize', min);
            if (max && max !== '0') params.set('maxSize', max);
        }

        // BHK
        if (selectedBHK) params.set('bhk', selectedBHK);

        router.push(`/list?${params.toString()}`);
        setIsOpen(false);
    };

    const handleClear = () => {
        const newParams = new URLSearchParams();
        const use = searchParams.get('use');
        if (use) newParams.set('use', use);

        setSelectedAreas([]);
        setBudgetRange('');
        setSizeRange('');
        setSelectedBHK('');
        setAreaSearch('');

        router.push(`/list?${newParams.toString()}`);
        setIsOpen(false);
    };

    const activeFiltersCount = [
        selectedAreas.length > 0 ? '1' : '',
        budgetRange,
        sizeRange,
        selectedBHK,
    ].filter(Boolean).length;

    return (
        <>
            {/* Filter Button */}
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-semibold py-3 px-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                <span>Filters</span>
                {activeFiltersCount > 0 && (
                    <span className="bg-white text-primary-600 text-xs font-bold px-2 py-0.5 rounded-full">
                        {activeFiltersCount}
                    </span>
                )}
            </button>

            {/* Bottom Sheet */}
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-black/50 z-50 animate-fade-in"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Sheet */}
                    <div className="fixed inset-x-0 bottom-0 z-50 bg-white dark:bg-gray-800 rounded-t-3xl shadow-2xl max-h-[85vh] overflow-y-auto animate-slide-up">
                        {/* Header */}
                        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between z-10">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Filters</h2>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                            >
                                <svg className="w-6 h-6 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* === AREAS (Multi-select, up to 5) === */}
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label className="text-sm font-semibold text-gray-900 dark:text-white">
                                        Areas
                                    </label>
                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                        {selectedAreas.length}/5 selected
                                    </span>
                                </div>

                                {/* Selected area chips */}
                                {selectedAreas.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mb-3">
                                        {selectedAreas.map(area => (
                                            <span
                                                key={area}
                                                className="inline-flex items-center gap-1.5 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 px-3 py-1.5 rounded-full text-xs font-semibold"
                                            >
                                                {area}
                                                <button
                                                    onClick={() => toggleArea(area)}
                                                    className="hover:bg-primary-200 dark:hover:bg-primary-800 rounded-full p-0.5"
                                                >
                                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                )}

                                {/* Area search input */}
                                <div className="relative mb-2">
                                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                    <input
                                        type="text"
                                        value={areaSearch}
                                        onChange={(e) => setAreaSearch(e.target.value)}
                                        placeholder="Search areas..."
                                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                    />
                                </div>

                                {/* Area list (scrollable) */}
                                <div className="max-h-40 overflow-y-auto rounded-xl border border-gray-200 dark:border-gray-700">
                                    {filteredAreaList.map(area => (
                                        <button
                                            key={area}
                                            onClick={() => toggleArea(area)}
                                            disabled={!selectedAreas.includes(area) && selectedAreas.length >= 5}
                                            className={`w-full text-left px-4 py-2.5 text-sm border-b border-gray-100 dark:border-gray-700 last:border-0 flex items-center justify-between transition-colors ${selectedAreas.includes(area)
                                                ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                                                : selectedAreas.length >= 5
                                                    ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed'
                                                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                                                }`}
                                        >
                                            <span className="flex items-center gap-2">
                                                <svg className={`w-3.5 h-3.5 flex-shrink-0 ${areas.includes(area) ? 'text-primary-500' : 'text-gray-300'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                                {area}
                                                {areas.includes(area) && (
                                                    <span className="text-[10px] bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 px-1.5 py-0.5 rounded-full font-semibold">
                                                        Available
                                                    </span>
                                                )}
                                            </span>
                                            {selectedAreas.includes(area) && (
                                                <svg className="w-4 h-4 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                </svg>
                                            )}
                                        </button>
                                    ))}
                                    {filteredAreaList.length === 0 && (
                                        <p className="text-center text-sm text-gray-400 py-4">No areas found</p>
                                    )}
                                </div>
                            </div>

                            {/* === BUDGET (Dropdown) === */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                                    Budget
                                </label>
                                <select
                                    value={budgetRange}
                                    onChange={(e) => setBudgetRange(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none cursor-pointer"
                                >
                                    <option value="">All Budgets</option>
                                    {BUDGET_OPTIONS.map(opt => (
                                        <option key={opt.label} value={`${opt.min}-${opt.max}`}>{opt.label}</option>
                                    ))}
                                </select>
                            </div>

                            {/* === SIZE (Dropdown) === */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                                    Property Size
                                </label>
                                <select
                                    value={sizeRange}
                                    onChange={(e) => setSizeRange(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none cursor-pointer"
                                >
                                    <option value="">All Sizes</option>
                                    {SIZE_OPTIONS.map(opt => (
                                        <option key={opt.label} value={`${opt.min}-${opt.max}`}>{opt.label}</option>
                                    ))}
                                </select>
                            </div>

                            {/* === BHK (Chips) === */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                                    BHK Type
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {BHK_OPTIONS.map(bhk => (
                                        <button
                                            key={bhk}
                                            onClick={() => setSelectedBHK(selectedBHK === bhk ? '' : bhk)}
                                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${selectedBHK === bhk
                                                ? 'bg-primary-500 text-white shadow-sm'
                                                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                                }`}
                                        >
                                            {bhk}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="sticky bottom-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-6 py-4 flex gap-3">
                            <button
                                onClick={handleClear}
                                className="flex-1 px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                            >
                                Clear All
                            </button>
                            <button
                                onClick={handleApply}
                                className="flex-1 px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-semibold rounded-xl shadow-md transition-all duration-300"
                            >
                                Show Results
                            </button>
                        </div>
                    </div>
                </>
            )}
        </>
    );
}
