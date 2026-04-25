import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const cookieStore = await cookies();
        const session = cookieStore.get('admin_session');
        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const accounts = await (prisma as any).loyaltyAccount.findMany({
            orderBy: { points: 'desc' }
        });
        return NextResponse.json(accounts);
    } catch (error) {
        console.error('Error fetching loyalty accounts:', error);
        return NextResponse.json({ error: 'Failed to fetch loyalty accounts' }, { status: 500 });
    }
}

export async function PATCH(request: Request) {
    try {
        const cookieStore = await cookies();
        const session = cookieStore.get('admin_session');
        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { email, points, action } = await request.json();
        
        if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 });

        if (action === 'add') {
            const account = await (prisma as any).loyaltyAccount.upsert({
                where: { email },
                update: { points: { increment: points } },
                create: { email, points }
            });
            return NextResponse.json(account);
        } else if (action === 'set') {
            const account = await (prisma as any).loyaltyAccount.upsert({
                where: { email },
                update: { points },
                create: { email, points }
            });
            return NextResponse.json(account);
        } else if (action === 'deduct') {
            const existing = await (prisma as any).loyaltyAccount.findUnique({ where: { email } });
            if (!existing) return NextResponse.json({ error: 'Account not found' }, { status: 404 });
            const newPoints = Math.max(0, existing.points - points);
            const account = await (prisma as any).loyaltyAccount.update({
                where: { email },
                data: { points: newPoints }
            });
            return NextResponse.json(account);
        }

        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    } catch (error) {
        console.error('Error updating loyalty account:', error);
        return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
    }
}
