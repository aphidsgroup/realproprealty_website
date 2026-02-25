'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface ShortlistItem {
    user: { name: string | null; email: string | null; phone: string | null };
    property: { title: string; slug: string; areaName: string };
    createdAt: string;
}

export default function ManagerShortlistsPage() {
    const [shortlists, setShortlists] = useState<ShortlistItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/manager/shortlists')
            .then(res => res.json())
            .then(data => { setShortlists(data.shortlists || []); setLoading(false); })
            .catch(() => setLoading(false));
    }, []);

    if (loading) return <div className="p-8 text-center">Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
                <div className="max-w-6xl mx-auto flex items-center gap-4">
                    <Link href="/manager" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">← Back</Link>
                    <h1 className="text-xl font-bold text-gray-900 dark:text-white">User Shortlists</h1>
                    <span className="text-sm text-gray-500">({shortlists.length})</span>
                </div>
            </header>
            <div className="max-w-6xl mx-auto px-4 py-8">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden">
                    {shortlists.length === 0 ? (
                        <div className="p-12 text-center text-gray-500">No shortlists yet.</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 dark:bg-gray-700">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">User</th>
                                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Contact</th>
                                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Property</th>
                                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Area</th>
                                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Date</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                    {shortlists.map((s, i) => (
                                        <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                            <td className="px-4 py-3 font-semibold text-gray-900 dark:text-white">{s.user.name || '—'}</td>
                                            <td className="px-4 py-3 text-gray-600 dark:text-gray-400 text-sm">{s.user.email || s.user.phone || '—'}</td>
                                            <td className="px-4 py-3">
                                                <Link href={`/p/${s.property.slug}`} className="text-primary-600 hover:underline font-medium">{s.property.title}</Link>
                                            </td>
                                            <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{s.property.areaName}</td>
                                            <td className="px-4 py-3 text-gray-500 text-sm">{new Date(s.createdAt).toLocaleDateString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
