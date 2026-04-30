'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ReactNode } from 'react';

export default function AdminLayout({ children }: { children: ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        router.push('/admin/login');
        router.refresh();
    };

    // Don't show nav on login page
    if (pathname === '/admin/login') {
        return <>{children}</>;
    }

    const navItems = [
        { href: '/admin', label: 'Dashboard' },
        { href: '/admin/properties', label: 'Properties' },
        { href: '/admin/leads/seller', label: 'Seller Leads' },
        { href: '/admin/leads/buyer', label: 'Buyer Leads' },
        { href: '/admin/users', label: 'Users' },
        { href: '/admin/managers', label: 'Managers' },
        { href: '/admin/change-requests', label: 'Approvals' },
        { href: '/admin/verification-forms', label: 'Verification Forms' },
        { href: '/admin/settings', label: 'Settings' },
    ];

    return (
        <div className="min-h-screen bg-[#f8fafc] dark:bg-gray-900">
            {/* Top Nav */}
            <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40 shadow-sm">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-8">
                            <Link href="/admin" className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-100 to-yellow-300 border border-yellow-400 flex items-center justify-center shadow-sm">
                                    <span className="font-bold text-yellow-800 text-xs">RPR</span>
                                </div>
                                <span className="font-bold text-gray-900 dark:text-white">RPR Admin</span>
                            </Link>

                            <div className="hidden lg:flex items-center gap-1">
                                {navItems.map((item) => (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                                            pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href))
                                            ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-300'
                                            : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
                                        }`}
                                    >
                                        {item.label}
                                    </Link>
                                ))}
                            </div>
                        </div>

                        <div className="flex items-center gap-6">
                            <Link
                                href="/"
                                target="_blank"
                                className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                            >
                                View Site →
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Mobile Nav */}
            <div className="md:hidden bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                <div className="container mx-auto px-4 py-2 flex gap-2 overflow-x-auto">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-colors ${
                                pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href))
                                ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-300'
                                : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                            }`}
                        >
                            {item.label}
                        </Link>
                    ))}
                </div>
            </div>

            {/* Content */}
            <main>{children}</main>
        </div>
    );
}
