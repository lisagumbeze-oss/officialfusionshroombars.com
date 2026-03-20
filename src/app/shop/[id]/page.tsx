export const revalidate = 3600; // Incrementally regenerate page every hour

import type { Metadata } from 'next';
import Image from 'next/image';
import styles from './product.module.css';
import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import AddToCartSection from './AddToCartSection';
import Link from 'next/link';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import RelatedProducts from '@/components/RelatedProducts';
import AddToCartButton from '@/components/AddToCartButton';

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
            type: 'website',
            url: `https://officialfusionshroombars.com/shop/${product.slug}`,
            siteName: 'Official Fusion Shroom Bars',
        },
        twitter: {
            card: 'summary_large_image',
            title: product.seoTitle || product.name,
            description: product.seoDescription || product.description.substring(0, 160),
            images: product.image ? [product.image] : [],
        },
    };
}

export default async function ProductPage({ 
    params 
}: { 
    params: Promise<{ id: string }> 
}) {
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
                take: 8
            });
        }
    } catch (error) {
        console.error('[ProductPage] Database error:', error);
    }

    if (!product) {
        notFound();
    }

    if (!product.isActive) {
        notFound();
    }

    const effects = product.effects ? JSON.parse(product.effects) : null;
    const ingredients = product.ingredients ? JSON.parse(product.ingredients) : null;

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": product.name,
        "image": product.image.startsWith('http') ? product.image : `https://officialfusionshroombars.com${product.image}`,
        "description": product.description,
        "sku": product.id.toString(),
        "brand": {
            "@type": "Brand",
            "name": "Fusion Shroom Bars"
        },
        "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.9",
            "reviewCount": "84"
        },
        "offers": {
            "@type": "Offer",
            "url": `https://officialfusionshroombars.com/shop/${product.slug}`,
            "priceCurrency": "USD",
            "price": product.price,
            "availability": "https://schema.org/InStock",
            "priceValidUntil": new Date(new Date().getFullYear() + 1, 0, 1).toISOString().split('T')[0]
        }
    };

    const breadcrumbJsonLd = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://officialfusionshroombars.com" },
            { "@type": "ListItem", "position": 2, "name": "Shop", "item": "https://officialfusionshroombars.com/shop" },
            { "@type": "ListItem", "position": 3, "name": product.category, "item": `https://officialfusionshroombars.com/shop?category=${encodeURIComponent(product.category)}` },
            { "@type": "ListItem", "position": 4, "name": product.name }
        ]
    };

    return (
        <div className={styles.productContainer}>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
            />
            {/* Product Presentation */}
            <div className={styles.productGrid}>
                {/* Left: Images */}
                <div className={styles.imageGallery}>
                    <div className={styles.mainImagePlaceholder}>
                        <Image 
                            src={product.image} 
                            alt={product.imageAlt || product.name} 
                            fill 
                            style={{ objectFit: 'cover' }} 
                            priority 
                        />
                        {product.regularPrice && product.regularPrice > product.price && (
                            <span className={styles.saleTag}>SALE</span>
                        )}
                    </div>
                </div>

                {/* Right: Info */}
                <div className={styles.productInfo}>
                <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
                    <Link href="/" style={{ color: '#c9a44a', textDecoration: 'none' }}>Home</Link>
                    <span> / </span>
                    <Link href="/shop" style={{ color: '#c9a44a', textDecoration: 'none' }}>Shop</Link>
                    <span> / </span>
                    <Link href={`/shop?category=${encodeURIComponent(product.category)}`} style={{ color: '#c9a44a', textDecoration: 'none' }}>{product.category}</Link>
                    <span> / </span>
                    <span>{product.name}</span>
                </nav>
                    <h1 className={styles.title}>{product.name}</h1>

                    <div className={styles.priceContainer}>
                        {product.regularPrice && (
                            <span className={styles.oldPrice}>${product.regularPrice.toFixed(2)}</span>
                        )}
                        <span className={styles.newPrice}>${product.price.toFixed(2)}</span>
                    </div>

                    <p className={styles.description}>{product.description}</p>

                    <AddToCartSection product={product} />

                    <div className={styles.benefits}>
                        <div className={styles.benefitItem}>✓ Fast Delivery Worldwide</div>
                        <div className={styles.benefitItem}>✓ Premium Extracted Psilocybin</div>
                        {product.weight && (
                            <div className={styles.benefitItem}>✓ {product.weight} Potency</div>
                        )}
                    </div>
                </div>
            </div>

            {/* Details Tabs */}
            <div className={styles.detailsTabs}>
                <div className={styles.tabHeaders}>
                    <button className={styles.activeTab}>Description</button>
                    {ingredients && <button>Ingredients</button>}
                    {effects && <button>Effects</button>}
                </div>
                <div className={styles.tabContent}>
                    <h3>Product Overview</h3>
                    <p>{product.description}</p>

                    {effects && (
                        <>
                            <h4>Potential Effects:</h4>
                            <ul>
                                {effects.map((effect: string) => <li key={effect}>{effect}</li>)}
                            </ul>
                        </>
                    )}

                    {ingredients && (
                        <>
                            <h4>Ingredients:</h4>
                            <ul>
                                {ingredients.map((ing: string) => <li key={ing}>{ing}</li>)}
                            </ul>
                        </>
                    )}
                </div>
            </div>

            <RelatedProducts products={relatedProducts} />

            {/* Customer Reviews */}
            <div style={{ marginTop: '4rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.5rem', color: '#fff' }}>Customer Reviews</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
                    {product.reviews && product.reviews.length > 0 ? (
                        product.reviews.map((r: any) => (
                            <div key={r.id} style={{ padding: '1.5rem', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
                                <div style={{ color: '#c9a44a', marginBottom: '0.5rem' }}>
                                    {Array(r.rating).fill("\u2605").join("")}
                                </div>
                                <p style={{ color: '#ddd', fontSize: '0.9rem', marginBottom: '1rem', fontStyle: 'italic' }}>
                                    "{r.content}"
                                </p>
                                <div style={{ fontSize: '0.8rem', color: '#888' }}>
                                    <strong>{r.name}</strong> - Verified Buyer &middot; {new Date(r.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                </div>
                            </div>
                        ))
                    ) : (
                        <p style={{ color: '#555', fontSize: '14px', fontStyle: 'italic' }}>No reviews yet for this product. Be the first to share your experience!</p>
                    )}
                </div>
            </div>

            {/* Internal Cross-Links Section */}
            <div style={{ marginTop: '3rem', padding: '2rem', borderRadius: '16px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', color: '#ccc' }}>Need Help With Your Order?</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                    <Link href="/faq" style={{ color: '#c9a44a', textDecoration: 'underline', fontSize: '0.9rem' }}>Read our FAQ</Link>
                    <Link href="/contact" style={{ color: '#c9a44a', textDecoration: 'underline', fontSize: '0.9rem' }}>Contact Support 24/7</Link>
                    <Link href="/about" style={{ color: '#c9a44a', textDecoration: 'underline', fontSize: '0.9rem' }}>About Fusion Shroom Bars</Link>
                    <Link href="/blog" style={{ color: '#c9a44a', textDecoration: 'underline', fontSize: '0.9rem' }}>Read the Blog</Link>
                    <Link href="/shop" style={{ color: '#c9a44a', textDecoration: 'underline', fontSize: '0.9rem' }}>Browse All Products</Link>
                </div>
                <p style={{ marginTop: '1rem', color: '#777', fontSize: '0.8rem', lineHeight: 1.6 }}>
                    All Fusion products are made with <a href="https://en.wikipedia.org/wiki/Psilocybin" target="_blank" rel="noopener noreferrer" style={{ color: '#c9a44a' }}>psilocybin</a> extract infused into premium Belgian chocolate. Lab-tested for purity and consistency.
                </p>
            </div>
        </div>
    );
}
