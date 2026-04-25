'use client';

import { useState } from 'react';
import { ImageIcon, Save } from 'lucide-react';
import styles from '../admin.module.css';
import MediaPicker from '@/components/admin/MediaPicker';

export default function BrandSettingsManager() {
    const [logoUrl, setLogoUrl] = useState('');
    const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);

    return (
        <section className={styles.card} style={{ gridColumn: 'span 1' }}>
            <div className={styles.cardHeader}>
                <h2>Brand Identity</h2>
            </div>
            <div style={{ padding: '1.5rem' }}>
                <div className={styles.inputGroup}>
                    <label>Store Logo</label>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <div 
                            style={{ 
                                width: '64px', height: '64px', background: 'rgba(255,255,255,0.03)', 
                                border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px',
                                overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}
                        >
                            {logoUrl ? <img src={logoUrl} alt="Logo Preview" style={{ maxWidth: '100%', maxHeight: '100%' }} /> : <ImageIcon size={24} style={{ color: '#444' }} />}
                        </div>
                        <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <input 
                                    value={logoUrl} 
                                    onChange={(e) => setLogoUrl(e.target.value)} 
                                    placeholder="Logo URL..." 
                                />
                                <button 
                                    onClick={() => setIsMediaPickerOpen(true)}
                                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '0 1rem', borderRadius: '8px', cursor: 'pointer' }}
                                >
                                    <ImageIcon size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={styles.inputGroup} style={{ marginTop: '1.5rem' }}>
                    <label>Store Favicon</label>
                    <input placeholder="Favicon URL..." />
                </div>

                <button 
                    onClick={() => alert('Brand settings saved!')}
                    className="premium-gradient" 
                    style={{ width: '100%', marginTop: '2rem', border: 'none', color: '#fff', padding: '1rem', borderRadius: '12px', cursor: 'pointer', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                >
                    <Save size={18} /> Save Identity
                </button>
            </div>

            <MediaPicker 
                isOpen={isMediaPickerOpen}
                onClose={() => setIsMediaPickerOpen(false)}
                onSelect={(url) => {
                    setLogoUrl(url);
                    setIsMediaPickerOpen(false);
                }}
            />
        </section>
    );
}
