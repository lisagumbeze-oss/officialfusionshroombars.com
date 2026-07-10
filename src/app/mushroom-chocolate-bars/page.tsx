import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import {
    ArrowRight,
    ShoppingBag,
    CircleHelp,
    BookOpen,
    FlaskConical,
    ShieldCheck,
    Beaker,
    Candy,
} from 'lucide-react';
import styles from './page.module.css';
import { Reveal } from '@/components/Reveal';

export const revalidate = 3600;

export const metadata: Metadata = {
    title: 'Mushroom Chocolate Bars: The Ultimate Guide to Psilocybin Edibles',
    description: 'Discover everything you need to know about mushroom chocolate bars. Learn about the benefits of combining psilocybin with cocoa, how to dose safely, and where to find premium edibles.',
    alternates: {
        canonical: 'https://officialfusionshroombars.com/mushroom-chocolate-bars',
    },
};

const HERO_STATS = [
    { value: '3×', label: 'Lab tested' },
    { value: '4', label: 'Dose tiers' },
    { value: '100%', label: 'Belgian craft' },
];

const DOSE_TIERS = [
    {
        label: 'Microdose',
        range: '0.1g – 0.3g',
        desc: 'Sub-perceptual — enhanced focus, reduced anxiety, and lateral thinking without active hallucinations.',
    },
    {
        label: 'Creative / social',
        range: '0.8g – 1.5g',
        desc: 'Hyper-saturated colors, deeper music, spontaneous laughter — ideal for concerts and close friends.',
    },
    {
        label: 'Macrodose',
        range: '2.0g – 3.5g',
        desc: 'Full psychedelic experience requiring preparation, set and setting, and ideally a sober trip sitter.',
    },
    {
        label: 'Heroic dose',
        range: '4.0g – 5.0g+',
        desc: 'Reserved for experienced psychonauts seeking mystical experiences and deep spiritual recalibration.',
    },
];

const QUALITY_CHECKS = [
    'Verified QR codes linking to the official manufacturer website',
    'Embedded NFC tags inside the packaging',
    'Clean, professional inner foil wrapping — never cheap plastic',
    'Transparent lab results for heavy metals and alkaloid profiles',
];

const CROSS_LINKS = [
    { href: '/shop', icon: ShoppingBag, label: 'The collection' },
    { href: '/faq', icon: CircleHelp, label: 'Knowledge base' },
    { href: '/blog', icon: BookOpen, label: 'Editorial journal' },
    { href: '/about', icon: FlaskConical, label: 'Our process' },
];

export default function MushroomChocolateBarsLanding() {
    return (
        <div className={styles.page}>
            {/* Editorial Hero */}
            <section className={styles.editorialHero}>
                <div className={`grain-overlay ${styles.heroGrain}`} aria-hidden />
                <div className={styles.heroOrbit} aria-hidden />

                <div className={styles.heroInner}>
                    <Reveal>
                        <span className={styles.heroTag}>Complete guide</span>
                        <h1 className={styles.heroTitle}>
                            Mushroom<br /><em>chocolate bars</em>
                        </h1>
                    </Reveal>
                    <Reveal delay={0.15}>
                        <p className={styles.heroDesc}>
                            Everything you need to know about psilocybin edibles — the science,
                            safe dosing, and how to spot real quality.
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
                                Shop premium bars
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
                    <span>Precise dosing</span> • <span>Belgian chocolate</span> • <span>Lab verified</span> • <span>Discreet delivery</span> •
                    <span>Precise dosing</span> • <span>Belgian chocolate</span> • <span>Lab verified</span> • <span>Discreet delivery</span> •
                </div>
            </div>

            {/* Article */}
            <article className={styles.article} id="guide">
                <div className={styles.container}>
                    {/* Intro + image */}
                    <div className={styles.introGrid}>
                        <Reveal>
                            <div className={styles.prose}>
                                <p>
                                    The world of psychedelic wellness is rapidly evolving, and at the forefront of this revolution are <strong>mushroom chocolate bars</strong>. For decades, those seeking the profound benefits of psilocybin had to endure the incredibly earthy, often unpleasant taste of raw dried mushrooms, which frequently resulted in gastrointestinal distress and nausea. Today, modern extraction techniques combined with artisanal confectionery have entirely transformed the experience.
                                </p>
                                <p>
                                    Premium products like our <Link href="/shop">Fusion Shroom Bars</Link> seamlessly blend precisely dosed psilocybin extract with high-quality <a href="https://en.wikipedia.org/wiki/Belgian_chocolate" target="_blank" rel="noopener noreferrer">Belgian chocolate</a>. This fusion not only creates an incredibly delicious delivery mechanism but also offers unparalleled consistency and safety for consumers everywhere.
                                </p>
                            </div>
                        </Reveal>
                        <Reveal delay={0.15}>
                            <div className={styles.introImage}>
                                <Image
                                    src="/images/fusion-boxes.jpg"
                                    alt="Premium mushroom chocolate bars"
                                    fill
                                    className={styles.introImg}
                                />
                            </div>
                        </Reveal>
                    </div>

                    {/* Science */}
                    <Reveal>
                        <section className={styles.section}>
                            <div className={styles.sectionHeader}>
                                <Beaker size={22} className={styles.sectionIcon} />
                                <h2>The science of mushroom chocolate bars</h2>
                            </div>
                            <div className={styles.prose}>
                                <p>
                                    There is a fascinating scientific and historical reason why cocoa and psilocybin make such incredible partners. The ancient Aztecs called magic mushrooms &ldquo;Teonanácatl&rdquo; (meaning &ldquo;flesh of the gods&rdquo;) and frequently consumed them alongside a bitter cacao beverage. They understood intuitively what modern science is now verifying: cocoa is a mild MAO (monoamine oxidase) inhibitor.
                                </p>
                                <p>
                                    When you consume <strong>mushroom chocolate bars</strong>, the naturally occurring MAOIs in dark chocolate slow down the breakdown of psilocybin in your stomach. Because chocolate is also rich in fats and natural lipids, it acts as a smooth buffer, allowing the active alkaloids to enter your bloodstream steadily rather than aggressively. This significantly reduces the harsh &ldquo;come up&rdquo; anxiety often associated with eating raw shrooms, creating a warmer, more euphoric ascent into the psychedelic realm.
                                </p>
                                <p>
                                    Additionally, premium extract-based bars completely remove chitin—a rigid structural polymer found in the cell walls of fungi. The human body struggles to process chitin, which is why raw mushrooms frequently cause stomach cramps. By utilizing liquid extraction, brands like <Link href="/shop">Fusion</Link> eliminate this problem entirely.
                                </p>
                            </div>
                        </section>
                    </Reveal>

                    {/* Dosing */}
                    <Reveal>
                        <section className={styles.section}>
                            <div className={styles.sectionHeader}>
                                <Candy size={22} className={styles.sectionIcon} />
                                <h2>How to safely dose mushroom chocolate bars</h2>
                            </div>
                            <div className={styles.prose}>
                                <p>
                                    One of the most significant advantages of consuming legally available, lab-tested mushroom chocolate bars is the ability to precisely control your dosage. Raw mushrooms can vary wildly in potency from stem to cap and from flush to flush. A 4-gram bar that specifies it contains exactly 4,000mg of active material eliminates this dangerous guesswork.
                                </p>
                            </div>
                            <div className={styles.doseGrid}>
                                {DOSE_TIERS.map((tier, idx) => (
                                    <div key={tier.label} className={styles.doseCard}>
                                        <span className={styles.doseIndex}>
                                            {String(idx + 1).padStart(2, '0')}
                                        </span>
                                        <h3>{tier.label}</h3>
                                        <span className={styles.doseRange}>{tier.range}</span>
                                        <p>{tier.desc}</p>
                                    </div>
                                ))}
                            </div>
                            <div className={styles.prose}>
                                <p>
                                    Always follow the golden rule of psychedelic exploration: <em>Start low and go slow.</em> It can take anywhere from 30 to 90 minutes to feel the effects of mushroom chocolate bars, so wait at least 90 minutes before considering consuming more.
                                </p>
                            </div>
                        </section>
                    </Reveal>

                    {/* Quality */}
                    <Reveal>
                        <section className={styles.section}>
                            <div className={styles.sectionHeader}>
                                <ShieldCheck size={22} className={styles.sectionIcon} />
                                <h2>Identifying real quality: avoiding the black market</h2>
                            </div>
                            <div className={styles.prose}>
                                <p>
                                    As the popularity of <strong>mushroom chocolate bars</strong> has surged, so too has a highly dangerous black market. Unscrupulous operators import cheap, empty branded boxes from overseas (such as fake Polkadot or One Up packaging), fill them with low-quality compound chocolate, and dose them with 4-AcO-DMT, a synthetic research chemical that mimics psilocybin but is far cheaper and entirely unregulated.
                                </p>
                                <p>
                                    When purchasing these products, you must exercise extreme caution. True premium brands offer multiple layers of verification. Always check for:
                                </p>
                            </div>
                            <ul className={styles.checkList}>
                                {QUALITY_CHECKS.map((item, idx) => (
                                    <li key={idx}>
                                        <span className={styles.checkNum}>{idx + 1}</span>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                            <div className={styles.prose}>
                                <p>
                                    Fortunately, we take the guesswork out of the equation. Finding a trusted source is the most important step in your entire journey.
                                </p>
                            </div>
                        </section>
                    </Reveal>

                    {/* Flavors */}
                    <Reveal>
                        <section className={styles.section}>
                            <div className={styles.sectionHeader}>
                                <h2>Exploring flavor profiles</h2>
                            </div>
                            <div className={styles.prose}>
                                <p>
                                    The beauty of blending gourmet chocolate with psilocybin is the infinite array of flavor profiles available. Top-tier confectioners have realized that the earthy undertones of magic mushrooms pair beautifully with specific culinary elements.
                                </p>
                                <p>
                                    Dark chocolate (70% cocoa or above) remains the preferred base due to its natural MAOI properties, but the industry has seen massive innovation. From creamy milk chocolate and salted caramel infusions to vegan-friendly matcha and strawberry profiles, there is truly a bar for every palate. The best brands ensure that the chocolate remains properly tempered, possessing a satisfying &ldquo;snap&rdquo; when broken—a hallmark of true artisanal quality.
                                </p>
                                <p>
                                    To dive deeper into the science and culture of psilocybin wellness, we encourage you to <Link href="/blog">read our blog</Link>, where we regularly post updates on microdosing protocols, new scientific studies, and product reviews.
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
                        <h2 className={styles.ctaTitle}>Ready to elevate your mind?</h2>
                        <p className={styles.ctaDesc}>
                            Explore the official collection of ultra-premium, lab-tested mushroom
                            chocolate bars. We proudly ship safely, securely, and discreetly worldwide.
                        </p>
                        <Link href="/shop" className={`${styles.heroCta} btn-shine`}>
                            Shop premium bars now
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
