'use client';

import React from 'react';
import { X } from 'lucide-react';
import styles from './LegalModal.module.css';

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'terms' | 'privacy' | 'refund';
}

export default function LegalModal({ isOpen, onClose, type }: LegalModalProps) {
  if (!isOpen) return null;

  const content = {
    terms: {
      title: "Terms & Conditions",
      body: (
        <>
          <p>Welcome to Fusion Shroom Bars. By accessing our website, you agree to these terms.</p>
          <h3>1. Use of Website</h3>
          <p>You must be at least 21 years of age to use this website. All products are for personal use and not for resale.</p>
          <h3>2. Intellectual Property</h3>
          <p>All content on this site, including images, text, and logos, is the property of Fusion Shroom Bars.</p>
          <h3>3. Limitation of Liability</h3>
          <p>Fusion Shroom Bars is not liable for any health effects or legal issues resulting from the use of our products. Users consume at their own risk.</p>
          <h3>4. Compliance</h3>
          <p>You agree to comply with all local laws regarding the purchase and possession of psilocybin products in your jurisdiction.</p>
        </>
      )
    },
    privacy: {
      title: "Privacy Policy",
      body: (
        <>
          <p>Your privacy is important to us. Here is how we handle your data.</p>
          <h3>1. Information Collection</h3>
          <p>We collect your name, email, and shipping address solely for the purpose of processing your orders.</p>
          <h3>2. Data Security</h3>
          <p>We use advanced encryption and secure servers to protect your information. We do not store payment details; all transactions are manual and encrypted.</p>
          <h3>3. Third Parties</h3>
          <p>We never sell or share your data with third parties for marketing purposes.</p>
          <h3>4. Cookies</h3>
          <p>We use essential cookies to maintain your shopping cart and session data.</p>
        </>
      )
    },
    refund: {
      title: "Refund Policy",
      body: (
        <>
          <p>We want you to be satisfied with your Fusion experience.</p>
          <h3>1. Returns</h3>
          <p>Due to the nature of our products, we do not accept returns. All sales are final.</p>
          <h3>2. Damaged Goods</h3>
          <p>If your order arrives damaged, please send a photo to order@officialfusionshroombars.com within 24 hours for a replacement.</p>
          <h3>3. Shipping Issues</h3>
          <p>If your package is lost in transit, we will reship your order once after verification. We are not responsible for incorrect addresses provided by the customer.</p>
        </>
      )
    }
  }[type];

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={`${styles.modal} glass-morphism`} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>{content.title}</h2>
          <button onClick={onClose} className={styles.closeBtn}><X size={24} /></button>
        </div>
        <div className={styles.body}>
          {content.body}
        </div>
        <div className={styles.footer}>
          <button onClick={onClose} className="premium-gradient">I UNDERSTAND</button>
        </div>
      </div>
    </div>
  );
}
