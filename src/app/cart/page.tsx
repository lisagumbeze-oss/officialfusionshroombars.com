'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './cart.module.css';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';
import { Reveal } from '@/components/Reveal';
import PaymentMethodIcon from '@/components/checkout/PaymentMethodIcon';
import { Trash2, ShoppingBag, Loader2, ArrowRight, CircleHelp, BookOpen } from 'lucide-react';

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
        cartCount,
    } = useCart();
    const { showToast } = useToast();

    const [promoInput, setPromoInput] = useState('');
    const [isApplying, setIsApplying] = useState(false);

    const shipping: number = subtotal > 300 ? 0 : 15;
    const total = cartTotal + (cart.length > 0 ? shipping : 0);
    const freeShippingGap = subtotal > 0 && subtotal < 300 ? 300 - subtotal : 0;

    const handleApplyPromo = async () => {
        if (!promoInput.trim()) return;

        setIsApplying(true);
        try {
            const res = await fetch('/api/coupons/validate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code: promoInput }),
            });

            const data = await res.json();

            if (res.ok) {
                applyCoupon(data.coupon);
                showToast(`Success! ${data.coupon.code} applied.`, 'success');
                setPromoInput('');
            } else {
                showToast(data.error || 'Invalid promo code', 'error');
            }
        } catch {
            showToast('Failed to apply promo code', 'error');
        } finally {
            setIsApplying(false);
        }
    };

    const heroStats = cart.length > 0
        ? [
              { value: String(cartCount), label: cartCount === 1 ? 'Item' : 'Items' },
              { value: `$${subtotal.toFixed(0)}`, label: 'Subtotal' },
              { value: shipping === 0 ? 'Free' : `$${freeShippingGap.toFixed(0)}`, label: shipping === 0 ? 'Shipping' : 'To free ship' },
          ]
        : [
              { value: '0', label: 'Items' },
              { value: '48h', label: 'Dispatch' },
              { value: '100%', label: 'Secure' },
          ];

    return (
        <div className={styles.cartPage}>
            {/* Editorial Hero */}
            <section className={styles.editorialHero}>
                <div className={`grain-overlay ${styles.heroGrain}`} aria-hidden />
                <div className={styles.heroOrbit} aria-hidden />

                <div className={styles.heroInner}>
                    <Reveal>
                        <span className={styles.heroTag}>Cart</span>
                        <h1 className={styles.heroTitle}>
                            Your<br /><em>cart</em>
                        </h1>
                    </Reveal>
                    <Reveal delay={0.15}>
                        <p className={styles.heroDesc}>
                            {cart.length > 0
                                ? `${cartCount} item${cartCount === 1 ? '' : 's'} ready for checkout — review your order below.`
                                : 'Your cart is empty. Explore our collection of lab-tested psilocybin edibles.'}
                        </p>
                    </Reveal>
                    <Reveal delay={0.25}>
                        <div className={styles.heroStats}>
                            {heroStats.map((stat) => (
                                <div key={stat.label} className={styles.heroStat}>
                                    <strong>{stat.value}</strong>
                                    <span>{stat.label}</span>
                                </div>
                            ))}
                        </div>
                    </Reveal>
                    {cart.length === 0 && (
                        <Reveal delay={0.35}>
                            <Link href="/shop" className={`${styles.heroCta} btn-shine`}>
                                Explore collection
                                <ArrowRight size={18} />
                            </Link>
                        </Reveal>
                    )}
                </div>
            </section>

            {/* Marquee */}
            <div className={styles.marqueeContainer}>
                <div className={styles.marqueeContent}>
                    <span>Secure checkout</span> • <span>Discreet shipping</span> • <span>Lab tested</span> • <span>Bulk savings</span> •
                    <span>Secure checkout</span> • <span>Discreet shipping</span> • <span>Lab tested</span> • <span>Bulk savings</span> •
                </div>
            </div>

            <div className={styles.cartContainer}>
                {cart.length > 0 ? (
                    <div className={styles.cartLayout}>
                        <Reveal>
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
                                                <Image
                                                    src={item.image}
                                                    alt={item.name}
                                                    fill
                                                    style={{ objectFit: 'cover' }}
                                                    unoptimized
                                                />
                                            </div>
                                            <div>
                                                <Link href={`/shop/${item.slug}`} className={styles.productName}>
                                                    {item.name}
                                                </Link>
                                                <div className={styles.productPrice}>
                                                    ${item.price.toFixed(2)}
                                                </div>
                                            </div>
                                        </div>
                                        <div className={styles.quantityCell}>
                                            <div className={styles.quantityControl}>
                                                <button
                                                    type="button"
                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                    aria-label="Decrease quantity"
                                                >
                                                    −
                                                </button>
                                                <input
                                                    type="number"
                                                    value={item.quantity}
                                                    min={1}
                                                    readOnly
                                                    aria-label="Quantity"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    aria-label="Increase quantity"
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>
                                        <div className={styles.subtotalCell}>
                                            ${(item.price * item.quantity).toFixed(2)}
                                            <button
                                                type="button"
                                                onClick={() => removeFromCart(item.id)}
                                                className={styles.removeBtn}
                                                aria-label={`Remove ${item.name}`}
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Reveal>

                        <Reveal delay={0.15}>
                            <div className={styles.orderSummary}>
                                <h2>Order summary</h2>
                                <div className={styles.summaryRow}>
                                    <span>Subtotal</span>
                                    <span>${subtotal.toFixed(2)}</span>
                                </div>

                                {bulkDiscountAmount > 0 && (
                                    <div className={`${styles.summaryRow} ${styles.bulkDiscount}`}>
                                        <span>Bulk savings</span>
                                        <span>−${bulkDiscountAmount.toFixed(2)}</span>
                                    </div>
                                )}

                                {cartCount > 0 && cartCount < 10 && (
                                    <div className={styles.tierNudge}>
                                        {cartCount < 5 ? (
                                            <p>
                                                Add <strong>{5 - cartCount}</strong> more bars for{' '}
                                                <strong>10% off</strong>
                                            </p>
                                        ) : (
                                            <p>
                                                Add <strong>{10 - cartCount}</strong> more bars for{' '}
                                                <strong>20% off</strong>
                                            </p>
                                        )}
                                    </div>
                                )}

                                <div className={styles.summaryRow}>
                                    <span>Shipping</span>
                                    <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
                                </div>
                                {shipping > 0 && (
                                    <p className={styles.shippingNote}>
                                        Add ${freeShippingGap.toFixed(2)} more for free shipping
                                    </p>
                                )}

                                <div className={styles.promoSection}>
                                    <input
                                        type="text"
                                        placeholder="Promo code"
                                        value={promoInput}
                                        onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                                        disabled={isApplying || !!appliedCoupon}
                                        aria-label="Promo code"
                                    />
                                    <button
                                        type="button"
                                        onClick={appliedCoupon ? () => applyCoupon(null) : handleApplyPromo}
                                        className={styles.promoBtn}
                                        disabled={isApplying || (!promoInput.trim() && !appliedCoupon)}
                                    >
                                        {isApplying ? (
                                            <Loader2 className="animate-spin" size={16} />
                                        ) : appliedCoupon ? (
                                            'Remove'
                                        ) : (
                                            'Apply'
                                        )}
                                    </button>
                                </div>

                                {appliedCoupon && (
                                    <div className={styles.appliedPromo}>
                                        <span>Discount ({appliedCoupon.code})</span>
                                        <span>−${discountAmount.toFixed(2)}</span>
                                    </div>
                                )}

                                <div className={styles.divider} />
                                <div className={styles.totalRow}>
                                    <span>Total</span>
                                    <span>${total.toFixed(2)}</span>
                                </div>
                                <Link href="/checkout" className={`${styles.checkoutBtn} btn-shine`}>
                                    Proceed to checkout
                                    <ArrowRight size={18} />
                                </Link>

                                <div className={styles.secureCheckout}>
                                    <span>Secure checkout</span>
                                    <div className={styles.paymentIcons}>
                                        <PaymentMethodIcon id="bitcoin" name="Bitcoin" size="sm" />
                                        <PaymentMethodIcon id="cashapp" name="Cash App" size="sm" />
                                        <PaymentMethodIcon id="zelle" name="Zelle" size="sm" />
                                        <PaymentMethodIcon id="venmo" name="Venmo" size="sm" />
                                    </div>
                                </div>
                            </div>
                        </Reveal>
                    </div>
                ) : (
                    <Reveal>
                        <div className={styles.emptyCart}>
                            <div className={styles.emptyIcon}>
                                <ShoppingBag size={56} strokeWidth={1.25} />
                            </div>
                            <h2>Nothing here yet</h2>
                            <p>Your cart is currently empty. Discover our premium collection below.</p>
                            <Link href="/shop" className={`${styles.heroCta} btn-shine`}>
                                Return to shop
                                <ArrowRight size={18} />
                            </Link>
                            <div className={styles.emptyLinks}>
                                <Link href="/faq" className={styles.emptyLink}>
                                    <CircleHelp size={16} />
                                    FAQ
                                </Link>
                                <Link href="/blog" className={styles.emptyLink}>
                                    <BookOpen size={16} />
                                    Journal
                                </Link>
                            </div>
                        </div>
                    </Reveal>
                )}
            </div>
        </div>
    );
}
