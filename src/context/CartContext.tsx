'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

import { Product } from '@/types/product';

export interface CartItem extends Product {
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  applyCoupon: (coupon: { code: string; discount: number; type: string } | null) => void;
  appliedCoupon: { code: string; discount: number; type: string } | null;
  cartCount: number;
  cartTotal: number;
  subtotal: number;
  discountAmount: number;
  bulkDiscountAmount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number; type: string } | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [settings, setSettings] = useState<any>(null);

  // Fetch settings
  useEffect(() => {
    fetch('/api/settings')
      .then(r => r.json())
      .then(setSettings)
      .catch(console.error);
  }, []);

  // Load from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('fusion-cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error("Failed to parse cart", e);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('fusion-cart', JSON.stringify(cart));
    }
  }, [cart, isLoaded]);

  const addToCart = (product: Product, quantity: number = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, { ...product, quantity }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev => prev.map(item => 
      item.id === productId ? { ...item, quantity } : item
    ));
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  const applyCoupon = (coupon: { code: string; discount: number; type: string } | null) => {
    setAppliedCoupon(coupon);
  };

  const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  
  // Tiered Bulk Pricing Logic
  let bulkDiscountAmount = 0;
  if (settings?.bulk) {
    const { tier1Qty, tier1Discount, tier2Qty, tier2Discount } = settings.bulk;
    if (cartCount >= tier2Qty) {
      bulkDiscountAmount = subtotal * tier2Discount;
    } else if (cartCount >= tier1Qty) {
      bulkDiscountAmount = subtotal * tier1Discount;
    }
  } else {
    // Fallback if settings not loaded yet
    if (cartCount >= 10) {
      bulkDiscountAmount = subtotal * 0.20;
    } else if (cartCount >= 5) {
      bulkDiscountAmount = subtotal * 0.10;
    }
  }

  let couponDiscountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.type === 'PERCENTAGE') {
      // Coupon applies to the subtotal AFTER bulk discount or just the subtotal? 
      // Usually it's stackable or applies to the subtotal. Let's make it stackable on subtotal.
      couponDiscountAmount = subtotal * (appliedCoupon.discount / 100);
    } else {
      couponDiscountAmount = appliedCoupon.discount;
    }
  }

  const discountAmount = bulkDiscountAmount + couponDiscountAmount;
  const cartTotal = Math.max(0, subtotal - discountAmount);

  return (
    <CartContext.Provider value={{ 
      cart, 
      addToCart, 
      removeFromCart, 
      updateQuantity, 
      clearCart, 
      applyCoupon,
      appliedCoupon,
      cartCount, 
      cartTotal,
      subtotal,
      discountAmount,
      bulkDiscountAmount
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
