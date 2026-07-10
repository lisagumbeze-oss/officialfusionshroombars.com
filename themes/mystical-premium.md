# Mystical Premium Warm Light

Off-purple luxury on warm parchment — Official Fusion Shroom Bars in an editorial light mode. Keeps the mystical brand with dusty mauve accents over a cream, approachable canvas.

## Color Palette

- **Canvas**: `#faf6f2` — Warm parchment page background
- **Elevated**: `#fffcf9` — Cards, panels, surfaces
- **Surface Hover**: `#f4ede6` — Interactive hover states (warm linen)
- **Ink**: `#2b1f30` — Primary text (warm plum)
- **Ink Muted**: `#574a63` — Body copy, descriptions
- **Off-Purple**: `#8668a3` — Primary brand accent (dusty mauve)
- **Orchid**: `#9a78b3` — CTAs, links, highlights
- **Deep Mauve**: `#6d5485` — Gradients, depth
- **Teal Accent**: `#0e7d92` — Rare sparkle accents
- **Warm Amber**: `#b8620f` — Product heritage (chocolate, artisan)

## Typography

- **Display / Headings**: Cormorant Garamond — Editorial serif, mystical luxury
- **Body / UI**: Outfit — Clean geometric sans, readable at scale
- **Labels / Tags**: IBM Plex Mono — Intentional micro-typography for eyebrows and caps

## Gradients

- **Cosmic**: `linear-gradient(135deg, #6d5485 0%, #8668a3 50%, #9a78b3 100%)`
- **Nebula Glow**: `radial-gradient(ellipse at 30% 20%, rgba(134, 104, 163, 0.08) 0%, transparent 50%)`
- **Hero Text**: `linear-gradient(180deg, #2b1f30 0%, #574a63 100%)`
- **Ambient Grid**: Champagne warmth + whisper mauve (see `--grid-bg` in globals)

## Implementation

All tokens live in `src/app/globals.css` (`:root`). Components should use CSS variables — not hardcoded hex — so theme changes stay centralized.

RGB triple tokens (`--primary-rgb`, `--background-rgb`) support translucent overlays: `rgba(var(--primary-rgb), 0.12)`.

## Best Used For

Premium wellness DTC, artisan edibles, editorial product storytelling with a bright, trustworthy storefront feel.
