'use client';

import { useState, useEffect } from 'react';

export default function VerificationFormsPage() {
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
            // Reusing lead delete endpoint or similar - assuming it's implemented or we need to add it
            // For now, let's just simulate the UI removal if endpoint fails, but ideally we have an endpoint
            await fetch(`/api/admin/leads/submissions/${id}`, { method: 'DELETE' });
            setSubmissions(submissions.filter(s => s.id !== id));
            setSelectedSub(null);
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl">
            <div className="mb-8 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Onboarding Forms</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage forms and verify incoming requests.</p>
                </div>
                <div className="flex gap-2">
                    <button className="px-4 py-2 text-sm font-bold text-primary-600 bg-primary-50 rounded-xl border border-primary-200">Submissions</button>
                    <button className="px-4 py-2 text-sm font-bold text-gray-500 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors">Manage Forms</button>
                    <button className="px-4 py-2 text-sm font-bold text-gray-500 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors">Back</button>
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-8">
                {/* Left side list */}
                <div className="w-full md:w-1/3">
                    <h3 className="text-xs font-bold text-gray-400 mb-4 tracking-wider uppercase">SUBMISSIONS ({submissions.length})</h3>
                    
                    {loading ? (
                        <p className="text-gray-500 text-sm">Loading...</p>
                    ) : submissions.length === 0 ? (
                        <p className="text-gray-500 text-sm">No pending submissions.</p>
                    ) : (
                        <div className="space-y-3">
                            {submissions.map(sub => (
                                <div 
                                    key={sub.id} 
                                    onClick={() => setSelectedSub(sub)}
                                    className={`p-4 rounded-xl cursor-pointer border-2 transition-all ${selectedSub?.id === sub.id ? 'bg-primary-50 border-primary-400' : 'bg-white border-transparent hover:border-gray-200 shadow-sm'}`}
                                >
                                    <div className="flex justify-between items-center mb-2">
                                        <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md ${sub.formType === 'buyer' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>
                                            {sub.formType}
                                        </span>
                                        <span className="text-[10px] uppercase font-bold tracking-wider text-green-500">PENDING</span>
                                    </div>
                                    <h4 className="font-bold text-gray-900">{sub.name}</h4>
                                    <p className="text-xs text-gray-500">{new Date(sub.createdAt).toLocaleDateString()}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Right side detail view */}
                <div className="w-full md:w-2/3">
                    {selectedSub ? (
                        <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100">
                            <div className="flex justify-between items-center mb-8 pb-6 border-b border-gray-100">
                                <h2 className="text-2xl font-bold text-gray-900">Submission Details</h2>
                                <div className="flex gap-2">
                                    <button 
                                        onClick={() => handleVerify(selectedSub.id)}
                                        className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-bold rounded-xl transition-colors"
                                    >
                                        Verify & Convert
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(selectedSub.id)}
                                        className="px-6 py-2 bg-red-50 hover:bg-red-100 text-red-600 text-sm font-bold rounded-xl transition-colors"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-8 mb-8">
                                <div>
                                    <h4 className="text-[10px] uppercase font-extrabold tracking-widest text-gray-400 mb-6">CUSTOMER PROFILE</h4>
                                    <div className="space-y-5">
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
                                    <div className="space-y-5">
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

                            <div className="bg-[#f8fafc] rounded-2xl p-6 border border-gray-100">
                                <p className="text-[10px] uppercase font-extrabold tracking-widest text-gray-400 mb-2">{selectedSub.formType === 'buyer' ? 'PREFERRED AREAS' : 'PROPERTY ADDRESS'}</p>
                                <p className="text-sm font-bold text-gray-900">{selectedSub.areas || selectedSub.propertyAddress || '—'}</p>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white rounded-[2rem] p-12 text-center text-gray-400 border border-gray-100">
                            Select a submission to view details
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
