const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

// Load env
const env = fs.readFileSync('.env', 'utf-8');
env.split('\n').forEach(line => {
  if (line.trim() && line.includes('=')) {
    const [k, ...rest] = line.split('=');
    process.env[k.trim()] = rest.join('=').trim().replace(/^"|"$/g, '');
  }
});

const prisma = new PrismaClient();

async function main() {
  const products = await prisma.product.findMany({ select: { id: true, name: true, image: true, slug: true }});
  
  const missing = [];
  
  for (const p of products) {
    if (!p.image) {
      missing.push({ name: p.name, reason: 'NULL/EMPTY', image: p.image });
      continue;
    }
    
    // image typically looks like /images/products/foo.png
    // Map to public/images/products/...
    let localPath = path.join(process.cwd(), 'public', p.image.replace(/^\//, ''));
    if (!fs.existsSync(localPath)) {
      missing.push({ name: p.name, slug: p.slug, reason: '404 FILE NOT FOUND', image: p.image });
    }
  }
  
  console.log(`Found ${missing.length} products with missing local files.`);
  console.log(JSON.stringify(missing.slice(0, 10), null, 2)); // Show first 10
}

main().catch(console.error).finally(() => prisma.$disconnect());
