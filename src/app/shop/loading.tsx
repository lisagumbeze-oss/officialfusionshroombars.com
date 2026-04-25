import React from 'react';
import Skeleton from '@/components/Skeleton/Skeleton';
import styles from './shop.module.css';

export default function ShopLoading() {
  return (
    <div className={styles.shopContainer}>
      <header className={styles.shopHeader}>
        <Skeleton width="60%" height="3rem" borderRadius="12px" />
        <Skeleton width="80%" height="1.5rem" className="mt-4" />
        <Skeleton width="90%" height="1.2rem" className="mt-2" />
      </header>

      <div className={styles.filters} style={{ opacity: 0.5 }}>
        <Skeleton width="200px" height="44px" borderRadius="50px" />
        <Skeleton width="200px" height="44px" borderRadius="50px" />
      </div>

      <div className={styles.productGrid}>
        {[...Array(8)].map((_, i) => (
          <div key={i} className={styles.productCard} style={{ border: 'none', background: 'rgba(255,255,255,0.02)' }}>
            <Skeleton height="300px" borderRadius="20px" />
            <div className="p-4">
              <Skeleton width="40%" height="1rem" variant="text" />
              <Skeleton width="100%" height="1.5rem" variant="text" className="mt-2" />
              <div className="flex justify-between items-center mt-4">
                <Skeleton width="30%" height="1.5rem" variant="text" />
                <Skeleton width="40%" height="2.5rem" borderRadius="10px" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
