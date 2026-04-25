'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

interface WishlistItem {
  id: string;
  slug: string;
  name: string;
  price: number;
  image: string;
  category: string;
}

interface WishlistContextType {
  wishlist: WishlistItem[];
  addToWishlist: (item: WishlistItem) => void;
  removeFromWishlist: (id: string) => void;
  isInWishlist: (id: string) => boolean;
  toggleWishlist: (item: WishlistItem) => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('fusion-wishlist');
    if (saved) {
      try {
        setWishlist(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse wishlist', e);
      }
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('fusion-wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const addToWishlist = useCallback((item: WishlistItem) => {
    setWishlist((prev) => {
      if (prev.some((i) => i.id === item.id)) return prev;
      return [...prev, item];
    });
  }, []);

  const removeFromWishlist = useCallback((id: string) => {
    setWishlist((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const isInWishlist = useCallback((id: string) => {
    return wishlist.some((i) => i.id === id);
  }, [wishlist]);

  const toggleWishlist = useCallback((item: WishlistItem) => {
    setWishlist((prev) => {
      const exists = prev.some((i) => i.id === item.id);
      if (exists) {
        return prev.filter((i) => i.id !== item.id);
      }
      return [...prev, item];
    });
  }, []);

  return (
    <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist, isInWishlist, toggleWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}
