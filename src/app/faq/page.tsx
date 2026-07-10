import type { Metadata } from 'next';
import { getPageMetadata } from '@/lib/metadata-utils';
import styles from './faq.module.css';
import { faqData } from './faq-data';
import { FAQAccordion } from '@/components/FAQAccordion';
import { Reveal } from '@/components/Reveal';
import Link from 'next/link';
import { ArrowRight, Mail, ShoppingBag, BookOpen, FlaskConical } from 'lucide-react';

export async function generateMetadata(): Promise<Metadata> {
    const fallback: Metadata = {
        title: 'Frequently Asked Questions | Official Fusion Shroom Bars',
        description: 'Find answers to common questions about Fusion Shroom Bars, shipping, product ingredients, and authenticity. Everything you need to know about the gold standard of edibles.',
    };
    return await getPageMetadata("/faq", fallback);
}

const totalQuestions = faqData.reduce((sum, cat) => sum + cat.questions.length, 0);

const HERO_STATS = [
    { value: String(totalQuestions), label: 'Answers' },
    { value: String(faqData.length), label: 'Topics' },
    { value: '24/7', label: 'Support' },
];

const CROSS_LINKS = [
    { href: '/contact', icon: Mail, label: 'Contact us' },
    { href: '/shop', icon: ShoppingBag, label: 'The collection' },
    { href: '/blog', icon: BookOpen, label: 'Editorial journal' },
    { href: '/about', icon: FlaskConical, label: 'Our process' },
];

const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqData.flatMap(category =>
        category.questions.map(q => ({
            "@type": "Question",
            "name": q.question,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": q.answer
            }
        }))
    )
};

export default function FAQPage() {
    return (
        <div className={styles.faqPage}>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
            />

            {/* Editorial Hero */}
            <section className={styles.editorialHero}>
                <div className={`grain-overlay ${styles.heroGrain}`} aria-hidden />
                <div className={styles.heroOrbit} aria-hidden />

                <div className={styles.heroInner}>
                    <Reveal>
                        <span className={styles.heroTag}>Help center</span>
                        <h1 className={styles.heroTitle}>
                            Frequently<br /><em>asked</em>
                        </h1>
                    </Reveal>
                    <Reveal delay={0.15}>
                        <p className={styles.heroDesc}>
                            Everything you need to know about Fusion Shroom Bars — shipping,
                            authenticity, ingredients, and more.
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
                            <Link href="/contact" className={`${styles.heroCta} btn-shine`}>
                                Contact support
                                <ArrowRight size={18} />
                            </Link>
                            <Link href="/shop" className={styles.heroSecondary}>
                                Browse products
                            </Link>
                        </div>
                    </Reveal>
                </div>
            </section>

            {/* Marquee */}
            <div className={styles.marqueeContainer}>
                <div className={styles.marqueeContent}>
                    <span>Authentic products</span> • <span>Lab tested</span> • <span>Discreet shipping</span> • <span>24/7 support</span> •
                    <span>Authentic products</span> • <span>Lab tested</span> • <span>Discreet shipping</span> • <span>24/7 support</span> •
                </div>
            </div>

            {/* FAQ Categories */}
            <section className={styles.faqSection}>
                <div className={styles.container}>
                    <Reveal>
                        <div className={styles.sectionHeader}>
                            <span className={styles.sectionLabel}>Knowledge base</span>
                            <h2 className={styles.sectionTitle}>Browse by topic</h2>
                            <p className={styles.sectionDesc}>
                                Select a category below to find answers to the most common questions.
                            </p>
                        </div>
                    </Reveal>

                    {faqData.map((category, idx) => (
                        <div key={idx} className={styles.categoryBlock}>
                            <Reveal delay={0.1 * idx}>
                                <div className={styles.categoryHeader}>
                                    <span className={styles.categoryIndex}>
                                        {String(idx + 1).padStart(2, '0')}
                                    </span>
                                    <h2 className={styles.categoryTitle}>{category.category}</h2>
                                </div>
                            </Reveal>
                            <div className={styles.accordionList}>
                                {category.questions.map((item, qIdx) => (
                                    <Reveal key={qIdx} delay={0.05 * qIdx}>
                                        <FAQAccordion question={item.question} answer={item.answer} />
                                    </Reveal>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA */}
            <section className={styles.ctaSection}>
                <div className={styles.ctaInner}>
                    <Reveal>
                        <h2 className={styles.ctaTitle}>Still have questions?</h2>
                        <p className={styles.ctaDesc}>
                            Our support team is available around the clock. Reach out anytime
                            or explore more resources below.
                        </p>
                        <Link href="/contact" className={`${styles.heroCta} btn-shine`}>
                            Contact us 24/7
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
