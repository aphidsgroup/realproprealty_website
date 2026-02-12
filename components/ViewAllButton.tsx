'use client';

import { useState } from 'react';
import ViewAllModal from './ViewAllModal';

interface ViewAllButtonProps {
    count: number;
    title: string;
    items: Array<{
        name: string;
        icon?: JSX.Element;
        category?: string;
        distance?: string;
    }>;
    type: 'facilities' | 'locations';
}

export default function ViewAllButton({ count, title, items, type }: ViewAllButtonProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <button
                onClick={() => setIsModalOpen(true)}
                className="text-primary-600 dark:text-primary-400 font-semibold hover:underline"
            >
                View All ({count})
            </button>
            <ViewAllModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={title}
                items={items}
                type={type}
            />
        </>
    );
}
