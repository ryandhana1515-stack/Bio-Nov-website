# Phase 3 — Product Catalog & BIO N:OV Product Page

**Goal:** A world-class, high-converting PDP and a catalog architecture that scales to future products.

## 1. Import the product

Products → Import → upload `shopify/data/bio-nov-product-import.csv`.

Structure created:
- **BIO N:OV — Third-Generation Nitric Oxide Support** (`/products/bio-nov`)
- Variants (Pack Size): 1 Box $89 · 3 Boxes $239 (compare-at $267) · 6 Boxes $427 (compare-at $534)

> ⚠️ **Pricing is a placeholder strategy** (single / save-10% / save-20% ladder). Confirm your landed cost + margin per market and update. The 3-box "best value" anchor typically lifts AOV 30-60% for supplements.

## 2. Fill metafields

Follow `shopify/data/metafield-definitions.md`. The PDP renders them as accordions automatically: Key benefits, Full ingredients, How to use, Warnings, Shipping & returns.

## 3. Product media (order matters)

1. Hero pack shot (white-rim-lit on navy) — becomes OG/social image
2. Box + blister/tablets lifestyle shot
3. Ingredient flat-lay
4. Infographic: "3 generations of NO technology"
5. Directions card (1 tablet × 3 daily)
6. Optional: 30-60s product video (upload as product media; Shopify serves it in the gallery)

Alt text every image (accessibility + SEO + Google Shopping).

## 4. Conversion stack on the PDP (already in the theme)

- Sticky add-to-cart bar on scroll (mobile + desktop)
- Dynamic checkout button (Shop Pay / Apple Pay / Google Pay / PayPal express)
- Quantity + pack-size ladder with savings badges
- Trust badge row (GMP / patent / worldwide shipping)
- JSON-LD Product schema with per-variant offers → rich results
- FAQ, comparison table, how-it-works, testimonials sections under the buy box

## 5. Apps to configure now

| App | Setup |
|---|---|
| **Loox / Judge.me** | Auto review-request email 14 days post-delivery; photo reviews earn 10% next-order coupon; embed star widget on PDP (app block in theme editor) |
| **Subscription app** (Shopify Subscriptions, free, or Seal) | "Subscribe & Save 15%" on the 1-box variant, 30-day cycle. Supplements are a replenishment product — subscriptions are your LTV engine |
| **Shopify Bundles** (free) | Formalize 3-box and 6-box as bundles if you prefer inventory-linked bundling over variants |
| **Shopify Search & Discovery** (free) | Set complementary + related products for cross-sell blocks |

## 6. Inventory

- Track inventory at the Singapore location; set low-stock alert at 20 units (Flow automation: "when inventory < 20 → email info@").
- SKUs: `BNOV-001 / -003 / -006`. Future products follow `[PRODUCT]-[PACK]`.

## 7. Future products

Adding product #2 later = import CSV row + fill metafields + add to collections. Zero theme work. Keep the same variant/pack-ladder pattern for pricing consistency.

## ✅ Phase 3 exit criteria

- [ ] Product imported, priced (final), media uploaded with alt text
- [ ] All metafields filled with **label-approved** copy
- [ ] Reviews app live with seeded verified reviews (never fabricate)
- [ ] Subscription option live and test-ordered
- [ ] Test order placed end-to-end on desktop + mobile
