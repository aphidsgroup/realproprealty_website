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
    const [stats, setStats] = useState({ users: 0, leads: 0, propertiesCount: 0, properties: [] as any[] });
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('properties');
    const [selectedSubmission, setSelectedSubmission] = useState<any>(null);

    useEffect(() => {
        const init = async () => {
            const meRes = await fetch('/api/auth/me');
            const meData = await meRes.json();
            if (!meData.user || meData.user.role !== 'manager') {
                router.push('/admin/login');
                return;
            }
            setUser(meData.user);

            const permRes = await fetch('/api/manager/permissions');
            const permData = await permRes.json();
            setPermissions(permData.permissions || {});

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

    const handleVerify = async (id: string) => {
        try {
            const res = await fetch('/api/admin/leads/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ submissionId: id })
            });
            if (res.ok) {
                setStats({
                    ...stats,
                    leads: stats.leads - 1,
                    properties: stats.properties,
                    pendingSubmissions: (stats as any).pendingSubmissions.filter((s: any) => s.id !== id)
                } as any);
                setSelectedSubmission(null);
            }
        } catch (e) {
            console.error(e);
        }
    };

    const handleDeleteSubmission = async (id: string) => {
        if (!confirm('Are you sure you want to delete this submission?')) return;
        try {
            await fetch(`/api/admin/leads/submissions/${id}`, { method: 'DELETE' });
            setStats({
                ...stats,
                leads: stats.leads - 1,
                properties: stats.properties,
                pendingSubmissions: (stats as any).pendingSubmissions.filter((s: any) => s.id !== id)
            } as any);
            setSelectedSubmission(null);
        } catch (e) {
            console.error(e);
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-[#fafafa]">
            <div className="w-8 h-8 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    // If a submission is selected, show the Review & Verify full page view
    if (selectedSubmission) {
        return (
            <div className="min-h-screen bg-[#fafafa] pb-24 font-sans text-gray-900">
                {/* Top Logo Header */}
                <div className="bg-white px-4 py-3 flex justify-between items-center shadow-sm z-10 relative">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 relative">
                            <img src="/logo.png" alt="Realprop Realty" className="w-full h-full object-contain" />
                        </div>
                        <div className="flex flex-col">
                            <span className="font-extrabold text-gray-900 leading-none tracking-tight">Realprop Realty</span>
                            <span className="text-[9px] font-bold text-yellow-600 uppercase tracking-widest mt-0.5">Manager Console</span>
                        </div>
                    </div>
                    <button className="p-2 text-gray-600">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                    </button>
                </div>

                <div className="container mx-auto px-4 py-8 max-w-6xl">
                    <div className="mb-8 flex justify-between items-center">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Form Submissions</h1>
                            <p className="text-xs md:text-sm text-gray-500 mt-1">Review and verify property onboarding and search requests.</p>
                        </div>
                        <button 
                            onClick={() => setSelectedSubmission(null)}
                            className="px-4 py-2 text-sm font-bold text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
                        >
                            Back
                        </button>
                    </div>

                    <div className="flex flex-col md:flex-row gap-8">
                        {/* Left sidebar - list of submissions */}
                        <div className="w-full md:w-1/3">
                            <h3 className="text-[10px] font-bold text-gray-400 mb-4 tracking-wider uppercase">SUBMISSIONS ({(stats as any).pendingSubmissions?.length || 0})</h3>
                            <div className="space-y-3">
                                {(stats as any).pendingSubmissions?.map((sub: any) => (
                                    <div 
                                        key={sub.id} 
                                        onClick={() => setSelectedSubmission(sub)}
                                        className={`p-4 rounded-[1.25rem] cursor-pointer border-2 transition-all ${selectedSubmission.id === sub.id ? 'bg-[#fffdf0] border-yellow-400 shadow-sm' : 'bg-white border-transparent hover:border-gray-100 shadow-sm'}`}
                                    >
                                        <div className="flex justify-between items-center mb-2">
                                            <span className={`px-2 py-0.5 rounded text-[9px] font-bold tracking-wider uppercase ${sub.formType === 'buyer' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'}`}>
                                                {sub.formType}
                                            </span>
                                            {selectedSubmission.id === sub.id && (
                                                <span className="text-[9px] font-bold text-green-500 uppercase tracking-wider">SELECTED</span>
                                            )}
                                        </div>
                                        <h4 className="font-bold text-[15px] text-gray-900">{sub.name}</h4>
                                        <p className="text-[11px] text-gray-500">{new Date(sub.createdAt).toLocaleDateString()}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Right Main Area - Detail View */}
                        <div className="w-full md:w-2/3">
                            <div className="bg-white rounded-[1.5rem] p-6 md:p-8 shadow-sm border border-gray-50">
                                <div className="flex justify-between items-center mb-8">
                                    <h2 className="text-xl md:text-2xl font-bold text-gray-900">Submission Details</h2>
                                    <div className="flex gap-2">
                                        <button 
                                            onClick={() => handleVerify(selectedSubmission.id)}
                                            className="px-4 py-2 bg-green-50 text-green-600 hover:bg-green-100 text-xs font-bold rounded-lg transition-colors border border-green-100"
                                        >
                                            Verify & Convert
                                        </button>
                                        <button 
                                            onClick={() => handleDeleteSubmission(selectedSubmission.id)}
                                            className="px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 text-xs font-bold rounded-lg transition-colors border border-red-100"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                                    <div>
                                        <h4 className="text-[10px] uppercase font-extrabold tracking-widest text-gray-400 mb-6">CUSTOMER PROFILE</h4>
                                        <div className="space-y-5">
                                            <div>
                                                <p className="text-[10px] uppercase font-extrabold tracking-widest text-gray-400 mb-1">FULL NAME</p>
                                                <p className="text-sm font-bold text-gray-900">{selectedSubmission.name}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] uppercase font-extrabold tracking-widest text-gray-400 mb-1">PHONE NUMBER</p>
                                                <p className="text-sm font-bold text-gray-900">{selectedSubmission.phone}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] uppercase font-extrabold tracking-widest text-gray-400 mb-1">EMAIL ADDRESS</p>
                                                <p className="text-sm font-bold text-gray-900">{selectedSubmission.email || '—'}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] uppercase font-extrabold tracking-widest text-gray-400 mb-1">WHATSAPP UPDATES</p>
                                                <p className="text-sm font-bold text-gray-900">{selectedSubmission.optInWhatsapp ? 'Opted In' : 'Not Opted In'}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="text-[10px] uppercase font-extrabold tracking-widest text-gray-400 mb-6">REQUEST INFO</h4>
                                        <div className="space-y-5">
                                            <div>
                                                <p className="text-[10px] uppercase font-extrabold tracking-widest text-gray-400 mb-1">FORM TYPE</p>
                                                <p className="text-sm font-bold text-gray-900 uppercase">{selectedSubmission.formType}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] uppercase font-extrabold tracking-widest text-gray-400 mb-1">{selectedSubmission.formType === 'buyer' ? 'BUYER TYPE' : 'SELLER TYPE'}</p>
                                                <p className="text-sm font-bold text-gray-900">{selectedSubmission.propertyType || '—'}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] uppercase font-extrabold tracking-widest text-gray-400 mb-1">BHK / BEDROOMS</p>
                                                <p className="text-sm font-bold text-gray-900">{selectedSubmission.bhk || '—'}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] uppercase font-extrabold tracking-widest text-gray-400 mb-1">BUDGET RANGE</p>
                                                <p className="text-sm font-bold text-gray-900">{selectedSubmission.budget || '—'}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-[#f8fafc] rounded-2xl p-6 border border-gray-100">
                                    <p className="text-[10px] uppercase font-extrabold tracking-widest text-gray-400 mb-2">{selectedSubmission.formType === 'buyer' ? 'PREFERRED AREAS' : 'PROPERTY ADDRESS'}</p>
                                    <p className="text-sm font-bold text-gray-900">{selectedSubmission.areas || selectedSubmission.propertyAddress || '—'}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Default Manager Dashboard View
    return (
        <div className="min-h-screen bg-[#fafafa] pb-24 font-sans text-gray-900">
            {/* Top Logo Header */}
            <div className="bg-white px-4 py-3 flex justify-between items-center shadow-sm z-10 relative">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 relative">
                        <img src="/logo.png" alt="Realprop Realty" className="w-full h-full object-contain" />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-extrabold text-gray-900 leading-none tracking-tight text-[15px]">Realprop Realty</span>
                        <span className="text-[9px] font-bold text-yellow-600 uppercase tracking-widest mt-0.5">Manager Console</span>
                    </div>
                </div>
                <button className="p-2 text-gray-600">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                </button>
            </div>

            {/* Secondary Header */}
            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-b border-gray-100">
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-yellow-500 text-white rounded flex items-center justify-center">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                    </div>
                    <span className="font-bold text-[15px]">Manager</span>
                </div>
                <div className="flex items-center gap-2">
                    <Link href="/manager/leads?type=seller" className="text-xs font-bold text-blue-600 px-2">Seller Leads</Link>
                    <Link href="/manager/leads?type=buyer" className="text-xs font-bold text-purple-600 px-2">Buyer Leads</Link>
                    <Link href="/manager/properties/new" className="bg-yellow-500 hover:bg-yellow-600 text-white text-xs font-bold px-3 py-1.5 rounded shadow-sm flex items-center gap-1">
                        + Add
                    </Link>
                    <button onClick={handleLogout} className="text-gray-400 hover:text-gray-600 ml-1">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="px-4 pt-6 max-w-3xl mx-auto">
                {/* KPI Row */}
                <div className="flex gap-3 mb-6">
                    <div className="flex-1 bg-white rounded-xl shadow-sm py-4 flex flex-col items-center justify-center border border-gray-50">
                        <span className="text-xl font-bold text-yellow-600 mb-1">{stats.leads}</span>
                        <span className="text-[10px] text-gray-500 font-medium">Responses</span>
                    </div>
                    <div className="flex-1 bg-white rounded-xl shadow-sm py-4 flex flex-col items-center justify-center border border-gray-50">
                        <span className="text-xl font-bold text-blue-600 mb-1">{stats.users}</span>
                        <span className="text-[10px] text-gray-500 font-medium">Users</span>
                    </div>
                    <div className="flex-1 bg-white rounded-xl shadow-sm py-4 flex flex-col items-center justify-center border border-gray-50">
                        <span className="text-xl font-bold text-green-500 mb-1">{stats.propertiesCount}</span>
                        <span className="text-[10px] text-gray-500 font-medium">Properties</span>
                    </div>
                </div>

                {/* Tab Content */}
                <div className="space-y-4">
                    {activeTab === 'properties' && (
                        <>
                            {stats.properties.map((prop: any) => (
                                <div key={prop.id} className="bg-white rounded-[1.25rem] shadow-sm border border-gray-50 p-5 relative overflow-hidden">
                                    <div className="absolute top-4 right-4 flex flex-col items-end gap-1">
                                        {prop.isPublished && (
                                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-green-50 text-green-600 border border-green-100 uppercase">Live</span>
                                        )}
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                                            prop.usageType === 'residential' 
                                            ? 'bg-blue-50 text-blue-500 border-blue-100' 
                                            : 'bg-purple-50 text-purple-500 border-purple-100'
                                        }`}>
                                            {prop.usageType === 'residential' ? 'Buy' : 'Sell'}
                                        </span>
                                    </div>

                                    <h3 className="font-bold text-[15px] text-gray-900 pr-16 mb-1 truncate">{prop.title}</h3>
                                    <p className="text-[11px] text-gray-500 mb-3">{prop.areaName} • {new Date(prop.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</p>
                                    <p className="font-bold text-yellow-600 mb-5 text-[15px]">₹{prop.priceInr?.toLocaleString() || 'Contact'}</p>

                                    <div className="flex gap-2">
                                        <Link href={`/manager/properties/${prop.id}/edit`} className="flex-1 text-center py-2 bg-[#fffdf0] text-yellow-700 text-xs font-bold rounded-lg border border-yellow-100 flex items-center justify-center gap-1 hover:bg-yellow-50 transition-colors">
                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                            Edit
                                        </Link>
                                        <button className="flex-1 text-center py-2 bg-orange-50 text-orange-600 text-xs font-bold rounded-lg border border-orange-100 hover:bg-orange-100 transition-colors">
                                            Mark Sold
                                        </button>
                                        <button className="flex-1 text-center py-2 bg-red-50 text-red-600 text-xs font-bold rounded-lg border border-red-100 hover:bg-red-100 transition-colors">
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                            {stats.properties.length === 0 && (
                                <div className="text-center py-10 bg-white rounded-[1.25rem] text-gray-400 shadow-sm text-sm font-medium">
                                    No properties found.
                                </div>
                            )}
                        </>
                    )}

                    {activeTab === 'forms' && (
                        <>
                            {/* Shareable Links */}
                            <div className="bg-[#fffdf0] border border-yellow-100 rounded-[1.25rem] p-5 shadow-sm mb-6">
                                <h3 className="flex items-center gap-2 text-sm font-bold text-yellow-800 mb-4">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                                    Shareable Form Links
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between bg-white px-3 py-2 rounded-lg border border-yellow-50">
                                        <span className="text-xs font-bold text-gray-600">Buyer Form:</span>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[11px] text-gray-400 bg-gray-50 px-2 py-1 rounded">/forms/buyer</span>
                                            <button className="text-xs font-bold text-yellow-600 hover:text-yellow-700">Copy</button>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between bg-white px-3 py-2 rounded-lg border border-yellow-50">
                                        <span className="text-xs font-bold text-gray-600">Seller Form:</span>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[11px] text-gray-400 bg-gray-50 px-2 py-1 rounded">/forms/seller</span>
                                            <button className="text-xs font-bold text-yellow-600 hover:text-yellow-700">Copy</button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Submissions List */}
                            <div className="space-y-3">
                                {(stats as any).pendingSubmissions?.map((sub: any) => (
                                    <div key={sub.id} className="bg-white rounded-[1.25rem] shadow-sm border border-gray-50 p-5">
                                        <div className="flex justify-between items-start mb-2">
                                            <span className={`px-2 py-0.5 rounded text-[9px] font-bold tracking-wider uppercase ${sub.formType === 'buyer' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'}`}>
                                                {sub.formType}
                                            </span>
                                            <div className="text-right">
                                                <div className="text-[10px] text-gray-400">{new Date(sub.createdAt).toLocaleDateString()}</div>
                                                <div className="text-[9px] font-bold text-green-500 uppercase tracking-wider mt-0.5">PENDING</div>
                                            </div>
                                        </div>
                                        
                                        <h4 className="font-bold text-[15px] text-gray-900 mb-1">{sub.name}</h4>
                                        <div className="text-[11px] text-gray-500 space-y-1 mb-4">
                                            <div className="flex items-center gap-1.5">
                                                <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                                                {sub.phone}
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                                <span className="truncate">{sub.areas || sub.propertyAddress || 'No location specified'}</span>
                                            </div>
                                        </div>

                                        <button onClick={() => setSelectedSubmission(sub)} className="w-full py-2.5 bg-[#f8fafc] text-gray-700 text-[11px] font-bold rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors">
                                            Review & Verify
                                        </button>
                                    </div>
                                ))}
                                {(stats as any).pendingSubmissions?.length === 0 && (
                                    <div className="text-center py-10 bg-white rounded-[1.25rem] text-gray-400 shadow-sm text-sm font-medium border border-gray-50">
                                        No pending submissions.
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Bottom Sticky Navigation */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] flex justify-around items-center py-2 z-20">
                <button 
                    onClick={() => setActiveTab('users')}
                    className="flex flex-col items-center justify-center w-20 py-1"
                >
                    <svg className={`w-5 h-5 mb-1 ${activeTab === 'users' ? 'text-yellow-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                    <span className={`text-[10px] font-bold ${activeTab === 'users' ? 'text-yellow-500' : 'text-gray-400'}`}>Users</span>
                    <span className="text-[10px] text-gray-400 font-bold mt-0.5">{stats.users}</span>
                </button>
                
                <button 
                    onClick={() => setActiveTab('properties')}
                    className="flex flex-col items-center justify-center w-20 py-1"
                >
                    <svg className={`w-5 h-5 mb-1 ${activeTab === 'properties' ? 'text-yellow-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                    <span className={`text-[10px] font-bold ${activeTab === 'properties' ? 'text-yellow-500' : 'text-gray-400'}`}>Properties</span>
                    <span className={`text-[10px] font-bold mt-0.5 ${activeTab === 'properties' ? 'bg-yellow-100 text-yellow-700 px-1.5 rounded-full' : 'text-gray-400'}`}>{stats.propertiesCount}</span>
                </button>
                
                <button 
                    onClick={() => { setActiveTab('forms'); setSelectedSubmission(null); }}
                    className="flex flex-col items-center justify-center w-20 py-1"
                >
                    <svg className={`w-5 h-5 mb-1 ${activeTab === 'forms' ? 'text-yellow-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                    <span className={`text-[10px] font-bold ${activeTab === 'forms' ? 'text-yellow-500' : 'text-gray-400'}`}>Forms</span>
                    <span className="text-[10px] text-gray-400 font-bold mt-0.5">{stats.leads}</span>
                </button>
            </div>
        </div>
    );
}
