'use client';

import React, { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';
import ProductWhatsAppButton from '@/components/ProductWhatsAppButton/ProductWhatsAppButton';
import ProductStockStatus from '@/components/ProductStockStatus/ProductStockStatus';
import styles from './product.module.css';
export default function AddToCartSection({ product }: { product: any }) {
    const [quantity, setQuantity] = useState(1);
    const { addToCart } = useCart();
    const { showToast } = useToast();
    const [added, setAdded] = useState(false);

    const [isSubscribing, setIsSubscribing] = useState(false);

    const handleAddToCart = () => {
        const finalProduct = isSubscribing ? { ...product, price: product.price * 0.85 } : product;
        addToCart(finalProduct, quantity);
        showToast(`${quantity}x ${product.name} ${isSubscribing ? '(Subscribed)' : ''} added to cart!`, 'success');
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    };

    return (
        <div className={styles.purchaseFlow}>
            {product.isSubscribable && (
                <div className={styles.subOptions}>
                    <button
                        type="button"
                        className={`${styles.subOption} ${!isSubscribing ? styles.activeSub : ''}`}
                        onClick={() => setIsSubscribing(false)}
                    >
                        <div className={styles.radio} />
                        <div className={styles.subText}>
                            <span>One-time purchase</span>
                            <strong>${product.price.toFixed(2)}</strong>
                        </div>
                    </button>
                    <button
                        type="button"
                        className={`${styles.subOption} ${isSubscribing ? styles.activeSub : ''}`}
                        onClick={() => setIsSubscribing(true)}
                    >
                        <div className={styles.radio} />
                        <div className={styles.subText}>
                            <span>Subscribe & Save (15%)</span>
                            <strong>${(product.price * 0.85).toFixed(2)}</strong>
                        </div>
                    </button>
                </div>
            )}

            <ProductStockStatus stock={product.stock} align="left" className={styles.stockStatus} />

            <div className={styles.quantity}>
                <button type="button" onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
                <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                    min={1}
                />
                <button type="button" onClick={() => setQuantity(quantity + 1)}>+</button>
            </div>

            <div className={styles.ctaRow}>
                <ProductWhatsAppButton
                    product={{
                        name: product.name,
                        slug: product.slug,
                        price: product.price,
                    }}
                    variant="detail"
                    className={styles.whatsappBtn}
                />
                <button
                    type="button"
                    className={`${styles.addToCartBtn} btn-shine ${added ? styles.added : ''}`}
                    onClick={handleAddToCart}
                >
                    {added ? 'Added to cart ✓' : 'Add to cart'}
                </button>
            </div>
        </div>
    );
}
