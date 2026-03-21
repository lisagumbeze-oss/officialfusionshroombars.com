import prisma from '@/lib/prisma';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Search, ChevronLeft, ChevronRight, Mail } from 'lucide-react';
import type { Metadata } from 'next';
import styles from './page.module.css';

export const metadata: Metadata = {
    title: 'Journal | Fusion Shroom Bars',
    description: 'Insights, news, and education from the world of premium psilocybin. Discover the science and soul behind every official Fusion Shroom Bar.',
    alternates: {
        canonical: 'https://officialfusionshroombars.com/blog',
    },
};

export const revalidate = 3600;

export default async function BlogPage({
    searchParams
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
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
            (prisma as any).blogPost.count({ where })
        ]);
    } catch (error) {
        console.error('[BlogPage] Database error:', error);
    }

    const totalPages = Math.ceil(totalPosts / limit);
    const featuredPost = page === 1 && !search && category === 'All Stories' ? posts[0] : null;
    const displayPosts = featuredPost ? posts.slice(1) : posts;
    const categories = ['All Stories', 'Wellness & Microdosing', 'Science & Research', 'Lifestyle'];

    return (
        <div className={styles.blogContainer}>
            <header className={styles.header}>
                <h1 className={styles.title}>Editorial Journal</h1>
                <p className={styles.subtitle}>Insights into artisanal psilocybin, science, and the art of modern wellness.</p>
            </header>

            {/* Featured Post */}
            {featuredPost && (
                <div className={styles.featuredArticle}>
                    <Image
                        src={featuredPost.image || '/images/art-fusion.png'}
                        alt={featuredPost.title}
                        fill
                        style={{ objectFit: 'cover' }}
                        priority
                    />
                    <div className={styles.featuredContent}>
                        <span className={styles.tag}>Cover Story</span>
                        <h2 className={styles.featuredTitle}>{featuredPost.title}</h2>
                        <p className={styles.featuredExcerpt}>{featuredPost.excerpt}</p>
                        <Link href={`/blog/${featuredPost.slug}`} className={styles.readMoreBtn}>
                            Read Feature <ArrowRight size={20} />
                        </Link>
                    </div>
                </div>
            )}

            {/* Controls */}
            <div className={styles.controls}>
                <div className={styles.categories}>
                    {categories.map((cat) => (
                        <Link
                            key={cat}
                            href={`/blog?category=${encodeURIComponent(cat)}${search ? `&search=${encodeURIComponent(search)}` : ''}`}
                            className={`${styles.catBtn} ${category === cat ? styles.active : ''}`}
                        >
                            {cat}
                        </Link>
                    ))}
                </div>
                <form action="/blog" method="GET" className={styles.searchForm}>
                    {category !== 'All Stories' && <input type="hidden" name="category" value={category} />}
                    <Search className={styles.searchIcon} size={20} />
                    <input type="text" name="search" defaultValue={search} placeholder="Search journal..." />
                </form>
            </div>

            {/* Grid */}
            {displayPosts.length > 0 ? (
                <div className={styles.grid}>
                    {displayPosts.map((post: any) => (
                        <div key={post.id} className={styles.articleCard}>
                            <Link href={`/blog/${post.slug}`} style={{ textDecoration: 'none' }}>
                                <div className={styles.articleImage}>
                                    <Image src={post.image || '/images/art-fusion.png'} alt={post.title} fill style={{ objectFit: 'cover' }} />
                                    {post.category && <span className={styles.articleTag}>{post.category}</span>}
                                </div>
                                <div className={styles.articleContent}>
                                    <div className={styles.meta}>
                                        {new Date(post.createdAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                                        <span>•</span>
                                        5 MIN READ
                                    </div>
                                    <h3 className={styles.articleTitle}>{post.title}</h3>
                                    <p className={styles.articleExcerpt}>{post.excerpt}</p>
                                    <span className={styles.articleLink}>Read Article <ArrowRight size={16} /></span>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            ) : (
                <div style={{ textAlign: 'center', padding: '6rem 0', color: '#888' }}>
                    <p>No stories found. Please try another search term.</p>
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className={styles.pagination}>
                    {page > 1 && (
                        <Link href={`/blog?page=${page - 1}${search ? `&search=${encodeURIComponent(search)}` : ''}${category !== 'All Stories' ? `&category=${encodeURIComponent(category)}` : ''}`} className={styles.pageBtn}>
                            <ChevronLeft size={20} />
                        </Link>
                    )}
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                        <Link 
                            key={n} 
                            href={`/blog?page=${n}${search ? `&search=${encodeURIComponent(search)}` : ''}${category !== 'All Stories' ? `&category=${encodeURIComponent(category)}` : ''}`}
                            className={`${styles.pageBtn} ${n === page ? styles.active : ''}`}
                        >
                            {n}
                        </Link>
                    ))}
                    {page < totalPages && (
                        <Link href={`/blog?page=${page + 1}${search ? `&search=${encodeURIComponent(search)}` : ''}${category !== 'All Stories' ? `&category=${encodeURIComponent(category)}` : ''}`} className={styles.pageBtn}>
                            <ChevronRight size={20} />
                        </Link>
                    )}
                </div>
            )}

            {/* Newsletter */}
            <div className={styles.newsletter}>
                <h2>The Insider Brief</h2>
                <p>Join our private mailing list for early access to product drops, deep-dives into psilocybin research, and exclusive community events.</p>
                <form className={styles.newsletterForm}>
                    <input type="email" placeholder="Enter your email address" required />
                    <button type="submit">Subscribe</button>
                </form>
            </div>
        </div>
    );
}
