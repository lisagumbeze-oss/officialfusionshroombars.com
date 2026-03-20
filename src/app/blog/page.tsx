import prisma from '@/lib/prisma';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Search, ChevronLeft, ChevronRight, Mail, Sparkles } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Blog | Fusion Shroom Bars',
    description: 'Insights, news, and education from the world of premium psilocybin. Discover the science and soul behind every official Fusion Shroom Bar.',
    alternates: {
        canonical: 'https://officialfusionshroombars.com/blog',
    },
    openGraph: {
        title: 'Blog | Fusion Shroom Bars',
        description: 'Explore our latest articles on wellness, microdosing, and the science of psilocybin.',
        images: ['/og-blog.jpg'],
    }
};

export const revalidate = 3600; // Incrementally regenerate page every hour

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
    let dbError = false;

    try {
        const where: any = { isPublic: true };
        
        if (category !== 'All Stories') {
            where.category = category;
        }

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
        dbError = true;
    }

    const totalPages = Math.ceil(totalPosts / limit);
    const featuredPost = page === 1 && !search && category === 'All Stories' ? posts[0] : null;
    const displayPosts = featuredPost ? posts.slice(1) : posts;
    const categories = ['All Stories', 'Wellness & Microdosing', 'Product Launch', 'Science & Research', 'Community Stories', 'Lifestyle'];

    return (
        <div className="min-h-screen" style={{ background: '#ffffff', color: '#1a1a1a', fontFamily: "'Inter', sans-serif" }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px 24px 60px' }}>
                <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', fontWeight: 900, letterSpacing: '-0.02em', marginBottom: '32px', lineHeight: 1.1, color: '#1a1a1a' }}>Fusion Shroom Bars Blog: Artisanal Insights & Wellness Mastery</h1>

                {/* =================== HERO FEATURED SECTION =================== */}
                {featuredPost && (
                    <section style={{
                        position: 'relative',
                        borderRadius: '24px',
                        overflow: 'hidden',
                        marginBottom: '48px',
                        minHeight: '420px',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.05)',
                    }}>
                        <Image
                            src={featuredPost.image || '/images/art-fusion.png'}
                            alt={featuredPost.title}
                            fill
                            className="object-cover"
                            priority
                        />
                        {/* Gradient overlay */}
                        <div style={{
                            position: 'absolute', inset: 0,
                            background: 'linear-gradient(to top, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.7) 40%, rgba(255,255,255,0.2) 70%, transparent 100%)',
                        }} />
                        <div style={{
                            position: 'absolute', inset: 0,
                            background: 'linear-gradient(to right, rgba(255,255,255,0.4) 0%, transparent 60%)',
                        }} />

                        {/* Content */}
                        <div style={{
                            position: 'absolute', bottom: 0, left: 0,
                            padding: '40px',
                            maxWidth: '600px',
                            zIndex: 10,
                        }}>
                            <span style={{
                                display: 'inline-block',
                                padding: '6px 16px',
                                borderRadius: '999px',
                                background: '#7c3aed',
                                fontSize: '10px',
                                fontWeight: 800,
                                textTransform: 'uppercase',
                                letterSpacing: '0.15em',
                                marginBottom: '16px',
                                color: '#fff',
                            }}>
                                Featured Story
                            </span>
                            <h2 style={{
                                fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
                                fontWeight: 900,
                                lineHeight: 1.1,
                                marginBottom: '12px',
                                letterSpacing: '-0.02em',
                                color: '#1a1a1a',
                            }}>
                                {featuredPost.title}
                            </h2>
                            <p style={{
                                color: '#4b5563',
                                fontSize: '14px',
                                lineHeight: 1.6,
                                marginBottom: '20px',
                                maxWidth: '480px',
                            }}>
                                {featuredPost.excerpt || 'Discover the latest insights into our artisanal process and wellness philosophy.'}
                            </p>
                            <Link
                                href={`/blog/${featuredPost.slug}`}
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    padding: '12px 28px',
                                    borderRadius: '999px',
                                    background: '#7c3aed',
                                    fontSize: '12px',
                                    fontWeight: 800,
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.1em',
                                    color: '#fff',
                                    textDecoration: 'none',
                                    transition: 'transform 0.2s',
                                    boxShadow: '0 10px 20px rgba(124, 58, 237, 0.2)',
                                }}
                            >
                                Read Featured Story <ArrowRight size={14} />
                            </Link>
                        </div>
                    </section>
                )}

                {/* =================== CATEGORY FILTERS & SEARCH =================== */}
                <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '16px',
                    marginBottom: '40px',
                }}>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {categories.map((cat) => (
                            <Link
                                key={cat}
                                href={`/blog?category=${encodeURIComponent(cat)}${search ? `&search=${encodeURIComponent(search)}` : ''}`}
                                style={{
                                    padding: '8px 20px',
                                    borderRadius: '999px',
                                    fontSize: '11px',
                                    fontWeight: 700,
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.08em',
                                    border: category === cat ? '2px solid #7c3aed' : '2px solid rgba(0,0,0,0.08)',
                                    background: category === cat ? '#7c3aed' : '#fff',
                                    color: category === cat ? '#fff' : '#4b5563',
                                    textDecoration: 'none',
                                    transition: 'all 0.2s',
                                }}
                            >
                                {cat}
                            </Link>
                        ))}
                    </div>
                    <form action="/blog" method="GET" style={{ position: 'relative', width: '260px', maxWidth: '100%' }}>
                        {category !== 'All Stories' && <input type="hidden" name="category" value={category} />}
                        <Search style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} size={16} />
                        <input
                            type="text"
                            name="search"
                            defaultValue={search}
                            placeholder="Search insights..."
                            style={{
                                width: '100%',
                                padding: '10px 16px 10px 40px',
                                borderRadius: '999px',
                                background: '#f9fafb',
                                border: '1px solid rgba(0,0,0,0.08)',
                                color: '#1a1a1a',
                                fontSize: '13px',
                                outline: 'none',
                            }}
                        />
                    </form>
                </div>

                {/* =================== LATEST INSIGHTS GRID =================== */}
                <section>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '28px' }}>
                        <Sparkles size={20} style={{ color: '#7c3aed' }} />
                        <h3 style={{
                            fontSize: '20px',
                            fontWeight: 900,
                            letterSpacing: '-0.01em',
                            color: '#1a1a1a',
                        }}>
                            {search ? `Search results for "${search}"` : category !== 'All Stories' ? `${category} Insights` : 'Latest Insights'}
                        </h3>
                    </div>

                    {displayPosts.length > 0 ? (
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                            gap: '24px',
                        }}>
                            {displayPosts.map((post: any) => (
                                <article key={post.id} style={{
                                    borderRadius: '20px',
                                    overflow: 'hidden',
                                    background: '#ffffff',
                                    border: '1px solid rgba(0,0,0,0.05)',
                                    boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
                                    transition: 'transform 0.3s, border-color 0.3s',
                                }}>
                                    <Link href={`/blog/${post.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                        <div style={{ position: 'relative', aspectRatio: '16/10', overflow: 'hidden' }}>
                                            <Image
                                                src={post.image || '/images/art-fusion.png'}
                                                alt={post.title}
                                                fill
                                                className="object-cover"
                                            />
                                            {post.category && (
                                                <span style={{
                                                    position: 'absolute',
                                                    top: '12px',
                                                    left: '12px',
                                                    padding: '4px 12px',
                                                    borderRadius: '999px',
                                                    background: '#7c3aed',
                                                    fontSize: '9px',
                                                    fontWeight: 800,
                                                    textTransform: 'uppercase',
                                                    letterSpacing: '0.1em',
                                                    color: '#fff',
                                                }}>
                                                    {post.category}
                                                </span>
                                            )}
                                        </div>
                                        <div style={{ padding: '24px' }}>
                                            <div style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '8px',
                                                fontSize: '10px',
                                                fontWeight: 600,
                                                color: '#6b7280',
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.06em',
                                                marginBottom: '10px',
                                            }}>
                                                <span>{new Date(post.createdAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                                                <span style={{ width: '3px', height: '3px', borderRadius: '50%', background: '#d1d5db' }} />
                                                <span>5 min read</span>
                                            </div>
                                            <h4 style={{
                                                fontSize: '18px',
                                                fontWeight: 800,
                                                lineHeight: 1.3,
                                                marginBottom: '10px',
                                                color: '#1a1a1a',
                                            }}>
                                                {post.title}
                                            </h4>
                                            <p style={{
                                                color: '#4b5563',
                                                fontSize: '14px',
                                                lineHeight: 1.6,
                                                marginBottom: '18px',
                                                display: '-webkit-box',
                                                WebkitLineClamp: 3,
                                                WebkitBoxOrient: 'vertical' as const,
                                                overflow: 'hidden',
                                            }}>
                                                {post.excerpt}
                                            </p>
                                            <span style={{
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: '6px',
                                                fontSize: '11px',
                                                fontWeight: 800,
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.08em',
                                                color: '#7c3aed',
                                            }}>
                                                Read Full Story <ArrowRight size={12} />
                                            </span>
                                        </div>
                                    </Link>
                                </article>
                            ))}
                        </div>
                    ) : (
                        <div style={{ textAlign: 'center', padding: '100px 0', border: '1px solid rgba(0,0,0,0.05)', borderRadius: '24px', background: '#f9fafb' }}>
                            <p style={{ color: '#6b7280', fontSize: '18px', fontWeight: 700 }}>No stories found matching your criteria.</p>
                            <Link href="/blog" style={{ color: '#7c3aed', textDecoration: 'none', fontWeight: '800', marginTop: '10px', display: 'inline-block' }}>Clear all filters</Link>
                        </div>
                    )}

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div style={{
                            marginTop: '48px',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            gap: '8px',
                        }}>
                            {page > 1 && (
                                <Link 
                                    href={`/blog?page=${page - 1}${search ? `&search=${encodeURIComponent(search)}` : ''}${category !== 'All Stories' ? `&category=${encodeURIComponent(category)}` : ''}`}
                                    style={{
                                        width: '40px', height: '40px', borderRadius: '12px',
                                        background: '#fff', border: '1px solid rgba(0,0,0,0.08)',
                                        color: '#1a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        textDecoration: 'none',
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                                    }}
                                >
                                    <ChevronLeft size={18} />
                                </Link>
                            )}
                            
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                                <Link 
                                    key={n} 
                                    href={`/blog?page=${n}${search ? `&search=${encodeURIComponent(search)}` : ''}${category !== 'All Stories' ? `&category=${encodeURIComponent(category)}` : ''}`}
                                    style={{
                                        width: '40px', height: '40px', borderRadius: '12px',
                                        background: n === page ? '#7c3aed' : '#fff',
                                        border: n === page ? '1px solid #7c3aed' : '1px solid rgba(0,0,0,0.08)',
                                        color: n === page ? '#fff' : '#1a1a1a', fontSize: '14px', fontWeight: 700,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        textDecoration: 'none',
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                                    }}
                                >
                                    {n}
                                </Link>
                            ))}

                            {page < totalPages && (
                                <Link 
                                    href={`/blog?page=${page + 1}${search ? `&search=${encodeURIComponent(search)}` : ''}${category !== 'All Stories' ? `&category=${encodeURIComponent(category)}` : ''}`}
                                    style={{
                                        width: '40px', height: '40px', borderRadius: '12px',
                                        background: '#fff', border: '1px solid rgba(0,0,0,0.08)',
                                        color: '#1a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        textDecoration: 'none',
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                                    }}
                                >
                                    <ChevronRight size={18} />
                                </Link>
                            )}
                        </div>
                    )}
                </section>

                {/* =================== NEWSLETTER SECTION =================== */}
                <section style={{
                    marginTop: '80px',
                    padding: '60px 32px',
                    borderRadius: '32px',
                    background: 'linear-gradient(135deg, rgba(124,58,237,0.05) 0%, rgba(255,255,255,1) 100%)',
                    border: '1px solid rgba(124,58,237,0.1)',
                    textAlign: 'center',
                    boxShadow: '0 20px 40px rgba(124,58,237,0.03)',
                }}>
                    <h2 style={{
                        fontSize: 'clamp(1.6rem, 4vw, 2.4rem)',
                        fontWeight: 900,
                        marginBottom: '12px',
                        color: '#1a1a1a',
                    }}>
                        Artisanal Insights in Your Inbox
                    </h2>
                    <p style={{
                        color: '#6b7280',
                        maxWidth: '500px',
                        margin: '0 auto 28px',
                        fontSize: '15px',
                        lineHeight: 1.6,
                    }}>
                        Subscribe for exclusive insights into nosso artisanal process, early access to new collections, and refined wellness tips.
                    </p>
                    <form style={{
                        display: 'flex',
                        gap: '12px',
                        maxWidth: '440px',
                        margin: '0 auto',
                        flexWrap: 'wrap',
                        justifyContent: 'center',
                    }}>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            style={{
                                flex: 1,
                                minWidth: '200px',
                                padding: '14px 24px',
                                borderRadius: '999px',
                                background: '#fff',
                                border: '1px solid rgba(0,0,0,0.08)',
                                color: '#1a1a1a',
                                fontSize: '14px',
                                outline: 'none',
                                boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
                            }}
                        />
                        <button style={{
                            padding: '14px 32px',
                            borderRadius: '999px',
                            background: '#7c3aed',
                            color: '#fff',
                            fontSize: '13px',
                            fontWeight: 800,
                            textTransform: 'uppercase',
                            letterSpacing: '0.08em',
                            border: 'none',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            boxShadow: '0 10px 20px rgba(124, 58, 237, 0.2)',
                        }}>
                            Subscribe <Mail size={16} />
                        </button>
                    </form>
                </section>
                </div>
        </div>
    );
}
