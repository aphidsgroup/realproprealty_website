'use client';

import { useState, useEffect } from 'react';

export default function LeadCapturePopup() {
    const [show, setShow] = useState(false);
    const [step, setStep] = useState(1);
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        propertyType: '',
        bhk: '',
        budget: '',
        location: '',
        timeline: '',
    });

    useEffect(() => {
        // Check if popup was already dismissed in this session
        const dismissed = sessionStorage.getItem('leadPopupDismissed');
        if (dismissed) return;

        const timer = setTimeout(() => setShow(true), 10000); // 10 seconds
        return () => clearTimeout(timer);
    }, []);

    const handleClose = () => {
        setShow(false);
        sessionStorage.setItem('leadPopupDismissed', 'true');
    };

    const handleSubmit = async () => {
        if (!formData.name || !formData.phone) return;
        setSubmitting(true);
        try {
            await fetch('/api/leads', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...formData, source: 'popup' }),
            });
            setSubmitted(true);
            setTimeout(handleClose, 2000);
        } catch { /* */ }
        setSubmitting(false);
    };

    if (!show) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden relative">
                {/* Close button */}
                <button onClick={handleClose} className="absolute top-3 right-3 z-10 p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                {/* Header */}
                <div className="bg-gradient-to-r from-primary-500 to-primary-600 px-6 py-5 text-white">
                    <h2 className="text-xl font-bold">Find Your Dream Property</h2>
                    <p className="text-primary-100 text-sm mt-1">Tell us what you&apos;re looking for</p>
                </div>

                {submitted ? (
                    <div className="p-8 text-center">
                        <div className="text-5xl mb-3">✅</div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">Thank you!</h3>
                        <p className="text-gray-500 dark:text-gray-400">We&apos;ll get back to you shortly.</p>
                    </div>
                ) : (
                    <div className="p-6">
                        {/* Step Indicators */}
                        <div className="flex items-center gap-2 mb-5">
                            <div className={`flex-1 h-1 rounded-full ${step >= 1 ? 'bg-primary-500' : 'bg-gray-200 dark:bg-gray-700'}`} />
                            <div className={`flex-1 h-1 rounded-full ${step >= 2 ? 'bg-primary-500' : 'bg-gray-200 dark:bg-gray-700'}`} />
                        </div>

                        {step === 1 ? (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Name *</label>
                                    <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Your full name" className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">WhatsApp / Phone *</label>
                                    <input type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} placeholder="+91 98765 43210" className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Email</label>
                                    <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="you@example.com" className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
                                </div>
                                <button onClick={() => { if (formData.name && formData.phone) setStep(2); }} disabled={!formData.name || !formData.phone} className="w-full bg-gray-900 hover:bg-black text-orange-500 font-semibold py-3 rounded-xl disabled:opacity-50 transition-colors border border-gray-800">
                                    Next →
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Property Type</label>
                                    <select value={formData.propertyType} onChange={(e) => setFormData({ ...formData, propertyType: e.target.value })} className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                                        <option value="">Select type</option>
                                        <option value="Apartment">Apartment</option>
                                        <option value="Villa">Villa</option>
                                        <option value="Independent House">Independent House</option>
                                        <option value="Plot">Plot</option>
                                        <option value="Commercial">Commercial</option>
                                    </select>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">BHK</label>
                                        <select value={formData.bhk} onChange={(e) => setFormData({ ...formData, bhk: e.target.value })} className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                                            <option value="">Select</option>
                                            <option value="1 BHK">1 BHK</option>
                                            <option value="2 BHK">2 BHK</option>
                                            <option value="3 BHK">3 BHK</option>
                                            <option value="4+ BHK">4+ BHK</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Budget</label>
                                        <select value={formData.budget} onChange={(e) => setFormData({ ...formData, budget: e.target.value })} className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                                            <option value="">Select</option>
                                            <option value="Under 30L">Under 30L</option>
                                            <option value="30L - 50L">30L - 50L</option>
                                            <option value="50L - 1Cr">50L - 1Cr</option>
                                            <option value="1Cr - 2Cr">1Cr - 2Cr</option>
                                            <option value="2Cr+">2Cr+</option>
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Preferred Location</label>
                                    <input type="text" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} placeholder="e.g., OMR, ECR, Anna Nagar" className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Purchase Timeline</label>
                                    <select value={formData.timeline} onChange={(e) => setFormData({ ...formData, timeline: e.target.value })} className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                                        <option value="">Select</option>
                                        <option value="Immediately">Immediately</option>
                                        <option value="1-3 months">1-3 months</option>
                                        <option value="3-6 months">3-6 months</option>
                                        <option value="6-12 months">6-12 months</option>
                                        <option value="Just exploring">Just exploring</option>
                                    </select>
                                </div>
                                <div className="flex gap-3">
                                    <button onClick={() => setStep(1)} className="flex-1 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-semibold">← Back</button>
                                    <button onClick={handleSubmit} disabled={submitting} className="flex-1 bg-gray-900 hover:bg-black text-orange-500 font-semibold py-3 rounded-xl disabled:opacity-50 transition-colors border border-gray-800">
                                        {submitting ? 'Sending...' : 'Submit'}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
