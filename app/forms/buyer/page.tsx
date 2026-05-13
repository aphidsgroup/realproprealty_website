'use client';

import { useState } from 'react';
import Link from 'next/link';

const TOTAL_STEPS = 5;

const inputCls = "w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none text-sm font-medium text-gray-800 placeholder-gray-400 transition-all";
const labelCls = "block text-sm font-bold text-gray-700 mb-2";
const radioCardCls = (active: boolean) =>
    `flex items-center gap-3 w-full px-4 py-3 rounded-xl border-2 cursor-pointer transition-all text-sm font-semibold ${active ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-gray-200 bg-white text-gray-600 hover:border-primary-200'}`;
const checkCardCls = (active: boolean) =>
    `flex items-center gap-3 w-full px-4 py-3 rounded-xl border-2 cursor-pointer transition-all text-sm font-semibold ${active ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-gray-200 bg-white text-gray-600 hover:border-primary-200'}`;

export default function BuyerForm() {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

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
        setLoading(true);
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
            const res = await fetch('/api/forms/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (res.ok) setSubmitted(true);
            else throw new Error('Failed');
        } catch {
            alert('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <div className="min-h-screen bg-[#fafafa] flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-white rounded-3xl p-10 text-center shadow-2xl border border-gray-100">
                    <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                    </div>
                    <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Requirement Submitted!</h2>
                    <p className="text-gray-500 text-sm mb-8">Thank you, <strong>{buyerName}</strong>. Our property advisor will review your requirements and share the best matching properties shortly.</p>
                    <Link href="/" className="inline-block px-8 py-3 bg-gray-900 text-primary-500 font-bold rounded-xl transition-all hover:bg-black">
                        Back to Home
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f5f5f7] font-sans py-8 px-4">
            <div className="max-w-lg mx-auto">
                <div className="flex items-center gap-2 mb-6">
                    <img src="/logo.png" alt="Realprop Realty" className="w-9 h-9 object-contain" />
                    <div>
                        <div className="font-extrabold text-gray-900 text-[15px] leading-none">Realprop Realty</div>
                        <div className="text-[9px] font-bold text-primary-600 uppercase tracking-widest">Buyer Requirements</div>
                    </div>
                </div>

                <h1 className="text-2xl font-extrabold text-gray-900 mb-1">Find Your Perfect Property</h1>

                <div className="flex gap-1.5 mb-6">
                    {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
                        <div key={i} className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${i < step ? 'bg-primary-500' : 'bg-gray-200'}`} />
                    ))}
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="bg-white rounded-2xl shadow-md p-6 space-y-5">

                        {/* ── STEP 1: Contact Info ── */}
                        {step === 1 && (
                            <div className="space-y-5">
                                <div>
                                    <label className={labelCls}>Full Name <span className="text-red-500">*</span></label>
                                    <input required value={buyerName} onChange={e => setBuyerName(e.target.value)} placeholder="Enter your full name" className={inputCls} />
                                </div>
                                <div>
                                    <label className={labelCls}>WhatsApp Number <span className="text-red-500">*</span></label>
                                    <input required type="tel" value={whatsapp} onChange={e => setWhatsapp(e.target.value)} placeholder="10-digit WhatsApp number" maxLength={10} className={inputCls} />
                                </div>
                                <div>
                                    <label className={labelCls}>Email Address <span className="text-red-500">*</span></label>
                                    <input required type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Enter your email" className={inputCls} />
                                </div>
                                <div>
                                    <label className={labelCls}>I am a... <span className="text-red-500">*</span></label>
                                    <div className="space-y-2">
                                        {['First-time Buyer', 'Upgrading Home', 'Investor'].map(t => (
                                            <label key={t} className={radioCardCls(buyerType === t)}>
                                                <input type="radio" name="buyerType" value={t} checked={buyerType === t} onChange={() => setBuyerType(t)} className="accent-primary-500" />
                                                {t}
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ── STEP 2: Property Requirements ── */}
                        {step === 2 && (
                            <div className="space-y-5">
                                <div>
                                    <label className={labelCls}>Purpose of Buying <span className="text-red-500">*</span></label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {['Self-use', 'Investment'].map(t => (
                                            <label key={t} className={radioCardCls(purpose === t)}>
                                                <input type="radio" name="purpose" value={t} checked={purpose === t} onChange={() => setPurpose(t)} className="accent-primary-500" />
                                                {t}
                                            </label>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <label className={labelCls}>Property Type <span className="text-red-500">*</span></label>
                                    <div className="space-y-2">
                                        {['Apartment', 'Villa / Independent House', 'Plot / Land', 'Commercial Space'].map(t => (
                                            <label key={t} className={radioCardCls(propertyType === t)}>
                                                <input type="radio" name="propType" value={t} checked={propertyType === t} onChange={() => {
                                                    setPropertyType(t);
                                                    setMustHaveAmenities([]); // Reset amenities since options change
                                                }} className="accent-primary-500" />
                                                {t}
                                            </label>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <label className={labelCls}>Budget Range <span className="text-red-500">*</span></label>
                                    <select required value={budget} onChange={e => setBudget(e.target.value)} className={inputCls}>
                                        <option value="" disabled>Select a budget range</option>
                                        <option>Under 50 Lakhs</option>
                                        <option>50 Lakhs - 75 Lakhs</option>
                                        <option>75 Lakhs - 1 Crore</option>
                                        <option>1 Crore - 2 Crores</option>
                                        <option>2 Crores - 5 Crores</option>
                                        <option>Above 5 Crores</option>
                                    </select>
                                </div>
                                <div>
                                    <label className={labelCls}>Financing Plan</label>
                                    <div className="space-y-2">
                                        {['Pre-approved Loan', 'Will Need a Loan', 'Self-funded / Cash Buyer'].map(f => (
                                            <label key={f} className={radioCardCls(financing === f)}>
                                                <input type="radio" name="financing" value={f} checked={financing === f} onChange={() => setFinancing(f)} className="accent-primary-500" />
                                                {f}
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ── STEP 3: Space & Configuration ── */}
                        {step === 3 && (
                            <div className="space-y-5">
                                {!isPlot && !isCommercial && (
                                    <div>
                                        <label className={labelCls}>Preferred Configuration (BHK)</label>
                                        <p className="text-xs text-gray-500 mb-2">You can select multiple options.</p>
                                        <div className="grid grid-cols-4 gap-2">
                                            {['1 BHK', '2 BHK', '3 BHK', '4+ BHK'].map(b => (
                                                <button key={b} type="button" onClick={() => toggleBhk(b)} className={`py-3 text-xs font-bold rounded-xl border-2 transition-all ${bhk.includes(b) ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-gray-200 text-gray-500 hover:border-primary-200'}`}>{b}</button>
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
                                    <div className="grid grid-cols-4 gap-2">
                                        {['North', 'South', 'East', 'West', 'Any'].map(d => (
                                            <button key={d} type="button" onClick={() => {
                                                if(d === 'Any') {
                                                    setPreferredFacing(['Any']);
                                                } else {
                                                    toggleFacing(d);
                                                    setPreferredFacing(prev => prev.filter(p => p !== 'Any'));
                                                }
                                            }} className={`py-2.5 text-xs font-bold rounded-xl border-2 transition-all ${preferredFacing.includes(d) ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-gray-200 text-gray-500 hover:border-primary-200'}`}>{d}</button>
                                        ))}
                                    </div>
                                </div>
                                {!isPlot && (
                                    <div>
                                        <label className={labelCls}>Furnishing Preference</label>
                                        <div className="space-y-2">
                                            {getFurnishingOptions().map(f => (
                                                <label key={f} className={radioCardCls(furnishing === f)}>
                                                    <input type="radio" name="furnish" value={f} checked={furnishing === f} onChange={() => setFurnishing(f)} className="accent-primary-500" />
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
                            <div className="space-y-5">
                                <div>
                                    <label className={labelCls}>Preferred Areas in Chennai <span className="text-red-500">*</span></label>
                                    <textarea required value={preferredAreas} onChange={e => setPreferredAreas(e.target.value)} placeholder="e.g. Adyar, OMR, Velachery, ECR..." rows={3} className={inputCls + ' resize-none'} />
                                </div>
                                <div>
                                    <label className={labelCls}>Timeline to Buy <span className="text-red-500">*</span></label>
                                    <div className="space-y-2">
                                        {['Immediate (0-1 months)', 'Short-term (1-3 months)', 'Medium-term (3-6 months)', 'Just exploring / Next year'].map(t => (
                                            <label key={t} className={radioCardCls(timeline === t)}>
                                                <input type="radio" name="timeline" value={t} checked={timeline === t} onChange={() => setTimeline(t)} className="accent-primary-500" />
                                                {t}
                                            </label>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <label className={labelCls}>{isCommercial ? 'Required Amenities' : 'Must-have Amenities'}</label>
                                    <div className="space-y-2">
                                        {getAmenitiesOptions().map(item => (
                                            <label key={item} className={checkCardCls(mustHaveAmenities.includes(item))}>
                                                <input type="checkbox" checked={mustHaveAmenities.includes(item)} onChange={() => toggleAmenity(item)} className="accent-primary-500 w-4 h-4 flex-shrink-0" />
                                                {item}
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ── STEP 5: Final Details & Submit ── */}
                        {step === 5 && (
                            <div className="space-y-5">
                                <div>
                                    <label className={labelCls}>Any Specific Requirements? (Optional)</label>
                                    <textarea value={additionalNotes} onChange={e => setAdditionalNotes(e.target.value)} placeholder={isPlot ? "e.g. Corner plot, wide roads, specific zone..." : "e.g. Pet-friendly, strictly veg, near schools, ground floor only..."} rows={4} className={inputCls + ' resize-none'} />
                                </div>
                                <div className="bg-green-50 border border-green-100 rounded-xl p-4 flex items-start gap-3">
                                    <input type="checkbox" id="waCb" checked={optInWhatsapp} onChange={e => setOptInWhatsapp(e.target.checked)} className="w-5 h-5 accent-green-500 mt-0.5 flex-shrink-0" />
                                    <label htmlFor="waCb" className="text-sm text-green-800 font-medium cursor-pointer">
                                        Send me matching properties and updates on WhatsApp
                                    </label>
                                </div>
                                {/* Summary */}
                                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-2 text-sm">
                                    <p className="font-bold text-gray-700 mb-2">Review Your Preferences</p>
                                    {[
                                        ['Name', buyerName], ['WhatsApp', whatsapp], ['Email', email],
                                        ['Looking for', propertyType], ['Budget', budget],
                                        ['Areas', preferredAreas ? preferredAreas : '—'],
                                        ['Timeline', timeline || '—'],
                                        ...(isPlot || isCommercial ? [] : [['BHK', bhk.length ? bhk.join(', ') : '—']]),
                                    ].map(([k, v]) => (
                                        <div key={k as string} className="flex justify-between">
                                            <span className="text-gray-500">{k}</span>
                                            <span className="font-semibold text-gray-800 text-right max-w-[55%] truncate">{v as React.ReactNode}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Navigation Buttons */}
                        <div className="flex gap-3 pt-2">
                            {step > 1 && (
                                <button type="button" onClick={prevStep} className="flex-1 py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-all text-sm">
                                    Back
                                </button>
                            )}
                            {step < TOTAL_STEPS ? (
                                <button type="button" onClick={nextStep} className="flex-[2] py-3.5 bg-gray-900 hover:bg-black text-primary-500 font-bold rounded-xl transition-all text-sm shadow-lg">
                                    Next
                                </button>
                            ) : (
                                <button type="submit" disabled={loading} className="flex-[2] py-3.5 bg-gray-900 hover:bg-black disabled:bg-gray-500 text-primary-500 font-bold rounded-xl transition-all text-sm shadow-lg flex items-center justify-center gap-2">
                                    {loading ? <div className="w-5 h-5 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" /> : 'Find Properties'}
                                </button>
                            )}
                        </div>

                    </div>
                    <p className="text-center text-xs text-gray-400 mt-4">Step {step} of {TOTAL_STEPS} • Realprop Realty</p>
                </form>
            </div>
        </div>
    );
}
