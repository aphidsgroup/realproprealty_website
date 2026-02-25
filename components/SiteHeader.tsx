'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface User {
    id: string;
    name?: string;
    email: string;
    role: string;
}

export default function SiteHeader() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetch('/api/auth/me')
            .then(res => res.json())
            .then(data => { if (data.user) setUser(data.user); })
            .catch(() => { });
    }, []);

    // Close menu on outside click
    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        setUser(null);
        setMenuOpen(false);
        router.refresh();
    };

    const getDashboardUrl = () => {
        if (!user) return '/login';
        if (user.role === 'admin') return '/admin';
        if (user.role === 'manager') return '/manager';
        return '/dashboard';
    };

    return (
        <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200/50 dark:border-gray-700/50">
            <div className="container mx-auto px-4 max-w-2xl">
                <div className="flex items-center justify-between h-14">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2">
                        <Image src="/logo.png" alt="Realprop Realty" width={36} height={36} className="object-contain" />
                        <span className="font-bold text-gray-900 dark:text-white text-sm hidden sm:inline">Realprop Realty</span>
                    </Link>

                    {/* Toggle Menu */}
                    <div className="relative" ref={menuRef}>
                        <button
                            onClick={() => setMenuOpen(!menuOpen)}
                            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            aria-label="Menu"
                        >
                            {menuOpen ? (
                                <svg className="w-6 h-6 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            ) : (
                                <svg className="w-6 h-6 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            )}
                        </button>

                        {/* Dropdown Menu */}
                        {menuOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 py-2 animate-fade-in">
                                {user ? (
                                    <>
                                        <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-700">
                                            <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{user.name || user.email}</p>
                                            <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                                        </div>
                                        <Link href={getDashboardUrl()} onClick={() => setMenuOpen(false)} className="block px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                            Dashboard
                                        </Link>
                                        {user.role === 'user' && (
                                            <Link href="/dashboard/shortlists" onClick={() => setMenuOpen(false)} className="block px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                                My Shortlists
                                            </Link>
                                        )}
                                        <button onClick={handleLogout} className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                                            Logout
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <Link href="/login" onClick={() => setMenuOpen(false)} className="block px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium">
                                            Login
                                        </Link>
                                        <Link href="/signup" onClick={() => setMenuOpen(false)} className="block px-4 py-2.5 text-sm text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors font-medium">
                                            Sign Up
                                        </Link>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
