import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import {
  FROM_SYSTEM,
  getAdminEmail,
  getResend,
  renderEmail,
  sendEmail,
  siteUrl,
} from '@/lib/email';
import { PaymentSubmittedAdminEmail } from '@/emails/order-emails';

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const order = await prisma.order.findUnique({
      where: { id },
      include: { paymentMethod: true },
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    if (order.status !== 'PENDING') {
      return NextResponse.json({
        success: true,
        status: order.status,
        alreadySubmitted: true,
      });
    }

    await prisma.order.update({
      where: { id },
      data: { status: 'PROCESSING' },
    });

    if (getResend()) {
      try {
        const adminHtml = await renderEmail(
          PaymentSubmittedAdminEmail({
            customerName: order.customerName,
            customerEmail: order.customerEmail,
            orderId: order.id,
            totalAmount: order.totalAmount,
            paymentMethodName: order.paymentMethod?.name || 'Bitcoin',
            paymentDetails: order.paymentMethod?.details || '',
            adminUrl: siteUrl('/admin/orders'),
          }),
        );

        await sendEmail({
          from: FROM_SYSTEM,
          to: getAdminEmail(),
          subject: `Payment Submitted — Order #${order.id.slice(-6).toUpperCase()}`,
          html: adminHtml,
        });
      } catch (emailErr) {
        console.error('[MarkPaid] Failed to send admin email:', emailErr);
      }
    }

    return NextResponse.json({ success: true, status: 'PROCESSING' });
  } catch (error) {
    console.error('[MarkPaid] Error:', error);
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }
}
