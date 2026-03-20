import type { Metadata } from 'next';
import { getPageMetadata } from '@/lib/metadata-utils';
import styles from './page.module.css';
import Image from 'next/image';
import Link from 'next/link';
import { Reveal } from '@/components/Reveal';

export async function generateMetadata(): Promise<Metadata> {
    const fallback: Metadata = {
        title: 'About Official Fusion Shroom Bars | Our Story & Standards',
        description: 'Learn the authentic story of Fusion Shroom Bars. Discover our commitment to precision science, artisanal craftsmanship, and the industry standard for psilocybin wellness.',
    };
    return await getPageMetadata("/about", fallback);
}

export default function AboutPage() {
    return (
        <div className={styles.aboutPage}>
            {/* Hero Section */}
            <section className={styles.hero}>
                <div className={styles.container}>
                    <Reveal>
                        <h1>ARTISANAL MASTERY</h1>
                    </Reveal>
                    <Reveal delay={0.2}>
                        <p className={styles.lead}>Defining the new standard for premium wellness and refined botanical experiences.</p>
                    </Reveal>
                </div>
            </section>

            {/* Content Section */}
            <section className={styles.contentSection}>
                <div className={styles.container}>
                    <div className={styles.grid}>
                        <div className={styles.textBlock}>
                            <Reveal>
                                <h2>A Vision of Excellence</h2>
                            </Reveal>
                            <Reveal delay={0.2}>
                                <p>
                                    Fusion Shroom Bars represents the pinnacle of artisanal craftsmanship and scientific precision. Our journey began with a simple yet ambitious goal: to elevate the botanical experience through uncompromising quality and sophisticated delivery.
                                </p>
                            </Reveal>
                            <Reveal delay={0.3}>
                                <p>
                                    Today, we are proud to be the trusted choice for those who seek more than just a product—they seek a journey refined by mastery and guided by clarity.
                                </p>
                            </Reveal>
                            <Reveal delay={0.4}>
                                <h2>The Fusion Standard</h2>
                            </Reveal>
                            <Reveal delay={0.5}>
                                <p>
                                    At the heart of every Fusion product is our proprietary extraction process. By utilizing advanced laboratory techniques, we ensure a clean, pure, and consistent profile that honors the power of nature while meeting the demands of modern wellness.
                                </p>
                            </Reveal>
                            <Reveal delay={0.6}>
                                <p>
                                    We believe that true wellness is an art form. From our responsibly sourced cacao to our precision-dosed infusions, every element is chosen to provide a predictably exceptional experience.
                                </p>
                            </Reveal>
                        </div>
                        <div className={styles.imageBlock}>
                            <Reveal delay={0.3}>
                                <Image 
                                    src="/images/fusion-boxes.jpg" 
                                    alt="Fusion Shroom Bars Collection - Premium Artisanal Wellness Products" 
                                    width={600} 
                                    height={600} 
                                    style={{ objectFit: 'cover', borderRadius: '15px', boxShadow: '0 20px 40px rgba(0,0,0,0.08)' }} 
                                />
                            </Reveal>
                        </div>
                    </div>
                </div>
            </section>

            {/* Why Fusion */}
            <section className={styles.values}>
                <div className={styles.container}>
                    <Reveal>
                        <h2 className={styles.centeredTitle}>UNCOMPROMISING COMMITMENT</h2>
                    </Reveal>
                    <div className={styles.valuesGrid}>
                        <Reveal delay={0.2}>
                            <div className={styles.valueCard}>
                                <div className={styles.icon}>🔬</div>
                                <h3>Pure Extraction</h3>
                                <p>Our laboratory-grade processes ensure unparalleled purity and consistency in every batch.</p>
                            </div>
                        </Reveal>
                        <Reveal delay={0.4}>
                            <div className={styles.valueCard}>
                                <div className={styles.icon}>🌟</div>
                                <h3>Artisanal Belgian</h3>
                                <p>Crafted with premium cacao by master chocolatiers for a profile that is as rich as it is effective.</p>
                            </div>
                        </Reveal>
                        <Reveal delay={0.6}>
                            <div className={styles.valueCard}>
                                <div className={styles.icon}>🛡️</div>
                                <h3>Secure Privacy</h3>
                                <p>Excellence extends to our service. Your journey begins with discreet, professional delivery.</p>
                            </div>
                        </Reveal>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <Reveal>
                <section className={styles.cta}>
                    <div className={styles.container}>
                        <h2>Embark on a Refined Journey</h2>
                        <Link href="/shop" className={styles.ctaButton}>EXPLORE THE COLLECTION</Link>
                        <div style={{ marginTop: '2rem', display: 'flex', flexWrap: 'wrap', gap: '1.5rem', justifyContent: 'center' }}>
                            <Link href="/faq" style={{ color: '#7c3aed', textDecoration: 'none', fontWeight: '600', fontSize: '0.9rem' }}>Read our FAQ</Link>
                            <Link href="/contact" style={{ color: '#7c3aed', textDecoration: 'none', fontWeight: '600', fontSize: '0.9rem' }}>Contact Us 24/7</Link>
                            <Link href="/blog" style={{ color: '#7c3aed', textDecoration: 'none', fontWeight: '600', fontSize: '0.9rem' }}>Visit the Blog</Link>
                        </div>
                        <p style={{ marginTop: '1.5rem', color: '#6b7280', fontSize: '0.8rem', maxWidth: '600px', margin: '1.5rem auto 0', lineHeight: 1.6 }}>
                            Our artisanal products are precision-infused into world-class <a href="https://en.wikipedia.org/wiki/Belgian_chocolate" target="_blank" rel="noopener noreferrer" style={{ color: '#7c3aed' }}>Belgian chocolate</a> for a sophisticated wellness experience.
                        </p>
                    </div>
                </section>
            </Reveal>
        </div>
    );
}
