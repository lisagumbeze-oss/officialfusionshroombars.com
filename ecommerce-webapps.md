---
name: ecommerce-webapps
description: Build complete, production-quality e-commerce web applications and storefront UIs. Use this skill whenever the user asks to build an online store, product catalog, shopping cart, checkout flow, product page, storefront, marketplace UI, or any e-commerce component. Trigger even for partial requests like "add a cart to my site", "build a product listing page", "create a shop page", or "I want to sell things online." Always use this skill for anything commerce-related — product browsing, filtering, purchasing flows, order history, wishlists, admin dashboards for products — even if the user doesn't say "e-commerce" explicitly.
---

# E-Commerce Web App Skill

Build polished, conversion-optimized e-commerce frontends: product catalogs, shopping carts, checkout flows, storefronts, and full-featured shop UIs. Ship real, working code with production-grade UX patterns.

## Step 1: Clarify Requirements

Before building, quickly establish:

- **Scope**: Full app or specific component (cart, product page, catalog, checkout)?
- **Stack**: React (preferred for interactivity), plain HTML/CSS/JS, or other?
- **Products**: Do they have real product data, or should you generate plausible dummy data?
- **Features needed**: See the feature menu below — ask which tier fits
- **Brand/aesthetic**: Any existing colors, logo, style direction?

If the user's request is clear enough, skip the questions and build — you can make sensible defaults. Default to React for anything interactive; HTML for static storefronts.

---

## Step 2: Choose the Right Scope

### Tier 1 — Single Component
*Cart drawer, product card grid, search bar with filters, mini cart badge*

Build as a standalone React component or HTML snippet. Keep focused.

### Tier 2 — Page / Section
*Product listing page, single product detail page, checkout page, order confirmation*

Build the full page with routing simulation (tab-switching or state-based navigation), realistic layout, and working interactivity.

### Tier 3 — Full Storefront App
*Complete shop: homepage → catalog → product detail → cart → checkout*

Multi-view app with simulated navigation. Include at minimum:
- Homepage with hero + featured products
- Catalog with filtering/sorting
- Product detail with image, description, size/variant selector, add-to-cart
- Cart with quantity controls and totals
- Checkout form (no payment processing needed — show the form and confirmation)

---

## Step 3: Generate Realistic Product Data

Always populate with plausible dummy data. Match the store type:

```js
// Fashion store example
const products = [
  { id: 1, name: "Linen Oversized Shirt", price: 89, originalPrice: 120,
    category: "Tops", sizes: ["XS","S","M","L","XL"], colors: ["White","Sage","Sand"],
    rating: 4.6, reviews: 142, badge: "Bestseller",
    description: "Relaxed linen shirt with dropped shoulders and a breezy open weave.",
    images: ["/placeholder-1.jpg"] },
  // 8–12 more products...
]
```

For the store type given, create 8–16 products minimum with varied prices, categories, ratings, and realistic attributes. Make the data feel curated, not randomly generated.

---

## Step 4: Core E-Commerce Patterns

### State Management (React)
```js
const [cart, setCart] = useState([]);
const [wishlist, setWishlist] = useState([]);
const [view, setView] = useState('catalog'); // 'home' | 'catalog' | 'product' | 'cart' | 'checkout'
const [selectedProduct, setSelectedProduct] = useState(null);
const [filters, setFilters] = useState({ category: 'All', sortBy: 'featured', priceRange: [0, 500] });

const addToCart = (product, quantity = 1, variant = {}) => {
  setCart(prev => {
    const key = `${product.id}-${JSON.stringify(variant)}`;
    const existing = prev.find(i => i.key === key);
    if (existing) return prev.map(i => i.key === key ? {...i, quantity: i.quantity + quantity} : i);
    return [...prev, { ...product, quantity, variant, key }];
  });
};

const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
```

### Essential UI Patterns

**Product Card** — Must have:
- Product image (use gradient placeholder if no real images)
- Name, price (with sale price if applicable)
- Rating stars + review count
- Add to cart CTA (hover reveal or always visible)
- Wishlist toggle
- Badge (New, Sale, Bestseller, Low Stock)

**Cart** — Must have:
- Line items with image, name, variant, price × quantity
- Quantity +/− controls with remove button
- Subtotal, shipping note, estimated total
- Clear CTA to checkout

**Checkout Form** — Must have:
- Contact info (email)
- Shipping address
- Shipping method selection
- Order summary sidebar
- Place order → confirmation state (no real payment)

**Filters/Sort** — Standard patterns:
- Category tabs or sidebar checkboxes
- Sort: Featured / Price low–high / Price high–low / Newest / Best rated
- Active filter chips with × to remove
- Product count: "Showing 12 of 24 products"

---

## Step 5: Design Principles for E-Commerce

Read the frontend-design skill for aesthetic direction. Additional e-commerce-specific rules:

### Conversion-Optimized UX
- **CTAs are prominent**: "Add to Cart" should be the most visually dominant button
- **Price hierarchy**: Sale price large, original price struck through smaller
- **Trust signals**: Star ratings, review counts, "Free shipping over $X", "Easy returns"
- **Scarcity/urgency** (use tastefully): "Only 3 left", "Bestseller", "Low Stock"
- **Sticky cart** or persistent cart count in header — always visible

### Image Handling
When no real images are provided, use beautiful CSS gradient placeholders:
```css
.product-image {
  background: linear-gradient(135deg, #f5f0eb 0%, #e8ddd4 100%);
}
```
Vary the gradients per product based on category/color to make them feel distinct.

### Layout
- **Catalog**: 2 cols mobile → 3 cols tablet → 4 cols desktop (CSS Grid)
- **Product page**: Image left (60%) / Details right (40%) on desktop, stacked mobile
- **Cart**: Full page with summary sidebar, or slide-in drawer for mini cart
- **Checkout**: Single column with sticky order summary sidebar on desktop

### Mobile-First
All layouts must be fully responsive. Test mental model at 375px and 1280px breakpoints.

---

## Step 6: Feature Reference

Implement from this list based on scope:

**Core (always include)**
- [ ] Product grid with cards
- [ ] Add to cart + cart state
- [ ] Cart with totals
- [ ] Responsive layout

**Standard (include for Tier 2+)**
- [ ] Product detail page with variant selection
- [ ] Filter by category
- [ ] Sort products
- [ ] Wishlist/favorites
- [ ] Search bar (filter by name)
- [ ] Cart drawer or cart page
- [ ] Checkout form + confirmation

**Enhanced (Tier 3 / if requested)**
- [ ] Price range slider filter
- [ ] Image gallery with thumbnail switcher
- [ ] Related products section
- [ ] Recently viewed
- [ ] Promo code field (show accepted/rejected state)
- [ ] Stock indicator
- [ ] Reviews section (static display)
- [ ] Toast notifications ("Added to cart ✓")
- [ ] Empty states (empty cart, no search results)
- [ ] Loading skeletons

---

## Step 7: Code Quality Checklist

Before delivering:
- [ ] All interactive elements work (add to cart updates count, quantities update totals)
- [ ] Empty states handled (empty cart message, no results message)
- [ ] Prices formatted correctly (`$89.00` not `89`)
- [ ] Mobile layout doesn't break at small screen widths
- [ ] No console errors in logic
- [ ] Accessible: buttons have labels, images have alt text, form inputs have labels
- [ ] Product data is plausible and varied (not all the same price/category)

---

## Example Store Types → Aesthetic Direction

| Store Type | Aesthetic | Color Palette |
|---|---|---|
| Fashion/Apparel | Editorial, clean, lots of white space | Cream, warm neutrals, one bold accent |
| Electronics/Tech | Dark, precise, high-contrast | Dark navy/charcoal, electric blue/green accents |
| Food/Grocery | Fresh, organic, warm | Green, warm white, earthy oranges |
| Luxury/Jewelry | Refined, opulent, serif-forward | Black, gold, ivory |
| Sports/Outdoors | Bold, energetic, full-bleed images | Deep greens, earth tones, bright highlights |
| Handmade/Craft | Warm, textured, artisanal | Terracotta, oat, sage |
| Children's | Playful, rounded, colorful | Bright primaries on soft backgrounds |

Adapt the aesthetic based on what the user is selling. If they don't specify, pick the most fitting one and explain the choice briefly.

---

## Delivery

- For **Claude.ai artifacts**: Output as a single `.jsx` (React) or `.html` file
- For **files**: Save to `/mnt/user-data/outputs/` and present with `present_files`
- Add a brief note on what's included and what could be extended next

Always ship something that *works and impresses*. The user should be able to see a real store experience, not a wireframe.