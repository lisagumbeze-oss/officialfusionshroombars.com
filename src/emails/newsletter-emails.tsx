import {
    EmailButton,
    EmailButtonRow,
    EmailParagraph,
} from './components/EmailBlocks';
import { EmailLayout } from './components/EmailLayout';

export interface NewsletterWelcomeEmailProps {
    email: string;
    shopUrl: string;
    blogUrl: string;
}

export function NewsletterWelcomeEmail({ shopUrl, blogUrl }: NewsletterWelcomeEmailProps) {
    return (
        <EmailLayout
            preview="Welcome to The Insider Brief — early drops, research, and community updates."
            eyebrow="Welcome Aboard"
            title="You're on the List"
        >
            <EmailParagraph>
                Thank you for subscribing to <strong>The Insider Brief</strong>. You&apos;ll be first
                to hear about product drops, psilocybin research deep-dives, and exclusive community
                events.
            </EmailParagraph>
            <EmailParagraph>
                We keep our list private and purposeful — no spam, only signal from the Fusion team.
            </EmailParagraph>

            <EmailButtonRow>
                <EmailButton href={shopUrl}>Shop Fusion Bars</EmailButton>
                {'  '}
                <EmailButton href={blogUrl} variant="secondary">
                    Read the Journal
                </EmailButton>
            </EmailButtonRow>
        </EmailLayout>
    );
}

export interface NewsletterAdminEmailProps {
    email: string;
    adminUrl: string;
}

export function NewsletterAdminEmail({ email, adminUrl }: NewsletterAdminEmailProps) {
    return (
        <EmailLayout
            preview={`New newsletter subscriber: ${email}`}
            eyebrow="New Subscriber"
            title="Newsletter Signup"
        >
            <EmailParagraph>
                A new reader has joined <strong>The Insider Brief</strong> mailing list.
            </EmailParagraph>
            <EmailParagraph>
                <strong>Email:</strong> {email}
            </EmailParagraph>

            <EmailButtonRow>
                <EmailButton href={adminUrl}>Open Admin Panel</EmailButton>
            </EmailButtonRow>
        </EmailLayout>
    );
}
