'use client';

import { useState, useEffect } from 'react';

export default function LeadsPage() {
    const [pendingSubmissions, setPendingSubmissions] = useState<any[]>([]);
    const [verifiedLeads, setVerifiedLeads] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('pending');
    
    // Modal state for lead details
    const [selectedLead, setSelectedLead] = useState<any | null>(null);

    const fetchData = () => {
        setLoading(true);
        fetch('/api/admin/leads')
            .then(res => res.json())
            .then(data => {
                setPendingSubmissions(data.pendingSubmissions || []);
                setVerifiedLeads(data.verifiedLeads || []);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleVerify = async (id: string) => {
        if (!confirm('Verify this submission and convert it to a Lead?')) return;
        
        try {
            const res = await fetch('/api/admin/leads/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ submissionId: id })
            });
            if (res.ok) fetchData();
            else alert('Failed to verify');
        } catch (e) {
            console.error(e);
        }
    };

    const parseJSONPayload = (jsonStr: string) => {
        try {
            return JSON.parse(jsonStr);
        } catch {
            return {};
        }
    };

    if (loading) return <div className="p-8 text-center text-gray-500">Loading leads data...</div>;

    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl">
            <div className="mb-8 flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Lead Management Dashboard</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">Review onboarding submissions and manage active leads</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex space-x-4 mb-6 border-b border-gray-200 dark:border-gray-700">
                <button 
                    onClick={() => setActiveTab('pending')}
                    className={`py-3 px-6 font-semibold border-b-2 transition-colors ${activeTab === 'pending' ? 'border-orange-500 text-orange-500' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                >
                    Pending Submissions ({pendingSubmissions.length})
                </button>
                <button 
                    onClick={() => setActiveTab('verified')}
                    className={`py-3 px-6 font-semibold border-b-2 transition-colors ${activeTab === 'verified' ? 'border-orange-500 text-orange-500' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                >
                    Verified Leads ({verifiedLeads.length})
                </button>
            </div>

            {/* Content View */}
            <div className="space-y-4">
                {activeTab === 'pending' && (
                    pendingSubmissions.length === 0 ? (
                        <div className="p-12 text-center bg-white dark:bg-gray-800 rounded-2xl text-gray-500">No pending submissions.</div>
                    ) : (
                        pendingSubmissions.map(sub => (
                            <div key={sub.id} className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${sub.formType === 'buyer' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>
                                            {sub.formType}
                                        </span>
                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">{sub.name}</h3>
                                        <span className="text-sm text-gray-500">{new Date(sub.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <p className="text-gray-600 dark:text-gray-300">
                                        <strong>Phone:</strong> {sub.phone} {sub.optInWhatsapp && <span className="text-green-500 text-xs">(WhatsApp OK)</span>}
                                    </p>
                                    <p className="text-sm text-gray-500 mt-1">
                                        {sub.formType === 'buyer' ? 
                                            `Looking for ${sub.bhk || ''} ${sub.propertyType || ''} in ${sub.areas || 'Chennai'} - Budget: ${sub.budget || 'N/A'}` : 
                                            `Selling ${sub.propertyType || 'Property'} at ${sub.propertyAddress || 'N/A'} - Expected: ${sub.budget || 'N/A'}`
                                        }
                                    </p>
                                </div>
                                <button onClick={() => handleVerify(sub.id)} className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl transition-colors shrink-0">
                                    Verify Lead
                                </button>
                            </div>
                        ))
                    )
                )}

                {activeTab === 'verified' && (
                    verifiedLeads.length === 0 ? (
                        <div className="p-12 text-center bg-white dark:bg-gray-800 rounded-2xl text-gray-500">No verified leads.</div>
                    ) : (
                        verifiedLeads.map(lead => (
                            <div key={lead.id} className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 cursor-pointer hover:border-orange-500 transition-colors" onClick={() => setSelectedLead(lead)}>
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${lead.leadType === 'buyer' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>
                                            Verified {lead.leadType}
                                        </span>
                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">{lead.name}</h3>
                                        <span className="text-sm text-gray-500">{new Date(lead.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <p className="text-gray-600 dark:text-gray-300"><strong>Contact:</strong> {lead.phone} {lead.email ? `• ${lead.email}` : ''}</p>
                                </div>
                                <button className="px-6 py-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white font-semibold rounded-lg shrink-0">
                                    View Full Details
                                </button>
                            </div>
                        ))
                    )
                )}
            </div>

            {/* Lead Details Modal */}
            {selectedLead && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center sticky top-0 bg-white dark:bg-gray-800">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Lead Payload Data</h2>
                            <button onClick={() => setSelectedLead(null)} className="text-gray-500 hover:text-gray-800 dark:hover:text-white">
                                ✕ Close
                            </button>
                        </div>
                        <div className="p-6">
                            <pre className="bg-gray-50 dark:bg-gray-900 p-4 rounded-xl text-sm text-gray-800 dark:text-gray-300 overflow-x-auto whitespace-pre-wrap">
                                {JSON.stringify(parseJSONPayload(selectedLead.message), null, 2)}
                            </pre>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}
