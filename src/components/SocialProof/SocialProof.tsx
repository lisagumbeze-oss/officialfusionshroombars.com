'use client';

import React, { useState, useEffect } from 'react';
import styles from './SocialProof.module.css';
import { ShoppingBag, X } from 'lucide-react';

const MOCK_SALES = [
  { id: 1, name: 'James', location: 'New York, NY', product: 'Fusion Mint Bar', time: '2 mins ago' },
  { id: 2, name: 'Sarah', location: 'Los Angeles, CA', product: 'Microdose Gummies', time: '5 mins ago' },
  { id: 3, name: 'Michael', location: 'Austin, TX', product: 'Dark Chocolate Fusion', time: '12 mins ago' },
  { id: 4, name: 'Emma', location: 'Miami, FL', product: 'Fusion x Whole Melt', time: '8 mins ago' },
  { id: 5, name: 'David', location: 'Seattle, WA', product: 'Milk Chocolate Fusion', time: '15 mins ago' },
];

export default function SocialProof() {
  const [currentSale, setCurrentSale] = useState<typeof MOCK_SALES[0] | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const showNextSale = () => {
      const randomSale = MOCK_SALES[Math.floor(Math.random() * MOCK_SALES.length)];
      setCurrentSale(randomSale);
      setIsVisible(true);

      // Hide after 5 seconds
      setTimeout(() => {
        setIsVisible(false);
      }, 5000);
    };

    // Initial delay before first popup
    const initialTimeout = setTimeout(showNextSale, 10000);

    // Show every 45 seconds
    const interval = setInterval(showNextSale, 45000);

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, []);

  if (!currentSale) return null;

  return (
    <div className={`${styles.container} ${isVisible ? styles.visible : ''}`}>
      <button className={styles.closeBtn} onClick={() => setIsVisible(false)}>
        <X size={12} />
      </button>
      <div className={styles.iconWrapper}>
        <ShoppingBag size={18} />
      </div>
      <div className={styles.content}>
        <p className={styles.title}>Verified Purchase</p>
        <p className={styles.text}>
          <strong>{currentSale.name}</strong> in {currentSale.location}<br />
          secured a <strong>{currentSale.product}</strong>
        </p>
        <p className={styles.time}>{currentSale.time}</p>
      </div>
    </div>
  );
}
