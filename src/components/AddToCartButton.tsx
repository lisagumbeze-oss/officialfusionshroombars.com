'use client';

import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';
import { useState } from 'react';

export default function AddToCartButton({ 
    product, 
    className = "", 
    iconOnly = false 
}: { 
    product: any, 
    className?: string,
    iconOnly?: boolean
}) {
    const { addToCart } = useCart();
    const { showToast } = useToast();
    const [added, setAdded] = useState(false);

    const handleAdd = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        addToCart(product);
        showToast(`${product.name} added to cart!`, 'success');
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    };

    return (
        <button 
            onClick={handleAdd}
            className={`${className} ${added ? 'added' : ''}`}
            disabled={added}
        >
            {added ? (
                <span>✓ ADDED</span>
            ) : (
                iconOnly ? <span>🛒</span> : <span>ADD TO CART</span>
            )}
        </button>
    );
}
