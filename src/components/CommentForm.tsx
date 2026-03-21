'use client';

import { useState, useEffect } from 'react';
import Script from 'next/script';

interface CommentFormProps {
    blogPostId: string;
}

export default function CommentForm({ blogPostId }: CommentFormProps) {
    const [name, setName] = useState('');
    const [content, setContent] = useState('');
    const [token, setToken] = useState<string>('');
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    const SITE_KEY = process.env.NEXT_PUBLIC_CLOUDFLARE_SITE_KEY || '1x00000000000000000000AA';

    // Handle token from global callback
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
                body: JSON.stringify({ name, content, blogPostId, turnstileToken: token }),
            });

            if (res.ok) {
                setStatus('success');
                setMessage('Thank you! Your comment has been posted.');
                setName('');
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
        } catch (err) {
            setStatus('error');
            setMessage('Something went wrong. Please try again.');
        }
    };

    return (
        <div style={{ 
            marginTop: '3rem', 
            padding: '2rem', 
            background: 'rgba(255,255,255,0.02)', 
            borderRadius: '16px', 
            border: '1px solid rgba(255,255,255,0.06)' 
        }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.5rem', color: '#fff' }}>
                Leave a Comment
            </h3>
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
                    <div>
                        <input
                            type="text"
                            placeholder="Your Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            style={{
                                width: '100%',
                                padding: '12px 16px',
                                background: 'rgba(255,255,255,0.03)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '8px',
                                color: '#fff',
                                outline: 'none'
                            }}
                        />
                    </div>
                    <div>
                        <textarea
                            placeholder="Your thought..."
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            required
                            rows={3}
                            style={{
                                width: '100%',
                                padding: '12px 16px',
                                background: 'rgba(255,255,255,0.03)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '8px',
                                color: '#fff',
                                outline: 'none',
                                resize: 'none'
                            }}
                        />
                    </div>
                </div>

                {/* Cloudflare Turnstile */}
                <div style={{ minHeight: '65px' }}>
                    <Script 
                        src="https://challenges.cloudflare.com/turnstile/v0/api.js" 
                        strategy="afterInteractive" 
                    />
                    <div 
                        className="cf-turnstile" 
                        data-sitekey={SITE_KEY}
                        data-callback="onTurnstileSuccess"
                        data-theme="dark"
                    ></div>
                </div>

                <div>
                    <button
                        type="submit"
                        disabled={status === 'submitting'}
                        style={{
                            padding: '12px 32px',
                            background: '#8B5E34',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '999px',
                            fontWeight: 700,
                            cursor: status === 'submitting' ? 'not-allowed' : 'pointer',
                            opacity: status === 'submitting' ? 0.7 : 1,
                            transition: 'all 0.2s'
                        }}
                    >
                        {status === 'submitting' ? 'POSTING...' : 'POST COMMENT'}
                    </button>
                    {message && (
                        <p style={{ 
                            marginTop: '1rem', 
                            fontSize: '0.85rem', 
                            color: status === 'error' ? '#ff4d4d' : '#4dff88' 
                        }}>
                            {message}
                        </p>
                    )}
                </div>
            </form>
        </div>
    );
}
