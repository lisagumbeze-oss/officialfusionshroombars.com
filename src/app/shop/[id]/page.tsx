export const revalidate = 3600; // Incrementally regenerate page every hour

import type { Metadata } from 'next';
import Image from 'next/image';
import styles from './product.module.css';
import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import AddToCartSection from './AddToCartSection';
import Link from 'next/link';
import RelatedProducts from '@/components/RelatedProducts';
import { Truck, ShieldCheck, Zap, Star } from 'lucide-react';

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
                }
            }
        });

        if (product) {
            relatedProducts = await (prisma as any).product.findMany({
                where: {
                    category: product.category,
                    isActive: true,
                    NOT: { id: product.id }
                },
                take: 4
            });
        }
    } catch (error) {
        console.error('[ProductPage] Database error:', error);
    }

    if (!product || !product.isActive) {
        notFound();
    }

    const effects = product.effects ? JSON.parse(product.effects) : null;
    const ingredients = product.ingredients ? JSON.parse(product.ingredients) : null;

    return (
        <div className={styles.productContainer}>
            {/* Split Screen Presentation */}
            <div className={styles.splitLayout}>
                {/* Left: Sticky Image Hero */}
                <div className={styles.imageSection}>
                    <div className={styles.mainImagePlaceholder}>
                        <Image 
                            src={product.image} 
                            alt={product.imageAlt || product.name} 
                            fill 
                            style={{ objectFit: 'cover' }} 
                            priority 
                        />
                        {product.regularPrice && product.regularPrice > product.price && (
                            <span className={styles.saleHeroTag}>SALE</span>
                        )}
                    </div>
                </div>

                {/* Right: Scrolling Info */}
                <div className={styles.infoSection}>
                    <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
                        <Link href="/">HOME</Link>
                        <span> // </span>
                        <Link href="/shop">COLLECTION</Link>
                        <span> // </span>
                        <Link href={`/shop?category=${encodeURIComponent(product.category)}`}>{product.category}</Link>
                        <span> // </span>
                        <span style={{ color: '#fff' }}>{product.name}</span>
                    </nav>

                    <h1 className={styles.title}>{product.name}</h1>

                    <div className={styles.priceContainer}>
                        {product.regularPrice && (
                            <span className={styles.oldPrice}>${product.regularPrice.toFixed(2)}</span>
                        )}
                        <span className={styles.newPrice}>${product.price.toFixed(2)}</span>
                    </div>

                    <div className={styles.actionArea}>
                        <AddToCartSection product={product} />

                        <div className={styles.benefits}>
                            <div className={styles.benefitItem}><Truck size={20} /> Discrete Delivery</div>
                            <div className={styles.benefitItem}><ShieldCheck size={20} /> Triple Lab Tested</div>
                            {product.weight && (
                                <div className={styles.benefitItem}><Zap size={20} /> {product.weight} Potency</div>
                            )}
                        </div>
                    </div>

                </div>
            </div>

            {/* Below the fold: Reviews & Related */}
            <div className={styles.standardLayout}>
                {/* Full Width Discover Section */}
                <div className={styles.detailsTabs}>
                    <div className={styles.tabHeaders}>
                        <button className={styles.activeTab}>Discover</button>
                    </div>
                    <div className={styles.tabContent}>
                        <div 
                            className={styles.htmlDesc} 
                            dangerouslySetInnerHTML={{ __html: product.description }} 
                        />

                        {effects && (
                            <>
                                <h4>Expected Experience</h4>
                                <ul>
                                    {effects.map((effect: string) => <li key={effect}>{effect}</li>)}
                                </ul>
                            </>
                        )}

                        {ingredients && (
                            <>
                                <h4>Pure Ingredients</h4>
                                <ul>
                                    {ingredients.map((ing: string) => <li key={ing}>{ing}</li>)}
                                </ul>
                            </>
                        )}
                    </div>
                </div>

                {relatedProducts.length > 0 && (
                    <div style={{ marginBottom: '6rem' }}>
                        <h2 className={styles.sectionTitle}>Curated For You</h2>
                        <RelatedProducts products={relatedProducts} />
                    </div>
                )}

                <div className={styles.reviewsSection}>
                    <h2 className={styles.sectionTitle}>Client Experiences</h2>
                    <div className={styles.reviewsGrid}>
                        {product.reviews && product.reviews.length > 0 ? (
                            product.reviews.map((r: any) => (
                                <div key={r.id} className={styles.reviewCard}>
                                    <div className={styles.stars}>
                                        {Array(r.rating).fill(<Star size={16} fill="#d97706" color="#d97706" style={{display: 'inline-block', marginRight: '4px'}}/>)}
                                    </div>
                                    <p className={styles.reviewText}>"{r.content}"</p>
                                    <div className={styles.reviewMeta}>
                                        <strong>{r.name}</strong> • {new Date(r.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p style={{ color: '#888', fontStyle: 'italic' }}>Be the first to share an experience with this product.</p>
                        )}
                    </div>
                </div>

                {/* Internal Cross-Links */}
                <div className={styles.crossLinks}>
                    <h3>Expand Your Journey</h3>
                    <div className={styles.linkTags}>
                        <Link href="/faq" className={styles.tag}>Read the FAQ</Link>
                        <Link href="/contact" className={styles.tag}>Contact Support</Link>
                        <Link href="/about" className={styles.tag}>Our Standards</Link>
                        <Link href="/blog" className={styles.tag}>Editorial Journal</Link>
                    </div>
                    <p style={{ color: '#666', fontSize: '0.85rem' }}>
                        All Fusion products utilize premium <a href="https://en.wikipedia.org/wiki/Psilocybin" target="_blank" rel="noopener noreferrer" style={{ color: '#fff' }}>psilocybin</a> extract infused into Belgian chocolate.
                    </p>
                </div>
            </div>
        </div>
    );
}
