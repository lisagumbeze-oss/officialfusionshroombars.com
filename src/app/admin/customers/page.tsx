'use client';

import { useState, useEffect } from 'react';
import styles from '../admin.module.css';
import { Users, Search, ShoppingBag, DollarSign, Calendar, Loader2, ArrowRight } from 'lucide-react';

interface Customer {
    email: string;
    name: string;
    orders: number;
    totalSpent: number;
    lastOrder: string;
    firstOrder: string;
}

export default function CustomersPage() {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetch('/api/admin/customers')
            .then(r => r.json())
            .then(setCustomers)
            .catch(console.error)
            .finally(() => setIsLoading(false));
    }, []);

    const filtered = customers.filter(c => 
        c.email.toLowerCase().includes(searchTerm.toLowerCase()) || 
        c.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalRevenue = customers.reduce((s, c) => s + c.totalSpent, 0);
    const avgLTV = customers.length > 0 ? totalRevenue / customers.length : 0;

    return (
        <div className={styles.adminContainer}>
            <header className={styles.adminHeader}>
                <h1>Customer Directory</h1>
                <p>View and manage your customer relationships and lifetime value.</p>
            </header>

            {/* KPI Row */}
            <div className={styles.dashboardGrid} style={{ marginBottom: '2rem' }}>
                <div className={styles.card}>
                    <div className={styles.kpiLabel}>Total Customers <Users size={18} /></div>
                    <div className={styles.kpiValue}>{customers.length}</div>
                </div>
                <div className={styles.card}>
                    <div className={styles.kpiLabel}>Avg. Lifetime Value <DollarSign size={18} /></div>
                    <div className={styles.kpiValue}>${avgLTV.toFixed(2)}</div>
                </div>
                <div className={styles.card}>
                    <div className={styles.kpiLabel}>Total Revenue <ShoppingBag size={18} /></div>
                    <div className={styles.kpiValue}>${totalRevenue.toFixed(2)}</div>
                </div>
            </div>

            <div className={styles.card}>
                <div className={styles.cardHeader}>
                    <h2>All Customers</h2>
                    <div style={{ position: 'relative' }}>
                        <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#666' }} />
                        <input
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            placeholder="Search by name or email..."
                            style={{
                                width: '300px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)',
                                color: '#fff', padding: '0.75rem 0.75rem 0.75rem 2.5rem', borderRadius: '8px', fontSize: '0.9rem'
                            }}
                        />
                    </div>
                </div>

                {isLoading ? (
                    <div style={{ textAlign: 'center', padding: '4rem', color: '#666' }}>
                        <Loader2 size={32} className="animate-spin" style={{ margin: '0 auto 1rem' }} />
                        <p>Loading customers...</p>
                    </div>
                ) : filtered.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '4rem', color: '#666' }}>
                        <Users size={48} style={{ margin: '0 auto 1rem', opacity: 0.2 }} />
                        <p>No customers found.</p>
                    </div>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', textAlign: 'left' }}>
                                    <th style={{ padding: '1rem', color: '#888', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase' }}>Customer</th>
                                    <th style={{ padding: '1rem', color: '#888', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase' }}>Orders</th>
                                    <th style={{ padding: '1rem', color: '#888', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase' }}>Total Spent</th>
                                    <th style={{ padding: '1rem', color: '#888', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase' }}>Last Order</th>
                                    <th style={{ padding: '1rem', color: '#888', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((customer) => (
                                    <tr key={customer.email} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                        <td style={{ padding: '1rem' }}>
                                            <div style={{ fontWeight: 600, color: '#fff' }}>{customer.name}</div>
                                            <div style={{ fontSize: '0.8rem', color: '#666' }}>{customer.email}</div>
                                        </td>
                                        <td style={{ padding: '1rem' }}>
                                            <span style={{ background: 'rgba(255,255,255,0.05)', padding: '0.25rem 0.6rem', borderRadius: '4px', color: '#aaa' }}>
                                                {customer.orders} orders
                                            </span>
                                        </td>
                                        <td style={{ padding: '1rem', color: '#10b981', fontWeight: 700 }}>
                                            ${customer.totalSpent.toFixed(2)}
                                        </td>
                                        <td style={{ padding: '1rem', color: '#888' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                <Calendar size={14} />
                                                {new Date(customer.lastOrder).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td style={{ padding: '1rem' }}>
                                            <button 
                                                onClick={() => window.location.href = `/admin/orders?email=${customer.email}`}
                                                style={{ 
                                                    background: 'none', border: 'none', color: '#a855f7', 
                                                    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem',
                                                    fontSize: '0.85rem', fontWeight: 600
                                                }}
                                            >
                                                View Orders <ArrowRight size={14} />
                                            </button>
                                        </td>
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
