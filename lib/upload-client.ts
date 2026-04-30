/**
 * Upload a single file from the browser to our internal API (which uploads to Cloudinary).
 * Returns the public URL of the uploaded file.
 */
export async function uploadFileToStorage(
    file: File,
    folder: string,
    slug: string,
    index: number
): Promise<string> {
    const formData = new FormData();
    formData.append('images', file);
    formData.append('folder', folder);
    formData.append('slug', slug);

    const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
    });

    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.details || errorData.error || `Failed to upload "${file.name}"`);
    }

    const data = await res.json();
    if (data.urls && data.urls.length > 0) {
        return data.urls[0];
    }
    
    throw new Error('Upload successful but no URL returned');
}
