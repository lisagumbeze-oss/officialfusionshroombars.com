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
    const status = searchParams.get('status'); // PENDING, APPROVED, SPAM, TRASH
    const type = searchParams.get('type') || 'COMMENT'; // COMMENT or REVIEW

    try {
        if (type === 'REVIEW') {
            const reviews = await prisma.review.findMany({
                where: status ? { status } : {},
                include: { product: { select: { name: true, id: true } } },
                orderBy: { createdAt: 'desc' }
            });
            return NextResponse.json(reviews);
        } else {
            const comments = await prisma.comment.findMany({
                where: status ? { status } : {},
                include: { blogPost: { select: { title: true, id: true } } },
                orderBy: { createdAt: 'desc' }
            });
            return NextResponse.json(comments);
        }
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch items' }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    if (!await checkAuth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const body = await request.json();
        const { id, status, type } = body;

        if (type === 'REVIEW') {
            const updated = await prisma.review.update({
                where: { id },
                data: { status }
            });
            return NextResponse.json(updated);
        } else {
            const updated = await prisma.comment.update({
                where: { id },
                data: { status }
            });
            return NextResponse.json(updated);
        }
    } catch (error) {
        return NextResponse.json({ error: 'Update failed' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    if (!await checkAuth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const type = searchParams.get('type') || 'COMMENT';

    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

    try {
        if (type === 'REVIEW') {
            await prisma.review.delete({ where: { id } });
        } else {
            await prisma.comment.delete({ where: { id } });
        }
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
    }
}
