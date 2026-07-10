const SITE_URL = 'https://officialfusionshroombars.com';

export const WHATSAPP_NUMBER = '19128389469';

export function buildWhatsAppUrl(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function buildProductInquiryMessage(product: {
  name: string;
  slug?: string;
  price?: number;
}): string {
  const lines = [
    `Hi! I'm interested in ${product.name}.`,
    product.price != null ? `Price: $${product.price.toFixed(2)}` : null,
    product.slug ? `${SITE_URL}/shop/${product.slug}` : null,
    'Could you share more details?',
  ].filter(Boolean);

  return lines.join('\n');
}

export function buildProductInquiryUrl(product: {
  name: string;
  slug?: string;
  price?: number;
}): string {
  return buildWhatsAppUrl(buildProductInquiryMessage(product));
}
