import { Button, Section, Text } from '@react-email/components';
import * as React from 'react';
import { emailTheme as t } from '../theme';

export function EmailParagraph({ children }: { children: React.ReactNode }) {
    return <Text style={paragraphStyle}>{children}</Text>;
}

export function EmailLabel({ children }: { children: React.ReactNode }) {
    return <Text style={labelStyle}>{children}</Text>;
}

export function EmailValue({ children }: { children: React.ReactNode }) {
    return <Text style={valueStyle}>{children}</Text>;
}

export function EmailCard({ children }: { children: React.ReactNode }) {
    return <Section style={cardStyle}>{children}</Section>;
}

export function EmailMessageBox({ children }: { children: React.ReactNode }) {
    return <Section style={messageBoxStyle}>{children}</Section>;
}

interface EmailButtonProps {
    href: string;
    children: React.ReactNode;
    variant?: 'primary' | 'secondary';
}

export function EmailButton({ href, children, variant = 'primary' }: EmailButtonProps) {
    const isPrimary = variant === 'primary';
    return (
        <Button
            href={href}
            style={{
                ...buttonBaseStyle,
                backgroundColor: isPrimary ? t.orchid : 'transparent',
                border: isPrimary ? 'none' : `1px solid ${t.primary}`,
                color: isPrimary ? '#ffffff' : t.primary,
            }}
        >
            {children}
        </Button>
    );
}

export function EmailButtonRow({ children }: { children: React.ReactNode }) {
    return <Section style={buttonRowStyle}>{children}</Section>;
}

export function EmailDivider() {
    return <Section style={dividerStyle} />;
}

const paragraphStyle: React.CSSProperties = {
    color: t.inkMuted,
    fontSize: '15px',
    lineHeight: '1.7',
    margin: '0 0 16px',
};

const labelStyle: React.CSSProperties = {
    color: t.primary,
    fontFamily: t.fonts.mono,
    fontSize: '10px',
    fontWeight: 500,
    letterSpacing: '2px',
    margin: '0 0 6px',
    textTransform: 'uppercase',
};

const valueStyle: React.CSSProperties = {
    color: t.ink,
    fontSize: '15px',
    fontWeight: 500,
    lineHeight: '1.5',
    margin: '0 0 16px',
};

const cardStyle: React.CSSProperties = {
    backgroundColor: t.canvas,
    border: `1px solid ${t.border}`,
    borderRadius: '12px',
    margin: '20px 0',
    padding: '20px',
};

const messageBoxStyle: React.CSSProperties = {
    backgroundColor: t.surfaceHover,
    border: `1px solid ${t.border}`,
    borderRadius: '10px',
    color: t.inkMuted,
    fontSize: '15px',
    lineHeight: '1.8',
    margin: '12px 0 0',
    padding: '18px',
    whiteSpace: 'pre-wrap',
};

const buttonBaseStyle: React.CSSProperties = {
    borderRadius: '999px',
    display: 'inline-block',
    fontSize: '13px',
    fontWeight: 600,
    letterSpacing: '0.5px',
    padding: '14px 28px',
    textDecoration: 'none',
};

const buttonRowStyle: React.CSSProperties = {
    marginTop: '28px',
    textAlign: 'center',
};

const dividerStyle: React.CSSProperties = {
    borderTop: `1px solid ${t.border}`,
    margin: '20px 0',
};
