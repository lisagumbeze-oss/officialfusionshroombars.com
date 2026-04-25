'use client';

import { useState, useEffect } from 'react';
import styles from './admin.module.css';
import Link from 'next/link';
import { DollarSign, Clock, Package, ShoppingBag, TrendingUp, TrendingDown, Plus, Tag, FileText, BarChart3, Loader2, Users } from 'lucide-react';

export default function AdminDashboard() {
    const [data, setData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetch('/api/admin/analytics')
            .then(r => r.json())
            .then(setData)
            .catch(console.error)
            .finally(() => setIsLoading(false));
    }, []);

    if (isLoading) {
        return (
            <div className={styles.adminContainer}>
                <header className={styles.adminHeader}>
                    <h1>Overview Dashboard</h1>
                    <p>Welcome back, here&apos;s what&apos;s happening today.</p>
                </header>
                <div style={{ textAlign: 'center', padding: '4rem', color: '#666' }}>
                    <Loader2 size={40} className="animate-spin" style={{ margin: '0 auto 1rem' }} />
                    <p>Loading dashboard...</p>
                </div>
            </div>
        );
    }

    const kpis = data?.kpis || { totalRevenue: 0, revenueChange: 0, totalOrders: 0, ordersChange: 0, aov: 0, newCustomers: 0, pendingOrders: 0, totalProducts: 0 };
    const recentOrders = data?.recentOrders || [];
    const topProducts = data?.topProducts || [];

    return (
        <div className={styles.adminContainer}>
            <header className={styles.adminHeader}>
                <h1>Overview Dashboard</h1>
                <p>Welcome back, here&apos;s what&apos;s happening today.</p>
            </header>

            {/* KPI Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                <div className={styles.card}>
                    <div className={styles.kpiLabel}>Total Revenue <DollarSign size={18} /></div>
                    <div className={styles.kpiValue}>${kpis.totalRevenue.toFixed(2)}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8rem', fontWeight: 700, color: kpis.revenueChange >= 0 ? '#10b981' : '#ef4444' }}>
                        {kpis.revenueChange >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                        {kpis.revenueChange >= 0 ? '+' : ''}{kpis.revenueChange}% vs last period
                    </div>
                </div>
                <div className={styles.card}>
                    <div className={styles.kpiLabel}>Pending Orders <Clock size={18} /></div>
                    <div className={styles.kpiValue}>{kpis.pendingOrders}</div>
                    <div style={{ fontSize: '0.8rem', color: '#aaa' }}>Awaiting payment</div>
                </div>
                <div className={styles.card}>
                    <div className={styles.kpiLabel}>Total Orders (30d) <ShoppingBag size={18} /></div>
                    <div className={styles.kpiValue}>{kpis.totalOrders}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8rem', fontWeight: 700, color: kpis.ordersChange >= 0 ? '#10b981' : '#ef4444' }}>
                        {kpis.ordersChange >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                        {kpis.ordersChange >= 0 ? '+' : ''}{kpis.ordersChange}% vs last period
                    </div>
                </div>
                <div className={styles.card}>
                    <div className={styles.kpiLabel}>Products <Package size={18} /></div>
                    <div className={styles.kpiValue}>{kpis.totalProducts}</div>
                    <div style={{ fontSize: '0.8rem', color: '#aaa' }}>Active catalog</div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
                {/* Recent Orders */}
                <div className={styles.card}>
                    <div className={styles.cardHeader}>
                        <h2>Recent Orders</h2>
                        <Link href="/admin/orders" style={{ color: '#a855f7', fontSize: '0.85rem', textDecoration: 'none' }}>View All →</Link>
                    </div>
                    {recentOrders.length === 0 ? (
                        <p style={{ color: '#666', textAlign: 'center', padding: '2rem' }}>No orders yet.</p>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {recentOrders.slice(0, 5).map((order: any) => (
                                <div key={order.id} style={{
                                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                    padding: '0.75rem', background: 'rgba(0,0,0,0.2)', borderRadius: '8px',
                                    border: '1px solid rgba(255,255,255,0.05)'
                                }}>
                                    <div>
                                        <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{order.customer}</div>
                                        <div style={{ color: '#888', fontSize: '0.75rem' }}>#{order.id.slice(-6).toUpperCase()}</div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ fontWeight: 700, color: '#fff' }}>${order.total.toFixed(2)}</div>
                                        <span style={{
                                            fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase' as const,
                                            padding: '0.15rem 0.4rem', borderRadius: '4px',
                                            background: order.status === 'PENDING' ? 'rgba(245,158,11,0.2)' : order.status === 'COMPLETED' ? 'rgba(16,185,129,0.2)' : 'rgba(255,255,255,0.1)',
                                            color: order.status === 'PENDING' ? '#f59e0b' : order.status === 'COMPLETED' ? '#10b981' : '#888'
                                        }}>{order.status}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Top Products */}
                <div className={styles.card}>
                    <div className={styles.cardHeader}>
                        <h2>Top Products</h2>
                        <Link href="/admin/analytics" style={{ color: '#a855f7', fontSize: '0.85rem', textDecoration: 'none' }}>Analytics →</Link>
                    </div>
                    {topProducts.length === 0 ? (
                        <p style={{ color: '#666', textAlign: 'center', padding: '2rem' }}>No sales data yet.</p>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {topProducts.map((product: any, i: number) => (
                                <div key={i} style={{
                                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                    padding: '0.75rem', background: 'rgba(0,0,0,0.2)', borderRadius: '8px',
                                    border: '1px solid rgba(255,255,255,0.05)'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                        <span style={{
                                            width: '28px', height: '28px', borderRadius: '6px', display: 'flex',
                                            alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.75rem',
                                            background: i === 0 ? 'rgba(168,85,247,0.2)' : 'rgba(255,255,255,0.05)',
                                            color: i === 0 ? '#a855f7' : '#666'
                                        }}>#{i + 1}</span>
                                        <div>
                                            <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{product.name}</div>
                                            <div style={{ color: '#888', fontSize: '0.75rem' }}>{product.units} units sold</div>
                                        </div>
                                    </div>
                                    <div style={{ fontWeight: 700, color: '#10b981' }}>${product.revenue.toFixed(2)}</div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Quick Actions */}
            <div className={styles.card}>
                <div className={styles.cardHeader}>
                    <h2>Quick Actions</h2>
                </div>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    {[
                        { label: 'New Product', href: '/admin/products', icon: Plus, color: '#a855f7' },
                        { label: 'Create Coupon', href: '/admin/coupons', icon: Tag, color: '#6366f1' },
                        { label: 'Write Post', href: '/admin/blog', icon: FileText, color: '#ec4899' },
                        { label: 'View Analytics', href: '/admin/analytics', icon: BarChart3, color: '#10b981' },
                    ].map(action => (
                        <Link key={action.label} href={action.href} style={{
                            display: 'flex', alignItems: 'center', gap: '0.5rem',
                            padding: '0.75rem 1.25rem', borderRadius: '8px', textDecoration: 'none',
                            background: `${action.color}15`, border: `1px solid ${action.color}30`,
                            color: action.color, fontWeight: 600, fontSize: '0.85rem',
                            transition: 'all 0.2s'
                        }}>
                            <action.icon size={16} /> {action.label}
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
