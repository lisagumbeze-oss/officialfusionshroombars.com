const PLISIO_SECRET_KEY = process.env.PLISIO_API_KEY || 'XLOB9heHLHEOdjAUGOM0T8VmKBR7Tqb82tZemm3Mv19l11hBhAja2a8PFFV4GO-F'; // Fallback for legacy support
const PLISIO_API_URL = 'https://plisio.net/api/v1';

export interface PlisioInvoiceResponse {
    status: string;
    data: {
        txn_id: string;
        invoice_url: string;
        amount: string;
        currency: string;
        order_number: string;
    };
}

export async function createPlisioInvoice(order: {
    id: string;
    totalAmount: number;
    customerEmail: string;
}) {
    // Note: In production, NEXT_PUBLIC_BASE_URL should be set in .env
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://officialfusionshroombars.com';
    const callbackUrl = `${baseUrl}/api/checkout/crypto-callback`;
    const successUrl = `${baseUrl}/orders/confirmation?id=${order.id}`;
    
    const params = new URLSearchParams({
        api_key: PLISIO_SECRET_KEY,
        order_number: order.id,
        order_name: `Order #${order.id} from Fusion Shroom Bars`,
        source_amount: order.totalAmount.toString(),
        source_currency: 'USD',
        email: order.customerEmail,
        callback_url: callbackUrl,
        success_url: successUrl,
        expire_min: '60'
    });

    const response = await fetch(`${PLISIO_API_URL}/invoices/new?${params.toString()}`);
    const resText = await response.text();
    
    let data;
    try {
        data = JSON.parse(resText);
    } catch (e) {
        console.error('[Plisio] Failed to parse response as JSON:', resText);
        throw new Error('Invalid response from Plisio API');
    }

    if (data.status === 'error') {
        console.error('[Plisio] API Error:', data);
        throw new Error(data.data.message || 'Failed to create Plisio invoice');
    }

    return data as PlisioInvoiceResponse;
}

export async function getPlisioInvoiceStatus(txnId: string) {
    const response = await fetch(`${PLISIO_API_URL}/operations/${txnId}?api_key=${PLISIO_SECRET_KEY}`);
    return await response.json();
}
