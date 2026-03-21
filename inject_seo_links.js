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

// Dynamic product generator used in loop

const blogUpdates = {
  "microdosing-psilocybin-for-enhanced-mental-clarity-and-focus": `
    <article>
        <p>In recent years, the practice of microdosing psilocybin has transitioned from a niche underground movement to a mainstream wellness protocol. Entrepreneurs, artists, and countless individuals seeking heightened mental clarity have adopted sub-perceptual doses of psilocybin to optimize their daily cognitive output.</p>
        <p>A landmark study published by <a href="https://www.nature.com/articles/s41598-021-01811-4" target="_blank" rel="noopener noreferrer">Nature Scientific Reports</a> highlights measurable improvements in divergent thinking and emotional balance among regular microdosers. By effectively rewiring neural pathways, psilocybin reduces the rigid activity of the brain's Default Mode Network (DMN), a concept we further explore in our post: <a href="/blog/psilocybin-microdosing-creativity">Psilocybin Microdosing for Creativity: What Science Says</a>.</p>
        <p>When selecting a delivery mechanism, accuracy is paramount. This is why precisely dosed edibles, such as our <a href="/shop/buy-1g-shroom-chocolate-bar">1G Shroom Chocolate Bar</a>, have become the gold standard. They remove the guesswork of weighing dried stems and caps.</p>
        <p>Ultimately, microdosing isn't about escaping reality—it's about engaging with it more profoundly. By integrating mindful practices via tools like <a href="/shop/a-box-of-fusion-gummies">Fusion Gummies</a> and leveraging <a href="https://hopkinsmedicine.org/psychiatry/research/psychedelics-research" target="_blank" rel="noopener noreferrer">modern psychiatric research</a>, you can safely unlock unprecedented mental clarity.</p>
    </article>
  `,
  "the-ultimate-guide-to-safe-and-enjoyable-mushroom-trips": `
    <article>
        <p>Embarking on a psilocybin journey can be one of the most transformative experiences of a person's life. However, navigating the psychedelic space requires respect, preparation, and intention. The foundational rule of any profound entheogenic experience is "Set and Setting," a term popularized by early researchers and heavily emphasized by modern organizations like <a href="https://maps.org/" target="_blank" rel="noopener noreferrer">MAPS</a>.</p>
        <p>"Set" refers to your mindset—your internal expectations, mood, and emotional readiness. "Setting" refers to the physical environment. Whether you are consuming our robust <a href="/shop/mushroom-fusion-gummies">Mushroom Fusion Gummies</a> or brewing a tea, ensuring your environment is safe, comfortable, and free of unexpected interruptions is critical.</p>
        <p>For those new to the experience, we highly recommend starting low and going slow. An ideal introductory vector is the <a href="/shop/buy-1g-shroom-chocolate-bar">1G Shroom Chocolate Bar</a>, balancing delicious flavor with a mild, manageable psychoactive threshold. For further reading on why edibles are preferred by many, read <a href="/blog/understanding-the-benefits-of-magic-mushroom-chocolate-bars">Understanding the Benefits of Magic Mushroom Chocolate Bars</a>.</p>
        <p>Always have a "trip sitter"—a sober, trusted friend—present. According to <a href="https://psychedelicscience.org/" target="_blank" rel="noopener noreferrer">Psychedelic Science guidelines</a>, having an anchor to reality significantly reduces anxiety and allows the user to fully surrender to the journey.</p>
    </article>
  `,
  "understanding-the-benefits-of-magic-mushroom-chocolate-bars": `
    <article>
        <p>The combination of rich cocoa and psilocybin mushrooms dates back centuries, tracing its roots to ancient Mesoamerican rituals. Today, this ancient pairing has been perfected through modern culinary science, resulting in premium edibles like the <a href="/shop/buy-1g-shroom-chocolate-bar">1G Shroom Chocolate Bar</a>.</p>
        <p>Why chocolate? Aside from completely masking the notoriously bitter and earthy taste of raw dried mushrooms, the lipids and fats within high-quality chocolate actually aid in the absorption of psilocin into the bloodstream. Furthermore, cocoa is a natural source of MAOIs (monoamine oxidase inhibitors) and anandamide (the "bliss molecule"), which actively synergisticize with psilocybin. The <a href="https://pubmed.ncbi.nlm.nih.gov/" target="_blank" rel="noopener noreferrer">National Institutes of Health (NIH)</a> has documented how mild MAOIs can enhance and prolong certain psychoactive effects.</p>
        <p>This culinary advancement is the core reason our <a href="/shop/a-box-of-fusion-gummies">Fusion Gummies</a> and Chocolate lines are so popular. They represent a controlled, enjoyable, and elegant consumption method.</p>
        <p>If you are interested in how these properties apply specifically to daily productivity rather than a full macrodose journey, you will find immense value in our deep-dive: <a href="/blog/microdosing-psilocybin-for-enhanced-mental-clarity-and-focus">Microdosing Psilocybin for Enhanced Mental Clarity</a>.</p>
    </article>
  `,
  "psilocybin-microdosing-creativity": `
    <article>
        <p>Does microdosing actually make you more creative? The intersection of psychedelics and cognitive enhancement has captivated Silicon Valley engineers, modern artists, and scientific researchers alike. The anecdotal evidence is overwhelming, but the clinical data is now catching up.</p>
        <p>A compelling study highlighted by the <a href="https://www.psychologytoday.com/us" target="_blank" rel="noopener noreferrer">Psychology Today</a> editorial team demonstrated that sub-hallucinogenic doses of psilocybin significantly promote "divergent thinking"—the psychological measure of out-of-the-box creativity and problem-solving flexibility.</p>
        <p>Unlike heavy recreational doses that might overwhelm the user, carefully portioned products such as <a href="/shop/mushroom-fusion-gummies">Mushroom Fusion Gummies</a> allow users to maintain their daily routine while experiencing a subtle, sustained lift in creative pattern recognition.</p>
        <p>Furthermore, because psilocybin stimulates serotonin 2A receptors, it temporarily increases neuroplasticity. To understand how to properly prepare your environment to maximize these creative surges, refer to our <a href="/blog/the-ultimate-guide-to-safe-and-enjoyable-mushroom-trips">Ultimate Guide to Safe Mushroom Trips</a>.</p>
        <p>By relying on precisely measured edibles like the <a href="/shop/buy-1g-shroom-chocolate-bar">1G Shroom Chocolate Bar</a>, you completely eliminate dosage anxiety, allowing pure, unadulterated creativity to flow seamlessly through your day.</p>
    </article>
  `
};

async function main() {
  console.log("Fetching and Updating ALL Products dynamically...");
  const allProducts = await prisma.product.findMany({ select: { id: true, name: true, slug: true } });
  
  for (const p of allProducts) {
    const dynamicDesc = `
      <p>Experience the premium quality of <strong>${p.name}</strong>, curated to deliver a precise, balanced, and transformative journey. Our <a href="/shop/${p.slug}" title="${p.name}">${p.name}</a> represents the pinnacle of artisanal psilocybin edibles, merging unparalleled flavor with reliable dosing.</p>
      <p>Whether you are a seasoned psychonaut or a curious beginner, integrating naturally derived ingredients ensures sustained effects, allowing for profound <a href="https://www.psychologytoday.com/us/basics/psychedelics" target="_blank" rel="noopener noreferrer">cognitive exploration and mental clarity</a>. Learn how proper dosing can elevate your lifestyle in our <a href="/blog/microdosing-psilocybin-for-enhanced-mental-clarity-and-focus">latest microdosing guide</a>.</p>
      <p>Backed by strict quality standards, ${p.name} is designed for optimal bioavailability. According to recent <a href="https://hopkinsmedicine.org/psychiatry/research/psychedelics-research" target="_blank" rel="noopener noreferrer">studies from Johns Hopkins on psilocybin research</a>, measured consumption can dramatically improve well-being. Expand your palate and your mind with our premium collection.</p>
    `;
    try {
      await prisma.product.update({
        where: { id: p.id },
        data: { description: dynamicDesc }
      });
      console.log(`✅ Updated Product: ${p.slug}`);
    } catch (e) {
      console.error(`❌ Failed to update Product ${p.slug}:`, e.message);
    }
  }

  console.log("\\nUpdating Blogs...");
  for (const [slug, content] of Object.entries(blogUpdates)) {
    try {
      await prisma.blogPost.update({
        where: { slug },
        data: { content: content }
      });
      console.log(`✅ Updated Blog: ${slug}`);
    } catch (e) {
      console.error(`❌ Failed to update Blog ${slug}:`, e.message);
    }
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
