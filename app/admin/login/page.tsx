'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

type LoginMode = 'admin' | 'manager';

export default function AdminLoginPage() {
    const router = useRouter();
    const [mode, setMode] = useState<LoginMode>('admin');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const endpoint = mode === 'admin' ? '/api/auth/login' : '/api/auth/manager-login';
            const res = await fetch(endpoint, {
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

            router.push(mode === 'admin' ? '/admin' : '/manager');
            router.refresh();
        } catch {
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
                        {mode === 'admin' ? 'Admin Login' : 'Manager Login'}
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Realprop Realty CMS
                    </p>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
                    {/* Mode Toggle */}
                    <div className="flex rounded-xl bg-gray-100 dark:bg-gray-700 p-1 mb-6">
                        <button
                            type="button"
                            onClick={() => { setMode('admin'); setError(''); }}
                            className={`flex-1 py-2 px-4 rounded-lg text-sm font-semibold transition-all duration-200 ${mode === 'admin'
                                ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'
                                }`}
                        >
                            Admin
                        </button>
                        <button
                            type="button"
                            onClick={() => { setMode('manager'); setError(''); }}
                            className={`flex-1 py-2 px-4 rounded-lg text-sm font-semibold transition-all duration-200 ${mode === 'manager'
                                ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'
                                }`}
                        >
                            Manager
                        </button>
                    </div>

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
                                placeholder={mode === 'admin' ? 'admin@realproprealty.com' : 'manager@realproprealty.com'}
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
                            className="w-full bg-gray-900 hover:bg-black disabled:bg-gray-500 text-orange-500 font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:cursor-not-allowed border border-gray-800"
                        >
                            {loading ? 'Logging in...' : `Login as ${mode === 'admin' ? 'Admin' : 'Manager'}`}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
