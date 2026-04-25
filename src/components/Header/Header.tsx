'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './Header.module.css';
import CartDropdown from './CartDropdown';
import { Menu, X, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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
        <nav className={`${styles.nav} ${isMobileMenuOpen ? styles.mobileNavOpen : ''}`}>
          <Link href="/" onClick={() => setIsMobileMenuOpen(false)}>HOME</Link>
          <Link href="/shop" onClick={() => setIsMobileMenuOpen(false)}>SHOP</Link>
          <Link href="/wishlist" onClick={() => setIsMobileMenuOpen(false)}>WISHLIST</Link>
          <Link href="/about" onClick={() => setIsMobileMenuOpen(false)}>ABOUT US</Link>
          <Link href="/faq" onClick={() => setIsMobileMenuOpen(false)}>FAQ</Link>
          <Link href="/blog" onClick={() => setIsMobileMenuOpen(false)}>BLOG</Link>
          <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)}>CONTACT US</Link>
        </nav>
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
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
    </header>
  );
}
