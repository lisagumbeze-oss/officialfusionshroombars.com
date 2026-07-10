'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Star, Heart, ArrowRight } from 'lucide-react';
import AddToCartButton from '@/components/AddToCartButton';
import ProductWhatsAppButton from '@/components/ProductWhatsAppButton/ProductWhatsAppButton';
import ProductStockStatus from '@/components/ProductStockStatus/ProductStockStatus';
import { useWishlist } from '@/context/WishlistContext';
import { motion } from 'framer-motion';
import { useToast } from '@/context/ToastContext';
import { Product } from '@/types/product';
import styles from './ProductCard.module.css';

interface ProductCardProps {
  product: Product;
  index?: number;
  variant?: 'default' | 'featured';
}

export default function ProductCard({ product, index = 0, variant = 'default' }: ProductCardProps) {
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { showToast } = useToast();
  const isFeatured = variant === 'featured';

  const reviewCount = product._count?.reviews || product.reviews?.length || 0;
  const avgRating =
    product.reviews && product.reviews.length > 0
      ? product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length
      : 0;

  const isNew = product.createdAt
    ? new Date().getTime() - new Date(product.createdAt).getTime() < 7 * 24 * 60 * 60 * 1000
    : false;
  const isSale = product.regularPrice && product.regularPrice > product.price;

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product as any);
    if (!isInWishlist(product.id)) {
      showToast(`${product.name} added to wishlist!`, 'success');
    }
  };

  return (
    <motion.article
      className={`${styles.productCard} ${isFeatured ? styles.featured : ''}`}
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.55, delay: index * 0.12, ease: [0.23, 1, 0.32, 1] }}
    >
      <div className={styles.imageWrapper}>
        <Link href={`/shop/${product.slug}`} className={styles.imageLink} aria-label={`View ${product.name}`}>
          <Image
            src={product.image}
            alt={product.name}
            fill
            style={{ objectFit: 'cover' }}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </Link>
        <div className={styles.imageShine} aria-hidden />

        <button
          className={`${styles.wishlistBtn} ${isInWishlist(product.id) ? styles.inWishlist : ''}`}
          onClick={handleWishlist}
          aria-label="Add to Wishlist"
        >
          <Heart size={18} fill={isInWishlist(product.id) ? 'currentColor' : 'none'} />
        </button>

        <div className={styles.badges}>
          {isSale && <span className={`${styles.badge} ${styles.saleBadge}`}>Sale</span>}
          {isNew && <span className={`${styles.badge} ${styles.newBadge}`}>New</span>}
          {reviewCount > 10 && avgRating >= 4.8 && (
            <span className={`${styles.badge} ${styles.bestsellerBadge}`}>Bestseller</span>
          )}
        </div>

        {isFeatured && (
          <div className={styles.quickOverlay}>
            <AddToCartButton product={product} className={styles.quickAddBtn} label="Quick add" />
          </div>
        )}
      </div>

      <div className={styles.info}>
        <div className={styles.meta}>
          <span className={styles.category}>{product.category}</span>
          {reviewCount > 0 && (
            <div className={styles.rating}>
              <div className={styles.stars}>
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={11}
                    fill={i < Math.round(avgRating) ? '#9b4dff' : 'transparent'}
                    color={i < Math.round(avgRating) ? '#9b4dff' : '#444'}
                  />
                ))}
              </div>
              <span className={styles.reviewCount}>({reviewCount})</span>
            </div>
          )}
        </div>

        <Link href={`/shop/${product.slug}`}>
          <h3 className={styles.title}>{product.name}</h3>
        </Link>

        <div className={styles.priceRow}>
          <div className={styles.price}>
            {product.regularPrice && (
              <span className={styles.oldPrice}>${product.regularPrice.toFixed(2)}</span>
            )}
            <span className={styles.newPrice}>${product.price.toFixed(2)}</span>
          </div>
        </div>

        {!isFeatured && (
          <div className={styles.actions}>
            <ProductStockStatus stock={product.stock} align="right" />
            <div className={styles.actionRow}>
              <ProductWhatsAppButton
                product={{
                  name: product.name,
                  slug: product.slug,
                  price: product.price,
                }}
                className={styles.whatsappBtn}
              />
              <AddToCartButton product={product} className={styles.cartBtn} />
            </div>
            <Link href={`/shop/${product.slug}`} className={styles.viewBtn}>
              View
            </Link>
          </div>
        )}

        {isFeatured && (
          <Link href={`/shop/${product.slug}`} className={styles.featuredLink}>
            View details
            <ArrowRight size={14} />
          </Link>
        )}
      </div>
    </motion.article>
  );
}
