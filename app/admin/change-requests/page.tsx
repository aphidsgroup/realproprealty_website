'use client';

import { useState, useEffect } from 'react';

export default function ChangeRequestsPage() {
    const [requests, setRequests] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = () => {
        setLoading(true);
        fetch('/api/admin/change-requests')
            .then(res => res.json())
            .then(data => {
                setRequests(data.requests || []);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleAction = async (id: string, action: 'approve' | 'reject') => {
        if (!confirm(`Are you sure you want to ${action} this request?`)) return;
        
        try {
            const res = await fetch(`/api/admin/change-requests/${id}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action })
            });
            if (res.ok) {
                fetchData();
            } else {
                const data = await res.json();
                alert(`Failed: ${data.error}`);
            }
        } catch (e) {
            console.error(e);
            alert('An error occurred');
        }
    };

    const parseChanges = (changes: string) => {
        try {
            return JSON.stringify(JSON.parse(changes), null, 2);
        } catch {
            return changes;
        }
    };

    if (loading) return <div className="p-8 text-center text-gray-500">Loading change requests...</div>;

    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl">
            <div className="mb-8 flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Change Requests</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">Review and approve modifications requested by Managers</p>
                </div>
            </div>

            <div className="space-y-6">
                {requests.length === 0 ? (
                    <div className="p-12 text-center bg-white dark:bg-gray-800 rounded-2xl text-gray-500">No pending change requests.</div>
                ) : (
                    requests.map(req => (
                        <div key={req.id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                            <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gray-50 dark:bg-gray-900/50">
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${req.type === 'delete_property' ? 'bg-red-100 text-red-700' : 'bg-primary-100 text-primary-700'}`}>
                                            {req.type.replace('_', ' ')}
                                        </span>
                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">{req.entityTitle}</h3>
                                    </div>
                                    <p className="text-gray-600 dark:text-gray-400 text-sm">Requested on {new Date(req.createdAt).toLocaleDateString()} • Reason: {req.reason}</p>
                                </div>
                                <div className="flex gap-3 shrink-0">
                                    <button onClick={() => handleAction(req.id, 'reject')} className="px-6 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-bold rounded-xl transition-colors">
                                        Reject
                                    </button>
                                    <button onClick={() => handleAction(req.id, 'approve')} className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl transition-colors">
                                        Approve
                                    </button>
                                </div>
                            </div>
                            <div className="p-6">
                                <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">Proposed Changes (JSON Payload)</h4>
                                <pre className="bg-gray-100 dark:bg-gray-900 p-4 rounded-xl text-sm text-gray-800 dark:text-gray-300 overflow-x-auto whitespace-pre-wrap">
                                    {parseChanges(req.changes)}
                                </pre>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
