import { Text } from '@react-email/components';
import * as React from 'react';
import {
    EmailButton,
    EmailButtonRow,
    EmailCard,
    EmailLabel,
    EmailParagraph,
    EmailValue,
} from './components/EmailBlocks';
import { EmailLayout } from './components/EmailLayout';
import { emailTheme as t } from './theme';

export interface OrderItem {
    productName: string;
    quantity: number;
    price: number;
}

export interface OrderConfirmationEmailProps {
    customerName: string;
    orderId: string;
    totalAmount: number;
    shippingAddress: string;
    paymentMethodName: string;
    paymentDetails: string;
    paymentInstructions?: string | null;
    shopUrl: string;
    contactUrl: string;
}

export function OrderConfirmationEmail({
    customerName,
    orderId,
    totalAmount,
    shippingAddress,
    paymentMethodName,
    paymentDetails,
    paymentInstructions,
    shopUrl,
    contactUrl,
}: OrderConfirmationEmailProps) {
    const shortId = orderId.slice(-6).toUpperCase();

    return (
        <EmailLayout
            preview={`Order #${shortId} received — complete your payment to dispatch.`}
            eyebrow="Order Received"
            title="Welcome to the Fusion"
        >
            <EmailParagraph>Hi {customerName},</EmailParagraph>
            <EmailParagraph>
                Your order <strong style={{ color: t.ink }}>#{shortId}</strong> has been captured and is
                currently <strong style={{ color: t.warmAmber }}>awaiting payment</strong>. Once verified,
                your premium shroom bars will be dispatched discreetly.
            </EmailParagraph>

            <EmailCard>
                <EmailLabel>Payment Instructions</EmailLabel>
                <EmailValue>{paymentMethodName}</EmailValue>
                <EmailLabel>Recipient Detail</EmailLabel>
                <Text
                    style={{
                        backgroundColor: t.elevated,
                        border: `1px solid ${t.border}`,
                        borderRadius: '8px',
                        color: t.ink,
                        display: 'inline-block',
                        fontSize: '15px',
                        fontWeight: 600,
                        margin: '0 0 16px',
                        padding: '10px 14px',
                    }}
                >
                    {paymentDetails}
                </Text>
                <EmailLabel>Order Total</EmailLabel>
                <Text
                    style={{
                        color: t.primary,
                        fontSize: '26px',
                        fontWeight: 700,
                        margin: '0 0 8px',
                    }}
                >
                    ${totalAmount.toFixed(2)}
                </Text>
                {paymentInstructions ? (
                    <EmailParagraph>
                        <em>Note: {paymentInstructions}</em>
                    </EmailParagraph>
                ) : null}
            </EmailCard>

            <EmailLabel>Shipping Destination</EmailLabel>
            <EmailValue>{shippingAddress}</EmailValue>

            <EmailButtonRow>
                <EmailButton href={contactUrl}>Contact Support</EmailButton>
                {'  '}
                <EmailButton href={shopUrl} variant="secondary">
                    Continue Shopping
                </EmailButton>
            </EmailButtonRow>
        </EmailLayout>
    );
}

export interface OrderAdminAlertEmailProps {
    customerName: string;
    customerEmail: string;
    orderId: string;
    totalAmount: number;
    items: OrderItem[];
    paymentMethodName: string;
    adminUrl: string;
}

export function OrderAdminAlertEmail({
    customerName,
    customerEmail,
    orderId,
    totalAmount,
    items,
    paymentMethodName,
    adminUrl,
}: OrderAdminAlertEmailProps) {
    const shortId = orderId.slice(-6).toUpperCase();

    return (
        <EmailLayout
            preview={`New order #${shortId} — $${totalAmount.toFixed(2)}`}
            eyebrow="New Order Alert"
            title={`Order #${shortId}`}
        >
            <EmailCard>
                <EmailLabel>Customer</EmailLabel>
                <EmailValue>
                    {customerName}
                    <br />
                    <span style={{ color: t.primary }}>{customerEmail}</span>
                </EmailValue>
                <EmailLabel>Total Value</EmailLabel>
                <EmailValue>${totalAmount.toFixed(2)}</EmailValue>
                <EmailLabel>Payment Method</EmailLabel>
                <EmailValue>{paymentMethodName}</EmailValue>
            </EmailCard>

            <EmailLabel>Order Items ({items.length})</EmailLabel>
            {items.map((item, index) => (
                <Text
                    key={`${item.productName}-${index}`}
                    style={{
                        borderBottom: `1px solid ${t.border}`,
                        color: t.inkMuted,
                        fontSize: '14px',
                        margin: '0 0 8px',
                        paddingBottom: '8px',
                    }}
                >
                    <span style={{ color: t.ink }}>{item.quantity}x {item.productName}</span>
                    {' — '}${item.price.toFixed(2)}
                </Text>
            ))}

            <EmailButtonRow>
                <EmailButton href={adminUrl}>Manage Order in Admin</EmailButton>
            </EmailButtonRow>
        </EmailLayout>
    );
}
