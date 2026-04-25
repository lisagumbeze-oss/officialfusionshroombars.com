'use client';

import React from 'react';
import { useRecentlyViewed } from '@/context/RecentlyViewedContext';
import ProductCard from '@/components/ProductCard/ProductCard';
import styles from './RecentlyViewedList.module.css';

export default function RecentlyViewedList({ currentProductId }: { currentProductId?: string }) {
  const { recentlyViewed } = useRecentlyViewed();
  
  const filtered = recentlyViewed.filter(p => p.id !== currentProductId).slice(0, 4);

  if (filtered.length === 0) return null;

  return (
    <section className={styles.section}>
      <h2 className={styles.title}>Recently Viewed</h2>
      <div className={styles.grid}>
        {filtered.map((product) => (
          <ProductCard key={product.id} product={product as any} />
        ))}
      </div>
    </section>
  );
}
