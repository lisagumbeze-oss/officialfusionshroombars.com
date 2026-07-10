'use client';

import React from 'react';
import styles from './page.module.css';
import Link from 'next/link';
import { Reveal } from '@/components/Reveal';
import {
    Mail,
    MapPin,
    Clock,
    Search,
    ShoppingBag,
    BookOpen,
    FlaskConical,
    Home,
    Send,
    CheckCircle2,
    ArrowRight,
} from 'lucide-react';

const HERO_STATS = [
    { value: '24/7', label: 'Support' },
    { value: 'Global', label: 'Coverage' },
    { value: '100%', label: 'Discreet' },
];

const CONTACT_INFO = [
    {
        icon: Mail,
        title: 'Digital inquiry',
        detail: 'order@officialfusionshroombars.com',
    },
    {
        icon: MapPin,
        title: 'Headquarters',
        detail: '6736 S Sherbourne Dr, Los Angeles, CA 90056, USA',
    },
    {
        icon: Clock,
        title: 'Service hours',
        detail: 'Monday – Sunday: 24/7 global support',
    },
];

const CROSS_LINKS = [
    { href: '/faq', icon: Search, label: 'Knowledge base' },
    { href: '/shop', icon: ShoppingBag, label: 'The collection' },
    { href: '/blog', icon: BookOpen, label: 'Editorial journal' },
    { href: '/about', icon: FlaskConical, label: 'Our process' },
    { href: '/', icon: Home, label: 'Return home' },
];

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
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (response.ok) {
                setIsSuccess(true);
                (e.target as HTMLFormElement).reset();
                setTimeout(() => setIsSuccess(false), 5000);
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
        <div className={styles.contactPage}>
            {/* Editorial Hero */}
            <section className={styles.editorialHero}>
                <div className={`grain-overlay ${styles.heroGrain}`} aria-hidden />
                <div className={styles.heroOrbit} aria-hidden />

                <div className={styles.heroInner}>
                    <Reveal>
                        <span className={styles.heroTag}>Client relations</span>
                        <h1 className={styles.heroTitle}>
                            Get in<br /><em>touch</em>
                        </h1>
                    </Reveal>
                    <Reveal delay={0.15}>
                        <p className={styles.heroDesc}>
                            Discreet, dedicated, and professional support. How can we
                            assist your journey?
                        </p>
                    </Reveal>
                    <Reveal delay={0.25}>
                        <div className={styles.heroStats}>
                            {HERO_STATS.map((stat) => (
                                <div key={stat.label} className={styles.heroStat}>
                                    <strong>{stat.value}</strong>
                                    <span>{stat.label}</span>
                                </div>
                            ))}
                        </div>
                    </Reveal>
                    <Reveal delay={0.35}>
                        <div className={styles.heroActions}>
                            <a href="#contact-form" className={`${styles.heroCta} btn-shine`}>
                                Send a message
                                <ArrowRight size={18} />
                            </a>
                            <Link href="/faq" className={styles.heroSecondary}>
                                Browse FAQ
                            </Link>
                        </div>
                    </Reveal>
                </div>
            </section>

            {/* Marquee */}
            <div className={styles.marqueeContainer}>
                <div className={styles.marqueeContent}>
                    <span>24/7 support</span> • <span>Discreet service</span> • <span>Global reach</span> • <span>Expert guidance</span> •
                    <span>24/7 support</span> • <span>Discreet service</span> • <span>Global reach</span> • <span>Expert guidance</span> •
                </div>
            </div>

            {/* Contact Grid */}
            <section className={styles.contactSection} id="contact-form">
                <div className={styles.container}>
                    <Reveal>
                        <div className={styles.sectionHeader}>
                            <span className={styles.sectionLabel}>Reach us</span>
                            <h2 className={styles.sectionTitle}>We&apos;re here to help</h2>
                            <p className={styles.sectionDesc}>
                                Send us a message or use the details below — our team responds promptly.
                            </p>
                        </div>
                    </Reveal>

                    <div className={styles.contactGrid}>
                        <div className={styles.contactInfo}>
                            {CONTACT_INFO.map((item, idx) => {
                                const Icon = item.icon;
                                return (
                                    <Reveal key={item.title} delay={0.1 * idx}>
                                        <div className={styles.infoCard}>
                                            <div className={styles.iconWrapper}>
                                                <Icon size={24} strokeWidth={1.5} />
                                            </div>
                                            <h3>{item.title}</h3>
                                            <p>{item.detail}</p>
                                        </div>
                                    </Reveal>
                                );
                            })}
                        </div>

                        <Reveal delay={0.2}>
                            <div className={styles.formSection}>
                                <form className={styles.form} onSubmit={handleSubmit}>
                                    <div className={styles.inputRow}>
                                        <div className={styles.inputGroup}>
                                            <label htmlFor="contact-name">Full name</label>
                                            <input
                                                id="contact-name"
                                                type="text"
                                                name="name"
                                                placeholder="Enter your name"
                                                required
                                            />
                                        </div>
                                        <div className={styles.inputGroup}>
                                            <label htmlFor="contact-email">Email address</label>
                                            <input
                                                id="contact-email"
                                                type="email"
                                                name="email"
                                                placeholder="Enter your email"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className={styles.inputGroup}>
                                        <label htmlFor="contact-subject">Subject</label>
                                        <input
                                            id="contact-subject"
                                            type="text"
                                            name="subject"
                                            placeholder="What is this regarding?"
                                        />
                                    </div>
                                    <div className={styles.inputGroup}>
                                        <label htmlFor="contact-message">Message</label>
                                        <textarea
                                            id="contact-message"
                                            name="message"
                                            placeholder="Detail your inquiry..."
                                            rows={6}
                                            required
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        className={styles.submitBtn}
                                        disabled={isSubmitting || isSuccess}
                                    >
                                        {isSuccess ? (
                                            <>
                                                <CheckCircle2 size={20} />
                                                Message sent
                                            </>
                                        ) : isSubmitting ? (
                                            'Sending...'
                                        ) : (
                                            <>
                                                <Send size={20} />
                                                Send message
                                            </>
                                        )}
                                    </button>
                                </form>
                            </div>
                        </Reveal>
                    </div>
                </div>
            </section>

            {/* Cross-links */}
            <section className={styles.ctaSection}>
                <div className={styles.ctaInner}>
                    <Reveal>
                        <h2 className={styles.ctaTitle}>Self-service resources</h2>
                        <p className={styles.ctaDesc}>
                            Find immediate answers in our knowledge base before reaching out.
                        </p>
                    </Reveal>
                    <Reveal delay={0.2}>
                        <div className={styles.crossLinks}>
                            {CROSS_LINKS.map((link) => {
                                const Icon = link.icon;
                                return (
                                    <Link key={link.href} href={link.href} className={styles.crossLink}>
                                        <Icon size={16} />
                                        {link.label}
                                    </Link>
                                );
                            })}
                        </div>
                    </Reveal>
                </div>
            </section>
        </div>
    );
}
