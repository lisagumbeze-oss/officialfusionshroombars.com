import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import {
    FROM_ORDERS,
    FROM_SYSTEM,
    getAdminEmail,
    getResend,
    isDummyResendKey,
    renderEmail,
    sendEmail,
    siteUrl,
} from '@/lib/email';
import { NewsletterAdminEmail, NewsletterWelcomeEmail } from '@/emails/newsletter-emails';

export async function POST(request: Request) {
    try {
        if (!process.env.RESEND_API_KEY) {
            return NextResponse.json({ error: 'Email service not configured' }, { status: 500 });
        }

        if (isDummyResendKey(process.env.RESEND_API_KEY)) {
            return NextResponse.json({ success: true, dummy: true });
        }

        const { email } = await request.json();
        const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';

        if (!normalizedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
            return NextResponse.json({ error: 'Please provide a valid email address' }, { status: 400 });
        }

        const existing = await (prisma as any).newsletterSubscriber.findUnique({
            where: { email: normalizedEmail },
        });

        if (existing?.isActive) {
            return NextResponse.json({ success: true, alreadySubscribed: true });
        }

        await (prisma as any).newsletterSubscriber.upsert({
            where: { email: normalizedEmail },
            update: { isActive: true },
            create: { email: normalizedEmail },
        });

        if (getResend()) {
            const shopUrl = siteUrl('/shop');
            const blogUrl = siteUrl('/blog');
            const adminUrl = siteUrl('/admin');

            const welcomeHtml = await renderEmail(
                NewsletterWelcomeEmail({
                    email: normalizedEmail,
                    shopUrl,
                    blogUrl,
                }),
            );

            const adminHtml = await renderEmail(
                NewsletterAdminEmail({
                    email: normalizedEmail,
                    adminUrl,
                }),
            );

            await sendEmail({
                from: FROM_ORDERS,
                to: normalizedEmail,
                replyTo: 'order@officialfusionshroombars.com',
                subject: 'Welcome to The Insider Brief - Fusion Shroom Bars',
                html: welcomeHtml,
            });

            await sendEmail({
                from: FROM_SYSTEM,
                to: getAdminEmail(),
                subject: `New Newsletter Subscriber: ${normalizedEmail}`,
                html: adminHtml,
            });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('[Newsletter API] Error:', error);
        return NextResponse.json({ error: 'Failed to subscribe' }, { status: 500 });
    }
}
