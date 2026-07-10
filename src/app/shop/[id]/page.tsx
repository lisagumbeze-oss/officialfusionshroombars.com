export const revalidate = 3600;

import type { Metadata } from 'next';
import styles from './product.module.css';
import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import AddToCartSection from './AddToCartSection';
import Link from 'next/link';
import RelatedProducts from '@/components/RelatedProducts';
import RecentlyViewedList from '@/components/RecentlyViewedList/RecentlyViewedList';
import { Truck, ShieldCheck, Zap, Star, CircleHelp, Mail, BookOpen, FlaskConical } from 'lucide-react';
import ProductGallery from './ProductGallery';
import RecentlyViewedTracker from '@/components/RecentlyViewedTracker';
import { Reveal } from '@/components/Reveal';

const CROSS_LINKS = [
    { href: '/faq', icon: CircleHelp, label: 'Knowledge base' },
    { href: '/contact', icon: Mail, label: 'Contact support' },
    { href: '/about', icon: FlaskConical, label: 'Our standards' },
    { href: '/blog', icon: BookOpen, label: 'Editorial journal' },
];

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const { id } = await params;
    const product = await (prisma as any).product.findUnique({ where: { slug: id } });
    if (!product) return { title: 'Product Not Found' };

    return {
        title: product.seoTitle || `${product.name} | Official Fusion Shroom Bars`,
        description: product.seoDescription || product.description.substring(0, 160),
        keywords: product.seoKeywords || undefined,
        alternates: {
            canonical: `https://officialfusionshroombars.com/shop/${product.slug}`,
        },
        openGraph: {
            title: product.seoTitle || `${product.name} | Official Fusion Shroom Bars`,
            description: product.seoDescription || product.description.substring(0, 160),
            images: product.image ? [product.image] : [],
        },
    };
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    let product: any = null;
    let relatedProducts: any[] = [];

    try {
        product = await (prisma as any).product.findUnique({
            where: { slug: id },
            include: {
                reviews: {
                    orderBy: { createdAt: 'desc' },
                },
            },
        });

        if (product) {
            relatedProducts = await (prisma as any).product.findMany({
                where: {
                    category: product.category,
                    isActive: true,
                    NOT: { id: product.id },
                },
                take: 4,
            });
        }
    } catch (error) {
        console.error('[ProductPage] Database error:', error);
    }

    if (!product || !product.isActive) {
        notFound();
    }

    const ingredients = product.ingredients ? JSON.parse(product.ingredients) : null;
    const isOnSale = !!(product.regularPrice && product.regularPrice > product.price);

    return (
        <div className={styles.productPage}>
            <RecentlyViewedTracker product={product as any} />

            <div className={styles.splitLayout}>
                {/* Left: Sticky gallery */}
                <div className={styles.imageSection}>
                    <div className={`grain-overlay ${styles.heroGrain}`} aria-hidden />
                    <ProductGallery
                        mainImage={product.image}
                        gallery={product.gallery}
                        name={product.name}
                        isSale={isOnSale}
                    />
                </div>

                {/* Right: Product info */}
                <div className={styles.infoSection}>
                    <Reveal>
                        <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
                            <Link href="/">Home</Link>
                            <span className={styles.breadcrumbSep} aria-hidden="true">/</span>
                            <Link href="/shop">Collection</Link>
                            <span className={styles.breadcrumbSep} aria-hidden="true">/</span>
                            <Link href={`/shop?category=${encodeURIComponent(product.category)}`}>
                                {product.category}
                            </Link>
                        </nav>
                    </Reveal>

                    {product.category && (
                        <Reveal delay={0.05}>
                            <span className={styles.categoryTag}>{product.category}</span>
                        </Reveal>
                    )}

                    <Reveal delay={0.1}>
                        <h1 className={styles.title}>{product.name}</h1>
                    </Reveal>

                    <Reveal delay={0.15}>
                        <div className={styles.priceContainer}>
                            {product.regularPrice && (
                                <span className={styles.oldPrice}>
                                    ${product.regularPrice.toFixed(2)}
                                </span>
                            )}
                            <span className={styles.newPrice}>${product.price.toFixed(2)}</span>
                            {isOnSale && (
                                <span className={styles.saleBadge}>On sale</span>
                            )}
                        </div>
                    </Reveal>

                    <Reveal delay={0.2}>
                        <div className={styles.actionArea}>
                            <AddToCartSection product={product} />

                            <div className={styles.benefits}>
                                <div className={styles.benefitItem}>
                                    <Truck size={18} strokeWidth={1.5} />
                                    Discreet delivery
                                </div>
                                <div className={styles.benefitItem}>
                                    <ShieldCheck size={18} strokeWidth={1.5} />
                                    Triple lab tested
                                </div>
                                {product.weight && (
                                    <div className={styles.benefitItem}>
                                        <Zap size={18} strokeWidth={1.5} />
                                        {product.weight} potency
                                    </div>
                                )}
                            </div>
                        </div>
                    </Reveal>
                </div>
            </div>

            {/* Below the fold */}
            <div className={styles.standardLayout}>
                <Reveal>
                    <section className={styles.detailsSection}>
                        <div className={styles.sectionHeader}>
                            <span className={styles.sectionLabel}>Details</span>
                            <h2 className={styles.sectionTitle}>Discover this product</h2>
                        </div>
                        <div className={styles.descCard}>
                            <div
                                className={styles.htmlDesc}
                                dangerouslySetInnerHTML={{ __html: product.description }}
                            />
                        </div>

                        {ingredients && (
                            <div className={styles.detailGrid}>
                                <div className={styles.detailCard}>
                                    <h3>Pure ingredients</h3>
                                    <ul>
                                        {ingredients.map((ing: string) => (
                                            <li key={ing}>{ing}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        )}
                    </section>
                </Reveal>

                {relatedProducts.length > 0 && (
                    <Reveal delay={0.1}>
                        <RelatedProducts products={relatedProducts} />
                    </Reveal>
                )}

                <Reveal delay={0.15}>
                    <section className={styles.reviewsSection}>
                        <div className={styles.sectionHeader}>
                            <span className={styles.sectionLabel}>Reviews</span>
                            <h2 className={styles.sectionTitle}>Client experiences</h2>
                        </div>
                        <div className={styles.reviewsGrid}>
                            {product.reviews && product.reviews.length > 0 ? (
                                product.reviews.map((r: any) => (
                                    <div key={r.id} className={styles.reviewCard}>
                                        <div className={styles.stars}>
                                            {Array.from({ length: 5 }, (_, i) => (
                                                <Star
                                                    key={i}
                                                    size={15}
                                                    fill={i < r.rating ? 'var(--primary)' : 'transparent'}
                                                    color={i < r.rating ? 'var(--primary)' : 'var(--text-subtle)'}
                                                />
                                            ))}
                                        </div>
                                        <p className={styles.reviewText}>&ldquo;{r.content}&rdquo;</p>
                                        <div className={styles.reviewMeta}>
                                            <strong>{r.name}</strong>
                                            <span>
                                                {new Date(r.createdAt).toLocaleDateString(undefined, {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    year: 'numeric',
                                                })}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className={styles.emptyReviews}>
                                    Be the first to share an experience with this product.
                                </p>
                            )}
                        </div>
                    </section>
                </Reveal>

                <RecentlyViewedList currentProductId={product.id} />

                <section className={styles.ctaSection}>
                    <Reveal>
                        <h2 className={styles.ctaTitle}>Expand your journey</h2>
                        <p className={styles.ctaDesc}>
                            All Fusion products utilize premium{' '}
                            <a
                                href="https://en.wikipedia.org/wiki/Psilocybin"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                psilocybin
                            </a>{' '}
                            extract infused into Belgian chocolate.
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
                </section>
            </div>
        </div>
    );
}
