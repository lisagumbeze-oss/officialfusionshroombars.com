'use client';

import { useState, useEffect } from 'react';
import styles from '../admin.module.css';
import { 
    MessageSquare, 
    Star, 
    CheckCircle2, 
    XCircle, 
    AlertTriangle, 
    Trash2, 
    Clock, 
    Search,
    Filter,
    User,
    ExternalLink,
    MoreVertical,
    Loader2
} from 'lucide-react';

export default function ModerationQueue() {
    const [activeTab, setActiveTab] = useState<'COMMENT' | 'REVIEW'>('COMMENT');
    const [statusFilter, setStatusFilter] = useState<string>('PENDING');
    const [items, setItems] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchItems = async () => {
        setIsLoading(true);
        try {
            const res = await fetch(`/api/admin/comments?type=${activeTab}&status=${statusFilter === 'ALL' ? '' : statusFilter}`);
            const data = await res.json();
            setItems(data);
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchItems();
    }, [activeTab, statusFilter]);

    const handleAction = async (id: string, status: string) => {
        try {
            await fetch('/api/admin/comments', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, status, type: activeTab })
            });
            fetchItems();
        } catch (e) {}
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Permanently delete this item?')) return;
        try {
            await fetch(`/api/admin/comments?id=${id}&type=${activeTab}`, { method: 'DELETE' });
            fetchItems();
        } catch (e) {}
    };

    const filteredItems = items.filter(item => 
        item.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className={styles.adminContainer}>
            <header className={styles.adminHeader}>
                <h1>Moderation Queue</h1>
                <p>Approve or moderate community discussions and feedback.</p>
            </header>

            {/* Controls */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', gap: '2rem' }}>
                <div style={{ display: 'flex', background: 'rgba(255,255,255,0.03)', padding: '0.25rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <button 
                        onClick={() => setActiveTab('COMMENT')}
                        style={{ padding: '0.6rem 1.5rem', borderRadius: '10px', background: activeTab === 'COMMENT' ? 'rgba(255,255,255,0.08)' : 'transparent', border: 'none', color: activeTab === 'COMMENT' ? '#fff' : '#666', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                    >
                        <MessageSquare size={16} /> Blog Comments
                    </button>
                    <button 
                        onClick={() => setActiveTab('REVIEW')}
                        style={{ padding: '0.6rem 1.5rem', borderRadius: '10px', background: activeTab === 'REVIEW' ? 'rgba(255,255,255,0.08)' : 'transparent', border: 'none', color: activeTab === 'REVIEW' ? '#fff' : '#666', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                    >
                        <Star size={16} /> Product Reviews
                    </button>
                </div>

                <div style={{ display: 'flex', gap: '1rem', flex: 1, justifyContent: 'flex-end' }}>
                    <div style={{ position: 'relative' }}>
                        <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#555' }} />
                        <input 
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            placeholder="Filter by content or author..." 
                            style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.05)', color: '#fff', padding: '0.6rem 1rem 0.6rem 2.5rem', borderRadius: '8px', fontSize: '0.85rem', width: '300px' }}
                        />
                    </div>
                    <select 
                        value={statusFilter}
                        onChange={e => setStatusFilter(e.target.value)}
                        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', color: '#fff', padding: '0 1rem', borderRadius: '8px', cursor: 'pointer', outline: 'none' }}
                    >
                        <option value="PENDING">Pending Approval</option>
                        <option value="APPROVED">Approved</option>
                        <option value="SPAM">Spam</option>
                        <option value="TRASH">Trash</option>
                        <option value="ALL">All Statuses</option>
                    </select>
                </div>
            </div>

            {/* List */}
            <div className={styles.card}>
                {isLoading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
                        <Loader2 size={40} className="animate-spin" style={{ color: '#a855f7' }} />
                    </div>
                ) : filteredItems.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '6rem', color: '#444' }}>
                        <CheckCircle2 size={64} style={{ marginBottom: '1.5rem', opacity: 0.1, margin: '0 auto' }} />
                        <p style={{ fontSize: '1.1rem', fontWeight: 600 }}>Queue Clear!</p>
                        <p style={{ fontSize: '0.9rem' }}>No items match your current filters.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-white/5">
                        {filteredItems.map((item) => (
                            <div key={item.id} style={{ padding: '2rem', display: 'flex', gap: '2rem', transition: 'background 0.2s' }} className="hover:bg-white/[0.01]">
                                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#555', flexShrink: 0 }}>
                                    <User size={24} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                                        <div>
                                            <span style={{ fontWeight: 700, fontSize: '1rem', marginRight: '0.75rem' }}>{item.name}</span>
                                            {item.email && <span style={{ color: '#555', fontSize: '0.85rem' }}>{item.email}</span>}
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: '#444' }}>
                                            <Clock size={14} />
                                            {new Date(item.createdAt).toLocaleDateString()}
                                        </div>
                                    </div>

                                    {activeTab === 'REVIEW' && (
                                        <div style={{ display: 'flex', gap: '2px', marginBottom: '1rem' }}>
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} size={14} fill={i < item.rating ? '#ffcc00' : 'none'} color={i < item.rating ? '#ffcc00' : '#333'} />
                                            ))}
                                        </div>
                                    )}

                                    <div style={{ color: '#ccc', lineHeight: '1.6', fontSize: '0.95rem', marginBottom: '1.5rem', padding: '1rem', background: 'rgba(0,0,0,0.2)', borderRadius: '12px', borderLeft: '3px solid rgba(168, 85, 247, 0.3)' }}>
                                        {item.content}
                                    </div>

                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <div style={{ fontSize: '0.75rem', color: '#666', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <span>Posted on:</span>
                                            <span style={{ color: '#888', fontWeight: 600 }}>{activeTab === 'COMMENT' ? item.blogPost?.title : item.product?.name}</span>
                                        </div>
                                        
                                        <div style={{ display: 'flex', gap: '0.75rem' }}>
                                            {item.status !== 'APPROVED' && (
                                                <button 
                                                    onClick={() => handleAction(item.id, 'APPROVED')}
                                                    style={{ background: 'rgba(34, 197, 94, 0.1)', border: '1px solid rgba(34, 197, 94, 0.2)', color: '#22c55e', padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                                                >
                                                    <CheckCircle2 size={16} /> Approve
                                                </button>
                                            )}
                                            {item.status !== 'SPAM' && (
                                                <button 
                                                    onClick={() => handleAction(item.id, 'SPAM')}
                                                    style={{ background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.2)', color: '#f59e0b', padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                                                >
                                                    <AlertTriangle size={16} /> Spam
                                                </button>
                                            )}
                                            <button 
                                                onClick={() => handleDelete(item.id)}
                                                style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#ef4444', padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                                            >
                                                <Trash2 size={16} /> Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
