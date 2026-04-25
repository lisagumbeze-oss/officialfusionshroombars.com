'use client';

import { useState, useEffect } from 'react';
import { Search, Grid, List as ListIcon, X, Loader2, ImageIcon, Folder } from 'lucide-react';
import styles from '../../app/admin/admin.module.css';

interface MediaPickerProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (url: string) => void;
}

export default function MediaPicker({ isOpen, onClose, onSelect }: MediaPickerProps) {
    const [assets, setAssets] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (isOpen) {
            fetch('/api/admin/media')
                .then(r => r.json())
                .then(data => setAssets(data.assets || []))
                .catch(console.error)
                .finally(() => setIsLoading(false));
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const filtered = assets.filter(a => a.filename.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
            <div className={styles.card} style={{ width: '100%', maxWidth: '900px', height: '80vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2 style={{ margin: 0, fontSize: '1.25rem' }}>Select Asset</h2>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <div style={{ position: 'relative' }}>
                            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#666' }} />
                            <input 
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                placeholder="Search library..." 
                                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '0.6rem 1rem 0.6rem 2.5rem', borderRadius: '8px', fontSize: '0.85rem', width: '250px' }}
                            />
                        </div>
                        <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer' }}><X size={24} /></button>
                    </div>
                </div>

                <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
                    {isLoading ? (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#666' }}>
                            <Loader2 size={32} className="animate-spin" />
                        </div>
                    ) : filtered.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '4rem', color: '#444' }}>
                            <ImageIcon size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
                            <p>No assets found in library.</p>
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '1rem' }}>
                            {filtered.map(asset => (
                                <div 
                                    key={asset.id}
                                    onClick={() => onSelect(asset.url)}
                                    className={styles.mediaItem}
                                    style={{ 
                                        aspectRatio: '1/1', borderRadius: '12px', overflow: 'hidden', 
                                        border: '1px solid rgba(255,255,255,0.05)', cursor: 'pointer',
                                        background: '#000'
                                    }}
                                >
                                    <img src={asset.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div style={{ padding: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)', textAlign: 'center' }}>
                    <p style={{ fontSize: '0.75rem', color: '#666', margin: 0 }}>Double click to select and close.</p>
                </div>
            </div>
        </div>
    );
}
