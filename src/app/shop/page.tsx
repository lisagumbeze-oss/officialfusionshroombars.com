import type { Metadata } from 'next';
import { getPageMetadata } from '@/lib/metadata-utils';
export const revalidate = 3600; // Incrementally regenerate page every hour

import Link from 'next/link';
import Image from 'next/image';
import styles from './shop.module.css';

export async function generateMetadata(): Promise<Metadata> {
    const fallback: Metadata = {
        title: 'Shop Official Fusion Shroom Bars | Authentic Mushroom Chocolate',
        description: 'The official shop for Fusion Shroom Bars and Neau Tropics. Explore our full collection of authentic psilocybin-infused Belgian chocolate and gummies.',
    };
    return await getPageMetadata("/shop", fallback);
}
import prisma from '@/lib/prisma';
import ShopFilters from './ShopFilters';
import AddToCartButton from '@/components/AddToCartButton';
import Pagination from './Pagination';

export default async function Shop({ 
    searchParams 
}: { 
    searchParams: Promise<{ category?: string, sort?: string, page?: string }> 
}) {
    const { category, sort, page } = await searchParams;
    const currentPage = parseInt(page || '1', 10);
    const pageSize = 24;

    // Build query
    const where: any = { isActive: true };
    if (category && category !== 'All Products') {
        where.category = category;
    }

    let orderBy: any = { name: 'asc' };
    if (sort === 'price-low') orderBy = { price: 'asc' };
    if (sort === 'price-high') orderBy = { price: 'desc' };
    if (sort === 'newest') orderBy = { createdAt: 'desc' };

    let products: any[] = [];
    let categories: string[] = [];
    let totalProducts = 0;
    let dbError = false;

    try {
        const skip = (currentPage - 1) * pageSize;
        
        const [fetchedProducts, totalCount] = await Promise.all([
            (prisma as any).product.findMany({
                where,
                orderBy,
                skip: skip >= 0 ? skip : 0,
                take: pageSize,
            }),
            (prisma as any).product.count({ where })
        ]);

        products = fetchedProducts;
        totalProducts = totalCount;

        const catData = await (prisma as any).product.findMany({
            select: { category: true }
        });
        categories = Array.from(new Set(catData.map((p: any) => p.category as string)));
    } catch (error) {
        console.error('[Shop] Database error:', error);
        dbError = true;
    }

    return (
        <div className={styles.shopContainer}>
            <header className={styles.shopHeader}>
                <h1>Shop Fusion Shroom Bars &amp; Mushroom Chocolate Online</h1>
                <p>Buy authentic Fusion mushroom chocolate bars, Neau Tropics, and psilocybin gummies. Lab-tested premium edibles with discreet worldwide shipping.</p>
            </header>

            <ShopFilters categories={categories as string[]} />

            {dbError ? (
                <div style={{ textAlign: 'center', padding: '4rem 2rem', background: 'rgba(255,100,100,0.05)', borderRadius: '12px', border: '1px solid rgba(255,100,100,0.1)', margin: '2rem 0' }}>
                    <h2 style={{ color: '#ff6b6b' }}>Store Temporarily Unavailable</h2>
                    <p>We're experiencing a connection issue with our product database. Please try refreshing the page or check back in a few minutes.</p>
                </div>
            ) : (
                <>
                    <div className={styles.productGrid}>
                        {products.map((product: any) => (
                            <div key={product.id} className={styles.productCard}>
                                <div className={styles.productImagePlaceholder}>
                                    <Image 
                                        src={product.image} 
                                        alt={product.name} 
                                        fill 
                                        style={{ objectFit: 'cover' }}
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    />
                                    {product.regularPrice && product.regularPrice > product.price && (
                                        <span className={styles.saleTag}>SALE</span>
                                    )}
                                </div>
                                <h3 className={styles.productTitle}>{product.name}</h3>
                                <div className={styles.categoryTag}>{product.category}</div>
                                <div className={styles.price}>
                                    {product.regularPrice && (
                                        <span className={styles.oldPrice}>${product.regularPrice.toFixed(2)}</span>
                                    )}
                                    <span className={styles.newPrice}>${product.price.toFixed(2)}</span>
                                </div>
                                <div className={styles.buttonGroup}>
                                    <Link href={`/shop/${product.slug}`} className={`${styles.viewBtn} premium-gradient`}>
                                        VIEW PRODUCT
                                    </Link>
                                    <AddToCartButton product={product} className={styles.cartBtn} />
                                </div>
                            </div>
                        ))}
                    </div>

                    <Pagination 
                        totalItems={totalProducts} 
                        pageSize={pageSize} 
                        currentPage={currentPage} 
                    />

                    {products.length === 0 && !dbError && (
                        <div className={styles.noResults}>
                            <h3>No products found in this category.</h3>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
