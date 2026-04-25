'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Star, Heart } from 'lucide-react';
import AddToCartButton from '@/components/AddToCartButton';
import { useWishlist } from '@/context/WishlistContext';
import { motion } from 'framer-motion';
import { useToast } from '@/context/ToastContext';
import { Product } from '@/types/product';
import styles from './ProductCard.module.css';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { showToast } = useToast();
  
  // Calculate average rating
  const reviewCount = product._count?.reviews || product.reviews?.length || 0;
  const avgRating = product.reviews && product.reviews.length > 0
    ? product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length
    : 5; // Default to 5 stars if no reviews yet for "wow" factor, or 0 if being strictly realistic

  // Determine badges
  const isNew = product.createdAt ? (new Date().getTime() - new Date(product.createdAt).getTime()) < 7 * 24 * 60 * 60 * 1000 : false;
  const isSale = product.regularPrice && product.regularPrice > product.price;
  const isBestseller = product.id === 'bestseller-id-placeholder' || false; // You could add logic here

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product as any);
    if (!isInWishlist(product.id)) {
      showToast(`${product.name} added to wishlist!`, 'success');
    }
  };

  return (
    <motion.div 
      className={styles.productCard}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -10, transition: { duration: 0.3 } }}
    >
      <Link href={`/shop/${product.slug}`} className={styles.imageLink}>
        <div className={styles.imageWrapper}>
          <Image 
            src={product.image} 
            alt={product.name} 
            fill 
            style={{ objectFit: 'cover' }}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          
          <button 
            className={`${styles.wishlistBtn} ${isInWishlist(product.id) ? styles.inWishlist : ''}`}
            onClick={handleWishlist}
            aria-label="Add to Wishlist"
          >
            <Heart size={18} fill={isInWishlist(product.id) ? "currentColor" : "none"} />
          </button>

          <div className={styles.badges}>
            {isSale && <span className={`${styles.badge} ${styles.saleBadge}`}>SALE</span>}
            {isNew && <span className={`${styles.badge} ${styles.newBadge}`}>NEW</span>}
            {reviewCount > 10 && avgRating >= 4.8 && <span className={`${styles.badge} ${styles.bestsellerBadge}`}>BESTSELLER</span>}
          </div>
        </div>
      </Link>

      <div className={styles.info}>
        <div className={styles.meta}>
          <span className={styles.category}>{product.category}</span>
          <div className={styles.rating}>
            <div className={styles.stars}>
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  size={12} 
                  fill={i < Math.round(avgRating) ? "#d97706" : "transparent"} 
                  color={i < Math.round(avgRating) ? "#d97706" : "#444"} 
                />
              ))}
            </div>
            <span className={styles.reviewCount}>({reviewCount})</span>
          </div>
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
          <span className={styles.stockStatus}>
            {product.stock <= 0 ? (
              <span className={styles.outOfStock}>OUT OF STOCK</span>
            ) : product.stock < 10 ? (
              <span className={styles.lowStock}>ONLY {product.stock} LEFT</span>
            ) : (
              <span className={styles.inStock}>IN STOCK</span>
            )}
          </span>
        </div>

        <div className={styles.actions}>
          <Link href={`/shop/${product.slug}`} className={styles.viewBtn}>
            VIEW
          </Link>
          <AddToCartButton product={product} className={styles.cartBtn} />
        </div>
      </div>
    </motion.div>
  );
}
