'use client';

import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import styles from '../app/blog/page.module.css';

export default function NewsletterForm() {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setStatus('submitting');
        setMessage('');

        try {
            const res = await fetch('/api/newsletter', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();

            if (res.ok) {
                setStatus('success');
                setMessage(
                    data.alreadySubscribed
                        ? "You're already on the list. Stay tuned for the next drop."
                        : "You're in! Check your inbox for a welcome note from The Insider Brief.",
                );
                setEmail('');
            } else {
                setStatus('error');
                setMessage(data.error || 'Something went wrong. Please try again.');
            }
        } catch {
            setStatus('error');
            setMessage('Network error. Please check your connection.');
        }
    }

    return (
        <>
            <form className={styles.newsletterForm} onSubmit={handleSubmit}>
                <input
                    type="email"
                    placeholder="Enter your email address"
                    aria-label="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={status === 'submitting'}
                />
                <button type="submit" className={styles.newsletterBtn} disabled={status === 'submitting'}>
                    {status === 'submitting' ? 'Subscribing…' : 'Subscribe'}
                    <ArrowRight size={18} />
                </button>
            </form>
            {message ? (
                <p
                    style={{
                        marginTop: '1rem',
                        fontSize: '0.9rem',
                        color: status === 'error' ? '#b42318' : '#2d6a4f',
                    }}
                >
                    {message}
                </p>
            ) : null}
        </>
    );
}
