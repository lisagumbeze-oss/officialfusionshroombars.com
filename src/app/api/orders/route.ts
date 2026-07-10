import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { Resend } from 'resend';
import { cookies } from 'next/headers';
import {
    FROM_ORDERS,
    FROM_SYSTEM,
    getAdminEmail,
    getResend,
    renderEmail,
    sendEmail,
    siteUrl,
} from '@/lib/email';
import { OrderAdminAlertEmail, OrderConfirmationEmail } from '@/emails/order-emails';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const cookieStore = await cookies();
        const session = cookieStore.get('admin_session');
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const orders = await prisma.order.findMany({
            include: {
                items: true,
                paymentMethod: true,
            },
            orderBy: { createdAt: 'desc' },
        });
        return NextResponse.json(orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const {
            customerName,
            customerEmail,
            customerPhone,
            shippingAddress,
            shippingMethod,
            shippingPrice,
            totalAmount,
            paymentMethodId,
            items,
        } = body;

        if (!customerEmail || !customerPhone?.trim() || !shippingAddress || !paymentMethodId || !items.length) {
            return NextResponse.json({ error: 'Missing required order fields' }, { status: 400 });
        }

        const order = await prisma.$transaction(async (tx) => {
            for (const item of items) {
                if (item.productId) {
                    const product = await tx.product.findUnique({
                        where: { id: item.productId },
                        select: { stock: true, name: true },
                    });

                    if (!product) {
                        throw new Error(`Product ${item.productName} not found`);
                    }

                    if (product.stock < item.quantity) {
                        throw new Error(`Insufficient stock for ${product.name}. Only ${product.stock} left.`);
                    }

                    await tx.product.update({
                        where: { id: item.productId },
                        data: { stock: { decrement: item.quantity } },
                    });
                }
            }

            const loyaltySetting = await (tx as any).loyaltySetting.findUnique({
                where: { id: 'default' },
            });
            const pointsPerDollar = loyaltySetting?.pointsPerDollar ?? 1;
            const pointsEarned = Math.floor(totalAmount * pointsPerDollar);

            const order = await tx.order.create({
                data: {
                    customerName,
                    customerEmail,
                    customerPhone,
                    shippingAddress,
                    shippingMethod,
                    shippingPrice,
                    totalAmount,
                    paymentMethodId,
                    pointsEarned,
                    items: {
                        create: items.map((item: any) => ({
                            productId: item.productId,
                            productName: item.productName,
                            quantity: item.quantity,
                            price: item.price,
                        })),
                    },
                },
                include: {
                    items: true,
                    paymentMethod: true,
                },
            });

            await tx.loyaltyAccount.upsert({
                where: { email: customerEmail },
                update: { points: { increment: pointsEarned } },
                create: { email: customerEmail, points: pointsEarned },
            });

            return order;
        });

        if (getResend()) {
            try {
                const paymentMethod = (order as any).paymentMethod;
                const customerHtml = await renderEmail(
                    OrderConfirmationEmail({
                        customerName,
                        orderId: order.id,
                        totalAmount: order.totalAmount,
                        shippingAddress,
                        paymentMethodName: paymentMethod?.name || 'Manual Payment',
                        paymentDetails: paymentMethod?.details || '',
                        paymentInstructions: paymentMethod?.instructions,
                        shopUrl: siteUrl('/shop'),
                        contactUrl: siteUrl('/contact'),
                    }),
                );

                await sendEmail({
                    from: FROM_ORDERS,
                    to: customerEmail,
                    replyTo: 'order@officialfusionshroombars.com',
                    subject: `Order Confirmation #${order.id.slice(-6).toUpperCase()} - Fusion Shroom Bars`,
                    html: customerHtml,
                });

                const adminHtml = await renderEmail(
                    OrderAdminAlertEmail({
                        customerName,
                        customerEmail,
                        orderId: order.id,
                        totalAmount: order.totalAmount,
                        items: order.items.map((item) => ({
                            productName: item.productName,
                            quantity: item.quantity,
                            price: item.price,
                        })),
                        paymentMethodName: paymentMethod?.name || 'Manual Payment',
                        adminUrl: siteUrl('/admin'),
                    }),
                );

                await sendEmail({
                    from: FROM_SYSTEM,
                    to: getAdminEmail(),
                    subject: `New Order Received! $${totalAmount.toFixed(2)}`,
                    html: adminHtml,
                });
            } catch (emailErr) {
                console.error('Failed to send emails:', emailErr);
            }
        }

        return NextResponse.json(order, { status: 201 });
    } catch (error) {
        console.error('Error creating order:', error);
        return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
    }
}
