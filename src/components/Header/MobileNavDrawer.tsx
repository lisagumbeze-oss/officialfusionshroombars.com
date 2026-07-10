'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, X } from 'lucide-react';
import {
  buildMainNavigation,
  isLinkActive,
  isNavItemActive,
  type NavItem,
} from '@/lib/navigation';
import styles from './Header.module.css';

type MobileNavDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
  shopCategories: string[];
};

const drawerVariants = {
  hidden: { x: '100%' },
  visible: {
    x: 0,
    transition: { duration: 0.35, ease: [0.23, 1, 0.32, 1] as const },
  },
  exit: {
    x: '100%',
    transition: { duration: 0.25, ease: [0.4, 0, 1, 1] as const },
  },
};

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

export default function MobileNavDrawer({ isOpen, onClose, shopCategories }: MobileNavDrawerProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const search = searchParams.toString();
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const navigation = buildMainNavigation(shopCategories);

  useEffect(() => {
    if (!isOpen) {
      setExpandedSection(null);
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    onClose();
  }, [pathname, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.button
            type="button"
            className={styles.mobileNavBackdrop}
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            aria-label="Close menu"
            onClick={onClose}
          />

          <motion.aside
            className={styles.mobileNavDrawer}
            variants={drawerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation"
          >
            <div className={styles.mobileNavHeader}>
              <span className={styles.mobileNavTitle}>Menu</span>
              <button
                type="button"
                className={styles.mobileNavClose}
                onClick={onClose}
                aria-label="Close menu"
              >
                <X size={22} />
              </button>
            </div>

            <nav className={styles.mobileNavList} aria-label="Mobile navigation">
              {navigation.map((item) => (
                <MobileNavEntry
                  key={item.label}
                  item={item}
                  pathname={pathname}
                  search={search}
                  isExpanded={expandedSection === item.label}
                  onToggle={() =>
                    setExpandedSection((current) =>
                      current === item.label ? null : item.label
                    )
                  }
                  onNavigate={onClose}
                />
              ))}
            </nav>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

type MobileNavEntryProps = {
  item: NavItem;
  pathname: string;
  search: string;
  isExpanded: boolean;
  onToggle: () => void;
  onNavigate: () => void;
};

function MobileNavEntry({
  item,
  pathname,
  search,
  isExpanded,
  onToggle,
  onNavigate,
}: MobileNavEntryProps) {
  const isActive = isNavItemActive(pathname, item, search);
  const sectionId = `mobile-nav-${item.label.toLowerCase().replace(/\s+/g, '-')}`;

  if (!item.children?.length) {
    return (
      <Link
        href={item.href!}
        className={`${styles.mobileNavLink} ${isActive ? styles.mobileNavLinkActive : ''}`}
        onClick={onNavigate}
      >
        {item.label}
      </Link>
    );
  }

  return (
    <div className={styles.mobileNavSection}>
      <button
        type="button"
        className={`${styles.mobileNavToggle} ${isActive ? styles.mobileNavToggleActive : ''}`}
        onClick={onToggle}
        aria-expanded={isExpanded}
        aria-controls={sectionId}
      >
        <span>{item.label}</span>
        <ChevronDown
          size={18}
          className={`${styles.mobileNavChevron} ${isExpanded ? styles.mobileNavChevronOpen : ''}`}
          aria-hidden
        />
      </button>

      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            id={sectionId}
            className={styles.mobileSubmenu}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
          >
            {item.href && (
              <Link
                href={item.href}
                className={`${styles.mobileSubmenuLink} ${isLinkActive(pathname, item.href, search) ? styles.mobileSubmenuLinkActive : ''}`}
                onClick={onNavigate}
              >
                <span className={styles.mobileSubmenuLabel}>All {item.label}</span>
              </Link>
            )}
            {item.children.map((child) => (
              <Link
                key={child.href}
                href={child.href}
                className={`${styles.mobileSubmenuLink} ${isLinkActive(pathname, child.href, search) ? styles.mobileSubmenuLinkActive : ''}`}
                onClick={onNavigate}
              >
                <span className={styles.mobileSubmenuLabel}>{child.label}</span>
                {child.description && (
                  <span className={styles.mobileSubmenuDesc}>{child.description}</span>
                )}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
