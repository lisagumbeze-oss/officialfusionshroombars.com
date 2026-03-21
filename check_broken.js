const fs = require('fs');
const https = require('https');
const http = require('http');
const { PrismaClient } = require('@prisma/client');

const env = fs.readFileSync('.env', 'utf-8');
env.split('\n').forEach(line => {
  if (line.trim() && line.includes('=')) {
    const [k, ...rest] = line.split('=');
    process.env[k.trim()] = rest.join('=').trim().replace(/^"|"$/g, '');
  }
});
const prisma = new PrismaClient();

function checkUrl(url) {
  return new Promise((resolve) => {
    if (!url.startsWith('http')) return resolve(true); // local
    const client = url.startsWith('https') ? https : http;
    client.get(url, (res) => {
      resolve(res.statusCode >= 200 && res.statusCode < 400);
    }).on('error', () => resolve(false));
  });
}

async function main() {
  const products = await prisma.product.findMany({ select: { id: true, name: true, image: true, slug: true }});
  
  let valid = 0;
  let broken = [];
  
  console.log("Checking " + products.length + " products...");
  
  // Chunking to avoid too many concurrent requests
  for (const p of products) {
    if (!p.image) {
      broken.push({ slug: p.slug, name: p.name, image: p.image, reason: 'EMPTY' });
      continue;
    }
    const isOk = await checkUrl(p.image);
    if (!isOk) {
      broken.push({ slug: p.slug, name: p.name, image: p.image, reason: '404 or ERROR' });
    } else {
        valid++;
    }
  }
  
  console.log(`Valid images: ${valid}`);
  console.log(`Broken images: ${broken.length}`);
  fs.writeFileSync('broken_images.json', JSON.stringify(broken, null, 2));
  console.log(JSON.stringify(broken.slice(0, 5), null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
