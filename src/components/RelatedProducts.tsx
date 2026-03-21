import Link from 'next/link';
import Image from 'next/image';

interface RelatedProductsProps {
    products: any[];
}

export default function RelatedProducts({ products }: RelatedProductsProps) {
    if (!products || products.length === 0) return null;

    return (
        <section style={{ marginTop: '4rem', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '3rem' }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '2rem', color: '#fff' }}>
                Recommended For You
            </h3>
            
            <div 
                className="related-grid"
                style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', 
                    gap: '1.5rem',
                    paddingBottom: '1rem'
                }}
            >
                <style dangerouslySetInnerHTML={{ __html: `
                    .related-card:hover { transform: translateY(-5px); border-color: rgba(139, 94, 52, 0.3) !important; box-shadow: 0 10px 30px rgba(139, 94, 52, 0.1); }
                    @media (max-width: 768px) {
                        .related-grid {
                            display: flex !important;
                            overflow-x: auto !important;
                            scroll-snap-type: x mandatory;
                            padding-bottom: 2rem;
                            gap: 1rem !important;
                        }
                        .related-card {
                            min-width: 240px !important;
                            scroll-snap-align: start;
                        }
                    }
                `}} />
                
                {products.map((p) => (
                    <Link 
                        key={p.id} 
                        href={`/shop/${p.slug}`}
                        className="related-card"
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            background: 'rgba(255,255,255,0.02)',
                            borderRadius: '16px',
                            border: '1px solid rgba(255,255,255,0.05)',
                            padding: '1rem',
                            textDecoration: 'none',
                            transition: 'all 0.3s ease'
                        }}
                    >
                        <div style={{ 
                            position: 'relative', 
                            width: '100%', 
                            aspectRatio: '1', 
                            borderRadius: '12px', 
                            overflow: 'hidden',
                            marginBottom: '1rem',
                            background: '#0a0a0a'
                        }}>
                            <Image
                                src={p.image || '/images/hero-fusion.png'}
                                alt={p.name}
                                fill
                                style={{ objectFit: 'cover' }}
                            />
                        </div>
                        <h4 style={{ 
                            fontSize: '0.9rem', 
                            fontWeight: 700, 
                            color: '#fff', 
                            marginBottom: '0.25rem',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                        }}>
                            {p.name}
                        </h4>
                        <span style={{ fontSize: '0.7rem', color: '#666', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            {p.category}
                        </span>
                        
                        <div style={{ marginTop: 'auto', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#c9a44a' }}>
                                View Product
                            </span>
                            <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M5 12h14m-7-7 7 7-7 7"/>
                                </svg>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
}
