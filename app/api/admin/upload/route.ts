import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { isAuthenticated } from '@/lib/auth';

export async function POST(request: NextRequest) {
    if (!(await isAuthenticated())) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const formData = await request.formData();
        const files = formData.getAll('images') as File[];
        const slug = formData.get('slug') as string;
        const folder = (formData.get('folder') as string) || 'properties'; // Default to 'properties'

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

            // Generate filename: slug-index-timestamp.extension
            const ext = file.name.split('.').pop();
            const filename = `${slug}-${i + 1}-${Date.now()}.${ext}`;
            const filepath = join(process.cwd(), 'public', folder, filename);

            await writeFile(filepath, buffer);
            uploadedUrls.push(`/${folder}/${filename}`);
        }

        return NextResponse.json({ urls: uploadedUrls }, { status: 200 });
    } catch (error) {
        console.error('Error uploading images:', error);
        return NextResponse.json({ error: 'Failed to upload images' }, { status: 500 });
    }
}
