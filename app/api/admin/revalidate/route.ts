import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { isAuthenticated } from '@/lib/auth';

export const runtime = 'nodejs';

export async function POST(request: Request) {
    if (!(await isAuthenticated())) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();
        const paths = body.paths || ['/', '/list'];

        for (const path of paths) {
            revalidatePath(path);
        }

        return NextResponse.json({ success: true, revalidated: paths });
    } catch (error) {
        console.error('Revalidation error:', error);
        return NextResponse.json({ error: 'Revalidation failed' }, { status: 500 });
    }
}
