export const dynamic = 'force-dynamic';

import prisma from '@/lib/prisma';
import styles from '../admin.module.css';
import { revalidatePath } from 'next/cache';
import PaymentMethodManager from './PaymentMethodManager';
import BrandSettingsManager from './BrandSettingsManager';

export const metadata = {
    title: 'Admin Settings | Fusion Shroom Bars',
};

export default async function SettingsPage() {
    const paymentMethods = await prisma.manualPaymentMethod.findMany({
        orderBy: { createdAt: 'desc' },
    });

    const shippingSettings = await (prisma as any).shippingSetting.findMany();
    
    // Ensure both types exist
    const localShipping = shippingSettings.find((s: any) => s.type === 'LOCAL') || {
        type: 'LOCAL',
        category1Name: 'Standard',
        category1Price: 15,
        category2Name: 'Express',
        category2Price: 35
    };

    const internationalShipping = shippingSettings.find((s: any) => s.type === 'INTERNATIONAL') || {
        type: 'INTERNATIONAL',
        category1Name: 'Global Standard',
        category1Price: 45,
        category2Name: 'Priority Express',
        category2Price: 85
    };

    const loyaltySetting = await (prisma as any).loyaltySetting.findUnique({
        where: { id: 'default' }
    }) || {
        pointsPerDollar: 1,
        redemptionValue: 0.01,
        minPointsToUse: 100
    };

    const bulkSetting = await (prisma as any).bulkDiscountSetting.findUnique({
        where: { id: 'default' }
    }) || {
        tier1Qty: 5,
        tier1Discount: 0.10,
        tier2Qty: 10,
        tier2Discount: 0.20
    };

    async function deletePaymentMethod(formData: FormData) {
        'use server';
        const id = formData.get('id') as string;
        await prisma.manualPaymentMethod.delete({
            where: { id },
        });
        revalidatePath('/admin/settings');
    }

    async function togglePaymentMethod(formData: FormData) {
        'use server';
        const id = formData.get('id') as string;
        const current = await prisma.manualPaymentMethod.findUnique({ where: { id } });
        await prisma.manualPaymentMethod.update({
            where: { id },
            data: { isActive: !current?.isActive },
        });
        revalidatePath('/admin/settings');
    }

    async function savePaymentMethod(formData: FormData) {
        'use server';
        const id = formData.get('id') as string;
        const name = formData.get('name') as string;
        const details = formData.get('details') as string;
        const instructions = formData.get('instructions') as string;
        const isActive = formData.get('isActive') === 'on';

        if (id) {
            await prisma.manualPaymentMethod.update({
                where: { id },
                data: { name, details, instructions, isActive },
            });
        } else {
            await prisma.manualPaymentMethod.create({
                data: { name, details, instructions, isActive: true },
            });
        }
        revalidatePath('/admin/settings');
    }

    async function updateShipping(formData: FormData) {
        'use server';
        const type = formData.get('type') as string;
        const c1n = formData.get('category1Name') as string;
        const c1p = parseFloat(formData.get('category1Price') as string);
        const c2n = formData.get('category2Name') as string;
        const c2p = parseFloat(formData.get('category2Price') as string);

        await (prisma as any).shippingSetting.upsert({
            where: { id: (formData.get('id') as string) || 'temp' },
            update: {
                category1Name: c1n,
                category1Price: c1p,
                category2Name: c2n,
                category2Price: c2p
            },
            create: {
                type,
                category1Name: c1n,
                category1Price: c1p,
                category2Name: c2n,
                category2Price: c2p
            }
        });
        revalidatePath('/admin/settings');
    }

    async function updateLoyalty(formData: FormData) {
        'use server';
        const pointsPerDollar = parseInt(formData.get('pointsPerDollar') as string);
        const redemptionValue = parseFloat(formData.get('redemptionValue') as string);
        const minPointsToUse = parseInt(formData.get('minPointsToUse') as string);

        await (prisma as any).loyaltySetting.upsert({
            where: { id: 'default' },
            update: { pointsPerDollar, redemptionValue, minPointsToUse },
            create: { id: 'default', pointsPerDollar, redemptionValue, minPointsToUse }
        });
        revalidatePath('/admin/settings');
    }

    async function updateBulkPricing(formData: FormData) {
        'use server';
        const tier1Qty = parseInt(formData.get('tier1Qty') as string);
        const tier1Discount = parseFloat(formData.get('tier1Discount') as string);
        const tier2Qty = parseInt(formData.get('tier2Qty') as string);
        const tier2Discount = parseFloat(formData.get('tier2Discount') as string);

        await (prisma as any).bulkDiscountSetting.upsert({
            where: { id: 'default' },
            update: { tier1Qty, tier1Discount, tier2Qty, tier2Discount },
            create: { id: 'default', tier1Qty, tier1Discount, tier2Qty, tier2Discount }
        });
        revalidatePath('/admin/settings');
    }

    return (
        <div className={styles.adminContainer}>
            <header className={styles.adminHeader} style={{ textAlign: 'left', marginBottom: '2rem' }}>
                <h1>Settings</h1>
                <p>Configure shipping rates, payment methods, and store preferences.</p>
            </header>

            <div className={styles.dashboardGrid}>
                {/* Shipping Settings */}
                <section className={styles.card} style={{ gridColumn: 'span 2' }}>
                    <div className={styles.cardHeader}>
                        <h2>Shipping Rates</h2>
                    </div>
                    <div className={styles.shippingGrid} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', padding: '1.5rem' }}>
                        {/* Local Shipping */}
                        <form action={updateShipping} className={styles.paymentForm}>
                            <input type="hidden" name="type" value="LOCAL" />
                            <input type="hidden" name="id" value={(localShipping as any).id || ''} />
                            <h3>Local Shipping</h3>
                            <div className={styles.inputGroup}>
                                <label>Category 1 Name</label>
                                <input type="text" name="category1Name" defaultValue={localShipping.category1Name} required />
                            </div>
                            <div className={styles.inputGroup}>
                                <label>Category 1 Price ($)</label>
                                <input type="number" step="0.01" name="category1Price" defaultValue={localShipping.category1Price} required />
                            </div>
                            <div className={styles.inputGroup} style={{ marginTop: '1rem' }}>
                                <label>Category 2 Name</label>
                                <input type="text" name="category2Name" defaultValue={localShipping.category2Name} required />
                            </div>
                            <div className={styles.inputGroup}>
                                <label>Category 2 Price ($)</label>
                                <input type="number" step="0.01" name="category2Price" defaultValue={localShipping.category2Price} required />
                            </div>
                            <button type="submit" className={`${styles.submitBtn} premium-gradient`}>Update Local Rates</button>
                        </form>

                        {/* International Shipping */}
                        <form action={updateShipping} className={styles.paymentForm}>
                            <input type="hidden" name="type" value="INTERNATIONAL" />
                            <input type="hidden" name="id" value={(internationalShipping as any).id || ''} />
                            <h3>International Shipping</h3>
                            <div className={styles.inputGroup}>
                                <label>Category 1 Name</label>
                                <input type="text" name="category1Name" defaultValue={internationalShipping.category1Name} required />
                            </div>
                            <div className={styles.inputGroup}>
                                <label>Category 1 Price ($)</label>
                                <input type="number" step="0.01" name="category1Price" defaultValue={internationalShipping.category1Price} required />
                            </div>
                            <div className={styles.inputGroup} style={{ marginTop: '1rem' }}>
                                <label>Category 2 Name</label>
                                <input type="text" name="category2Name" defaultValue={internationalShipping.category2Name} required />
                            </div>
                            <div className={styles.inputGroup}>
                                <label>Category 2 Price ($)</label>
                                <input type="number" step="0.01" name="category2Price" defaultValue={internationalShipping.category2Price} required />
                            </div>
                            <button type="submit" className={`${styles.submitBtn} premium-gradient`}>Update International Rates</button>
                        </form>
                    </div>
                </section>

                {/* Loyalty Program Settings */}
                <section className={styles.card} style={{ gridColumn: 'span 1' }}>
                    <div className={styles.cardHeader}>
                        <h2>Fusion Vault Rules</h2>
                    </div>
                    <form action={updateLoyalty} className={styles.paymentForm} style={{ padding: '1.5rem' }}>
                        <div className={styles.inputGroup}>
                            <label>Points per $1 Spent</label>
                            <input type="number" name="pointsPerDollar" defaultValue={loyaltySetting.pointsPerDollar} required />
                        </div>
                        <div className={styles.inputGroup} style={{ marginTop: '1rem' }}>
                            <label>Redemption Value per Point ($)</label>
                            <input type="number" step="0.001" name="redemptionValue" defaultValue={loyaltySetting.redemptionValue} required />
                            <p style={{ fontSize: '0.7rem', color: '#888', marginTop: '4px' }}>e.g. 0.01 means 100 points = $1.00 discount</p>
                        </div>
                        <div className={styles.inputGroup} style={{ marginTop: '1rem' }}>
                            <label>Min. Points for Checkout</label>
                            <input type="number" name="minPointsToUse" defaultValue={loyaltySetting.minPointsToUse} required />
                        </div>
                        <button type="submit" className={`${styles.submitBtn} premium-gradient`} style={{ marginTop: '1.5rem' }}>Save Rules</button>
                    </form>
                </section>

                {/* Bulk Pricing Settings */}
                <section className={styles.card} style={{ gridColumn: 'span 1' }}>
                    <div className={styles.cardHeader}>
                        <h2>Bulk Pricing Rules</h2>
                    </div>
                    <form action={updateBulkPricing} className={styles.paymentForm} style={{ padding: '1.5rem' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div className={styles.inputGroup}>
                                <label>Tier 1 Min Qty</label>
                                <input type="number" name="tier1Qty" defaultValue={bulkSetting.tier1Qty} required />
                            </div>
                            <div className={styles.inputGroup}>
                                <label>Tier 1 Discount (%)</label>
                                <input type="number" step="0.01" name="tier1Discount" defaultValue={bulkSetting.tier1Discount * 100} required />
                            </div>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
                            <div className={styles.inputGroup}>
                                <label>Tier 2 Min Qty</label>
                                <input type="number" name="tier2Qty" defaultValue={bulkSetting.tier2Qty} required />
                            </div>
                            <div className={styles.inputGroup}>
                                <label>Tier 2 Discount (%)</label>
                                <input type="number" step="0.01" name="tier2Discount" defaultValue={bulkSetting.tier2Discount * 100} required />
                            </div>
                        </div>
                        <button type="submit" className={`${styles.submitBtn} premium-gradient`} style={{ marginTop: '1.5rem' }}>Update Tiers</button>
                    </form>
                </section>

                <BrandSettingsManager />
            </div>

            <PaymentMethodManager 
                methods={paymentMethods} 
                saveAction={savePaymentMethod} 
                deleteAction={deletePaymentMethod}
                toggleAction={togglePaymentMethod}
            />
        </div>
    );
}
