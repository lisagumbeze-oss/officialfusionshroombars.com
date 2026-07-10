import {
    Body,
    Container,
    Head,
    Heading,
    Hr,
    Html,
    Link,
    Preview,
    Section,
    Text,
} from '@react-email/components';
import * as React from 'react';
import { emailTheme as t } from '../theme';

interface EmailLayoutProps {
    preview: string;
    eyebrow?: string;
    title: string;
    children: React.ReactNode;
}

export function EmailLayout({ preview, eyebrow, title, children }: EmailLayoutProps) {
    return (
        <Html>
            <Head>
                <link
                    href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=IBM+Plex+Mono:wght@500&family=Outfit:wght@400;500;600;700&display=swap"
                    rel="stylesheet"
                />
            </Head>
            <Preview>{preview}</Preview>
            <Body style={bodyStyle}>
                <Container style={containerStyle}>
                    <Section style={headerStyle}>
                        {eyebrow ? <Text style={eyebrowStyle}>{eyebrow}</Text> : null}
                        <Heading style={titleStyle}>{title}</Heading>
                    </Section>

                    <Section style={contentStyle}>{children}</Section>

                    <Hr style={hrStyle} />
                    <Section style={footerStyle}>
                        <Text style={footerBrandStyle}>Official Fusion Shroom Bars</Text>
                        <Text style={footerTaglineStyle}>
                            Premium Quality · Discreet Shipping · 100% Authentic
                        </Text>
                        <Text style={footerLinksStyle}>
                            <Link href="https://officialfusionshroombars.com/shop" style={footerLinkStyle}>
                                Shop
                            </Link>
                            {' · '}
                            <Link href="https://officialfusionshroombars.com/blog" style={footerLinkStyle}>
                                Journal
                            </Link>
                            {' · '}
                            <Link href="https://officialfusionshroombars.com/contact" style={footerLinkStyle}>
                                Contact
                            </Link>
                        </Text>
                    </Section>
                </Container>
            </Body>
        </Html>
    );
}

const bodyStyle: React.CSSProperties = {
    backgroundColor: t.canvas,
    fontFamily: t.fonts.body,
    margin: 0,
    padding: '32px 16px',
};

const containerStyle: React.CSSProperties = {
    maxWidth: '600px',
    margin: '0 auto',
    backgroundColor: t.elevated,
    borderRadius: '16px',
    border: `1px solid ${t.border}`,
    overflow: 'hidden',
};

const headerStyle: React.CSSProperties = {
    background: t.gradient,
    padding: '36px 32px',
    textAlign: 'center',
};

const eyebrowStyle: React.CSSProperties = {
    color: 'rgba(255,255,255,0.85)',
    fontFamily: t.fonts.mono,
    fontSize: '11px',
    fontWeight: 500,
    letterSpacing: '3px',
    margin: '0 0 10px',
    textTransform: 'uppercase',
};

const titleStyle: React.CSSProperties = {
    color: '#ffffff',
    fontFamily: t.fonts.display,
    fontSize: '30px',
    fontWeight: 600,
    lineHeight: '1.2',
    margin: 0,
};

const contentStyle: React.CSSProperties = {
    padding: '32px',
};

const hrStyle: React.CSSProperties = {
    borderColor: t.border,
    margin: 0,
};

const footerStyle: React.CSSProperties = {
    backgroundColor: t.canvas,
    padding: '24px 32px',
    textAlign: 'center',
};

const footerBrandStyle: React.CSSProperties = {
    color: t.ink,
    fontFamily: t.fonts.display,
    fontSize: '16px',
    fontWeight: 600,
    margin: '0 0 6px',
};

const footerTaglineStyle: React.CSSProperties = {
    color: t.inkMuted,
    fontFamily: t.fonts.mono,
    fontSize: '10px',
    letterSpacing: '1.5px',
    margin: '0 0 12px',
    textTransform: 'uppercase',
};

const footerLinksStyle: React.CSSProperties = {
    color: t.inkMuted,
    fontSize: '13px',
    margin: 0,
};

const footerLinkStyle: React.CSSProperties = {
    color: t.primary,
    textDecoration: 'none',
};
