import type { Metadata } from 'next';
import { getPageMetadata } from '@/lib/metadata-utils';
import Image from 'next/image';
import styles from './page.module.css';
import { ArrowRight } from 'lucide-react';
export const revalidate = 3600;

import Link from 'next/link';
import prisma from '@/lib/prisma';
import { Reveal } from '@/components/Reveal';
import ProductCard from '@/components/ProductCard/ProductCard';
import DosageConcierge from '@/components/DosageConcierge/DosageConcierge';
import BentoGrid from '@/components/BentoGrid/BentoGrid';

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

const HERO_STATS = [
    { value: '3×', label: 'Lab tested' },
    { value: '48h', label: 'Fast dispatch' },
    { value: '100%', label: 'Authentic source' },
];

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
            <section className={styles.editorialHero}>
                <div className={`grain-overlay ${styles.heroGrain}`} aria-hidden />
                <div className={styles.heroOrbit} aria-hidden />

                <div className={styles.heroLeft}>
                    <div className={styles.mobileHeroTextOverlay}>
                        <Reveal>
                            <span className={styles.heroTag}>The new standard</span>
                            <h1 className={styles.heroTitle}>
                                Fusion<br /><em>Mushroom</em><br />Bars
                            </h1>
                        </Reveal>
                    </div>
                    <div className={styles.mobileHeroContentBottom}>
                        <Reveal delay={0.15}>
                            <p className={styles.heroDesc}>
                                Premium psilocybin chocolate, precision-dosed gummies, and artisan
                                formulations — crafted for clarity, calm, and elevated experience.
                            </p>
                        </Reveal>
                        <Reveal delay={0.25}>
                            <div className={styles.heroStats}>
                                {HERO_STATS.map((stat) => (
                                    <div key={stat.label} className={styles.heroStat}>
                                        <strong>{stat.value}</strong>
                                        <span>{stat.label}</span>
                                    </div>
                                ))}
                            </div>
                        </Reveal>
                        <Reveal delay={0.35}>
                            <div className={styles.heroActions}>
                                <Link href="/shop" className={`${styles.heroCta} btn-shine`}>
                                    Explore collection
                                    <ArrowRight size={18} />
                                </Link>
                                <Link href="/faq" className={styles.heroSecondary}>
                                    How it works
                                </Link>
                            </div>
                        </Reveal>
                    </div>
                </div>

                <div className={styles.heroRight}>
                    <div className={styles.heroImageOverlay} />
                    <span className={styles.heroImageBadge}>Belgian craft</span>
                    <Image
                        src="/images/hero-fusion.png"
                        alt="Fusion Shroom Bars"
                        fill
                        className={styles.heroImage}
                        priority
                    />
                </div>
            </section>

            <div className={styles.marqueeContainer}>
                <div className={styles.marqueeContent}>
                    <span>Elevated wellness</span> • <span>Artisanal mastery</span> • <span>Purest psilocybin</span> • <span>Clinical precision</span> •
                    <span>Elevated wellness</span> • <span>Artisanal mastery</span> • <span>Purest psilocybin</span> • <span>Clinical precision</span> •
                </div>
            </div>

            <section className={styles.collectionSection}>
                <div className="container">
                    <Reveal>
                        <div className={styles.sectionHeader}>
                            <span className={styles.sectionLabel}>Curated</span>
                            <h2 className={styles.sectionTitle}>Best sellers</h2>
                            <p className={styles.sectionDesc}>
                                Our most sought-after formulations — meticulously crafted for
                                consistency, potency, and an unmatched sensory experience.
                            </p>
                        </div>
                    </Reveal>

                    <div className={styles.homeProductGrid}>
                        {bestsellers.map((product: any, index: number) => (
                            <ProductCard key={product.id} product={product} index={index} variant="featured" />
                        ))}
                    </div>

                    <Reveal delay={0.2}>
                        <div className={styles.sectionFooter}>
                            <Link href="/shop" className={`${styles.heroCta} btn-shine`}>
                                View all products
                                <ArrowRight size={18} />
                            </Link>
                        </div>
                    </Reveal>
                </div>
            </section>

            <section className={styles.conciergeSection}>
                <div className="container">
                    <Reveal>
                        <div className={styles.sectionHeader}>
                            <span className={styles.sectionLabel}>Guided</span>
                            <h2 className={styles.sectionTitle}>Find your frequency</h2>
                            <p className={styles.sectionDesc}>
                                Not sure where to begin? Our concierge matches you to the ideal
                                product and protocol — based on your experience and intentions.
                            </p>
                        </div>
                    </Reveal>
                    <Reveal delay={0.2}>
                        <DosageConcierge />
                    </Reveal>
                </div>
            </section>

            <section className={styles.bentoSection}>
                <BentoGrid />
            </section>

            <section className={styles.seoSection}>
                <div className={styles.seoInner}>
                    <Reveal>
                        <h2 className={styles.seoTitle}>
                            The premier destination for Fusion mushroom bars
                        </h2>
                    </Reveal>
                    <Reveal delay={0.15}>
                        <p className={styles.seoText}>
                            When you <strong>buy Fusion bars online</strong>, you expect the highest quality and most reliable experience. Official Fusion Shroom Bars represent the gold standard in <strong>magic mushroom chocolate bars</strong> and <strong>psilocybin gummies</strong>. Our proprietary extraction processes ensure that each artisanal chocolate square and gummy provides a precise, consistent, and elevated journey.
                        </p>
                    </Reveal>
                    <Reveal delay={0.3}>
                        <p className={styles.seoText}>
                            Whether you are looking for the profound effects of the <strong>Fusion x Whole Melt disposables</strong> or prefer the rich flavor of our premium shroom chocolate edibles, our products are rigorously lab-tested for purity and potency. Experience the difference of authentic Fusion chocolate today.
                        </p>
                    </Reveal>
                </div>
            </section>
        </div>
    );
}
