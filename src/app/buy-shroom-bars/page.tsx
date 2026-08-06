import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import {
    ArrowRight,
    ShoppingBag,
    CircleHelp,
    BookOpen,
    FlaskConical,
    ShieldAlert,
    ShieldCheck,
    CreditCard,
    Package,
} from 'lucide-react';
import styles from './page.module.css';
import { Reveal } from '@/components/Reveal';

export const revalidate = 3600;

export const metadata: Metadata = {
    title: 'Buy Shroom Bars Online | Safe & Discrete Delivery | Fusion',
    description: 'Looking to buy shroom bars online? Learn how to spot genuine psilocybin chocolate, avoid counterfeits, and securely order premium lab-tested bars directly to your door.',
    alternates: {
        canonical: 'https://officialfusionshroombars.com/buy-shroom-bars',
    },
};

const HERO_STATS = [
    { value: '100%', label: 'Authentic' },
    { value: '3×', label: 'Lab tested' },
    { value: '48h', label: 'Dispatch' },
];

const TRUST_SIGNALS = [
    {
        title: 'Readily available lab tests',
        desc: 'Products undergo rigorous third-party testing for psilocybin potency, heavy metals, and mycotoxins.',
    },
    {
        title: 'Responsive customer support',
        desc: 'Reach a real human via our contact page — dedicated email support and clear shipping protocols.',
    },
    {
        title: 'Secure, tracked shipping',
        desc: 'Discreet vacuum-sealed Mylar packaging with delivery tracking and stealth shipping guarantees.',
    },
];

const PAYMENT_METHODS = [
    {
        title: 'Bitcoin',
        subtitle: 'BTC wallet transfer',
        desc: 'Send payment to our Bitcoin address — fast, secure, and discreet.',
    },
    {
        title: 'CashApp & Zelle',
        subtitle: 'Instant transfers',
        desc: 'Extremely popular for stateside buyers, offering fast and secure peer-to-peer payments.',
    },
    {
        title: 'Apple Pay / Chime',
        subtitle: 'Peer-to-peer apps',
        desc: 'Bypass traditional high-risk gateway fees with trusted mobile payment applications.',
    },
];

const CROSS_LINKS = [
    { href: '/shop', icon: ShoppingBag, label: 'The collection' },
    { href: '/faq', icon: CircleHelp, label: 'Knowledge base' },
    { href: '/blog', icon: BookOpen, label: 'Editorial journal' },
    { href: '/about', icon: FlaskConical, label: 'Our process' },
];

export default function BuyShroomBarsLanding() {
    return (
        <div className={styles.page}>
            {/* Editorial Hero */}
            <section className={styles.editorialHero}>
                <div className={`grain-overlay ${styles.heroGrain}`} aria-hidden />
                <div className={styles.heroOrbit} aria-hidden />

                <div className={styles.heroInner}>
                    <Reveal>
                        <span className={styles.heroTag}>Buying guide</span>
                        <h1 className={styles.heroTitle}>
                            Buy shroom<br /><em>bars online</em>
                        </h1>
                    </Reveal>
                    <Reveal delay={0.15}>
                        <p className={styles.heroDesc}>
                            How to spot genuine psilocybin chocolate, avoid counterfeits, and
                            order premium lab-tested bars safely to your door.
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
                                Browse our shop
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
                    <span>Authentic source</span> • <span>Lab verified</span> • <span>Discreet shipping</span> • <span>Secure checkout</span> •
                    <span>Authentic source</span> • <span>Lab verified</span> • <span>Discreet shipping</span> • <span>Secure checkout</span> •
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
                                    If you are searching the internet trying to figure out how to <strong>buy shroom bars online</strong>, you have likely encountered a web of confusing vendors, sketchy payment methods, and questionable products. The psychedelic renaissance has brought immense healing and joy to millions, but it has also attracted bad actors looking to capitalize on the massive demand for psilocybin chocolate.
                                </p>
                                <p>
                                    This comprehensive guide is designed to educate you on the intricacies of purchasing <a href="https://en.wikipedia.org/wiki/Psilocybin" target="_blank" rel="noopener noreferrer">psilocybin</a> edibles on the internet. Whether you are looking for our legendary <Link href="/shop">Fusion Shroom Bars</Link> or exploring other boutique options, understanding the landscape is critical for your safety and satisfaction.
                                </p>
                            </div>
                        </Reveal>
                        <Reveal delay={0.15}>
                            <div className={styles.introImage}>
                                <Image
                                    src="/images/hero-fusion.png"
                                    alt="Buy authentic Fusion Shroom Bars online"
                                    fill
                                    className={styles.introImg}
                                />
                            </div>
                        </Reveal>
                    </div>

                    {/* Counterfeits */}
                    <Reveal>
                        <section className={styles.section}>
                            <div className={styles.sectionHeader}>
                                <ShieldAlert size={22} className={styles.sectionIcon} />
                                <h2>The surge in counterfeit shroom bars</h2>
                            </div>
                            <div className={styles.prose}>
                                <p>
                                    The number one issue consumers face when they try to <strong>buy shroom bars online</strong> is encountering counterfeit products. As brands like Fusion and Polkadot gained massive popularity, overseas manufacturers began producing thousands of identical, empty cardboard packaging boxes. These boxes are sold in bulk to illicit dealers who then fill them with cheap, gas-station-quality chocolate.
                                </p>
                                <p>
                                    Worse still, these counterfeiters rarely use actual psilocybe mushrooms. Because raw mushrooms are time-consuming to grow, they often lace the chocolate with 4-AcO-DMT, a synthetic research chemical that converts into psilocin in the body but lacks the &ldquo;entourage effect&rdquo; of whole-fungus alkaloids like baeocystin and norbaeocystin. The resulting high is often described as highly synthetic, lacking the grounded, earthy feeling of genuine magic mushrooms.
                                </p>
                                <p>
                                    To protect yourself, you must be hyper-vigilant. True manufacturers use high-quality holographic seals, proprietary stamping on the chocolate itself, and verified QR codes that link securely back to a transparent domain.
                                </p>
                            </div>
                        </section>
                    </Reveal>

                    {/* Trust signals */}
                    <Reveal>
                        <section className={styles.section}>
                            <div className={styles.sectionHeader}>
                                <ShieldCheck size={22} className={styles.sectionIcon} />
                                <h2>Key indicators of a trustworthy online vendor</h2>
                            </div>
                            <div className={styles.prose}>
                                <p>
                                    When deciding where to <strong>buy shroom bars online</strong>, you should evaluate the vendor based on a strict set of criteria. The dark web era is over; today, premium psychedelic e-commerce should feel just as professional as buying high-end supplements or craft coffee.
                                </p>
                            </div>
                            <div className={styles.cardGrid}>
                                {TRUST_SIGNALS.map((item, idx) => (
                                    <div key={item.title} className={styles.infoCard}>
                                        <span className={styles.cardIndex}>
                                            {String(idx + 1).padStart(2, '0')}
                                        </span>
                                        <h3>{item.title}</h3>
                                        <p>
                                            {idx === 1 ? (
                                                <>
                                                    Reach a real human via our{' '}
                                                    <Link href="/contact">contact page</Link>
                                                    {' '}— dedicated email support and clear shipping protocols.
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

                    {/* Payment */}
                    <Reveal>
                        <section className={styles.section}>
                            <div className={styles.sectionHeader}>
                                <CreditCard size={22} className={styles.sectionIcon} />
                                <h2>Understanding payment methods for edibles</h2>
                            </div>
                            <div className={styles.prose}>
                                <p>
                                    A common point of confusion for first-time buyers is the checkout process. Due to federal banking regulations regarding psilocybin, traditional credit card processors (like Stripe or PayPal) will instantly ban vendors selling magic mushroom products. Therefore, if you see a website offering standard credit card processing for shroom bars, you should proceed with extreme caution—it is highly likely a honey-pot or a scam that will steal your card information.
                                </p>
                                <p>
                                    Legitimate vendors who allow you to genuinely <strong>buy shroom bars online</strong> operate using alternative secure payment gateways. The most common and secure methods include:
                                </p>
                            </div>
                            <div className={styles.cardGrid}>
                                {PAYMENT_METHODS.map((item, idx) => (
                                    <div key={item.title} className={styles.infoCard}>
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

                    {/* Buy direct */}
                    <Reveal>
                        <section className={styles.section}>
                            <div className={styles.sectionHeader}>
                                <Package size={22} className={styles.sectionIcon} />
                                <h2>Why buying directly from the source is crucial</h2>
                            </div>
                            <div className={styles.prose}>
                                <p>
                                    We cannot stress this enough: cutting out the middleman is the safest way to procure your chocolate. Middlemen and &ldquo;resellers&rdquo; on social media applications like Telegram and Instagram are notorious for pulling exit scams—taking your money and immediately blocking you.
                                </p>
                                <p>
                                    By ordering directly through an official verified website (like ours), you eliminate the risk of the &ldquo;man in the middle.&rdquo; We control the manufacturing process from spawn-to-sale. Our mycologists extract the psilocybin, our chocolatiers temper the Belgian chocolate, and our fulfillment team vacuum-seals the final package before it lands on your doorstep.
                                </p>
                                <p>
                                    If you want to read more about our rigorous safety standards and the history of our brand, please <Link href="/about">read our story here</Link>.
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
                        <h2 className={styles.ctaTitle}>Ready to order safely?</h2>
                        <p className={styles.ctaDesc}>
                            Avoid the fakes. Skip the scammers. Buy authentic, lab-tested mushroom
                            chocolate directly from the premier manufacturer. Safe, discreet worldwide
                            shipping guaranteed.
                        </p>
                        <Link href="/shop" className={`${styles.heroCta} btn-shine`}>
                            Browse our shop
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
