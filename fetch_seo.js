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
  const products = await prisma.product.findMany({ 
    select: { slug: true, name: true, category: true, description: true } 
  });
  const blogs = await prisma.blogPost.findMany({ 
    select: { slug: true, title: true, content: true } 
  });
  
  console.log("=== PRODUCTS ===");
  products.forEach(p => console.log(p.slug, p.name));
  console.log("=== BLOGS ===");
  blogs.forEach(b => console.log(b.slug, b.title));
}

main().catch(console.error).finally(() => prisma.$disconnect());
