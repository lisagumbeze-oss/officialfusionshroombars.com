'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './Footer.module.css';
import LegalModal from '../Legal/LegalModal';

export default function Footer() {
    const [legalType, setLegalType] = useState<'terms' | 'privacy' | 'refund' | null>(null);
    const [vaultEmail, setVaultEmail] = useState('');
    const [vaultPoints, setVaultPoints] = useState<number | null>(null);
    const [isChecking, setIsChecking] = useState(false);

    const handleCheckPoints = async () => {
        if (!vaultEmail) return;
        setIsChecking(true);
        try {
            const res = await fetch('/api/loyalty/points', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: vaultEmail })
            });
            const data = await res.json();
            if (res.ok) {
                setVaultPoints(data.points);
            }
        } catch (error) {
            console.error('Points check failed:', error);
        } finally {
            setIsChecking(false);
        }
    };

    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                <div className={styles.column}>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <Image src="/images_transparent.png" alt="Fusion Shroom Bars Logo" width={180} height={45} />
                    </div>
                    <p>Official Fusion Shroom Bars. Gourmet psychedelic edibles infused with high-quality magic mushrooms.</p>
                </div>
                <div className={styles.column}>
                    <h4>QUICK LINKS</h4>
                    <Link href="/shop" className={styles.footerLink}>Shop Products</Link>
                    <Link href="/about" className={styles.footerLink}>About Us</Link>
                    <Link href="/blog" className={styles.footerLink}>Read the Blog</Link>
                    <Link href="/faq" className={styles.footerLink}>FAQ</Link>
                    <Link href="/contact" className={styles.footerLink}>Contact Us</Link>
                </div>
                <div className={styles.column}>
                    <h4>GUIDES & REVIEWS</h4>
                    <Link href="/mushroom-chocolate-bars" className={styles.footerLink}>Mushroom Chocolate Guide</Link>
                    <Link href="/buy-shroom-bars" className={styles.footerLink}>How to Buy Shroom Bars</Link>
                    <Link href="/microdosing-chocolate" className={styles.footerLink}>Microdosing Protocol</Link>
                    <Link href="/neau-tropics" className={styles.footerLink}>Neau Tropics Review</Link>
                </div>
                <div className={styles.column}>
                    <h4>LEGAL</h4>
                    <button onClick={() => setLegalType('terms')} className={styles.legalBtn}>Terms & Conditions</button>
                    <button onClick={() => setLegalType('privacy')} className={styles.legalBtn}>Privacy Policy</button>
                    <button onClick={() => setLegalType('refund')} className={styles.legalBtn}>Refund Policy</button>
                </div>
                <div className={styles.column}>
                    <h4>FUSION VAULT</h4>
                    <p style={{ fontSize: '0.8rem', opacity: 0.6 }}>Check your reward points</p>
                    <div className={styles.vaultInput}>
                        <input 
                            type="email" 
                            placeholder="Email address" 
                            value={vaultEmail}
                            onChange={(e) => setVaultEmail(e.target.value)}
                        />
                        <button onClick={handleCheckPoints} disabled={isChecking}>
                            {isChecking ? '...' : 'CHECK'}
                        </button>
                    </div>
                    {vaultPoints !== null && (
                        <p className={styles.vaultResult}>
                            Points: <strong>{vaultPoints}</strong>
                        </p>
                    )}
                </div>
            </div>
            <div className={styles.bottom}>
                <p>&copy; {new Date().getFullYear()} Official Fusion Mushroom Bars. All rights reserved.</p>
                <div className={styles.payments}>
                    <span>BTC</span> <span>APPLE CASH</span> <span>CHIME</span> <span>ZELLE</span> <span>CASHAPP</span> <span>VENMO</span>
                </div>
            </div>

            <LegalModal 
                isOpen={legalType !== null} 
                onClose={() => setLegalType(null)} 
                type={legalType || 'terms'} 
            />
        </footer>
    );
}
