import prisma from '@/lib/prisma';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ChevronLeft, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import type { Metadata } from 'next';
import CommentForm from '@/components/CommentForm';
import styles from './post.module.css';

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const post = await (prisma as any).blogPost.findUnique({
        where: { slug, isPublic: true }
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
            tags: post.tags ? JSON.parse(post.tags) : []
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
                }
            }
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
    } catch (e) {}

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": post.title,
        "image": post.image,
        "datePublished": post.createdAt.toISOString(),
        "dateModified": post.updatedAt.toISOString(),
        "author": [{
            "@type": "Organization",
            "name": "Fusion Shroom Bars",
            "url": "https://officialfusionshroombars.com"
        }],
        "description": post.excerpt || post.content.substring(0, 160),
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": `https://officialfusionshroombars.com/blog/${post.slug}`
        }
    };

    return (
        <div className={styles.postContainer}>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            {/* Editorial Hero */}
            <header className={styles.hero}>
                {post.image ? (
                    <Image
                        src={post.image}
                        alt={post.imageAlt || post.title}
                        fill
                        priority
                        style={{ objectFit: 'cover', objectPosition: 'center', zIndex: 1 }}
                    />
                ) : (
                    <div style={{ position: 'absolute', inset: 0, zIndex: 1, background: '#111' }} />
                )}
                
                <div className={styles.heroGradient} />

                <div className={styles.heroContent}>
                    <Link href="/blog" className={styles.backLink}>
                        <ChevronLeft size={16} /> Returns to Journal
                    </Link>

                    {post.category && (
                        <div><span className={styles.categoryTag}>{post.category}</span></div>
                    )}

                    <h1 className={styles.title}>{post.title}</h1>

                    <div className={styles.metaRow}>
                        <div className={styles.metaItem}>
                            <span className={styles.metaLabel}>Published</span>
                            <span className={styles.metaValue}>{new Date(post.createdAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                        </div>
                        <div className={styles.metaItem}>
                            <span className={styles.metaLabel}>Author</span>
                            <span className={styles.metaValue}>The Fusion Team</span>
                        </div>
                        <div className={styles.metaItem}>
                            <span className={styles.metaLabel}>Read Time</span>
                            <span className={styles.metaValue}>5 MIN READ</span>
                        </div>
                    </div>
                </div>
            </header>

            {/* Post Body */}
            <div className={styles.mainContent}>
                {post.excerpt && (
                    <div className={styles.excerptBlock}>
                        <p className={styles.excerptText}>&ldquo;{post.excerpt}&rdquo;</p>
                    </div>
                )}

                <article 
                    className={styles.articleBody}
                    dangerouslySetInnerHTML={{ __html: post.content }}
                />

                <div className={styles.shareSection}>
                    <span className={styles.shareLabel}>Share the Read</span>
                    <button className={styles.shareBtn}>Facebook</button>
                    <button className={styles.shareBtn}>X</button>
                    <button className={styles.shareBtn}>Link</button>
                </div>

                {/* Comments */}
                <section className={styles.commentsSection}>
                    <h2 className={styles.sectionTitle}>Join the Conversation</h2>
                    
                    <div className={styles.commentList}>
                        {post.comments && post.comments.length > 0 ? (
                            post.comments.map((c: any) => (
                                <div key={c.id} className={styles.commentCard}>
                                    <div className={styles.commentHeader}>
                                        <span className={styles.commentAuthor}>{c.name}</span>
                                        <span className={styles.commentDate}>
                                            {new Date(c.createdAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                                        </span>
                                    </div>
                                    <p className={styles.commentText}>{c.content}</p>
                                </div>
                            ))
                        ) : (
                            <div className={styles.noComments}>
                                No reflections yet. Be the first to share yours.
                            </div>
                        )}
                    </div>

                    <CommentForm blogPostId={post.id} />
                </section>
            </div>

            {/* Related */}
            {relatedPosts.length > 0 && (
                <section className={styles.relatedSection}>
                    <div className={styles.relatedHeader}>
                        <div>
                            <h2 className={styles.relatedTitle}>Further Reading</h2>
                        </div>
                        <Link href="/blog" className={styles.viewAllLink}>
                            The Journal Archive <ArrowRight size={16} />
                        </Link>
                    </div>
                    <div className={styles.relatedGrid}>
                        {relatedPosts.map((rPost: any) => (
                            <Link href={`/blog/${rPost.slug}`} key={rPost.id} className={styles.relatedCard}>
                                <div className={styles.relatedImage}>
                                    <Image src={rPost.image || '/images/art-fusion.png'} alt={rPost.title} fill style={{ objectFit: 'cover' }} />
                                </div>
                                <div className={styles.relatedContent}>
                                    <h3 className={styles.relatedCardTitle}>{rPost.title}</h3>
                                    <p className={styles.relatedCardExcerpt}>{rPost.excerpt}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
}
