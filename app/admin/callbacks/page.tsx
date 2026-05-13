'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface CallbackRequest {
    id: string;
    name: string;
    phone: string;
    propertyId: string;
    propertyTitle: string;
    status: string;
    createdAt: string;
}

export default function AdminCallbacksPage() {
    const [callbacks, setCallbacks] = useState<CallbackRequest[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/callbacks')
            .then(res => res.json())
            .then(data => {
                setCallbacks(data.callbacks || []);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    const updateStatus = async (id: string, status: string) => {
        // For simplicity, we could add a PATCH endpoint, but for now we'll just handle the UI
        // In a real app, you'd call an API here.
        setCallbacks(prev => prev.map(c => c.id === id ? { ...c, status } : c));
    };

    if (loading) return <div className="p-8 text-center font-bold">Loading requests...</div>;

    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">Callback Requests</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1 font-medium">Manage property inquiry calls from users</p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    <span className="text-sm font-bold text-gray-700 dark:text-gray-300">{callbacks.length} Total</span>
                </div>
            </div>

            {callbacks.length === 0 ? (
                <div className="bg-white dark:bg-gray-800 rounded-3xl p-16 text-center shadow-xl border border-gray-100 dark:border-gray-700">
                    <div className="w-20 h-20 bg-gray-50 dark:bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No Callback Requests</h3>
                    <p className="text-gray-500 dark:text-gray-400 font-medium">When users request a callback for a property, they will appear here.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {callbacks.map((req) => (
                        <div key={req.id} className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-xl border border-gray-100 dark:border-gray-700 flex flex-col hover:shadow-2xl transition-all duration-300 group">
                            <div className="flex items-start justify-between mb-4">
                                <div className="p-3 bg-primary-50 dark:bg-primary-900/20 rounded-2xl group-hover:bg-primary-100 dark:group-hover:bg-primary-900/40 transition-colors">
                                    <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest ${
                                    req.status === 'pending' 
                                    ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' 
                                    : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                }`}>
                                    {req.status}
                                </span>
                            </div>

                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{req.name}</h3>
                            <a href={`tel:${req.phone}`} className="text-primary-600 font-bold hover:underline mb-4 inline-block">+91 {req.phone}</a>

                            <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-700">
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Property Inquiry</p>
                                <Link href={`/p/${req.propertyId}`} target="_blank" className="text-sm font-bold text-gray-700 dark:text-gray-300 hover:text-primary-600 transition-colors line-clamp-1">
                                    {req.propertyTitle}
                                </Link>
                                <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    {new Date(req.createdAt).toLocaleString()}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
