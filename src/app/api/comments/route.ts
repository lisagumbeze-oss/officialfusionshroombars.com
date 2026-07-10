import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import {
    FROM_SYSTEM,
    FROM_ORDERS,
    getAdminEmail,
    getResend,
    renderEmail,
    sendEmail,
    siteUrl,
} from '@/lib/email';
import { CommentAdminEmail, CommentConfirmationEmail } from '@/emails/comment-emails';

export async function POST(request: Request) {
    try {
        const { name, email, content, blogPostId, turnstileToken } = await request.json();

        if (!name || !content || !blogPostId || !turnstileToken) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

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

        const blogPost = await prisma.blogPost.findUnique({
            where: { id: blogPostId },
            select: { title: true, slug: true },
        });

        const comment = await (prisma as any).comment.create({
            data: {
                name,
                email: email || null,
                content,
                blogPostId,
            },
        });

        if (getResend()) {
            try {
                const postTitle = blogPost?.title || 'Blog Article';
                const postUrl = blogPost?.slug ? siteUrl(`/blog/${blogPost.slug}`) : siteUrl('/blog');
                const adminUrl = siteUrl('/admin');
                const shopUrl = siteUrl('/shop');
                const blogUrl = siteUrl('/blog');

                const adminHtml = await renderEmail(
                    CommentAdminEmail({
                        name,
                        email,
                        content,
                        postTitle,
                        postUrl,
                        adminUrl,
                    }),
                );

                await sendEmail({
                    from: FROM_SYSTEM,
                    to: getAdminEmail(),
                    subject: `New Comment from ${name}`,
                    html: adminHtml,
                });

                if (email) {
                    const userHtml = await renderEmail(
                        CommentConfirmationEmail({
                            name,
                            postTitle,
                            blogUrl,
                            shopUrl,
                        }),
                    );

                    await sendEmail({
                        from: FROM_ORDERS,
                        to: email,
                        replyTo: 'order@officialfusionshroombars.com',
                        subject: 'Your comment has been submitted - Fusion Shroom Bars',
                        html: userHtml,
                    });
                }
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
