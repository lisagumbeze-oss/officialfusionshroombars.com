'use client';

import React, { useEffect, useState } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import styles from './Toast.module.css';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info';
  onClose: () => void;
}

export default function Toast({ message, type, onClose }: ToastProps) {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true);
    }, 2700); // Start exit animation slightly before removal

    return () => clearTimeout(timer);
  }, []);

  const icons = {
    success: <CheckCircle className={styles.icon} size={20} />,
    error: <AlertCircle className={styles.icon} size={20} />,
    info: <Info className={styles.icon} size={20} />,
  };

  return (
    <div className={`${styles.toast} ${styles[type]} ${isExiting ? styles.exit : styles.enter} glass-morphism pointer-events-auto`}>
      <div className={styles.content}>
        {icons[type]}
        <span className={styles.message}>{message}</span>
      </div>
      <button onClick={onClose} className={styles.closeBtn}>
        <X size={16} />
      </button>
    </div>
  );
}
