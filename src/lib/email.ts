import { render } from '@react-email/render';
import type { ReactElement } from 'react';
import { Resend } from 'resend';

export const SITE_URL =
    process.env.NEXT_PUBLIC_BASE_URL || 'https://officialfusionshroombars.com';

export const FROM_ORDERS = 'Fusion Shroom Bars <order@officialfusionshroombars.com>';
export const FROM_SYSTEM = 'Fusion System <order@officialfusionshroombars.com>';
export const FROM_CONTACT = 'Fusion Contact <order@officialfusionshroombars.com>';
export const ORDER_EMAIL = 'order@officialfusionshroombars.com';

export function getAdminEmail() {
    return process.env.ADMIN_EMAIL || ORDER_EMAIL;
}

export function getResend() {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) return null;
    return new Resend(apiKey);
}

export function isDummyResendKey(apiKey?: string) {
    return apiKey?.startsWith('re_123');
}

export function siteUrl(path = '') {
    const base = SITE_URL.replace(/\/$/, '');
    if (!path) return base;
    return `${base}${path.startsWith('/') ? path : `/${path}`}`;
}

export async function renderEmail(component: ReactElement) {
    return render(component);
}

export async function sendEmail(options: {
    from: string;
    to: string | string[];
    subject: string;
    html: string;
    replyTo?: string;
}) {
    const resend = getResend();
    if (!resend) return { skipped: true as const };

    const apiKey = process.env.RESEND_API_KEY;
    if (isDummyResendKey(apiKey)) {
        return { skipped: true as const, dummy: true as const };
    }

    const { error } = await resend.emails.send(options);
    if (error) throw error;
    return { success: true as const };
}

export function escapeHtml(text: string) {
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}
