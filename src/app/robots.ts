import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: [
                    '/admin/',
                    '/admin',
                    '/api/',
                    '/checkout/',
                    '/checkout',
                    '/_next/',
                    '/private/',
                ],
            },
            {
                // Googlebot-specific: allow everything that's public
                userAgent: 'Googlebot',
                allow: '/',
                disallow: [
                    '/admin/',
                    '/api/',
                    '/checkout/',
                    '/_next/',
                ],
            },
        ],
        sitemap: 'https://officialfusionshroombars.com/sitemap.xml',
    };
}
