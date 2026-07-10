import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import {
    ArrowRight,
    ShoppingBag,
    CircleHelp,
    BookOpen,
    FlaskConical,
    Brain,
    Sparkles,
    Calendar,
    Candy,
} from 'lucide-react';
import styles from './page.module.css';
import { Reveal } from '@/components/Reveal';

export const revalidate = 3600;

export const metadata: Metadata = {
    title: 'Microdosing Chocolate: The Complete Guide to Gentle Psilocybin | Fusion',
    description: 'Learn how microdosing chocolate can elevate your mood, focus, and creativity. A comprehensive guide to protocols, dosage, benefits, and premium psilocybin edibles.',
    alternates: {
        canonical: 'https://officialfusionshroombars.com/microdosing-chocolate',
    },
};

const HERO_STATS = [
    { value: '0.1–0.3g', label: 'Microdose' },
    { value: '2', label: 'Protocols' },
    { value: 'Daily', label: 'Wellness' },
];

const BENEFITS = [
    {
        title: 'Enhanced neuroplasticity',
        desc: 'Promotes new neural pathways, helping break rigid negative thought loops linked to depression and OCD.',
    },
    {
        title: 'Focus & flow states',
        desc: 'A non-jittery alternative to stimulants for programmers, writers, and entrepreneurs seeking deep work.',
    },
    {
        title: 'Mood stabilization',
        desc: 'A gentle lifting of mild depression, making space for gratitude and emotional resilience.',
    },
    {
        title: 'Empathy & sociability',
        desc: 'A powerful tool for overcoming social anxiety and connecting more authentically.',
    },
    {
        title: 'Physical vitality',
        desc: 'Cleaner, brighter energy without the mid-afternoon crash associated with caffeine or stimulants.',
    },
];

const PROTOCOLS = [
    {
        title: 'The Fadiman protocol',
        subtitle: '1 day on, 2 days off',
        desc: 'Developed by Dr. James Fadiman — the most popular protocol for beginners. Take one square on Monday, rest Tuesday and Wednesday, then dose again Thursday.',
    },
    {
        title: 'The Stamets stack',
        subtitle: '4 days on, 3 days off',
        desc: 'Paul Stamets combines psilocybin with Lion\'s Mane and Niacin (B3). The niacin acts as a vasodilator, pushing neurogenic benefits throughout the nervous system.',
    },
];

const CROSS_LINKS = [
    { href: '/shop', icon: ShoppingBag, label: 'The collection' },
    { href: '/faq', icon: CircleHelp, label: 'Knowledge base' },
    { href: '/blog', icon: BookOpen, label: 'Editorial journal' },
    { href: '/about', icon: FlaskConical, label: 'Our process' },
];

export default function MicrodosingChocolateLanding() {
    return (
        <div className={styles.page}>
            {/* Editorial Hero */}
            <section className={styles.editorialHero}>
                <div className={`grain-overlay ${styles.heroGrain}`} aria-hidden />
                <div className={styles.heroOrbit} aria-hidden />

                <div className={styles.heroInner}>
                    <Reveal>
                        <span className={styles.heroTag}>Wellness guide</span>
                        <h1 className={styles.heroTitle}>
                            Microdosing<br /><em>chocolate</em>
                        </h1>
                    </Reveal>
                    <Reveal delay={0.15}>
                        <p className={styles.heroDesc}>
                            A precise, delicious way to tap into the cognitive benefits of psilocybin
                            without a full hallucinogenic trip.
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
                                Shop Fusion bars
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
                    <span>Sub-perceptual dosing</span> • <span>Enhanced focus</span> • <span>Mood support</span> • <span>Precise squares</span> •
                    <span>Sub-perceptual dosing</span> • <span>Enhanced focus</span> • <span>Mood support</span> • <span>Precise squares</span> •
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
                                    A quiet revolution is happening across the world, from Silicon Valley boardrooms to quiet suburban homes. The ancient stigmas surrounding psychedelics are melting away, replaced by profound scientific curiosity and remarkable therapeutic results. At the dead center of this revolution is <strong>microdosing chocolate</strong>—an elegant, precise, and delicious way to tap into the cognitive benefits of <a href="https://en.wikipedia.org/wiki/Psilocybin" target="_blank" rel="noopener noreferrer">psilocybin</a> without experiencing a full hallucinogenic &ldquo;trip.&rdquo;
                                </p>
                                <p>
                                    Whether you are deeply entrenched in the psychedelic community or completely new to plant medicine, understanding the mechanics, protocols, and benefits of <Link href="/shop">microdosing magic mushrooms</Link> via precisely dosed chocolate bars can fundamentally alter your approach to mental wellness and productivity.
                                </p>
                            </div>
                        </Reveal>
                        <Reveal delay={0.15}>
                            <div className={styles.introImage}>
                                <Image
                                    src="/images/fusion_ingredients.png"
                                    alt="Microdosing chocolate with psilocybin extract"
                                    fill
                                    className={styles.introImg}
                                />
                            </div>
                        </Reveal>
                    </div>

                    {/* What is microdosing */}
                    <Reveal>
                        <section className={styles.section}>
                            <div className={styles.sectionHeader}>
                                <Brain size={22} className={styles.sectionIcon} />
                                <h2>What exactly is microdosing?</h2>
                            </div>
                            <div className={styles.prose}>
                                <p>
                                    To put it simply, microdosing involves consuming a sub-perceptual amount of a psychedelic substance. &ldquo;Sub-perceptual&rdquo; is the key phrase here: the goal is <em>not</em> to see fractals, melt into the couch, or talk to entities. In fact, if you feel highly intoxicated or visually stimulated, you have taken too much.
                                </p>
                                <p>
                                    A true microdose works completely in the background of your consciousness. The effects are extremely subtle, often presenting as a &ldquo;good day&rdquo; where you feel slightly more present, noticeably less anxious, and more capable of connecting disparate ideas. By utilizing <strong>microdosing chocolate</strong>, you achieve an unparalleled level of consistency because the active compound is homogenized perfectly throughout the cocoa matrix.
                                </p>
                                <p>
                                    For psilocybin, a standard microdose typically ranges between 0.1 grams (100mg) and 0.3 grams (300mg) of dried mushroom equivalent. When using our <Link href="/">Official Fusion Shroom Bars</Link>, which contain 4 grams in total divided into 15 squares, a single square (yielding roughly 266mg) acts as the absolute perfect microdose.
                                </p>
                            </div>
                        </section>
                    </Reveal>

                    {/* Benefits */}
                    <Reveal>
                        <section className={styles.section}>
                            <div className={styles.sectionHeader}>
                                <Sparkles size={22} className={styles.sectionIcon} />
                                <h2>The proven benefits of microdosing psilocybin</h2>
                            </div>
                            <div className={styles.prose}>
                                <p>
                                    The anecdotal reports from tens of thousands of users over the past decade are increasingly being backed by clinical studies from institutions like Johns Hopkins University and Imperial College London. Some of the most widely reported benefits of integrating <strong>microdosing chocolate</strong> into a wellness routine include:
                                </p>
                            </div>
                            <div className={styles.benefitGrid}>
                                {BENEFITS.map((item, idx) => (
                                    <div key={item.title} className={styles.infoCard}>
                                        <span className={styles.cardIndex}>
                                            {String(idx + 1).padStart(2, '0')}
                                        </span>
                                        <h3>{item.title}</h3>
                                        <p>{item.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </Reveal>

                    {/* Protocols */}
                    <Reveal>
                        <section className={styles.section}>
                            <div className={styles.sectionHeader}>
                                <Calendar size={22} className={styles.sectionIcon} />
                                <h2>Establishing a microdosing protocol</h2>
                            </div>
                            <div className={styles.prose}>
                                <p>
                                    It is highly recommended that you do not microdose every single day. Operating on a scheduled protocol prevents your brain from rapidly building a tolerance to the psilocybin, ensuring that the magic remains potent and effective over the long term. Two protocols dominate the psychedelic community:
                                </p>
                            </div>
                            <div className={styles.protocolGrid}>
                                {PROTOCOLS.map((item, idx) => (
                                    <div key={item.title} className={styles.protocolCard}>
                                        <span className={styles.cardIndex}>
                                            {String(idx + 1).padStart(2, '0')}
                                        </span>
                                        <h3>{item.title}</h3>
                                        <span className={styles.cardSubtitle}>{item.subtitle}</span>
                                        <p>{item.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </Reveal>

                    {/* Why chocolate */}
                    <Reveal>
                        <section className={styles.section}>
                            <div className={styles.sectionHeader}>
                                <Candy size={22} className={styles.sectionIcon} />
                                <h2>Why chocolate is the ultimate vehicle</h2>
                            </div>
                            <div className={styles.prose}>
                                <p>
                                    For decades, microdosing required buying a digital jeweler&apos;s scale, manually grinding up dried mushrooms, and packing them into gel capsules. Not only was this incredibly tedious, but it was highly inaccurate—you never knew if the slice of the cap you weighed was significantly more potent than the stem you weighed the next day.
                                </p>
                                <p>
                                    <strong>Microdosing chocolate</strong> solves this completely. By using pure psilocybin extract and vigorously homogenizing it into heated cocoa butter, manufacturers ensure that every millimeter of the chocolate has an identical molecular density of the active compound.
                                </p>
                                <p>
                                    Furthermore, the rich fats in the <a href="https://en.wikipedia.org/wiki/Belgian_chocolate" target="_blank" rel="noopener noreferrer">Belgian chocolate</a> slow the digestion process. Instead of a rapid spike of alkaloids entering your bloodstream (which can sometimes cause a tiny blip of anxiety), the onset is smooth, gradual, and incredibly gentle. If you want to dive deeper into the science of mushroom chocolate, be sure to check our <Link href="/faq">Frequently Asked Questions</Link>.
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
                        <h2 className={styles.ctaTitle}>Start your microdosing journey today</h2>
                        <p className={styles.ctaDesc}>
                            Precision dosing meets gourmet flavor. Explore our collection of premium,
                            perfectly-scored Fusion mushroom chocolate bars designed for safe and
                            consistent microdosing.
                        </p>
                        <Link href="/shop" className={`${styles.heroCta} btn-shine`}>
                            Shop Fusion bars
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
