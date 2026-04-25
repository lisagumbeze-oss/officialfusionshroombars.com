'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

interface RecentProduct {
  id: string;
  slug: string;
  name: string;
  price: number;
  image: string;
  category: string;
}

interface RecentlyViewedContextType {
  recentlyViewed: RecentProduct[];
  addProduct: (product: RecentProduct) => void;
}

const RecentlyViewedContext = createContext<RecentlyViewedContextType | undefined>(undefined);

export function RecentlyViewedProvider({ children }: { children: React.ReactNode }) {
  const [recentlyViewed, setRecentlyViewed] = useState<RecentProduct[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('fusion-recent');
    if (saved) {
      try {
        setRecentlyViewed(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse recently viewed', e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('fusion-recent', JSON.stringify(recentlyViewed));
  }, [recentlyViewed]);

  const addProduct = useCallback((product: RecentProduct) => {
    setRecentlyViewed((prev) => {
      const filtered = prev.filter((p) => p.id !== product.id);
      const updated = [product, ...filtered].slice(0, 10); // Keep last 10
      return updated;
    });
  }, []);

  return (
    <RecentlyViewedContext.Provider value={{ recentlyViewed, addProduct }}>
      {children}
    </RecentlyViewedContext.Provider>
  );
}

export function useRecentlyViewed() {
  const context = useContext(RecentlyViewedContext);
  if (context === undefined) {
    throw new Error('useRecentlyViewed must be used within a RecentlyViewedProvider');
  }
  return context;
}
