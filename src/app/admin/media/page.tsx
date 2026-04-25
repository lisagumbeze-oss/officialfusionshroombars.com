'use client';

import { useState, useEffect } from 'react';
import styles from '../admin.module.css';
import { 
    Image as ImageIcon, 
    Folder, 
    Plus, 
    MoreVertical, 
    Search, 
    Grid, 
    List as ListIcon, 
    ChevronRight, 
    ArrowLeft,
    Trash2,
    Copy,
    Download,
    X,
    FolderPlus,
    Upload,
    Loader2,
    CheckCircle2
} from 'lucide-react';

interface MediaAsset {
    id: string;
    filename: string;
    url: string;
    mimeType: string;
    size: number;
    altText?: string;
    caption?: string;
    createdAt: string;
}

interface MediaFolder {
    id: string;
    name: string;
    createdAt: string;
}

export default function MediaLibrary() {
    const [view, setView] = useState<'grid' | 'list'>('grid');
    const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
    const [folderPath, setFolderPath] = useState<{id: string, name: string}[]>([]);
    const [assets, setAssets] = useState<MediaAsset[]>([]);
    const [folders, setFolders] = useState<MediaFolder[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    
    const [selectedAsset, setSelectedAsset] = useState<MediaAsset | null>(null);
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
    
    // Fetch data
    const fetchData = async () => {
        setIsLoading(true);
        try {
            const url = `/api/admin/media${currentFolderId ? `?folderId=${currentFolderId}` : ''}`;
            const res = await fetch(url);
            const data = await res.json();
            setAssets(data.assets || []);
            setFolders(data.folders || []);
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [currentFolderId]);

    const handleCreateFolder = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const name = formData.get('name') as string;
        
        try {
            await fetch('/api/admin/media', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type: 'FOLDER', name, parentId: currentFolderId })
            });
            setIsFolderModalOpen(false);
            fetchData();
        } catch (e) {}
    };

    const handleRegisterAsset = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const url = formData.get('url') as string;
        const filename = formData.get('filename') as string || url.split('/').pop() || 'image.jpg';
        
        try {
            await fetch('/api/admin/media', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    type: 'ASSET', 
                    url, 
                    filename, 
                    folderId: currentFolderId,
                    mimeType: 'image/jpeg'
                })
            });
            setIsUploadModalOpen(false);
            fetchData();
        } catch (e) {}
    };

    const handleDelete = async (id: string, type: 'ASSET' | 'FOLDER') => {
        if (!confirm('Delete permanently?')) return;
        try {
            await fetch(`/api/admin/media?id=${id}&type=${type}`, { method: 'DELETE' });
            if (selectedAsset?.id === id) setSelectedAsset(null);
            fetchData();
        } catch (e) {}
    };

    const filteredAssets = assets.filter(a => a.filename.toLowerCase().includes(searchTerm.toLowerCase()));
    const filteredFolders = folders.filter(f => f.name.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className={styles.adminContainer}>
            <header className={styles.adminHeader}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <div>
                        <h1>Media Library</h1>
                        <p>Manage your visual assets and document folders.</p>
                    </div>
                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                        <button onClick={() => setIsFolderModalOpen(true)} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '0.75rem 1rem', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
                            <FolderPlus size={18} /> New Folder
                        </button>
                        <button onClick={() => setIsUploadModalOpen(true)} className="premium-gradient" style={{ border: 'none', color: '#fff', padding: '0.75rem 1.5rem', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700 }}>
                            <Upload size={18} /> Upload Asset
                        </button>
                    </div>
                </div>
            </header>

            {/* Browser Controls */}
            <div className={styles.card} style={{ marginBottom: '2rem', padding: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.03)', padding: '0.25rem', borderRadius: '8px' }}>
                            <button onClick={() => setView('grid')} style={{ padding: '0.5rem', background: view === 'grid' ? 'rgba(255,255,255,0.1)' : 'transparent', border: 'none', borderRadius: '6px', color: view === 'grid' ? '#fff' : '#666', cursor: 'pointer' }}><Grid size={18} /></button>
                            <button onClick={() => setView('list')} style={{ padding: '0.5rem', background: view === 'list' ? 'rgba(255,255,255,0.1)' : 'transparent', border: 'none', borderRadius: '6px', color: view === 'list' ? '#fff' : '#666', cursor: 'pointer' }}><ListIcon size={18} /></button>
                        </div>
                        <div style={{ height: '24px', width: '1px', background: 'rgba(255,255,255,0.1)' }} />
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: '#888' }}>
                            <button onClick={() => { setCurrentFolderId(null); setFolderPath([]); }} style={{ background: 'none', border: 'none', color: !currentFolderId ? '#a855f7' : '#888', cursor: 'pointer', fontWeight: !currentFolderId ? 700 : 400 }}>Library</button>
                            {folderPath.map((p, i) => (
                                <span key={p.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <ChevronRight size={14} />
                                    <button onClick={() => {
                                        setCurrentFolderId(p.id);
                                        setFolderPath(folderPath.slice(0, i + 1));
                                    }} style={{ background: 'none', border: 'none', color: currentFolderId === p.id ? '#a855f7' : '#888', cursor: 'pointer', fontWeight: currentFolderId === p.id ? 700 : 400 }}>{p.name}</button>
                                </span>
                            ))}
                        </div>
                    </div>
                    <div style={{ position: 'relative' }}>
                        <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#666' }} />
                        <input 
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            placeholder="Search files..." 
                            style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '0.6rem 1rem 0.6rem 2.5rem', borderRadius: '8px', fontSize: '0.85rem', width: '250px' }}
                        />
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: selectedAsset ? '1fr 350px' : '1fr', gap: '2rem', transition: 'all 0.3s' }}>
                <div className={styles.card} style={{ minHeight: '500px' }}>
                    {isLoading ? (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#666' }}>
                            <Loader2 size={40} className="animate-spin" style={{ marginBottom: '1rem' }} />
                            <p>Loading assets...</p>
                        </div>
                    ) : filteredAssets.length === 0 && filteredFolders.length === 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#444' }}>
                            <ImageIcon size={64} style={{ marginBottom: '1.5rem', opacity: 0.2 }} />
                            <p style={{ fontSize: '1.1rem', fontWeight: 600 }}>Empty Folder</p>
                            <p style={{ fontSize: '0.9rem' }}>Upload your first asset to this directory.</p>
                        </div>
                    ) : (
                        <div style={{ 
                            display: view === 'grid' ? 'grid' : 'block',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
                            gap: '1.5rem',
                            padding: '1.5rem'
                        }}>
                            {/* Folders */}
                            {filteredFolders.map(folder => (
                                <div 
                                    key={folder.id}
                                    onDoubleClick={() => {
                                        setCurrentFolderId(folder.id);
                                        setFolderPath([...folderPath, { id: folder.id, name: folder.name }]);
                                    }}
                                    className={styles.mediaItem}
                                    style={{ 
                                        background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', 
                                        borderRadius: '12px', padding: '1rem', cursor: 'pointer', textAlign: 'center'
                                    }}
                                >
                                    <Folder size={48} style={{ color: '#a855f7', margin: '0 auto 1rem', opacity: 0.8 }} />
                                    <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{folder.name}</div>
                                </div>
                            ))}

                            {/* Assets */}
                            {filteredAssets.map(asset => (
                                <div 
                                    key={asset.id}
                                    onClick={() => setSelectedAsset(asset)}
                                    className={`${styles.mediaItem} ${selectedAsset?.id === asset.id ? styles.selectedMedia : ''}`}
                                    style={{ 
                                        background: 'rgba(255,255,255,0.03)', border: selectedAsset?.id === asset.id ? '2px solid #a855f7' : '1px solid rgba(255,255,255,0.05)', 
                                        borderRadius: '12px', padding: '0.5rem', cursor: 'pointer', position: 'relative', overflow: 'hidden'
                                    }}
                                >
                                    <div style={{ aspectRatio: '1/1', position: 'relative', borderRadius: '8px', overflow: 'hidden', background: '#000', marginBottom: '0.5rem' }}>
                                        <img src={asset.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    </div>
                                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#aaa', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', padding: '0 0.25rem' }}>{asset.filename}</div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Sidebar Detail Panel */}
                {selectedAsset && (
                    <div className={styles.card} style={{ padding: '1.5rem', height: 'fit-content', position: 'sticky', top: '100px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h3 style={{ margin: 0, fontSize: '1rem' }}>Asset Details</h3>
                            <button onClick={() => setSelectedAsset(null)} style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer' }}><X size={20} /></button>
                        </div>

                        <div style={{ borderRadius: '12px', overflow: 'hidden', background: '#000', border: '1px solid rgba(255,255,255,0.1)', marginBottom: '1.5rem' }}>
                            <img src={selectedAsset.url} alt="" style={{ width: '100%', display: 'block' }} />
                        </div>

                        <div style={{ spaceY: '1.25rem' }}>
                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', fontSize: '0.7rem', color: '#555', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '1px', marginBottom: '0.5rem' }}>Filename</label>
                                <div style={{ fontSize: '0.9rem', color: '#fff', fontWeight: 600, wordBreak: 'break-all' }}>{selectedAsset.filename}</div>
                            </div>
                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', fontSize: '0.7rem', color: '#555', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '1px', marginBottom: '0.5rem' }}>Alt Text (SEO)</label>
                                <input 
                                    defaultValue={selectedAsset.altText} 
                                    placeholder="Describe for Google..."
                                    style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: '#fff', padding: '0.5rem', fontSize: '0.85rem' }}
                                />
                            </div>
                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={{ display: 'block', fontSize: '0.7rem', color: '#555', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '1px', marginBottom: '0.5rem' }}>Public URL</label>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <input readOnly value={selectedAsset.url} style={{ flex: 1, background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '6px', color: '#888', padding: '0.5rem', fontSize: '0.75rem' }} />
                                    <button 
                                        onClick={() => {
                                            navigator.clipboard.writeText(selectedAsset.url);
                                            alert('URL Copied!');
                                        }}
                                        style={{ background: '#a855f7', border: 'none', borderRadius: '6px', color: '#fff', padding: '0.5rem', cursor: 'pointer' }}
                                    >
                                        <Copy size={16} />
                                    </button>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <button style={{ flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '0.75rem', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontSize: '0.85rem', fontWeight: 600 }}>
                                    <Download size={16} /> Download
                                </button>
                                <button 
                                    onClick={() => handleDelete(selectedAsset.id, 'ASSET')}
                                    style={{ padding: '0.75rem', background: 'rgba(255,50,50,0.1)', border: 'none', borderRadius: '8px', color: '#ff4444', cursor: 'pointer' }}
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Modals */}
            {isUploadModalOpen && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropBlur: '8px', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
                    <div className={styles.card} style={{ width: '100%', maxWidth: '500px', padding: '2rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                            <h2 style={{ margin: 0 }}>Register Asset</h2>
                            <button onClick={() => setIsUploadModalOpen(false)} style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer' }}><X size={24} /></button>
                        </div>
                        <form onSubmit={handleRegisterAsset}>
                            <div className={styles.inputGroup} style={{ marginBottom: '1.5rem' }}>
                                <label>External URL</label>
                                <input name="url" placeholder="https://..." required autoFocus />
                                <p style={{ fontSize: '0.75rem', color: '#666', marginTop: '0.5rem' }}>Enter the URL of the image or asset you want to track.</p>
                            </div>
                            <div className={styles.inputGroup} style={{ marginBottom: '2rem' }}>
                                <label>Display Name (Optional)</label>
                                <input name="filename" placeholder="Product Shot..." />
                            </div>
                            <button type="submit" className="premium-gradient" style={{ width: '100%', border: 'none', color: '#fff', padding: '1rem', borderRadius: '12px', cursor: 'pointer', fontWeight: 700 }}>Add to Library</button>
                        </form>
                    </div>
                </div>
            )}

            {isFolderModalOpen && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropBlur: '8px', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
                    <div className={styles.card} style={{ width: '100%', maxWidth: '400px', padding: '2rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                            <h2 style={{ margin: 0 }}>Create Folder</h2>
                            <button onClick={() => setIsFolderModalOpen(false)} style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer' }}><X size={24} /></button>
                        </div>
                        <form onSubmit={handleCreateFolder}>
                            <div className={styles.inputGroup} style={{ marginBottom: '2rem' }}>
                                <label>Folder Name</label>
                                <input name="name" placeholder="E.g., Spring Collection" required autoFocus />
                            </div>
                            <button type="submit" className="premium-gradient" style={{ width: '100%', border: 'none', color: '#fff', padding: '1rem', borderRadius: '12px', cursor: 'pointer', fontWeight: 700 }}>Create Folder</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
