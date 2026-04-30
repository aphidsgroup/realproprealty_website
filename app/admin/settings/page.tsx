'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SettingsPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [managers, setManagers] = useState<any[]>([]);

    const [formData, setFormData] = useState({
        brandName: '',
        tagline: '',
        city: '',
        heroTitle: '',
        heroSubtitle: '',
        footerText: '',
        whatsappNumber: '',
        phoneNumber: '',
        whatsappTemplate: '',
        amenitiesVocabulary: [] as string[],
        contentSections: '[]',
    });

    const [adminCreds, setAdminCreds] = useState({
        currentPassword: '',
        newEmail: '',
        newPassword: '',
        confirmPassword: ''
    });

    const [managerCreds, setManagerCreds] = useState({
        managerId: '',
        newName: '',
        newEmail: '',
        newPassword: '',
        confirmPassword: ''
    });

    const [newAmenity, setNewAmenity] = useState('');
    const [revalidating, setRevalidating] = useState(false);

    useEffect(() => {
        fetchSettings();
        fetchManagers();
    }, []);

    const fetchSettings = async () => {
        try {
            const res = await fetch('/api/admin/settings');
            const data = await res.json();
            if (data && !data.error) {
                setFormData({
                    ...data,
                    amenitiesVocabulary: data.amenitiesVocabulary ? JSON.parse(data.amenitiesVocabulary) : [],
                });
            }
        } catch (error) {
            console.error('Error fetching settings:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchManagers = async () => {
        try {
            const res = await fetch('/api/admin/managers');
            const data = await res.json();
            setManagers(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error fetching managers:', error);
            setManagers([]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            const payload = {
                ...formData,
                amenitiesVocabulary: JSON.stringify(formData.amenitiesVocabulary),
            };

            const res = await fetch('/api/admin/settings', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!res.ok) throw new Error('Failed to save settings');

            alert('Settings saved successfully!');
            router.refresh();
        } catch (error) {
            console.error('Error saving settings:', error);
            alert('Failed to save settings');
        } finally {
            setSaving(false);
        }
    };

    const updateAdminCredentials = async () => {
        if (!adminCreds.currentPassword) {
            alert('Current password is required to update credentials');
            return;
        }
        if (adminCreds.newPassword && adminCreds.newPassword !== adminCreds.confirmPassword) {
            alert('New passwords do not match');
            return;
        }

        setSaving(true);
        try {
            const res = await fetch('/api/admin/settings/update-admin-credentials', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(adminCreds)
            });
            const data = await res.json();
            if (res.ok) {
                alert('Admin credentials updated successfully!');
                setAdminCreds({ currentPassword: '', newEmail: '', newPassword: '', confirmPassword: '' });
            } else {
                alert(data.error || 'Failed to update credentials');
            }
        } catch (error) {
            alert('Error updating credentials');
        } finally {
            setSaving(false);
        }
    };

    const updateManagerCredentials = async () => {
        if (!managerCreds.managerId) {
            alert('Please select a manager');
            return;
        }
        if (managerCreds.newPassword && managerCreds.newPassword !== managerCreds.confirmPassword) {
            alert('New passwords do not match');
            return;
        }

        setSaving(true);
        try {
            const res = await fetch('/api/admin/settings/update-manager-credentials', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(managerCreds)
            });
            const data = await res.json();
            if (res.ok) {
                alert('Manager credentials updated successfully!');
                setManagerCreds({ managerId: '', newName: '', newEmail: '', newPassword: '', confirmPassword: '' });
                fetchManagers();
            } else {
                alert(data.error || 'Failed to update credentials');
            }
        } catch (error) {
            alert('Error updating credentials');
        } finally {
            setSaving(false);
        }
    };

    const addAmenity = () => {
        if (newAmenity.trim() && !formData.amenitiesVocabulary.includes(newAmenity.trim())) {
            setFormData({
                ...formData,
                amenitiesVocabulary: [...formData.amenitiesVocabulary, newAmenity.trim()],
            });
            setNewAmenity('');
        }
    };

    const removeAmenity = (amenity: string) => {
        setFormData({
            ...formData,
            amenitiesVocabulary: formData.amenitiesVocabulary.filter(a => a !== amenity),
        });
    };

    const handleRevalidate = async () => {
        setRevalidating(true);
        try {
            const res = await fetch('/api/admin/revalidate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ paths: ['/', '/list'] }),
            });
            if (res.ok) alert('Cache cleared! Pages will refresh momentarily.');
            else throw new Error('Failed');
        } catch { alert('Revalidation failed'); }
        setRevalidating(false);
    };

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl animate-in fade-in duration-500">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 tracking-tight">
                    Site Settings
                </h1>
                <p className="text-gray-600 dark:text-gray-400 font-medium">
                    Configure your site's global settings and manage credentials
                </p>
            </div>

            <div className="space-y-8">
                {/* Credentials Management Card */}
                <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                    <div className="bg-primary-50/50 dark:bg-primary-900/10 px-8 py-6 border-b border-primary-100/50 dark:border-primary-900/20">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                                <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" /></svg>
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Credentials Management</h2>
                                <p className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider mt-0.5">Change admin or manager login details</p>
                            </div>
                        </div>
                    </div>

                    <div className="p-8 space-y-12">
                        {/* Admin Credentials */}
                        <div>
                            <div className="flex items-center gap-2 mb-6">
                                <svg className="w-4 h-4 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                                <h3 className="font-bold text-gray-900 dark:text-white">My Admin Credentials</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2">
                                    <label className="block text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-2 ml-1">Current Password <span className="text-red-500">*</span></label>
                                    <input 
                                        type="password"
                                        value={adminCreds.currentPassword}
                                        onChange={(e) => setAdminCreds({...adminCreds, currentPassword: e.target.value})}
                                        placeholder="Enter current password to verify"
                                        className="w-full px-5 py-3.5 bg-gray-50 dark:bg-gray-700/50 border border-gray-100 dark:border-gray-600 rounded-2xl focus:ring-2 focus:ring-primary-500 transition-all font-medium text-sm"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-2 ml-1">New Email <span className="text-gray-400 font-normal">(optional)</span></label>
                                    <input 
                                        type="email"
                                        value={adminCreds.newEmail}
                                        onChange={(e) => setAdminCreds({...adminCreds, newEmail: e.target.value})}
                                        placeholder="new@email.com"
                                        className="w-full px-5 py-3.5 bg-gray-50 dark:bg-gray-700/50 border border-gray-100 dark:border-gray-600 rounded-2xl focus:ring-2 focus:ring-primary-500 transition-all font-medium text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-2 ml-1">New Password <span className="text-gray-400 font-normal">(optional, min 8 chars)</span></label>
                                    <input 
                                        type="password"
                                        value={adminCreds.newPassword}
                                        onChange={(e) => setAdminCreds({...adminCreds, newPassword: e.target.value})}
                                        placeholder="New password"
                                        className="w-full px-5 py-3.5 bg-gray-50 dark:bg-gray-700/50 border border-gray-100 dark:border-gray-600 rounded-2xl focus:ring-2 focus:ring-primary-500 transition-all font-medium text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-2 ml-1">Confirm New Password</label>
                                    <input 
                                        type="password"
                                        value={adminCreds.confirmPassword}
                                        onChange={(e) => setAdminCreds({...adminCreds, confirmPassword: e.target.value})}
                                        placeholder="Re-enter new password"
                                        className="w-full px-5 py-3.5 bg-gray-50 dark:bg-gray-700/50 border border-gray-100 dark:border-gray-600 rounded-2xl focus:ring-2 focus:ring-primary-500 transition-all font-medium text-sm"
                                    />
                                </div>
                            </div>
                            <button 
                                onClick={updateAdminCredentials}
                                disabled={saving}
                                className="mt-8 px-8 py-3.5 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-2xl transition-all shadow-lg shadow-primary-100 dark:shadow-none disabled:opacity-50"
                            >
                                {saving ? 'Updating...' : 'Update My Credentials'}
                            </button>
                        </div>

                        <div className="h-px bg-gray-100 dark:bg-gray-700"></div>

                        {/* Manager Credentials */}
                        <div>
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-2">
                                    <svg className="w-4 h-4 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                                    <h3 className="font-bold text-gray-900 dark:text-white">Manager Credentials</h3>
                                </div>
                                <span className="px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold rounded-full border border-indigo-100 dark:border-indigo-800">Admin Override — No current password needed</span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2">
                                    <label className="block text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-2 ml-1">Select Manager <span className="text-red-500">*</span></label>
                                    <select 
                                        value={managerCreds.managerId}
                                        onChange={(e) => setManagerCreds({...managerCreds, managerId: e.target.value})}
                                        className="w-full px-5 py-3.5 bg-gray-50 dark:bg-gray-700/50 border border-gray-100 dark:border-gray-600 rounded-2xl focus:ring-2 focus:ring-primary-500 transition-all font-bold text-sm"
                                    >
                                        <option value="">— Choose a manager —</option>
                                        {managers.map(m => (
                                            <option key={m.id} value={m.id}>{m.name} ({m.email})</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-2 ml-1">New Name <span className="text-gray-400 font-normal">(optional)</span></label>
                                    <input 
                                        type="text"
                                        value={managerCreds.newName}
                                        onChange={(e) => setManagerCreds({...managerCreds, newName: e.target.value})}
                                        placeholder="Manager name"
                                        className="w-full px-5 py-3.5 bg-gray-50 dark:bg-gray-700/50 border border-gray-100 dark:border-gray-600 rounded-2xl focus:ring-2 focus:ring-primary-500 transition-all font-medium text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-2 ml-1">New Email <span className="text-gray-400 font-normal">(optional)</span></label>
                                    <input 
                                        type="email"
                                        value={managerCreds.newEmail}
                                        onChange={(e) => setManagerCreds({...managerCreds, newEmail: e.target.value})}
                                        placeholder="manager@example.com"
                                        className="w-full px-5 py-3.5 bg-gray-50 dark:bg-gray-700/50 border border-gray-100 dark:border-gray-600 rounded-2xl focus:ring-2 focus:ring-primary-500 transition-all font-medium text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-2 ml-1">New Password <span className="text-gray-400 font-normal">(optional, min 6 chars)</span></label>
                                    <input 
                                        type="password"
                                        value={managerCreds.newPassword}
                                        onChange={(e) => setManagerCreds({...managerCreds, newPassword: e.target.value})}
                                        placeholder="New password"
                                        className="w-full px-5 py-3.5 bg-gray-50 dark:bg-gray-700/50 border border-gray-100 dark:border-gray-600 rounded-2xl focus:ring-2 focus:ring-primary-500 transition-all font-medium text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-2 ml-1">Confirm Password</label>
                                    <input 
                                        type="password"
                                        value={managerCreds.confirmPassword}
                                        onChange={(e) => setManagerCreds({...managerCreds, confirmPassword: e.target.value})}
                                        placeholder="Re-enter password"
                                        className="w-full px-5 py-3.5 bg-gray-50 dark:bg-gray-700/50 border border-gray-100 dark:border-gray-600 rounded-2xl focus:ring-2 focus:ring-primary-500 transition-all font-medium text-sm"
                                    />
                                </div>
                            </div>
                            <button 
                                onClick={updateManagerCredentials}
                                disabled={saving}
                                className="mt-8 px-8 py-3.5 bg-gray-400 dark:bg-gray-600 hover:bg-gray-500 text-white font-bold rounded-2xl transition-all shadow-lg shadow-gray-100 dark:shadow-none disabled:opacity-50"
                            >
                                {saving ? 'Updating...' : 'Update Manager Credentials'}
                            </button>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Brand Settings */}
                    <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-700 p-8">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-8 flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center">
                                <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            </div>
                            Brand Settings
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-2 ml-1">
                                    Brand Name
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.brandName}
                                    onChange={(e) => setFormData({ ...formData, brandName: e.target.value })}
                                    className="w-full px-5 py-3.5 bg-gray-50 dark:bg-gray-700/50 border border-gray-100 dark:border-gray-600 rounded-2xl focus:ring-2 focus:ring-primary-500 transition-all font-medium text-sm"
                                />
                            </div>

                            <div>
                                <label className="block text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-2 ml-1">
                                    Tagline
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.tagline}
                                    onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                                    className="w-full px-5 py-3.5 bg-gray-50 dark:bg-gray-700/50 border border-gray-100 dark:border-gray-600 rounded-2xl focus:ring-2 focus:ring-primary-500 transition-all font-medium text-sm"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-2 ml-1">
                                    Default City
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.city}
                                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                    className="w-full px-5 py-3.5 bg-gray-50 dark:bg-gray-700/50 border border-gray-100 dark:border-gray-600 rounded-2xl focus:ring-2 focus:ring-primary-500 transition-all font-medium text-sm"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Homepage CMS */}
                    <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-700 p-8">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-8 flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                                <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                            </div>
                            Homepage Content
                        </h2>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-2 ml-1">
                                    Hero Title
                                </label>
                                <input
                                    type="text"
                                    value={formData.heroTitle}
                                    onChange={(e) => setFormData({ ...formData, heroTitle: e.target.value })}
                                    className="w-full px-5 py-3.5 bg-gray-50 dark:bg-gray-700/50 border border-gray-100 dark:border-gray-600 rounded-2xl focus:ring-2 focus:ring-primary-500 transition-all font-medium text-sm"
                                />
                            </div>

                            <div>
                                <label className="block text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-2 ml-1">
                                    Hero Subtitle
                                </label>
                                <input
                                    type="text"
                                    value={formData.heroSubtitle}
                                    onChange={(e) => setFormData({ ...formData, heroSubtitle: e.target.value })}
                                    className="w-full px-5 py-3.5 bg-gray-50 dark:bg-gray-700/50 border border-gray-100 dark:border-gray-600 rounded-2xl focus:ring-2 focus:ring-primary-500 transition-all font-medium text-sm"
                                />
                            </div>

                            <div>
                                <label className="block text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-2 ml-1">
                                    Footer Text
                                </label>
                                <textarea
                                    rows={2}
                                    value={formData.footerText}
                                    onChange={(e) => setFormData({ ...formData, footerText: e.target.value })}
                                    className="w-full px-5 py-3.5 bg-gray-50 dark:bg-gray-700/50 border border-gray-100 dark:border-gray-600 rounded-2xl focus:ring-2 focus:ring-primary-500 transition-all font-medium text-sm resize-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Contact Settings */}
                    <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-700 p-8">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-8 flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-green-50 dark:bg-green-900/20 flex items-center justify-center">
                                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                            </div>
                            Contact Settings
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-2 ml-1">
                                    WhatsApp Number
                                </label>
                                <input
                                    type="tel"
                                    required
                                    value={formData.whatsappNumber}
                                    onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                                    className="w-full px-5 py-3.5 bg-gray-50 dark:bg-gray-700/50 border border-gray-100 dark:border-gray-600 rounded-2xl focus:ring-2 focus:ring-primary-500 transition-all font-medium text-sm"
                                />
                            </div>

                            <div>
                                <label className="block text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-2 ml-1">
                                    Phone Number
                                </label>
                                <input
                                    type="tel"
                                    required
                                    value={formData.phoneNumber}
                                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                                    className="w-full px-5 py-3.5 bg-gray-50 dark:bg-gray-700/50 border border-gray-100 dark:border-gray-600 rounded-2xl focus:ring-2 focus:ring-primary-500 transition-all font-medium text-sm"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-2 ml-1">
                                    WhatsApp Message Template
                                </label>
                                <textarea
                                    required
                                    rows={3}
                                    value={formData.whatsappTemplate}
                                    onChange={(e) => setFormData({ ...formData, whatsappTemplate: e.target.value })}
                                    className="w-full px-5 py-3.5 bg-gray-50 dark:bg-gray-700/50 border border-gray-100 dark:border-gray-600 rounded-2xl focus:ring-2 focus:ring-primary-500 transition-all font-medium text-sm resize-none"
                                />
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-2 ml-1">
                                    Use {'{propertyTitle}'} and {'{propertyUrl}'} as placeholders
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Amenities Vocabulary */}
                    <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-700 p-8">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center">
                                <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
                            </div>
                            Amenities Vocabulary
                        </h2>
                        <p className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider mb-8 ml-1">
                            Manage the list of amenities available for properties
                        </p>

                        <div className="mb-8">
                            <div className="flex gap-3">
                                <input
                                    type="text"
                                    value={newAmenity}
                                    onChange={(e) => setNewAmenity(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAmenity())}
                                    placeholder="Add new amenity..."
                                    className="flex-1 px-5 py-3.5 bg-gray-50 dark:bg-gray-700/50 border border-gray-100 dark:border-gray-600 rounded-2xl focus:ring-2 focus:ring-primary-500 transition-all font-medium text-sm"
                                />
                                <button
                                    type="button"
                                    onClick={addAmenity}
                                    className="px-8 py-3.5 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-2xl shadow-lg shadow-primary-100 dark:shadow-none transition-all"
                                >
                                    Add
                                </button>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {formData.amenitiesVocabulary.map((amenity) => (
                                <div
                                    key={amenity}
                                    className="flex items-center gap-3 px-5 py-2.5 bg-gray-50 dark:bg-gray-700 rounded-full border border-gray-100 dark:border-gray-600 group"
                                >
                                    <span className="text-sm font-bold text-gray-700 dark:text-gray-200">{amenity}</span>
                                    <button
                                        type="button"
                                        onClick={() => removeAmenity(amenity)}
                                        className="text-gray-400 hover:text-red-500 transition-colors"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col md:flex-row gap-4 pt-4">
                        <button
                            type="button"
                            onClick={handleRevalidate}
                            disabled={revalidating}
                            className="px-8 py-4 border-2 border-primary-100 dark:border-primary-900/30 text-primary-600 font-bold rounded-[1.5rem] hover:bg-primary-50 dark:hover:bg-primary-900/10 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {revalidating ? 'Clearing...' : '🔄 Clear Website Cache'}
                        </button>
                        <div className="flex-1 flex gap-4">
                            <button
                                type="button"
                                onClick={() => router.back()}
                                className="flex-1 px-8 py-4 bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-300 font-bold rounded-[1.5rem] hover:bg-gray-100 dark:hover:bg-gray-600 transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={saving}
                                className="flex-[2] px-8 py-4 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white font-bold rounded-[1.5rem] shadow-xl shadow-primary-100 dark:shadow-none transition-all disabled:cursor-not-allowed"
                            >
                                {saving ? 'Saving...' : 'Save Settings'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
