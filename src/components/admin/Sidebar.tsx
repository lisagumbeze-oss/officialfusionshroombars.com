'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
    LayoutDashboard, 
    FileText, 
    Layers, 
    Image as ImageIcon, 
    MessageSquare,
    Package,
    ShoppingBag,
    Settings,
    LogOut,
    Tag,
    BarChart3,
    Award,
    Users
} from 'lucide-react';
import { LucideIcon } from 'lucide-react';
import styles from './Sidebar.module.css';

interface NavItem {
    label: string;
    href: string;
    icon: LucideIcon;
    badge?: string;
}

const storeItems: NavItem[] = [
    { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { label: 'Products', href: '/admin/products', icon: Package },
    { label: 'Orders', href: '/admin/orders', icon: ShoppingBag },
    { label: 'Coupons', href: '/admin/coupons', icon: Tag },
    { label: 'Settings', href: '/admin/settings', icon: Settings },
];

const contentItems: NavItem[] = [
    { label: 'All Posts', href: '/admin/blog', icon: FileText },
    { label: 'Categories', href: '/admin/categories', icon: Layers },
    { label: 'Media Library', href: '/admin/media', icon: ImageIcon },
    { label: 'Comments', href: '/admin/comments', icon: MessageSquare, badge: '12' },
];

const insightsItems: NavItem[] = [
    { label: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
    { label: 'Loyalty Vault', href: '/admin/loyalty', icon: Award },
    { label: 'Customers', href: '/admin/customers', icon: Users },
];

export default function Sidebar({ isOpen, onClose }: { isOpen?: boolean; onClose?: () => void }) {
    const pathname = usePathname();

    const renderNavItems = (items: typeof storeItems) => {
        return items.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/admin');
            
            return (
                <Link 
                    key={item.href} 
                    href={item.href} 
                    className={`${styles.navLink} ${isActive ? styles.active : ''}`}
                    onClick={() => {
                        if (onClose) onClose();
                    }}
                >
                    <Icon size={18} />
                    <span>{item.label}</span>
                    {item.badge && <span className={styles.navBadge}>{item.badge}</span>}
                </Link>
            );
        });
    };

    return (
        <aside className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
            <div className={styles.logoContainer}>
                <div className={styles.logoIcon}>
                    <Package size={20} />
                </div>
                <span className={styles.logoText}>Fusion Admin</span>
                {onClose && (
                    <button className={styles.mobileClose} onClick={onClose}>
                        <LogOut size={20} style={{ transform: 'rotate(180deg)' }} />
                    </button>
                )}
            </div>

            <div className={styles.sectionLabel}>STORE MANAGEMENT</div>
            <nav className={styles.nav}>
                {renderNavItems(storeItems)}
            </nav>

            <div className={styles.sectionLabel}>CONTENT MANAGEMENT</div>
            <nav className={styles.nav}>
                {renderNavItems(contentItems)}
            </nav>

            <div className={styles.sectionLabel}>INSIGHTS & REPORTS</div>
            <nav className={styles.nav}>
                {renderNavItems(insightsItems)}
            </nav>

            <div className={styles.footer}>
                <Link 
                    href="/" 
                    className={styles.navLink} 
                    style={{ marginBottom: '1rem', background: 'rgba(255,255,255,0.05)' }}
                >
                    <LogOut size={18} style={{ transform: 'rotate(180deg)' }} />
                    <span>View Website</span>
                </Link>
                <div className={styles.storageCard}>
                    <div className={styles.storageLabel}>
                        <span>Storage Status</span>
                        <span>7.2 GB of 10 GB used</span>
                    </div>
                    <div className={styles.progressBar}>
                        <div className={styles.progressFill} style={{ width: '72%' }} />
                    </div>
                </div>
            </div>
        </aside>
    );
}
