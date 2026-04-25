'use client';

import React from 'react';
import { useWishlist } from '@/context/WishlistContext';
import ProductCard from '@/components/ProductCard/ProductCard';
import Link from 'next/link';
import { Heart } from 'lucide-react';
import styles from './wishlist.module.css';

export default function WishlistPage() {
  const { wishlist } = useWishlist();

  return (
    <div className={styles.wishlistContainer}>
      <header className={styles.header}>
        <h1 className={styles.title}>Your Wishlist</h1>
        <p className={styles.desc}>Products you've saved for later. High-potency psilocybin favorites ready when you are.</p>
      </header>

      {wishlist.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>
            <Heart size={64} color="#333" strokeWidth={1} />
          </div>
          <h2>Your wishlist is empty</h2>
          <p>You haven't saved any items yet. Explore our collection to find your next journey.</p>
          <Link href="/shop" className={styles.shopBtn}>
            BACK TO SHOP
          </Link>
        </div>
      ) : (
        <div className={styles.grid}>
          {wishlist.map((product) => (
            <ProductCard key={product.id} product={product as any} />
          ))}
        </div>
      )}
    </div>
  );
}
