import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const bulk = await (prisma as any).bulkDiscountSetting.findUnique({
            where: { id: 'default' }
        });
        const loyalty = await (prisma as any).loyaltySetting.findUnique({
            where: { id: 'default' }
        });

        return NextResponse.json({
            bulk: bulk || { tier1Qty: 5, tier1Discount: 0.10, tier2Qty: 10, tier2Discount: 0.20 },
            loyalty: loyalty || { pointsPerDollar: 1, redemptionValue: 0.01, minPointsToUse: 100 }
        });
    } catch (error) {
        console.error('Error fetching settings:', error);
        return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
    }
}
