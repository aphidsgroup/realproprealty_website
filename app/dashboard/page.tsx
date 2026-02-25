'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function UserDashboard() {
    const router = useRouter();
    const [user, setUser] = useState<{ name: string; email: string } | null>(null);
    const [shortlistCount, setShortlistCount] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const init = async () => {
            const meRes = await fetch('/api/auth/me');
            const meData = await meRes.json();
            if (!meData.user || meData.user.role !== 'user') {
                router.push('/login');
                return;
            }
            setUser(meData.user);

            const slRes = await fetch('/api/shortlist');
            if (slRes.ok) {
                const slData = await slRes.json();
                setShortlistCount(slData.shortlists?.length || 0);
            }
            setLoading(false);
        };
        init();
    }, [router]);

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        router.push('/');
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
                <div className="max-w-4xl mx-auto flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-bold text-gray-900 dark:text-white">My Dashboard</h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Welcome, {user?.name || user?.email}</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link href="/" className="px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">Home</Link>
                        <button onClick={handleLogout} className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg font-medium">Logout</button>
                    </div>
                </div>
            </header>

            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Link href="/dashboard/shortlists" className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 hover:shadow-lg transition-shadow">
                        <div className="text-4xl mb-3">❤️</div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">My Shortlists</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{shortlistCount} properties saved</p>
                    </Link>

                    <Link href="/dashboard/change-password" className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 hover:shadow-lg transition-shadow">
                        <div className="text-4xl mb-3">🔒</div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Change Password</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Update your account password</p>
                    </Link>
                </div>
            </div>
        </div>
    );
}
