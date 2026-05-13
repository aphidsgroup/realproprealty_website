'use client';

import { useState, useEffect } from 'react';

interface CallbackFormProps {
    propertyId: string;
    propertyTitle: string;
}

export default function CallbackForm({ propertyId, propertyTitle }: CallbackFormProps) {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        // Pre-fill if user is logged in
        fetch('/api/auth/me')
            .then(res => res.json())
            .then(data => {
                if (data.user) {
                    if (data.user.name) setName(data.user.name);
                    if (data.user.phone) setPhone(data.user.phone);
                }
            })
            .catch(() => { });
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/callbacks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name,
                    phone,
                    propertyId,
                    propertyTitle,
                }),
            });

            if (res.ok) {
                setSuccess(true);
                setName('');
                setPhone('');
            } else {
                const data = await res.json();
                setError(data.error || 'Failed to submit request');
            }
        } catch (err) {
            setError('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl border border-green-100 dark:border-green-900/30 text-center animate-in fade-in zoom-in duration-500 max-w-md mx-auto mb-8">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Request Received!</h3>
                <p className="text-gray-600 dark:text-gray-400">We'll contact you shortly about this property.</p>
                <button 
                    onClick={() => setSuccess(false)}
                    className="mt-6 text-sm font-semibold text-primary-600 hover:underline"
                >
                    Send another request
                </button>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-xl border border-gray-100 dark:border-gray-700 max-w-md mx-auto mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-yellow-50 dark:bg-yellow-900/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-yellow-600 dark:text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                </div>
                <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Get a Callback</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">We'll contact you about this property</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your Name"
                        className="w-full px-5 py-3.5 rounded-2xl border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary-500 outline-none transition-all dark:bg-gray-900 dark:text-white font-medium"
                    />
                </div>

                <div className="flex border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden focus-within:ring-2 focus-within:ring-primary-500 transition-all dark:bg-gray-900">
                    <div className="bg-gray-50 dark:bg-gray-800 px-4 py-3.5 border-r border-gray-200 dark:border-gray-700 text-gray-500 font-medium flex items-center justify-center text-sm">
                        +91
                    </div>
                    <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                        placeholder="Phone Number"
                        className="w-full px-5 py-3.5 outline-none dark:bg-transparent dark:text-white font-medium"
                    />
                </div>

                {error && <p className="text-sm text-red-600 font-medium">{error}</p>}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 bg-[#111827] hover:bg-black text-white font-bold rounded-2xl shadow-lg transition-all active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2 mt-2"
                >
                    {loading ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                        <>
                            <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                            </svg>
                            <span className="text-[#facc15]">Request Callback</span>
                        </>
                    )}
                </button>
            </form>
        </div>
    );
}
