'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Property } from '@prisma/client';
import { generateSlug, stringifyAmenities, parseAmenities, parseFacilities, stringifyFacilities, parseLocationAdvantages, stringifyLocationAdvantages, LocationAdvantage } from '@/lib/utils';

interface PropertyFormProps {
    property?: Property;
    mode: 'create' | 'edit';
}

export default function PropertyForm({ property, mode }: PropertyFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [amenitiesVocab, setAmenitiesVocab] = useState<string[]>([]);
    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>(property?.images ? JSON.parse(property.images) : []);
    const [floorPlanFiles, setFloorPlanFiles] = useState<File[]>([]);
    const [floorPlanPreviews, setFloorPlanPreviews] = useState<{ url: string, type: string, name: string }[]>(
        property?.floorPlans ? JSON.parse(property.floorPlans).map((url: string) => ({
            url,
            type: url.endsWith('.pdf') ? 'pdf' : 'image',
            name: url.split('/').pop() || ''
        })) : []
    );

    const [formData, setFormData] = useState({
        title: property?.title || '',
        slug: property?.slug || '',
        usageType: property?.usageType || 'residential',
        propertySubtype: property?.propertySubtype || '',
        areaName: property?.areaName || '',
        city: property?.city || 'Chennai',
        priceInr: property?.priceInr || 0,
        sizeSqft: property?.sizeSqft || 0,
        bedrooms: property?.bedrooms || 0,
        bathrooms: property?.bathrooms || 0,
        parking: property?.parking || '',
        amenities: property ? parseAmenities(property.amenities) : [],
        facilities: property ? parseFacilities(property.facilities) : [],
        locationAdvantages: property ? parseLocationAdvantages(property.locationAdvantages) : [],
        constructionStatus: property?.constructionStatus || '',
        tourEmbedUrl: property?.tourEmbedUrl || '',
        isPublished: property?.isPublished || false,
        isFeatured: property?.isFeatured || false,
    });

    useEffect(() => {
        fetchAmenitiesVocab();
    }, []);

    useEffect(() => {
        if (!property && formData.title) {
            setFormData(prev => ({ ...prev, slug: generateSlug(formData.title) }));
        }
    }, [formData.title, property]);

    const fetchAmenitiesVocab = async () => {
        try {
            const res = await fetch('/api/admin/settings');
            const settings = await res.json();
            setAmenitiesVocab(JSON.parse(settings.amenitiesVocabulary));
        } catch (error) {
            console.error('Error fetching amenities:', error);
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        setImageFiles(prev => [...prev, ...files]);

        // Create previews
        files.forEach(file => {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreviews(prev => [...prev, reader.result as string]);
            };
            reader.readAsDataURL(file);
        });
    };

    const removeImage = (index: number) => {
        setImagePreviews(prev => prev.filter((_, i) => i !== index));
        setImageFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleFloorPlanChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        setFloorPlanFiles(prev => [...prev, ...files]);

        // Create previews
        files.forEach(file => {
            const fileType = file.type.includes('pdf') ? 'pdf' : 'image';
            if (fileType === 'image') {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setFloorPlanPreviews(prev => [...prev, {
                        url: reader.result as string,
                        type: 'image',
                        name: file.name
                    }]);
                };
                reader.readAsDataURL(file);
            } else {
                setFloorPlanPreviews(prev => [...prev, {
                    url: '',
                    type: 'pdf',
                    name: file.name
                }]);
            }
        });
    };

    const removeFloorPlan = (index: number) => {
        setFloorPlanPreviews(prev => prev.filter((_, i) => i !== index));
        setFloorPlanFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            let imageUrls = imagePreviews.filter(url => url.startsWith('/properties/'));

            // Upload new images if any
            if (imageFiles.length > 0) {
                setUploading(true);
                const uploadFormData = new FormData();
                imageFiles.forEach(file => {
                    uploadFormData.append('images', file);
                });
                uploadFormData.append('slug', formData.slug);

                const uploadRes = await fetch('/api/admin/upload', {
                    method: 'POST',
                    body: uploadFormData,
                });

                if (!uploadRes.ok) throw new Error('Failed to upload images');

                const { urls } = await uploadRes.json();
                imageUrls = [...imageUrls, ...urls];
                setUploading(false);
            }

            // Upload floor plans if any
            let floorPlanUrls = floorPlanPreviews.filter(fp => fp.url.startsWith('/floorplans/')).map(fp => fp.url);

            if (floorPlanFiles.length > 0) {
                setUploading(true);
                const fpFormData = new FormData();
                floorPlanFiles.forEach(file => {
                    fpFormData.append('images', file);
                });
                fpFormData.append('slug', formData.slug);
                fpFormData.append('folder', 'floorplans');

                const fpUploadRes = await fetch('/api/admin/upload', {
                    method: 'POST',
                    body: fpFormData,
                });

                if (!fpUploadRes.ok) throw new Error('Failed to upload floor plans');

                const { urls } = await fpUploadRes.json();
                floorPlanUrls = [...floorPlanUrls, ...urls];
                setUploading(false);
            }

            const payload = {
                ...formData,
                priceInr: parseInt(formData.priceInr.toString()),
                sizeSqft: parseInt(formData.sizeSqft.toString()),
                bedrooms: formData.bedrooms ? parseInt(formData.bedrooms.toString()) : null,
                bathrooms: formData.bathrooms ? parseInt(formData.bathrooms.toString()) : null,
                amenities: stringifyAmenities(formData.amenities),
                facilities: stringifyFacilities(formData.facilities),
                locationAdvantages: stringifyLocationAdvantages(formData.locationAdvantages),
                images: JSON.stringify(imageUrls),
                floorPlans: JSON.stringify(floorPlanUrls),
            };

            const url = mode === 'create'
                ? '/api/admin/properties'
                : `/api/admin/properties/${property!.id}`;

            const method = mode === 'create' ? 'POST' : 'PUT';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!res.ok) throw new Error('Failed to save property');

            router.push('/admin/properties');
            router.refresh();
        } catch (error) {
            console.error('Error saving property:', error);
            alert('Failed to save property');
            setLoading(false);
            setUploading(false);
        }
    };

    const toggleAmenity = (amenity: string) => {
        setFormData(prev => ({
            ...prev,
            amenities: prev.amenities.includes(amenity)
                ? prev.amenities.filter(a => a !== amenity)
                : [...prev.amenities, amenity]
        }));
    };

    const extractEmbedUrl = (input: string): string => {
        // If it's already a clean URL, return it
        if (input.startsWith('http') && !input.includes('<')) {
            return input;
        }

        // Try to extract from TeleportMe script tag (handles both typo and correct spelling)
        // Note: TeleportMe has a typo in their script: data-teliportme instead of data-teleportme
        const teleportmeMatch = input.match(/data-teli?portme=["']([^"']+)["']/);
        if (teleportmeMatch) {
            return teleportmeMatch[1];
        }

        // Try to extract from iframe src attribute
        const iframeSrcMatch = input.match(/src=["']([^"']+)["']/);
        if (iframeSrcMatch) {
            return iframeSrcMatch[1];
        }

        // Return original input if no pattern matches
        return input;
    };

    const handleTourUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const rawInput = e.target.value;
        const extractedUrl = extractEmbedUrl(rawInput);
        setFormData({ ...formData, tourEmbedUrl: extractedUrl });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Basic Information</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                            Title *
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                            Slug *
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.slug}
                            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
                        />
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            URL-friendly identifier (auto-generated from title)
                        </p>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                            Usage Type *
                        </label>
                        <select
                            required
                            value={formData.usageType}
                            onChange={(e) => setFormData({ ...formData, usageType: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
                        >
                            <option value="residential">Residential</option>
                            <option value="commercial">Commercial</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                            Property Subtype
                        </label>
                        <input
                            type="text"
                            value={formData.propertySubtype}
                            onChange={(e) => setFormData({ ...formData, propertySubtype: e.target.value })}
                            placeholder="e.g., Apartment, Villa, Office"
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                            Area *
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.areaName}
                            onChange={(e) => setFormData({ ...formData, areaName: e.target.value })}
                            placeholder="e.g., OMR, ECR, Velachery"
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
                        />
                    </div>
                </div>
            </div>

            {/* Pricing & Size */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Pricing & Size</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                            Sale Price (₹) *
                        </label>
                        <input
                            type="number"
                            required
                            min="0"
                            value={formData.priceInr}
                            onChange={(e) => setFormData({ ...formData, priceInr: parseInt(e.target.value) || 0 })}
                            placeholder="e.g., 8500000 for 85 Lakhs"
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
                        />
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            Enter full amount (e.g., 8500000 = ₹85 Lakhs)
                        </p>
                    </div>


                    <div>
                        <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                            Size (sq ft) *
                        </label>
                        <input
                            type="number"
                            required
                            min="0"
                            value={formData.sizeSqft}
                            onChange={(e) => setFormData({ ...formData, sizeSqft: parseInt(e.target.value) || 0 })}
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                            Bedrooms
                        </label>
                        <input
                            type="number"
                            min="0"
                            value={formData.bedrooms || ''}
                            onChange={(e) => setFormData({ ...formData, bedrooms: parseInt(e.target.value) || 0 })}
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                            Bathrooms
                        </label>
                        <input
                            type="number"
                            min="0"
                            value={formData.bathrooms || ''}
                            onChange={(e) => setFormData({ ...formData, bathrooms: parseInt(e.target.value) || 0 })}
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                            Parking
                        </label>
                        <input
                            type="text"
                            value={formData.parking}
                            onChange={(e) => setFormData({ ...formData, parking: e.target.value })}
                            placeholder="e.g., 2 covered, 1 open"
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                            Construction Status
                        </label>
                        <select
                            value={formData.constructionStatus}
                            onChange={(e) => setFormData({ ...formData, constructionStatus: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
                        >
                            <option value="">Select Status</option>
                            <option value="Under Construction">Under Construction</option>
                            <option value="Ready to Move">Ready to Move</option>
                            <option value="Upcoming">Upcoming</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Property Images */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Property Images</h2>

                <div>
                    <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                        Upload Images
                    </label>
                    <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageChange}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Upload multiple images (JPG, PNG, WebP). First image will be the cover photo.
                    </p>
                </div>

                {/* Image Previews */}
                {imagePreviews.length > 0 && (
                    <div className="mt-4">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                            Preview ({imagePreviews.length} image{imagePreviews.length !== 1 ? 's' : ''})
                        </p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {imagePreviews.map((preview, index) => (
                                <div key={index} className="relative group">
                                    <div className="relative w-full h-32 bg-gray-100 dark:bg-gray-700 rounded-xl overflow-hidden">
                                        <Image
                                            src={preview}
                                            alt={`Preview ${index + 1}`}
                                            fill
                                            className="object-cover"
                                        />
                                        {index === 0 && (
                                            <div className="absolute top-2 left-2 px-2 py-1 bg-primary-500 text-white text-xs font-semibold rounded">
                                                Cover
                                            </div>
                                        )}
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => removeImage(index)}
                                        className="absolute top-2 right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Floor Plans / Layout Plans */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Floor Plans / Layout Plans</h2>

                <div>
                    <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                        Upload Floor Plans
                    </label>
                    <input
                        type="file"
                        accept="image/*,.pdf"
                        multiple
                        onChange={handleFloorPlanChange}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Upload floor plan images (JPG, PNG) or PDFs. Users can view and download these files.
                    </p>
                </div>

                {/* Floor Plan Previews */}
                {floorPlanPreviews.length > 0 && (
                    <div className="mt-4">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                            Preview ({floorPlanPreviews.length} file{floorPlanPreviews.length !== 1 ? 's' : ''})
                        </p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {floorPlanPreviews.map((preview, index) => (
                                <div key={index} className="relative group">
                                    <div className="relative w-full h-32 bg-gray-100 dark:bg-gray-700 rounded-xl overflow-hidden flex items-center justify-center">
                                        {preview.type === 'image' ? (
                                            <Image
                                                src={preview.url}
                                                alt={`Floor plan ${index + 1}`}
                                                fill
                                                className="object-cover"
                                            />
                                        ) : (
                                            <div className="flex flex-col items-center justify-center p-4">
                                                <svg className="w-12 h-12 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                                                </svg>
                                                <p className="text-xs text-gray-600 dark:text-gray-400 mt-2 text-center truncate w-full">
                                                    {preview.name}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => removeFloorPlan(index)}
                                        className="absolute top-2 right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* 360° Tour */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">360° Virtual Tour</h2>

                <div>
                    <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                        Embed URL *
                    </label>
                    <input
                        type="text"
                        required
                        value={formData.tourEmbedUrl}
                        onChange={handleTourUrlChange}
                        placeholder="Paste TeleportMe script or direct URL"
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Paste the iframe embed URL for the 360° tour
                    </p>
                </div>

                {formData.tourEmbedUrl && (
                    <div className="mt-4">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Preview:</p>
                        <div className="relative w-full bg-gray-900 rounded-xl overflow-hidden" style={{ paddingBottom: '56.25%' }}>
                            <iframe
                                src={formData.tourEmbedUrl}
                                className="absolute top-0 left-0 w-full h-full"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                title="Tour Preview"
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* Top Facilities */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Top Facilities</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Select the facilities available in this property</p>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {[
                        'Swimming Pool', 'Gymnasium', 'Club House', 'Golf Course',
                        'Children\'s Play Area', 'Theatre', 'Terrace Garden', 'Park',
                        'Power Backup', 'Lift', 'Security/CCTV', 'Reserved Parking',
                        'Visitor Parking', 'Water Storage', 'Intercom', 'Fire Safety',
                        'Rainwater Harvesting', 'Waste Disposal', 'Maintenance Staff',
                        'Community Hall', 'Library', 'Indoor Games', 'Jogging Track',
                        'Yoga/Meditation Area', 'Sports Court', 'Cafeteria', 'ATM'
                    ].map((facility) => (
                        <label key={facility} className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                            <input
                                type="checkbox"
                                checked={formData.facilities.includes(facility)}
                                onChange={(e) => {
                                    if (e.target.checked) {
                                        setFormData({ ...formData, facilities: [...formData.facilities, facility] });
                                    } else {
                                        setFormData({ ...formData, facilities: formData.facilities.filter(f => f !== facility) });
                                    }
                                }}
                                className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                            />
                            <span className="text-sm text-gray-700 dark:text-gray-300">{facility}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Location Advantages */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Location Advantages</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Add nearby places and landmarks</p>

                <div className="space-y-4">
                    {formData.locationAdvantages.map((location, index) => (
                        <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <div className="md:col-span-5">
                                <input
                                    type="text"
                                    value={location.name}
                                    onChange={(e) => {
                                        const newLocations = [...formData.locationAdvantages];
                                        newLocations[index].name = e.target.value;
                                        setFormData({ ...formData, locationAdvantages: newLocations });
                                    }}
                                    placeholder="Place name (e.g., ABC School)"
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                                />
                            </div>
                            <div className="md:col-span-3">
                                <select
                                    value={location.category}
                                    onChange={(e) => {
                                        const newLocations = [...formData.locationAdvantages];
                                        newLocations[index].category = e.target.value;
                                        setFormData({ ...formData, locationAdvantages: newLocations });
                                    }}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                                >
                                    <option value="school">School</option>
                                    <option value="hospital">Hospital</option>
                                    <option value="shopping">Shopping Mall</option>
                                    <option value="restaurant">Restaurant</option>
                                    <option value="bank">Bank/ATM</option>
                                    <option value="metro">Metro Station</option>
                                    <option value="bus">Bus Stop</option>
                                    <option value="airport">Airport</option>
                                    <option value="park">Park</option>
                                    <option value="supermarket">Supermarket</option>
                                </select>
                            </div>
                            <div className="md:col-span-3">
                                <input
                                    type="text"
                                    value={location.distance}
                                    onChange={(e) => {
                                        const newLocations = [...formData.locationAdvantages];
                                        newLocations[index].distance = e.target.value;
                                        setFormData({ ...formData, locationAdvantages: newLocations });
                                    }}
                                    placeholder="Distance (e.g., 950 M or 2.5 Kms)"
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                                />
                            </div>
                            <div className="md:col-span-1 flex items-center">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setFormData({
                                            ...formData,
                                            locationAdvantages: formData.locationAdvantages.filter((_, i) => i !== index)
                                        });
                                    }}
                                    className="w-full md:w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-lg flex items-center justify-center"
                                >
                                    ×
                                </button>
                            </div>
                        </div>
                    ))}

                    <button
                        type="button"
                        onClick={() => {
                            setFormData({
                                ...formData,
                                locationAdvantages: [...formData.locationAdvantages, { name: '', category: 'school', distance: '' }]
                            });
                        }}
                        className="w-full px-4 py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl text-gray-600 dark:text-gray-400 hover:border-primary-500 hover:text-primary-500 transition-colors"
                    >
                        + Add Location
                    </button>
                </div>
            </div>

            {/* Publishing */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Publishing</h2>

                <div className="space-y-4">
                    <label className="flex items-center gap-3 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={formData.isPublished}
                            onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                            className="w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                        />
                        <span className="text-gray-900 dark:text-white font-medium">Publish this property</span>
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={formData.isFeatured}
                            onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                            className="w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                        />
                        <span className="text-gray-900 dark:text-white font-medium">Feature on homepage</span>
                    </label>
                </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4">
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="flex-1 px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={loading || uploading}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold rounded-xl transition-all disabled:cursor-not-allowed"
                >
                    {uploading ? 'Uploading Images...' : loading ? 'Saving...' : mode === 'create' ? 'Create Property' : 'Update Property'}
                </button>
            </div>
        </form>
    );
}
