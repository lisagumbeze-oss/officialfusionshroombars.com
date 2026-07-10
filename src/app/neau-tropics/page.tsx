import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import {
    ArrowRight,
    ShoppingBag,
    CircleHelp,
    BookOpen,
    FlaskConical,
    Sparkles,
    Candy,
    ShieldAlert,
    Layers,
} from 'lucide-react';
import styles from './page.module.css';
import { Reveal } from '@/components/Reveal';

export const revalidate = 3600;

export const metadata: Metadata = {
    title: 'Neau Tropics Mushroom Chocolates | Buy Neau Tropics Online',
    description: 'Learn why Neau Tropics mushroom chocolates have become the most sought-after artisanal psilocybin edibles. Discover their unique flavor pairings, dosage precision, and how to verify authenticity.',
    alternates: {
        canonical: 'https://officialfusionshroombars.com/neau-tropics',
    },
};

const HERO_STATS = [
    { value: 'Boutique', label: 'Artisanal' },
    { value: '4g', label: 'Per bar' },
    { value: '3×', label: 'Lab tested' },
];

const FLAVORS = [
    {
        title: 'Matcha Yuzu',
        subtitle: 'Vegan',
        desc: 'Earthy Japanese matcha and bright yuzu citrus — bitterness masks mushroom notes while citrus provides an uplifting sensory cue.',
    },
    {
        title: 'Cookies & Cream',
        subtitle: 'Classic',
        desc: 'Crushed organic chocolate cookies folded into rich, creamy white chocolate that melts effortlessly on the tongue.',
    },
    {
        title: 'Strawberry Shortcake',
        subtitle: 'Fruity',
        desc: 'Freeze-dried organic strawberries providing satisfying crunch against a smooth white chocolate matrix.',
    },
    {
        title: 'Sea Salt Caramel',
        subtitle: 'Savory-sweet',
        desc: 'Deep dark chocolate with ribbons of caramel and coarse sea salt flakes that burst with flavor.',
    },
    {
        title: 'Classic Dark',
        subtitle: '72% cacao',
        desc: 'The purist\'s choice. Dark chocolate acts as a mild natural MAOI, potentially deepening and stabilizing the psilocybin experience.',
        guideLink: '/mushroom-chocolate-bars',
    },
];

const DOSE_TIERS = [
    {
        title: 'The microdose',
        subtitle: '1 to 2 squares',
        desc: 'Ideal for daily integration. Sub-perceptual effects — work, code, or socialize comfortably with a lifted mood.',
        link: { href: '/microdosing-chocolate', label: 'Microdosing protocols guide' },
    },
    {
        title: 'The museum dose',
        subtitle: '4 to 6 squares',
        desc: 'The sweet spot for recreational use. Vibrant colors, enhanced tactile sensations, waves of euphoria — perfect for nature walks.',
    },
    {
        title: 'The deep dive',
        subtitle: '7+ squares',
        desc: 'A profound classical psychedelic journey. Closed-eye visuals, deep introspection, and intense shifts in temporal awareness.',
    },
];

const CROSS_LINKS = [
    { href: '/shop?category=Neau%20Tropics', icon: ShoppingBag, label: 'Shop Neau Tropics' },
    { href: '/mushroom-chocolate-bars', icon: BookOpen, label: 'Chocolate guide' },
    { href: '/faq', icon: CircleHelp, label: 'Knowledge base' },
    { href: '/about', icon: FlaskConical, label: 'Our process' },
];

export default function NeauTropicsLanding() {
    return (
        <div className={styles.page}>
            {/* Editorial Hero */}
            <section className={styles.editorialHero}>
                <div className={`grain-overlay ${styles.heroGrain}`} aria-hidden />
                <div className={styles.heroOrbit} aria-hidden />

                <div className={styles.heroInner}>
                    <Reveal>
                        <span className={styles.heroTag}>Brand guide</span>
                        <h1 className={styles.heroTitle}>
                            Neau<br /><em>Tropics</em>
                        </h1>
                    </Reveal>
                    <Reveal delay={0.15}>
                        <p className={styles.heroDesc}>
                            The definitive guide to boutique artisanal psilocybin chocolates —
                            flavor, precision, and how to verify authenticity.
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
                            <Link
                                href="/shop?category=Neau%20Tropics"
                                className={`${styles.heroCta} btn-shine`}
                            >
                                Shop Neau Tropics
                                <ArrowRight size={18} />
                            </Link>
                            <a href="#guide" className={styles.heroSecondary}>
                                Read the guide
                            </a>
                        </div>
                    </Reveal>
                </div>
            </section>

            {/* Marquee */}
            <div className={styles.marqueeContainer}>
                <div className={styles.marqueeContent}>
                    <span>Artisanal craft</span> • <span>Unique flavors</span> • <span>Precise dosing</span> • <span>Authentic source</span> •
                    <span>Artisanal craft</span> • <span>Unique flavors</span> • <span>Precise dosing</span> • <span>Authentic source</span> •
                </div>
            </div>

            {/* Article */}
            <article className={styles.article} id="guide">
                <div className={styles.container}>
                    {/* Intro */}
                    <div className={styles.introGrid}>
                        <Reveal>
                            <div className={styles.prose}>
                                <p>
                                    In the rapidly expanding universe of premium psychedelic edibles, one name consistently emerges at the apex of culinary artistry: <Link href="/shop?category=Neau%20Tropics">Neau Tropics</Link>. Born out of a deep reverence for mycological science and a passion for high-end confectionery, <a href="https://en.wikipedia.org/wiki/Belgian_chocolate" target="_blank" rel="noopener noreferrer">Belgian chocolate</a>-infused mushroom bars have redefined what a &ldquo;trip&rdquo; can taste and feel like.
                                </p>
                                <p>
                                    While <Link href="/shop">Fusion Shroom Bars</Link> set the industry standard for mass-scale precision and accessibility, <strong>Neau Tropics</strong> carve out a unique niche as a boutique, artisanal offering. They are meticulously crafted for the psychonaut who views the ingestion of plant medicine not merely as a utilitarian task, but as an aesthetic and sensory ritual from start to finish.
                                </p>
                            </div>
                        </Reveal>
                        <Reveal delay={0.15}>
                            <div className={styles.introImage}>
                                <Image
                                    src="/images/fusion-boxes.jpg"
                                    alt="Neau Tropics mushroom chocolate bars"
                                    fill
                                    className={styles.introImg}
                                />
                            </div>
                        </Reveal>
                    </div>

                    {/* What makes special */}
                    <Reveal>
                        <section className={styles.section}>
                            <div className={styles.sectionHeader}>
                                <Sparkles size={22} className={styles.sectionIcon} />
                                <h2>What makes Neau Tropics so special?</h2>
                            </div>
                            <div className={styles.prose}>
                                <p>
                                    Every aspect of the Neau Tropics product line is designed to elevate the psychedelic experience. From the sleek, minimalist packaging that feels more like a tech product than an illicit substance, to the absolutely incredible array of flavor profiles, they have essentially cracked the code on gourmet psilocybin delivery.
                                </p>
                                <p>
                                    What truly separates a <strong>Neau Tropics mushroom chocolate</strong> from the competition is their proprietary homogenization process. Creating a perfectly dosed bar is incredibly difficult. If a manufacturer simply grinds up raw mushrooms and pours them into a chocolate mold, the active alkaloids will settle unevenly. This results in &ldquo;hot spots,&rdquo; where one square does absolutely nothing, and the next square sends you into the stratosphere.
                                </p>
                                <p>
                                    Neau Tropics utilizes an advanced liquid extraction methodology. By stripping away the fungal body (the chitin) and extracting only the pure psilocybin and psilocin, they can blend the active ingredients seamlessly into the cocoa butter. This means every single square of a Neau Tropics bar contains the exact same micro-milligram dosage of active compound.
                                </p>
                            </div>
                        </section>
                    </Reveal>

                    {/* Flavors */}
                    <Reveal>
                        <section className={styles.section}>
                            <div className={styles.sectionHeader}>
                                <Candy size={22} className={styles.sectionIcon} />
                                <h2>Exploring the Neau Tropics flavor profiles</h2>
                            </div>
                            <div className={styles.prose}>
                                <p>
                                    While traditional brands stick to basic milk and dark chocolate, Neau Tropics has pushed the boundaries of infusing psychedelic extracts into complex, multi-layered culinary profiles. Some of their most iconic, highly sought-after flavors include:
                                </p>
                            </div>
                            <div className={styles.flavorGrid}>
                                {FLAVORS.map((item, idx) => (
                                    <div key={item.title} className={styles.infoCard}>
                                        <span className={styles.cardIndex}>
                                            {String(idx + 1).padStart(2, '0')}
                                        </span>
                                        <h3>{item.title}</h3>
                                        <span className={styles.cardSubtitle}>{item.subtitle}</span>
                                        <p>
                                            {'guideLink' in item && item.guideLink ? (
                                                <>
                                                    The purist&apos;s choice. As detailed in our{' '}
                                                    <Link href={item.guideLink}>ultimate guide to mushroom chocolate</Link>
                                                    , dark chocolate acts as a mild natural MAOI, potentially deepening and stabilizing the psilocybin experience.
                                                </>
                                            ) : (
                                                item.desc
                                            )}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </Reveal>

                    {/* Dosing */}
                    <Reveal>
                        <section className={styles.section}>
                            <div className={styles.sectionHeader}>
                                <Layers size={22} className={styles.sectionIcon} />
                                <h2>How to safely dose Neau Tropics</h2>
                            </div>
                            <div className={styles.prose}>
                                <p>
                                    Like its cousin, the Fusion Bar, a standard Neau Tropics chocolate bar contains exactly 4 grams (4,000mg) of active psilocybin extract, meticulously divided into equal squares. Here is how you should approach dosing based on your intentions:
                                </p>
                            </div>
                            <div className={styles.doseGrid}>
                                {DOSE_TIERS.map((item, idx) => (
                                    <div key={item.title} className={styles.doseCard}>
                                        <span className={styles.cardIndex}>
                                            {String(idx + 1).padStart(2, '0')}
                                        </span>
                                        <h3>{item.title}</h3>
                                        <span className={styles.cardSubtitle}>{item.subtitle}</span>
                                        <p>
                                            {item.desc}
                                            {item.link && (
                                                <>
                                                    {' '}Read our{' '}
                                                    <Link href={item.link.href}>{item.link.label}</Link>.
                                                </>
                                            )}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </Reveal>

                    {/* Counterfeits */}
                    <Reveal>
                        <section className={styles.section}>
                            <div className={styles.sectionHeader}>
                                <ShieldAlert size={22} className={styles.sectionIcon} />
                                <h2>Beware of counterfeit Neau Tropics</h2>
                            </div>
                            <div className={styles.prose}>
                                <p>
                                    The immense popularity of <strong>Neau Tropics</strong> has predictably led to massive counterfeiting operations. Chinese manufacturers routinely flood DHGate and Alibaba with pristine, identical Neau Tropics wrappers. Unscrupulous dealers buy these by the thousands and fill them with extremely low-quality chocolate sprayed with synthetic 4-AcO-DMT.
                                </p>
                                <p>
                                    If you see a vendor selling Neau Tropics on Telegram or Instagram for suspiciously cheap prices (or without verifiable lab results), you are almost certainly buying a dangerous synthetic fake. Always verify the packaging quality. Genuine products utilize heavy cardstock, high-fidelity foil stamping, and verifiable security tags.
                                </p>
                                <p>
                                    Because securing authentic Neau Tropics can be exceedingly difficult due to their boutique production runs, many connoisseurs turn to <Link href="/shop">Fusion Shroom Bars</Link> as a highly consistent, premium alternative when Neau Tropics are out of stock.
                                </p>
                            </div>
                        </section>
                    </Reveal>
                </div>
            </article>

            {/* CTA */}
            <section className={styles.ctaSection}>
                <div className={styles.ctaInner}>
                    <Reveal>
                        <h2 className={styles.ctaTitle}>Ready to experience the pinnacle of edibles?</h2>
                        <p className={styles.ctaDesc}>
                            Explore our curated collection of guaranteed authentic, third-party
                            lab-tested Neau Tropics and Fusion products. Secure, discreet shipping worldwide.
                        </p>
                        <Link href="/shop?category=Neau%20Tropics" className={`${styles.heroCta} btn-shine`}>
                            Shop authentic edibles
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
                </div>
            </section>
        </div>
    );
}
