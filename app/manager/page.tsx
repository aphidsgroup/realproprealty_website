'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface ManagerPerms {
    viewUsers: boolean;
    viewShortlists: boolean;
    viewLeads: boolean;
}

export default function ManagerDashboard() {
    const router = useRouter();
    const [user, setUser] = useState<{ name: string; email: string; role: string } | null>(null);
    const [permissions, setPermissions] = useState<ManagerPerms>({ viewUsers: false, viewShortlists: false, viewLeads: false });
    const [stats, setStats] = useState({ users: 0, leads: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const init = async () => {
            const meRes = await fetch('/api/auth/me');
            const meData = await meRes.json();
            if (!meData.user || meData.user.role !== 'manager') {
                router.push('/admin/login');
                return;
            }
            setUser(meData.user);

            // Get manager permissions
            const permRes = await fetch('/api/manager/permissions');
            const permData = await permRes.json();
            setPermissions(permData.permissions || {});

            // Get basic stats
            const statsRes = await fetch('/api/manager/stats');
            const statsData = await statsRes.json();
            setStats(statsData);

            setLoading(false);
        };
        init();
    }, [router]);

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        router.push('/admin/login');
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Header */}
            <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-bold text-gray-900 dark:text-white">Manager Dashboard</h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Welcome, {user?.name || user?.email}</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link href="/manager/change-password" className="px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                            Change Password
                        </Link>
                        <button onClick={handleLogout} className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg font-medium">
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-4 py-8">
                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {permissions.viewUsers && (
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6">
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Registered Users</p>
                            <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.users}</p>
                        </div>
                    )}
                    {permissions.viewLeads && (
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6">
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Lead Responses</p>
                            <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.leads}</p>
                        </div>
                    )}
                </div>

                {/* Quick Links */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {permissions.viewUsers && (
                        <Link href="/manager/users" className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 hover:shadow-lg transition-shadow">
                            <div className="text-3xl mb-3">👥</div>
                            <h3 className="font-bold text-gray-900 dark:text-white mb-1">User Details</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">View registered users and their information</p>
                        </Link>
                    )}
                    {permissions.viewShortlists && (
                        <Link href="/manager/shortlists" className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 hover:shadow-lg transition-shadow">
                            <div className="text-3xl mb-3">❤️</div>
                            <h3 className="font-bold text-gray-900 dark:text-white mb-1">User Shortlists</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">View what properties users are interested in</p>
                        </Link>
                    )}
                    {permissions.viewLeads && (
                        <Link href="/manager/leads" className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 hover:shadow-lg transition-shadow">
                            <div className="text-3xl mb-3">📋</div>
                            <h3 className="font-bold text-gray-900 dark:text-white mb-1">Lead Responses</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">View popup form responses from potential buyers</p>
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
}
