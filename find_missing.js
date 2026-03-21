const fs = require('fs');
const env = fs.readFileSync('.env', 'utf-8');
env.split('\n').forEach(line => {
  if (line.trim() && line.includes('=')) {
    const [k, ...rest] = line.split('=');
    process.env[k.trim()] = rest.join('=').trim().replace(/^"|"$/g, '');
  }
});
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const products = await prisma.product.findMany({ select: { id: true, name: true, slug: true, image: true }});
  
  const missing = products.filter(p => !p.image || p.image.trim() === '' || p.image.includes('placeholder'));
  
  console.log("PRODUCTS MISSING IMAGES:");
  console.log(JSON.stringify(missing, null, 2));

  console.log("FIRST 3 PRODUCTS (for reference):");
  console.log(JSON.stringify(products.slice(0, 3), null, 2));
}

main().finally(() => prisma.$disconnect());
