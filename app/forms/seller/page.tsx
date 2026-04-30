'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function SellerForm() {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        optInWhatsapp: true,
        sellerType: 'Owner',
        propertyType: 'Apartment',
        bhk: '2 BHK',
        budget: '', // For seller, this is expected price
        propertyAddress: '',
        propertyDetails: ''
    });

    const handleChange = (e: any) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const nextStep = () => setStep(s => s + 1);
    const prevStep = () => setStep(s => s - 1);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch('/api/forms/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...formData, formType: 'seller' })
            });
            if (res.ok) setSubmitted(true);
        } catch (error) {
            console.error(error);
            alert('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <div className="min-h-screen bg-[#fafafa] flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-white rounded-[2rem] p-8 text-center shadow-xl shadow-primary-100/50 border border-primary-50 animate-in fade-in zoom-in duration-500">
                    <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Property Registered!</h2>
                    <p className="text-gray-500 text-sm mb-8">Thank you, {formData.name}. Our property manager will contact you shortly to schedule a 360° Virtual Tour shoot.</p>
                    <Link href="/" className="inline-block px-8 py-3 bg-primary-500 hover:bg-primary-600 text-white font-bold rounded-xl transition-all">
                        Back to Home
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#fafafa] font-sans text-gray-900 py-12 px-4">
            <div className="max-w-xl mx-auto">
                {/* Header */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center gap-2 mb-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center shadow-lg shadow-primary-100">
                            <span className="font-bold text-white text-sm">RPR</span>
                        </div>
                        <span className="font-bold text-xl tracking-tight">Realprop Realty</span>
                    </div>
                    <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Sell Your Property</h1>
                    <p className="text-gray-500 text-sm">List with us for free and get a professional 360° virtual tour shoot.</p>
                </div>

                {/* Step Indicator */}
                <div className="flex justify-between items-center mb-8 px-2">
                    {[1, 2, 3].map((s) => (
                        <div key={s} className="flex items-center flex-1 last:flex-none">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${step >= s ? 'bg-primary-500 text-white shadow-md' : 'bg-gray-200 text-gray-400'}`}>
                                {s}
                            </div>
                            {s < 3 && <div className={`flex-1 h-1 mx-2 rounded-full transition-all duration-500 ${step > s ? 'bg-primary-500' : 'bg-gray-200'}`}></div>}
                        </div>
                    ))}
                </div>

                <form onSubmit={handleSubmit} className="bg-white rounded-[2rem] p-8 shadow-xl shadow-primary-100/20 border border-gray-50 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-primary-500 opacity-10"></div>
                    
                    {step === 1 && (
                        <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                            <h2 className="text-xl font-bold text-gray-900 mb-6">Contact Information</h2>
                            <div>
                                <label className="block text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-1 ml-1">Full Name</label>
                                <input required type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Enter your full name" className="w-full px-4 py-3.5 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-primary-500 transition-all text-sm font-medium" />
                            </div>
                            <div>
                                <label className="block text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-1 ml-1">Phone Number</label>
                                <input required type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="Enter mobile number" className="w-full px-4 py-3.5 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-primary-500 transition-all text-sm font-medium" />
                            </div>
                            <div>
                                <label className="block text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-1 ml-1">Email Address (Optional)</label>
                                <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="email@example.com" className="w-full px-4 py-3.5 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-primary-500 transition-all text-sm font-medium" />
                            </div>
                            <div className="flex items-center gap-3 bg-green-50 p-4 rounded-xl border border-green-100">
                                <input type="checkbox" name="optInWhatsapp" checked={formData.optInWhatsapp} onChange={handleChange} className="w-5 h-5 text-green-500 rounded border-green-200 focus:ring-green-500" />
                                <span className="text-xs font-bold text-green-700">Receive lead updates on WhatsApp</span>
                            </div>
                            <button type="button" onClick={nextStep} className="w-full py-4 bg-primary-500 hover:bg-primary-600 text-white font-bold rounded-xl shadow-lg shadow-primary-100 transition-all mt-4">
                                Next: Property Specs
                            </button>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                            <h2 className="text-xl font-bold text-gray-900 mb-6">Property Specifications</h2>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-2 ml-1">You Are</label>
                                    <select name="sellerType" value={formData.sellerType} onChange={handleChange} className="w-full px-4 py-3.5 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-primary-500 text-sm font-bold">
                                        <option>Owner</option>
                                        <option>Agent / Broker</option>
                                        <option>Developer</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-2 ml-1">Property Type</label>
                                    <select name="propertyType" value={formData.propertyType} onChange={handleChange} className="w-full px-4 py-3.5 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-primary-500 text-sm font-bold">
                                        <option>Apartment</option>
                                        <option>Villa / House</option>
                                        <option>Plot / Land</option>
                                        <option>Commercial Office</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-2 ml-1">Configuration (BHK)</label>
                                <div className="grid grid-cols-4 gap-2">
                                    {['1 BHK', '2 BHK', '3 BHK', '4+ BHK'].map(opt => (
                                        <button key={opt} type="button" onClick={() => setFormData({...formData, bhk: opt})} className={`py-3 text-xs font-bold rounded-xl transition-all border ${formData.bhk === opt ? 'bg-primary-500 text-white border-primary-500 shadow-md' : 'bg-gray-50 text-gray-500 border-transparent hover:bg-gray-100'}`}>
                                            {opt}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="block text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-1 ml-1">Expected Price (₹)</label>
                                <input required type="text" name="budget" value={formData.budget} onChange={handleChange} placeholder="e.g., 75 Lakhs or 1.2 Crores" className="w-full px-4 py-3.5 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-primary-500 transition-all text-sm font-medium" />
                            </div>
                            <div className="flex gap-3 mt-8">
                                <button type="button" onClick={prevStep} className="flex-1 py-4 bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold rounded-xl transition-all">Back</button>
                                <button type="button" onClick={nextStep} className="flex-[2] py-4 bg-primary-500 hover:bg-primary-600 text-white font-bold rounded-xl shadow-lg shadow-primary-100 transition-all">Next: Location</button>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                            <h2 className="text-xl font-bold text-gray-900 mb-6">Location & Details</h2>
                            <div>
                                <label className="block text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-1 ml-1">Property Address / Location</label>
                                <textarea required name="propertyAddress" value={formData.propertyAddress} onChange={handleChange} placeholder="Enter detailed address or building name" rows={3} className="w-full px-4 py-3.5 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-primary-500 transition-all text-sm font-medium resize-none" />
                            </div>
                            <div>
                                <label className="block text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-1 ml-1">Additional Details (Optional)</label>
                                <textarea name="propertyDetails" value={formData.propertyDetails} onChange={handleChange} placeholder="e.g., North facing, Modular kitchen, 2 covered parking" rows={3} className="w-full px-4 py-3.5 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-primary-500 transition-all text-sm font-medium resize-none" />
                            </div>
                            <div className="flex gap-3 mt-8">
                                <button type="button" onClick={prevStep} className="flex-1 py-4 bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold rounded-xl transition-all">Back</button>
                                <button type="submit" disabled={loading} className="flex-[2] py-4 bg-primary-500 hover:bg-primary-600 text-white font-bold rounded-xl shadow-lg shadow-primary-100 transition-all flex items-center justify-center gap-2">
                                    {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : 'List My Property'}
                                </button>
                            </div>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
}
