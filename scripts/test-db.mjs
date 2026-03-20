import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function test() {
    console.log('🔍 Testing Local Database Connection...');
    try {
        const productCount = await prisma.product.count();
        const orderCount = await prisma.order.count();
        const blogCount = await prisma.blogPost.count();
        
        console.log('✅ Connection Successful!');
        console.log(`📊 Products: ${productCount}`);
        console.log(`📊 Orders: ${orderCount}`);
        console.log(`📊 Blog Posts: ${blogCount}`);
    } catch (error) {
        console.error('❌ Connection Failed:', error);
    } finally {
        await prisma.$disconnect();
    }
}

test();
