'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Manager {
    id: string;
    name: string;
    email: string;
    permissions: string;
    isActive: boolean;
    createdAt: string;
}

export default function ManagersPage() {
    const [managers, setManagers] = useState<Manager[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [expandedManager, setExpandedManager] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        viewLeads: true,
        viewUsers: true,
        viewProperties: true,
        addProperties: true,
        editProperties: true
    });

    useEffect(() => { fetchManagers(); }, []);

    const fetchManagers = async () => {
        try {
            const res = await fetch('/api/admin/managers');
            const data = await res.json();
            setManagers(Array.isArray(data) ? data : []);
        } catch { 
            setManagers([]);
        }
        setLoading(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSaving(true);

        try {
            const permissions = {
                viewLeads: formData.viewLeads,
                viewUsers: formData.viewUsers,
                viewProperties: formData.viewProperties,
                addProperties: formData.addProperties,
                editProperties: formData.editProperties
            };

            const res = await fetch('/api/admin/managers', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                    permissions
                }),
            });

            const data = await res.json();
            if (!res.ok) {
                setError(data.error || 'Failed to create manager');
            } else {
                setShowForm(false);
                setFormData({ name: '', email: '', password: '', viewLeads: true, viewUsers: true, viewProperties: true, addProperties: true, editProperties: true });
                fetchManagers();
            }
        } catch {
            setError('Something went wrong');
        }
        setSaving(false);
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

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-[#fafafa]">
            <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="container mx-auto px-4 py-8 max-w-5xl animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
                <div>
                    <Link href="/admin" className="text-primary-600 text-xs font-bold uppercase tracking-widest hover:underline mb-2 inline-block">← Back to Dashboard</Link>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Manage Managers</h1>
                    <p className="text-sm text-gray-500 mt-1 font-medium">Create, activate/deactivate, and control permissions</p>
                </div>
                <button 
                    onClick={() => setShowForm(!showForm)}
                    className="px-8 py-3 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-2xl shadow-lg shadow-primary-100 transition-all flex items-center gap-2"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                    Add Manager
                </button>
            </div>

            {/* Create New Manager Form */}
            {showForm && (
                <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-gray-50 mb-10 animate-in slide-in-from-top-4 duration-500">
                    <h2 className="text-xl font-bold text-gray-900 mb-8">Create New Manager</h2>
                    <form onSubmit={handleSubmit} className="space-y-8">
                        {error && <div className="bg-red-50 text-red-600 px-6 py-3 rounded-xl text-sm font-bold border border-red-100">{error}</div>}
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <input required type="text" placeholder="Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-primary-500 transition-all font-medium" />
                            </div>
                            <div>
                                <input required type="email" placeholder="Email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-primary-500 transition-all font-medium" />
                            </div>
                            <div>
                                <input required type="password" placeholder="Password (min 6 chars)" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-primary-500 transition-all font-medium" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-4 ml-1">Initial Permissions</label>
                            <div className="flex flex-wrap gap-3">
                                {[
                                    { id: 'viewLeads', label: 'Leads' },
                                    { id: 'viewUsers', label: 'Users' },
                                    { id: 'viewProperties', label: 'Properties' },
                                    { id: 'addProperties', label: 'addProperties' },
                                    { id: 'editProperties', label: 'editProperties' }
                                ].map(p => (
                                    <button 
                                        key={p.id}
                                        type="button"
                                        onClick={() => setFormData({...formData, [p.id]: !((formData as any)[p.id])})}
                                        className={`px-4 py-2 rounded-xl text-sm font-bold border-2 transition-all ${(formData as any)[p.id] ? 'bg-primary-50 border-primary-500 text-primary-700 shadow-sm' : 'bg-white border-gray-100 text-gray-400 hover:border-gray-200'}`}
                                    >
                                        <span className="mr-1.5">{(formData as any)[p.id] ? '✓' : '×'}</span>
                                        {p.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex gap-4 pt-4 border-t border-gray-50">
                            <button type="submit" disabled={saving} className="px-10 py-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-[1.5rem] shadow-lg shadow-green-100 transition-all disabled:opacity-50">
                                {saving ? 'Creating...' : 'Create Manager'}
                            </button>
                            <button type="button" onClick={() => setShowForm(false)} className="px-10 py-4 bg-gray-100 hover:bg-gray-200 text-gray-500 font-bold rounded-[1.5rem] transition-all">
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Manager List */}
            <div className="space-y-6">
                {(managers || []).map(manager => {
                    let perms = { viewLeads: false, viewUsers: false, viewProperties: false, addProperties: false, editProperties: false };
                    try {
                        perms = JSON.parse(manager.permissions || '{}');
                    } catch (e) {
                        console.error('Error parsing permissions for manager', manager.id);
                    }
                    const isExpanded = expandedManager === manager.id;
                    ...     
                    return (
                        <div key={manager.id} className="bg-white rounded-[2.5rem] shadow-sm border border-gray-50 overflow-hidden transition-all hover:shadow-md">
                            <div className="p-8 flex items-center justify-between">
                                <div className="flex items-center gap-6">
                                    <button 
                                        onClick={() => toggleActive(manager)}
                                        className={`w-14 h-8 rounded-full transition-all relative ${manager.isActive ? 'bg-green-500' : 'bg-gray-200'}`}
                                    >
                                        <div className={`w-6 h-6 bg-white rounded-full absolute top-1 transition-all shadow-sm ${manager.isActive ? 'left-7' : 'left-1'}`}></div>
                                    </button>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h3 className="text-lg font-bold text-gray-900">{manager.name}</h3>
                                            <span className={`px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-widest rounded-md ${manager.isActive ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                                                {manager.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-500 font-medium">{manager.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="hidden md:flex gap-1.5">
                                        {Object.entries(perms).filter(([_, v]) => v).map(([k, _]) => (
                                            <span key={k} className="px-2.5 py-1 bg-blue-50 text-blue-600 text-[10px] font-bold rounded-lg border border-blue-100">
                                                {k.replace('view', '').replace('Properties', 'properties')}
                                            </span>
                                        ))}
                                    </div>
                                    <button 
                                        onClick={() => setExpandedManager(isExpanded ? null : manager.id)}
                                        className="p-3 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-2xl transition-all"
                                    >
                                        <svg className={`w-5 h-5 transition-all ${isExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" /></svg>
                                    </button>
                                </div>
                            </div>

                            {isExpanded && (
                                <div className="px-8 pb-8 animate-in slide-in-from-top-2 duration-300">
                                    <div className="h-px bg-gray-50 mb-8"></div>
                                    <h4 className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-6 ml-1">Dashboard Access Controls</h4>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
                                        {[
                                            { id: 'viewLeads', label: 'View Lead Responses', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
                                            { id: 'viewUsers', label: 'View Registered Users', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
                                            { id: 'viewProperties', label: 'View Properties', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
                                            { id: 'addProperties', label: 'Add New Properties', icon: 'M12 6v6m0 0v6m0-6h6m-6 0H6' },
                                            { id: 'editProperties', label: 'Edit Properties', icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z' }
                                        ].map(control => {
                                            const isEnabled = perms[control.id];
                                            return (
                                                <div key={control.id} className={`p-5 rounded-2xl border-2 flex items-start gap-4 transition-all ${isEnabled ? 'bg-green-50/50 border-green-200 shadow-sm' : 'bg-gray-50/50 border-gray-100 opacity-60'}`}>
                                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isEnabled ? 'bg-white text-green-600' : 'bg-white text-gray-400'}`}>
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={control.icon} /></svg>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-gray-900">{control.label}</p>
                                                        <p className={`text-[10px] font-bold uppercase mt-1 ${isEnabled ? 'text-green-600' : 'text-gray-400'}`}>✓ {isEnabled ? 'Enabled' : 'Disabled'}</p>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-6">
                                            <button className="text-sm font-bold text-gray-600 hover:text-primary-600 flex items-center gap-2">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" /></svg>
                                                Change Password
                                            </button>
                                            <p className="text-[11px] text-gray-400 font-medium">Created {new Date(manager.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                                        </div>
                                        <button 
                                            onClick={() => handleDelete(manager.id)}
                                            className="text-sm font-bold text-red-500 hover:text-red-600 hover:underline"
                                        >
                                            Delete Manager
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}

                {managers.length === 0 && (
                    <div className="p-20 text-center bg-white rounded-[2.5rem] border border-dashed border-gray-200">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">No Managers Found</h3>
                        <p className="text-gray-500 mb-8 max-w-xs mx-auto">Start by creating your first manager to help manage properties and leads.</p>
                        <button 
                            onClick={() => setShowForm(true)}
                            className="px-8 py-3 bg-primary-600 text-white font-bold rounded-2xl shadow-lg shadow-primary-100"
                        >
                            + Create Manager
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
