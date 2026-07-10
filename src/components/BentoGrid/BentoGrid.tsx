'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowUpRight, FlaskConical, BookOpen, CircleHelp, Mail } from 'lucide-react';
import styles from './BentoGrid.module.css';

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 48, rotate: -0.5 },
  visible: {
    opacity: 1,
    y: 0,
    rotate: 0,
    transition: { duration: 0.65, ease: [0.23, 1, 0.32, 1] as const },
  },
};

const CARDS = [
  {
    key: 'process',
    href: '/about',
    layout: styles.layoutProcess,
    index: '01',
    icon: FlaskConical,
    title: 'Our Process',
    desc: 'Triple-tested extraction and artisanal Belgian chocolate — precision in every square.',
    image: '/images/fusion_ingredients.png',
    imageAlt: 'Fusion extraction process',
  },
  {
    key: 'journal',
    href: '/blog',
    layout: styles.layoutJournal,
    index: '02',
    icon: BookOpen,
    title: 'Journal',
    desc: 'Microdosing guides, wellness rituals, and consciousness.',
    image: '/images/fusion_lifestyle.png',
    imageAlt: 'Fusion lifestyle',
  },
  {
    key: 'trust',
    layout: styles.layoutTrust,
    isTrust: true,
  },
  {
    key: 'faq',
    href: '/faq',
    layout: styles.layoutFaq,
    index: '03',
    icon: CircleHelp,
    title: 'FAQ',
    desc: 'Shipping, dosage, and authenticity answered.',
  },
  {
    key: 'contact',
    href: '/contact',
    layout: styles.layoutContact,
    index: '04',
    icon: Mail,
    title: 'Contact',
    desc: 'Dedicated support, always within reach.',
  },
];

export default function BentoGrid() {
  return (
    <div className={styles.wrapper}>
      <header className={styles.sectionIntro}>
        <span className={styles.sectionLabel}>Discover</span>
        <h2 className={styles.sectionTitle}>Beyond the bar</h2>
        <p className={styles.sectionDesc}>
          Stories, science, and support — everything that shapes the Fusion experience.
        </p>
      </header>

      <motion.div
        className={styles.grid}
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
      >
        {CARDS.map((card) => {
          if (card.isTrust) {
            return (
              <motion.div key={card.key} variants={cardVariants} className={card.layout}>
                <div className={`${styles.card} ${styles.trustCard}`}>
                  <div className={styles.cardBody}>
                    <span className={styles.trustLabel}>Why Fusion</span>
                    <ul className={styles.trustList}>
                      <li>Triple-lab tested for potency &amp; purity</li>
                      <li>Discreet, unmarked packaging</li>
                      <li>Worldwide shipping with tracking</li>
                    </ul>
                  </div>
                </div>
              </motion.div>
            );
          }

          const Icon = card.icon!;
          return (
            <motion.div key={card.key} variants={cardVariants} className={card.layout}>
              <Link href={card.href!} className={`${styles.card} ${card.image ? styles.cardMedia : ''}`}>
                {card.image && (
                  <div className={styles.cardBg}>
                    <Image src={card.image} alt={card.imageAlt!} fill style={{ objectFit: 'cover' }} />
                    <div className={styles.cardBgOverlay} />
                  </div>
                )}
                <span className={styles.cardIndex}>{card.index}</span>
                <span className={styles.cardArrow} aria-hidden>
                  <ArrowUpRight size={18} />
                </span>
                <div className={styles.cardBody}>
                  <Icon size={28} strokeWidth={1.5} className={styles.cardIcon} />
                  <h3 className={styles.cardTitle}>{card.title}</h3>
                  <p className={styles.cardDesc}>{card.desc}</p>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
