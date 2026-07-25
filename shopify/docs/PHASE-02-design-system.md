# Phase 2 — Theme, UX/UI Design System

**Goal:** Apple-level premium feel. Luxury, minimal, science-backed, mobile-first, fast.

## Design system (implemented in `shopify/theme/assets/base.css`)

| Token | Value | Usage |
|---|---|---|
| Background | `#050A18` deep navy | Body, with cyan/violet radial glows |
| Elevated | `#0A1428` | Cards, headers |
| Text | `#F2F6FF` / muted `#9BA9C4` | Copy hierarchy |
| Accent | `#00DCFF` cyan | CTAs, links, highlights |
| Accent 2 | `#7C5CFF` violet | Gradient partner |
| Headings | Sora (fallback system) | Tight tracking, clamp() fluid sizes |
| Body | Inter | 1.7 line height |
| Radius | 12px base | Cards 24px, pills 999px |
| Glass | `rgba(255,255,255,.05)` + 18px blur + 1px light border | Signature glassmorphism |

All tokens are editable without code in **Theme editor → Theme settings** (colors, page width, radius, logo, socials, footer disclaimer).

## UX principles baked into the theme

1. **One conversion path** — every homepage section funnels to the BIO N:OV PDP; primary CTA is always gradient-cyan.
2. **Trust before ask** — trust badge strip sits directly under the hero, before the featured product.
3. **Progressive disclosure** — science details live in accordions/dedicated page; the PDP stays scannable.
4. **Mobile-first** — sticky add-to-cart bar appears when the buy box scrolls away; nav collapses to a clean drawer; grids stack.
5. **Performance** — no frameworks, one small CSS file + one deferred JS file, native lazy-loading, `IntersectionObserver` reveal animations that respect `prefers-reduced-motion`.
6. **Accessibility** — skip link, focus states, aria labels, semantic landmarks, FAQ uses native `<details>`.

## Typography setup (one manual step)

The theme references Sora/Inter with system fallbacks. For the exact fonts either:
- **Option A (fastest):** In theme settings choose similar Shopify-hosted fonts (e.g. "Assistant"/"Archivo") — zero external requests, best Core Web Vitals; or
- **Option B:** Self-host Sora + Inter woff2 files: upload to `assets/` and add `@font-face` at the top of `base.css`. Do NOT use render-blocking Google Fonts `<link>` tags.

## Section library (all drag-and-drop in the theme editor)

`hero` · `trust-badges` · `featured-product` · `benefits` · `how-it-works` · `ingredients` · `comparison-table` · `testimonials` · `faq` · `newsletter` · `rich-text` — plus main templates for product, collection, cart, blog, article, search, contact, 404.

## Imagery direction

- Product renders on dark gradient backgrounds with cyan rim-light (generate with FLUX.2 Pro / Seedream V4.5 per the brand playbook; keep packaging accurate to the approved label).
- Ingredient macro shots: fermented garlic, lettuce, soybean, sprouts — desaturated navy grade with one cyan highlight.
- People: 40+ demographic, energetic, aspirational; avoid clinical/medical settings that imply treatment claims.
- Export WebP, hero ≤ 400 KB, cards ≤ 150 KB. Shopify CDN handles srcset (already wired with `image_url` widths).

## ✅ Phase 2 exit criteria

- [ ] Theme published with brand logo + final fonts
- [ ] All homepage sections populated with approved copy & imagery
- [ ] Lighthouse mobile ≥ 90 performance / ≥ 90 SEO on home + PDP
- [ ] Checked on iPhone SE-size viewport, iPad, desktop
