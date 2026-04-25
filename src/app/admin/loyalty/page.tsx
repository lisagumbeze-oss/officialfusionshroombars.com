'use client';

import { useState, useEffect } from 'react';
import styles from '../admin.module.css';
import { Award, Loader2, Plus, Minus, Search } from 'lucide-react';

interface LoyaltyAccount {
    id: string;
    email: string;
    points: number;
    createdAt: string;
    updatedAt: string;
}

export default function LoyaltyPage() {
    const [accounts, setAccounts] = useState<LoyaltyAccount[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // Manual adjust form
    const [adjustEmail, setAdjustEmail] = useState('');
    const [adjustPoints, setAdjustPoints] = useState('');
    const [adjustAction, setAdjustAction] = useState<'add' | 'deduct' | 'set'>('add');
    const [isAdjusting, setIsAdjusting] = useState(false);

    useEffect(() => { fetchAccounts(); }, []);

    const fetchAccounts = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/admin/loyalty');
            if (res.ok) setAccounts(await res.json());
        } catch (err) {
            console.error('Failed to fetch:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAdjust = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!adjustEmail || !adjustPoints) return;
        setIsAdjusting(true);
        try {
            const res = await fetch('/api/admin/loyalty', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: adjustEmail.toLowerCase(),
                    points: parseInt(adjustPoints),
                    action: adjustAction
                })
            });
            if (res.ok) {
                setAdjustEmail('');
                setAdjustPoints('');
                fetchAccounts();
            }
        } catch (err) {
            console.error('Failed to adjust:', err);
        } finally {
            setIsAdjusting(false);
        }
    };

    const totalPoints = accounts.reduce((s, a) => s + a.points, 0);
    const filtered = accounts.filter(a => a.email.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className={styles.adminContainer}>
            <header className={styles.adminHeader}>
                <h1>Loyalty Vault</h1>
                <p>Manage customer reward points and accounts.</p>
            </header>

            {/* KPI Row */}
            <div className={styles.dashboardGrid} style={{ marginBottom: '2rem' }}>
                <div className={styles.card}>
                    <div className={styles.kpiLabel}>Total Accounts <Award size={18} /></div>
                    <div className={styles.kpiValue}>{accounts.length}</div>
                </div>
                <div className={styles.card}>
                    <div className={styles.kpiLabel}>Total Points Issued <Award size={18} /></div>
                    <div className={styles.kpiValue}>{totalPoints.toLocaleString()}</div>
                </div>
                <div className={styles.card}>
                    <div className={styles.kpiLabel}>Avg Points per Customer <Award size={18} /></div>
                    <div className={styles.kpiValue}>{accounts.length > 0 ? Math.round(totalPoints / accounts.length) : 0}</div>
                </div>
            </div>

            {/* Manual Adjust */}
            <div className={styles.card} style={{ marginBottom: '2rem' }}>
                <div className={styles.cardHeader}>
                    <h2>Adjust Points</h2>
                </div>
                <form onSubmit={handleAdjust} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr auto', gap: '1rem', alignItems: 'end' }}>
                    <div className={styles.inputGroup}>
                        <label>Customer Email</label>
                        <input value={adjustEmail} onChange={e => setAdjustEmail(e.target.value)} placeholder="customer@email.com" required />
                    </div>
                    <div className={styles.inputGroup}>
                        <label>Points</label>
                        <input type="number" value={adjustPoints} onChange={e => setAdjustPoints(e.target.value)} placeholder="100" required min="1" />
                    </div>
                    <div className={styles.inputGroup}>
                        <label>Action</label>
                        <select value={adjustAction} onChange={e => setAdjustAction(e.target.value as any)} style={{ width: '100%', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', padding: '0.75rem', borderRadius: '4px' }}>
                            <option value="add">Add</option>
                            <option value="deduct">Deduct</option>
                            <option value="set">Set to</option>
                        </select>
                    </div>
                    <button type="submit" disabled={isAdjusting}
                        style={{
                            background: 'linear-gradient(135deg, #a855f7, #6b21a8)', color: '#fff', border: 'none',
                            padding: '0.75rem 1.5rem', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', height: '44px'
                        }}>
                        {isAdjusting ? <Loader2 size={16} className="animate-spin" /> : 'APPLY'}
                    </button>
                </form>
            </div>

            {/* Accounts Table */}
            <div className={styles.card}>
                <div className={styles.cardHeader}>
                    <h2>All Loyalty Accounts</h2>
                    <span className={styles.badge}>{accounts.length}</span>
                </div>

                <div style={{ marginBottom: '1rem', position: 'relative' }}>
                    <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#666' }} />
                    <input
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        placeholder="Search by email..."
                        style={{
                            width: '100%', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)',
                            color: '#fff', padding: '0.75rem 0.75rem 0.75rem 2.25rem', borderRadius: '8px', fontSize: '0.9rem'
                        }}
                    />
                </div>

                {isLoading ? (
                    <div style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>
                        <Loader2 size={24} className="animate-spin" style={{ margin: '0 auto 1rem' }} />
                        Loading accounts...
                    </div>
                ) : filtered.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>
                        <Award size={48} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
                        <p>{searchTerm ? 'No accounts match your search.' : 'No loyalty accounts yet.'}</p>
                    </div>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', textAlign: 'left' }}>
                                    <th style={{ padding: '0.75rem', color: '#888', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>#</th>
                                    <th style={{ padding: '0.75rem', color: '#888', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Email</th>
                                    <th style={{ padding: '0.75rem', color: '#888', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Points</th>
                                    <th style={{ padding: '0.75rem', color: '#888', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Joined</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((account, i) => (
                                    <tr key={account.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                        <td style={{ padding: '0.75rem', color: '#666' }}>{i + 1}</td>
                                        <td style={{ padding: '0.75rem', color: '#fff' }}>{account.email}</td>
                                        <td style={{ padding: '0.75rem' }}>
                                            <span style={{
                                                background: 'rgba(168,85,247,0.15)', color: '#a855f7',
                                                padding: '0.25rem 0.75rem', borderRadius: '999px', fontWeight: 700, fontSize: '0.85rem'
                                            }}>
                                                {account.points.toLocaleString()} pts
                                            </span>
                                        </td>
                                        <td style={{ padding: '0.75rem', color: '#888' }}>{new Date(account.createdAt).toLocaleDateString()}</td>
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
