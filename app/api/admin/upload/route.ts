import { NextRequest, NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

export const runtime = 'nodejs';

const BUCKET_NAME = 'property-images';

export async function POST(request: NextRequest) {
    if (!(await isAuthenticated())) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const formData = await request.formData();
        const files = formData.getAll('images') as File[];
        const slug = formData.get('slug') as string;
        const folder = (formData.get('folder') as string) || 'properties';

        if (!files || files.length === 0) {
            return NextResponse.json({ error: 'No files uploaded' }, { status: 400 });
        }

        if (!slug) {
            return NextResponse.json({ error: 'Property slug is required' }, { status: 400 });
        }

        const uploadedUrls: string[] = [];

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const bytes = await file.arrayBuffer();
            const buffer = Buffer.from(bytes);

            // Generate filename: folder/slug-index-timestamp.extension
            const ext = file.name.split('.').pop() || 'png';
            const filename = `${slug}-${i + 1}-${Date.now()}.${ext}`;
            const storagePath = `${folder}/${filename}`;

            // Upload to Supabase Storage
            const { data, error } = await supabase.storage
                .from(BUCKET_NAME)
                .upload(storagePath, buffer, {
                    contentType: file.type || 'image/png',
                    upsert: true,
                });

            if (error) {
                console.error(`Error uploading file ${filename}:`, error);
                throw new Error(`Failed to upload ${filename}: ${error.message}`);
            }

            // Get the public URL
            const { data: urlData } = supabase.storage
                .from(BUCKET_NAME)
                .getPublicUrl(storagePath);

            uploadedUrls.push(urlData.publicUrl);
        }

        return NextResponse.json({ urls: uploadedUrls }, { status: 200 });
    } catch (error) {
        console.error('Error uploading images:', error);
        const msg = error instanceof Error ? error.message : String(error);
        return NextResponse.json({ error: 'Failed to upload images', details: msg }, { status: 500 });
    }
}
