'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import SiteHeader from '@/components/SiteHeader';
import Link from 'next/link';

export default function SellerOnboardingPage() {
    const router = useRouter();
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    
    // Core fields
    const [formData, setFormData] = useState({
        formType: 'seller',
        name: '',
        phone: '',
        email: '',
        optInWhatsapp: true,
        sellerType: 'Owner',
        propertyType: 'Apartment',
        propertyAddress: '',
        budget: '', // representing expected price
    });

    // Custom JSON spec fields
    const [specs, setSpecs] = useState({
        ageOfProperty: '',
        furnishing: 'Unfurnished',
        facing: '',
        amenities: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        
        try {
            const payload = {
                ...formData,
                propertyDetails: specs // This will be JSON stringified in the API
            };

            const res = await fetch('/api/onboarding', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
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
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Property Submitted!</h1>
                        <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
                            Thank you, {formData.name}. Our team will review your property details and contact you shortly to arrange a 360° virtual tour shoot.
                        </p>
                        <Link href="/" className="inline-flex px-8 py-4 bg-gray-900 hover:bg-black text-orange-500 font-bold rounded-xl transition-all">
                            Back to Home
                        </Link>
                    </div>
                ) : (
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
                        <div className="p-8 md:p-10 border-b border-gray-100 dark:border-gray-700 bg-gray-900 text-center">
                            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 text-orange-500">List Your Property</h1>
                            <p className="text-gray-300">Showcase your property with an immersive 360° Virtual Tour and reach qualified buyers.</p>
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
                                        <label htmlFor="whatsapp" className="text-sm text-gray-600 dark:text-gray-400">Receive lead alerts on WhatsApp</label>
                                    </div>
                                </div>
                            </div>

                            {/* Property Details */}
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2 mb-4">2. Property Overview</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">I am the...</label>
                                        <select className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none" value={formData.sellerType} onChange={e => setFormData({...formData, sellerType: e.target.value})}>
                                            <option>Owner</option>
                                            <option>Agent / Broker</option>
                                            <option>Builder</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Property Type</label>
                                        <select className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none" value={formData.propertyType} onChange={e => setFormData({...formData, propertyType: e.target.value})}>
                                            <option>Apartment</option>
                                            <option>Villa / Independent House</option>
                                            <option>Plot / Land</option>
                                            <option>Commercial Space</option>
                                        </select>
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Exact Property Address *</label>
                                        <textarea required rows={2} className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none" value={formData.propertyAddress} onChange={e => setFormData({...formData, propertyAddress: e.target.value})} placeholder="Include Door No, Street, and Area..." />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Expected Sale Price (₹) *</label>
                                        <input required type="text" className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none" value={formData.budget} onChange={e => setFormData({...formData, budget: e.target.value})} placeholder="e.g. 75,00,000" />
                                    </div>
                                </div>
                            </div>

                            {/* Detailed Specifications */}
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2 mb-4">3. Specifications</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Age of Property</label>
                                        <input type="text" className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none" value={specs.ageOfProperty} onChange={e => setSpecs({...specs, ageOfProperty: e.target.value})} placeholder="e.g. New, 1-5 Years, 10+ Years" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Furnishing Status</label>
                                        <select className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none" value={specs.furnishing} onChange={e => setSpecs({...specs, furnishing: e.target.value})}>
                                            <option>Unfurnished</option>
                                            <option>Semi-Furnished</option>
                                            <option>Fully Furnished</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Facing (e.g. North, East)</label>
                                        <input type="text" className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none" value={specs.facing} onChange={e => setSpecs({...specs, facing: e.target.value})} placeholder="e.g. North Facing" />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Key Amenities or USPs</label>
                                        <textarea rows={2} className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none" value={specs.amenities} onChange={e => setSpecs({...specs, amenities: e.target.value})} placeholder="e.g. Covered Car Parking, Gym, Near Metro Station..." />
                                    </div>
                                </div>
                            </div>

                            <button type="submit" disabled={submitting} className="w-full px-8 py-4 bg-gray-900 hover:bg-black disabled:bg-gray-500 text-orange-500 font-bold rounded-xl text-lg transition-all shadow-lg hover:shadow-xl mt-8">
                                {submitting ? 'Submitting...' : 'Submit Property for Review'}
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </main>
    );
}
