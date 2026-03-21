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
  const products = await prisma.product.findMany({ select: { slug: true }});
  console.log("ACTUAL PRODUCT SLUGS:");
  console.log(JSON.stringify(products.map(p => p.slug), null, 2));
}

main().finally(() => prisma.$disconnect());
