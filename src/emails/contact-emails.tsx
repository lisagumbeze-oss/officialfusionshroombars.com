import {
    EmailButton,
    EmailButtonRow,
    EmailCard,
    EmailLabel,
    EmailMessageBox,
    EmailParagraph,
    EmailValue,
} from './components/EmailBlocks';
import { EmailLayout } from './components/EmailLayout';

export interface ContactAdminEmailProps {
    name: string;
    email: string;
    subject: string;
    message: string;
    adminUrl: string;
}

export function ContactAdminEmail({
    name,
    email,
    subject,
    message,
    adminUrl,
}: ContactAdminEmailProps) {
    return (
        <EmailLayout
            preview={`New inquiry from ${name}: ${subject}`}
            eyebrow="New Inquiry"
            title="Contact Form Submission"
        >
            <EmailCard>
                <EmailLabel>Sender</EmailLabel>
                <EmailValue>
                    {name}
                    <br />
                    {email}
                </EmailValue>
                <EmailLabel>Subject</EmailLabel>
                <EmailValue>{subject}</EmailValue>
                <EmailLabel>Message</EmailLabel>
                <EmailMessageBox>{message}</EmailMessageBox>
            </EmailCard>

            <EmailButtonRow>
                <EmailButton href={`mailto:${email}?subject=Re: ${encodeURIComponent(subject)}`}>
                    Reply to Customer
                </EmailButton>
                {'  '}
                <EmailButton href={adminUrl} variant="secondary">
                    Open Admin Panel
                </EmailButton>
            </EmailButtonRow>
        </EmailLayout>
    );
}

export interface ContactConfirmationEmailProps {
    name: string;
    subject: string;
    shopUrl: string;
    blogUrl: string;
}

export function ContactConfirmationEmail({
    name,
    subject,
    shopUrl,
    blogUrl,
}: ContactConfirmationEmailProps) {
    return (
        <EmailLayout
            preview="We've received your message and will respond shortly."
            eyebrow="Message Received"
            title="We Got Your Message"
        >
            <EmailParagraph>Hi {name},</EmailParagraph>
            <EmailParagraph>
                Thank you for reaching out. We&apos;ve received your inquiry about{' '}
                <strong>{subject}</strong> and our team will get back to you within 24 hours.
            </EmailParagraph>
            <EmailParagraph>
                While you wait, explore our collection or dive into the latest from our editorial
                journal.
            </EmailParagraph>

            <EmailButtonRow>
                <EmailButton href={shopUrl}>Browse the Collection</EmailButton>
                {'  '}
                <EmailButton href={blogUrl} variant="secondary">
                    Read the Journal
                </EmailButton>
            </EmailButtonRow>
        </EmailLayout>
    );
}
