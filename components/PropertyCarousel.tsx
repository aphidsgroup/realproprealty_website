'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Property } from '@prisma/client';
import { formatPrice } from '@/lib/utils';

interface PropertyCarouselProps {
    properties: Property[];
}

export default function PropertyCarousel({ properties }: PropertyCarouselProps) {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);

    const updateScrollButtons = () => {
        if (scrollContainerRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
            setCanScrollLeft(scrollLeft > 0);
            setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
        }
    };

    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const scrollAmount = scrollContainerRef.current.clientWidth * 0.8;
            scrollContainerRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth',
            });
            setTimeout(updateScrollButtons, 300);
        }
    };

    if (properties.length === 0) return null;

    return (
        <div className="relative">
            {/* Left Arrow */}
            {canScrollLeft && (
                <button
                    onClick={() => scroll('left')}
                    className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white dark:bg-gray-800 rounded-full shadow-lg flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    aria-label="Scroll left"
                >
                    <svg className="w-6 h-6 text-gray-900 dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
            )}

            {/* Right Arrow */}
            {canScrollRight && (
                <button
                    onClick={() => scroll('right')}
                    className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white dark:bg-gray-800 rounded-full shadow-lg flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    aria-label="Scroll right"
                >
                    <svg className="w-6 h-6 text-gray-900 dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            )}

            {/* Scrollable Container */}
            <div
                ref={scrollContainerRef}
                onScroll={updateScrollButtons}
                className="flex gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {properties.map((property) => {
                    const images = property.images ? JSON.parse(property.images) : [];
                    const coverImage = images.length > 0 ? images[0] : null;

                    return (
                        <Link
                            key={property.id}
                            href={`/p/${property.slug}`}
                            className="flex-none w-full bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden snap-start"
                        >
                            {/* Cover Image */}
                            {coverImage && (
                                <div className="relative w-full h-48 bg-gray-200 dark:bg-gray-700">
                                    <Image
                                        src={coverImage}
                                        alt={property.title}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            )}

                            <div className="p-5">
                                {/* Header */}
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                                            {property.title}
                                        </h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            {property.areaName}, {property.city}
                                        </p>
                                    </div>
                                    <span className="px-2.5 py-1 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 text-xs font-semibold rounded-full uppercase">
                                        {property.usageType}
                                    </span>
                                </div>

                                {/* Price & Details */}
                                <div className="flex items-center gap-3 mb-4 text-sm text-gray-600 dark:text-gray-400 flex-wrap">
                                    <span className="font-bold text-primary-600 dark:text-primary-400 text-lg">
                                        {formatPrice(property.priceInr)}
                                    </span>
                                    <span>•</span>
                                    <span className="font-medium">{property.sizeSqft} sq ft</span>
                                    {property.bedrooms !== null && property.bedrooms > 0 && (
                                        <>
                                            <span>•</span>
                                            <span>{property.bedrooms} BHK</span>
                                        </>
                                    )}
                                </div>

                                {/* Technical Services */}
                                <div className="mb-3">
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 font-medium">Technical Services on Request</p>
                                    <div className="grid grid-cols-3 gap-1.5">
                                        {/* Property Valuation */}
                                        <div className="flex flex-col items-center gap-1 px-1.5 py-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md">
                                            <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <span className="text-[9px] font-semibold text-green-700 dark:text-green-300 text-center leading-tight">Property Valuation</span>
                                        </div>

                                        {/* Legal Verification */}
                                        <div className="flex flex-col items-center gap-1 px-1.5 py-2 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-md">
                                            <svg className="w-4 h-4 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                            <span className="text-[9px] font-semibold text-purple-700 dark:text-purple-300 text-center leading-tight">Legal Verification</span>
                                        </div>

                                        {/* Structural Auditing */}
                                        <div className="flex flex-col items-center gap-1 px-1.5 py-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md">
                                            <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                            </svg>
                                            <span className="text-[9px] font-semibold text-blue-700 dark:text-blue-300 text-center leading-tight">Structural Auditing</span>
                                        </div>
                                    </div>
                                </div>

                                {/* View Tour Button */}
                                <div className="mt-4">
                                    <div className="w-full bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold py-3 px-4 rounded-xl text-center flex items-center justify-center gap-2">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                        View 360° Tour
                                    </div>
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
