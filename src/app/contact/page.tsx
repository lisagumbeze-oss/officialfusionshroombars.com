'use client';
// This file will remain 'use client'. I will create a layout.tsx for metadata separately if needed.

import React from 'react';
import styles from './page.module.css';
import Image from 'next/image';
import Link from 'next/link';
import { Mail, MapPin, Clock, Search, ShoppingBag, BookOpen, FlaskConical, Home, Send, CheckCircle2 } from 'lucide-react';

export default function ContactPage() {
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [isSuccess, setIsSuccess] = React.useState(false);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsSubmitting(true);
        const formData = new FormData(e.currentTarget);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            message: formData.get('message'),
        };

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                body: JSON.stringify(data),
            });
            if (response.ok) {
                setIsSuccess(true);
                (e.target as HTMLFormElement).reset();
                setTimeout(() => setIsSuccess(false), 5000); // Reset success after 5s
            } else {
                alert('Something went wrong. Please try again.');
            }
        } catch (error) {
            console.error(error);
            alert('Failed to send message.');
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className={styles.container}>
            <div className={styles.heroSection}>
                <h1>Client Relations</h1>
                <p>Discreet, dedicated, and professional support. How can we assist your journey?</p>
            </div>

            <div className={styles.contactGrid}>
                <div className={styles.contactInfo}>
                    <div className={styles.infoCard}>
                        <div className={styles.iconWrapper}><Mail size={24} /></div>
                        <h3>Digital Inquiry</h3>
                        <p>order@officialfusionshroombars.com</p>
                    </div>
                    <div className={styles.infoCard}>
                        <div className={styles.iconWrapper}><MapPin size={24} /></div>
                        <h3>Headquarters</h3>
                        <p>6736 S Sherbourne Dr, Los Angeles, CA 90056, USA</p>
                    </div>
                    <div className={styles.infoCard}>
                        <div className={styles.iconWrapper}><Clock size={24} /></div>
                        <h3>Service Hours</h3>
                        <p>Monday - Sunday: 24/7 Global Support</p>
                    </div>
                </div>

                <div className={styles.formSection}>
                    <form className={styles.form} onSubmit={handleSubmit}>
                        <div className={styles.inputRow}>
                            <div className={styles.inputGroup}>
                                <label>Full Name</label>
                                <input type="text" name="name" placeholder="Enter your name" required />
                            </div>
                            <div className={styles.inputGroup}>
                                <label>Email Address</label>
                                <input type="email" name="email" placeholder="Enter your email" required />
                            </div>
                        </div>
                        <div className={styles.inputGroup}>
                            <label>Subject</label>
                            <input type="text" name="subject" placeholder="What is this regarding?" />
                        </div>
                        <div className={styles.inputGroup}>
                            <label>Message</label>
                            <textarea name="message" placeholder="Detail your inquiry..." rows={6} required></textarea>
                        </div>
                        <button type="submit" disabled={isSubmitting || isSuccess}>
                            {isSuccess ? (
                                <><CheckCircle2 size={20} /> MESSAGE SENT</>
                            ) : isSubmitting ? (
                                "SENDING..."
                            ) : (
                                <><Send size={20} /> TRANSMIT INQUIRY</>
                            )}
                        </button>
                    </form>
                </div>
            </div>

            {/* Internal Cross-Links */}
            <div className={styles.crossLinks}>
                <h3>Self-Service Resources</h3>
                <p>Find immediate answers in our knowledge base.</p>
                <div className={styles.linkTags}>
                    <Link href="/faq" className={styles.tag}><Search size={16}/> Knowledge Base</Link>
                    <Link href="/shop" className={styles.tag}><ShoppingBag size={16}/> The Collection</Link>
                    <Link href="/blog" className={styles.tag}><BookOpen size={16}/> Editorial Journal</Link>
                    <Link href="/about" className={styles.tag}><FlaskConical size={16}/> Our Process</Link>
                    <Link href="/" className={styles.tag}><Home size={16}/> Return Home</Link>
                </div>
            </div>
        </div>
    );
}
