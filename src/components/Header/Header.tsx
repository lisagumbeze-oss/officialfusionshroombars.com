'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import styles from './Header.module.css';
import CartDropdown from './CartDropdown';
import GeoDelivery from '../GeoDelivery/GeoDelivery';
import DesktopNav from './DesktopNav';
import MobileNavDrawer from './MobileNavDrawer';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [shopCategories, setShopCategories] = useState<string[]>([]);
  const router = useRouter();

  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    let cancelled = false;

    const loadCategories = async () => {
      try {
        const response = await fetch('/api/categories');
        const data = await response.json();
        if (!cancelled && Array.isArray(data.categories)) {
          setShopCategories(data.categories);
        }
      } catch (error) {
        console.error('[Header] Failed to load categories:', error);
      }
    };

    loadCategories();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <header className={`${styles.header} ${isScrolled ? styles.scrolled : ''} glass-morphism`}>
      {!isScrolled && <GeoDelivery />}
      <div className={styles.container}>
        <Link href="/" className={styles.logoWrapper}>
          <Image
            src="/images_transparent.png"
            alt="Fusion Shroom Bars Logo"
            width={180}
            height={45}
            className={styles.brandLogo}
            priority
          />
        </Link>

        <Suspense fallback={null}>
          <DesktopNav shopCategories={shopCategories} />
        </Suspense>

        <div className={styles.actions}>
          <div className={`${styles.searchWrapper} ${isSearchOpen ? styles.searchOpen : ''}`}>
            <form onSubmit={handleSearch} className={styles.searchForm}>
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={styles.searchInput}
              />
              <button type="submit" className={styles.searchSubmit}>
                <Search size={18} />
              </button>
            </form>
            <button
              className={styles.searchToggle}
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              aria-label="Toggle Search"
            >
              {isSearchOpen ? <X size={20} /> : <Search size={20} />}
            </button>
          </div>
          <CartDropdown />
          <button
            className={styles.mobileMenuBtn}
            onClick={() => setIsMobileMenuOpen((open) => !open)}
            aria-label="Toggle menu"
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      <Suspense fallback={null}>
        <MobileNavDrawer
          isOpen={isMobileMenuOpen}
          onClose={closeMobileMenu}
          shopCategories={shopCategories}
        />
      </Suspense>
    </header>
  );
}
