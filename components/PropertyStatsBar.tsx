'use client';

import { useState, useEffect } from 'react';

interface PropertyStatsBarProps {
    slug: string;
}

export default function PropertyStatsBar({ slug }: PropertyStatsBarProps) {
    const [stats, setStats] = useState<{ viewCount: number, shortlistCount: number } | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // First increment the view count
                await fetch(`/api/properties/${slug}/stats`, { method: 'POST' });
                
                // Then get updated stats
                const res = await fetch(`/api/properties/${slug}/stats`);
                const data = await res.json();
                if (res.ok) {
                    setStats(data);
                }
            } catch (error) {
                console.error('Error fetching property stats:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, [slug]);

    if (loading) {
        return (
            <div className="h-6 w-48 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-full mb-4"></div>
        );
    }

    if (!stats) return null;

    return (
        <div className="flex items-center gap-4 py-2 px-4 bg-gray-50 dark:bg-gray-800/50 rounded-full border border-gray-100 dark:border-gray-700/50 w-fit mb-6 animate-in fade-in duration-500">
            <div className="flex items-center gap-1.5">
                <span className="text-base">👁️</span>
                <span className="text-xs font-bold text-gray-700 dark:text-gray-300">
                    <span className="text-primary-600 dark:text-primary-400">{stats.viewCount.toLocaleString()}</span> people viewed this
                </span>
            </div>
            <div className="w-px h-3 bg-gray-200 dark:bg-gray-700"></div>
            <div className="flex items-center gap-1.5">
                <span className="text-base">⭐</span>
                <span className="text-xs font-bold text-gray-700 dark:text-gray-300">
                    <span className="text-primary-600 dark:text-primary-400">{stats.shortlistCount.toLocaleString()}</span> shortlisted this
                </span>
            </div>
        </div>
    );
}
