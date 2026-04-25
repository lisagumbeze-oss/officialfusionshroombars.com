import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { code } = await request.json();

    if (!code) {
      return NextResponse.json({ error: 'Promo code is required' }, { status: 400 });
    }

    const coupon = await (prisma as any).coupon.findUnique({
      where: { code: code.toUpperCase() }
    });

    if (!coupon) {
      return NextResponse.json({ error: 'Invalid promo code' }, { status: 404 });
    }

    if (!coupon.isActive) {
      return NextResponse.json({ error: 'This promo code is no longer active' }, { status: 400 });
    }

    if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
      return NextResponse.json({ error: 'This promo code has expired' }, { status: 400 });
    }

    if (coupon.maxUsage && coupon.usageCount >= coupon.maxUsage) {
      return NextResponse.json({ error: 'This promo code has reached its maximum usage' }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      coupon: {
        code: coupon.code,
        discount: coupon.discount,
        type: coupon.type
      }
    });

  } catch (error) {
    console.error('[Coupon Validation Error]:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
