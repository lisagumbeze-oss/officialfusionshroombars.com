'use client';

import { useState, useEffect } from 'react';
import Script from 'next/script';
import styles from './CommentForm.module.css';

interface CommentFormProps {
    blogPostId: string;
}

export default function CommentForm({ blogPostId }: CommentFormProps) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [content, setContent] = useState('');
    const [token, setToken] = useState<string>('');
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    const SITE_KEY = process.env.NEXT_PUBLIC_CLOUDFLARE_SITE_KEY || '1x00000000000000000000AA';

    useEffect(() => {
        (window as any).onTurnstileSuccess = (newToken: string) => {
            setToken(newToken);
        };
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!token) {
            setStatus('error');
            setMessage('Please complete the spam verification.');
            return;
        }

        setStatus('submitting');
        try {
            const res = await fetch('/api/comments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, content, blogPostId, turnstileToken: token }),
            });

            if (res.ok) {
                setStatus('success');
                setMessage('Thank you! Your comment has been posted.');
                setName('');
                setEmail('');
                setContent('');
                setToken('');
                if ((window as any).turnstile) {
                    (window as any).turnstile.reset();
                }
            } else {
                const data = await res.json();
                setStatus('error');
                setMessage(data.error || 'Failed to post comment.');
            }
        } catch {
            setStatus('error');
            setMessage('Something went wrong. Please try again.');
        }
    };

    return (
        <div className={styles.formCard}>
            <h3 className={styles.formTitle}>Leave a comment</h3>

            <form onSubmit={handleSubmit} className={styles.form}>
                <input
                    type="text"
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    aria-label="Your name"
                />
                <input
                    type="email"
                    placeholder="Your email (for confirmation)"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    aria-label="Your email"
                />
                <textarea
                    placeholder="Your thought..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                    rows={4}
                    aria-label="Comment"
                />

                <div className={styles.turnstile}>
                    <Script
                        src="https://challenges.cloudflare.com/turnstile/v0/api.js"
                        strategy="afterInteractive"
                    />
                    <div
                        className="cf-turnstile"
                        data-sitekey={SITE_KEY}
                        data-callback="onTurnstileSuccess"
                        data-theme="light"
                    />
                </div>

                <div>
                    <button
                        type="submit"
                        disabled={status === 'submitting'}
                        className={styles.submitBtn}
                    >
                        {status === 'submitting' ? 'Posting…' : 'Post comment'}
                    </button>
                    {message && (
                        <p className={`${styles.message} ${status === 'error' ? styles.messageError : styles.messageSuccess}`}>
                            {message}
                        </p>
                    )}
                </div>
            </form>
        </div>
    );
}
