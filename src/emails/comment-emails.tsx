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

export interface CommentAdminEmailProps {
    name: string;
    email?: string | null;
    content: string;
    postTitle: string;
    postUrl: string;
    adminUrl: string;
}

export function CommentAdminEmail({
    name,
    email,
    content,
    postTitle,
    postUrl,
    adminUrl,
}: CommentAdminEmailProps) {
    return (
        <EmailLayout
            preview={`New comment from ${name} on "${postTitle}"`}
            eyebrow="New Comment"
            title="Moderation Required"
        >
            <EmailCard>
                <EmailLabel>Commenter</EmailLabel>
                <EmailValue>
                    {name}
                    {email ? (
                        <>
                            <br />
                            {email}
                        </>
                    ) : null}
                </EmailValue>
                <EmailLabel>Article</EmailLabel>
                <EmailValue>{postTitle}</EmailValue>
                <EmailLabel>Comment</EmailLabel>
                <EmailMessageBox>{content}</EmailMessageBox>
            </EmailCard>

            <EmailButtonRow>
                <EmailButton href={adminUrl}>Moderate in Admin</EmailButton>
                {'  '}
                <EmailButton href={postUrl} variant="secondary">
                    View Article
                </EmailButton>
            </EmailButtonRow>
        </EmailLayout>
    );
}

export interface CommentConfirmationEmailProps {
    name: string;
    postTitle: string;
    blogUrl: string;
    shopUrl: string;
}

export function CommentConfirmationEmail({
    name,
    postTitle,
    blogUrl,
    shopUrl,
}: CommentConfirmationEmailProps) {
    return (
        <EmailLayout
            preview="Your comment has been submitted for review."
            eyebrow="Comment Submitted"
            title="Thank You for Sharing"
        >
            <EmailParagraph>Hi {name},</EmailParagraph>
            <EmailParagraph>
                Your comment on <strong>{postTitle}</strong> has been received and is pending
                moderation. Once approved, it will appear on the article.
            </EmailParagraph>
            <EmailParagraph>
                In the meantime, keep exploring our journal and discover our premium collection.
            </EmailParagraph>

            <EmailButtonRow>
                <EmailButton href={blogUrl}>Read More Articles</EmailButton>
                {'  '}
                <EmailButton href={shopUrl} variant="secondary">
                    Explore Products
                </EmailButton>
            </EmailButtonRow>
        </EmailLayout>
    );
}
