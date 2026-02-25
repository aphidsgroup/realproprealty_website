'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface User {
    id: string;
    name: string | null;
    email: string | null;
    phone: string | null;
    createdAt: string;
}

export default function ManagerUsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/manager/users')
            .then(res => res.json())
            .then(data => { setUsers(data.users || []); setLoading(false); })
            .catch(() => setLoading(false));
    }, []);

    if (loading) return <div className="p-8 text-center">Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
                <div className="max-w-5xl mx-auto flex items-center gap-4">
                    <Link href="/manager" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">← Back</Link>
                    <h1 className="text-xl font-bold text-gray-900 dark:text-white">User Details</h1>
                    <span className="text-sm text-gray-500">({users.length})</span>
                </div>
            </header>
            <div className="max-w-5xl mx-auto px-4 py-8">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden">
                    {users.length === 0 ? (
                        <div className="p-12 text-center text-gray-500">No registered users yet.</div>
                    ) : (
                        <table className="w-full">
                            <thead className="bg-gray-50 dark:bg-gray-700">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Email</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Phone</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Registered</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {users.map(u => (
                                    <tr key={u.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                        <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">{u.name || '—'}</td>
                                        <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{u.email || '—'}</td>
                                        <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{u.phone || '—'}</td>
                                        <td className="px-6 py-4 text-gray-500 text-sm">{new Date(u.createdAt).toLocaleDateString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
}
