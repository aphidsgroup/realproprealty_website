'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface PropertyShortlistButtonProps {
    propertyId: string;
}

export default function PropertyShortlistButton({ propertyId }: PropertyShortlistButtonProps) {
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

    const handleToggle = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!user) {
            router.push(`/login?next=${window.location.pathname}`);
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

    return (
        <button
            onClick={handleToggle}
            disabled={loading}
            className={`fixed bottom-[80px] right-4 z-30 flex items-center gap-2 px-6 py-3 bg-white dark:bg-gray-800 rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.15)] hover:shadow-[0_6px_16px_rgba(0,0,0,0.2)] transition-all duration-300 ${loading ? 'opacity-70 cursor-wait' : 'cursor-pointer'} animate-in slide-in-from-bottom-4`}
        >
            <div className={`transition-transform duration-300 ${isShortlisted ? 'scale-125' : 'scale-100'}`}>
                {isShortlisted ? (
                    <svg className="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                    </svg>
                ) : (
                    <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                )}
            </div>
            <span className="text-base font-bold text-gray-700 dark:text-gray-200">
                {isShortlisted ? 'Shortlisted' : 'Shortlist'}
            </span>
        </button>
    );
}
