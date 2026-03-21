import type { Metadata } from 'next';
import { getPageMetadata } from '@/lib/metadata-utils';
import styles from './faq.module.css';
import { faqData } from './faq-data';
import { FAQAccordion } from '@/components/FAQAccordion';
import { Reveal } from '@/components/Reveal';
import Link from 'next/link';

export async function generateMetadata(): Promise<Metadata> {
    const fallback: Metadata = {
        title: 'Frequently Asked Questions | Official Fusion Shroom Bars',
        description: 'Find answers to common questions about Fusion Shroom Bars, shipping, product ingredients, and authenticity. Everything you need to know about the gold standard of edibles.',
    };
    return await getPageMetadata("/faq", fallback);
}

// Generate FAQ structured data for Google rich snippets
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
            <section className={styles.hero}>
                <div className={styles.container}>
                    <Reveal>
                        <p className={styles.subtitle}>HELP CENTER</p>
                        <h1>FREQUENTLY ASKED QUESTIONS</h1>
                    </Reveal>
                </div>
            </section>

            <section className={styles.faqSection}>
                <div className={styles.container}>
                    {faqData.map((category, idx) => (
                        <div key={idx} className={styles.categoryBlock}>
                            <Reveal delay={0.1 * idx}>
                                <h2 className={styles.categoryTitle}>{category.category}</h2>
                            </Reveal>
                            <div className={styles.accordionList}>
                                {category.questions.map((item, qIdx) => (
                                    <Reveal key={qIdx} delay={0.1 * qIdx}>
                                        <FAQAccordion question={item.question} answer={item.answer} />
                                    </Reveal>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Cross-Links Section */}
            <Reveal>
                <section style={{ maxWidth: '900px', margin: '0 auto', padding: '3rem 1.5rem' }}>
                    <h2 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '1rem', textAlign: 'center' }}>Still Have Questions?</h2>
                    <p style={{ color: '#999', textAlign: 'center', marginBottom: '1.5rem', fontSize: '0.9rem', lineHeight: 1.6 }}>
                        Our support team is available around the clock. You can also browse our shop or read the blog for more information.
                    </p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center' }}>
                        <Link href="/contact" style={{ padding: '0.7rem 1.5rem', borderRadius: '999px', background: '#8B5E34', color: '#fff', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 700 }}>Contact Us 24/7</Link>
                        <Link href="/shop" style={{ padding: '0.7rem 1.5rem', borderRadius: '999px', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 700 }}>Browse Products</Link>
                        <Link href="/blog" style={{ padding: '0.7rem 1.5rem', borderRadius: '999px', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 700 }}>Read Our Blog</Link>
                        <Link href="/about" style={{ padding: '0.7rem 1.5rem', borderRadius: '999px', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 700 }}>About Fusion</Link>
                    </div>
                </section>
            </Reveal>
        </div>
    );
}
