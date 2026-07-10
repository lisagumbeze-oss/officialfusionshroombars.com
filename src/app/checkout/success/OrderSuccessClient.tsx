'use client';

import Link from 'next/link';
import { ShieldCheck, Mail, Copy, Package, CreditCard, Truck } from 'lucide-react';
import { useToast } from '@/context/ToastContext';
import styles from './success.module.css';

export default function OrderSuccessClient({ orderId }: { orderId: string | null }) {
  const { showToast } = useToast();
  const orderRef = orderId?.slice(-6).toUpperCase() || 'UNKNOWN';

  async function copyOrderRef() {
    try {
      await navigator.clipboard.writeText(`#${orderRef}`);
      showToast('Order reference copied', 'success');
    } catch {
      showToast('Could not copy reference', 'error');
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.iconRing}>
          <ShieldCheck size={32} />
        </div>
        <span className={styles.label}>Order received</span>
        <h1 className={styles.title}>Thank you</h1>
        <p className={styles.orderRef}>
          Order <strong>#{orderRef}</strong>
          <button type="button" className={styles.copyRefBtn} onClick={copyOrderRef} aria-label="Copy order reference">
            <Copy size={14} />
          </button>
        </p>
        <p className={styles.desc}>
          Follow the payment instructions from checkout to complete your transaction.
          Your order stays pending until payment is verified, then we ship discreetly.
        </p>

        <ol className={styles.timeline}>
          <li className={styles.timelineItem}>
            <span className={styles.timelineIcon}><CreditCard size={16} /></span>
            <div>
              <strong>Send payment</strong>
              <p>Use the method and details from your confirmation email.</p>
            </div>
          </li>
          <li className={styles.timelineItem}>
            <span className={styles.timelineIcon}><Package size={16} /></span>
            <div>
              <strong>We verify</strong>
              <p>Orders are processed once payment is confirmed — usually within 24 hours.</p>
            </div>
          </li>
          <li className={styles.timelineItem}>
            <span className={styles.timelineIcon}><Truck size={16} /></span>
            <div>
              <strong>Discreet delivery</strong>
              <p>Your package ships in unmarked packaging with tracking when available.</p>
            </div>
          </li>
        </ol>

        <div className={styles.actions}>
          <Link href="/" className={styles.primaryBtn}>
            Return home
          </Link>
          <Link href="/contact" className={styles.secondaryBtn}>
            <Mail size={16} />
            Questions? Contact us
          </Link>
        </div>
      </div>
    </div>
  );
}
