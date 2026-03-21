import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const products = await prisma.product.findMany({ select: { slug: true, name: true, category: true } });
  const blogs = await prisma.blogPost.findMany({ select: { slug: true, title: true } });
  
  console.log(JSON.stringify({products, blogs}, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
