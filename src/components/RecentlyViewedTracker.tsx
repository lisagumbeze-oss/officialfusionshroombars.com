'use client';

import React, { useEffect } from 'react';
import { useRecentlyViewed } from '@/context/RecentlyViewedContext';

interface TrackerProps {
  product: {
    id: string;
    slug: string;
    name: string;
    price: number;
    image: string;
    category: string;
  };
}

export default function RecentlyViewedTracker({ product }: TrackerProps) {
  const { addProduct } = useRecentlyViewed();

  useEffect(() => {
    if (product) {
      addProduct(product);
    }
  }, [product, addProduct]);

  return null;
}
