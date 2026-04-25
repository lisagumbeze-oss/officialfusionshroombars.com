import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { Resend } from 'resend';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        // Simple auth check for fetching orders
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
            items, // Array of { productId, productName, quantity, price }
        } = body;

        if (!customerEmail || !shippingAddress || !paymentMethodId || !items.length) {
            return NextResponse.json({ error: 'Missing required order fields' }, { status: 400 });
        }

        // Use a transaction to ensure atomic stock decrement and order creation
        const order = await prisma.$transaction(async (tx) => {
            // 1. Check and decrement stock for each item
            for (const item of items) {
                if (item.productId) {
                    const product = await tx.product.findUnique({
                        where: { id: item.productId },
                        select: { stock: true, name: true }
                    });

                    if (!product) {
                        throw new Error(`Product ${item.productName} not found`);
                    }

                    if (product.stock < item.quantity) {
                        throw new Error(`Insufficient stock for ${product.name}. Only ${product.stock} left.`);
                    }

                    await tx.product.update({
                        where: { id: item.productId },
                        data: { stock: { decrement: item.quantity } }
                    });
                }
            }

            const loyaltySetting = await (tx as any).loyaltySetting.findUnique({
                where: { id: 'default' }
            });
            const pointsPerDollar = loyaltySetting?.pointsPerDollar ?? 1;
            const pointsEarned = Math.floor(totalAmount * pointsPerDollar);

            // 2. Create the order
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

            // 3. Update Loyalty Points
            await tx.loyaltyAccount.upsert({
                where: { email: customerEmail },
                update: { points: { increment: pointsEarned } },
                create: { email: customerEmail, points: pointsEarned }
            });

            return order;
        });

        // Initialize Resend
        const resendApiKey = process.env.RESEND_API_KEY;
        if (resendApiKey) {
            const resend = new Resend(resendApiKey);
            try {
                // 1. Email to Customer
                await resend.emails.send({
                    from: 'Fusion Shroom Bars <order@officialfusionshroombars.com>', 
                    to: customerEmail,
                    replyTo: 'order@officialfusionshroombars.com',
                    subject: `Order Confirmation #${order.id.slice(-6).toUpperCase()} - Fusion Shroom Bars`,
                    html: `
                        <div style="background-color: #0c0c0c; color: #ffffff; font-family: 'Inter', Arial, sans-serif; padding: 40px; line-height: 1.6;">
                            <div style="max-width: 600px; margin: 0 auto; background: #1a1a1a; border-radius: 16px; border: 1px solid #333; overflow: hidden; box-shadow: 0 25px 60px rgba(0,0,0,0.6);">
                                <div style="background: linear-gradient(135deg, #a855f7 0%, #6b21a8 100%); padding: 40px; text-align: center;">
                                    <div style="font-size: 12px; font-weight: 800; letter-spacing: 4px; text-transform: uppercase; margin-bottom: 10px; opacity: 0.8;">Order Received</div>
                                    <h1 style="margin: 0; font-size: 28px; font-weight: 900; letter-spacing: 1px;">WELCOME TO THE FUSION</h1>
                                </div>
                                <div style="padding: 40px; background-color: #141414;">
                                    <p style="font-size: 16px; color: #cccccc; margin-top: 0;">Hi ${customerName},</p>
                                    <p style="font-size: 16px; color: #cccccc;">Extremely good choice. Your order <strong>#${order.id.slice(-6).toUpperCase()}</strong> has been captured and is currently <strong>AWAITING PAYMENT</strong>.</p>
                                    
                                    <div style="background: #1a1a1a; padding: 30px; border-radius: 12px; border: 1px dotted #444; margin: 30px 0; border: 1px solid #332244;">
                                        <h3 style="margin-top: 0; color: #a855f7; font-size: 14px; text-transform: uppercase; letter-spacing: 2px;">Secured Payment Instructions</h3>
                                        <div style="margin-top: 15px;">
                                            <p style="margin: 5px 0; color: #888; font-size: 13px;">Method</p>
                                            <p style="margin: 0; color: #ffffff; font-size: 16px; font-weight: 600;">${(order as any).paymentMethod?.name}</p>
                                        </div>
                                        <div style="margin-top: 15px;">
                                            <p style="margin: 5px 0; color: #888; font-size: 13px;">Recipient Detail</p>
                                            <p style="margin: 0; color: #ffffff; font-size: 16px; font-weight: 600; background: #222; padding: 8px 12px; display: inline-block; border-radius: 4px;">${(order as any).paymentMethod?.details}</p>
                                        </div>
                                        <div style="margin-top: 15px;">
                                            <p style="margin: 5px 0; color: #888; font-size: 13px;">Final Total</p>
                                            <p style="margin: 0; color: #a855f7; font-size: 24px; font-weight: 900;">$${order.totalAmount.toFixed(2)}</p>
                                        </div>
                                        ${(order as any).paymentMethod?.instructions ? `
                                        <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #333;">
                                            <p style="margin: 0; color: #999; font-size: 13px; font-style: italic;">Note: ${(order as any).paymentMethod.instructions}</p>
                                        </div>` : ''}
                                    </div>

                                    <div style="margin-bottom: 40px;">
                                        <h4 style="color: #ffffff; text-transform: uppercase; font-size: 12px; letter-spacing: 2px; margin-bottom: 15px;">Shipping Destination</h4>
                                        <p style="margin: 0; color: #999; font-size: 15px;">${shippingAddress}</p>
                                    </div>

                                    <div style="text-align: center; padding-top: 20px; border-top: 1px solid #222;">
                                        <p style="color: #666; font-size: 13px;">Once payment is verified, your premium shroom bars will be dispatched.</p>
                                        <p style="color: #a855f7; font-size: 14px; font-weight: 700; margin-top: 20px;">FUSION SHROOM BARS TEAM</p>
                                    </div>
                                </div>
                                <div style="padding: 20px; text-align: center; background-color: #0c0c0c; color: #444; font-size: 10px; text-transform: uppercase; letter-spacing: 3px; font-weight: 700;">
                                    Premium Quality • Discreet Shipping • 100% Authentic
                                </div>
                            </div>
                        </div>
                    `,
                });

                // 2. Notification to Admin
                const adminEmail = process.env.ADMIN_EMAIL || 'order@officialfusionshroombars.com';
                await resend.emails.send({
                    from: 'Fusion System <order@officialfusionshroombars.com>', 
                    to: adminEmail,
                    subject: `New Order Received! 💰 $${totalAmount.toFixed(2)}`,
                    html: `
                        <div style="background-color: #0c0c0c; color: #ffffff; font-family: 'Inter', Arial, sans-serif; padding: 30px;">
                            <div style="max-width: 600px; margin: 0 auto; background: #141414; border-radius: 10px; border: 2px solid #a855f7; overflow: hidden;">
                                <div style="background: #a855f7; padding: 20px; text-align: center;">
                                    <h2 style="margin: 0; color: #ffffff; font-size: 18px; text-transform: uppercase; letter-spacing: 2px;">NEW ORDER ALERT 💰</h2>
                                </div>
                                <div style="padding: 30px;">
                                    <div style="display: flex; justify-content: space-between; margin-bottom: 20px;">
                                        <div>
                                            <p style="margin: 0 0 5px; color: #888; font-size: 11px; text-transform: uppercase;">Customer</p>
                                            <p style="margin: 0; font-size: 16px; font-weight: 700;">${customerName}</p>
                                            <p style="margin: 0; color: #a855f7; font-size: 13px;">${customerEmail}</p>
                                        </div>
                                        <div style="text-align: right;">
                                            <p style="margin: 0 0 5px; color: #888; font-size: 11px; text-transform: uppercase;">Total Value</p>
                                            <p style="margin: 0; font-size: 20px; font-weight: 900; color: #a855f7;">$${order.totalAmount.toFixed(2)}</p>
                                        </div>
                                    </div>
                                    
                                    <div style="background: #0c0c0c; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
                                        <p style="margin: 0 0 10px; color: #888; font-size: 11px; text-transform: uppercase;">Order Items (${order.items.length})</p>
                                        ${order.items.map((item: any) => `
                                            <div style="display: flex; justify-content: space-between; margin-bottom: 8px; border-bottom: 1px solid #222; padding-bottom: 8px;">
                                                <span style="color: #eee;">${item.quantity}x ${item.productName}</span>
                                                <span style="color: #fff; font-weight: 700;">$${item.price.toFixed(2)}</span>
                                            </div>
                                        `).join('')}
                                    </div>

                                    <div style="margin-bottom: 30px;">
                                        <p style="margin: 0 0 5px; color: #888; font-size: 11px; text-transform: uppercase;">Payment Strategy</p>
                                        <p style="margin: 0; color: #ffffff;">${(order as any).paymentMethod?.name}</p>
                                    </div>

                                    <div style="text-align: center;">
                                        <a href="https://officialfusionshroombars.com/admin" style="display: inline-block; background: #ffffff; color: #a855f7; text-decoration: none; padding: 14px 28px; border-radius: 6px; font-weight: 900; font-size: 13px; text-transform: uppercase;">Open Admin Panel</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `,
                });
            } catch (emailErr) {
                console.error('Failed to send emails:', emailErr);
                // We don't fail the order API just because email failed
            }
        }

        return NextResponse.json(order, { status: 201 });
    } catch (error) {
        console.error('Error creating order:', error);
        return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
    }
}
