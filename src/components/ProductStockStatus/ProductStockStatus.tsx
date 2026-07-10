import styles from './ProductStockStatus.module.css';

interface ProductStockStatusProps {
  stock: number;
  className?: string;
  align?: 'left' | 'right' | 'center';
}

export default function ProductStockStatus({
  stock,
  className = '',
  align = 'right',
}: ProductStockStatusProps) {
  return (
    <span className={`${styles.stockStatus} ${styles[align]} ${className}`.trim()}>
      {stock <= 0 ? (
        <span className={styles.outOfStock}>Out of stock</span>
      ) : stock < 10 ? (
        <span className={styles.lowStock}>{stock} left</span>
      ) : (
        <span className={styles.inStock}>In stock</span>
      )}
    </span>
  );
}
