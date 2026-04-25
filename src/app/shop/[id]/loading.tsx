import React from 'react';
import Skeleton from '@/components/Skeleton/Skeleton';
import styles from './product.module.css';

export default function ProductLoading() {
  return (
    <div className={styles.productContainer}>
      <div className={styles.splitLayout}>
        {/* Left: Sticky Image Hero */}
        <div className={styles.imageSection}>
          <Skeleton height="100%" borderRadius="24px" />
          <div className="flex gap-4 mt-6">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} width="100px" height="100px" borderRadius="12px" />
            ))}
          </div>
        </div>

        {/* Right: Scrolling Info */}
        <div className={styles.infoSection}>
          <Skeleton width="200px" height="1rem" variant="text" />
          <Skeleton width="80%" height="4rem" variant="text" className="mt-6" />
          <Skeleton width="150px" height="2.5rem" variant="text" className="mt-4" />
          
          <div className="mt-12 flex gap-4">
            <Skeleton width="120px" height="54px" borderRadius="8px" />
            <Skeleton width="250px" height="54px" borderRadius="8px" />
          </div>

          <div className="mt-12 space-y-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} width="200px" height="1.5rem" variant="text" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
