'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Manager {
    id: string;
    name: string;
    email: string;
    permissions: string;
    isActive: boolean;
    createdAt: string;
}

export default function ManagersPage() {
    const router = useRouter();
    const [managers, setManagers] = useState<Manager[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingManager, setEditingManager] = useState<Manager | null>(null);
    const [formData, setFormData] = useState({ name: '', email: '', password: '', viewUsers: true, viewShortlists: true, viewLeads: true });
    const [error, setError] = useState('');
    const [saving, setSaving] = useState(false);

    useEffect(() => { fetchManagers(); }, []);

    const fetchManagers = async () => {
        try {
            const res = await fetch('/api/admin/managers');
            if (res.ok) {
                const data = await res.json();
                setManagers(data);
            }
        } catch { /* */ }
        setLoading(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSaving(true);

        try {
            const permissions = { viewUsers: formData.viewUsers, viewShortlists: formData.viewShortlists, viewLeads: formData.viewLeads };
            const method = editingManager ? 'PUT' : 'POST';
            const body = editingManager
                ? { id: editingManager.id, name: formData.name, email: formData.email, ...(formData.password ? { password: formData.password } : {}), permissions }
                : { name: formData.name, email: formData.email, password: formData.password, permissions };

            const res = await fetch('/api/admin/managers', {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || 'Failed to save manager');
                setSaving(false);
                return;
            }

            setShowForm(false);
            setEditingManager(null);
            setFormData({ name: '', email: '', password: '', viewUsers: true, viewShortlists: true, viewLeads: true });
            fetchManagers();
        } catch {
            setError('Something went wrong');
        }
        setSaving(false);
    };

    const handleEdit = (manager: Manager) => {
        const perms = JSON.parse(manager.permissions);
        setEditingManager(manager);
        setFormData({ name: manager.name, email: manager.email, password: '', viewUsers: perms.viewUsers ?? true, viewShortlists: perms.viewShortlists ?? true, viewLeads: perms.viewLeads ?? true });
        setShowForm(true);
    };

    const toggleActive = async (manager: Manager) => {
        await fetch('/api/admin/managers', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: manager.id, isActive: !manager.isActive }),
        });
        fetchManagers();
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this manager?')) return;
        await fetch(`/api/admin/managers?id=${id}`, { method: 'DELETE' });
        fetchManagers();
    };

    if (loading) return <div className="p-8 text-center">Loading...</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Manager Management</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">Create and manage manager accounts</p>
                </div>
                <button
                    onClick={() => { setShowForm(true); setEditingManager(null); setFormData({ name: '', email: '', password: '', viewUsers: true, viewShortlists: true, viewLeads: true }); }}
                    className="px-5 py-2.5 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all"
                >
                    + Add Manager
                </button>
            </div>

            {/* Form Modal */}
            {showForm && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 w-full max-w-lg">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                            {editingManager ? 'Edit Manager' : 'Add New Manager'}
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {error && <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-4 py-3 rounded-xl text-sm">{error}</div>}

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Name *</label>
                                <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Email *</label>
                                <input type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Password {editingManager ? '(leave blank to keep)' : '*'}</label>
                                <input type="password" required={!editingManager} value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Permissions</label>
                                <div className="space-y-2">
                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <input type="checkbox" checked={formData.viewUsers} onChange={(e) => setFormData({ ...formData, viewUsers: e.target.checked })} className="w-4 h-4 text-primary-600 rounded" />
                                        <span className="text-sm text-gray-700 dark:text-gray-300">View User Details</span>
                                    </label>
                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <input type="checkbox" checked={formData.viewShortlists} onChange={(e) => setFormData({ ...formData, viewShortlists: e.target.checked })} className="w-4 h-4 text-primary-600 rounded" />
                                        <span className="text-sm text-gray-700 dark:text-gray-300">View User Shortlists</span>
                                    </label>
                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <input type="checkbox" checked={formData.viewLeads} onChange={(e) => setFormData({ ...formData, viewLeads: e.target.checked })} className="w-4 h-4 text-primary-600 rounded" />
                                        <span className="text-sm text-gray-700 dark:text-gray-300">View Lead Responses</span>
                                    </label>
                                </div>
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button type="button" onClick={() => { setShowForm(false); setEditingManager(null); setError(''); }} className="flex-1 px-4 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-semibold">Cancel</button>
                                <button type="submit" disabled={saving} className="flex-1 px-4 py-3 bg-gray-900 text-orange-500 rounded-xl font-semibold disabled:opacity-50 hover:bg-black transition-colors border border-gray-800">{saving ? 'Saving...' : editingManager ? 'Update' : 'Create'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Manager List */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden">
                {managers.length === 0 ? (
                    <div className="p-12 text-center text-gray-500 dark:text-gray-400">No managers yet. Click &quot;Add Manager&quot; to create one.</div>
                ) : (
                    <table className="w-full">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">Name</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">Email</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">Status</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">Permissions</th>
                                <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {managers.map((m) => {
                                const perms = JSON.parse(m.permissions);
                                return (
                                    <tr key={m.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                        <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">{m.name}</td>
                                        <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{m.email}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${m.isActive ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'}`}>
                                                {m.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex gap-1.5 flex-wrap">
                                                {perms.viewUsers && <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs rounded">Users</span>}
                                                {perms.viewShortlists && <span className="px-2 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 text-xs rounded">Shortlists</span>}
                                                {perms.viewLeads && <span className="px-2 py-0.5 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-xs rounded">Leads</span>}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex gap-2 justify-end">
                                                <button onClick={() => handleEdit(m)} className="text-sm text-primary-600 hover:underline font-medium">Edit</button>
                                                <button onClick={() => toggleActive(m)} className="text-sm text-amber-600 hover:underline font-medium">{m.isActive ? 'Deactivate' : 'Activate'}</button>
                                                <button onClick={() => handleDelete(m.id)} className="text-sm text-red-600 hover:underline font-medium">Delete</button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
