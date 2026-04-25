'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './cart.module.css';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';
import { Trash2, ShoppingBag, Loader2 } from 'lucide-react';

export default function CartPage() {
    const { 
        cart, 
        subtotal, 
        discountAmount, 
        bulkDiscountAmount,
        cartTotal, 
        removeFromCart, 
        updateQuantity, 
        applyCoupon, 
        appliedCoupon,
        cartCount
    } = useCart();
    const { showToast } = useToast();
    
    const [promoInput, setPromoInput] = useState('');
    const [isApplying, setIsApplying] = useState(false);

    const shipping: number = subtotal > 300 ? 0 : 15;
    const total = cartTotal + (cart.length > 0 ? shipping : 0);

    const handleApplyPromo = async () => {
        if (!promoInput.trim()) return;
        
        setIsApplying(true);
        try {
            const res = await fetch('/api/coupons/validate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code: promoInput })
            });
            
            const data = await res.json();
            
            if (res.ok) {
                applyCoupon(data.coupon);
                showToast(`Success! ${data.coupon.code} applied.`, 'success');
                setPromoInput('');
            } else {
                showToast(data.error || 'Invalid promo code', 'error');
            }
        } catch (error) {
            showToast('Failed to apply promo code', 'error');
        } finally {
            setIsApplying(false);
        }
    };

    return (
        <div className={styles.cartContainer}>
            <h1 className={styles.pageTitle}>Your Cart</h1>

            {cart.length > 0 ? (
                <div className={styles.cartLayout}>
                    {/* Left: Cart Items */}
                    <div className={styles.cartItems}>
                        <div className={styles.cartHeader}>
                            <span>Product</span>
                            <span>Quantity</span>
                            <span>Subtotal</span>
                        </div>
                        {cart.map((item) => (
                            <div key={item.id} className={styles.cartRow}>
                                <div className={styles.productCell}>
                                    <div className={styles.imageWrapper}>
                                        <Image src={item.image} alt={item.name} fill style={{ objectFit: 'cover' }} unoptimized />
                                    </div>
                                    <div>
                                        <Link href={`/shop/${item.slug}`} className={styles.productName}>{item.name}</Link>
                                        <div className={styles.productPrice}>${item.price.toFixed(2)}</div>
                                    </div>
                                </div>
                                <div className={styles.quantityCell}>
                                    <div className={styles.quantityControl}>
                                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                                        <input type="number" value={item.quantity} min={1} readOnly />
                                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                                    </div>
                                </div>
                                <div className={styles.subtotalCell}>
                                    ${(item.price * item.quantity).toFixed(2)}
                                    <button onClick={() => removeFromCart(item.id)} className={styles.removeBtn}>
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Right: Order Summary */}
                    <div className={styles.orderSummary}>
                        <h2>Order Summary</h2>
                        <div className={styles.summaryRow}>
                            <span>Subtotal</span>
                            <span>${subtotal.toFixed(2)}</span>
                        </div>

                        {bulkDiscountAmount > 0 && (
                            <div className={`${styles.summaryRow} ${styles.bulkDiscount}`}>
                                <span>Bulk Savings</span>
                                <span>-${bulkDiscountAmount.toFixed(2)}</span>
                            </div>
                        )}

                        {cartCount > 0 && cartCount < 10 && (
                            <div className={styles.tierNudge}>
                                {cartCount < 5 ? (
                                    <p>Add <strong>{5 - cartCount}</strong> more bars for <strong>10% OFF</strong></p>
                                ) : (
                                    <p>Add <strong>{10 - cartCount}</strong> more bars for <strong>20% OFF</strong></p>
                                )}
                            </div>
                        )}
                        <div className={styles.summaryRow}>
                            <span>Shipping</span>
                            <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
                        </div>
                        {shipping > 0 && (
                            <p style={{ fontSize: '0.75rem', color: '#666', marginTop: '-0.5rem' }}>
                                Free shipping on orders over $300!
                            </p>
                        )}
                        
                        <div className={styles.promoSection}>
                            <input 
                                type="text" 
                                placeholder="PROMO CODE" 
                                value={promoInput}
                                onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                                className="glass-morphism"
                                disabled={isApplying || !!appliedCoupon}
                            />
                            <button 
                                onClick={appliedCoupon ? () => applyCoupon(null) : handleApplyPromo} 
                                className={styles.promoBtn}
                                disabled={isApplying || (!promoInput.trim() && !appliedCoupon)}
                            >
                                {isApplying ? <Loader2 className="animate-spin" size={16} /> : (appliedCoupon ? 'REMOVE' : 'APPLY')}
                            </button>
                        </div>

                        {appliedCoupon && (
                            <div className={styles.appliedPromo}>
                                <span>Discount ({appliedCoupon.code})</span>
                                <span>-${discountAmount.toFixed(2)}</span>
                            </div>
                        )}

                        <div className={styles.divider}></div>
                        <div className={styles.totalRow}>
                            <span>Total</span>
                            <span>${total.toFixed(2)}</span>
                        </div>
                        <Link href="/checkout" className={`${styles.checkoutBtn} premium-gradient`}>
                            PROCEED TO CHECKOUT
                        </Link>

                        <div className={styles.secureCheckout}>
                            <span>🔒 Secure Checkout</span>
                            <div className={styles.paymentIcons}>
                                <span>BTC</span> <span>APPLE CASH</span> <span>ZELLE</span> <span>CASHAPP</span>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className={styles.emptyCart}>
                    <div className={styles.emptyIcon}>
                        <ShoppingBag size={64} />
                    </div>
                    <p>Your cart is currently empty.</p>
                    <Link href="/shop" className={styles.returnBtn}>RETURN TO SHOP</Link>
                </div>
            )}
        </div>
    );
}
