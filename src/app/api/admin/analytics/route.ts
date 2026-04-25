import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const cookieStore = await cookies();
        const session = cookieStore.get('admin_session');
        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const now = new Date();
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

        // All orders
        const allOrders = await prisma.order.findMany({
            include: { items: true },
            orderBy: { createdAt: 'desc' }
        });

        // Current period orders (last 30 days)
        const currentOrders = allOrders.filter(o => new Date(o.createdAt) >= thirtyDaysAgo);
        // Previous period orders (30-60 days ago)
        const prevOrders = allOrders.filter(o => new Date(o.createdAt) >= sixtyDaysAgo && new Date(o.createdAt) < thirtyDaysAgo);

        const totalRevenue = currentOrders.reduce((s, o) => s + o.totalAmount, 0);
        const prevRevenue = prevOrders.reduce((s, o) => s + o.totalAmount, 0);
        const revenueChange = prevRevenue > 0 ? ((totalRevenue - prevRevenue) / prevRevenue * 100) : 0;

        const totalOrders = currentOrders.length;
        const prevOrdersCount = prevOrders.length;
        const ordersChange = prevOrdersCount > 0 ? ((totalOrders - prevOrdersCount) / prevOrdersCount * 100) : 0;

        const aov = totalOrders > 0 ? totalRevenue / totalOrders : 0;

        // Unique customer emails
        const currentEmails = new Set(currentOrders.map(o => o.customerEmail));
        const prevEmails = new Set(prevOrders.map(o => o.customerEmail));
        const newCustomers = [...currentEmails].filter(e => !prevEmails.has(e)).length;

        // Revenue by day (last 30 days)
        const revenueByDay: { date: string; revenue: number; orders: number }[] = [];
        for (let i = 29; i >= 0; i--) {
            const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
            const dateStr = d.toISOString().split('T')[0];
            const dayOrders = currentOrders.filter(o => o.createdAt.toISOString().split('T')[0] === dateStr);
            revenueByDay.push({
                date: dateStr,
                revenue: dayOrders.reduce((s, o) => s + o.totalAmount, 0),
                orders: dayOrders.length
            });
        }

        // Top products
        const productSales: Record<string, { name: string; units: number; revenue: number }> = {};
        for (const order of allOrders) {
            for (const item of order.items) {
                if (!productSales[item.productName]) {
                    productSales[item.productName] = { name: item.productName, units: 0, revenue: 0 };
                }
                productSales[item.productName].units += item.quantity;
                productSales[item.productName].revenue += item.price * item.quantity;
            }
        }
        const topProducts = Object.values(productSales)
            .sort((a, b) => b.revenue - a.revenue)
            .slice(0, 5);

        // Recent orders
        const recentOrders = allOrders.slice(0, 8).map(o => ({
            id: o.id,
            customer: o.customerName,
            total: o.totalAmount,
            status: o.status,
            date: o.createdAt
        }));

        // Order status distribution
        const statusCounts = allOrders.reduce((acc: Record<string, number>, o) => {
            acc[o.status] = (acc[o.status] || 0) + 1;
            return acc;
        }, {});

        return NextResponse.json({
            kpis: {
                totalRevenue,
                revenueChange: Math.round(revenueChange * 10) / 10,
                totalOrders,
                ordersChange: Math.round(ordersChange * 10) / 10,
                aov: Math.round(aov * 100) / 100,
                newCustomers,
                pendingOrders: allOrders.filter(o => o.status === 'PENDING').length,
                totalProducts: await prisma.product.count()
            },
            revenueByDay,
            topProducts,
            recentOrders,
            statusCounts
        });
    } catch (error) {
        console.error('[Analytics API Error]:', error);
        return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
    }
}
