'use client';

import { useState, useMemo, useEffect, FormEvent } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';
import {
  ChevronLeft,
  ChevronRight,
  Loader2,
  ShieldCheck,
  Truck,
  Lock,
  Copy,
  ShoppingBag,
  Pencil,
} from 'lucide-react';
import PaymentMethodIcon from '@/components/checkout/PaymentMethodIcon';
import { allowsAllPaymentMethods, isBitcoinPaymentMethod } from '@/lib/bitcoin-payment';
import styles from './checkout.module.css';

const STEPS = [
  { id: 'details', label: 'Details' },
  { id: 'shipping', label: 'Delivery' },
  { id: 'payment', label: 'Payment' },
] as const;

interface FormState {
  country: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
}

const INITIAL_FORM: FormState = {
  country: 'United States',
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  state: '',
  zip: '',
};

export default function CheckoutForm({
  dbPaymentMethods,
  shippingSettings,
}: {
  dbPaymentMethods: any[];
  shippingSettings: any[];
}) {
  const router = useRouter();
  const {
    cart,
    cartTotal,
    clearCart,
    subtotal,
    discountAmount,
    bulkDiscountAmount,
    appliedCoupon,
  } = useCart();
  const { showToast } = useToast();

  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState('');
  const [region, setRegion] = useState<'LOCAL' | 'INTERNATIONAL'>('LOCAL');
  const [shippingOption, setShippingOption] = useState<{ id: string; name: string; price: number } | null>(null);

  const couponDiscount = Math.max(0, discountAmount - bulkDiscountAmount);
  const shippingPrice = shippingOption?.price ?? 0;
  const total = cartTotal + shippingPrice;
  const progressPct = ((step + 1) / STEPS.length) * 100;

  const currentShippingSettings = useMemo(
    () =>
      shippingSettings.find((s) => s.type === region) || {
        category1Name: 'Standard',
        category1Price: region === 'LOCAL' ? 15 : 45,
        category2Name: 'Express',
        category2Price: region === 'LOCAL' ? 35 : 85,
      },
    [shippingSettings, region]
  );

  const shippingOptions = useMemo(
    () => [
      { id: 'cat1', name: currentShippingSettings.category1Name, price: currentShippingSettings.category1Price },
      { id: 'cat2', name: currentShippingSettings.category2Name, price: currentShippingSettings.category2Price },
    ],
    [currentShippingSettings]
  );

  useEffect(() => {
    if (step === 1 && !shippingOption && shippingOptions.length > 0) {
      setShippingOption(shippingOptions[0]);
    }
  }, [step, shippingOption, shippingOptions]);

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setFieldErrors((prev) => ({ ...prev, [key]: undefined }));
    setFormError('');
  }

  function validateDetails(): boolean {
    const errors: Partial<Record<keyof FormState, string>> = {};
    if (!form.firstName.trim()) errors.firstName = 'First name is required';
    if (!form.lastName.trim()) errors.lastName = 'Last name is required';
    if (!form.email.trim()) errors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = 'Enter a valid email';
    if (!form.phone.trim()) errors.phone = 'Phone number is required';
    if (!form.address.trim()) errors.address = 'Street address is required';
    if (!form.city.trim()) errors.city = 'City is required';
    if (!form.state.trim()) errors.state = 'State / province is required';
    if (!form.zip.trim()) errors.zip = 'ZIP / postal code is required';

    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) {
      setFormError('Please complete all required fields.');
      showToast('Please fix the highlighted fields.', 'error');
      return false;
    }
    return true;
  }

  function validateShipping(): boolean {
    if (!shippingOption) {
      setFormError('Select a shipping method to continue.');
      showToast('Please select a shipping method.', 'error');
      return false;
    }
    setFormError('');
    return true;
  }

  function goToStep(target: number) {
    if (target > step) return;
    if (target === 1 && !validateDetails()) return;
    if (target === 2 && (!validateDetails() || !validateShipping())) return;
    setFormError('');
    setStep(target);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function goNext() {
    if (step === 0 && !validateDetails()) return;
    if (step === 1 && !validateShipping()) return;
    setFormError('');
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function goBack() {
    setFormError('');
    setStep((s) => Math.max(s - 1, 0));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function copyPaymentDetails(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      showToast('Payment details copied', 'success');
    } catch {
      showToast('Could not copy — select and copy manually', 'error');
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (step < STEPS.length - 1) {
      goNext();
      return;
    }

    if (!validateDetails() || !validateShipping()) return;

    if (!selectedMethod) {
      setFormError('Select a payment method.');
      showToast('Please select a payment method.', 'error');
      return;
    }

    if (total < 100 && !isBitcoinPaymentMethod(selectedMethod)) {
      setFormError('Orders under $100 must be paid with Bitcoin.');
      showToast('Orders under $100 must be paid with Bitcoin.', 'error');
      return;
    }

    setIsSubmitting(true);
    setFormError('');

    const orderData = {
      customerName: `${form.firstName} ${form.lastName}`.trim(),
      customerEmail: form.email,
      customerPhone: form.phone,
      shippingAddress: `${form.address}, ${form.city}, ${form.state} ${form.zip}, ${form.country}`,
      shippingMethod: shippingOption!.name,
      shippingPrice: shippingOption!.price,
      totalAmount: total,
      paymentMethodId: selectedMethod,
      items: cart.map((item) => ({
        productId: item.id,
        productName: item.name,
        quantity: item.quantity,
        price: item.price,
      })),
    };

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });

      if (!res.ok) {
        let errMsg = 'Failed to place order. Please try again.';
        try {
          const errData = await res.json();
          errMsg = errData.error || errMsg;
        } catch {
          /* ignore parse error */
        }
        setFormError(errMsg);
        showToast(errMsg, 'error');
        return;
      }

      let data;
      try {
        data = await res.json();
      } catch {
        setFormError('Server returned an invalid response.');
        showToast('Unexpected server response. Please contact support.', 'error');
        return;
      }

      clearCart();
      showToast('Order placed successfully!', 'success');
      router.push(`/checkout/success?orderId=${data.id}`);
    } catch (error) {
      console.error(error);
      const msg = 'Network error. Check your connection and try again.';
      setFormError(msg);
      showToast(msg, 'error');
    } finally {
      setIsSubmitting(false);
    }
  }

  const showAllPaymentMethods = allowsAllPaymentMethods(total);

  const paymentMethods = useMemo(() => {
    const bitcoin = dbPaymentMethods.find((m) => isBitcoinPaymentMethod(m.id));
    const others = dbPaymentMethods.filter((m) => !isBitcoinPaymentMethod(m.id));

    if (!showAllPaymentMethods) {
      return bitcoin ? [bitcoin] : [];
    }

    return bitcoin ? [bitcoin, ...others] : dbPaymentMethods;
  }, [dbPaymentMethods, showAllPaymentMethods]);

  useEffect(() => {
    if (paymentMethods.length === 0) {
      if (selectedMethod) setSelectedMethod('');
      return;
    }

    const selectedStillAvailable = paymentMethods.some((method) => method.id === selectedMethod);
    if (!selectedStillAvailable) {
      setSelectedMethod(paymentMethods[0].id);
    }
  }, [paymentMethods, selectedMethod]);

  const selectedPaymentInfo = paymentMethods.find((m) => m.id === selectedMethod);
  const isBitcoinSelected = isBitcoinPaymentMethod(selectedMethod);

  if (cart.length === 0) {
    return (
      <div className={styles.emptyCart}>
        <div className={styles.emptyIcon}>
          <ShoppingBag size={56} strokeWidth={1.25} />
        </div>
        <h2>Your cart is empty</h2>
        <p>Add items before checking out.</p>
        <button type="button" onClick={() => router.push('/shop')} className={styles.primaryBtn}>
          Continue shopping
        </button>
      </div>
    );
  }

  return (
    <div className={styles.checkoutPage}>
      <div className={styles.progressBar} aria-hidden>
        <div className={styles.progressFill} style={{ width: `${progressPct}%` }} />
      </div>

      <div className={styles.trustStrip}>
        <span><Lock size={14} /> Encrypted checkout</span>
        <span><ShieldCheck size={14} /> Lab-tested products</span>
        <span><Truck size={14} /> Discreet shipping</span>
      </div>

      <nav className={styles.stepper} aria-label="Checkout progress">
        {STEPS.map((s, i) => (
          <button
            key={s.id}
            type="button"
            className={`${styles.stepItem} ${i === step ? styles.stepActive : ''} ${i < step ? styles.stepDone : ''}`}
            onClick={() => goToStep(i)}
            disabled={i > step}
            aria-current={i === step ? 'step' : undefined}
          >
            <span className={styles.stepNumber}>{i < step ? '✓' : i + 1}</span>
            <span className={styles.stepLabel}>{s.label}</span>
          </button>
        ))}
      </nav>

      <div className={styles.checkoutLayout}>
        <div className={styles.formSection}>
          <form onSubmit={handleSubmit} noValidate>
            {formError && (
              <div className={styles.errorBanner} role="alert">
                {formError}
              </div>
            )}

            {step === 2 && (
              <div className={styles.reviewCard}>
                <div className={styles.reviewRow}>
                  <div>
                    <span className={styles.reviewLabel}>Ship to</span>
                    <p className={styles.reviewValue}>
                      {form.firstName} {form.lastName}<br />
                      {form.address}, {form.city}, {form.state} {form.zip}<br />
                      {form.country}
                    </p>
                  </div>
                  <button type="button" className={styles.editLink} onClick={() => goToStep(0)}>
                    <Pencil size={14} />
                    Edit
                  </button>
                </div>
                <div className={styles.reviewDivider} />
                <div className={styles.reviewRow}>
                  <div>
                    <span className={styles.reviewLabel}>Delivery</span>
                    <p className={styles.reviewValue}>
                      {shippingOption?.name ?? 'Not selected'}
                      {shippingOption ? ` · $${shippingOption.price.toFixed(2)}` : ''}
                    </p>
                  </div>
                  <button type="button" className={styles.editLink} onClick={() => goToStep(1)}>
                    <Pencil size={14} />
                    Edit
                  </button>
                </div>
              </div>
            )}

            {step === 0 && (
              <div className={styles.stepPanel}>
                <h2 className={styles.sectionTitle}>Contact &amp; shipping address</h2>
                <div className={styles.inputGroup}>
                  <label htmlFor="country">Country / region *</label>
                  <select
                    id="country"
                    name="country"
                    className={styles.select}
                    autoComplete="country-name"
                    value={form.country}
                    onChange={(e) => {
                      updateField('country', e.target.value);
                      setRegion(e.target.value === 'United States' ? 'LOCAL' : 'INTERNATIONAL');
                      setShippingOption(null);
                    }}
                  >
                    <option value="United States">United States</option>
                    <option value="Canada">Canada</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="Australia">Australia</option>
                    <option value="Germany">Germany</option>
                    <option value="France">France</option>
                    <option value="Italy">Italy</option>
                    <option value="Spain">Spain</option>
                    <option value="Netherlands">Netherlands</option>
                    <option value="Sweden">Sweden</option>
                    <option value="Switzerland">Switzerland</option>
                    <option value="New Zealand">New Zealand</option>
                    <option value="Japan">Japan</option>
                    <option value="Brazil">Brazil</option>
                    <option value="Mexico">Mexico</option>
                    <option value="International">Other (International)</option>
                  </select>
                </div>
                <div className={styles.inputRow}>
                  <div className={styles.inputGroup}>
                    <label htmlFor="firstName">First name *</label>
                    <input
                      id="firstName"
                      name="firstName"
                      autoComplete="given-name"
                      value={form.firstName}
                      onChange={(e) => updateField('firstName', e.target.value)}
                      className={fieldErrors.firstName ? styles.inputError : ''}
                    />
                    {fieldErrors.firstName && <span className={styles.fieldError}>{fieldErrors.firstName}</span>}
                  </div>
                  <div className={styles.inputGroup}>
                    <label htmlFor="lastName">Last name *</label>
                    <input
                      id="lastName"
                      name="lastName"
                      autoComplete="family-name"
                      value={form.lastName}
                      onChange={(e) => updateField('lastName', e.target.value)}
                      className={fieldErrors.lastName ? styles.inputError : ''}
                    />
                    {fieldErrors.lastName && <span className={styles.fieldError}>{fieldErrors.lastName}</span>}
                  </div>
                </div>
                <div className={styles.inputGroup}>
                  <label htmlFor="email">Email *</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={form.email}
                    onChange={(e) => updateField('email', e.target.value)}
                    className={fieldErrors.email ? styles.inputError : ''}
                  />
                  {fieldErrors.email && <span className={styles.fieldError}>{fieldErrors.email}</span>}
                </div>
                <div className={styles.inputGroup}>
                  <label htmlFor="phone">Phone *</label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    required
                    value={form.phone}
                    onChange={(e) => updateField('phone', e.target.value)}
                    className={fieldErrors.phone ? styles.inputError : ''}
                  />
                  {fieldErrors.phone && <span className={styles.fieldError}>{fieldErrors.phone}</span>}
                </div>
                <div className={styles.inputGroup}>
                  <label htmlFor="address">Street address *</label>
                  <input
                    id="address"
                    name="address"
                    autoComplete="street-address"
                    value={form.address}
                    onChange={(e) => updateField('address', e.target.value)}
                    className={fieldErrors.address ? styles.inputError : ''}
                  />
                  {fieldErrors.address && <span className={styles.fieldError}>{fieldErrors.address}</span>}
                </div>
                <div className={styles.inputRow}>
                  <div className={styles.inputGroup}>
                    <label htmlFor="city">City *</label>
                    <input
                      id="city"
                      name="city"
                      autoComplete="address-level2"
                      value={form.city}
                      onChange={(e) => updateField('city', e.target.value)}
                      className={fieldErrors.city ? styles.inputError : ''}
                    />
                    {fieldErrors.city && <span className={styles.fieldError}>{fieldErrors.city}</span>}
                  </div>
                  <div className={styles.inputGroup}>
                    <label htmlFor="state">State *</label>
                    <input
                      id="state"
                      name="state"
                      autoComplete="address-level1"
                      value={form.state}
                      onChange={(e) => updateField('state', e.target.value)}
                      className={fieldErrors.state ? styles.inputError : ''}
                    />
                    {fieldErrors.state && <span className={styles.fieldError}>{fieldErrors.state}</span>}
                  </div>
                  <div className={styles.inputGroup}>
                    <label htmlFor="zip">ZIP *</label>
                    <input
                      id="zip"
                      name="zip"
                      autoComplete="postal-code"
                      value={form.zip}
                      onChange={(e) => updateField('zip', e.target.value)}
                      className={fieldErrors.zip ? styles.inputError : ''}
                    />
                    {fieldErrors.zip && <span className={styles.fieldError}>{fieldErrors.zip}</span>}
                  </div>
                </div>
              </div>
            )}

            {step === 1 && (
              <div className={styles.stepPanel}>
                <h2 className={styles.sectionTitle}>Delivery method</h2>
                <p className={styles.sectionHint}>
                  Shipping to <strong>{form.country}</strong>
                  {form.city ? ` · ${form.city}` : ''}
                </p>
                <div className={styles.shippingOptions}>
                  {shippingOptions.map((option) => (
                    <label
                      key={option.id}
                      className={`${styles.shippingOption} ${shippingOption?.id === option.id ? styles.selected : ''}`}
                    >
                      <input
                        type="radio"
                        name="shipping"
                        checked={shippingOption?.id === option.id}
                        onChange={() => setShippingOption(option)}
                      />
                      <div className={styles.shippingInfo}>
                        <span className={styles.shippingName}>{option.name}</span>
                        <span className={styles.shippingPrice}>${option.price.toFixed(2)}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {step === 2 && (
              <div className={styles.stepPanel}>
                <h2 className={styles.sectionTitle}>Payment method</h2>
                {!showAllPaymentMethods && (
                  <p className={styles.sectionHint}>
                    Orders under <strong>$100</strong> are available with Bitcoin only.
                  </p>
                )}
                {paymentMethods.length === 0 ? (
                  <p className={styles.errorText}>No payment methods available. Please contact support.</p>
                ) : (
                  <div className={styles.methodOptions}>
                    {paymentMethods.map((method) => (
                        <label
                          key={method.id}
                          className={`${styles.methodOption} ${selectedMethod === method.id ? styles.selected : ''}`}
                        >
                          <input
                            type="radio"
                            name="paymentMethod"
                            value={method.id}
                            checked={selectedMethod === method.id}
                            onChange={(e) => setSelectedMethod(e.target.value)}
                          />
                          <PaymentMethodIcon id={method.id} name={method.name} />
                          <div className={styles.methodInfo}>
                            <strong>{method.name}</strong>
                          </div>
                        </label>
                      ))}
                  </div>
                )}

                {selectedPaymentInfo && (
                  <div className={styles.paymentInstructions}>
                    <div className={styles.paymentInstructionsHeader}>
                      <p><strong>Pay to:</strong></p>
                      <button
                        type="button"
                        className={styles.copyBtn}
                        onClick={() => copyPaymentDetails(selectedPaymentInfo.details.replace(/^BTC:\s*/i, ''))}
                      >
                        <Copy size={14} />
                        Copy
                      </button>
                    </div>
                    <p className={isBitcoinSelected ? styles.bitcoinAddress : undefined}>
                      {selectedPaymentInfo.details}
                    </p>
                    {isBitcoinSelected && (
                      <p className={styles.paymentTotalHint}>
                        Order total: <strong>${total.toFixed(2)} USD</strong>
                      </p>
                    )}
                    {selectedPaymentInfo.instructions && <p>{selectedPaymentInfo.instructions}</p>}
                    <p className={styles.noticeText}>
                      {isBitcoinSelected
                        ? 'Place your order first, send BTC to the address above, then click "I have Paid" on the confirmation page.'
                        : 'Place your order first, then send payment. We process orders once payment is confirmed.'}
                    </p>
                  </div>
                )}

              </div>
            )}

            <div className={styles.formNav}>
              {step > 0 && (
                <button type="button" className={styles.backBtn} onClick={goBack} disabled={isSubmitting}>
                  <ChevronLeft size={18} />
                  Back
                </button>
              )}
              <button
                type="submit"
                className={styles.primaryBtn}
                disabled={isSubmitting || (step === 2 && (!selectedMethod || !shippingOption))}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={18} className={styles.spinner} />
                    Processing…
                  </>
                ) : step < STEPS.length - 1 ? (
                  <>
                    Continue
                    <ChevronRight size={18} />
                  </>
                ) : (
                  `Place order · $${total.toFixed(2)}`
                )}
              </button>
            </div>
          </form>
        </div>

        <aside className={styles.summarySection}>
          <div className={styles.orderSummary}>
            <div className={styles.summaryHeader}>
              <h2 className={styles.summaryTitle}>Order summary</h2>
              <Link href="/cart" className={styles.editCartLink}>Edit cart</Link>
            </div>
            <div className={styles.summaryItems}>
              {cart.map((item) => (
                <div key={item.id} className={styles.summaryItem}>
                  <div className={styles.summaryThumb}>
                    <Image
                      src={item.image || '/images/hero-fusion.png'}
                      alt=""
                      fill
                      sizes="48px"
                      style={{ objectFit: 'cover' }}
                      unoptimized
                    />
                    <span className={styles.summaryQty}>{item.quantity}</span>
                  </div>
                  <span className={styles.summaryItemName}>{item.name}</span>
                  <span className={styles.summaryItemPrice}>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className={styles.summarySeparator} />
              <div className={styles.summaryRow}>
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              {bulkDiscountAmount > 0 && (
                <div className={`${styles.summaryRow} ${styles.discountRow}`}>
                  <span>Bulk savings</span>
                  <span>-${bulkDiscountAmount.toFixed(2)}</span>
                </div>
              )}
              {appliedCoupon && couponDiscount > 0 && (
                <div className={`${styles.summaryRow} ${styles.discountRow}`}>
                  <span>Promo ({appliedCoupon.code})</span>
                  <span>-${couponDiscount.toFixed(2)}</span>
                </div>
              )}
              <div className={styles.summaryRow}>
                <span>Shipping</span>
                <span>{shippingOption ? `$${shippingOption.price.toFixed(2)}` : '—'}</span>
              </div>
              <div className={`${styles.summaryRow} ${styles.totalRow}`}>
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {!showAllPaymentMethods && (
            <div className={styles.minimumOrderWarning} role="status">
              <p>Orders under <strong>$100</strong> checkout with Bitcoin only. All payment methods unlock at $100+.</p>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
