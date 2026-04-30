
const { PrismaClient } = require('@prisma/client');
const cloudinary = require('cloudinary').v2;

async function runTests() {
    console.log('--- STARTING DIAGNOSTICS ---');
    
    // Test Neon DB Connection
    console.log('\n1. Testing Neon DB Connection...');
    const prisma = new PrismaClient();
    try {
        const count = await prisma.property.count();
        console.log(`✅ Database connected successfully! Found ${count} properties in Neon.`);
    } catch (e) {
        console.log(`❌ Database connection failed:`, e.message);
    } finally {
        await prisma.$disconnect();
    }

    // Test Cloudinary Upload
    console.log('\n2. Testing Cloudinary Image Upload...');
    try {
        if (!process.env.CLOUDINARY_URL) {
            throw new Error('CLOUDINARY_URL is missing from .env');
        }
        
        // create a tiny 1x1 png base64 to test upload
        const testImage = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";
        
        const result = await cloudinary.uploader.upload(testImage, {
            folder: 'realprop/test'
        });
        
        console.log(`✅ Cloudinary upload successful!`);
        console.log(`   Public URL: ${result.secure_url}`);
        
        // Clean up test image
        await cloudinary.uploader.destroy(result.public_id);
        console.log(`   Cleaned up test image.`);
    } catch (e) {
        console.log(`❌ Cloudinary upload failed:`, e.message);
    }
    
    console.log('\n--- DIAGNOSTICS COMPLETE ---');
}

runTests();
