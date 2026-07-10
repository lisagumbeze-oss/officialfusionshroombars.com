import type { Metadata } from 'next';
import { getPageMetadata } from '@/lib/metadata-utils';
export const revalidate = 3600;

import prisma from '@/lib/prisma';
import ShopFilters from './ShopFilters';
import Pagination from './Pagination';
import ProductCard from '@/components/ProductCard/ProductCard';
import { Product } from '@/types/product';
import styles from './shop.module.css';
import { Reveal } from '@/components/Reveal';
import Link from 'next/link';
import { CircleHelp, BookOpen, FlaskConical, Mail } from 'lucide-react';

export async function generateMetadata(): Promise<Metadata> {
  const fallback: Metadata = {
    title: 'Shop Official Fusion Shroom Bars | Authentic Mushroom Chocolate',
    description:
      'The official shop for Fusion Shroom Bars and Neau Tropics. Explore our full collection of authentic psilocybin-infused Belgian chocolate and gummies.',
  };
  return await getPageMetadata('/shop', fallback);
}

const CROSS_LINKS = [
  { href: '/faq', icon: CircleHelp, label: 'Knowledge base' },
  { href: '/about', icon: FlaskConical, label: 'Our process' },
  { href: '/blog', icon: BookOpen, label: 'Editorial journal' },
  { href: '/contact', icon: Mail, label: 'Contact us' },
];

export default async function Shop({
  searchParams,
}: {
  searchParams: Promise<{
    category?: string;
    sort?: string;
    page?: string;
    search?: string;
    min?: string;
    max?: string;
  }>;
}) {
  const params = await searchParams;
  const { category, sort, page, search, min, max } = params;
  const minPrice = min ? parseFloat(min) : undefined;
  const maxPrice = max ? parseFloat(max) : undefined;

  const currentPage = parseInt(page || '1', 10);
  const pageSize = 24;

  const where: any = { isActive: true };
  if (category && category !== 'All Products') {
    where.category = category;
  }

  if (minPrice !== undefined || maxPrice !== undefined) {
    where.price = {};
    if (minPrice !== undefined) where.price.gte = minPrice;
    if (maxPrice !== undefined) where.price.lte = maxPrice;
  }

  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
    ];
  }

  let orderBy: any = { name: 'asc' };
  if (sort === 'price-low') orderBy = { price: 'asc' };
  if (sort === 'price-high') orderBy = { price: 'desc' };
  if (sort === 'newest') orderBy = { createdAt: 'desc' };

  let products: Product[] = [];
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
        include: {
          reviews: { select: { rating: true } },
          _count: { select: { reviews: true } },
        },
      }),
      (prisma as any).product.count({ where }),
    ]);

    products = fetchedProducts as Product[];
    totalProducts = totalCount;

    const catData = await (prisma as any).product.findMany({
      select: { category: true },
    });
    categories = Array.from(new Set(catData.map((p: any) => p.category as string)));
  } catch (error) {
    console.error('[Shop] Database error:', error);
    dbError = true;
  }

  const heroStats = [
    { value: String(totalProducts), label: 'Products' },
    { value: String(categories.length), label: 'Categories' },
    { value: '48h', label: 'Dispatch' },
  ];

  return (
    <div className={styles.shopPage}>
      {/* Editorial Hero */}
      <section className={styles.editorialHero}>
        <div className={`grain-overlay ${styles.heroGrain}`} aria-hidden />
        <div className={styles.heroOrbit} aria-hidden />

        <div className={styles.heroInner}>
          <Reveal>
            <span className={styles.heroTag}>Collection</span>
            <h1 className={styles.heroTitle}>
              Shop Fusion<br /><em>mushroom bars</em>
            </h1>
          </Reveal>
          <Reveal delay={0.15}>
            <p className={styles.heroDesc}>
              Authentic Fusion chocolate bars, Neau Tropics, and precision-dosed gummies —
              lab-tested with discreet worldwide shipping.
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
            <p className={styles.heroIntro}>
              Welcome to the ultimate destination for premium psilocybin edibles. From signature{' '}
              <strong>Fusion Mushroom Bars</strong> and <strong>Fusion gummies</strong> to{' '}
              <strong>Fusion x Whole Melt disposables</strong>, every product is triple-verified for purity.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Marquee */}
      <div className={styles.marqueeContainer}>
        <div className={styles.marqueeContent}>
          <span>Lab tested</span> • <span>Belgian craft</span> • <span>Discreet shipping</span> • <span>Authentic source</span> •
          <span>Lab tested</span> • <span>Belgian craft</span> • <span>Discreet shipping</span> • <span>Authentic source</span> •
        </div>
      </div>

      {/* Shop content */}
      <div className={styles.shopContainer} id="products">
        <Reveal>
          <ShopFilters categories={categories as string[]} />
        </Reveal>

        {dbError ? (
          <div className={styles.errorState}>
            <h2>Store temporarily unavailable</h2>
            <p>We&apos;re having trouble loading products. Please refresh or try again shortly.</p>
          </div>
        ) : (
          <>
            <div className={styles.productGrid}>
              {products.map((product: any, index: number) => (
                <Reveal key={product.id} delay={0.03 * (index % 12)}>
                  <ProductCard product={product} index={index} />
                </Reveal>
              ))}
            </div>

            <Pagination totalItems={totalProducts} pageSize={pageSize} currentPage={currentPage} />

            {products.length === 0 && !dbError && (
              <div className={styles.noResults}>
                <h3>No products match your filters.</h3>
                <p>Try adjusting your category, price range, or sort options.</p>
                <Link href="/shop" className={styles.resetLink}>
                  View all products
                </Link>
              </div>
            )}
          </>
        )}
      </div>

      {/* Cross-links */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaInner}>
          <Reveal>
            <h2 className={styles.ctaTitle}>Need guidance?</h2>
            <p className={styles.ctaDesc}>
              Explore our guides, FAQ, and support resources to find the right product for your journey.
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
