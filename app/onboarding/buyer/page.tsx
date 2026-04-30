'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import SiteHeader from '@/components/SiteHeader';
import Link from 'next/link';

export default function BuyerOnboardingPage() {
    const router = useRouter();
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    
    const [formData, setFormData] = useState({
        formType: 'buyer',
        name: '',
        phone: '',
        email: '',
        optInWhatsapp: true,
        buyerType: 'First-time Buyer',
        propertyType: 'Apartment',
        bhk: '2 BHK',
        budget: '₹50L - ₹1Cr',
        areas: '',
        timeline: 'Immediately'
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        
        try {
            const res = await fetch('/api/onboarding', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            
            if (!res.ok) throw new Error('Failed to submit');
            setSuccess(true);
        } catch (error) {
            console.error(error);
            alert('Something went wrong. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <main className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-24">
            <SiteHeader />
            
            <div className="container mx-auto px-4 py-8 max-w-3xl mt-8">
                {success ? (
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-12 text-center animate-fade-in">
                        <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Requirements Submitted!</h1>
                        <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
                            Thank you, {formData.name}. Our property experts will review your requirements and get in touch with you shortly.
                        </p>
                        <Link href="/" className="inline-flex px-8 py-4 bg-gray-900 hover:bg-black text-orange-500 font-bold rounded-xl transition-all">
                            Back to Home
                        </Link>
                    </div>
                ) : (
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
                        <div className="p-8 md:p-10 border-b border-gray-100 dark:border-gray-700 bg-gray-900 text-center">
                            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 text-orange-500">Find Your Dream Home</h1>
                            <p className="text-gray-300">Tell us what you're looking for, and we'll match you with the best properties in Chennai.</p>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="p-8 md:p-10 space-y-8">
                            {/* Contact Details */}
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2 mb-4">1. Contact Details</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Full Name *</label>
                                        <input required type="text" className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="John Doe" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Phone Number *</label>
                                        <input required type="tel" className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="+91 98765 43210" />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
                                        <input type="email" className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="john@example.com" />
                                    </div>
                                    <div className="md:col-span-2 flex items-center gap-3">
                                        <input type="checkbox" id="whatsapp" checked={formData.optInWhatsapp} onChange={e => setFormData({...formData, optInWhatsapp: e.target.checked})} className="w-5 h-5 text-orange-500 rounded border-gray-300 focus:ring-orange-500" />
                                        <label htmlFor="whatsapp" className="text-sm text-gray-600 dark:text-gray-400">Send me property updates on WhatsApp</label>
                                    </div>
                                </div>
                            </div>

                            {/* Property Requirements */}
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2 mb-4">2. Property Requirements</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Buyer Profile</label>
                                        <select className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none" value={formData.buyerType} onChange={e => setFormData({...formData, buyerType: e.target.value})}>
                                            <option>First-time Buyer</option>
                                            <option>Looking to Upgrade</option>
                                            <option>Investor</option>
                                            <option>NRI</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Property Type</label>
                                        <select className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none" value={formData.propertyType} onChange={e => setFormData({...formData, propertyType: e.target.value})}>
                                            <option>Apartment</option>
                                            <option>Villa / Independent House</option>
                                            <option>Plot / Land</option>
                                            <option>Commercial Office</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">BHK Preference</label>
                                        <select className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none" value={formData.bhk} onChange={e => setFormData({...formData, bhk: e.target.value})}>
                                            <option>1 BHK</option>
                                            <option>2 BHK</option>
                                            <option>3 BHK</option>
                                            <option>4+ BHK</option>
                                            <option>Not Applicable</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Budget Range</label>
                                        <select className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none" value={formData.budget} onChange={e => setFormData({...formData, budget: e.target.value})}>
                                            <option>Under ₹50 Lakhs</option>
                                            <option>₹50 Lakhs - ₹1 Crore</option>
                                            <option>₹1 Crore - ₹2 Crores</option>
                                            <option>₹2 Crores - ₹5 Crores</option>
                                            <option>Above ₹5 Crores</option>
                                        </select>
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Preferred Areas (Chennai)</label>
                                        <input type="text" className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none" value={formData.areas} onChange={e => setFormData({...formData, areas: e.target.value})} placeholder="e.g. Anna Nagar, Adyar, OMR (comma separated)" />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">When are you planning to buy?</label>
                                        <div className="flex flex-wrap gap-3">
                                            {['Immediately', 'Within 3 Months', 'Within 6 Months', 'Just Exploring'].map(option => (
                                                <label key={option} className={`px-4 py-2 rounded-full cursor-pointer border text-sm font-medium transition-colors ${formData.timeline === option ? 'bg-orange-50 border-orange-500 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' : 'bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300'}`}>
                                                    <input type="radio" name="timeline" className="hidden" checked={formData.timeline === option} onChange={() => setFormData({...formData, timeline: option})} />
                                                    {option}
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <button type="submit" disabled={submitting} className="w-full px-8 py-4 bg-gray-900 hover:bg-black disabled:bg-gray-500 text-orange-500 font-bold rounded-xl text-lg transition-all shadow-lg hover:shadow-xl mt-8">
                                {submitting ? 'Submitting...' : 'Submit Requirements'}
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </main>
    );
}
