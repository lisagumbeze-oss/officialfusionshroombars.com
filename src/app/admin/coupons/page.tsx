'use client';

import { useState, useEffect } from 'react';
import styles from '../admin.module.css';
import { Plus, Trash2, Copy, RefreshCw, Loader2, Tag } from 'lucide-react';

interface Coupon {
    id: string;
    code: string;
    discount: number;
    type: string;
    isActive: boolean;
    usageCount: number;
    maxUsage: number | null;
    expiresAt: string | null;
    createdAt: string;
}

export default function CouponsPage() {
    const [coupons, setCoupons] = useState<Coupon[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form state
    const [formCode, setFormCode] = useState('');
    const [formDiscount, setFormDiscount] = useState('');
    const [formType, setFormType] = useState('PERCENTAGE');
    const [formMaxUsage, setFormMaxUsage] = useState('');
    const [formExpiry, setFormExpiry] = useState('');

    useEffect(() => {
        fetchCoupons();
    }, []);

    const fetchCoupons = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/admin/coupons');
            if (res.ok) {
                const data = await res.json();
                setCoupons(data);
            }
        } catch (err) {
            console.error('Failed to fetch coupons:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const generateCode = () => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let code = 'FUSION';
        for (let i = 0; i < 6; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        setFormCode(code);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const res = await fetch('/api/admin/coupons', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    code: formCode.toUpperCase(),
                    discount: parseFloat(formDiscount),
                    type: formType,
                    maxUsage: formMaxUsage ? parseInt(formMaxUsage) : null,
                    expiresAt: formExpiry || null,
                })
            });
            if (res.ok) {
                setFormCode('');
                setFormDiscount('');
                setFormMaxUsage('');
                setFormExpiry('');
                setShowForm(false);
                fetchCoupons();
            }
        } catch (err) {
            console.error('Failed to create coupon:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const toggleActive = async (id: string, currentState: boolean) => {
        try {
            await fetch(`/api/admin/coupons/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isActive: !currentState })
            });
            fetchCoupons();
        } catch (err) {
            console.error('Failed to toggle coupon:', err);
        }
    };

    const deleteCoupon = async (id: string) => {
        if (!confirm('Are you sure you want to delete this coupon?')) return;
        try {
            await fetch(`/api/admin/coupons/${id}`, { method: 'DELETE' });
            fetchCoupons();
        } catch (err) {
            console.error('Failed to delete coupon:', err);
        }
    };

    const copyCode = (code: string) => {
        navigator.clipboard.writeText(code);
    };

    return (
        <div className={styles.adminContainer}>
            <header className={styles.adminHeader}>
                <h1>Coupons & Promotions</h1>
                <p>Create and manage discount codes for your store.</p>
            </header>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.5rem' }}>
                <button
                    onClick={() => setShowForm(!showForm)}
                    style={{
                        display: 'flex', alignItems: 'center', gap: '0.5rem',
                        background: 'linear-gradient(135deg, #a855f7, #6b21a8)',
                        color: '#fff', border: 'none', padding: '0.75rem 1.5rem',
                        borderRadius: '8px', fontWeight: 700, cursor: 'pointer',
                        fontSize: '0.85rem', letterSpacing: '0.5px'
                    }}
                >
                    <Plus size={16} /> CREATE COUPON
                </button>
            </div>

            {showForm && (
                <div className={styles.card} style={{ marginBottom: '2rem' }}>
                    <div className={styles.cardHeader}>
                        <h2>New Coupon</h2>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div className={styles.inputGroup}>
                                <label>Coupon Code</label>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <input
                                        value={formCode}
                                        onChange={(e) => setFormCode(e.target.value.toUpperCase())}
                                        placeholder="e.g. SAVE20"
                                        required
                                        style={{ flex: 1 }}
                                    />
                                    <button
                                        type="button"
                                        onClick={generateCode}
                                        style={{
                                            background: 'rgba(168,85,247,0.2)', border: '1px solid rgba(168,85,247,0.3)',
                                            color: '#a855f7', padding: '0 1rem', borderRadius: '4px', cursor: 'pointer',
                                            fontSize: '0.75rem', fontWeight: 700
                                        }}
                                    >
                                        <RefreshCw size={14} />
                                    </button>
                                </div>
                            </div>
                            <div className={styles.inputGroup}>
                                <label>Discount Type</label>
                                <select
                                    value={formType}
                                    onChange={(e) => setFormType(e.target.value)}
                                    style={{
                                        width: '100%', background: 'rgba(0,0,0,0.3)',
                                        border: '1px solid rgba(255,255,255,0.2)', color: '#fff',
                                        padding: '0.75rem', borderRadius: '4px'
                                    }}
                                >
                                    <option value="PERCENTAGE">Percentage (%)</option>
                                    <option value="FIXED">Fixed Amount ($)</option>
                                </select>
                            </div>
                            <div className={styles.inputGroup}>
                                <label>Discount Value</label>
                                <input
                                    type="number"
                                    value={formDiscount}
                                    onChange={(e) => setFormDiscount(e.target.value)}
                                    placeholder={formType === 'PERCENTAGE' ? 'e.g. 20' : 'e.g. 10.00'}
                                    required
                                    step="0.01"
                                />
                            </div>
                            <div className={styles.inputGroup}>
                                <label>Max Usage (optional)</label>
                                <input
                                    type="number"
                                    value={formMaxUsage}
                                    onChange={(e) => setFormMaxUsage(e.target.value)}
                                    placeholder="Unlimited if empty"
                                />
                            </div>
                            <div className={styles.inputGroup}>
                                <label>Expiry Date (optional)</label>
                                <input
                                    type="datetime-local"
                                    value={formExpiry}
                                    onChange={(e) => setFormExpiry(e.target.value)}
                                    style={{
                                        width: '100%', background: 'rgba(0,0,0,0.3)',
                                        border: '1px solid rgba(255,255,255,0.2)', color: '#fff',
                                        padding: '0.75rem', borderRadius: '4px'
                                    }}
                                />
                            </div>
                        </div>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={styles.submitBtn}
                            style={{ marginTop: '1.5rem', background: 'linear-gradient(135deg, #a855f7, #6b21a8)' }}
                        >
                            {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : 'CREATE COUPON'}
                        </button>
                    </form>
                </div>
            )}

            <div className={styles.card}>
                <div className={styles.cardHeader}>
                    <h2>All Coupons</h2>
                    <span className={styles.badge}>{coupons.length}</span>
                </div>

                {isLoading ? (
                    <div style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>
                        <Loader2 size={24} className="animate-spin" style={{ margin: '0 auto 1rem' }} />
                        Loading coupons...
                    </div>
                ) : coupons.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>
                        <Tag size={48} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
                        <p>No coupons created yet.</p>
                    </div>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', textAlign: 'left' }}>
                                    <th style={{ padding: '0.75rem', color: '#888', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Code</th>
                                    <th style={{ padding: '0.75rem', color: '#888', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Discount</th>
                                    <th style={{ padding: '0.75rem', color: '#888', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Usage</th>
                                    <th style={{ padding: '0.75rem', color: '#888', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Expires</th>
                                    <th style={{ padding: '0.75rem', color: '#888', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Status</th>
                                    <th style={{ padding: '0.75rem', color: '#888', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {coupons.map((coupon) => (
                                    <tr key={coupon.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                        <td style={{ padding: '0.75rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                <code style={{ background: 'rgba(168,85,247,0.15)', color: '#a855f7', padding: '0.25rem 0.5rem', borderRadius: '4px', fontWeight: 700 }}>
                                                    {coupon.code}
                                                </code>
                                                <button onClick={() => copyCode(coupon.code)} title="Copy code"
                                                    style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer' }}>
                                                    <Copy size={14} />
                                                </button>
                                            </div>
                                        </td>
                                        <td style={{ padding: '0.75rem', color: '#fff', fontWeight: 600 }}>
                                            {coupon.type === 'PERCENTAGE' ? `${coupon.discount}%` : `$${coupon.discount.toFixed(2)}`}
                                        </td>
                                        <td style={{ padding: '0.75rem', color: '#aaa' }}>
                                            {coupon.usageCount}{coupon.maxUsage ? ` / ${coupon.maxUsage}` : ' / ∞'}
                                        </td>
                                        <td style={{ padding: '0.75rem', color: '#aaa' }}>
                                            {coupon.expiresAt ? new Date(coupon.expiresAt).toLocaleDateString() : 'Never'}
                                        </td>
                                        <td style={{ padding: '0.75rem' }}>
                                            <button
                                                onClick={() => toggleActive(coupon.id, coupon.isActive)}
                                                className={coupon.isActive ? styles.activeBadge : styles.inactiveBadge}
                                                style={{ cursor: 'pointer', border: 'none' }}
                                            >
                                                {coupon.isActive ? 'Active' : 'Inactive'}
                                            </button>
                                        </td>
                                        <td style={{ padding: '0.75rem' }}>
                                            <button
                                                onClick={() => deleteCoupon(coupon.id)}
                                                style={{ background: 'none', border: 'none', color: '#dc3545', cursor: 'pointer' }}
                                            >
                                                <Trash2 size={16} />
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
