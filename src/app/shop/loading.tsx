import Skeleton from '@/components/Skeleton/Skeleton';
import styles from './shop.module.css';

export default function ShopLoading() {
  return (
    <div className={styles.shopPage}>
      <div className={styles.heroSkeleton}>
        <Skeleton width="120px" height="1rem" borderRadius="100px" className="mx-auto mb-4" />
        <Skeleton width="70%" height="3.5rem" borderRadius="12px" className="mx-auto mb-4" />
        <Skeleton width="85%" height="1.25rem" className="mx-auto mb-2" />
        <Skeleton width="60%" height="1.25rem" className="mx-auto" />
      </div>

      <div className={styles.shopContainer}>
        <div className={styles.filters} style={{ opacity: 0.6 }}>
          <Skeleton width="160px" height="44px" borderRadius="10px" />
          <Skeleton width="180px" height="44px" borderRadius="10px" />
          <Skeleton width="160px" height="44px" borderRadius="10px" />
        </div>

        <div className={styles.productGrid}>
          {[...Array(6)].map((_, i) => (
            <div key={i}>
              <Skeleton height="280px" borderRadius="1.25rem" />
              <Skeleton width="40%" height="0.875rem" variant="text" className="mt-4" />
              <Skeleton width="100%" height="1.25rem" variant="text" className="mt-2" />
              <Skeleton width="30%" height="1.25rem" variant="text" className="mt-3" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
