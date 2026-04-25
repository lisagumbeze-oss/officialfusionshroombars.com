import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

async function checkAuth() {
    const cookieStore = await cookies();
    const session = cookieStore.get('admin_session');
    return !!session;
}

export async function GET(request: Request) {
    if (!await checkAuth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const folderId = searchParams.get('folderId') || null;

    try {
        const assets = await (prisma as any).mediaAsset.findMany({
            where: { folderId },
            orderBy: { createdAt: 'desc' }
        });

        const folders = await (prisma as any).mediaFolder.findMany({
            where: { parentId: folderId },
            orderBy: { name: 'asc' }
        });

        return NextResponse.json({ assets, folders });
    } catch (error) {
        console.error('Media fetch error:', error);
        return NextResponse.json({ error: 'Failed to fetch media' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    if (!await checkAuth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const body = await request.json();
        const { type } = body;

        if (type === 'FOLDER') {
            const folder = await (prisma as any).mediaFolder.create({
                data: {
                    name: body.name,
                    parentId: body.parentId || null
                }
            });
            return NextResponse.json(folder);
        }

        // For Assets, we register a URL (simulating an upload for now)
        const asset = await (prisma as any).mediaAsset.create({
            data: {
                filename: body.filename,
                originalFilename: body.filename,
                mimeType: body.mimeType || 'image/jpeg',
                size: body.size || 0,
                url: body.url,
                altText: body.altText || '',
                caption: body.caption || '',
                folderId: body.folderId || null
            }
        });

        return NextResponse.json(asset);
    } catch (error) {
        console.error('Media creation error:', error);
        return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    if (!await checkAuth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const type = searchParams.get('type'); // 'ASSET' or 'FOLDER'

    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

    try {
        if (type === 'FOLDER') {
            await (prisma as any).mediaFolder.delete({ where: { id } });
        } else {
            await (prisma as any).mediaAsset.delete({ where: { id } });
        }
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    if (!await checkAuth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const body = await request.json();
        const { id, type, ...data } = body;

        if (type === 'FOLDER') {
            const updated = await (prisma as any).mediaFolder.update({
                where: { id },
                data: { name: data.name }
            });
            return NextResponse.json(updated);
        } else {
            const updated = await (prisma as any).mediaAsset.update({
                where: { id },
                data: {
                    altText: data.altText,
                    caption: data.caption,
                    filename: data.filename
                }
            });
            return NextResponse.json(updated);
        }
    } catch (error) {
        return NextResponse.json({ error: 'Update failed' }, { status: 500 });
    }
}
