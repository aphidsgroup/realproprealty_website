'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || 'Login failed');
                setLoading(false);
                return;
            }

            router.push('/admin');
            router.refresh();
        } catch (err) {
            setError('An error occurred. Please try again.');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 flex items-center justify-center px-4">
            <div className="max-w-md w-full">
                <div className="text-center mb-8">
                    <div className="w-24 h-24 mx-auto flex items-center justify-center mb-4">
                        <Image
                            src="/logo.png"
                            alt="Realprop Realty Logo"
                            width={96}
                            height={96}
                            className="object-contain"
                            priority
                        />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        Admin Login
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Realprop Realty CMS
                    </p>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-xl">
                                {error}
                            </div>
                        )}

                        <div>
                            <label htmlFor="email" className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                placeholder="admin@realproprealty.com"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                placeholder="••••••••"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Logging in...' : 'Login'}
                        </button>
                    </form>

                    <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
                        <p>Default credentials:</p>
                        <p className="font-mono text-xs mt-1">admin@realproprealty.com</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
