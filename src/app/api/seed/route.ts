import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { products } from '@/data/products';
import { BITCOIN_PAYMENT_METHOD } from '@/lib/bitcoin-payment';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        let count = 0;
        for (const product of products) {
            // Additive only: Check if slug exists, skip if it does
            const existing = await prisma.product.findUnique({
                where: { slug: product.id }
            });

            if (!existing) {
                await prisma.product.create({
                    data: {
                        slug: product.id,
                        name: product.name,
                        price: product.price,
                        regularPrice: product.regularPrice || null,
                        category: product.category,
                        description: product.description,
                        image: product.image,
                        weight: product.attributes?.weight || null,
                        effects: product.attributes?.effects ? JSON.stringify(product.attributes.effects) : null,
                        ingredients: product.attributes?.ingredients ? JSON.stringify(product.attributes.ingredients) : null,
                        dosage: product.attributes?.dosage || null,
                    }
                });
                count++;
            }
        }
        
        // --- BLOG POST SEEDING ---
        const samplePosts = [
            {
                title: "The Complete Guide to Fusion Mushroom Bars, Fusion Chocolate & Fusion x Whole Melt",
                slug: "complete-guide-fusion-mushroom-bars",
                excerpt: "Looking for Fusion Mushroom Bars, Fusion Chocolate Bars, Fusion Gummies or Fusion x Whole Melt? Read the official guide on reviews, ingredients, and how to buy safely from the real website.",
                content: `<h2>What Is a Fusion Mushroom Bar?</h2><p>Fusion Mushroom Bars are premium chocolate bars crafted with carefully selected ingredients and formulated for quality, consistency, and experience. When buying, always confirm you are purchasing from the official source to avoid counterfeit versions.</p><h2>Fusion Chocolate Bar Ingredients & Quality</h2><p>Authentic Fusion products focus on premium chocolate formulation, carefully measured blends, quality control standards, and secure packaging. Fake websites often invent ingredient lists or copy content from other brands. Always verify through the official website.</p><h2>Fusion Shroom Bars Reviews & Legitimacy</h2><p>Fusion products are real when purchased from the official store or verified partners listed there. Scam websites often use stolen product photos, claim to be "verifyfusion.com", offer unrealistic discounts, or impersonate Fusion wholesale. Always check the domain carefully before ordering.</p><h2>Fusion Gummies & Mushroom Chocolates</h2><p>Fusion products are known for their premium chocolate fusion formula and consistent quality. Our gummies come in a variety of flavors including Berry Citrus, Cherry Lime, Watermelon, and Hawaiian Punch – each precisely dosed for an optimal experience.</p><h2>Fusion x Whole Melt & Disposable Products</h2><p>There are many counterfeit listings online using Fusion x Whole Melt keywords. Always confirm authenticity through the official site. Check official product instructions only from the official website.</p><h2>Where to Buy Fusion Mushroom Bars Safely</h2><p>To avoid scams: 1) Only purchase from the official Fusion website. 2) Do not trust "verifyfusion" look-alike domains. 3) Avoid unofficial wholesale offers. 4) Report suspicious sites.</p>`,
                image: "/images/blogs/blog-guide.jpg",
                category: "Official Guide"
            },
            {
                title: "Official Statement: How to Verify the Real Fusion Bar Website and Avoid Scams",
                slug: "verify-real-fusion-bars-avoid-scams",
                excerpt: "Learn how to verify the official Fusion website and avoid scam stores pretending to sell Fusion products. Only buy from the real source.",
                content: `<h2>We Are the Only Official Website</h2><p>Any other website claiming to be "Fusion Official," "Verify Fusion," "Fusion Wholesale," or similar variations is NOT affiliated with us. If a website asks for payment through unusual methods, uses slightly misspelled names, claims to be "verifyfusion.com", promises unrealistic discounts, or refuses secure checkout – it is very likely a scam.</p><h2>How to Verify Real Fusion Products</h2><p>To confirm you are purchasing authentic Fusion products: 1) Always check the domain carefully. 2) Do not trust look-alike domains or copied product photos. 3) Avoid sellers claiming to be "official wholesale" unless listed on our website. 4) Contact us directly through our official website if you are unsure.</p><h2>About Fake "Verify Fusion" Websites</h2><p>Websites using names such as verifyfusion, verify fusion.com, fusionbar official, wholemelt website, and fusion wholesale are commonly reported in scam complaints. We do not operate under any domain other than our official one.</p><h2>Why This Matters</h2><p>We have built our brand around quality, transparency, and customer trust. Fraudulent sites damage customers and harm our reputation. We are actively working to report and remove impersonators, but your awareness is critical. Before purchasing: Search carefully. Verify the domain. Use only the official website.</p>`,
                image: "/images/blogs/blog-mastering.jpg",
                category: "Authenticity"
            },
            {
                title: "Are Fusion Chocolate Bars Real? Official Brand Verification & Buyer Trust Guide",
                slug: "are-fusion-chocolate-bars-real",
                excerpt: "Are Fusion chocolate bars real? Learn how to verify authentic Fusion products, avoid fake sellers, and confirm you are on the only official Fusion website.",
                content: `<h2>Are Fusion Chocolate Bars Real?</h2><p>If you reached this page by searching "are Fusion chocolate bars real," your answer is clear. Yes, Fusion is a real brand. This website is the only verified source for authentic Fusion chocolate bars. Any product shown elsewhere using the Fusion name is not approved.</p><p>Your safety depends on source verification. Always check the domain. If it does not match this official Fusion website, the product is not real.</p><p>We take pride in our craft – each Fusion bar is made with premium Belgian chocolate and precisely measured ingredients to ensure a consistent, high-quality experience every time.</p>`,
                image: "/images/blogs/blog-gummies.jpg",
                category: "Brand Verification"
            },
            {
                title: "Difference Between Fusion Chocolate Bar, One Up Chocolate Bar, and Polkadot Chocolate Bar",
                slug: "fusion-vs-oneup-vs-polkadot-comparison",
                excerpt: "Learn the difference between Fusion chocolate bar, One Up chocolate bar, and Polkadot chocolate bar. See why Fusion stands out as the most trusted and verified brand.",
                content: `<h2>Brand Comparison: Fusion vs One Up vs Polkadot</h2><p>If a website claims to sell Fusion chocolate bars and does not link directly to this official Fusion platform, the product is not authentic. This clear rule protects you from counterfeit risks and misleading listings.</p><p>If your goal is trust, verification, and brand certainty, Fusion chocolate bar remains the strongest option when compared directly to One Up chocolate bar and Polkadot chocolate bar. Our commitment to quality ingredients, precise dosing, and secure packaging sets us apart in a crowded market.</p><p>Each Fusion bar undergoes rigorous quality control to ensure that every bite delivers the premium experience our customers expect. Unlike many competitors, we provide full transparency about our ingredients and production process.</p>`,
                image: "/images/blogs/blog-science.jpg",
                category: "Comparison"
            },
            {
                title: "You Are on the Official Fusion Chocolate Bar Website – Brand Verification Guide",
                slug: "official-fusion-website-verification",
                excerpt: "You are on the only official Fusion website. Learn how to verify authentic Fusion chocolate bars, avoid fake sellers, and confirm brand legitimacy before buying.",
                content: `<h2>Welcome to the Official Fusion Website</h2><p>If you reached this page through searches like fusion magic chocolate bars, fusion chocolate shroom bar, fusion mushroom chocolate bar Canada, or fusion premium chocolate bar, your visit confirms you are now on the only official Fusion website. This page serves as your verification checkpoint.</p><p>No authorized wholesale distributors exist outside this platform. No influencer store, reseller page, or online marketplace partner is approved to sell Fusion bars. Direct access through this website is the only verified source.</p><p>If any seller claims to ship Fusion bars without linking directly to this official website, that seller is not connected to the Fusion brand. This rule protects buyers from deception and protects the brand from misuse.</p><p>This page should be bookmarked for verification any time you see Fusion bars listed elsewhere. If the site does not match this official domain, the product is not real.</p>`,
                image: "/images/blogs/blog-guide.jpg",
                category: "Brand Verification"
            },
            {
                title: "Mushroom Chocolate Bar Guide: Reviews, Legality, Packaging & Official Website Verification",
                slug: "mushroom-chocolate-bar-guide",
                excerpt: "Learn what a mushroom chocolate bar is, how packaging works, where reviews come from, what legality means, and how to verify the official Fusion website.",
                content: `<h2>The Complete Mushroom Chocolate Bar Guide</h2><p>Buyers searching for best mushroom chocolate bars, mushroom chocolate bar brands, mushroom chocolate bars for sale, and where to buy mushroom chocolate bars near me will find both real brands and fake resellers. Many counterfeit products use high dose claims to attract attention. These exaggerated labels are one of the strongest signs of an unverified product.</p><p>You will often see unrelated brands mixed into mushroom searches. These are food products unrelated to mushroom chocolate bars and are often used by sellers to confuse buyers.</p><p>Your safety as a buyer starts with verification. The only way to confirm a real Fusion mushroom chocolate bar listing is by accessing it through this official Fusion website. Any product outside this platform using the Fusion name is not approved and not verified.</p>`,
                image: "/images/blogs/blog-mastering.jpg",
                category: "Education"
            },
            {
                title: "Fusion Chocolate Bar & Fusion Mushroom Chocolate Bar: Reviews, Legitimacy & Ingredients",
                slug: "fusion-chocolate-bar-reviews-legitimacy",
                excerpt: "Learn everything about Fusion chocolate bars, reviews, ingredients, legality, and how to verify the only official Fusion Bar website. Avoid fake listings and counterfeit brands.",
                content: `<h2>Reviews & Legitimacy</h2><p>Online reviews strongly influence buying behavior. The most common red flags reported online include fake QR codes, copied packaging, and unverifiable batch claims.</p><h2>Legality & Compliance</h2><p>Laws vary by country, state, and city. Our website remains focused on brand authenticity, legal compliance, ingredient transparency, and customer trust. We clearly separate lawful gourmet Fusion chocolate bars from unregulated claims used by imitation brands.</p><h2>Why Fusion Bars Continue to Trend</h2><p>Fusion bars continue to trend because people search for flavor innovation, premium ingredients, and trusted sourcing. Strong long-term search demand shows that customers value quality and transparency above all else.</p>`,
                image: "/images/blogs/blog-gummies.jpg",
                category: "Reviews"
            },
            {
                title: "How to Make Mushroom Chocolate Bars: The Fusion Process",
                slug: "how-to-make-mushroom-chocolate-bars",
                excerpt: "A behind-the-scenes look at the expert process of crafting mushroom chocolate bars, from ingredient selection to final quality control.",
                content: `<h2>The Art of Crafting Mushroom Chocolate Bars</h2><p>Creating premium mushroom chocolate bars is both an art and a science. At Fusion, we begin with the finest Belgian chocolate – sourced from trusted suppliers who share our commitment to quality.</p><p>The process involves careful tempering of the chocolate to achieve that perfect snap and glossy finish. Our proprietary mushroom extract is then precisely measured and blended at controlled temperatures to preserve potency while ensuring even distribution throughout each bar.</p><p>Quality control is paramount at every stage. Each batch is tested for consistency, potency, and flavor profile before being packaged in our signature secure packaging designed to maintain freshness and protect against contamination.</p><p>While we share the general principles behind our process, our exact formulations and techniques remain closely guarded trade secrets – it's what makes Fusion bars uniquely exceptional.</p>`,
                image: "/images/blogs/blog-science.jpg",
                category: "Behind the Scenes"
            },
            {
                title: "How Long Do Shroom Chocolates Last? Shelf Life & Storage Guide",
                slug: "how-long-do-shroom-chocolates-last",
                excerpt: "Everything you need to know about the shelf life of mushroom chocolates, proper storage conditions, and how to maintain potency over time.",
                content: `<h2>How Long Do Shroom Chocolates Last?</h2><p>It's crucial to remember that the shelf life of shroom chocolates does not only refer to their edibility but also to their potency. Over time, the psychoactive compounds in magic mushrooms can degrade, potentially reducing their effects. To maintain the desired potency, it's best to consume your shroom chocolates within a reasonable timeframe, especially if you're seeking specific experiences.</p><h2>Proper Storage Guidelines</h2><p>Fusion mushroom chocolates can have a shelf life ranging from several months to a year, depending on their production quality and storage conditions. Proper storage is essential to maintain freshness and potency.</p><p>Store your Fusion bars in a cool, dark place – ideally between 60-70°F (15-21°C). Avoid direct sunlight and high humidity. Keep them sealed in their original packaging until ready to consume. For extended storage, consider refrigeration in an airtight container.</p><p>Whether you're enjoying fusion magic mushroom chocolate bars, fusion chocolate mushroom bars, or fusion premium mushroom chocolate bars, knowing how to store them correctly ensures a more satisfying and safer experience.</p>`,
                image: "/images/blogs/blog-guide.jpg",
                category: "Education"
            },
            {
                title: "Fusion Bars Mushroom: The Magic Behind the Brand",
                slug: "fusion-bars-mushroom-brand-story",
                excerpt: "Discover the story behind Fusion Bars Mushroom – from the science of psilocybin to the culinary artistry that makes each bar a unique experience.",
                content: `<h2>The Magic Behind Fusion Bars Mushroom</h2><p>Psychedelic mushrooms contain compounds called psilocybin and psilocin, known for their potential to induce altered states of consciousness. Research into the therapeutic applications of psychedelics is on the rise, with promising studies suggesting their effectiveness in treating conditions such as depression, anxiety, and PTSD.</p><h2>The Birth of Fusion Bars Mushroom</h2><p>Fusion Mushroom Bars emerged as a product of innovation and a desire to make the consumption of psychedelic mushrooms more accessible and enjoyable. One of the primary advantages is precise dosing – each bar is carefully infused with a specific amount, ensuring a consistent and reliable experience.</p><h2>A Culinary Delight</h2><p>What sets Fusion bars apart is their delectable taste. Our bars come in an array of flavors, ranging from classic chocolate to innovative combinations that tantalize your taste buds. The fusion of premium chocolate and top-quality mushrooms creates a harmonious blend.</p><h2>Why Choose Fusion</h2><p>1. Precision Dosing for easy intake management. 2. Delicious variety with over 30 flavors. 3. Expertly crafted by passionate professionals. 4. Rigorous quality assurance meeting the highest industry standards.</p>`,
                image: "/images/blogs/blog-mastering.jpg",
                category: "Brand Story"
            },
            {
                title: "Fusion Mushroom Bars: Are They Legal? A Comprehensive Overview",
                slug: "fusion-mushroom-bars-legal-status",
                excerpt: "Explore the legal landscape surrounding Fusion Mushroom Bars, including novel food regulations, regional differences, and compliance standards.",
                content: `<h2>Introduction</h2><p>In recent years, there has been a growing interest in unconventional forms of food and wellness products. Among these are fusion mushroom bars, a unique blend of culinary innovation and holistic health. However, the legality remains a subject of debate and concern in some regions.</p><h2>Understanding the Legal Landscape</h2><p>The legality varies depending on the region and the specific ingredients used. In many countries, mushrooms themselves are legal and can be sold and consumed without restrictions. However, when it comes to products that combine mushrooms with other ingredients, the legal status can become more complicated.</p><p>Key factors include: Novel Food Regulations – some regions have specific regulations regarding the sale of novel foods. Psychoactive Compounds – certain mushroom species contain psychoactive compounds classified as controlled substances. Labeling and Marketing – accurate labeling and marketing claims are crucial. Local Laws – what is legal in one place may not be in another.</p><p>Benefits of mushroom consumption are well-documented: mushrooms are a rich source of essential nutrients, antioxidants, and bioactive compounds that may support various aspects of well-being.</p>`,
                image: "/images/blogs/blog-science.jpg",
                category: "Legal Guide"
            },
            {
                title: "The Perfect Blend: Discovering the Delights of Fusion Bars Mushroom",
                slug: "perfect-blend-fusion-bars-mushroom",
                excerpt: "Explore the different types of Fusion Magic Mushroom Bars, their benefits, flavors, and how to consume them safely for the best experience.",
                content: `<h2>What Are Fusion Bars Mushroom?</h2><p>They are not your ordinary chocolate bars. They are infused with different types of mushrooms, each providing its own distinct flavor and health benefits. Popular mushroom varieties include lion's mane (known for cognitive benefits), reishi (immune-boosting properties), chaga (rich in antioxidants), and cordyceps (energy enhancement).</p><h2>The Benefits</h2><p>Mushrooms are low in calories and fat, making them a guilt-free addition to your diet. They are also a good source of vitamins, minerals, and fiber. Lion's mane mushrooms have been studied for their potential to improve memory and cognitive function, while reishi mushrooms may have anti-inflammatory and antioxidant properties.</p><h2>Exploring Different Types</h2><p>Fusion magic mushroom bars come in a variety of flavors and formulations – from classic combinations like mushroom and sea salt to more adventurous pairings like mushroom and chili. Some bars are vegan-friendly, using plant-based ingredients and dairy-free chocolate.</p><h2>How to Consume</h2><p>Simply unwrap the bar and break off a desired portion. Start with a smaller dose, especially if you are new to mushrooms. Allow the chocolate to melt in your mouth and savor the flavors. The effects can vary from person to person based on body weight, tolerance, and metabolism.</p>`,
                image: "/images/blogs/blog-gummies.jpg",
                category: "Wellness"
            },
            {
                title: "Can Shrooms Be Laced? Safety Guide for Mushroom Chocolate Consumers",
                slug: "can-shrooms-be-laced-safety-guide",
                excerpt: "Learn about the risks of laced mushrooms, how to identify them, and why buying from a trusted source like Fusion is essential for your safety.",
                content: `<h2>Can Shrooms Be Laced?</h2><p>Yes, psychedelic mushrooms can potentially be laced with other substances. Lacing involves adding additional substances to the mushrooms, often without the consumer's knowledge or consent.</p><h2>Why Lacing Occurs</h2><p>There are several reasons: 1) Unscrupulous dealers may add substances to increase weight and profit. 2) Some may intentionally lace mushrooms to create a different experience, which can be dangerous. 3) Accidental contamination can occur during cultivation or handling.</p><h2>How to Protect Yourself</h2><p>It's essential to obtain mushrooms from reputable sources to reduce the risk of lacing. Properly cultivated and sourced psychedelic mushrooms should not be laced with other substances. At Fusion, every product undergoes rigorous testing and quality control to ensure purity and safety.</p><p>When consuming any substance, practice harm reduction: use proper dosing techniques, start with small amounts, and have a trusted friend present to ensure a safe and positive experience. This is why buying from verified brands like Fusion matters – your safety is our top priority.</p>`,
                image: "/images/blogs/blog-science.jpg",
                category: "Safety"
            }
        ];

        let blogCount = 0;
        for (const post of samplePosts) {
            const existingBlog = await prisma.blogPost.findUnique({
                where: { slug: post.slug }
            });

            if (!existingBlog) {
                await prisma.blogPost.create({
                    data: post
                });
                blogCount++;
            }
        }

        await prisma.manualPaymentMethod.upsert({
            where: { id: BITCOIN_PAYMENT_METHOD.id },
            create: BITCOIN_PAYMENT_METHOD,
            update: {
                name: BITCOIN_PAYMENT_METHOD.name,
                details: BITCOIN_PAYMENT_METHOD.details,
                instructions: BITCOIN_PAYMENT_METHOD.instructions,
                isActive: true,
            },
        });

        return NextResponse.json({
            message: `Successfully seeded ${count} products and ${blogCount} blog posts.`,
        });
    } catch (error: any) {
        console.error('Seeding error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
