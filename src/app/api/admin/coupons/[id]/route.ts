import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const cookieStore = await cookies();
        const session = cookieStore.get('admin_session');
        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { id } = await params;
        const body = await request.json();
        const coupon = await (prisma as any).coupon.update({
            where: { id },
            data: body
        });
        return NextResponse.json(coupon);
    } catch (error) {
        console.error('Error updating coupon:', error);
        return NextResponse.json({ error: 'Failed to update coupon' }, { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const cookieStore = await cookies();
        const session = cookieStore.get('admin_session');
        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { id } = await params;
        await (prisma as any).coupon.delete({ where: { id } });
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting coupon:', error);
        return NextResponse.json({ error: 'Failed to delete coupon' }, { status: 500 });
    }
}
