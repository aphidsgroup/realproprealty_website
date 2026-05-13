'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import SiteHeader from '@/components/SiteHeader';
import Link from 'next/link';

const TOTAL_STEPS = 5;

const inputCls = "w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition-all text-sm";
const labelCls = "block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2";
const radioCardCls = (active: boolean) =>
    `flex items-center gap-3 w-full px-4 py-3 rounded-xl border-2 cursor-pointer transition-all text-sm font-semibold ${active ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400' : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:border-orange-200 dark:hover:border-orange-800'}`;
const checkCardCls = (active: boolean) =>
    `flex items-center gap-3 w-full px-4 py-3 rounded-xl border-2 cursor-pointer transition-all text-sm font-semibold ${active ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400' : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:border-orange-200 dark:hover:border-orange-800'}`;

export default function BuyerOnboardingPage() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);

    // Step 1 – Contact Info
    const [buyerName, setBuyerName] = useState('');
    const [whatsapp, setWhatsapp] = useState('');
    const [email, setEmail] = useState('');
    const [buyerType, setBuyerType] = useState('');

    // Step 2 – Property Requirements
    const [purpose, setPurpose] = useState('');
    const [propertyType, setPropertyType] = useState('Apartment'); // Default to Apartment
    const [budget, setBudget] = useState('');
    const [financing, setFinancing] = useState('');

    // Step 3 – Space & Configuration
    const [bhk, setBhk] = useState<string[]>([]);
    const [minSqft, setMinSqft] = useState('');
    const [preferredFacing, setPreferredFacing] = useState<string[]>([]);
    const [furnishing, setFurnishing] = useState('');

    // Step 4 – Location & Lifestyle
    const [preferredAreas, setPreferredAreas] = useState('');
    const [timeline, setTimeline] = useState('');
    const [mustHaveAmenities, setMustHaveAmenities] = useState<string[]>([]);

    // Step 5 – Additional Details
    const [additionalNotes, setAdditionalNotes] = useState('');
    const [optInWhatsapp, setOptInWhatsapp] = useState(true);

    const isPlot = propertyType === 'Plot / Land';
    const isCommercial = propertyType === 'Commercial Space';

    const getAmenitiesOptions = () => {
        if (isPlot) {
            return [
                'Gated Community', 'Black Top Roads', 'Street Lights',
                'Water Connection', 'EB Connection', 'Corner Plot',
                'Compound Wall', 'Park Area', 'Drainage System'
            ];
        } else if (isCommercial) {
            return [
                'Power Backup', 'Visitor Parking', 'Central AC',
                'Security / CCTV', 'Lift / Elevator', 'Cafeteria / Pantry',
                'Fire Safety', 'IT Park', 'Main Road Facing'
            ];
        } else {
            return [
                'Gated Community', 'Covered Car Parking', 'Power Backup',
                'Swimming Pool', 'Gym / Fitness Centre', 'Clubhouse',
                'Security / CCTV', 'Near Metro Station', 'Vastu Compliant'
            ];
        }
    };

    const getFurnishingOptions = () => {
        if (isCommercial) {
            return ['Fully Furnished', 'Bare Shell', 'Warm Shell', 'Does Not Matter'];
        }
        return ['Fully Furnished', 'Semi-Furnished', 'Unfurnished', 'Does Not Matter'];
    };

    const toggleBhk = (item: string) =>
        setBhk(prev => prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]);
    const toggleFacing = (item: string) =>
        setPreferredFacing(prev => prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]);
    const toggleAmenity = (item: string) =>
        setMustHaveAmenities(prev => prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]);

    const nextStep = () => setStep(s => Math.min(s + 1, TOTAL_STEPS));
    const prevStep = () => setStep(s => Math.max(s - 1, 1));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const payload = {
                formType: 'buyer',
                name: buyerName,
                phone: whatsapp,
                email,
                optInWhatsapp,
                buyerType,
                propertyType,
                budget,
                areas: preferredAreas,
                timeline,
                propertyDetails: JSON.stringify({
                    purpose, financing,
                    bhk: isPlot || isCommercial ? [] : bhk,
                    minSqft, preferredFacing,
                    furnishing: isPlot ? '' : furnishing,
                    mustHaveAmenities, additionalNotes
                })
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
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Requirements Submitted!</h1>
                        <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
                            Thank you, {buyerName}. Our property experts will review your requirements and get in touch with you shortly.
                        </p>
                        <Link href="/" className="inline-flex px-8 py-4 bg-gray-900 hover:bg-black text-orange-500 font-bold rounded-xl transition-all">
                            Back to Home
                        </Link>
                    </div>
                ) : (
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
                        <div className="p-8 md:p-10 border-b border-gray-100 dark:border-gray-700 bg-gray-900 text-center relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1 bg-orange-500/20"></div>
                            <div 
                                className="absolute top-0 left-0 h-1 bg-orange-500 transition-all duration-500" 
                                style={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
                            ></div>
                            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 text-orange-500">Find Your Dream Home</h1>
                            <p className="text-gray-300">Tell us what you're looking for, and we'll match you with the best properties in Chennai.</p>
                            <p className="text-sm text-gray-500 mt-4">Step {step} of {TOTAL_STEPS}</p>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="p-8 md:p-10 space-y-8">
                            
                            {/* ── STEP 1: Contact Info ── */}
                            {step === 1 && (
                                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                                    <div>
                                        <label className={labelCls}>Full Name *</label>
                                        <input required value={buyerName} onChange={e => setBuyerName(e.target.value)} placeholder="Enter your full name" className={inputCls} />
                                    </div>
                                    <div>
                                        <label className={labelCls}>WhatsApp Number *</label>
                                        <input required type="tel" value={whatsapp} onChange={e => setWhatsapp(e.target.value)} placeholder="10-digit WhatsApp number" maxLength={10} className={inputCls} />
                                    </div>
                                    <div>
                                        <label className={labelCls}>Email Address</label>
                                        <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Enter your email" className={inputCls} />
                                    </div>
                                    <div>
                                        <label className={labelCls}>I am a... *</label>
                                        <div className="space-y-3">
                                            {['First-time Buyer', 'Upgrading Home', 'Investor'].map(t => (
                                                <label key={t} className={radioCardCls(buyerType === t)}>
                                                    <input type="radio" name="buyerType" value={t} checked={buyerType === t} onChange={() => setBuyerType(t)} className="accent-orange-500 w-4 h-4" />
                                                    {t}
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* ── STEP 2: Property Requirements ── */}
                            {step === 2 && (
                                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                                    <div>
                                        <label className={labelCls}>Purpose of Buying *</label>
                                        <div className="grid grid-cols-2 gap-3">
                                            {['Self-use', 'Investment'].map(t => (
                                                <label key={t} className={radioCardCls(purpose === t)}>
                                                    <input type="radio" name="purpose" value={t} checked={purpose === t} onChange={() => setPurpose(t)} className="accent-orange-500 w-4 h-4" />
                                                    {t}
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <label className={labelCls}>Property Type *</label>
                                        <div className="space-y-3">
                                            {['Apartment', 'Villa / Independent House', 'Plot / Land', 'Commercial Space'].map(t => (
                                                <label key={t} className={radioCardCls(propertyType === t)}>
                                                    <input type="radio" name="propType" value={t} checked={propertyType === t} onChange={() => {
                                                        setPropertyType(t);
                                                        setMustHaveAmenities([]); // Reset amenities since options change
                                                    }} className="accent-orange-500 w-4 h-4" />
                                                    {t}
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <label className={labelCls}>Budget Range *</label>
                                        <select required value={budget} onChange={e => setBudget(e.target.value)} className={inputCls}>
                                            <option value="" disabled>Select a budget range</option>
                                            <option>Under ₹50 Lakhs</option>
                                            <option>₹50 Lakhs - ₹1 Crore</option>
                                            <option>₹1 Crore - ₹2 Crores</option>
                                            <option>₹2 Crores - ₹5 Crores</option>
                                            <option>Above ₹5 Crores</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className={labelCls}>Financing Plan</label>
                                        <div className="space-y-3">
                                            {['Pre-approved Loan', 'Will Need a Loan', 'Self-funded / Cash Buyer'].map(f => (
                                                <label key={f} className={radioCardCls(financing === f)}>
                                                    <input type="radio" name="financing" value={f} checked={financing === f} onChange={() => setFinancing(f)} className="accent-orange-500 w-4 h-4" />
                                                    {f}
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* ── STEP 3: Space & Configuration ── */}
                            {step === 3 && (
                                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                                    {!isPlot && !isCommercial && (
                                        <div>
                                            <label className={labelCls}>Preferred Configuration (BHK)</label>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">You can select multiple options.</p>
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                                {['1 BHK', '2 BHK', '3 BHK', '4+ BHK'].map(b => (
                                                    <button key={b} type="button" onClick={() => toggleBhk(b)} className={`py-3 text-sm font-bold rounded-xl border-2 transition-all ${bhk.includes(b) ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400' : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-orange-200 dark:hover:border-orange-800'}`}>{b}</button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    <div>
                                        <label className={labelCls}>Minimum Size (Sq. ft.)</label>
                                        <input type="number" value={minSqft} onChange={e => setMinSqft(e.target.value)} placeholder="e.g. 1000" className={inputCls} />
                                    </div>
                                    <div>
                                        <label className={labelCls}>Preferred Facing</label>
                                        <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                                            {['North', 'South', 'East', 'West', 'Any'].map(d => (
                                                <button key={d} type="button" onClick={() => {
                                                    if(d === 'Any') {
                                                        setPreferredFacing(['Any']);
                                                    } else {
                                                        toggleFacing(d);
                                                        setPreferredFacing(prev => prev.filter(p => p !== 'Any'));
                                                    }
                                                }} className={`py-2.5 text-xs font-bold rounded-xl border-2 transition-all ${preferredFacing.includes(d) ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400' : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-orange-200 dark:hover:border-orange-800'}`}>{d}</button>
                                            ))}
                                        </div>
                                    </div>
                                    {!isPlot && (
                                        <div>
                                            <label className={labelCls}>Furnishing Preference</label>
                                            <div className="space-y-3">
                                                {getFurnishingOptions().map(f => (
                                                    <label key={f} className={radioCardCls(furnishing === f)}>
                                                        <input type="radio" name="furnish" value={f} checked={furnishing === f} onChange={() => setFurnishing(f)} className="accent-orange-500 w-4 h-4" />
                                                        {f}
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* ── STEP 4: Location & Lifestyle ── */}
                            {step === 4 && (
                                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                                    <div>
                                        <label className={labelCls}>Preferred Areas in Chennai *</label>
                                        <textarea required value={preferredAreas} onChange={e => setPreferredAreas(e.target.value)} placeholder="e.g. Adyar, OMR, Velachery, ECR..." rows={3} className={inputCls + ' resize-none'} />
                                    </div>
                                    <div>
                                        <label className={labelCls}>Timeline to Buy *</label>
                                        <div className="space-y-3">
                                            {['Immediate (0-1 months)', 'Short-term (1-3 months)', 'Medium-term (3-6 months)', 'Just exploring / Next year'].map(t => (
                                                <label key={t} className={radioCardCls(timeline === t)}>
                                                    <input type="radio" name="timeline" value={t} checked={timeline === t} onChange={() => setTimeline(t)} className="accent-orange-500 w-4 h-4" />
                                                    {t}
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <label className={labelCls}>{isCommercial ? 'Required Amenities' : 'Must-have Amenities'}</label>
                                        <div className="space-y-3">
                                            {getAmenitiesOptions().map(item => (
                                                <label key={item} className={checkCardCls(mustHaveAmenities.includes(item))}>
                                                    <input type="checkbox" checked={mustHaveAmenities.includes(item)} onChange={() => toggleAmenity(item)} className="accent-orange-500 w-4 h-4 flex-shrink-0" />
                                                    {item}
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* ── STEP 5: Final Details & Submit ── */}
                            {step === 5 && (
                                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                                    <div>
                                        <label className={labelCls}>Any Specific Requirements? (Optional)</label>
                                        <textarea value={additionalNotes} onChange={e => setAdditionalNotes(e.target.value)} placeholder={isPlot ? "e.g. Corner plot, wide roads, specific zone..." : "e.g. Pet-friendly, strictly veg, near schools, ground floor only..."} rows={4} className={inputCls + ' resize-none'} />
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <input type="checkbox" id="whatsapp" checked={optInWhatsapp} onChange={e => setOptInWhatsapp(e.target.checked)} className="w-5 h-5 text-orange-500 rounded border-gray-300 focus:ring-orange-500" />
                                        <label htmlFor="whatsapp" className="text-sm text-gray-600 dark:text-gray-400 cursor-pointer">Send me property updates on WhatsApp</label>
                                    </div>
                                    {/* Summary */}
                                    <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 space-y-3 text-sm">
                                        <p className="font-bold text-gray-900 dark:text-white mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">Review Your Preferences</p>
                                        {[
                                            ['Name', buyerName], ['WhatsApp', whatsapp], ['Email', email],
                                            ['Looking for', propertyType], ['Budget', budget],
                                            ['Areas', preferredAreas ? preferredAreas : '—'],
                                            ['Timeline', timeline || '—'],
                                            ...(isPlot || isCommercial ? [] : [['BHK', bhk.length ? bhk.join(', ') : '—']]),
                                        ].map(([k, v]) => (
                                            <div key={k as string} className="flex justify-between">
                                                <span className="text-gray-500 dark:text-gray-400">{k}</span>
                                                <span className="font-semibold text-gray-800 dark:text-gray-200 text-right max-w-[55%] truncate">{v as React.ReactNode}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Navigation Buttons */}
                            <div className="flex gap-4 pt-4 border-t border-gray-100 dark:border-gray-700 mt-8">
                                {step > 1 && (
                                    <button type="button" onClick={prevStep} className="flex-1 py-4 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-bold rounded-xl transition-all text-sm">
                                        Back
                                    </button>
                                )}
                                {step < TOTAL_STEPS ? (
                                    <button type="button" onClick={nextStep} className="flex-[2] py-4 bg-gray-900 hover:bg-black text-orange-500 font-bold rounded-xl transition-all text-sm shadow-lg">
                                        Next
                                    </button>
                                ) : (
                                    <button type="submit" disabled={submitting} className="flex-[2] py-4 bg-gray-900 hover:bg-black disabled:bg-gray-500 text-orange-500 font-bold rounded-xl transition-all text-sm shadow-lg flex items-center justify-center gap-2">
                                        {submitting ? <div className="w-5 h-5 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" /> : 'Find Properties'}
                                    </button>
                                )}
                            </div>

                        </form>
                    </div>
                )}
            </div>
        </main>
    );
}
