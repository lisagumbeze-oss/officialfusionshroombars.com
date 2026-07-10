'use client';

import {
  Bitcoin,
  Wallet,
  CreditCard,
  Banknote,
  type LucideIcon,
} from 'lucide-react';
import styles from './PaymentMethodIcon.module.css';

type PaymentIconKey =
  | 'crypto'
  | 'cashapp'
  | 'zelle'
  | 'venmo'
  | 'paypal'
  | 'apple'
  | 'bank'
  | 'default';

function resolveIconKey(id: string, name: string): PaymentIconKey {
  const haystack = `${id} ${name}`.toLowerCase();
  if (haystack.includes('crypto') || haystack.includes('bitcoin') || haystack.includes('btc') || haystack.includes('eth') || haystack.includes('plisio')) {
    return 'crypto';
  }
  if (haystack.includes('cashapp') || haystack.includes('cash app')) return 'cashapp';
  if (haystack.includes('zelle')) return 'zelle';
  if (haystack.includes('venmo')) return 'venmo';
  if (haystack.includes('paypal')) return 'paypal';
  if (haystack.includes('apple')) return 'apple';
  if (haystack.includes('bank') || haystack.includes('wire') || haystack.includes('transfer')) return 'bank';
  return 'default';
}

const ICON_MAP: Record<PaymentIconKey, LucideIcon> = {
  crypto: Bitcoin,
  cashapp: Banknote,
  zelle: Wallet,
  venmo: Wallet,
  paypal: CreditCard,
  apple: CreditCard,
  bank: Banknote,
  default: CreditCard,
};

const LABEL_MAP: Record<PaymentIconKey, string> = {
  crypto: 'Crypto',
  cashapp: 'CA',
  zelle: 'Z',
  venmo: 'V',
  paypal: 'PP',
  apple: 'AP',
  bank: 'BNK',
  default: 'Pay',
};

interface PaymentMethodIconProps {
  id: string;
  name: string;
  size?: 'sm' | 'md';
}

export default function PaymentMethodIcon({ id, name, size = 'md' }: PaymentMethodIconProps) {
  const key = resolveIconKey(id, name);
  const Icon = ICON_MAP[key];
  const showBadge = ['cashapp', 'zelle', 'venmo', 'paypal'].includes(key);

  return (
    <span
      className={`${styles.iconWrap} ${styles[key]} ${styles[size]}`}
      aria-hidden
    >
      {showBadge ? (
        <span className={styles.badge}>{LABEL_MAP[key]}</span>
      ) : (
        <Icon size={size === 'sm' ? 18 : 22} strokeWidth={1.75} />
      )}
    </span>
  );
}

export function CryptoIcons() {
  return (
    <span className={styles.cryptoRow} aria-label="Bitcoin, Ethereum, Litecoin, USDT accepted">
      {['BTC', 'ETH', 'LTC', 'USDT'].map((coin) => (
        <span key={coin} className={styles.coinBadge}>{coin}</span>
      ))}
    </span>
  );
}
