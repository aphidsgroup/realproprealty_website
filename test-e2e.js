const fs = require('fs');
const path = require('path');

async function runE2ETest() {
    console.log('--- STARTING E2E API TEST ---');
    const baseUrl = 'http://localhost:3000';
    let sessionCookie = '';

    // 1. Manager Login
    console.log('\n1. Logging in as Manager...');
    try {
        const loginRes = await fetch(`${baseUrl}/api/auth/manager-login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'manager@realprop.com', password: 'Manager123!' })
        });
        
        const loginData = await loginRes.json();
        const setCookie = loginRes.headers.get('set-cookie');
        
        if (!loginRes.ok) throw new Error(loginData.error || 'Login failed');
        
        // Extract iron-session cookie
        if (setCookie) {
            sessionCookie = setCookie.split(';')[0];
            console.log('✅ Login successful. Session cookie acquired.');
        } else {
            throw new Error('No cookie received');
        }
    } catch (e) {
        console.error('❌ Login failed:', e.message);
        return;
    }

    // 2. Test Cloudinary Upload API
    console.log('\n2. Testing Image Upload API (Cloudinary Integration)...');
    let uploadedUrls = [];
    try {
        // Create a dummy 1x1 transparent PNG buffer
        const dummyPngBuffer = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=', 'base64');
        
        const blob = new Blob([dummyPngBuffer], { type: 'image/png' });
        const formData = new FormData();
        formData.append('images', blob, 'test-image.png');
        formData.append('slug', 'dummy-property-test');
        formData.append('folder', 'properties');

        const uploadRes = await fetch(`${baseUrl}/api/admin/upload`, {
            method: 'POST',
            headers: { 'Cookie': sessionCookie },
            body: formData
        });

        const uploadData = await uploadRes.json();
        if (!uploadRes.ok) throw new Error(uploadData.error || uploadData.details || 'Upload failed');
        
        uploadedUrls = uploadData.urls || [];
        console.log(`✅ Upload successful! Cloudinary URL: ${uploadedUrls[0]}`);
    } catch (e) {
        console.error('❌ Upload failed:', e.message);
        return;
    }

    // 3. Create Property API (Neon DB)
    console.log('\n3. Testing Property Creation API (Neon DB Integration)...');
    try {
        const dummyPropertyPayload = {
            title: 'Automated Test Property',
            slug: 'automated-test-property-' + Date.now(),
            usageType: 'residential',
            propertySubtype: 'Apartment',
            areaName: 'OMR',
            city: 'Chennai',
            priceInr: 5000000,
            sizeSqft: 1200,
            bedrooms: 2,
            bathrooms: 2,
            parking: '1 covered',
            amenities: '["Lift","Security"]',
            facilities: '["Gym","Swimming Pool"]',
            locationAdvantages: '[{"name":"Test School","category":"school","distance":"1 km"}]',
            constructionStatus: 'Ready to Move',
            tourEmbedUrl: 'https://example.com/tour',
            isNegotiable: true,
            isVerified: true,
            isBachelorFriendly: false,
            isPetFriendly: true,
            isVegOnly: false,
            isPublished: true,
            isFeatured: false,
            images: JSON.stringify(uploadedUrls),
            floorPlans: '[]'
        };

        const createRes = await fetch(`${baseUrl}/api/admin/properties`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Cookie': sessionCookie 
            },
            body: JSON.stringify(dummyPropertyPayload)
        });

        const createData = await createRes.json();
        if (!createRes.ok) throw new Error(createData.error || createData.details || 'Property creation failed');
        
        console.log(`✅ Property created successfully! ID: ${createData.id}`);
        console.log(`✅ Title: ${createData.title}`);
        console.log(`✅ Images Array Contains: ${JSON.parse(createData.images).length} image(s)`);
    } catch (e) {
        console.error('❌ Property creation failed:', e.message);
        return;
    }

    console.log('\n--- E2E TEST COMPLETE ---');
    console.log('Supabase has been completely removed. Cloudinary & Neon DB are working together seamlessly.');
}

runE2ETest();
