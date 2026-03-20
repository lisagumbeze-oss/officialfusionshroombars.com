import type { Metadata } from 'next';
import { getPageMetadata } from '@/lib/metadata-utils';
import Image from 'next/image';
import styles from './page.module.css';
export const revalidate = 3600; // Incrementally regenerate page every hour

import Link from 'next/link';
import prisma from '@/lib/prisma';
import AddToCartButton from '@/components/AddToCartButton';
import { Reveal } from '@/components/Reveal';

export async function generateMetadata(): Promise<Metadata> {
  const fallback: Metadata = {
    title: "Official Fusion Shroom Bars | Authentic Mushroom Chocolate",
    description: "The official home of Fusion Shroom Bars and Neau Tropics. Shop authentic Fusion Chocolate Bars for focus, energy, and wellness. Premium psilocybin edibles for the USA, UK, Canada, and Australia.",
    openGraph: {
      title: "Official Fusion Shroom Bars | Premium Authentic Fusion Edibles",
      description: "Shop authentic Fusion mushroom-infused chocolate and gummies. Experience the gold standard of focus and calm energy.",
      images: ["/images/hero-fusion.png"],
    },
  };

  return await getPageMetadata("/", fallback);
}

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Official Fusion Shroom Bars",
  "url": "https://officialfusionshroombars.com",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://officialfusionshroombars.com/shop?query={search_term_string}",
    "query-input": "required name=search_term_string"
  }
};

export default async function Home() {
  let bestsellers = [];
  try {
    const products = await (prisma as any).product.findMany({
      where: { isActive: true },
      take: 8,
      orderBy: { createdAt: 'desc' }
    });
    bestsellers = products;
  } catch (error) {
    console.error('[Home] Failed to fetch bestsellers:', error);
    // Keep bestsellers as empty array so page doesn't crash
  }

  return (
    <div className={styles.home}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroImgWrapper}>
          <Image 
            src="/images/hero-fusion.png" 
            alt="Official Fusion Shroom Bars - Premium Psilocybin Mushroom Chocolate Bars" 
            fill 
            style={{ objectFit: 'cover' }} 
            className={styles.heroImg} 
            priority
          />
        </div>
        <div className={styles.heroOverlay}></div>
        <div className={styles.heroContent}>
          <Reveal delay={0.2}>
            <p className={styles.subtitle}>FUSION MUSHROOM BARS OFFICIAL</p>
          </Reveal>
          <Reveal delay={0.4}>
            <h1 className={styles.title}>
              The Gold Standard of Fusion Edibles
            </h1>
          </Reveal>
          <Reveal delay={0.6}>
            <p className={styles.heroText}>
              Fusion Shroom Bars are the highest quality Belgian chocolate psilocybin bars on the market. Buy authentic magic mushroom chocolate bars online with precise dosing, lab-tested purity, and discreet worldwide shipping to the USA, UK, Canada, and Australia.
            </p>
          </Reveal>
          <Reveal delay={0.8}>
            <div className={styles.buttons}>
              <Link href="/shop" className={`${styles.button} ${styles.primaryBtn}`} spellCheck={false}>
                BROWSE COLLECTION
              </Link>
              <Link href="/about" className={`${styles.button} ${styles.secondaryBtn} glass-morphism`} spellCheck={false}>
                THE FUSION STORY
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Trust Badges */}
      <section className={styles.trustBadges}>
        <Reveal delay={0.2}>
          <div className={styles.badge}>
            <span className={styles.badgeIcon}>🔬</span>
            <h3>FOCUS & CLARITY</h3>
            <p>Precise blends for mental performance.</p>
          </div>
        </Reveal>
        <Reveal delay={0.4}>
          <div className={styles.badge}>
            <span className={styles.badgeIcon}>🧘</span>
            <h3>CALM ENERGY</h3>
            <p>Stable, grounding effects for wellness.</p>
          </div>
        </Reveal>
        <Reveal delay={0.6}>
          <div className={styles.badge}>
            <span className={styles.badgeIcon}>🍫</span>
            <h3>AUTHENTIC FUSION</h3>
            <p>The original gold standard shroom bar.</p>
          </div>
        </Reveal>
      </section>

      {/* About Teaser */}
      <section className={styles.aboutTeaser}>
        <div className={styles.container}>
          <div className={styles.teaserGrid}>
            <div className={styles.teaserImage}>
               <Reveal>
                 <Image src="/images/fusion-bars-hand.jpg" alt="Fusion Bars" width={600} height={400} style={{ objectFit: 'cover', borderRadius: '15px' }} />
               </Reveal>
            </div>
            <div className={styles.teaserText}>
              <Reveal delay={0.2}>
                <h2>Masterful Fusion. Pure Perfection.</h2>
              </Reveal>
              <Reveal delay={0.4}>
                <p>
                  Our mission at Fusion is to provide a safe, consistent, and undeniably delicious way to explore the world of psilocybin. Each bar is a masterpiece of <a href="https://en.wikipedia.org/wiki/Belgian_chocolate" target="_blank" rel="noopener noreferrer" style={{ color: '#c9a44a', textDecoration: 'underline' }}>Belgian confectionery</a> expertise and modern extraction science.
                </p>
              </Reveal>
              <Reveal delay={0.5}>
                <p>
                  Whether you seek spiritual growth, creative breakthroughs, or simply a refined weekend escape, Fusion Shroom Bars deliver the precision you deserve.
                </p>
              </Reveal>
              <Reveal delay={0.6}>
                <ul>
                  <li>✓ Organic Psilocybin Extract</li>
                  <li>✓ 4000mg & 6000mg Variants</li>
                  <li>✓ Precise Dosage Breakdown</li>
                  <li>✓ 100% Discrete Shipping</li>
                </ul>
              </Reveal>
              <Reveal delay={0.7}>
                <Link href="/about" className={styles.learnMore}>DISCOVER OUR LAB PROCESS &rarr;</Link>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* Bestsellers Section */}
      <section className={styles.bestsellers}>
        <Reveal>
          <div className={styles.sectionHeader}>
            <div className={styles.headerTitle}>
              <p>SHOP THE BEST</p>
              <h2>OUR BESTSELLERS</h2>
            </div>
            <Link href="/shop" className={styles.browseAll}>View All <span>&rarr;</span></Link>
          </div>
        </Reveal>
        
        <div className={styles.productGrid}>
          {bestsellers.map((product: any, index: number) => (
            <Reveal key={product.id} delay={index * 0.1}>
              <div className={styles.productCard}>
                <div className={styles.productImageWrapper}>
                  <Image src={product.image} alt={product.name} fill style={{ objectFit: 'cover' }} unoptimized />
                  {product.regularPrice && product.regularPrice > product.price && (
                    <span className={styles.saleTag}>SALE</span>
                  )}
                </div>
                <div className={styles.productInfo}>
                  <div className={styles.categoryLabel}>{product.category}</div>
                  <h3 className={styles.productTitle}>{product.name}</h3>
                  <div className={styles.price}>
                    {product.regularPrice && (
                      <span className={styles.oldPrice}>${product.regularPrice.toFixed(2)}</span>
                    )}
                    <span className={styles.newPrice}>${product.price.toFixed(2)}</span>
                  </div>
                  <div className={styles.buttonGroup}>
                    <Link href={`/shop/${product.slug}`} className={`${styles.button} premium-gradient ${styles.viewBtn}`}>
                      VIEW
                    </Link>
                    <AddToCartButton product={product} className={styles.cartBtn} />
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Internal Links Section - SEO Cross-linking */}
      <section className={styles.bestsellers} style={{ paddingTop: '2rem', paddingBottom: '0' }}>
        <Reveal>
          <div className={styles.sectionHeader}>
            <div className={styles.headerTitle}>
              <p>LEARN MORE</p>
              <h2>EXPLORE FUSION</h2>
            </div>
          </div>
        </Reveal>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', padding: '1rem 0' }}>
          <Reveal delay={0.1}>
            <Link href="/blog" style={{ display: 'block', padding: '2rem', borderRadius: '16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', textDecoration: 'none', color: 'inherit', transition: 'border-color 0.3s' }}>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>📖 Fusion Blog</h3>
              <p style={{ color: '#999', fontSize: '0.85rem', lineHeight: 1.6 }}>Read about psilocybin science, microdosing guides, and wellness insights from the Fusion team.</p>
            </Link>
          </Reveal>
          <Reveal delay={0.2}>
            <Link href="/faq" style={{ display: 'block', padding: '2rem', borderRadius: '16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', textDecoration: 'none', color: 'inherit', transition: 'border-color 0.3s' }}>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>❓ FAQ</h3>
              <p style={{ color: '#999', fontSize: '0.85rem', lineHeight: 1.6 }}>Have questions about authenticity, shipping, or dosing? Find answers to the most common queries here.</p>
            </Link>
          </Reveal>
          <Reveal delay={0.3}>
            <Link href="/contact" style={{ display: 'block', padding: '2rem', borderRadius: '16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', textDecoration: 'none', color: 'inherit', transition: 'border-color 0.3s' }}>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>📬 Contact Us</h3>
              <p style={{ color: '#999', fontSize: '0.85rem', lineHeight: 1.6 }}>Our 24/7 support team is ready to assist you with orders, product questions, and more.</p>
            </Link>
          </Reveal>
        </div>
      </section>

      {/* Customer Reviews Section */}
      <section className={styles.bestsellers} style={{ paddingTop: '2rem', paddingBottom: '0' }}>
        <Reveal>
          <div className={styles.sectionHeader}>
            <div className={styles.headerTitle}>
              <p>TRUSTED WORLDWIDE</p>
              <h2>WHAT OUR CUSTOMERS SAY</h2>
            </div>
          </div>
        </Reveal>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', padding: '1rem 0' }}>
          <Reveal delay={0.1}>
            <div style={{ padding: '2rem', borderRadius: '16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ color: '#c9a44a', marginBottom: '1rem', display: 'flex', gap: '4px' }}>
                {"\u2605\u2605\u2605\u2605\u2605"}
              </div>
              <p style={{ color: '#eaeaea', fontStyle: 'italic', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                "I've tried a lot of brands, but Fusion is by far the most consistent. The dosage is incredibly precise, and the Belgian chocolate actually tastes gourmet. Highly recommend the Cookies and Cream."
              </p>
              <div>
                <strong style={{ display: 'block', fontSize: '1rem' }}>Michael T.</strong>
                <span style={{ fontSize: '0.8rem', color: '#999' }}>Verified Buyer &middot; Los Angeles, CA</span>
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.2}>
            <div style={{ padding: '2rem', borderRadius: '16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ color: '#c9a44a', marginBottom: '1rem', display: 'flex', gap: '4px' }}>
                {"\u2605\u2605\u2605\u2605\u2605"}
              </div>
              <p style={{ color: '#eaeaea', fontStyle: 'italic', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                "Absolutely life-changing for my microdosing routine. 1-2 squares a day has done more for my anxiety and focus than anything else. 10/10 customer support and fast stealth shipping."
              </p>
              <div>
                <strong style={{ display: 'block', fontSize: '1rem' }}>Sarah L.</strong>
                <span style={{ fontSize: '0.8rem', color: '#999' }}>Verified Buyer &middot; Austin, TX</span>
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.3}>
            <div style={{ padding: '2rem', borderRadius: '16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ color: '#c9a44a', marginBottom: '1rem', display: 'flex', gap: '4px' }}>
                {"\u2605\u2605\u2605\u2605\u2605"}
              </div>
              <p style={{ color: '#eaeaea', fontStyle: 'italic', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                "Ordered Neau Tropics initially but they were out, so the team recommended Fusion Dark Chocolate. Honestly? Even better. Cleanest trip I've ever had, absolutely zero stomach issues."
              </p>
              <div>
                <strong style={{ display: 'block', fontSize: '1rem' }}>David K.</strong>
                <span style={{ fontSize: '0.8rem', color: '#999' }}>Verified Buyer &middot; New York, NY</span>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Final CTA */}
      <Reveal>
        <section className={styles.finalCta}>
           <div className={styles.ctaContent}>
              <h2>Join the Future of Psychedelics</h2>
              <p>Elevate your consciousness with Fusion. Browse our latest collection of world-class shroom bars and gummies.</p>
              <Link href="/shop" className="premium-gradient">START YOUR ORDER</Link>
           </div>
        </section>
      </Reveal>
    </div>
  );
}
