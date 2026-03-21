const fs = require('fs');
const { PrismaClient } = require('@prisma/client');

const env = fs.readFileSync('.env', 'utf-8');
env.split('\n').forEach(line => {
  if (line.trim() && line.includes('=')) {
    const [k, ...rest] = line.split('=');
    process.env[k.trim()] = rest.join('=').trim().replace(/^"|"$/g, '');
  }
});
const prisma = new PrismaClient();

// Map slugs to the best-matched local image fallback based on product type.
// Gummies → gummies.png, Bars → chocolate-bar.png, Disposables → berry-lemon-disposable.webp
// Wholesale → chocolate-bar.png, etc.
const brokenSlugs = require('./broken_images.json').map(b => b.slug);

async function getLocalFallback(name, slug) {
  const n = (name + ' ' + slug).toLowerCase();
  if (n.includes('disposable') || n.includes('whole melt') || n.includes('wholemelt')) {
    return '/images/products/berry-lemon-disposable.webp';
  }
  if (n.includes('gummie') || n.includes('gummy') || n.includes('gummies')) {
    return '/images/products/cherry-lime-gummies.webp';
  }
  if (n.includes('cactus')) return '/images/products/cactus-cooler.webp';
  if (n.includes('almond')) return '/images/products/almond-crush.png';
  if (n.includes('birthday')) return '/images/products/birthday-cake.webp';
  if (n.includes('matcha') || n.includes('matchac')) return '/images/products/apple-strudel.webp';
  return '/images/products/chocolate-bar.png';
}

async function main() {
  // 1. Delete the 'Page Not Found' dummy product
  try {
    await prisma.product.delete({ where: { slug: 'page-not-found-fusion-chocolate-official-store' } });
    console.log('🗑️  Deleted dummy Page Not Found product');
  } catch (e) {
    console.log('Could not delete dummy product (may not exist):', e.message);
  }

  // 2. Load all broken products from DB
  const products = await prisma.product.findMany({
    where: { slug: { in: brokenSlugs } },
    select: { id: true, name: true, slug: true }
  });

  let updated = 0;
  for (const p of products) {
    if (p.slug === 'page-not-found-fusion-chocolate-official-store') continue;
    const fallback = await getLocalFallback(p.name, p.slug);
    try {
      await prisma.product.update({
        where: { id: p.id },
        data: { image: fallback }
      });
      console.log(`✅ ${p.slug} → ${fallback}`);
      updated++;
    } catch (e) {
      console.error(`❌ ${p.slug}:`, e.message);
    }
  }
  console.log(`\nDone. Updated ${updated} products.`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
