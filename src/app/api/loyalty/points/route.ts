import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const account = await (prisma as any).loyaltyAccount.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (!account) {
      return NextResponse.json({ points: 0 });
    }

    return NextResponse.json({ points: account.points });

  } catch (error) {
    console.error('[Loyalty Points Error]:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
