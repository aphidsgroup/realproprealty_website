'use client';

import { ReactNode } from 'react';

interface CarouselWrapperProps {
    children: ReactNode;
    scrollId: string;
}

export default function CarouselWrapper({ children, scrollId }: CarouselWrapperProps) {
    const handleScroll = (direction: 'left' | 'right') => {
        const container = document.getElementById(scrollId);
        if (container) {
            const scrollAmount = direction === 'left' ? -300 : 300;
            container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    return (
        <div className="relative group">
            {/* Left Navigation Button */}
            <button
                onClick={() => handleScroll('left')}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-10 h-10 bg-white dark:bg-gray-700 rounded-full shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-50 dark:hover:bg-gray-600"
                aria-label="Scroll left"
            >
                <svg className="w-5 h-5 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
            </button>

            {/* Scrollable Container */}
            <div id={scrollId} className="overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                {children}
            </div>

            {/* Right Navigation Button */}
            <button
                onClick={() => handleScroll('right')}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-10 h-10 bg-white dark:bg-gray-700 rounded-full shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-50 dark:hover:bg-gray-600"
                aria-label="Scroll right"
            >
                <svg className="w-5 h-5 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
            </button>
        </div>
    );
}
