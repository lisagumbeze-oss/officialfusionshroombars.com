'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import {
  buildMainNavigation,
  isLinkActive,
  isNavItemActive,
  type NavItem,
} from '@/lib/navigation';
import styles from './Header.module.css';

type DesktopNavProps = {
  shopCategories: string[];
};

export default function DesktopNav({ shopCategories }: DesktopNavProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const search = searchParams.toString();
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const navRef = useRef<HTMLElement>(null);
  const navigation = buildMainNavigation(shopCategories);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setOpenMenu(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setOpenMenu(null);
  }, [pathname]);

  const toggleMenu = (label: string) => {
    setOpenMenu((current) => (current === label ? null : label));
  };

  return (
    <nav ref={navRef} className={styles.nav} aria-label="Main navigation">
      {navigation.map((item) => (
        <NavEntry
          key={item.label}
          item={item}
          pathname={pathname}
          search={search}
          isOpen={openMenu === item.label}
          onOpen={() => setOpenMenu(item.label)}
          onClose={() => setOpenMenu(null)}
          onToggle={() => toggleMenu(item.label)}
        />
      ))}
    </nav>
  );
}

type NavEntryProps = {
  item: NavItem;
  pathname: string;
  search: string;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  onToggle: () => void;
};

function NavEntry({ item, pathname, search, isOpen, onOpen, onClose, onToggle }: NavEntryProps) {
  const isActive = isNavItemActive(pathname, item, search);
  const menuId = `nav-menu-${item.label.toLowerCase().replace(/\s+/g, '-')}`;

  if (!item.children?.length) {
    return (
      <Link
        href={item.href!}
        className={`${styles.navLink} ${isActive ? styles.navLinkActive : ''}`}
      >
        {item.label}
      </Link>
    );
  }

  return (
    <div
      className={`${styles.navDropdown} ${isOpen ? styles.navDropdownOpen : ''} ${isActive ? styles.navDropdownActive : ''}`}
      onMouseEnter={onOpen}
      onMouseLeave={onClose}
    >
      <button
        type="button"
        className={styles.navDropdownTrigger}
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-controls={menuId}
      >
        {item.label}
        <ChevronDown size={14} className={styles.navDropdownChevron} aria-hidden />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            id={menuId}
            role="menu"
            className={styles.navDropdownMenu}
            initial={{ opacity: 0, y: 10, x: '-50%', scale: 0.98 }}
            animate={{ opacity: 1, y: 0, x: '-50%', scale: 1 }}
            exit={{ opacity: 0, y: 8, x: '-50%', scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
          >
            {item.href && (
              <Link
                href={item.href}
                role="menuitem"
                className={`${styles.navDropdownLink} ${styles.navDropdownLinkFeatured}`}
                onClick={onClose}
              >
                <span className={styles.navDropdownLinkLabel}>View all {item.label}</span>
                <span className={styles.navDropdownLinkDesc}>See everything in one place</span>
              </Link>
            )}
            {item.children.map((child) => (
              <Link
                key={child.href}
                href={child.href}
                role="menuitem"
                className={`${styles.navDropdownLink} ${isLinkActive(pathname, child.href, search) ? styles.navDropdownLinkActive : ''}`}
                onClick={onClose}
              >
                <span className={styles.navDropdownLinkLabel}>{child.label}</span>
                {child.description && (
                  <span className={styles.navDropdownLinkDesc}>{child.description}</span>
                )}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
