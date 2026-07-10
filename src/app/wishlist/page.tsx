'use client';

import React from 'react';
import { useWishlist } from '@/context/WishlistContext';
import ProductCard from '@/components/ProductCard/ProductCard';
import StorefrontHeader from '@/components/storefront/StorefrontHeader';
import Link from 'next/link';
import { Heart } from 'lucide-react';
import styles from './wishlist.module.css';

export default function WishlistPage() {
  const { wishlist } = useWishlist();

  return (
    <div className={styles.wishlistContainer}>
      <StorefrontHeader
        eyebrow="Saved"
        title="Your wishlist"
        lead="Products you've saved for later — high-potency favorites ready when you are."
      />

      {wishlist.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>
            <Heart size={64} strokeWidth={1} />
          </div>
          <h2>Your wishlist is empty</h2>
          <p>You haven&apos;t saved any items yet. Explore our collection to find your next journey.</p>
          <Link href="/shop" className={styles.shopBtn}>
            Browse collection
          </Link>
        </div>
      ) : (
        <div className={styles.grid}>
          {wishlist.map((product, index) => (
            <ProductCard key={product.id} product={product as any} index={index} />
          ))}
        </div>
      )}
    </div>
  );
}
