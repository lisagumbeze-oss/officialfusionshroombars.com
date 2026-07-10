import { NextResponse } from 'next/server';
import {
    FROM_CONTACT,
    FROM_ORDERS,
    getAdminEmail,
    getResend,
    isDummyResendKey,
    renderEmail,
    sendEmail,
    siteUrl,
} from '@/lib/email';
import { ContactAdminEmail, ContactConfirmationEmail } from '@/emails/contact-emails';

export async function POST(req: Request) {
    try {
        if (!process.env.RESEND_API_KEY) {
            console.error('RESEND_API_KEY is missing');
            return NextResponse.json({ error: 'Email service not configured' }, { status: 500 });
        }

        if (isDummyResendKey(process.env.RESEND_API_KEY)) {
            console.log('Dummy Resend API key detected. Skipping real email send for testing.');
            return NextResponse.json({ success: true, dummy: true });
        }

        const body = await req.json();
        const { name, email, message, subject } = body;

        if (!name || !email || !message) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const inquirySubject = subject || 'General Inquiry';
        const adminUrl = siteUrl('/admin');
        const shopUrl = siteUrl('/shop');
        const blogUrl = siteUrl('/blog');

        const adminHtml = await renderEmail(
            ContactAdminEmail({
                name,
                email,
                subject: inquirySubject,
                message,
                adminUrl,
            }),
        );

        const userHtml = await renderEmail(
            ContactConfirmationEmail({
                name,
                subject: inquirySubject,
                shopUrl,
                blogUrl,
            }),
        );

        if (getResend()) {
            await sendEmail({
                from: FROM_CONTACT,
                to: getAdminEmail(),
                replyTo: email,
                subject: `New Contact Form Submission from ${name}`,
                html: adminHtml,
            });

            await sendEmail({
                from: FROM_ORDERS,
                to: email,
                replyTo: 'order@officialfusionshroombars.com',
                subject: 'We received your message - Fusion Shroom Bars',
                html: userHtml,
            });
        }

        return NextResponse.json({ success: true });
    } catch (error: unknown) {
        console.error('Contact form catch error:', error);
        const message = error instanceof Error ? error.message : 'Internal Server Error';
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
