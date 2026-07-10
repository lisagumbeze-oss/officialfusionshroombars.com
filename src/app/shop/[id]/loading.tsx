import Skeleton from '@/components/Skeleton/Skeleton';
import styles from './product.module.css';

export default function ProductLoading() {
  return (
    <div className={styles.productPage}>
      <div className={styles.splitLayout}>
        <div className={styles.imageSection}>
          <Skeleton height="100%" borderRadius="1.25rem" />
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} width="88px" height="88px" borderRadius="0.75rem" />
            ))}
          </div>
        </div>

        <div className={styles.infoSection}>
          <Skeleton width="200px" height="0.875rem" variant="text" />
          <Skeleton width="100px" height="1.5rem" borderRadius="100px" className="mt-4" />
          <Skeleton width="80%" height="3rem" variant="text" className="mt-4" />
          <Skeleton width="120px" height="2rem" variant="text" className="mt-4" />

          <div style={{ marginTop: '2rem', display: 'flex', gap: '0.75rem' }}>
            <Skeleton width="140px" height="52px" borderRadius="100px" />
            <Skeleton width="220px" height="52px" borderRadius="100px" />
          </div>

          <div style={{ marginTop: '2rem', display: 'grid', gap: '0.75rem' }}>
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} width="180px" height="2.5rem" borderRadius="0.75rem" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
