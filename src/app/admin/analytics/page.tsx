'use client';

import { useState, useEffect } from 'react';
import styles from '../admin.module.css';
import { DollarSign, ShoppingBag, TrendingUp, TrendingDown, Users, Package, Clock, BarChart3, Loader2 } from 'lucide-react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar, PieChart, Pie, Cell
} from 'recharts';

const COLORS = ['#a855f7', '#6366f1', '#ec4899', '#f59e0b', '#10b981'];
const STATUS_COLORS: Record<string, string> = {
    PENDING: '#f59e0b',
    PROCESSING: '#3b82f6',
    COMPLETED: '#10b981',
    CANCELLED: '#ef4444'
};

export default function AnalyticsPage() {
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
                <div style={{ textAlign: 'center', padding: '6rem', color: '#666' }}>
                    <Loader2 size={40} className="animate-spin" style={{ margin: '0 auto 1rem' }} />
                    <p>Loading analytics...</p>
                </div>
            </div>
        );
    }

    if (!data) return null;

    const { kpis, revenueByDay, topProducts, recentOrders, statusCounts } = data;

    const KpiCard = ({ label, value, change, icon: Icon, prefix = '' }: any) => (
        <div className={styles.card}>
            <div className={styles.kpiLabel}>
                {label} <Icon size={18} />
            </div>
            <div className={styles.kpiValue}>{prefix}{typeof value === 'number' && prefix === '$' ? value.toFixed(2) : value}</div>
            {change !== undefined && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8rem', fontWeight: 700, color: change >= 0 ? '#10b981' : '#ef4444' }}>
                    {change >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                    {change >= 0 ? '+' : ''}{change}% vs last period
                </div>
            )}
        </div>
    );

    const statusData = Object.entries(statusCounts).map(([name, value]) => ({ name, value }));

    return (
        <div className={styles.adminContainer}>
            <header className={styles.adminHeader}>
                <h1>Analytics & Reports</h1>
                <p>Real-time insights from your Fusion store.</p>
            </header>

            {/* KPI Row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                <KpiCard label="Revenue (30d)" value={kpis.totalRevenue} change={kpis.revenueChange} icon={DollarSign} prefix="$" />
                <KpiCard label="Orders (30d)" value={kpis.totalOrders} change={kpis.ordersChange} icon={ShoppingBag} />
                <KpiCard label="Avg Order Value" value={kpis.aov} icon={BarChart3} prefix="$" />
                <KpiCard label="New Customers" value={kpis.newCustomers} icon={Users} />
            </div>

            {/* Revenue Chart */}
            <div className={styles.card} style={{ marginBottom: '2rem' }}>
                <div className={styles.cardHeader}>
                    <h2>Revenue Trend (Last 30 Days)</h2>
                </div>
                <div style={{ height: 300 }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={revenueByDay}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                            <XAxis dataKey="date" tick={{ fill: '#666', fontSize: 11 }} tickFormatter={(v) => v.slice(5)} />
                            <YAxis tick={{ fill: '#666', fontSize: 11 }} tickFormatter={(v) => `$${v}`} />
                            <Tooltip
                                contentStyle={{ background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }}
                                formatter={(v: any) => [`$${v ? Number(v).toFixed(2) : '0.00'}`, 'Revenue']}
                                labelFormatter={(label) => `Date: ${label}`}
                            />
                            <Line type="monotone" dataKey="revenue" stroke="#a855f7" strokeWidth={2.5} dot={false} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
                {/* Top Products */}
                <div className={styles.card}>
                    <div className={styles.cardHeader}>
                        <h2>Top Products</h2>
                    </div>
                    {topProducts.length === 0 ? (
                        <p style={{ color: '#666', textAlign: 'center', padding: '2rem' }}>No sales data yet.</p>
                    ) : (
                        <div style={{ height: 250 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={topProducts} layout="vertical">
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                                    <XAxis type="number" tick={{ fill: '#666', fontSize: 11 }} tickFormatter={(v) => `$${v}`} />
                                    <YAxis dataKey="name" type="category" tick={{ fill: '#aaa', fontSize: 11 }} width={140} />
                                    <Tooltip
                                        contentStyle={{ background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }}
                                        formatter={(v: any) => [`$${v ? Number(v).toFixed(2) : '0.00'}`, 'Revenue']}
                                    />
                                    <Bar dataKey="revenue" radius={[0, 4, 4, 0]}>
                                        {topProducts.map((_: any, i: number) => (
                                            <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    )}
                </div>

                {/* Order Status Distribution */}
                <div className={styles.card}>
                    <div className={styles.cardHeader}>
                        <h2>Order Status</h2>
                    </div>
                    {statusData.length === 0 ? (
                        <p style={{ color: '#666', textAlign: 'center', padding: '2rem' }}>No orders yet.</p>
                    ) : (
                        <div style={{ height: 250, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={statusData} cx="50%" cy="50%" outerRadius={80} innerRadius={50} paddingAngle={5} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                                        {statusData.map((entry: any, i: number) => (
                                            <Cell key={i} fill={STATUS_COLORS[entry.name] || COLORS[i % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip contentStyle={{ background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    )}
                </div>
            </div>

            {/* Recent Orders Table */}
            <div className={styles.card}>
                <div className={styles.cardHeader}>
                    <h2>Recent Orders</h2>
                </div>
                {recentOrders.length === 0 ? (
                    <p style={{ color: '#666', textAlign: 'center', padding: '2rem' }}>No orders yet.</p>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', textAlign: 'left' }}>
                                    <th style={{ padding: '0.75rem', color: '#888', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase' }}>Order ID</th>
                                    <th style={{ padding: '0.75rem', color: '#888', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase' }}>Customer</th>
                                    <th style={{ padding: '0.75rem', color: '#888', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase' }}>Total</th>
                                    <th style={{ padding: '0.75rem', color: '#888', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase' }}>Status</th>
                                    <th style={{ padding: '0.75rem', color: '#888', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase' }}>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentOrders.map((order: any) => (
                                    <tr key={order.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                        <td style={{ padding: '0.75rem', fontFamily: 'monospace', color: '#a855f7' }}>#{order.id.slice(-6).toUpperCase()}</td>
                                        <td style={{ padding: '0.75rem', color: '#fff' }}>{order.customer}</td>
                                        <td style={{ padding: '0.75rem', color: '#fff', fontWeight: 600 }}>${order.total.toFixed(2)}</td>
                                        <td style={{ padding: '0.75rem' }}>
                                            <span style={{
                                                padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 700,
                                                background: STATUS_COLORS[order.status] ? `${STATUS_COLORS[order.status]}20` : 'rgba(255,255,255,0.1)',
                                                color: STATUS_COLORS[order.status] || '#888'
                                            }}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td style={{ padding: '0.75rem', color: '#888' }}>{new Date(order.date).toLocaleDateString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
