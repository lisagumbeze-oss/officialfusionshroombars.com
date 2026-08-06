'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ShieldCheck, Mail, Copy, Package, CreditCard, Truck, Loader2, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/context/ToastContext';
import { isBitcoinPaymentMethod } from '@/lib/bitcoin-payment';
import styles from './success.module.css';

interface PaymentMethodInfo {
  id: string;
  name: string;
  details: string;
  instructions?: string | null;
}

interface OrderSuccessClientProps {
  orderId: string | null;
  paymentMethod?: PaymentMethodInfo | null;
  totalAmount?: number;
  status?: string;
}

export default function OrderSuccessClient({
  orderId,
  paymentMethod,
  totalAmount,
  status: initialStatus,
}: OrderSuccessClientProps) {
  const { showToast } = useToast();
  const [status, setStatus] = useState(initialStatus || 'PENDING');
  const [isSubmittingPaid, setIsSubmittingPaid] = useState(false);
  const orderRef = orderId?.slice(-6).toUpperCase() || 'UNKNOWN';
  const isBitcoin = isBitcoinPaymentMethod(paymentMethod?.id);
  const paymentSubmitted = status !== 'PENDING';

  async function copyText(text: string, label: string) {
    try {
      await navigator.clipboard.writeText(text);
      showToast(`${label} copied`, 'success');
    } catch {
      showToast('Could not copy — select and copy manually', 'error');
    }
  }

  async function handleMarkPaid() {
    if (!orderId || paymentSubmitted) return;

    setIsSubmittingPaid(true);
    try {
      const res = await fetch(`/api/orders/${orderId}/mark-paid`, { method: 'POST' });
      const data = await res.json();

      if (!res.ok) {
        showToast(data.error || 'Could not submit payment confirmation.', 'error');
        return;
      }

      setStatus(data.status || 'PROCESSING');
      showToast('Thanks! We\'ll verify your payment shortly.', 'success');
    } catch {
      showToast('Network error. Please try again or contact support.', 'error');
    } finally {
      setIsSubmittingPaid(false);
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
          <button type="button" className={styles.copyRefBtn} onClick={() => copyText(`#${orderRef}`, 'Order reference')} aria-label="Copy order reference">
            <Copy size={14} />
          </button>
        </p>
        <p className={styles.desc}>
          {isBitcoin
            ? 'Send your payment to the Bitcoin address below, then click "I have Paid" so we can verify and ship.'
            : 'Follow the payment instructions from checkout to complete your transaction. Your order stays pending until payment is verified, then we ship discreetly.'}
        </p>

        {isBitcoin && paymentMethod && (
          <div className={styles.paymentCard}>
            <span className={styles.paymentLabel}>Send payment to</span>
            <p className={styles.bitcoinAddress}>{paymentMethod.details}</p>
            <button
              type="button"
              className={styles.copyAddressBtn}
              onClick={() => copyText(paymentMethod.details.replace(/^BTC:\s*/i, ''), 'Bitcoin address')}
            >
              <Copy size={14} />
              Copy address
            </button>
            {typeof totalAmount === 'number' && (
              <p className={styles.paymentTotal}>
                Amount due: <strong>${totalAmount.toFixed(2)} USD</strong>
              </p>
            )}
            {paymentMethod.instructions && (
              <p className={styles.paymentNote}>{paymentMethod.instructions}</p>
            )}

            {paymentSubmitted ? (
              <div className={styles.paidConfirmed} role="status">
                <CheckCircle2 size={18} />
                Payment submitted — we&apos;ll verify shortly
              </div>
            ) : (
              <button
                type="button"
                className={styles.paidBtn}
                onClick={handleMarkPaid}
                disabled={isSubmittingPaid || !orderId}
              >
                {isSubmittingPaid ? (
                  <>
                    <Loader2 size={18} className={styles.spinner} />
                    Submitting…
                  </>
                ) : (
                  'I have Paid'
                )}
              </button>
            )}
          </div>
        )}

        <ol className={styles.timeline}>
          <li className={styles.timelineItem}>
            <span className={styles.timelineIcon}><CreditCard size={16} /></span>
            <div>
              <strong>Send payment</strong>
              <p>{isBitcoin ? 'Transfer BTC to the address above for the order total.' : 'Use the method and details from your confirmation email.'}</p>
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
