'use client';

import { useState, useEffect } from 'react';

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
    source: string;
    createdAt: string;
}

export default function LeadsPage() {
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
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Lead Responses</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">{leads.length} lead{leads.length !== 1 ? 's' : ''} captured</p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden">
                {leads.length === 0 ? (
                    <div className="p-12 text-center text-gray-500 dark:text-gray-400">No leads captured yet.</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 dark:bg-gray-700">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Name</th>
                                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Phone</th>
                                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Email</th>
                                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Property Type</th>
                                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">BHK</th>
                                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Budget</th>
                                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Location</th>
                                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Timeline</th>
                                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {leads.map((lead) => (
                                    <tr key={lead.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                        <td className="px-4 py-3 font-semibold text-gray-900 dark:text-white">{lead.name}</td>
                                        <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{lead.phone}</td>
                                        <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{lead.email || '—'}</td>
                                        <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{lead.propertyType || '—'}</td>
                                        <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{lead.bhk || '—'}</td>
                                        <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{lead.budget || '—'}</td>
                                        <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{lead.location || '—'}</td>
                                        <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{lead.timeline || '—'}</td>
                                        <td className="px-4 py-3 text-gray-600 dark:text-gray-400 text-sm">{new Date(lead.createdAt).toLocaleDateString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
