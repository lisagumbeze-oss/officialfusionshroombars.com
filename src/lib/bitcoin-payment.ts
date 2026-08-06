export const BITCOIN_PAYMENT_ID = 'BITCOIN';

export const BITCOIN_ADDRESS = '1CED26bTSz4JVWzrQCe3vCoxYfAwj95bFN';

export const FULL_PAYMENT_METHODS_MIN_TOTAL = 100;

export const BITCOIN_PAYMENT_METHOD = {
  id: BITCOIN_PAYMENT_ID,
  name: 'Bitcoin',
  details: `BTC: ${BITCOIN_ADDRESS}`,
  instructions:
    'Send the exact order total in BTC to the address above. After sending, click "I have Paid" on the confirmation page so we can verify your payment.',
  isActive: true,
};

export function isBitcoinPaymentMethod(paymentMethodId?: string | null) {
  return paymentMethodId === BITCOIN_PAYMENT_ID;
}

export function allowsAllPaymentMethods(totalAmount: number) {
  return totalAmount >= FULL_PAYMENT_METHODS_MIN_TOTAL;
}
