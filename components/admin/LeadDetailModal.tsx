import { useState } from 'react';

export default function LeadDetailModal({ lead, onClose, onUpdateStatus, onDelete }: any) {
    if (!lead) return null;

    // Parse the stored JSON payload
    let details: any = {};
    try {
        details = JSON.parse(lead.message);
    } catch (e) {
        console.error("Failed to parse lead message JSON", e);
    }

    const isSeller = lead.leadType === 'seller';
    const title = isSeller ? (details.propertyType || 'Property Sale Lead') : lead.name;

    // Contact pills
    const contactLinks = (
        <div className="flex gap-2 mb-6">
            <a href={`tel:${lead.phone}`} className="flex items-center gap-2 px-3 py-1.5 bg-yellow-50 text-yellow-700 font-bold text-sm rounded-full border border-yellow-200 hover:bg-yellow-100 transition">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                {lead.phone}
            </a>
            <a href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-700 font-bold text-sm rounded-full border border-green-200 hover:bg-green-100 transition">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                WhatsApp
            </a>
            {lead.email && (
                <a href={`mailto:${lead.email}`} className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 text-gray-700 font-bold text-sm rounded-full border border-gray-200 hover:bg-gray-100 transition">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                    {lead.email}
                </a>
            )}
        </div>
    );

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-[2rem] shadow-2xl max-w-4xl w-full max-h-[95vh] overflow-y-auto flex flex-col">
                
                {/* Top Action Bar */}
                <div className="p-4 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10 rounded-t-[2rem]">
                    <div className="flex items-center gap-4">
                        <select 
                            value={lead.status} 
                            onChange={(e) => onUpdateStatus(lead.id, e.target.value)}
                            className="bg-white border border-gray-200 text-gray-700 text-sm font-bold rounded-lg px-3 py-2 shadow-sm appearance-none outline-none focus:border-yellow-500 cursor-pointer"
                        >
                            <option value="new">New</option>
                            <option value="contacted">Contacted</option>
                            <option value="follow_up">Follow Up</option>
                            <option value="visit_scheduled">Visit Scheduled</option>
                            <option value="visit_done">Visit Done</option>
                            <option value="negotiation">Negotiation</option>
                            <option value="closed_won">Closed Won</option>
                        </select>
                    </div>
                    
                    <div className="flex items-center gap-3">
                        <button className="flex items-center gap-1 text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                            Edit
                        </button>
                        <button className="flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
                            Move
                        </button>
                        <button onClick={() => onDelete(lead.id)} className="flex items-center gap-1 text-sm font-semibold text-red-600 hover:text-red-800 transition-colors">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                            Delete
                        </button>
                        <div className="w-px h-6 bg-gray-200 mx-1"></div>
                        <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-800 transition-colors rounded-full hover:bg-gray-100">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>
                </div>

                <div className="p-8">
                    {/* Header Section */}
                    <div className="flex justify-between items-start mb-4">
                        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">{title}</h1>
                        <span className="px-3 py-1 bg-[#f1f5f9] text-gray-500 text-[10px] uppercase font-bold tracking-wider rounded-md border border-gray-200">
                            ONBOARDING FORM
                        </span>
                    </div>

                    {contactLinks}

                    {/* Summary Columns */}
                    <div className="grid grid-cols-2 gap-8 mb-8 border-b border-gray-100 pb-8">
                        <div>
                            <h4 className="text-[10px] uppercase font-extrabold tracking-widest text-gray-400 mb-4">{isSeller ? 'PROPERTY DETAILS' : 'REQUIREMENTS'}</h4>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-[10px] uppercase font-extrabold tracking-widest text-gray-400 mb-1">{isSeller ? 'ADDRESS' : 'PREFERRED AREA'}</p>
                                    <p className="text-sm font-bold text-gray-900">{isSeller ? (details.propertyAddress || 'N/A') : (details.areas || 'N/A')}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] uppercase font-extrabold tracking-widest text-gray-400 mb-1">{isSeller ? 'PROPERTY TYPE' : 'BHK / TYPE'}</p>
                                    <p className="text-sm font-bold text-gray-900">{isSeller ? (details.propertyType || 'N/A') : (details.bhk ? `${details.bhk} ${details.propertyType || ''}` : 'N/A')}</p>
                                </div>
                            </div>
                        </div>
                        <div>
                            <h4 className="text-[10px] uppercase font-extrabold tracking-widest text-gray-400 mb-4">FINANCIALS & TIMING</h4>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-[10px] uppercase font-extrabold tracking-widest text-gray-400 mb-1">{isSeller ? 'EXPECTED PRICE' : 'BUDGET RANGE'}</p>
                                    <p className="text-sm font-bold text-gray-900">{details.budget || 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] uppercase font-extrabold tracking-widest text-gray-400 mb-1">FOLLOW-UP DATE</p>
                                    <p className="text-sm font-bold text-orange-500">—</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Original Requirements List */}
                    <div className="mb-8">
                        <h4 className="text-[10px] uppercase font-extrabold tracking-widest text-gray-400 mb-4">ORIGINAL MESSAGE / REQUIREMENTS</h4>
                        <div className="bg-[#f9fafb] border border-gray-100 rounded-3xl p-6">
                            <h3 className="text-sm font-bold text-gray-900 mb-4">Onboarding Details</h3>
                            
                            <div className="space-y-3">
                                {Object.entries(details).map(([key, value]) => {
                                    if (typeof value === 'boolean') value = value ? 'Yes' : 'No';
                                    if (!value) return null;
                                    
                                    return (
                                        <div key={key} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                                            <p className="text-[10px] uppercase font-extrabold tracking-widest text-gray-400 mb-1">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                                            <p className="text-sm font-bold text-gray-900">{String(value)}</p>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Internal Notes */}
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <h4 className="text-[10px] uppercase font-extrabold tracking-widest text-gray-400">INTERNAL NOTES</h4>
                            <button className="flex items-center gap-1 px-3 py-1.5 bg-yellow-50 text-yellow-700 hover:bg-yellow-100 font-bold text-[11px] rounded-lg transition-colors">
                                + Add Note
                            </button>
                        </div>
                        <div className="border border-dashed border-gray-200 rounded-2xl p-8 text-center bg-[#fafafa]">
                            <p className="text-sm text-gray-400 italic">No internal notes added yet.</p>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
