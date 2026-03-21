import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
    try {
        const { name, content, blogPostId, turnstileToken } = await request.json();

        if (!name || !content || !blogPostId || !turnstileToken) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Verify Turnstile Token
        const verifyUrl = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
        const verifyResponse = await fetch(verifyUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `secret=${process.env.CLOUDFLARE_SECRET_KEY}&response=${turnstileToken}`,
        });

        const verifyData = await verifyResponse.json();

        if (!verifyData.success) {
            return NextResponse.json({ error: 'Spam verification failed. Please try again.' }, { status: 403 });
        }

        // Save Comment
        const comment = await (prisma as any).comment.create({
            data: {
                name,
                content,
                blogPostId,
            },
        });

        // Proactive: Send notification email via Resend
        if (process.env.RESEND_API_KEY) {
            try {
                await resend.emails.send({
                    from: 'Fusion System <order@officialfusionshroombars.com>',
                    to: ['order@officialfusionshroombars.com'],
                    subject: `New Comment from ${name}`,
                    html: `
                        <div style="background-color: #f9fafb; padding: 40px; font-family: sans-serif;">
                            <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; border: 1px solid #e5e7eb; padding: 30px;">
                                <h2 style="color: #111827; margin-top: 0;">New Comment Posted</h2>
                                <p style="color: #4b5563;"><strong>Name:</strong> ${name}</p>
                                <p style="color: #4b5563;"><strong>Post ID:</strong> ${blogPostId}</p>
                                <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; color: #374151; margin: 20px 0;">
                                    ${content}
                                </div>
                                <a href="https://officialfusionshroombars.com/admin" style="display: inline-block; background: #8B5E34; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 999px; font-weight: bold;">Moderate Comment</a>
                            </div>
                        </div>
                    `
                });
            } catch (err) {
                console.error('[Comments API] Email failed:', err);
            }
        }

        return NextResponse.json(comment, { status: 201 });
    } catch (error) {
        console.error('[Comments API] Error:', error);
        return NextResponse.json({ error: 'Failed to post comment' }, { status: 500 });
    }
}
