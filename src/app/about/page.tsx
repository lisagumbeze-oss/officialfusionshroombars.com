import type { Metadata } from 'next';
import { getPageMetadata } from '@/lib/metadata-utils';
import styles from './page.module.css';
import Image from 'next/image';
import Link from 'next/link';
import { Reveal } from '@/components/Reveal';
import { ArrowRight, FlaskConical, Award, ShieldCheck, Search, BookOpen, Mail } from 'lucide-react';

export async function generateMetadata(): Promise<Metadata> {
    const fallback: Metadata = {
        title: 'About Official Fusion Shroom Bars | Our Story & Standards',
        description: 'Learn the authentic story of Fusion Shroom Bars. Discover our commitment to precision science, artisanal craftsmanship, and the industry standard for psilocybin wellness.',
    };
    return await getPageMetadata("/about", fallback);
}

const HERO_STATS = [
    { value: '3×', label: 'Lab tested' },
    { value: '100%', label: 'Pure extract' },
    { value: '24/7', label: 'Support' },
];

const STORY_BLOCKS = [
    {
        index: '01',
        title: 'A vision of excellence',
        image: '/images/fusion_ingredients.png',
        alt: 'Premium ingredients for Fusion Shroom Bars',
        paragraphs: [
            'Fusion Shroom Bars represents the pinnacle of artisanal craftsmanship and scientific precision. Our journey began with a simple yet ambitious goal: to elevate the botanical experience and create the world\'s most reliable magic mushroom chocolate bars and psilocybin edibles through uncompromising quality.',
            'Today, we are the trusted choice for those who seek more than just a product — they seek a journey refined by mastery and guided by clarity.',
        ],
    },
    {
        index: '02',
        title: 'The Fusion standard',
        image: '/images/fusion-boxes.jpg',
        alt: 'Fusion Shroom Bars packaging',
        reverse: true,
        paragraphs: [
            'At the heart of every Fusion product is our proprietary extraction process. By utilizing advanced laboratory techniques, we ensure a clean, pure, and consistent profile that honors the power of nature while meeting the demands of modern wellness.',
        ],
    },
    {
        index: '03',
        title: 'Artisanal experience',
        image: '/images/fusion_lifestyle.png',
        alt: 'Fusion lifestyle and wellness',
        paragraphs: [
            'We believe that true wellness is an art form. From our responsibly sourced cacao to our precision-dosed infusions, every element is chosen to provide a predictably exceptional experience.',
        ],
    },
];

const VALUES = [
    {
        icon: FlaskConical,
        title: 'Pure extraction',
        desc: 'Laboratory-grade processes ensure unparalleled purity and consistency in every batch.',
    },
    {
        icon: Award,
        title: 'Artisanal Belgian',
        desc: 'Premium cacao by master chocolatiers — a profile as rich as it is effective.',
    },
    {
        icon: ShieldCheck,
        title: 'Secure privacy',
        desc: 'Excellence extends to our service. Discreet, professional delivery every time.',
    },
];

const CROSS_LINKS = [
    { href: '/faq', icon: Search, label: 'Knowledge base' },
    { href: '/shop', icon: ArrowRight, label: 'The collection' },
    { href: '/blog', icon: BookOpen, label: 'Editorial journal' },
    { href: '/contact', icon: Mail, label: 'Contact us' },
];

export default function AboutPage() {
    return (
        <div className={styles.aboutPage}>
            {/* Editorial Hero */}
            <section className={styles.editorialHero}>
                <div className={`grain-overlay ${styles.heroGrain}`} aria-hidden />
                <div className={styles.heroOrbit} aria-hidden />

                <div className={styles.heroLeft}>
                    <div className={styles.mobileHeroTextOverlay}>
                        <Reveal>
                            <span className={styles.heroTag}>Our story</span>
                            <h1 className={styles.heroTitle}>
                                Artisanal<br /><em>mastery</em>
                            </h1>
                        </Reveal>
                    </div>
                    <div className={styles.mobileHeroContentBottom}>
                        <Reveal delay={0.15}>
                            <p className={styles.heroDesc}>
                                Defining the new standard for premium wellness and refined
                                botanical experiences — precision science meets Belgian craft.
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
                    <span className={styles.heroImageBadge}>Since day one</span>
                    <Image
                        src="/images/fusion_lifestyle.png"
                        alt="Fusion Shroom Bars artisanal craft"
                        fill
                        className={styles.heroImage}
                        priority
                    />
                </div>
            </section>

            {/* Marquee */}
            <div className={styles.marqueeContainer}>
                <div className={styles.marqueeContent}>
                    <span>Pure extraction</span> • <span>Belgian craft</span> • <span>Lab precision</span> • <span>Discreet delivery</span> •
                    <span>Pure extraction</span> • <span>Belgian craft</span> • <span>Lab precision</span> • <span>Discreet delivery</span> •
                </div>
            </div>

            {/* Mission */}
            <section className={styles.missionSection}>
                <div className="container">
                    <Reveal>
                        <div className={styles.sectionHeader}>
                            <span className={styles.sectionLabel}>Our mission</span>
                            <h2 className={styles.sectionTitle}>Elevate every journey</h2>
                            <p className={styles.sectionDesc}>
                                We exist to set the benchmark for psilocybin edibles — where
                                clinical rigor and artisanal sensibility converge in every bar.
                            </p>
                        </div>
                    </Reveal>
                </div>
            </section>

            {/* Story Blocks */}
            <section className={styles.storySection}>
                <div className="container">
                    {STORY_BLOCKS.map((block, idx) => (
                        <Reveal key={block.index} delay={0.1 * idx}>
                            <article className={`${styles.storyBlock} ${block.reverse ? styles.storyBlockReverse : ''}`}>
                                <div className={styles.storyImageWrap}>
                                    <span className={styles.storyIndex}>{block.index}</span>
                                    <Image
                                        src={block.image}
                                        alt={block.alt}
                                        fill
                                        className={styles.storyImage}
                                    />
                                </div>
                                <div className={styles.storyContent}>
                                    <h2 className={styles.storyTitle}>{block.title}</h2>
                                    {block.paragraphs.map((p, i) => (
                                        <p key={i} className={styles.storyText}>{p}</p>
                                    ))}
                                </div>
                            </article>
                        </Reveal>
                    ))}
                </div>
            </section>

            {/* Values */}
            <section className={styles.valuesSection}>
                <div className="container">
                    <Reveal>
                        <div className={styles.sectionHeader}>
                            <span className={styles.sectionLabel}>Commitment</span>
                            <h2 className={styles.sectionTitle}>Uncompromising standards</h2>
                        </div>
                    </Reveal>
                    <div className={styles.valuesGrid}>
                        {VALUES.map((value, idx) => {
                            const Icon = value.icon;
                            return (
                                <Reveal key={value.title} delay={0.15 * idx}>
                                    <div className={styles.valueCard}>
                                        <div className={styles.valueIcon}>
                                            <Icon size={28} strokeWidth={1.5} />
                                        </div>
                                        <h3>{value.title}</h3>
                                        <p>{value.desc}</p>
                                    </div>
                                </Reveal>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className={styles.ctaSection}>
                <div className={styles.ctaInner}>
                    <Reveal>
                        <h2 className={styles.ctaTitle}>Embark on a refined journey</h2>
                        <p className={styles.ctaDesc}>
                            Discover precision-dosed formulations crafted for clarity, calm, and elevated experience.
                        </p>
                        <Link href="/shop" className={`${styles.heroCta} btn-shine`}>
                            Explore the collection
                            <ArrowRight size={18} />
                        </Link>
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
                    <Reveal delay={0.3}>
                        <p className={styles.disclaimer}>
                            Our artisanal products are precision-infused into world-class{' '}
                            <a
                                href="https://en.wikipedia.org/wiki/Belgian_chocolate"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Belgian chocolate
                            </a>{' '}
                            for a sophisticated wellness experience.
                        </p>
                    </Reveal>
                </div>
            </section>
        </div>
    );
}
