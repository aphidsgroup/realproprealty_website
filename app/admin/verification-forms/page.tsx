'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function VerificationFormsPage() {
    const [view, setView] = useState<'submissions' | 'manage'>('submissions');
    const [submissions, setSubmissions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedSub, setSelectedSub] = useState<any | null>(null);

    const fetchData = () => {
        setLoading(true);
        fetch('/api/admin/leads')
            .then(res => res.json())
            .then(data => {
                setSubmissions(data.pendingSubmissions || []);
                setLoading(false);
                if (data.pendingSubmissions?.length > 0 && !selectedSub) {
                    setSelectedSub(data.pendingSubmissions[0]);
                }
            })
            .catch(() => setLoading(false));
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleVerify = async (id: string) => {
        try {
            const res = await fetch('/api/admin/leads/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ submissionId: id })
            });
            if (res.ok) {
                setSubmissions(submissions.filter(s => s.id !== id));
                setSelectedSub(null);
            }
        } catch (e) {
            console.error(e);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this submission?')) return;
        try {
            await fetch(`/api/admin/leads/submissions/${id}`, { method: 'DELETE' });
            setSubmissions(submissions.filter(s => s.id !== id));
            setSelectedSub(null);
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl animate-in fade-in duration-500">
            <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Onboarding Forms</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage forms and verify incoming requests.</p>
                </div>
                <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-2xl">
                    <button 
                        onClick={() => setView('submissions')}
                        className={`px-6 py-2 text-sm font-bold rounded-xl transition-all ${view === 'submissions' ? 'bg-white text-primary-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        Submissions
                    </button>
                    <button 
                        onClick={() => setView('manage')}
                        className={`px-6 py-2 text-sm font-bold rounded-xl transition-all ${view === 'manage' ? 'bg-white text-primary-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        Manage Forms
                    </button>
                    <Link href="/admin" className="px-6 py-2 text-sm font-bold text-gray-500 hover:text-gray-700 rounded-xl transition-all">
                        Back
                    </Link>
                </div>
            </div>

            {view === 'submissions' ? (
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Left side list */}
                    <div className="w-full md:w-1/3">
                        <h3 className="text-[10px] font-bold text-gray-400 mb-4 tracking-wider uppercase">SUBMISSIONS ({submissions.length})</h3>
                        
                        {loading ? (
                            <div className="space-y-3">
                                {[1, 2, 3].map(i => <div key={i} className="h-20 bg-gray-100 rounded-xl animate-pulse"></div>)}
                            </div>
                        ) : submissions.length === 0 ? (
                            <div className="p-8 text-center bg-white rounded-2xl border border-dashed border-gray-200">
                                <p className="text-gray-400 text-sm font-medium">No pending submissions.</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {submissions.map(sub => (
                                    <div 
                                        key={sub.id} 
                                        onClick={() => setSelectedSub(sub)}
                                        className={`p-4 rounded-[1.25rem] cursor-pointer border-2 transition-all ${selectedSub?.id === sub.id ? 'bg-primary-50 border-primary-400 shadow-sm' : 'bg-white border-transparent hover:border-gray-200 shadow-sm'}`}
                                    >
                                        <div className="flex justify-between items-center mb-2">
                                            <span className={`text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md ${sub.formType === 'buyer' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'}`}>
                                                {sub.formType}
                                            </span>
                                            <span className="text-[9px] uppercase font-bold tracking-wider text-green-500">PENDING</span>
                                        </div>
                                        <h4 className="font-bold text-[15px] text-gray-900">{sub.name}</h4>
                                        <p className="text-[11px] text-gray-500">{new Date(sub.createdAt).toLocaleDateString()}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right side detail view */}
                    <div className="w-full md:w-2/3">
                        {selectedSub ? (
                            <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-50 animate-in slide-in-from-right-4 duration-300">
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10 pb-8 border-b border-gray-50">
                                    <h2 className="text-2xl font-bold text-gray-900">Submission Details</h2>
                                    <div className="flex gap-2">
                                        <button 
                                            onClick={() => handleVerify(selectedSub.id)}
                                            className="px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white text-sm font-bold rounded-xl transition-all shadow-md shadow-green-100"
                                        >
                                            Verify & Convert
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(selectedSub.id)}
                                            className="px-6 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 text-sm font-bold rounded-xl transition-all border border-red-100"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-10">
                                    <div>
                                        <h4 className="text-[10px] uppercase font-extrabold tracking-widest text-gray-400 mb-6">CUSTOMER PROFILE</h4>
                                        <div className="space-y-6">
                                            <div>
                                                <p className="text-[10px] uppercase font-extrabold tracking-widest text-gray-400 mb-1">FULL NAME</p>
                                                <p className="text-sm font-bold text-gray-900">{selectedSub.name}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] uppercase font-extrabold tracking-widest text-gray-400 mb-1">PHONE NUMBER</p>
                                                <p className="text-sm font-bold text-gray-900">{selectedSub.phone}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] uppercase font-extrabold tracking-widest text-gray-400 mb-1">EMAIL ADDRESS</p>
                                                <p className="text-sm font-bold text-gray-900">{selectedSub.email || '—'}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] uppercase font-extrabold tracking-widest text-gray-400 mb-1">WHATSAPP UPDATES</p>
                                                <p className="text-sm font-bold text-gray-900">{selectedSub.optInWhatsapp ? 'Opted In' : 'Not Opted In'}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="text-[10px] uppercase font-extrabold tracking-widest text-gray-400 mb-6">REQUEST INFO</h4>
                                        <div className="space-y-6">
                                            <div>
                                                <p className="text-[10px] uppercase font-extrabold tracking-widest text-gray-400 mb-1">FORM TYPE</p>
                                                <p className="text-sm font-bold text-gray-900 uppercase">{selectedSub.formType}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] uppercase font-extrabold tracking-widest text-gray-400 mb-1">PROPERTY TYPE</p>
                                                <p className="text-sm font-bold text-gray-900">{selectedSub.propertyType || '—'}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] uppercase font-extrabold tracking-widest text-gray-400 mb-1">BHK / BEDROOMS</p>
                                                <p className="text-sm font-bold text-gray-900">{selectedSub.bhk || '—'}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] uppercase font-extrabold tracking-widest text-gray-400 mb-1">BUDGET RANGE</p>
                                                <p className="text-sm font-bold text-gray-900">{selectedSub.budget || '—'}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gray-50 rounded-[1.5rem] p-6 border border-gray-100">
                                    <p className="text-[10px] uppercase font-extrabold tracking-widest text-gray-400 mb-2">{selectedSub.formType === 'buyer' ? 'PREFERRED AREAS' : 'PROPERTY ADDRESS'}</p>
                                    <p className="text-sm font-bold text-gray-900 leading-relaxed">{selectedSub.areas || selectedSub.propertyAddress || '—'}</p>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-white rounded-[2.5rem] p-12 text-center text-gray-400 border border-dashed border-gray-200">
                                Select a submission to view details
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in slide-in-from-bottom-4 duration-500">
                    {/* Buyer Form Card */}
                    <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-gray-100 relative group overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary-50 rounded-bl-full -mr-16 -mt-16 transition-all group-hover:scale-110"></div>
                        
                        <div className="flex items-start justify-between mb-8 relative z-10">
                            <div className="w-16 h-16 rounded-[1.5rem] bg-primary-50 flex items-center justify-center">
                                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                            </div>
                            <div className="flex gap-2">
                                <button className="p-2.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                </button>
                                <button className="p-2.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
                                </button>
                            </div>
                        </div>

                        <div className="relative z-10">
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">Buyer Onboarding Form</h3>
                            <p className="text-gray-500 text-sm mb-10 leading-relaxed">Used for potential buyers looking to find a property through Realprop Realty.</p>
                            
                            <Link href="/forms/buyer" target="_blank" className="w-full py-4 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-primary-100 transition-all mb-6">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                Open Form Editor
                            </Link>

                            <div className="text-center">
                                <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Public Link: </span>
                                <span className="text-[10px] font-bold text-primary-600">realproprealty.vercel.app/forms/buyer</span>
                            </div>
                        </div>
                    </div>

                    {/* Seller Form Card */}
                    <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-gray-100 relative group overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary-50 rounded-bl-full -mr-16 -mt-16 transition-all group-hover:scale-110"></div>
                        
                        <div className="flex items-start justify-between mb-8 relative z-10">
                            <div className="w-16 h-16 rounded-[1.5rem] bg-primary-50 flex items-center justify-center">
                                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                            </div>
                            <div className="flex gap-2">
                                <button className="p-2.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                </button>
                                <button className="p-2.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
                                </button>
                            </div>
                        </div>

                        <div className="relative z-10">
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">Seller Onboarding Form</h3>
                            <p className="text-gray-500 text-sm mb-10 leading-relaxed">Used for property owners wanting to list their property for sale/rent with a virtual tour shoot.</p>
                            
                            <Link href="/forms/seller" target="_blank" className="w-full py-4 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-primary-100 transition-all mb-6">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                Open Form Editor
                            </Link>

                            <div className="text-center">
                                <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Public Link: </span>
                                <span className="text-[10px] font-bold text-primary-600">realproprealty.vercel.app/forms/seller</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
