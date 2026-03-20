import { MetadataRoute } from 'next';
import prisma from '@/lib/prisma';

const BASE_URL = 'https://officialfusionshroombars.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    // Static pages with their priorities and change frequencies
    const staticPages: MetadataRoute.Sitemap = [
        {
            url: BASE_URL,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1.0,
        },
        {
            url: `${BASE_URL}/shop`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.9,
        },
        {
            url: `${BASE_URL}/about`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.7,
        },
        {
            url: `${BASE_URL}/blog`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        {
            url: `${BASE_URL}/faq`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.6,
        },
        {
            url: `${BASE_URL}/contact`,
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 0.5,
        },
        {
            url: `${BASE_URL}/mushroom-chocolate-bars`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: `${BASE_URL}/buy-shroom-bars`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: `${BASE_URL}/microdosing-chocolate`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: `${BASE_URL}/neau-tropics`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.8,
        },
    ];

    // Dynamic product pages
    let productPages: MetadataRoute.Sitemap = [];
    try {
        const products = await (prisma as any).product.findMany({
            where: { isActive: true },
            select: { slug: true, updatedAt: true },
        });

        productPages = products.map((product: { slug: string; updatedAt: Date }) => ({
            url: `${BASE_URL}/shop/${product.slug}`,
            lastModified: product.updatedAt,
            changeFrequency: 'weekly' as const,
            priority: 0.8,
        }));
    } catch (error) {
        console.error('[Sitemap] Failed to fetch products:', error);
    }

    // Dynamic blog post pages
    let blogPages: MetadataRoute.Sitemap = [];
    try {
        const posts = await (prisma as any).blogPost.findMany({
            where: { isPublic: true },
            select: { slug: true, updatedAt: true },
        });

        blogPages = posts.map((post: { slug: string; updatedAt: Date }) => ({
            url: `${BASE_URL}/blog/${post.slug}`,
            lastModified: post.updatedAt,
            changeFrequency: 'monthly' as const,
            priority: 0.7,
        }));
    } catch (error) {
        console.error('[Sitemap] Failed to fetch blog posts:', error);
    }

    return [...staticPages, ...productPages, ...blogPages];
}
