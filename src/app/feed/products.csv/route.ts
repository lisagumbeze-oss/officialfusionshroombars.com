import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { buildGoogleMerchantCsv } from '@/lib/feed-utils';

export async function GET(request: Request) {
    try {
        const origin = process.env.NEXT_PUBLIC_BASE_URL || new URL(request.url).origin;

        const products = await prisma.product.findMany({
            where: { isActive: true },
        });

        const csv = buildGoogleMerchantCsv(products as any, origin);

        return new Response(csv, {
            headers: {
                'Content-Type': 'text/csv; charset=utf-8',
                'X-Content-Type-Options': 'nosniff',
                'Content-Disposition': 'attachment; filename="products.csv"',
                'Cache-Control': 's-maxage=3600, stale-while-revalidate',
            },
        });
    } catch (error: any) {
        console.error('[Feed] CSV generation failed:', error);
        return new Response(`error,${error.message}`, {
            status: 500,
            headers: { 'Content-Type': 'text/csv' },
        });
    }
}
