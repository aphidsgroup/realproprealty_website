import { NextRequest, NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

export const runtime = 'nodejs';

// Increase body size limit for image uploads (default is 4.5MB)
export const maxDuration = 60; // 60 seconds timeout

const BUCKET_NAME = 'property-images';

export async function POST(request: NextRequest) {
    console.log('[Upload] Upload request received');

    try {
        // Check auth first
        const authed = await isAuthenticated();
        console.log('[Upload] Auth check result:', authed);

        if (!authed) {
            return NextResponse.json({ error: 'Unauthorized', details: 'Session not authenticated. Please log in again.' }, { status: 401 });
        }

        const formData = await request.formData();
        const files = formData.getAll('images') as File[];
        const slug = formData.get('slug') as string;
        const folder = (formData.get('folder') as string) || 'properties';

        console.log('[Upload] Files count:', files?.length);
        console.log('[Upload] Slug:', slug);
        console.log('[Upload] Folder:', folder);

        if (!files || files.length === 0) {
            return NextResponse.json({ error: 'No files uploaded', details: 'No files were found in the request.' }, { status: 400 });
        }

        if (!slug) {
            return NextResponse.json({ error: 'Property slug is required', details: 'The slug field was empty or missing.' }, { status: 400 });
        }

        const uploadedUrls: string[] = [];

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            console.log(`[Upload] Processing file ${i + 1}/${files.length}: ${file.name}, size: ${file.size}, type: ${file.type}`);

            const bytes = await file.arrayBuffer();
            const buffer = Buffer.from(bytes);

            // Generate filename: folder/slug-index-timestamp.extension
            const ext = file.name.split('.').pop() || 'png';
            const filename = `${slug}-${i + 1}-${Date.now()}.${ext}`;
            const storagePath = `${folder}/${filename}`;

            console.log(`[Upload] Uploading to Supabase Storage: ${storagePath}`);

            // Upload to Supabase Storage
            const { data, error } = await supabase.storage
                .from(BUCKET_NAME)
                .upload(storagePath, buffer, {
                    contentType: file.type || 'image/png',
                    upsert: true,
                });

            if (error) {
                console.error(`[Upload] Supabase upload error for ${filename}:`, error);
                return NextResponse.json({
                    error: 'Failed to upload image',
                    details: `Supabase error for file "${file.name}": ${error.message}`,
                }, { status: 500 });
            }

            console.log(`[Upload] Successfully uploaded: ${storagePath}`);

            // Get the public URL
            const { data: urlData } = supabase.storage
                .from(BUCKET_NAME)
                .getPublicUrl(storagePath);

            uploadedUrls.push(urlData.publicUrl);
        }

        console.log(`[Upload] All ${files.length} files uploaded successfully`);
        return NextResponse.json({ urls: uploadedUrls }, { status: 200 });
    } catch (error) {
        console.error('[Upload] FATAL ERROR:', error);
        const msg = error instanceof Error ? error.message : String(error);
        const stack = error instanceof Error ? error.stack : 'N/A';
        console.error('[Upload] Error stack:', stack);
        return NextResponse.json({
            error: 'Failed to upload images',
            details: msg,
        }, { status: 500 });
    }
}
