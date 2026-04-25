'use client';
import { useState } from 'react';
import { Search, X, Edit2, Package, Trash2 } from 'lucide-react';
import styles from '../admin.module.css';
import Image from 'next/image';
import MediaPicker from '@/components/admin/MediaPicker';
import { ImageIcon } from 'lucide-react';

export default function ProductsTable({ 
    products, 
    updateProductAction,
    addProductAction,
    deleteProductAction
}: { 
    products: any[], 
    updateProductAction: (formData: FormData) => void,
    addProductAction?: (formData: FormData) => void,
    deleteProductAction: (formData: FormData) => void
}) {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedProduct, setSelectedProduct] = useState<any>(null);
    const [isAdding, setIsAdding] = useState(false);
    
    // Media Picker State
    const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);
    const [mediaTarget, setMediaTarget] = useState<string>('image');
    const [formValues, setFormValues] = useState<any>({});

    const filteredProducts = products.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        p.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <section className={styles.card}>
            <div className={styles.cardHeader}>
                <h2>Inventory</h2>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <button 
                        onClick={() => setIsAdding(true)}
                        className="premium-gradient"
                        style={{ padding: '0.5rem 1rem', border: 'none', borderRadius: '4px', cursor: 'pointer', color: 'white', fontSize: '0.8rem', fontWeight: 'bold' }}
                    >
                        + NEW PRODUCT
                    </button>
                    <div style={{ position: 'relative' }}>
                        <Search size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#aaa' }} />
                        <input 
                            type="text" 
                            placeholder="Search by name or category..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ padding: '0.5rem 1rem 0.5rem 2.2rem', borderRadius: '4px', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                        />
                    </div>
                    <span className={styles.badge}>{filteredProducts.length}</span>
                </div>
            </div>

            <div className={styles.orderList}>
                {filteredProducts.length === 0 ? (
                    <p className={styles.emptyState}>No matching products found.</p>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '700px' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', color: '#aaa' }}>
                                    <th style={{ padding: '1rem' }}>Product</th>
                                    <th style={{ padding: '1rem' }}>Category</th>
                                    <th style={{ padding: '1rem' }}>Price</th>
                                    <th style={{ padding: '1rem' }}>Stock</th>
                                    <th style={{ padding: '1rem' }}>Status</th>
                                    <th style={{ padding: '1rem' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredProducts.map(product => (
                                    <tr key={product.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                        <td style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                            <div style={{ width: '40px', height: '40px', background: '#222', borderRadius: '4px', overflow: 'hidden', position: 'relative' }}>
                                                {product.image ? (
                                                    <Image src={product.image} alt={product.name} fill style={{ objectFit: 'cover' }} unoptimized />
                                                ) : (
                                                    <Package size={20} style={{ position: 'absolute', top: '10px', left: '10px', color: '#555' }} />
                                                )}
                                            </div>
                                            <div style={{ maxWidth: '250px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={product.name}>
                                                {product.name}
                                            </div>
                                        </td>
                                        <td style={{ padding: '1rem' }}>{product.category}</td>
                                        <td style={{ padding: '1rem', fontWeight: 'bold' }}>
                                            ${product.price.toFixed(2)}
                                            {product.regularPrice && <span style={{ textDecoration: 'line-through', color: '#666', fontSize: '0.8rem', marginLeft: '0.5rem' }}>${product.regularPrice.toFixed(2)}</span>}
                                        </td>
                                        <td style={{ padding: '1rem' }}>
                                            <span style={{ 
                                                color: product.stock <= 5 ? '#ff4444' : product.stock <= 15 ? '#ffcc00' : '#fff',
                                                fontWeight: product.stock <= 15 ? 'bold' : 'normal'
                                            }}>
                                                {product.stock} units
                                            </span>
                                            {product.isSubscribable && <div style={{ fontSize: '0.65rem', color: '#a855f7', fontWeight: 'bold', marginTop: '4px' }}>SUBSCRIPTION READY</div>}
                                        </td>
                                        <td style={{ padding: '1rem' }}>
                                            <span className={product.isActive ? styles.activeBadge : styles.inactiveBadge}>
                                                {product.isActive ? 'Active' : 'Draft'}
                                            </span>
                                        </td>
                                        <td style={{ padding: '1rem', display: 'flex', gap: '0.5rem' }}>
                                            <button 
                                                onClick={() => setSelectedProduct(product)}
                                                style={{ padding: '0.5rem', background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '4px', cursor: 'pointer', color: 'white' }}
                                                title="Edit Product"
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                            <form action={(formData) => {
                                                if (confirm(`Permanently delete ${product.name}?`)) {
                                                    deleteProductAction(formData);
                                                }
                                            }}>
                                                <input type="hidden" name="id" value={product.id} />
                                                <button 
                                                    type="submit"
                                                    style={{ padding: '0.5rem', background: 'rgba(255,50,50,0.15)', border: 'none', borderRadius: '4px', cursor: 'pointer', color: '#ff4444' }}
                                                    title="Delete Product"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </form>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Slide-out Edit Modal */}
            {selectedProduct && (
                <>
                    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 90 }} onClick={() => setSelectedProduct(null)} />
                    <div style={{ 
                        position: 'fixed', right: 0, top: 0, bottom: 0, width: '450px', maxWidth: '100%', 
                        background: '#111', borderLeft: '1px solid rgba(255,255,255,0.1)', zIndex: 100, 
                        padding: '2rem', overflowY: 'auto', display: 'flex', flexDirection: 'column' 
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                            <h2 style={{ fontSize: '1.25rem', margin: 0 }}>Edit Product</h2>
                            <button onClick={() => setSelectedProduct(null)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
                                <X size={24} />
                            </button>
                        </div>

                        <form 
                            action={(formData) => { 
                                updateProductAction(formData); 
                                setSelectedProduct(null); 
                                setFormValues({});
                            }} 
                            style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
                        >
                            <input type="hidden" name="id" value={selectedProduct.id} />
                            
                            <div className={styles.inputGroup}>
                                <label>Product Name</label>
                                <input type="text" name="name" defaultValue={selectedProduct.name} required />
                            </div>

                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <div className={styles.inputGroup} style={{ flex: 1 }}>
                                    <label>Sale Price ($)</label>
                                    <input type="number" step="0.01" name="price" defaultValue={selectedProduct.price} required />
                                </div>
                                <div className={styles.inputGroup} style={{ flex: 1 }}>
                                    <label>Regular Price ($)</label>
                                    <input type="number" step="0.01" name="regularPrice" defaultValue={selectedProduct.regularPrice || ''} />
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <div className={styles.inputGroup} style={{ flex: 1 }}>
                                    <label>Category</label>
                                    <input type="text" name="category" defaultValue={selectedProduct.category} required />
                                </div>
                                <div className={styles.inputGroup} style={{ flex: 1 }}>
                                    <label>Stock Quantity</label>
                                    <input type="number" name="stock" defaultValue={selectedProduct.stock || 0} required />
                                </div>
                            </div>

                            <div className={styles.inputGroup}>
                                <label>Image URL</label>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <input 
                                        type="url" name="image" 
                                        value={formValues.image !== undefined ? formValues.image : selectedProduct.image} 
                                        onChange={(e) => setFormValues({...formValues, image: e.target.value})}
                                        required 
                                    />
                                    <button 
                                        type="button"
                                        onClick={() => { setMediaTarget('image'); setIsMediaPickerOpen(true); }}
                                        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '0 1rem', borderRadius: '4px', cursor: 'pointer' }}
                                    >
                                        <ImageIcon size={16} />
                                    </button>
                                </div>
                            </div>

                            <div className={styles.inputGroup}>
                                <label>Description</label>
                                <textarea name="description" defaultValue={selectedProduct.description} rows={4} required></textarea>
                            </div>

                            <div className={styles.inputGroup}>
                                <label>Gallery Images (Up to 5 URLs)</label>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    {[0, 1, 2, 3, 4].map(i => {
                                        const gallery = selectedProduct.gallery ? JSON.parse(selectedProduct.gallery) : [];
                                        const val = formValues[`gallery_${i}`] !== undefined ? formValues[`gallery_${i}`] : (gallery[i] || '');
                                        return (
                                            <div key={i} style={{ display: 'flex', gap: '0.5rem' }}>
                                                <input 
                                                    type="url" 
                                                    name={`gallery_${i}`} 
                                                    value={val}
                                                    onChange={(e) => setFormValues({...formValues, [`gallery_${i}`]: e.target.value})}
                                                    placeholder={`Gallery Image ${i + 1} URL`} 
                                                    style={{ flex: 1 }}
                                                />
                                                <button 
                                                    type="button"
                                                    onClick={() => { setMediaTarget(`gallery_${i}`); setIsMediaPickerOpen(true); }}
                                                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '0 0.75rem', borderRadius: '4px', cursor: 'pointer' }}
                                                >
                                                    <ImageIcon size={14} />
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <div className={styles.inputGroup} style={{ flex: 1 }}>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                                        <input type="checkbox" name="isActive" defaultChecked={selectedProduct.isActive} style={{ width: 'auto' }} />
                                        <span>Active (Visible)</span>
                                    </label>
                                </div>
                                <div className={styles.inputGroup} style={{ flex: 1 }}>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                                        <input type="checkbox" name="isSubscribable" defaultChecked={selectedProduct.isSubscribable} style={{ width: 'auto' }} />
                                        <span>Allow Subscription</span>
                                    </label>
                                </div>
                            </div>

                            <details style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.1)' }}>
                                <summary style={{ cursor: 'pointer', fontWeight: 'bold', color: '#ffcc00' }}>Search Engine Optimization (SEO)</summary>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
                                    <div className={styles.inputGroup}>
                                        <label>Target Keyword</label>
                                        <input type="text" name="targetKeyword" defaultValue={selectedProduct.targetKeyword || ''} placeholder="e.g. Raspberry Fusion Bar" />
                                    </div>
                                    <div className={styles.inputGroup}>
                                        <label>SEO Title</label>
                                        <input type="text" name="seoTitle" defaultValue={selectedProduct.seoTitle || ''} placeholder="Custom SEO Title" />
                                    </div>
                                    <div className={styles.inputGroup}>
                                        <label>SEO Description</label>
                                        <textarea name="seoDescription" defaultValue={selectedProduct.seoDescription || ''} rows={3} placeholder="Custom SEO Description"></textarea>
                                    </div>
                                    <div className={styles.inputGroup}>
                                        <label>Image Alt Text</label>
                                        <input type="text" name="imageAlt" defaultValue={selectedProduct.imageAlt || ''} placeholder="Description of product image" />
                                    </div>
                                </div>
                            </details>

                            <button type="submit" className={`${styles.submitBtn} premium-gradient`} style={{ marginTop: '1rem' }}>
                                Save Changes
                            </button>
                        </form>
                    </div>
                </>
            )}
            {/* Add Product Modal */}
            {isAdding && (
                <>
                    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 90 }} onClick={() => setIsAdding(false)} />
                    <div style={{ 
                        position: 'fixed', right: 0, top: 0, bottom: 0, width: '450px', maxWidth: '100%', 
                        background: '#111', borderLeft: '1px solid rgba(255,255,255,0.1)', zIndex: 100, 
                        padding: '2rem', overflowY: 'auto', display: 'flex', flexDirection: 'column' 
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                            <h2 style={{ fontSize: '1.25rem', margin: 0 }}>Add New Product</h2>
                            <button onClick={() => setIsAdding(false)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
                                <X size={24} />
                            </button>
                        </div>

                        <form action={(formData) => { addProductAction?.(formData); setIsAdding(false); }} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <div className={styles.inputGroup}>
                                <label>Product Name</label>
                                <input type="text" name="name" placeholder="e.g. Raspberry Fusion Bar" required />
                            </div>

                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <div className={styles.inputGroup} style={{ flex: 1 }}>
                                    <label>Sale Price ($)</label>
                                    <input type="number" step="0.01" name="price" placeholder="24.99" required />
                                </div>
                                <div className={styles.inputGroup} style={{ flex: 1 }}>
                                    <label>Regular Price ($)</label>
                                    <input type="number" step="0.01" name="regularPrice" placeholder="29.99" />
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <div className={styles.inputGroup} style={{ flex: 1 }}>
                                    <label>Category</label>
                                    <input type="text" name="category" placeholder="Chocolate Bars" required />
                                </div>
                                <div className={styles.inputGroup} style={{ flex: 1 }}>
                                    <label>Stock Quantity</label>
                                    <input type="number" name="stock" placeholder="100" required />
                                </div>
                            </div>

                            <div className={styles.inputGroup}>
                                <label>Image URL</label>
                                <input type="url" name="image" placeholder="https://..." required />
                            </div>

                            <div className={styles.inputGroup}>
                                <label>Description</label>
                                <textarea name="description" placeholder="Product details..." rows={4} required></textarea>
                            </div>

                            <div className={styles.inputGroup}>
                                <label>Gallery Images (Up to 5 URLs)</label>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    {[0, 1, 2, 3, 4].map(i => (
                                        <input 
                                            key={i}
                                            type="url" 
                                            name={`gallery_${i}`} 
                                            placeholder={`Gallery Image ${i + 1} URL`} 
                                        />
                                    ))}
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <div className={styles.inputGroup} style={{ flex: 1 }}>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                                        <input type="checkbox" name="isActive" defaultChecked style={{ width: 'auto' }} />
                                        <span>Active (Visible)</span>
                                    </label>
                                </div>
                                <div className={styles.inputGroup} style={{ flex: 1 }}>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                                        <input type="checkbox" name="isSubscribable" style={{ width: 'auto' }} />
                                        <span>Allow Subscription</span>
                                    </label>
                                </div>
                            </div>

                            <details style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.1)' }}>
                                <summary style={{ cursor: 'pointer', fontWeight: 'bold', color: '#ffcc00' }}>Search Engine Optimization (SEO)</summary>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
                                    <div className={styles.inputGroup}>
                                        <label>Target Keyword</label>
                                        <input type="text" name="targetKeyword" placeholder="e.g. Raspberry Fusion Bar" />
                                    </div>
                                    <div className={styles.inputGroup}>
                                        <label>SEO Title</label>
                                        <input type="text" name="seoTitle" placeholder="Custom SEO Title" />
                                    </div>
                                    <div className={styles.inputGroup}>
                                        <label>SEO Description</label>
                                        <textarea name="seoDescription" rows={3} placeholder="Custom SEO Description"></textarea>
                                    </div>
                                    <div className={styles.inputGroup}>
                                        <label>Image Alt Text</label>
                                        <input type="text" name="imageAlt" placeholder="Description of product image" />
                                    </div>
                                </div>
                            </details>

                            <button type="submit" className={`${styles.submitBtn} premium-gradient`} style={{ marginTop: '1rem' }}>
                                Create Product
                            </button>
                        </form>
                    </div>
                </>
            )}

            <MediaPicker 
                isOpen={isMediaPickerOpen}
                onClose={() => setIsMediaPickerOpen(false)}
                onSelect={(url) => {
                    setFormValues({ ...formValues, [mediaTarget]: url });
                    setIsMediaPickerOpen(false);
                }}
            />
        </section>
    );
}
