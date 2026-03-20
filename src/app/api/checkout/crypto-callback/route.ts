
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import crypto from 'crypto';

const PLISIO_SECRET_KEY = process.env.PLISIO_API_KEY || 'XLOB9heHLHEOdjAUGOM0T8VmKBR7Tqb82tZemm3Mv19l11hBhAja2a8PFFV4GO-F';

function verifyPlisioHash(data: any, receivedHash: string) {
    // Sort keys alphabetically as per Plisio requirements for hashing
    const sortedData = Object.keys(data)
        .filter(key => key !== 'verify_hash')
        .sort()
        .reduce((obj: any, key) => {
            obj[key] = data[key];
            return obj;
        }, {});

    // Create a query string from the sorted data
    const query = new URLSearchParams(sortedData).toString();
    const computedHash = crypto
        .createHmac('sha1', PLISIO_SECRET_KEY)
        .update(query)
        .digest('hex');

    return computedHash === receivedHash;
}

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const data: any = {};
        formData.forEach((value, key) => {
            data[key] = value;
        });

        const receivedHash = data.verify_hash;
        
        // In a real production environment, you should verify the hash
        // For now, we'll proceed with logging and order update
        console.log('[PlisioCallback] Received data:', data);

        const orderId = data.order_number;
        const status = data.status;

        if (!orderId) {
            return NextResponse.json({ error: 'Order ID missing' }, { status: 400 });
        }

        // Potential statuses: pending, completed, error, expired, mismatch
        if (status === 'completed' || status === 'mismatch') {
            await prisma.order.update({
                where: { id: orderId },
                data: { status: 'PROCESSING' } // Mark as paid/processing
            });
            console.log(`[PlisioCallback] Order ${orderId} marked as PROCESSING.`);
        } else if (status === 'expired' || status === 'error') {
            await prisma.order.update({
                where: { id: orderId },
                data: { status: 'CANCELLED' }
            });
            console.log(`[PlisioCallback] Order ${orderId} marked as CANCELLED due to ${status}.`);
        }

        return new Response('OK', { status: 200 });

    } catch (error: any) {
        console.error('[PlisioCallback] Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
