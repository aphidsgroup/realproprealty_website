'use client';

import { useEffect } from 'react';

interface ViewAllModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    items: Array<{
        name: string;
        icon?: JSX.Element;
        category?: string;
        distance?: string;
    }>;
    type: 'facilities' | 'locations';
}

export default function ViewAllModal({ isOpen, onClose, title, items, type }: ViewAllModalProps) {
    // Close modal on Escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }
        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {title} ({items.length})
                    </h2>
                    <button
                        onClick={onClose}
                        className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        aria-label="Close modal"
                    >
                        <svg className="w-6 h-6 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                    {type === 'facilities' ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {items.map((item, index) => (
                                <div key={index} className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                                    <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <svg className="w-6 h-6 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <span className="font-medium text-gray-900 dark:text-white">{item.name}</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {items.map((item, index) => (
                                <div key={index} className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                                    <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0 text-blue-600 dark:text-blue-400">
                                        {item.icon}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{item.name}</h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">{item.category}</p>
                                        <p className="text-sm font-medium text-primary-600 dark:text-primary-400 mt-1">{item.distance}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
