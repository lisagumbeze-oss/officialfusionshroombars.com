'use client';
import { useState } from 'react';
import { Search, X, Eye, Trash2 } from 'lucide-react';
import styles from '../admin.module.css';

import { useSearchParams } from 'next/navigation';

export default function OrdersTable({ 
    orders, 
    updateStatusAction,
    deleteOrderAction
}: { 
    orders: any[], 
    updateStatusAction: (formData: FormData) => void,
    deleteOrderAction: (formData: FormData) => void
}) {
    const searchParams = useSearchParams();
    const initialEmail = searchParams.get('email') || '';
    const [searchTerm, setSearchTerm] = useState(initialEmail);
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [selectedOrder, setSelectedOrder] = useState<any>(null);

    const filteredOrders = orders.filter(order => {
        const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
            order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.customerName.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesStatus = statusFilter === 'ALL' || order.status === statusFilter;
        
        return matchesSearch && matchesStatus;
    });

    return (
        <section className={styles.card}>
            <div className={styles.cardHeader} style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                    <h2>All Orders</h2>
                    <span className={styles.badge}>{filteredOrders.length}</span>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', flexWrap: 'wrap', gap: '1rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        {['ALL', 'PENDING', 'PROCESSING', 'COMPLETED', 'CANCELLED'].map(status => (
                            <button
                                key={status}
                                onClick={() => setStatusFilter(status)}
                                style={{
                                    padding: '0.5rem 1rem',
                                    borderRadius: '999px',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    background: statusFilter === status ? '#a855f7' : 'rgba(255,255,255,0.05)',
                                    color: 'white',
                                    fontSize: '0.75rem',
                                    fontWeight: 700,
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                }}
                            >
                                {status}
                            </button>
                        ))}
                    </div>

                    <div style={{ position: 'relative', flex: 1, maxWidth: '350px' }}>
                        <Search size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#aaa' }} />
                        <input 
                            type="text" 
                            placeholder="Search name, email, or ID..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ width: '100%', padding: '0.6rem 1rem 0.6rem 2.2rem', borderRadius: '8px', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                        />
                    </div>
                </div>
            </div>

            <div className={styles.orderList}>
                {filteredOrders.length === 0 ? (
                    <p className={styles.emptyState}>No matching orders found.</p>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '700px' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', color: '#aaa' }}>
                                    <th style={{ padding: '1rem' }}>Order ID</th>
                                    <th style={{ padding: '1rem' }}>Customer</th>
                                    <th style={{ padding: '1rem' }}>Total</th>
                                    <th style={{ padding: '1rem' }}>Status</th>
                                    <th style={{ padding: '1rem' }}>Date</th>
                                    <th style={{ padding: '1rem' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredOrders.map(order => (
                                    <tr key={order.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                        <td style={{ padding: '1rem', fontFamily: 'monospace' }}>#{order.id.slice(-6).toUpperCase()}</td>
                                        <td style={{ padding: '1rem' }}>
                                            <div>{order.customerName}</div>
                                            <div style={{ fontSize: '0.8rem', color: '#aaa' }}>{order.customerEmail}</div>
                                        </td>
                                        <td style={{ padding: '1rem', fontWeight: 'bold' }}>${order.totalAmount.toFixed(2)}</td>
                                        <td style={{ padding: '1rem' }}>
                                            <span className={`${styles.statusBadge} ${styles[order.status.toLowerCase()]}`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td style={{ padding: '1rem', color: '#aaa' }}>{new Date(order.createdAt).toLocaleDateString()}</td>
                                        <td style={{ padding: '1rem', display: 'flex', gap: '0.5rem' }}>
                                            <button 
                                                onClick={() => setSelectedOrder(order)}
                                                style={{ padding: '0.5rem', background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '4px', cursor: 'pointer', color: 'white' }}
                                                title="View Order"
                                            >
                                                <Eye size={16} />
                                            </button>
                                            <form action={(formData) => {
                                                if (confirm('Permanently delete this order?')) {
                                                    deleteOrderAction(formData);
                                                }
                                            }}>
                                                <input type="hidden" name="orderId" value={order.id} />
                                                <button 
                                                    type="submit"
                                                    style={{ padding: '0.5rem', background: 'rgba(255,50,50,0.15)', border: 'none', borderRadius: '4px', cursor: 'pointer', color: '#ff4444' }}
                                                    title="Delete Order"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </form>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Slide-out Modal */}
            {selectedOrder && (
                <>
                    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 90 }} onClick={() => setSelectedOrder(null)} />
                    <div style={{ 
                        position: 'fixed', right: 0, top: 0, bottom: 0, width: '400px', maxWidth: '100%', 
                        background: '#111', borderLeft: '1px solid rgba(255,255,255,0.1)', zIndex: 100, 
                        padding: '2rem', overflowY: 'auto', display: 'flex', flexDirection: 'column' 
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                            <h2 style={{ fontSize: '1.25rem', margin: 0 }}>Order Detail</h2>
                            <button onClick={() => setSelectedOrder(null)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
                                <X size={24} />
                            </button>
                        </div>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <h3 style={{ color: '#aaa', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Customer</h3>
                            <p style={{ margin: '0.25rem 0' }}>{selectedOrder.customerName}</p>
                            <p style={{ margin: '0.25rem 0', color: '#aaa' }}>{selectedOrder.customerEmail}</p>
                            <p style={{ margin: '0.25rem 0', color: '#aaa' }}>{selectedOrder.customerPhone || 'N/A'}</p>
                        </div>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <h3 style={{ color: '#aaa', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Shipping Address</h3>
                            <p style={{ margin: '0.25rem 0' }}>{selectedOrder.shippingAddress}</p>
                        </div>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <h3 style={{ color: '#aaa', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Payment</h3>
                            <p style={{ margin: '0.25rem 0' }}>Method: <strong>{selectedOrder.paymentMethod.name}</strong></p>
                        </div>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <h3 style={{ color: '#aaa', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Items</h3>
                            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }}>
                                {selectedOrder.items.map((item: any) => (
                                    <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                                        <span>{item.quantity}x {item.productName}</span>
                                        <span>${item.price.toFixed(2)}</span>
                                    </div>
                                ))}
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                                    <strong>Total</strong>
                                    <strong>${selectedOrder.totalAmount.toFixed(2)}</strong>
                                </div>
                            </div>
                        </div>

                        <div style={{ marginTop: 'auto', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1.5rem' }}>
                            <h3 style={{ color: '#aaa', fontSize: '0.9rem', marginBottom: '1rem' }}>Update Status</h3>
                            <form action={updateStatusAction} style={{ display: 'flex', gap: '0.5rem' }}>
                                <input type="hidden" name="orderId" value={selectedOrder.id} />
                                <select name="status" defaultValue={selectedOrder.status} className={styles.statusSelect} style={{ background: 'rgba(0,0,0,0.5)', color: 'white', padding: '0.75rem', border: '1px solid rgba(255,255,255,0.2)', flex: 1, borderRadius: '4px' }}>
                                    <option value="PENDING">Pending</option>
                                    <option value="PROCESSING">Processing</option>
                                    <option value="COMPLETED">Completed</option>
                                    <option value="CANCELLED">Cancelled</option>
                                </select>
                                <button type="submit" className={styles.updateBtn} style={{ background: 'var(--primary)', color: 'white', border: 'none', padding: '0.75rem 1rem', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                                    Save
                                </button>
                            </form>
                        </div>
                    </div>
                </>
            )}
        </section>
    );
}
