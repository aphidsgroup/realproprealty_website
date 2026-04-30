'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import LeadDetailModal from './LeadDetailModal';

export default function LeadsView({ type }: { type: 'seller' | 'buyer' }) {
    const [leads, setLeads] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedLead, setSelectedLead] = useState<any | null>(null);
    const [statusFilter, setStatusFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    const fetchData = () => {
        setLoading(true);
        fetch('/api/admin/leads')
            .then(res => res.json())
            .then(data => {
                // The API currently returns verifiedLeads. We need to filter by type.
                const allLeads = data.verifiedLeads || [];
                setLeads(allLeads.filter((l: any) => l.leadType === type));
                setLoading(false);
            })
            .catch(() => setLoading(false));
    };

    useEffect(() => {
        fetchData();
    }, [type]);

    const handleUpdateStatus = async (id: string, newStatus: string) => {
        try {
            await fetch(`/api/admin/leads/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });
            
            setLeads(leads.map(l => l.id === id ? { ...l, status: newStatus } : l));
            if (selectedLead?.id === id) {
                setSelectedLead({ ...selectedLead, status: newStatus });
            }
        } catch (e) {
            console.error(e);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this lead?')) return;
        try {
            await fetch(`/api/admin/leads/${id}`, { method: 'DELETE' });
            setLeads(leads.filter(l => l.id !== id));
            setSelectedLead(null);
        } catch (e) {
            console.error(e);
        }
    };

    const statuses = [
        { id: 'all', label: 'All', count: leads.length, color: 'bg-slate-900 text-white' },
        { id: 'new', label: 'New', count: leads.filter(l => l.status === 'new').length, color: 'bg-blue-100 text-blue-800' },
        { id: 'contacted', label: 'Contacted', count: leads.filter(l => l.status === 'contacted').length, color: 'bg-yellow-100 text-yellow-800' },
        { id: 'follow_up', label: 'Follow Up', count: leads.filter(l => l.status === 'follow_up').length, color: 'bg-orange-100 text-orange-800' },
        { id: 'visit_scheduled', label: 'Visit Scheduled', count: leads.filter(l => l.status === 'visit_scheduled').length, color: 'bg-purple-100 text-purple-800' },
        { id: 'visit_done', label: 'Visit Done', count: leads.filter(l => l.status === 'visit_done').length, color: 'bg-indigo-100 text-indigo-800' },
        { id: 'negotiation', label: 'Negotiation', count: leads.filter(l => l.status === 'negotiation').length, color: 'bg-orange-50 text-orange-700' },
        { id: 'closed_won', label: 'Closed Won', count: leads.filter(l => l.status === 'closed_won').length, color: 'bg-green-100 text-green-800' },
    ];

    const filteredLeads = leads.filter(l => {
        const matchesStatus = statusFilter === 'all' || l.status === statusFilter;
        const matchesSearch = l.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              l.phone.includes(searchQuery) ||
                              (l.email && l.email.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesStatus && matchesSearch;
    });

    return (
        <div className="container mx-auto px-4 py-8 max-w-5xl">
            {/* Header Area */}
            <div className="mb-6">
                <Link href="/admin" className="text-sm font-semibold text-yellow-600 hover:text-yellow-700 mb-2 inline-block">← Back</Link>
                <div className="flex justify-between items-end">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">{type === 'seller' ? 'Seller Leads (Supply)' : 'Buyer Leads (Demand)'}</h1>
                        <p className="text-sm text-gray-500 mt-1">{leads.length} lead{leads.length !== 1 ? 's' : ''}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                        <div className="flex gap-2">
                            <button className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl text-sm font-bold transition-colors">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                                Export CSV
                            </button>
                            <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-bold transition-colors">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                                Import Sheet
                            </button>
                        </div>
                        <Link 
                            href={type === 'buyer' ? '/forms/buyer' : '/forms/seller'}
                            className="flex items-center gap-2 bg-gray-900 hover:bg-black text-white px-8 py-2 rounded-xl text-sm font-bold transition-colors w-full justify-center"
                        >
                            + Add Lead
                        </Link>
                    </div>
                </div>
            </div>

            {/* Search Bar */}
            <div className="flex gap-3 mb-6">
                <input 
                    type="text" 
                    placeholder="Search name, phone, area..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 shadow-sm"
                />
                <button className="bg-gray-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-black transition-colors">Go</button>
            </div>

            {/* Status Tabs */}
            <div className="flex flex-wrap gap-2 mb-8">
                {statuses.map(s => (
                    <button 
                        key={s.id}
                        onClick={() => setStatusFilter(s.id)}
                        className={`px-4 py-1.5 rounded-full text-xs font-bold transition-colors ${s.id === 'all' && statusFilter !== 'all' ? 'bg-gray-100 text-gray-800' : (statusFilter === s.id ? s.color : 'bg-[#f8fafc] text-gray-600 hover:bg-gray-100')}`}
                    >
                        {s.label} ({s.count})
                    </button>
                ))}
            </div>

            {/* Leads List */}
            <div className="space-y-4">
                {loading ? (
                    <div className="text-center py-12 text-gray-500 font-medium">Loading leads...</div>
                ) : filteredLeads.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-3xl border border-gray-100 text-gray-500 shadow-sm">No leads found.</div>
                ) : (
                    filteredLeads.map(lead => {
                        let details: any = {};
                        try { details = JSON.parse(lead.message); } catch(e) {}
                        
                        // Parse status for color
                        const statusObj = statuses.find(s => s.id === lead.status) || statuses[1];
                        
                        return (
                            <div 
                                key={lead.id} 
                                onClick={() => setSelectedLead(lead)}
                                className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100 hover:border-yellow-300 hover:shadow-md transition-all cursor-pointer relative group"
                            >
                                {/* Delete button appears on hover in top right */}
                                <button 
                                    onClick={(e) => { e.stopPropagation(); handleDelete(lead.id); }}
                                    className="absolute top-6 right-6 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                </button>

                                <div className="flex items-center gap-2 mb-4">
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${statusObj.color}`}>
                                        {statusObj.label}
                                    </span>
                                    <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase bg-[#f1f5f9] text-gray-500">
                                        Onboarding Form
                                    </span>
                                </div>

                                <h3 className="text-xl font-bold text-gray-900 mb-1">{type === 'seller' ? (details.propertyType || lead.name) : lead.name}</h3>
                                <p className="text-gray-500 text-sm font-medium mb-6">{lead.phone}</p>

                                <div className="grid grid-cols-3 gap-4 border-t border-gray-100 pt-4">
                                    {type === 'seller' ? (
                                        <>
                                            <div>
                                                <p className="text-[10px] uppercase font-extrabold tracking-widest text-gray-400 mb-1">PROPERTY INFO</p>
                                                <p className="text-sm font-bold text-gray-900">{details.propertyType || 'N/A'}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] uppercase font-extrabold tracking-widest text-gray-400 mb-1">EXPECTED PRICE</p>
                                                <p className="text-sm font-bold text-gray-900">{details.budget || 'N/A'}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] uppercase font-extrabold tracking-widest text-gray-400 mb-1">LOCATION</p>
                                                <p className="text-sm font-bold text-gray-900 truncate">{details.propertyAddress || details.areas || 'N/A'}</p>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div>
                                                <p className="text-[10px] uppercase font-extrabold tracking-widest text-gray-400 mb-1">REQUIREMENT</p>
                                                <p className="text-sm font-bold text-gray-900">{details.bhk ? `${details.bhk} ${details.propertyType || ''}` : 'N/A'}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] uppercase font-extrabold tracking-widest text-gray-400 mb-1">BUDGET</p>
                                                <p className="text-sm font-bold text-green-600">{details.budget || 'N/A'}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] uppercase font-extrabold tracking-widest text-gray-400 mb-1">PREFERRED AREA</p>
                                                <p className="text-sm font-bold text-gray-900 truncate">{details.areas || 'N/A'}</p>
                                            </div>
                                        </>
                                    )}
                                </div>

                                <div className="mt-4 flex items-center text-xs text-gray-400 font-medium">
                                    <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                    LEAD CREATED ON {new Date(lead.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }).toUpperCase()}
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {selectedLead && (
                <LeadDetailModal 
                    lead={selectedLead} 
                    onClose={() => setSelectedLead(null)} 
                    onUpdateStatus={handleUpdateStatus}
                    onDelete={handleDelete}
                />
            )}
        </div>
    );
}
