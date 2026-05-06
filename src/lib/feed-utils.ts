import { Product } from '@prisma/client';

export function xmlEscape(s: string): string {
    if (!s) return '';
    return s
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}

export function buildGoogleMerchantXml(products: Product[], origin: string): string {
    const items = products.map(product => {
        const title = xmlEscape(product.name);
        const description = xmlEscape(product.description || product.name);
        const link = `${origin}/shop/${product.slug}`;
        const imageLink = product.image.startsWith('http') ? product.image : `${origin}${product.image}`;
        const price = `${product.price.toFixed(2)} USD`;
        const availability = product.stock > 0 ? 'in stock' : 'out of stock';
        const brand = 'Fusion';
        const category = xmlEscape(product.category || 'Candy & Chocolate');

        return `
    <item>
      <g:id>${product.id}</g:id>
      <g:title>${title}</g:title>
      <g:description>${description}</g:description>
      <g:link>${link}</g:link>
      <g:image_link>${imageLink}</g:image_link>
      <g:condition>new</g:condition>
      <g:availability>${availability}</g:availability>
      <g:price>${price}</g:price>
      <g:brand>${brand}</g:brand>
      <g:google_product_category>${category}</g:google_product_category>
    </item>`;
    }).join('');

    return `<?xml version="1.0" encoding="UTF-8"?>
<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">
  <channel>
    <title>Official Fusion Shroom Bars</title>
    <link>${origin}</link>
    <description>The Official Fusion Shroom Bars Store</description>
    ${items}
  </channel>
</rss>`;
}

export function buildGoogleMerchantCsv(products: Product[], origin: string): string {
    const headers = ['id', 'title', 'description', 'link', 'image_link', 'condition', 'availability', 'price', 'brand', 'google_product_category'];
    const rows = products.map(product => {
        const title = `"${product.name.replace(/"/g, '""')}"`;
        const description = `"${(product.description || product.name).replace(/"/g, '""')}"`;
        const link = `${origin}/shop/${product.slug}`;
        const imageLink = product.image.startsWith('http') ? product.image : `${origin}${product.image}`;
        const price = `${product.price.toFixed(2)} USD`;
        const availability = product.stock > 0 ? 'in stock' : 'out of stock';
        const brand = '"Fusion"';
        const category = `"${(product.category || 'Candy & Chocolate').replace(/"/g, '""')}"`;

        return [
            product.id,
            title,
            description,
            link,
            imageLink,
            'new',
            availability,
            price,
            brand,
            category
        ].join(',');
    });

    return [headers.join(','), ...rows].join('\n');
}
