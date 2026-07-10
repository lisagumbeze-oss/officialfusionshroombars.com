import prisma from '@/lib/prisma';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ChevronLeft, ArrowRight, ShoppingBag, CircleHelp, FlaskConical } from 'lucide-react';
import Link from 'next/link';
import type { Metadata } from 'next';
import CommentForm from '@/components/CommentForm';
import { Reveal } from '@/components/Reveal';
import styles from './post.module.css';

export const revalidate = 3600;

const CROSS_LINKS = [
    { href: '/shop', icon: ShoppingBag, label: 'The collection' },
    { href: '/faq', icon: CircleHelp, label: 'Knowledge base' },
    { href: '/about', icon: FlaskConical, label: 'Our process' },
];

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const post = await (prisma as any).blogPost.findUnique({
        where: { slug, isPublic: true },
    });

    if (!post) {
        return { title: 'Post Not Found | Fusion Shroom Bars' };
    }

    return {
        title: post.seoTitle || `${post.title} | Official Fusion Shroom Bars`,
        description: post.seoDescription || post.excerpt || post.content.substring(0, 160),
        keywords: post.seoKeywords || undefined,
        alternates: {
            canonical: `https://officialfusionshroombars.com/blog/${slug}`,
        },
        openGraph: {
            title: post.seoTitle || post.title,
            description: post.seoDescription || post.excerpt || post.content.substring(0, 160),
            images: post.image ? [post.image] : [],
            type: 'article',
            publishedTime: post.createdAt.toISOString(),
            authors: ['Fusion Team'],
            tags: post.tags ? JSON.parse(post.tags) : [],
        },
    };
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    let post: any = null;

    try {
        post = await (prisma as any).blogPost.findUnique({
            where: { slug, isPublic: true },
            include: {
                comments: {
                    orderBy: { createdAt: 'desc' },
                },
            },
        });
    } catch (error) {
        console.error('[BlogPost] Database error:', error);
    }

    if (!post) notFound();

    let relatedPosts: any[] = [];
    try {
        relatedPosts = await (prisma as any).blogPost.findMany({
            where: { isPublic: true, slug: { not: slug } },
            take: 3,
            orderBy: { createdAt: 'desc' },
        });
    } catch {
        /* non-critical */
    }

    const publishedDate = new Date(post.createdAt).toLocaleDateString(undefined, {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
    });

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: post.title,
        image: post.image,
        datePublished: post.createdAt.toISOString(),
        dateModified: post.updatedAt.toISOString(),
        author: [{
            '@type': 'Organization',
            name: 'Fusion Shroom Bars',
            url: 'https://officialfusionshroombars.com',
        }],
        description: post.excerpt || post.content.substring(0, 160),
        mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': `https://officialfusionshroombars.com/blog/${post.slug}`,
        },
    };

    return (
        <div className={styles.postPage}>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            {/* Hero */}
            <header className={styles.hero}>
                {post.image ? (
                    <Image
                        src={post.image}
                        alt={post.imageAlt || post.title}
                        fill
                        priority
                        className={styles.heroImage}
                    />
                ) : (
                    <div className={styles.heroFallback} aria-hidden />
                )}
                <div className={`grain-overlay ${styles.heroGrain}`} aria-hidden />
                <div className={styles.heroGradient} />
                <div className={styles.heroScrim} aria-hidden />

                <div className={styles.heroContent}>
                    <div className={styles.heroPanel}>
                    <Reveal>
                        <Link href="/blog" className={styles.backLink}>
                            <ChevronLeft size={16} />
                            Back to journal
                        </Link>
                    </Reveal>

                    {post.category && (
                        <Reveal delay={0.1}>
                            <span className={styles.categoryTag}>{post.category}</span>
                        </Reveal>
                    )}

                    <Reveal delay={0.15}>
                        <h1 className={styles.title}>{post.title}</h1>
                    </Reveal>

                    <Reveal delay={0.25}>
                        <div className={styles.metaRow}>
                            <div className={styles.metaItem}>
                                <span className={styles.metaLabel}>Published</span>
                                <time className={styles.metaValue} dateTime={post.createdAt}>
                                    {publishedDate}
                                </time>
                            </div>
                            <div className={styles.metaItem}>
                                <span className={styles.metaLabel}>Author</span>
                                <span className={styles.metaValue}>The Fusion Team</span>
                            </div>
                            <div className={styles.metaItem}>
                                <span className={styles.metaLabel}>Read time</span>
                                <span className={styles.metaValue}>5 min read</span>
                            </div>
                        </div>
                    </Reveal>
                    </div>
                </div>
            </header>

            {/* Body */}
            <div className={styles.mainContent}>
                {post.excerpt && (
                    <Reveal>
                        <blockquote className={styles.excerptBlock}>
                            <p className={styles.excerptText}>&ldquo;{post.excerpt}&rdquo;</p>
                        </blockquote>
                    </Reveal>
                )}

                <Reveal delay={0.1}>
                    <article
                        className={styles.articleBody}
                        dangerouslySetInnerHTML={{ __html: post.content }}
                    />
                </Reveal>

                <Reveal delay={0.15}>
                    <div className={styles.shareSection}>
                        <span className={styles.shareLabel}>Share</span>
                        <button type="button" className={styles.shareBtn}>Facebook</button>
                        <button type="button" className={styles.shareBtn}>X</button>
                        <button type="button" className={styles.shareBtn}>Copy link</button>
                    </div>
                </Reveal>

                <section className={styles.commentsSection}>
                    <Reveal>
                        <div className={styles.sectionHeader}>
                            <span className={styles.sectionLabel}>Discussion</span>
                            <h2 className={styles.sectionTitle}>Join the conversation</h2>
                        </div>
                    </Reveal>

                    <div className={styles.commentList}>
                        {post.comments && post.comments.length > 0 ? (
                            post.comments.map((c: any, idx: number) => (
                                <Reveal key={c.id} delay={0.05 * idx}>
                                    <div className={styles.commentCard}>
                                        <div className={styles.commentHeader}>
                                            <span className={styles.commentAuthor}>{c.name}</span>
                                            <time className={styles.commentDate} dateTime={c.createdAt}>
                                                {new Date(c.createdAt).toLocaleDateString(undefined, {
                                                    month: 'long',
                                                    day: 'numeric',
                                                    year: 'numeric',
                                                })}
                                            </time>
                                        </div>
                                        <p className={styles.commentText}>{c.content}</p>
                                    </div>
                                </Reveal>
                            ))
                        ) : (
                            <Reveal>
                                <div className={styles.noComments}>
                                    No reflections yet. Be the first to share yours.
                                </div>
                            </Reveal>
                        )}
                    </div>

                    <Reveal delay={0.2}>
                        <CommentForm blogPostId={post.id} />
                    </Reveal>
                </section>
            </div>

            {/* Related */}
            {relatedPosts.length > 0 && (
                <section className={styles.relatedSection}>
                    <div className={styles.relatedInner}>
                        <Reveal>
                            <div className={styles.relatedHeader}>
                                <div>
                                    <span className={styles.sectionLabel}>Continue reading</span>
                                    <h2 className={styles.relatedTitle}>Further reading</h2>
                                </div>
                                <Link href="/blog" className={styles.viewAllLink}>
                                    Journal archive
                                    <ArrowRight size={16} />
                                </Link>
                            </div>
                        </Reveal>
                        <div className={styles.relatedGrid}>
                            {relatedPosts.map((rPost: any, idx: number) => (
                                <Reveal key={rPost.id} delay={0.1 * idx}>
                                    <Link href={`/blog/${rPost.slug}`} className={styles.relatedCard}>
                                        <div className={styles.relatedImage}>
                                            <Image
                                                src={rPost.image || '/images/art-fusion.png'}
                                                alt={rPost.title}
                                                fill
                                                className={styles.relatedImg}
                                            />
                                        </div>
                                        <div className={styles.relatedContent}>
                                            <h3 className={styles.relatedCardTitle}>{rPost.title}</h3>
                                            <p className={styles.relatedCardExcerpt}>{rPost.excerpt}</p>
                                            <span className={styles.relatedLink}>
                                                Read article
                                                <ArrowRight size={14} />
                                            </span>
                                        </div>
                                    </Link>
                                </Reveal>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Cross-links */}
            <section className={styles.ctaSection}>
                <div className={styles.ctaInner}>
                    <Reveal>
                        <h2 className={styles.ctaTitle}>Explore more</h2>
                        <p className={styles.ctaDesc}>
                            Discover products, answers, and the story behind every Fusion bar.
                        </p>
                    </Reveal>
                    <Reveal delay={0.2}>
                        <div className={styles.crossLinks}>
                            {CROSS_LINKS.map((link) => {
                                const Icon = link.icon;
                                return (
                                    <Link key={link.href} href={link.href} className={styles.crossLink}>
                                        <Icon size={16} />
                                        {link.label}
                                    </Link>
                                );
                            })}
                            <Link href="/blog" className={styles.crossLink}>
                                <ArrowRight size={16} />
                                All articles
                            </Link>
                        </div>
                    </Reveal>
                </div>
            </section>
        </div>
    );
}
