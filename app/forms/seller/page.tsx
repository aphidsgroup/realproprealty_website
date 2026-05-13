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

export default function SellerForm() {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    // Step 1 – Owner Info
    const [ownerName, setOwnerName] = useState('');
    const [whatsapp, setWhatsapp] = useState('');
    const [email, setEmail] = useState('');
    const [propertyAddress, setPropertyAddress] = useState('');
    const [propertyType, setPropertyType] = useState('');

    // Step 2 – Property Specs
    const [saleType, setSaleType] = useState(''); // Outright Sale / Lease / Both
    const [sizeSqft, setSizeSqft] = useState('');
    const [bhk, setBhk] = useState('');
    const [bathrooms, setBathrooms] = useState('');
    const [parkingType, setParkingType] = useState(''); // Covered / Open / None
    const [parkingCount, setParkingCount] = useState('');
    const [expectedPrice, setExpectedPrice] = useState('');
    const [isNegotiable, setIsNegotiable] = useState('');

    // Step 3 – Property Condition
    const [ageOfProperty, setAgeOfProperty] = useState('');
    const [furnishing, setFurnishing] = useState('');
    const [facing, setFacing] = useState('');
    const [floorNo, setFloorNo] = useState('');
    const [totalFloors, setTotalFloors] = useState('');
    const [constructionStatus, setConstructionStatus] = useState('');
    const [possessionDate, setPossessionDate] = useState('');

    // Step 4 – Amenities & Preferences
    const [amenities, setAmenities] = useState<string[]>([]);
    const [preferredBuyer, setPreferredBuyer] = useState<string[]>([]);
    const [loanEligible, setLoanEligible] = useState('');

    // Step 5 – Additional Details
    const [additionalNotes, setAdditionalNotes] = useState('');
    const [optInWhatsapp, setOptInWhatsapp] = useState(true);

    const toggleAmenity = (item: string) =>
        setAmenities(prev => prev.includes(item) ? prev.filter(a => a !== item) : [...prev, item]);
    const toggleBuyer = (item: string) =>
        setPreferredBuyer(prev => prev.includes(item) ? prev.filter(b => b !== item) : [...prev, item]);

    const nextStep = () => setStep(s => Math.min(s + 1, TOTAL_STEPS));
    const prevStep = () => setStep(s => Math.max(s - 1, 1));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const payload = {
                formType: 'seller',
                name: ownerName,
                phone: whatsapp,
                email,
                optInWhatsapp,
                sellerType: 'Owner',
                propertyType,
                propertyAddress,
                budget: expectedPrice,
                propertyDetails: JSON.stringify({
                    saleType, sizeSqft, bhk, bathrooms,
                    parkingType, parkingCount, isNegotiable,
                    ageOfProperty, furnishing, facing, floorNo, totalFloors,
                    constructionStatus, possessionDate,
                    amenities, preferredBuyer, loanEligible, additionalNotes,
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
                    <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Property Registered!</h2>
                    <p className="text-gray-500 text-sm mb-8">Thank you, <strong>{ownerName}</strong>. Our property manager will contact you shortly to schedule a 360° Virtual Tour shoot.</p>
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
                {/* Logo Header */}
                <div className="flex items-center gap-2 mb-6">
                    <img src="/logo.png" alt="Realprop Realty" className="w-9 h-9 object-contain" />
                    <div>
                        <div className="font-extrabold text-gray-900 text-[15px] leading-none">Realprop Realty</div>
                        <div className="text-[9px] font-bold text-primary-600 uppercase tracking-widest">Property Onboarding</div>
                    </div>
                </div>

                {/* Title */}
                <h1 className="text-2xl font-extrabold text-gray-900 mb-1">Property Onboarding Form</h1>

                {/* Progress Bar */}
                <div className="flex gap-1.5 mb-6">
                    {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
                        <div key={i} className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${i < step ? 'bg-primary-500' : 'bg-gray-200'}`} />
                    ))}
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="bg-white rounded-2xl shadow-md p-6 space-y-5">

                        {/* ── STEP 1: Owner & Property Info ── */}
                        {step === 1 && (
                            <div className="space-y-5">
                                <div>
                                    <label className={labelCls}>Owner Name <span className="text-red-500">*</span></label>
                                    <input required value={ownerName} onChange={e => setOwnerName(e.target.value)} placeholder="Enter your full name" className={inputCls} />
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
                                    <label className={labelCls}>Exact Property Address <span className="text-red-500">*</span></label>
                                    <textarea required value={propertyAddress} onChange={e => setPropertyAddress(e.target.value)} placeholder="Enter the full address including landmark" rows={3} className={inputCls + ' resize-none'} />
                                </div>
                                <div>
                                    <label className={labelCls}>Property Type <span className="text-red-500">*</span></label>
                                    <div className="space-y-2">
                                        {['Apartment', 'Villa / Independent House', 'Plot / Land', 'Commercial Space', 'Row House / Townhouse'].map(t => (
                                            <label key={t} className={radioCardCls(propertyType === t)}>
                                                <input type="radio" name="propType" value={t} checked={propertyType === t} onChange={() => setPropertyType(t)} className="accent-primary-500" />
                                                {t}
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ── STEP 2: Pricing & Specs ── */}
                        {step === 2 && (
                            <div className="space-y-5">
                                <div>
                                    <label className={labelCls}>Purpose of Sale <span className="text-red-500">*</span></label>
                                    <div className="space-y-2">
                                        {['Outright Sale', 'Lease / Rent', 'Both Sale & Lease'].map(t => (
                                            <label key={t} className={radioCardCls(saleType === t)}>
                                                <input type="radio" name="saleType" value={t} checked={saleType === t} onChange={() => setSaleType(t)} className="accent-primary-500" />
                                                {t}
                                            </label>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <label className={labelCls}>Total Square Feet <span className="text-red-500">*</span></label>
                                    <input required type="number" value={sizeSqft} onChange={e => setSizeSqft(e.target.value)} placeholder="Enter area in sq ft" className={inputCls} />
                                </div>
                                <div>
                                    <label className={labelCls}>Configuration (BHK)</label>
                                    <div className="grid grid-cols-4 gap-2">
                                        {['1 BHK', '2 BHK', '3 BHK', '4+ BHK'].map(b => (
                                            <button key={b} type="button" onClick={() => setBhk(b)} className={`py-3 text-xs font-bold rounded-xl border-2 transition-all ${bhk === b ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-gray-200 text-gray-500 hover:border-primary-200'}`}>{b}</button>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <label className={labelCls}>Number of Bathrooms</label>
                                    <div className="grid grid-cols-4 gap-2">
                                        {['1', '2', '3', '4+'].map(b => (
                                            <button key={b} type="button" onClick={() => setBathrooms(b)} className={`py-3 text-xs font-bold rounded-xl border-2 transition-all ${bathrooms === b ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-gray-200 text-gray-500 hover:border-primary-200'}`}>{b}</button>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <label className={labelCls}>Parking Type <span className="text-red-500">*</span></label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {['Covered', 'Open', 'None'].map(p => (
                                            <label key={p} className={radioCardCls(parkingType === p)}>
                                                <input type="radio" name="parking" value={p} checked={parkingType === p} onChange={() => setParkingType(p)} className="accent-primary-500" />
                                                {p}
                                            </label>
                                        ))}
                                    </div>
                                </div>
                                {parkingType !== 'None' && (
                                    <div>
                                        <label className={labelCls}>Number of Car Parkings</label>
                                        <input type="number" value={parkingCount} onChange={e => setParkingCount(e.target.value)} placeholder="e.g. 1, 2" className={inputCls} />
                                    </div>
                                )}
                                <div>
                                    <label className={labelCls}>Expected Sale Price (₹) <span className="text-red-500">*</span></label>
                                    <input required type="text" value={expectedPrice} onChange={e => setExpectedPrice(e.target.value)} placeholder="e.g. 75,00,000 or 1.2 Crores" className={inputCls} />
                                </div>
                                <div>
                                    <label className={labelCls}>Is Price Negotiable? <span className="text-red-500">*</span></label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {['Yes', 'No'].map(v => (
                                            <label key={v} className={radioCardCls(isNegotiable === v)}>
                                                <input type="radio" name="nego" value={v} checked={isNegotiable === v} onChange={() => setIsNegotiable(v)} className="accent-primary-500" />
                                                {v}
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ── STEP 3: Property Condition ── */}
                        {step === 3 && (
                            <div className="space-y-5">
                                <div>
                                    <label className={labelCls}>Age of Property <span className="text-red-500">*</span></label>
                                    <div className="space-y-2">
                                        {['New / Under Construction', 'Less than 1 Year', '1–5 Years', '5–10 Years', '10+ Years'].map(a => (
                                            <label key={a} className={radioCardCls(ageOfProperty === a)}>
                                                <input type="radio" name="age" value={a} checked={ageOfProperty === a} onChange={() => setAgeOfProperty(a)} className="accent-primary-500" />
                                                {a}
                                            </label>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <label className={labelCls}>Construction Status</label>
                                    <div className="space-y-2">
                                        {['Ready to Move', 'Under Construction', 'Upcoming'].map(c => (
                                            <label key={c} className={radioCardCls(constructionStatus === c)}>
                                                <input type="radio" name="constStatus" value={c} checked={constructionStatus === c} onChange={() => setConstructionStatus(c)} className="accent-primary-500" />
                                                {c}
                                            </label>
                                        ))}
                                    </div>
                                </div>
                                {constructionStatus === 'Under Construction' && (
                                    <div>
                                        <label className={labelCls}>Expected Possession Date</label>
                                        <input type="month" value={possessionDate} onChange={e => setPossessionDate(e.target.value)} className={inputCls} />
                                    </div>
                                )}
                                <div>
                                    <label className={labelCls}>Furnishing Status <span className="text-red-500">*</span></label>
                                    <div className="space-y-2">
                                        {['Unfurnished', 'Semi-Furnished', 'Fully Furnished'].map(f => (
                                            <label key={f} className={radioCardCls(furnishing === f)}>
                                                <input type="radio" name="furnish" value={f} checked={furnishing === f} onChange={() => setFurnishing(f)} className="accent-primary-500" />
                                                {f}
                                            </label>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <label className={labelCls}>Facing Direction</label>
                                    <div className="grid grid-cols-4 gap-2">
                                        {['North', 'South', 'East', 'West', 'NE', 'NW', 'SE', 'SW'].map(d => (
                                            <button key={d} type="button" onClick={() => setFacing(d)} className={`py-2.5 text-xs font-bold rounded-xl border-2 transition-all ${facing === d ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-gray-200 text-gray-500 hover:border-primary-200'}`}>{d}</button>
                                        ))}
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className={labelCls}>Floor No.</label>
                                        <input type="text" value={floorNo} onChange={e => setFloorNo(e.target.value)} placeholder="e.g. 3, Ground" className={inputCls} />
                                    </div>
                                    <div>
                                        <label className={labelCls}>Total Floors</label>
                                        <input type="number" value={totalFloors} onChange={e => setTotalFloors(e.target.value)} placeholder="e.g. 10" className={inputCls} />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ── STEP 4: Amenities & Preferred Buyer ── */}
                        {step === 4 && (
                            <div className="space-y-5">
                                <div>
                                    <label className={labelCls}>Available Amenities</label>
                                    <div className="space-y-2">
                                        {[
                                            'Lift / Elevator', 'Covered Car Parking', 'Power Backup',
                                            'Swimming Pool', 'Gymnasium / Fitness Centre', 'Clubhouse',
                                            "Children's Play Area", 'Security / CCTV', 'Gated Community',
                                            'Rainwater Harvesting', 'Solar Power', 'Water Softener',
                                            'Visitor Parking', 'Intercom', 'Garden / Park Area'
                                        ].map(item => (
                                            <label key={item} className={checkCardCls(amenities.includes(item))}>
                                                <input type="checkbox" checked={amenities.includes(item)} onChange={() => toggleAmenity(item)} className="accent-primary-500 w-4 h-4 flex-shrink-0" />
                                                {item}
                                            </label>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <label className={labelCls}>Preferred Buyer Type</label>
                                    <div className="space-y-2">
                                        {['Any', 'Family Only', 'Bachelors Allowed', 'Investors', 'Corporate / Business'].map(item => (
                                            <label key={item} className={checkCardCls(preferredBuyer.includes(item))}>
                                                <input type="checkbox" checked={preferredBuyer.includes(item)} onChange={() => toggleBuyer(item)} className="accent-primary-500 w-4 h-4 flex-shrink-0" />
                                                {item}
                                            </label>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <label className={labelCls}>Home Loan Eligible?</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {['Yes', 'No'].map(v => (
                                            <label key={v} className={radioCardCls(loanEligible === v)}>
                                                <input type="radio" name="loan" value={v} checked={loanEligible === v} onChange={() => setLoanEligible(v)} className="accent-primary-500" />
                                                {v}
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
                                    <label className={labelCls}>Additional Details / USPs (Optional)</label>
                                    <textarea value={additionalNotes} onChange={e => setAdditionalNotes(e.target.value)} placeholder="e.g. Modular kitchen, Vastu compliant, Near metro station, Corner unit, Sea-facing..." rows={4} className={inputCls + ' resize-none'} />
                                </div>
                                <div className="bg-green-50 border border-green-100 rounded-xl p-4 flex items-start gap-3">
                                    <input type="checkbox" id="waCb" checked={optInWhatsapp} onChange={e => setOptInWhatsapp(e.target.checked)} className="w-5 h-5 accent-green-500 mt-0.5 flex-shrink-0" />
                                    <label htmlFor="waCb" className="text-sm text-green-800 font-medium cursor-pointer">
                                        Receive property updates and lead notifications on WhatsApp
                                    </label>
                                </div>
                                {/* Summary */}
                                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-2 text-sm">
                                    <p className="font-bold text-gray-700 mb-2">Review Your Submission</p>
                                    {[
                                        ['Name', ownerName], ['WhatsApp', whatsapp], ['Email', email],
                                        ['Property Type', propertyType], ['Purpose', saleType],
                                        ['Size', sizeSqft ? `${sizeSqft} sq ft` : '—'],
                                        ['Configuration', bhk || '—'],
                                        ['Expected Price', expectedPrice || '—'],
                                        ['Furnishing', furnishing || '—'],
                                        ['Age', ageOfProperty || '—'],
                                    ].map(([k, v]) => (
                                        <div key={k} className="flex justify-between">
                                            <span className="text-gray-500">{k}</span>
                                            <span className="font-semibold text-gray-800 text-right max-w-[55%] truncate">{v}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Navigation Buttons */}
                        <div className={`flex gap-3 pt-2 ${step === 1 ? '' : ''}`}>
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
                                    {loading ? <div className="w-5 h-5 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" /> : 'Submit Property'}
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
