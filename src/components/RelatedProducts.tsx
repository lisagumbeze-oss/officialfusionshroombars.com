import ProductCard from '@/components/ProductCard/ProductCard';
import styles from './RelatedProducts.module.css';

interface RelatedProductsProps {
  products: any[];
}

export default function RelatedProducts({ products }: RelatedProductsProps) {
  if (!products?.length) return null;

  return (
    <section className={styles.section}>
      <span className={styles.sectionLabel}>You may also like</span>
      <h3 className={styles.title}>Curated for you</h3>
      <div className={styles.grid}>
        {products.slice(0, 3).map((product, index) => (
          <ProductCard key={product.id} product={product} index={index} />
        ))}
      </div>
    </section>
  );
}
