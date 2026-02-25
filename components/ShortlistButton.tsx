'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface ShortlistButtonProps {
    propertyId: string;
    size?: 'sm' | 'md';
    className?: string;
}

export default function ShortlistButton({ propertyId, size = 'md', className = '' }: ShortlistButtonProps) {
    const router = useRouter();
    const [isShortlisted, setIsShortlisted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState<{ id: string; role: string } | null>(null);

    useEffect(() => {
        // Check if user is logged in
        fetch('/api/auth/me')
            .then(res => res.json())
            .then(data => {
                if (data.user && data.user.role === 'user') {
                    setUser(data.user);
                    // Check if this property is shortlisted
                    return fetch(`/api/shortlist/check?propertyIds=${propertyId}`);
                }
                return null;
            })
            .then(res => res?.json())
            .then(data => {
                if (data?.shortlisted) {
                    setIsShortlisted(data.shortlisted.includes(propertyId));
                }
            })
            .catch(() => { });
    }, [propertyId]);

    const handleToggle = async () => {
        if (!user) {
            // Redirect guest to login
            router.push('/login');
            return;
        }

        setLoading(true);
        try {
            const res = await fetch('/api/shortlist', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ propertyId }),
            });

            if (res.ok) {
                const data = await res.json();
                setIsShortlisted(data.action === 'added');
            }
        } catch {
            // Silently fail
        } finally {
            setLoading(false);
        }
    };

    const sizeClasses = size === 'sm'
        ? 'w-8 h-8 text-sm'
        : 'w-10 h-10 text-lg';

    return (
        <button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleToggle(); }}
            disabled={loading}
            className={`${sizeClasses} rounded-full flex items-center justify-center transition-all duration-300 ${isShortlisted
                    ? 'bg-red-500 text-white shadow-lg scale-110'
                    : 'bg-white/90 dark:bg-gray-800/90 text-gray-400 hover:text-red-500 shadow-md hover:shadow-lg'
                } ${loading ? 'opacity-50 cursor-wait' : 'cursor-pointer'} ${className}`}
            title={isShortlisted ? 'Remove from shortlist' : 'Add to shortlist'}
        >
            {isShortlisted ? '❤️' : '🤍'}
        </button>
    );
}
