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

export default function SellerOnboardingPage() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);

    // Step 1 – Owner Info
    const [ownerName, setOwnerName] = useState('');
    const [whatsapp, setWhatsapp] = useState('');
    const [email, setEmail] = useState('');
    const [propertyAddress, setPropertyAddress] = useState('');
    const [propertyType, setPropertyType] = useState('Apartment');

    // Step 2 – Property Specs
    const [saleType, setSaleType] = useState('');
    const [sizeSqft, setSizeSqft] = useState('');
    const [bhk, setBhk] = useState('');
    const [bathrooms, setBathrooms] = useState('');
    const [parkingType, setParkingType] = useState('');
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
                'Lift / Elevator', 'Covered Car Parking', 'Power Backup',
                'Swimming Pool', 'Gymnasium / Fitness Centre', 'Clubhouse',
                "Children's Play Area", 'Security / CCTV', 'Gated Community',
                'Rainwater Harvesting', 'Solar Power', 'Water Softener',
                'Visitor Parking', 'Intercom', 'Garden / Park Area'
            ];
        }
    };

    const getFurnishingOptions = () => {
        if (isCommercial) {
            return ['Fully Furnished', 'Warm Shell', 'Bare Shell'];
        }
        return ['Fully Furnished', 'Semi-Furnished', 'Unfurnished'];
    };

    const toggleAmenity = (item: string) =>
        setAmenities(prev => prev.includes(item) ? prev.filter(a => a !== item) : [...prev, item]);
    const toggleBuyer = (item: string) =>
        setPreferredBuyer(prev => prev.includes(item) ? prev.filter(b => b !== item) : [...prev, item]);

    const nextStep = () => setStep(s => Math.min(s + 1, TOTAL_STEPS));
    const prevStep = () => setStep(s => Math.max(s - 1, 1));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
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
                    saleType, sizeSqft, 
                    bhk: isPlot || isCommercial ? '' : bhk, 
                    bathrooms: isPlot ? '' : bathrooms,
                    parkingType, parkingCount, isNegotiable,
                    ageOfProperty: isPlot ? '' : ageOfProperty, 
                    furnishing: isPlot ? '' : furnishing, 
                    facing, 
                    floorNo: isPlot || propertyType === 'Villa / Independent House' ? '' : floorNo, 
                    totalFloors: isPlot || propertyType === 'Villa / Independent House' ? '' : totalFloors,
                    constructionStatus: isPlot ? '' : constructionStatus, 
                    possessionDate: isPlot ? '' : possessionDate,
                    amenities, preferredBuyer, loanEligible, additionalNotes,
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
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Property Submitted!</h1>
                        <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
                            Thank you, {ownerName}. Our team will review your property details and contact you shortly to arrange a 360° virtual tour shoot.
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
                            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 text-orange-500">List Your Property</h1>
                            <p className="text-gray-300">Showcase your property with an immersive 360° Virtual Tour and reach qualified buyers.</p>
                            <p className="text-sm text-gray-500 mt-4">Step {step} of {TOTAL_STEPS}</p>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="p-8 md:p-10 space-y-8">
                            
                            {/* ── STEP 1: Owner Info ── */}
                            {step === 1 && (
                                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                                    <div>
                                        <label className={labelCls}>Owner Name *</label>
                                        <input required value={ownerName} onChange={e => setOwnerName(e.target.value)} placeholder="Enter your full name" className={inputCls} />
                                    </div>
                                    <div>
                                        <label className={labelCls}>WhatsApp Number *</label>
                                        <input required type="tel" value={whatsapp} onChange={e => setWhatsapp(e.target.value)} placeholder="10-digit WhatsApp number" maxLength={10} className={inputCls} />
                                    </div>
                                    <div>
                                        <label className={labelCls}>Email Address *</label>
                                        <input required type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Enter your email" className={inputCls} />
                                    </div>
                                    <div>
                                        <label className={labelCls}>Exact Property Address *</label>
                                        <textarea required value={propertyAddress} onChange={e => setPropertyAddress(e.target.value)} placeholder="Enter the full address including landmark" rows={3} className={inputCls + ' resize-none'} />
                                    </div>
                                    <div>
                                        <label className={labelCls}>Property Type *</label>
                                        <div className="space-y-3">
                                            {['Apartment', 'Villa / Independent House', 'Plot / Land', 'Commercial Space', 'Row House / Townhouse'].map(t => (
                                                <label key={t} className={radioCardCls(propertyType === t)}>
                                                    <input type="radio" name="propType" value={t} checked={propertyType === t} onChange={() => {
                                                        setPropertyType(t);
                                                        setAmenities([]); // Reset amenities since options change
                                                    }} className="accent-orange-500 w-4 h-4" />
                                                    {t}
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* ── STEP 2: Pricing & Specs ── */}
                            {step === 2 && (
                                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                                    <div>
                                        <label className={labelCls}>Purpose of Sale *</label>
                                        <div className="space-y-3">
                                            {['Outright Sale', 'Lease / Rent', 'Both Sale & Lease'].map(t => (
                                                <label key={t} className={radioCardCls(saleType === t)}>
                                                    <input type="radio" name="saleType" value={t} checked={saleType === t} onChange={() => setSaleType(t)} className="accent-orange-500 w-4 h-4" />
                                                    {t}
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <label className={labelCls}>Total Square Feet *</label>
                                        <input required type="number" value={sizeSqft} onChange={e => setSizeSqft(e.target.value)} placeholder="Enter area in sq ft" className={inputCls} />
                                    </div>
                                    {!isPlot && !isCommercial && (
                                        <div>
                                            <label className={labelCls}>Configuration (BHK)</label>
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                                {['1 BHK', '2 BHK', '3 BHK', '4+ BHK'].map(b => (
                                                    <button key={b} type="button" onClick={() => setBhk(b)} className={`py-3 text-sm font-bold rounded-xl border-2 transition-all ${bhk === b ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400' : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-orange-200 dark:hover:border-orange-800'}`}>{b}</button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    {!isPlot && (
                                        <div>
                                            <label className={labelCls}>Number of Bathrooms</label>
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                                {['1', '2', '3', '4+'].map(b => (
                                                    <button key={b} type="button" onClick={() => setBathrooms(b)} className={`py-3 text-sm font-bold rounded-xl border-2 transition-all ${bathrooms === b ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400' : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-orange-200 dark:hover:border-orange-800'}`}>{b}</button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    <div>
                                        <label className={labelCls}>Parking Type *</label>
                                        <div className="grid grid-cols-3 gap-3">
                                            {['Covered', 'Open', 'None'].map(p => (
                                                <label key={p} className={radioCardCls(parkingType === p)}>
                                                    <input type="radio" name="parking" value={p} checked={parkingType === p} onChange={() => setParkingType(p)} className="accent-orange-500 w-4 h-4" />
                                                    {p}
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                    {parkingType !== 'None' && parkingType !== '' && (
                                        <div>
                                            <label className={labelCls}>Number of Car Parkings</label>
                                            <input type="number" value={parkingCount} onChange={e => setParkingCount(e.target.value)} placeholder="e.g. 1, 2" className={inputCls} />
                                        </div>
                                    )}
                                    <div>
                                        <label className={labelCls}>Expected Sale/Lease Price (₹) *</label>
                                        <input required type="text" value={expectedPrice} onChange={e => setExpectedPrice(e.target.value)} placeholder="e.g. 75,00,000 or 1.2 Crores" className={inputCls} />
                                    </div>
                                    <div>
                                        <label className={labelCls}>Is Price Negotiable? *</label>
                                        <div className="grid grid-cols-2 gap-3">
                                            {['Yes', 'No'].map(v => (
                                                <label key={v} className={radioCardCls(isNegotiable === v)}>
                                                    <input type="radio" name="nego" value={v} checked={isNegotiable === v} onChange={() => setIsNegotiable(v)} className="accent-orange-500 w-4 h-4" />
                                                    {v}
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* ── STEP 3: Property Condition ── */}
                            {step === 3 && (
                                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                                    {!isPlot && (
                                        <>
                                            <div>
                                                <label className={labelCls}>Age of Property *</label>
                                                <div className="space-y-3">
                                                    {['New / Under Construction', 'Less than 1 Year', '1–5 Years', '5–10 Years', '10+ Years'].map(a => (
                                                        <label key={a} className={radioCardCls(ageOfProperty === a)}>
                                                            <input type="radio" name="age" value={a} checked={ageOfProperty === a} onChange={() => setAgeOfProperty(a)} className="accent-orange-500 w-4 h-4" />
                                                            {a}
                                                        </label>
                                                    ))}
                                                </div>
                                            </div>
                                            <div>
                                                <label className={labelCls}>Construction Status</label>
                                                <div className="space-y-3">
                                                    {['Ready to Move', 'Under Construction', 'Upcoming'].map(c => (
                                                        <label key={c} className={radioCardCls(constructionStatus === c)}>
                                                            <input type="radio" name="constStatus" value={c} checked={constructionStatus === c} onChange={() => setConstructionStatus(c)} className="accent-orange-500 w-4 h-4" />
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
                                                <label className={labelCls}>Furnishing Status *</label>
                                                <div className="space-y-3">
                                                    {getFurnishingOptions().map(f => (
                                                        <label key={f} className={radioCardCls(furnishing === f)}>
                                                            <input type="radio" name="furnish" value={f} checked={furnishing === f} onChange={() => setFurnishing(f)} className="accent-orange-500 w-4 h-4" />
                                                            {f}
                                                        </label>
                                                    ))}
                                                </div>
                                            </div>
                                        </>
                                    )}
                                    <div>
                                        <label className={labelCls}>Facing Direction</label>
                                        <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                                            {['North', 'South', 'East', 'West', 'NE', 'NW', 'SE', 'SW'].map(d => (
                                                <button key={d} type="button" onClick={() => setFacing(d)} className={`py-2.5 text-sm font-bold rounded-xl border-2 transition-all ${facing === d ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400' : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-orange-200 dark:hover:border-orange-800'}`}>{d}</button>
                                            ))}
                                        </div>
                                    </div>
                                    {!isPlot && propertyType !== 'Villa / Independent House' && (
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className={labelCls}>Floor No.</label>
                                                <input type="text" value={floorNo} onChange={e => setFloorNo(e.target.value)} placeholder="e.g. 3, Ground" className={inputCls} />
                                            </div>
                                            <div>
                                                <label className={labelCls}>Total Floors</label>
                                                <input type="number" value={totalFloors} onChange={e => setTotalFloors(e.target.value)} placeholder="e.g. 10" className={inputCls} />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* ── STEP 4: Amenities & Preferred Buyer ── */}
                            {step === 4 && (
                                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                                    <div>
                                        <label className={labelCls}>Available Amenities</label>
                                        <div className="space-y-3">
                                            {getAmenitiesOptions().map(item => (
                                                <label key={item} className={checkCardCls(amenities.includes(item))}>
                                                    <input type="checkbox" checked={amenities.includes(item)} onChange={() => toggleAmenity(item)} className="accent-orange-500 w-4 h-4 flex-shrink-0" />
                                                    {item}
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <label className={labelCls}>Preferred Buyer Type</label>
                                        <div className="space-y-3">
                                            {['Any', 'Family Only', 'Bachelors Allowed', 'Investors', 'Corporate / Business'].map(item => (
                                                <label key={item} className={checkCardCls(preferredBuyer.includes(item))}>
                                                    <input type="checkbox" checked={preferredBuyer.includes(item)} onChange={() => toggleBuyer(item)} className="accent-orange-500 w-4 h-4 flex-shrink-0" />
                                                    {item}
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <label className={labelCls}>Home Loan Approved / Eligible Project?</label>
                                        <div className="grid grid-cols-2 gap-3">
                                            {['Yes', 'No'].map(v => (
                                                <label key={v} className={radioCardCls(loanEligible === v)}>
                                                    <input type="radio" name="loan" value={v} checked={loanEligible === v} onChange={() => setLoanEligible(v)} className="accent-orange-500 w-4 h-4" />
                                                    {v}
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
                                        <label className={labelCls}>Additional Details / USPs (Optional)</label>
                                        <textarea value={additionalNotes} onChange={e => setAdditionalNotes(e.target.value)} placeholder="e.g. Modular kitchen, Vastu compliant, Near metro station, Corner unit, Sea-facing..." rows={4} className={inputCls + ' resize-none'} />
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <input type="checkbox" id="whatsapp" checked={optInWhatsapp} onChange={e => setOptInWhatsapp(e.target.checked)} className="w-5 h-5 text-orange-500 rounded border-gray-300 focus:ring-orange-500" />
                                        <label htmlFor="whatsapp" className="text-sm text-gray-600 dark:text-gray-400 cursor-pointer">Receive property updates and lead notifications on WhatsApp</label>
                                    </div>
                                    {/* Summary */}
                                    <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 space-y-3 text-sm">
                                        <p className="font-bold text-gray-900 dark:text-white mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">Review Your Submission</p>
                                        {[
                                            ['Name', ownerName], ['WhatsApp', whatsapp], ['Email', email],
                                            ['Property Type', propertyType], ['Purpose', saleType],
                                            ['Size', sizeSqft ? `${sizeSqft} sq ft` : '—'],
                                            ...(isPlot || isCommercial ? [] : [['Configuration', bhk || '—']]),
                                            ['Expected Price', expectedPrice || '—'],
                                            ...(isPlot ? [] : [['Furnishing', furnishing || '—']]),
                                            ...(isPlot ? [] : [['Age', ageOfProperty || '—']]),
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
                                        {submitting ? <div className="w-5 h-5 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" /> : 'Submit Property'}
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
