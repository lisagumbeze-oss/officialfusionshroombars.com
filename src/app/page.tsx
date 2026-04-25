import type { Metadata } from 'next';
import { getPageMetadata } from '@/lib/metadata-utils';
import Image from 'next/image';
import styles from './page.module.css';
import shopStyles from './shop/shop.module.css';
import { ArrowRight, ArrowUpRight, FlaskConical, BookOpen, CircleHelp, Mail } from 'lucide-react';
export const revalidate = 3600;

import Link from 'next/link';
import prisma from '@/lib/prisma';
import AddToCartButton from '@/components/AddToCartButton';
import { Reveal } from '@/components/Reveal';
import ProductCard from '@/components/ProductCard/ProductCard';
import DosageConcierge from '@/components/DosageConcierge/DosageConcierge';

export async function generateMetadata(): Promise<Metadata> {
    const fallback: Metadata = {
        title: "Official Fusion Shroom Bars | Elevated Experiences",
        description: "The gold standard of psilocybin edibles. Experience focus, energy, and wellness with premium Fusion Chocolate Bars.",
        openGraph: {
            title: "Fusion | Elevated Mushroom Experiences",
            description: "Artisanal Belgian chocolate infused with pure psilocybin extract.",
            images: ["/images/hero-fusion.png"],
        },
    };
    return await getPageMetadata("/", fallback);
}

export default async function Home() {
    let bestsellers = [];
    try {
        const products = await (prisma as any).product.findMany({
            where: { isActive: true },
            take: 3, 
            orderBy: { createdAt: 'desc' },
            include: {
                reviews: {
                    select: { rating: true }
                },
                _count: {
                    select: { reviews: true }
                }
            }
        });
        bestsellers = products;
    } catch (error) {
        console.error('[Home] Failed to fetch bestsellers:', error);
    }

    return (
        <div className={styles.home}>
            {/* 1. Split-Screen Hero */}
            <section className={styles.editorialHero}>
                <div className={styles.heroLeft}>
                    <div className={styles.mobileHeroTextOverlay}>
                        <Reveal>
                            <span className={styles.heroTag}>The New Standard</span>
                            <h1 className={styles.heroTitle}>Fusion<br/>Mushroom<br/>Bars.</h1>
                        </Reveal>
                    </div>
                    <div className={styles.mobileHeroContentBottom}>
                        <Reveal delay={0.2}>
                            <p className={styles.heroDesc}>
                                Discover the pinnacle of psilocybin edibles. Premium magic mushroom chocolate, powerful disposables, and precision-dosed gummies crafted for profound focus and deep calm.
                            </p>
                        </Reveal>
                        <Reveal delay={0.4}>
                            <Link href="/shop" className={styles.heroCta}>
                                EXPLORE COLLECTION
                                <ArrowRight size={20} />
                            </Link>
                        </Reveal>
                    </div>
                </div>
                <div className={styles.heroRight}>
                    <div className={styles.heroImageOverlay}></div>
                    <Image 
                        src="/images/hero-fusion.png" 
                        alt="Fusion Shroom Bars" 
                        fill 
                        style={{ objectFit: 'cover', objectPosition: 'center' }} 
                        priority
                    />
                </div>
            </section>

            {/* 2. Infinite Marquee */}
            <div className={styles.marqueeContainer}>
                <div className={styles.marqueeContent}>
                    <span>ELEVATED WELLNESS</span> • <span>ARTISANAL MASTERY</span> • <span>PUREST PSILOCYBIN</span> • <span>CLINICAL PRECISION</span> • 
                    <span>ELEVATED WELLNESS</span> • <span>ARTISANAL MASTERY</span> • <span>PUREST PSILOCYBIN</span> • <span>CLINICAL PRECISION</span> • 
                </div>
            </div>

            {/* 3. Bestsellers Showcase */}
            <section className={styles.collectionSection}>
                <div className="container">
                    <Reveal>
                        <div className={styles.sectionHeader}>
                            <h2 className={styles.sectionTitle}>Best Sellers</h2>
                            <p className={styles.sectionDesc}>
                                Experience our most renowned artisanal mushroom chocolates. Meticulously crafted with clinical precision for an unmatched experience of focus, clarity, and euphoria.
                            </p>
                        </div>
                    </Reveal>

                    <div className={`${shopStyles.productGrid} ${styles.homeProductGrid}`}>
                        {bestsellers.map((product: any) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>

          <Reveal delay={0.2}>
            <div className={styles.sectionFooter}>
              <Link href="/shop" className={styles.heroCta}>
                VIEW ALL PRODUCTS
                <ArrowRight size={20} />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 3.5 Dosage Concierge */}
      <section className={styles.conciergeSection}>
        <div className="container">
          <Reveal>
            <div className={styles.sectionHeader} style={{ textAlign: 'center' }}>
              <h2 className={styles.sectionTitle}>Find Your Frequency</h2>
              <p className={styles.sectionDesc}>
                Not sure where to begin? Our interactive concierge will guide you to the ideal fusion product and dosage based on your experience and goals.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.2}>
            <DosageConcierge />
          </Reveal>
        </div>
      </section>

      {/* 4. Bento Box Discovery */}
      <section className={styles.bentoSection}>
        <div className={styles.bentoGrid}>
          
          <Link href="/about" className={`${styles.bentoCard} ${styles.bentoLarge}`}>
            <div className={styles.bentoBgImage}>
              <Image src="/images/fusion_ingredients.png" alt="Process" fill style={{ objectFit: 'cover' }} />
            </div>
            <div className={styles.bentoArrow}>
              <ArrowUpRight size={24} />
            </div>
            <div className={styles.bentoContent}>
              <FlaskConical size={40} className={styles.bentoIcon} />
              <h3 className={styles.bentoTitle}>Our Process</h3>
              <p className={styles.bentoDesc}>Explore our triple-tested extraction method and artisanal Belgian chocolate formulation.</p>
            </div>
          </Link>

          <Link href="/blog" className={`${styles.bentoCard} ${styles.bentoTall}`}>
            <div className={styles.bentoBgImage}>
              <Image src="/images/fusion_lifestyle.png" alt="Lifestyle" fill style={{ objectFit: 'cover' }} />
            </div>
            <div className={styles.bentoArrow}>
              <ArrowUpRight size={24} />
            </div>
            <div className={styles.bentoContent}>
              <BookOpen size={40} className={styles.bentoIcon} />
              <h3 className={styles.bentoTitle}>Journal</h3>
              <p className={styles.bentoDesc}>Guides on microdosing, wellness, and expanding consciousness.</p>
            </div>
          </Link>

          <div className={`${styles.bentoCard} ${styles.bentoWide}`}>
            <div className={styles.bentoContent}>
              <div style={{ color: '#b45309', marginBottom: '1rem', fontSize: '1.5rem' }}>★★★★★</div>
              <p style={{ fontSize: '1.25rem', fontStyle: 'italic', marginBottom: '1rem', lineHeight: '1.6' }}>
                "The cleanest experience. The design, the taste, and the focus are completely unmatched. It's truly a premium standard."
              </p>
              <strong style={{ color: '#a1a1aa' }}>— Sarah M., Verified Buyer</strong>
            </div>
          </div>

          <Link href="/faq" className={`${styles.bentoCard}`}>
            <div className={styles.bentoArrow}>
              <ArrowUpRight size={24} />
            </div>
            <div className={styles.bentoContent}>
              <CircleHelp size={40} className={styles.bentoIcon} />
              <h3 className={styles.bentoTitle}>FAQ</h3>
              <p className={styles.bentoDesc}>Shipping, dosage, and authenticity questions answered.</p>
            </div>
          </Link>

          <Link href="/contact" className={`${styles.bentoCard}`}>
            <div className={styles.bentoArrow}>
              <ArrowUpRight size={24} />
            </div>
            <div className={styles.bentoContent}>
              <Mail size={40} className={styles.bentoIcon} />
              <h3 className={styles.bentoTitle}>Contact</h3>
              <p className={styles.bentoDesc}>24/7 dedicated support team.</p>
            </div>
          </Link>

        </div>
      </section>

      {/* 5. SEO Text Block */}
      <section style={{ padding: '6rem 2rem', background: '#050505', color: '#a1a1aa', textAlign: 'center' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{ color: '#fff', fontSize: '1.5rem', marginBottom: '1.5rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
            The Premier Destination for Fusion Mushroom Bars
          </h2>
          <p style={{ lineHeight: '1.8', marginBottom: '1rem' }}>
            When you <strong style={{color: '#fff'}}>buy Fusion bars online</strong>, you expect the highest quality and most reliable experience. Official Fusion Shroom Bars represent the gold standard in <strong style={{color: '#fff'}}>magic mushroom chocolate bars</strong> and <strong style={{color: '#fff'}}>psilocybin gummies</strong>. Our proprietary extraction processes ensure that each artisanal chocolate square and gummy provides a precise, consistent, and elevated journey.
          </p>
          <p style={{ lineHeight: '1.8' }}>
            Whether you are looking for the profound effects of the <strong style={{color: '#fff'}}>Fusion x Whole Melt disposables</strong> or prefer the rich flavor of our premium shroom chocolate edibles, our products are rigorously lab-tested for purity and potency. Experience the difference of authentic Fusion chocolate today.
          </p>
        </div>
      </section>
    </div>
  );
}
