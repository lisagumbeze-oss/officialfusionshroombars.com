'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import styles from './shop.module.css';

export default function ShopFilters({ categories }: { categories: string[] }) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const currentCategory = searchParams.get('category') || 'All Products';
    const currentSort = searchParams.get('sort') || 'default';

    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const params = new URLSearchParams(searchParams.toString());
        params.delete('page'); // Reset to page 1
        if (e.target.value === 'All Products') {
            params.delete('category');
        } else {
            params.set('category', e.target.value);
        }
        router.push(`/shop?${params.toString()}`);
    };

    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const params = new URLSearchParams(searchParams.toString());
        params.delete('page'); // Reset to page 1
        if (e.target.value === 'default') {
            params.delete('sort');
        } else {
            params.set('sort', e.target.value);
        }
        router.push(`/shop?${params.toString()}`);
    };

    const handlePriceChange = (min?: string, max?: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.delete('page');
        if (min === undefined) params.delete('min');
        else params.set('min', min);
        
        if (max === undefined) params.delete('max');
        else params.set('max', max);
        
        router.push(`/shop?${params.toString()}`);
    };

    return (
        <div className={styles.filters}>
            <div className={styles.filterGroup}>
                <label>Category:</label>
                <select 
                    className="glass-morphism" 
                    value={currentCategory} 
                    onChange={handleCategoryChange}
                >
                    <option>All Products</option>
                    {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                </select>
            </div>
            <div className={styles.filterGroup}>
                <label>Price Range:</label>
                <div className={styles.priceInputs}>
                    <input 
                        type="number" 
                        placeholder="Min" 
                        defaultValue={searchParams.get('min') || ''} 
                        onBlur={(e) => handlePriceChange(e.target.value || undefined, searchParams.get('max') || undefined)}
                        className="glass-morphism"
                    />
                    <span>-</span>
                    <input 
                        type="number" 
                        placeholder="Max" 
                        defaultValue={searchParams.get('max') || ''} 
                        onBlur={(e) => handlePriceChange(searchParams.get('min') || undefined, e.target.value || undefined)}
                        className="glass-morphism"
                    />
                </div>
            </div>
            <div className={styles.filterGroup}>
                <label>Sort By:</label>
                <select 
                    className="glass-morphism" 
                    value={currentSort} 
                    onChange={handleSortChange}
                >
                    <option value="default">Default sorting</option>
                    <option value="price-low">Sort by price: low to high</option>
                    <option value="price-high">Sort by price: high to low</option>
                    <option value="newest">Sort by newest</option>
                </select>
            </div>
        </div>
    );
}
