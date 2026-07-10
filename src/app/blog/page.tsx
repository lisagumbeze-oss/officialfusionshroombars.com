import prisma from '@/lib/prisma';
import Image from 'next/image';
import Link from 'next/link';
import {
    ArrowRight,
    Search,
    ChevronLeft,
    ChevronRight,
    ShoppingBag,
    CircleHelp,
    FlaskConical,
    Mail,
} from 'lucide-react';
import type { Metadata } from 'next';
import styles from './page.module.css';
import { Reveal } from '@/components/Reveal';
import NewsletterForm from '@/components/NewsletterForm';

export const metadata: Metadata = {
    title: 'Journal | Fusion Shroom Bars',
    description: 'Insights, news, and education from the world of premium psilocybin. Discover the science and soul behind every official Fusion Shroom Bar.',
    alternates: {
        canonical: 'https://officialfusionshroombars.com/blog',
    },
};

export const revalidate = 3600;

const CATEGORIES = ['All Stories', 'Wellness & Microdosing', 'Science & Research', 'Lifestyle'];

const CROSS_LINKS = [
    { href: '/shop', icon: ShoppingBag, label: 'The collection' },
    { href: '/faq', icon: CircleHelp, label: 'Knowledge base' },
    { href: '/about', icon: FlaskConical, label: 'Our process' },
    { href: '/contact', icon: Mail, label: 'Contact us' },
];

function buildBlogUrl({
    page,
    search,
    category,
}: {
    page?: number;
    search?: string;
    category?: string;
}) {
    const params = new URLSearchParams();
    if (page && page > 1) params.set('page', String(page));
    if (search) params.set('search', search);
    if (category && category !== 'All Stories') params.set('category', category);
    const query = params.toString();
    return query ? `/blog?${query}` : '/blog';
}

export default async function BlogPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const params = await searchParams;
    const search = typeof params.search === 'string' ? params.search : '';
    const category = typeof params.category === 'string' ? params.category : 'All Stories';
    const page = typeof params.page === 'string' ? parseInt(params.page) : 1;
    const limit = 6;
    const skip = (page - 1) * limit;

    let posts: any[] = [];
    let totalPosts = 0;

    try {
        const where: any = { isPublic: true };
        if (category !== 'All Stories') where.category = category;
        if (search) {
            where.OR = [
                { title: { contains: search, mode: 'insensitive' } },
                { content: { contains: search, mode: 'insensitive' } },
                { excerpt: { contains: search, mode: 'insensitive' } },
            ];
        }

        [posts, totalPosts] = await Promise.all([
            (prisma as any).blogPost.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            (prisma as any).blogPost.count({ where }),
        ]);
    } catch (error) {
        console.error('[BlogPage] Database error:', error);
    }

    const totalPages = Math.ceil(totalPosts / limit);
    const featuredPost = page === 1 && !search && category === 'All Stories' ? posts[0] : null;
    const displayPosts = featuredPost ? posts.slice(1) : posts;

    const heroStats = [
        { value: String(totalPosts), label: 'Articles' },
        { value: String(CATEGORIES.length - 1), label: 'Topics' },
        { value: 'Weekly', label: 'Updates' },
    ];

    return (
        <div className={styles.blogPage}>
            {/* Editorial Hero */}
            <section className={styles.editorialHero}>
                <div className={`grain-overlay ${styles.heroGrain}`} aria-hidden />
                <div className={styles.heroOrbit} aria-hidden />

                <div className={styles.heroInner}>
                    <Reveal>
                        <span className={styles.heroTag}>Editorial journal</span>
                        <h1 className={styles.heroTitle}>
                            Stories &<br /><em>insights</em>
                        </h1>
                    </Reveal>
                    <Reveal delay={0.15}>
                        <p className={styles.heroDesc}>
                            Insights into artisanal psilocybin, science, and the art of
                            modern wellness.
                        </p>
                    </Reveal>
                    <Reveal delay={0.25}>
                        <div className={styles.heroStats}>
                            {heroStats.map((stat) => (
                                <div key={stat.label} className={styles.heroStat}>
                                    <strong>{stat.value}</strong>
                                    <span>{stat.label}</span>
                                </div>
                            ))}
                        </div>
                    </Reveal>
                    <Reveal delay={0.35}>
                        <div className={styles.heroActions}>
                            <a href="#journal" className={`${styles.heroCta} btn-shine`}>
                                Browse stories
                                <ArrowRight size={18} />
                            </a>
                            <Link href="/shop" className={styles.heroSecondary}>
                                Explore products
                            </Link>
                        </div>
                    </Reveal>
                </div>
            </section>

            {/* Marquee */}
            <div className={styles.marqueeContainer}>
                <div className={styles.marqueeContent}>
                    <span>Microdosing guides</span> • <span>Wellness rituals</span> • <span>Science & research</span> • <span>Consciousness</span> •
                    <span>Microdosing guides</span> • <span>Wellness rituals</span> • <span>Science & research</span> • <span>Consciousness</span> •
                </div>
            </div>

            {/* Journal Content */}
            <section className={styles.contentSection} id="journal">
                <div className={styles.container}>
                    {/* Featured Post */}
                    {featuredPost && (
                        <Reveal>
                            <article className={styles.featuredArticle}>
                                <Image
                                    src={featuredPost.image || '/images/art-fusion.png'}
                                    alt={featuredPost.title}
                                    fill
                                    className={styles.featuredImage}
                                    priority
                                />
                                <div className={styles.featuredContent}>
                                    <span className={styles.coverTag}>Cover story</span>
                                    <h2 className={styles.featuredTitle}>{featuredPost.title}</h2>
                                    <p className={styles.featuredExcerpt}>{featuredPost.excerpt}</p>
                                    <Link href={`/blog/${featuredPost.slug}`} className={styles.readMoreBtn}>
                                        Read feature
                                        <ArrowRight size={18} />
                                    </Link>
                                </div>
                            </article>
                        </Reveal>
                    )}

                    {/* Controls */}
                    <Reveal delay={0.1}>
                        <div className={styles.controls}>
                            <div className={styles.categories}>
                                {CATEGORIES.map((cat) => (
                                    <Link
                                        key={cat}
                                        href={buildBlogUrl({ search, category: cat })}
                                        className={`${styles.catBtn} ${category === cat ? styles.catBtnActive : ''}`}
                                    >
                                        {cat}
                                    </Link>
                                ))}
                            </div>
                            <form action="/blog" method="GET" className={styles.searchForm}>
                                {category !== 'All Stories' && (
                                    <input type="hidden" name="category" value={category} />
                                )}
                                <Search className={styles.searchIcon} size={18} />
                                <input
                                    type="text"
                                    name="search"
                                    defaultValue={search}
                                    placeholder="Search journal..."
                                    aria-label="Search journal"
                                />
                            </form>
                        </div>
                    </Reveal>

                    {/* Grid */}
                    {displayPosts.length > 0 ? (
                        <div className={styles.grid}>
                            {displayPosts.map((post: any, idx: number) => (
                                <Reveal key={post.id} delay={0.05 * idx}>
                                    <article className={styles.articleCard}>
                                        <Link href={`/blog/${post.slug}`} className={styles.articleLinkWrap}>
                                            <div className={styles.articleImage}>
                                                <Image
                                                    src={post.image || '/images/art-fusion.png'}
                                                    alt={post.title}
                                                    fill
                                                    className={styles.articleImg}
                                                />
                                                {post.category && (
                                                    <span className={styles.articleTag}>{post.category}</span>
                                                )}
                                            </div>
                                            <div className={styles.articleContent}>
                                                <div className={styles.meta}>
                                                    <time dateTime={post.createdAt}>
                                                        {new Date(post.createdAt).toLocaleDateString(undefined, {
                                                            month: 'long',
                                                            day: 'numeric',
                                                            year: 'numeric',
                                                        })}
                                                    </time>
                                                    <span aria-hidden>•</span>
                                                    <span>5 min read</span>
                                                </div>
                                                <h3 className={styles.articleTitle}>{post.title}</h3>
                                                <p className={styles.articleExcerpt}>{post.excerpt}</p>
                                                <span className={styles.articleLink}>
                                                    Read article
                                                    <ArrowRight size={16} />
                                                </span>
                                            </div>
                                        </Link>
                                    </article>
                                </Reveal>
                            ))}
                        </div>
                    ) : (
                        <div className={styles.emptyState}>
                            <p>No stories found. Try another search term or category.</p>
                            <Link href="/blog" className={styles.heroSecondary}>
                                View all stories
                            </Link>
                        </div>
                    )}

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <nav className={styles.pagination} aria-label="Blog pagination">
                            {page > 1 && (
                                <Link
                                    href={buildBlogUrl({ page: page - 1, search, category })}
                                    className={styles.pageBtn}
                                    aria-label="Previous page"
                                >
                                    <ChevronLeft size={20} />
                                </Link>
                            )}
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                                <Link
                                    key={n}
                                    href={buildBlogUrl({ page: n, search, category })}
                                    className={`${styles.pageBtn} ${n === page ? styles.pageBtnActive : ''}`}
                                    aria-current={n === page ? 'page' : undefined}
                                >
                                    {n}
                                </Link>
                            ))}
                            {page < totalPages && (
                                <Link
                                    href={buildBlogUrl({ page: page + 1, search, category })}
                                    className={styles.pageBtn}
                                    aria-label="Next page"
                                >
                                    <ChevronRight size={20} />
                                </Link>
                            )}
                        </nav>
                    )}
                </div>
            </section>

            {/* Newsletter */}
            <section className={styles.newsletterSection}>
                <div className={styles.newsletterInner}>
                    <Reveal>
                        <span className={styles.sectionLabel}>Stay connected</span>
                        <h2 className={styles.newsletterTitle}>The insider brief</h2>
                        <p className={styles.newsletterDesc}>
                            Join our private mailing list for early access to product drops,
                            deep-dives into psilocybin research, and exclusive community events.
                        </p>
                        <NewsletterForm />
                    </Reveal>
                </div>
            </section>

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
                        </div>
                    </Reveal>
                </div>
            </section>
        </div>
    );
}
