import prisma from '@/lib/prisma';
import { BITCOIN_PAYMENT_METHOD } from '@/lib/bitcoin-payment';
import CheckoutForm from './CheckoutForm';
import StorefrontHeader from '@/components/storefront/StorefrontHeader';
import styles from './checkout.module.css';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Secure Checkout | Fusion Shroom Bars',
};

export default async function CheckoutPage() {
  await prisma.manualPaymentMethod.upsert({
    where: { id: BITCOIN_PAYMENT_METHOD.id },
    create: BITCOIN_PAYMENT_METHOD,
    update: {
      name: BITCOIN_PAYMENT_METHOD.name,
      details: BITCOIN_PAYMENT_METHOD.details,
      instructions: BITCOIN_PAYMENT_METHOD.instructions,
      isActive: true,
    },
  });

  const paymentMethods = await prisma.manualPaymentMethod.findMany({
    where: { isActive: true },
    orderBy: { createdAt: 'desc' },
  });

  const shippingSettings = await (prisma as any).shippingSetting.findMany();

  return (
    <div className={styles.pageWrap}>
      <StorefrontHeader
        eyebrow="Secure checkout"
        title="Complete your order"
        lead="Three quick steps — your details, delivery, and payment."
      />

      <CheckoutForm dbPaymentMethods={paymentMethods} shippingSettings={shippingSettings} />
    </div>
  );
}
