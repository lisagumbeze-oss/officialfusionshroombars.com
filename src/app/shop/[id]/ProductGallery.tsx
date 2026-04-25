'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import styles from './product.module.css';

interface ProductGalleryProps {
  mainImage: string;
  gallery: string | null;
  name: string;
  isSale: boolean;
}

export default function ProductGallery({ mainImage, gallery, name, isSale }: ProductGalleryProps) {
  const images = gallery ? [mainImage, ...JSON.parse(gallery)] : [mainImage];
  const [activeImage, setActiveImage] = useState(mainImage);

  return (
    <div className={styles.galleryWrapper}>
      <div className={styles.mainImagePlaceholder}>
        <Image 
          src={activeImage} 
          alt={name} 
          fill 
          style={{ objectFit: 'cover' }} 
          priority 
        />
        {isSale && <span className={styles.saleHeroTag}>SALE</span>}
      </div>
      
      {images.length > 1 && (
        <div className={styles.thumbnails}>
          {images.map((img, idx) => (
            <button 
              key={idx} 
              className={`${styles.thumbnail} ${activeImage === img ? styles.activeThumbnail : ''}`}
              onClick={() => setActiveImage(img)}
            >
              <Image 
                src={img} 
                alt={`${name} thumbnail ${idx + 1}`} 
                fill 
                style={{ objectFit: 'cover' }}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
