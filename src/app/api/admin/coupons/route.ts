import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const cookieStore = await cookies();
        const session = cookieStore.get('admin_session');
        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const coupons = await (prisma as any).coupon.findMany({
            orderBy: { createdAt: 'desc' }
        });
        return NextResponse.json(coupons);
    } catch (error) {
        console.error('Error fetching coupons:', error);
        return NextResponse.json({ error: 'Failed to fetch coupons' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const cookieStore = await cookies();
        const session = cookieStore.get('admin_session');
        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const body = await request.json();
        const coupon = await (prisma as any).coupon.create({
            data: {
                code: body.code,
                discount: body.discount,
                type: body.type,
                maxUsage: body.maxUsage || null,
                expiresAt: body.expiresAt ? new Date(body.expiresAt) : null,
            }
        });
        return NextResponse.json(coupon, { status: 201 });
    } catch (error: any) {
        if (error?.code === 'P2002') {
            return NextResponse.json({ error: 'A coupon with this code already exists' }, { status: 409 });
        }
        console.error('Error creating coupon:', error);
        return NextResponse.json({ error: 'Failed to create coupon' }, { status: 500 });
    }
}
