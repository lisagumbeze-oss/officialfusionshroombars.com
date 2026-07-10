import Skeleton from '@/components/Skeleton/Skeleton';
import styles from './cart.module.css';

export default function CartLoading() {
  return (
    <div className={styles.cartPage}>
      <div className={styles.heroSkeleton}>
        <Skeleton width="80px" height="1rem" borderRadius="100px" className="mx-auto mb-4" />
        <Skeleton width="60%" height="3.5rem" borderRadius="12px" className="mx-auto mb-4" />
        <Skeleton width="70%" height="1.25rem" className="mx-auto" />
      </div>

      <div className={styles.cartContainer}>
        <div className={styles.cartLayout}>
          <div className={styles.cartItems}>
            <div className={styles.cartHeader}>
              <Skeleton width="80px" height="0.875rem" variant="text" />
              <Skeleton width="80px" height="0.875rem" variant="text" />
              <Skeleton width="80px" height="0.875rem" variant="text" />
            </div>
            {[...Array(2)].map((_, i) => (
              <div key={i} className={styles.cartRow}>
                <div className={styles.productCell}>
                  <Skeleton width="96px" height="96px" borderRadius="12px" />
                  <div style={{ marginLeft: '1rem', flex: 1 }}>
                    <Skeleton width="140px" height="1.125rem" variant="text" />
                    <Skeleton width="60px" height="0.875rem" variant="text" className="mt-2" />
                  </div>
                </div>
                <Skeleton width="120px" height="40px" borderRadius="100px" />
                <Skeleton width="70px" height="1.125rem" variant="text" />
              </div>
            ))}
          </div>

          <div className={styles.orderSummary}>
            <Skeleton width="140px" height="1.5rem" variant="text" className="mb-6" />
            <Skeleton width="100%" height="1rem" variant="text" className="mb-3" />
            <Skeleton width="100%" height="1rem" variant="text" className="mb-3" />
            <Skeleton width="100%" height="3rem" borderRadius="100px" className="mt-6" />
          </div>
        </div>
      </div>
    </div>
  );
}
