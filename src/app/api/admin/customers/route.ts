import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const cookieStore = await cookies();
        const session = cookieStore.get('admin_session');
        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const orders = await prisma.order.findMany({
            include: { items: true },
            orderBy: { createdAt: 'desc' }
        });

        // Aggregate by email
        const customerMap: Record<string, {
            email: string;
            name: string;
            orders: number;
            totalSpent: number;
            lastOrder: Date;
            firstOrder: Date;
        }> = {};

        for (const order of orders) {
            const email = order.customerEmail.toLowerCase();
            if (!customerMap[email]) {
                customerMap[email] = {
                    email,
                    name: order.customerName,
                    orders: 0,
                    totalSpent: 0,
                    lastOrder: order.createdAt,
                    firstOrder: order.createdAt
                };
            }
            customerMap[email].orders++;
            customerMap[email].totalSpent += order.totalAmount;
            if (order.createdAt > customerMap[email].lastOrder) {
                customerMap[email].lastOrder = order.createdAt;
                customerMap[email].name = order.customerName;
            }
            if (order.createdAt < customerMap[email].firstOrder) {
                customerMap[email].firstOrder = order.createdAt;
            }
        }

        const customers = Object.values(customerMap).sort((a, b) => b.totalSpent - a.totalSpent);
        return NextResponse.json(customers);
    } catch (error) {
        console.error('Error fetching customers:', error);
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}
