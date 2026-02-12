const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function updateECRProperty() {
    try {
        // Find the ECR property
        const property = await prisma.property.findFirst({
            where: {
                title: {
                    contains: '3BHK Sea View Apartment'
                }
            }
        });

        if (!property) {
            console.log('Property not found');
            return;
        }

        console.log('Found property:', property.title);

        // Sample facilities for a premium sea view apartment
        const facilities = [
            'Swimming Pool',
            'Gymnasium',
            'Club House',
            'Children\'s Play Area',
            'Terrace Garden',
            'Park',
            'Power Backup',
            'Lift',
            'Security/CCTV',
            'Reserved Parking',
            'Visitor Parking',
            'Water Storage',
            'Intercom',
            'Fire Safety',
            'Maintenance Staff'
        ];

        // Sample nearby places for ECR area
        const locationAdvantages = [
            {
                name: 'Kalakshetra Foundation',
                category: 'school',
                distance: '2.5 Kms'
            },
            {
                name: 'MGM Healthcare',
                category: 'hospital',
                distance: '8 Kms'
            },
            {
                name: 'VGP Universal Kingdom',
                category: 'park',
                distance: '3.2 Kms'
            },
            {
                name: 'Phoenix MarketCity',
                category: 'shopping',
                distance: '12 Kms'
            },
            {
                name: 'Muttukadu Boat House',
                category: 'park',
                distance: '5 Kms'
            },
            {
                name: 'Mahabalipuram Beach',
                category: 'park',
                distance: '15 Kms'
            },
            {
                name: 'Dakshina Chitra Museum',
                category: 'park',
                distance: '10 Kms'
            },
            {
                name: 'Spencer\'s Supermarket',
                category: 'supermarket',
                distance: '4 Kms'
            }
        ];

        // Update the property
        const updated = await prisma.property.update({
            where: { id: property.id },
            data: {
                facilities: JSON.stringify(facilities),
                locationAdvantages: JSON.stringify(locationAdvantages)
            }
        });

        console.log('✅ Property updated successfully!');
        console.log('Facilities added:', facilities.length);
        console.log('Location advantages added:', locationAdvantages.length);
        console.log('\nYou can now view the property at:');
        console.log(`http://localhost:3000/p/${property.slug}`);

    } catch (error) {
        console.error('Error updating property:', error);
    } finally {
        await prisma.$disconnect();
    }
}

updateECRProperty();
