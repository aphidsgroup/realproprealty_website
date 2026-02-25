'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Lead {
    id: string;
    name: string;
    phone: string;
    email: string | null;
    propertyType: string | null;
    bhk: string | null;
    budget: string | null;
    location: string | null;
    timeline: string | null;
    createdAt: string;
}

export default function ManagerLeadsPage() {
    const [leads, setLeads] = useState<Lead[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/admin/leads')
            .then(res => res.json())
            .then(data => { setLeads(data.leads || []); setLoading(false); })
            .catch(() => setLoading(false));
    }, []);

    if (loading) return <div className="p-8 text-center">Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
                <div className="max-w-6xl mx-auto flex items-center gap-4">
                    <Link href="/manager" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">← Back</Link>
                    <h1 className="text-xl font-bold text-gray-900 dark:text-white">Lead Responses</h1>
                    <span className="text-sm text-gray-500">({leads.length})</span>
                </div>
            </header>
            <div className="max-w-6xl mx-auto px-4 py-8">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden">
                    {leads.length === 0 ? (
                        <div className="p-12 text-center text-gray-500">No leads captured yet.</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 dark:bg-gray-700">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Name</th>
                                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Phone</th>
                                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Email</th>
                                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Type</th>
                                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">BHK</th>
                                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Budget</th>
                                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Location</th>
                                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Date</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                    {leads.map((l) => (
                                        <tr key={l.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                            <td className="px-4 py-3 font-semibold text-gray-900 dark:text-white">{l.name}</td>
                                            <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{l.phone}</td>
                                            <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{l.email || '—'}</td>
                                            <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{l.propertyType || '—'}</td>
                                            <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{l.bhk || '—'}</td>
                                            <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{l.budget || '—'}</td>
                                            <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{l.location || '—'}</td>
                                            <td className="px-4 py-3 text-gray-500 text-sm">{new Date(l.createdAt).toLocaleDateString()}</td>
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
