'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, ShoppingBag, BookOpen, CreditCard } from 'lucide-react';
import styles from './MobileBottomNav.module.css';

export default function MobileBottomNav() {
  const pathname = usePathname();
  
  // Hide on admin routes
  if (pathname?.startsWith('/admin')) return null;

  return (
    <>
      <nav className={styles.bottomNav}>
        <div className={styles.navContainer}>
            <Link href="/" className={`${styles.navItem} ${pathname === '/' ? styles.active : ''}`}>
            <Home size={22} />
            <span>Home</span>
            </Link>
            
            <Link href="/shop" className={`${styles.navItem} ${pathname?.startsWith('/shop') ? styles.active : ''}`}>
            <ShoppingBag size={22} />
            <span>Shop</span>
            </Link>
            
            <Link href="/blog" className={`${styles.navItem} ${pathname?.startsWith('/blog') ? styles.active : ''}`}>
            <BookOpen size={22} />
            <span>Journal</span>
            </Link>
            
            <Link href="/checkout" className={`${styles.navItem} ${pathname === '/checkout' ? styles.active : ''}`}>
            <CreditCard size={22} />
            <span>Checkout</span>
            </Link>
        </div>
      </nav>
      {/* Spacer to prevent content from hiding behind the fixed bottom nav on mobile */}
      <div className={styles.spacer}></div>
    </>
  );
}
