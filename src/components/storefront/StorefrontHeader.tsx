import type { ReactNode } from 'react';
import styles from './StorefrontHeader.module.css';

interface StorefrontHeaderProps {
  eyebrow?: string;
  title: string;
  lead?: string;
  intro?: ReactNode;
}

export default function StorefrontHeader({ eyebrow, title, lead, intro }: StorefrontHeaderProps) {
  return (
    <header className={styles.header}>
      {eyebrow && <span className={styles.eyebrow}>{eyebrow}</span>}
      <h1 className={styles.title}>{title}</h1>
      {lead && <p className={styles.lead}>{lead}</p>}
      {intro && <div className={styles.intro}>{intro}</div>}
    </header>
  );
}
