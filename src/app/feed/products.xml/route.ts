import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { buildGoogleMerchantXml } from '@/lib/feed-utils';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const origin = process.env.NEXT_PUBLIC_BASE_URL || new URL(request.url).origin;

        const products = await prisma.product.findMany({
            where: { isActive: true },
        });

        const xml = buildGoogleMerchantXml(products as any, origin);

        return new Response(xml, {
            headers: {
                'Content-Type': 'text/xml; charset=utf-8',
                'X-Content-Type-Options': 'nosniff',
                'Cache-Control': 's-maxage=3600, stale-while-revalidate',
            },
        });
    } catch (error: any) {
        console.error('[Feed] XML generation failed:', error);
        return new Response(`<?xml version="1.0" encoding="UTF-8"?><error>${error.message}</error>`, {
            status: 500,
            headers: { 'Content-Type': 'text/xml' },
        });
    }
}
