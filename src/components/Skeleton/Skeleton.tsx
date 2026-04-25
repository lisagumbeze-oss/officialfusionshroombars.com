import React from 'react';
import styles from './Skeleton.module.css';

interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  borderRadius?: string | number;
  variant?: 'text' | 'rect' | 'circle';
}

export default function Skeleton({ 
  className = '', 
  width, 
  height, 
  borderRadius,
  variant = 'rect' 
}: SkeletonProps) {
  const style: React.CSSProperties = {
    width,
    height,
    borderRadius: borderRadius || (variant === 'circle' ? '50%' : '8px'),
  };

  return (
    <div 
      className={`${styles.skeleton} ${styles[variant]} ${className}`} 
      style={style}
    />
  );
}
