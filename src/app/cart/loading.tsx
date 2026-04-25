import React from 'react';
import Skeleton from '@/components/Skeleton/Skeleton';
import styles from './cart.module.css';

export default function CartLoading() {
  return (
    <div className={styles.cartContainer}>
      <Skeleton width="200px" height="3rem" variant="text" className="mb-12" />

      <div className={styles.cartLayout}>
        {/* Left: Cart Items */}
        <div className={styles.cartItems}>
          <div className={styles.cartHeader}>
            <Skeleton width="100px" height="1.2rem" variant="text" />
            <Skeleton width="100px" height="1.2rem" variant="text" />
            <Skeleton width="100px" height="1.2rem" variant="text" />
          </div>
          {[...Array(3)].map((_, i) => (
            <div key={i} className={styles.cartRow}>
              <div className={styles.productCell}>
                <Skeleton width="100px" height="100px" borderRadius="12px" />
                <div className="ml-4 space-y-2">
                  <Skeleton width="150px" height="1.2rem" variant="text" />
                  <Skeleton width="80px" height="1rem" variant="text" />
                </div>
              </div>
              <Skeleton width="100px" height="40px" borderRadius="8px" />
              <Skeleton width="80px" height="1.2rem" variant="text" />
            </div>
          ))}
        </div>

        {/* Right: Order Summary */}
        <div className={styles.orderSummary}>
          <Skeleton width="150px" height="2rem" variant="text" className="mb-6" />
          <div className="space-y-4">
            <div className="flex justify-between">
              <Skeleton width="100px" height="1rem" variant="text" />
              <Skeleton width="60px" height="1rem" variant="text" />
            </div>
            <div className="flex justify-between">
              <Skeleton width="100px" height="1rem" variant="text" />
              <Skeleton width="60px" height="1rem" variant="text" />
            </div>
            <div className="pt-4 border-t border-white/10 flex justify-between">
              <Skeleton width="100px" height="1.5rem" variant="text" />
              <Skeleton width="80px" height="1.5rem" variant="text" />
            </div>
          </div>
          <Skeleton width="100%" height="54px" borderRadius="12px" className="mt-8" />
        </div>
      </div>
    </div>
  );
}
