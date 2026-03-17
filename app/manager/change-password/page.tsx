'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ManagerChangePasswordPage() {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        if (newPassword.length < 6) { setError('New password must be at least 6 characters'); return; }
        if (newPassword !== confirmPassword) { setError('Passwords do not match'); return; }

        setLoading(true);
        try {
            const res = await fetch('/api/auth/change-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ currentPassword, newPassword }),
            });
            const data = await res.json();
            if (!res.ok) { setError(data.error || 'Failed'); } else {
                setSuccess('Password changed successfully!');
                setCurrentPassword(''); setNewPassword(''); setConfirmPassword('');
            }
        } catch { setError('Something went wrong'); }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
                <div className="max-w-lg mx-auto flex items-center gap-4">
                    <Link href="/manager" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">← Back</Link>
                    <h1 className="text-xl font-bold text-gray-900 dark:text-white">Change Password</h1>
                </div>
            </header>
            <div className="max-w-lg mx-auto px-4 py-8">
                <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-8 space-y-5">
                    {error && <div className="bg-red-50 dark:bg-red-900/30 text-red-600 px-4 py-3 rounded-xl text-sm">{error}</div>}
                    {success && <div className="bg-green-50 dark:bg-green-900/30 text-green-600 px-4 py-3 rounded-xl text-sm">{success}</div>}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Current Password</label>
                        <input type="password" required value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">New Password</label>
                        <input type="password" required value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Confirm New Password</label>
                        <input type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                    </div>
                    <button type="submit" disabled={loading} className="w-full bg-gray-900 hover:bg-black text-orange-500 font-semibold py-3 rounded-xl disabled:opacity-50 transition-colors border border-gray-800">{loading ? 'Changing...' : 'Change Password'}</button>
                </form>
            </div>
        </div>
    );
}
