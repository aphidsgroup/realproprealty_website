import { createClient } from '@supabase/supabase-js';

// Client-side Supabase client for direct browser uploads
// These are public/anon keys - safe to expose in the browser
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://cqxkhkwzkbonplsfmdcl.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNxeGtoa3d6a2JvbnBsc2ZtZGNsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA5MTY1NDcsImV4cCI6MjA4NjQ5MjU0N30.3USGzY9K5mtLEejxZ4amysfpjHRsmBqIDbsHMLLhUTI';

export const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);

export const STORAGE_BUCKET = 'property-images';

/**
 * Upload a file directly from the browser to Supabase Storage.
 * Returns the public URL of the uploaded file.
 */
export async function uploadFileToStorage(
    file: File,
    folder: string,
    slug: string,
    index: number
): Promise<string> {
    const ext = file.name.split('.').pop() || 'png';
    const filename = `${slug}-${index}-${Date.now()}.${ext}`;
    const storagePath = `${folder}/${filename}`;

    const { data, error } = await supabaseClient.storage
        .from(STORAGE_BUCKET)
        .upload(storagePath, file, {
            contentType: file.type || 'image/png',
            upsert: true,
        });

    if (error) {
        throw new Error(`Failed to upload "${file.name}": ${error.message}`);
    }

    const { data: urlData } = supabaseClient.storage
        .from(STORAGE_BUCKET)
        .getPublicUrl(storagePath);

    return urlData.publicUrl;
}
