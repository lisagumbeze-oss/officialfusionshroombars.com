'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './Header.module.css';
import CartDropdown from './CartDropdown';
import { Menu, X } from 'lucide-react';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
          <Link href="/shop" onClick={() => setIsMobileMenuOpen(false)}>SHOP</Link>
          <Link href="/about" onClick={() => setIsMobileMenuOpen(false)}>ABOUT US</Link>
          <Link href="/faq" onClick={() => setIsMobileMenuOpen(false)}>FAQ</Link>
          <Link href="/blog" onClick={() => setIsMobileMenuOpen(false)}>BLOG</Link>
          <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)}>CONTACT US</Link>
        </nav>
        <div className={styles.actions}>
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
