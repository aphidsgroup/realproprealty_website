import { type ClassValue, clsx } from 'clsx';

export function cn(...inputs: ClassValue[]) {
    return clsx(inputs);
}

export function generateSlug(title: string): string {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

export function formatPrice(priceInr: number): string {
    if (priceInr >= 10000000) {
        // Crores - remove trailing zeros
        const crores = priceInr / 10000000;
        const formatted = crores % 1 === 0 ? crores.toFixed(0) : crores.toFixed(2).replace(/\.?0+$/, '');
        return `₹${formatted}Cr`;
    } else if (priceInr >= 100000) {
        // Lakhs - remove trailing zeros
        const lakhs = priceInr / 100000;
        const formatted = lakhs % 1 === 0 ? lakhs.toFixed(0) : lakhs.toFixed(2).replace(/\.?0+$/, '');
        return `₹${formatted}L`;
    } else if (priceInr >= 1000) {
        return `₹${(priceInr / 1000).toFixed(0)}K`;
    }
    return `₹${priceInr}`;
}

export function formatSize(sizeSqft: number): string {
    return `${sizeSqft.toLocaleString()} sq ft`;
}

export function buildWhatsAppUrl(
    phoneNumber: string,
    template: string,
    propertyTitle: string,
    propertyUrl: string
): string {
    const message = template
        .replace('{propertyTitle}', propertyTitle)
        .replace('{propertyUrl}', propertyUrl);

    const cleanNumber = phoneNumber.replace(/[^0-9]/g, '');
    return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
}

export function parseAmenities(amenitiesJson: string): string[] {
    try {
        return JSON.parse(amenitiesJson);
    } catch {
        return [];
    }
}

export function stringifyAmenities(amenities: string[]): string {
    return JSON.stringify(amenities);
}

export function parseFacilities(facilitiesJson: string | null): string[] {
    if (!facilitiesJson) return [];
    try {
        return JSON.parse(facilitiesJson);
    } catch {
        return [];
    }
}

export function stringifyFacilities(facilities: string[]): string {
    return JSON.stringify(facilities);
}

export interface LocationAdvantage {
    name: string;
    category: string;
    distance: string;
}

export function parseLocationAdvantages(locationJson: string | null): LocationAdvantage[] {
    if (!locationJson) return [];
    try {
        return JSON.parse(locationJson);
    } catch {
        return [];
    }
}

export function stringifyLocationAdvantages(locations: LocationAdvantage[]): string {
    return JSON.stringify(locations);
}
