import { NextRequest, NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/auth';
import { v2 as cloudinary } from 'cloudinary';

export const runtime = 'nodejs';

// Increase body size limit for image uploads
export const maxDuration = 60; // 60 seconds timeout

export async function POST(request: NextRequest) {
    try {
        if (!(await isAuthenticated())) {
            return NextResponse.json({ error: 'Unauthorized', details: 'Session not authenticated.' }, { status: 401 });
        }

        const formData = await request.formData();
        const files = formData.getAll('images') as File[];
        const slug = formData.get('slug') as string;
        const folder = (formData.get('folder') as string) || 'properties';

        if (!files || files.length === 0) {
            return NextResponse.json({ error: 'No files uploaded', details: 'No files were found.' }, { status: 400 });
        }

        if (!slug) {
            return NextResponse.json({ error: 'Property slug is required', details: 'The slug field was empty.' }, { status: 400 });
        }

        const uploadedUrls: string[] = [];

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const bytes = await file.arrayBuffer();
            const buffer = Buffer.from(bytes);

            const result = await new Promise((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    {
                        folder: `realprop/${folder}/${slug}`,
                        resource_type: 'auto'
                    },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    }
                );
                uploadStream.end(buffer);
            });

            uploadedUrls.push((result as any).secure_url);
        }

        return NextResponse.json({ urls: uploadedUrls }, { status: 200 });
    } catch (error) {
        console.error('[Upload] FATAL ERROR:', error);
        return NextResponse.json({
            error: 'Failed to upload images',
            details: String(error),
        }, { status: 500 });
    }
}
