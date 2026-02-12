import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting seed...');

    // Create admin user
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@realproprealty.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'ChangeThisPassword123!';
    const passwordHash = await bcrypt.hash(adminPassword, 10);

    const admin = await prisma.admin.upsert({
        where: { email: adminEmail },
        update: {},
        create: {
            email: adminEmail,
            passwordHash,
        },
    });

    console.log('✅ Admin user created:', admin.email);

    // Create site settings
    const settings = await prisma.siteSettings.upsert({
        where: { id: 'default' },
        update: {},
        create: {
            id: 'default',
            brandName: 'Realprop Realty',
            tagline: '360° Tours • Premium Properties • Chennai',
            city: 'Chennai',
            whatsappNumber: '+919876543210',
            phoneNumber: '+919876543210',
            whatsappTemplate: 'Hi, I\'m interested in {propertyTitle}. Link: {propertyUrl} - Realprop Realty',
            amenitiesVocabulary: JSON.stringify([
                // Common amenities
                'Lift',
                'Parking',
                'Security',
                'Power Backup',
                'Water Supply',
                'CCTV',
                'Intercom',
                '24/7 Security',
                'Fire Safety',
                'Maintenance Staff',
                'Covered Parking',
                'Visitor Parking',
                'Rainwater Harvesting',
                'Waste Management',
                // Residential-specific
                'Gym',
                'Swimming Pool',
                'Garden',
                'Play Area',
                'Club House',
                'Children\'s Park',
                'Jogging Track',
                'Indoor Games',
                'Community Hall',
                'Meditation Area',
                'Senior Citizen Area',
                // Commercial-specific
                'Conference Room',
                'Reception Area',
                'Cafeteria',
                'Server Room',
                'Meeting Rooms',
                'Pantry',
                'Workstations',
                'Cabin Space',
                'Washrooms per Floor',
                'Loading Bay',
                'Storage Area',
            ]),
        },
    });

    console.log('✅ Site settings created');

    // Sample properties
    const properties = [
        {
            title: '3BHK Premium Apartment in OMR',
            slug: '3bhk-premium-apartment-omr',
            usageType: 'residential',
            propertySubtype: 'Apartment',
            areaName: 'OMR',
            priceInr: 8500000, // 85 Lakhs
            sizeSqft: 1450,
            bedrooms: 3,
            bathrooms: 2,
            parking: '2 covered',
            amenities: JSON.stringify(['Lift', 'Parking', 'Security', 'Power Backup', 'Gym', 'Swimming Pool']),
            tourEmbedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            isPublished: true,
            isFeatured: true,
        },
        {
            title: 'Luxury Villa in ECR',
            slug: 'luxury-villa-ecr',
            usageType: 'residential',
            propertySubtype: 'Villa',
            areaName: 'ECR',
            priceInr: 25000000, // 2.5 Crores
            sizeSqft: 2800,
            bedrooms: 4,
            bathrooms: 4,
            parking: '3 covered',
            amenities: JSON.stringify(['Parking', 'Security', 'Power Backup', 'Water Supply', 'Garden', 'Swimming Pool']),
            tourEmbedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            isPublished: true,
            isFeatured: false,
        },
        {
            title: '2BHK Apartment in Velachery',
            slug: '2bhk-apartment-velachery',
            usageType: 'residential',
            propertySubtype: 'Apartment',
            areaName: 'Velachery',
            priceInr: 5500000, // 55 Lakhs
            sizeSqft: 1100,
            bedrooms: 2,
            bathrooms: 2,
            parking: '1 covered',
            amenities: JSON.stringify(['Lift', 'Parking', 'Security', 'Power Backup', 'Water Supply']),
            tourEmbedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            isPublished: true,
            isFeatured: false,
        },
        {
            title: 'Commercial Office Space in Adyar',
            slug: 'commercial-office-space-adyar',
            usageType: 'commercial',
            propertySubtype: 'Office',
            areaName: 'Adyar',
            priceInr: 35000000, // 3.5 Crores
            sizeSqft: 3500,
            bedrooms: null,
            bathrooms: 3,
            parking: '10 open',
            amenities: JSON.stringify(['Lift', 'Parking', 'Security', 'Power Backup', 'CCTV', 'Cafeteria']),
            tourEmbedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            isPublished: true,
            isFeatured: false,
        },
        {
            title: '1BHK Compact Flat in Anna Nagar',
            slug: '1bhk-compact-flat-anna-nagar',
            usageType: 'residential',
            propertySubtype: 'Apartment',
            areaName: 'Anna Nagar',
            priceInr: 3500000, // 35 Lakhs
            sizeSqft: 650,
            bedrooms: 1,
            bathrooms: 1,
            parking: '1 open',
            amenities: JSON.stringify(['Lift', 'Security', 'Water Supply']),
            tourEmbedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            isPublished: true,
            isFeatured: false,
        },
        {
            title: 'Spacious 3BHK in Porur',
            slug: 'spacious-3bhk-porur',
            usageType: 'residential',
            propertySubtype: 'Apartment',
            areaName: 'Porur',
            priceInr: 7000000, // 70 Lakhs
            sizeSqft: 1350,
            bedrooms: 3,
            bathrooms: 2,
            parking: '2 covered',
            amenities: JSON.stringify(['Lift', 'Parking', 'Security', 'Power Backup', 'Play Area', 'Club House']),
            tourEmbedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            isPublished: true,
            isFeatured: false,
        },
        {
            title: 'Retail Shop in T Nagar',
            slug: 'retail-shop-t-nagar',
            usageType: 'commercial',
            propertySubtype: 'Shop',
            areaName: 'T Nagar',
            priceInr: 18000000, // 1.8 Crores
            sizeSqft: 800,
            bedrooms: null,
            bathrooms: 1,
            parking: 'Street parking',
            amenities: JSON.stringify(['Security', 'Power Backup', 'CCTV']),
            tourEmbedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            isPublished: true,
            isFeatured: false,
        },
        {
            title: '2BHK Independent House in Tambaram',
            slug: '2bhk-independent-house-tambaram',
            usageType: 'residential',
            propertySubtype: 'Independent House',
            areaName: 'Tambaram',
            priceInr: 4500000, // 45 Lakhs
            sizeSqft: 950,
            bedrooms: 2,
            bathrooms: 2,
            parking: '2 open',
            amenities: JSON.stringify(['Parking', 'Water Supply', 'Garden']),
            tourEmbedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            isPublished: true,
            isFeatured: false,
        },
        {
            title: 'Premium 4BHK Penthouse in OMR',
            slug: 'premium-4bhk-penthouse-omr',
            usageType: 'residential',
            propertySubtype: 'Penthouse',
            areaName: 'OMR',
            priceInr: 28000000, // 2.8 Crores
            sizeSqft: 3200,
            bedrooms: 4,
            bathrooms: 4,
            parking: '3 covered',
            amenities: JSON.stringify(['Lift', 'Parking', 'Security', 'Power Backup', 'Gym', 'Swimming Pool', 'Club House', 'CCTV']),
            tourEmbedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            isPublished: true,
            isFeatured: true,
        },
        {
            title: 'Warehouse Space in Ambattur',
            slug: 'warehouse-space-ambattur',
            usageType: 'commercial',
            propertySubtype: 'Warehouse',
            areaName: 'Ambattur',
            priceInr: 45000000, // 4.5 Crores
            sizeSqft: 8000,
            bedrooms: null,
            bathrooms: 2,
            parking: '20 open',
            amenities: JSON.stringify(['Security', 'Power Backup', 'CCTV', 'Loading Dock']),
            tourEmbedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            isPublished: true,
            isFeatured: false,
        },
        {
            title: 'Cozy Studio Apartment in Velachery',
            slug: 'cozy-studio-apartment-velachery',
            usageType: 'residential',
            propertySubtype: 'Studio',
            areaName: 'Velachery',
            priceInr: 2800000, // 28 Lakhs
            sizeSqft: 450,
            bedrooms: 0,
            bathrooms: 1,
            parking: '1 open',
            amenities: JSON.stringify(['Lift', 'Security', 'Water Supply']),
            tourEmbedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            isPublished: true,
            isFeatured: false,
        },
        {
            title: 'Modern Office in Guindy',
            slug: 'modern-office-guindy',
            usageType: 'commercial',
            propertySubtype: 'Office',
            areaName: 'Guindy',
            priceInr: 25000000, // 2.5 Crores
            sizeSqft: 2500,
            bedrooms: null,
            bathrooms: 2,
            parking: '8 covered',
            amenities: JSON.stringify(['Lift', 'Parking', 'Security', 'Power Backup', 'CCTV', 'Cafeteria', 'Conference Room']),
            tourEmbedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            isPublished: true,
            isFeatured: false,
        },
        {
            title: '3BHK Sea View Apartment in ECR',
            slug: '3bhk-sea-view-apartment-ecr',
            usageType: 'residential',
            propertySubtype: 'Apartment',
            areaName: 'ECR',
            priceInr: 12000000, // 1.2 Crores
            sizeSqft: 1600,
            bedrooms: 3,
            bathrooms: 3,
            parking: '2 covered',
            amenities: JSON.stringify(['Lift', 'Parking', 'Security', 'Power Backup', 'Swimming Pool', 'Beach Access']),
            tourEmbedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            isPublished: true,
            isFeatured: true,
        },
        {
            title: 'Budget 2BHK in Chromepet',
            slug: 'budget-2bhk-chromepet',
            usageType: 'residential',
            propertySubtype: 'Apartment',
            areaName: 'Chromepet',
            priceInr: 3200000, // 32 Lakhs
            sizeSqft: 850,
            bedrooms: 2,
            bathrooms: 1,
            parking: '1 open',
            amenities: JSON.stringify(['Water Supply', 'Security']),
            tourEmbedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            isPublished: true,
            isFeatured: false,
        },
        {
            title: 'Co-working Space in Nungambakkam',
            slug: 'coworking-space-nungambakkam',
            usageType: 'commercial',
            propertySubtype: 'Co-working',
            areaName: 'Nungambakkam',
            priceInr: 15000000, // 1.5 Crores
            sizeSqft: 1500,
            bedrooms: null,
            bathrooms: 3,
            parking: '5 covered',
            amenities: JSON.stringify(['Lift', 'Parking', 'Security', 'Power Backup', 'CCTV', 'WiFi', 'Cafeteria']),
            tourEmbedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            isPublished: true,
            isFeatured: false,
        },
    ];

    for (const property of properties) {
        await prisma.property.upsert({
            where: { slug: property.slug },
            update: {},
            create: property,
        });
    }

    console.log(`✅ Created ${properties.length} properties`);
    console.log('🎉 Seed completed successfully!');
}

main()
    .catch((e) => {
        console.error('❌ Seed failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
