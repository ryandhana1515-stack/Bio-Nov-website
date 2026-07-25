# Phase 1 — Shopify Store Architecture & Technical Setup

**Goal:** A scalable multi-product foundation. Shopify is the master database — every order, inventory unit and customer record lives here.

## 1. Create the store

1. Sign up at shopify.com with **info@biogreenelixirs.com** (keeps billing, apps and notifications on the business email).
2. Plan: start on **Shopify Basic** ($ saves cash pre-revenue), upgrade to **Shopify** or **Advanced** when international selling volume grows (Advanced unlocks better Markets pricing controls and third-party calculated shipping rates).
3. Store name: **BioExcela Global** (Settings → General). Legal business name: your ACRA-registered entity (Bio Green Elixirs).

## 2. Domain

- Primary domain: connect **biogreenelixirs.com** from Namecheap (Settings → Domains → Connect existing domain).
  - In Namecheap: point `A record` to `23.227.38.65` and `www` CNAME to `shops.myshopify.com`.
- If you want the storefront branded BioExcela, buy **bioexcela.com** and set it as primary, keeping biogreenelixirs.com redirecting. **Decide one primary domain before launch** — it affects SEO, email, pixels and Markets subfolders.
- Enable HTTPS (automatic) and redirect www → root.

## 3. Core settings checklist (Settings →)

| Area | Configuration |
|---|---|
| General | Timezone Singapore (GMT+8), unit system metric, currency SGD as store currency |
| Customer accounts | "New" customer accounts, optional at checkout, enable Shop Pay |
| Checkout | Email required; full name required; company hidden; address line 2 optional; tipping off |
| Policies | Generate Refund, Privacy, Terms, Shipping via templates → legal review before launch |
| Notifications | Customize email templates with logo + navy/cyan branding |
| Brand | Upload logo, square logo, cover; set brand colors #050A18 / #00DCFF |
| Users | Owner account + staff with least-privilege roles |
| Locations | Location 1: Singapore hub. Add KL (Malaysia) and Korea (3PL/FBA) as locations when active |
| Taxes | See Phase 4 |
| Markets | See Phase 4 |

## 4. Theme deployment

The complete custom theme lives in this repo at `shopify/theme/`.

```bash
# Install Shopify CLI
npm install -g @shopify/cli @shopify/theme

# From the repo root
cd shopify/theme
shopify theme push --store=your-store.myshopify.com --unpublished --theme="BioExcela Prestige"
```

Then in Admin → Online Store → Themes → publish after review. For ongoing edits use `shopify theme dev` for live preview.

## 5. Data architecture (scales to future products)

- **Products:** one product per SKU family; pack sizes as variants (already done for BIO N:OV in `data/bio-nov-product-import.csv` — import via Products → Import).
- **Metafields:** defined in `data/metafield-definitions.md`. The theme reads them automatically — future products get the same premium PDP by just filling in metafields.
- **Collections & navigation:** `data/navigation-and-collections.md`.
- **Customer segmentation tags:** `newsletter`, `vip`, `affiliate`, `wholesale`, `subscriber` — used later by Klaviyo flows and discounts.
- **Order tags (automated later via Flow):** market code (SG/US/EU/…), `first-order`, `subscription`.

## 6. Foundation apps (install in Phase 1, configure in later phases)

| App | Purpose | Phase configured |
|---|---|---|
| Shopify Flow (free) | Automation engine | 1 |
| Klaviyo | Email marketing | 11 |
| Loox or Judge.me | Reviews & UGC | 3 |
| GoAffPro | Affiliates | 12 |
| Tidio | AI chat + WhatsApp | 13/support |
| Easyship | SG-origin shipping rates & labels | 4 |
| Meta / Facebook & Instagram | FB+IG channel | 7-8 |
| TikTok | TikTok channel | 9 |
| Google & YouTube | Merchant Center + GA4 | 10 |
| Pandectes or Consentmo | GDPR cookie consent | 14/16 |

## 7. Security & compliance baseline

- Two-step authentication for all staff (Settings → Users → Security).
- Shopify Protect / fraud analysis on; review high-risk orders manually.
- Cookie banner app active in EU/UK markets before ads go live.
- Supplement compliance: keep storefront claims to "supports…" language (see `data/metafield-definitions.md` compliance note).

## ✅ Phase 1 exit criteria

- [ ] Store live on password page, domain connected, SSL active
- [ ] Theme pushed and previewed
- [ ] BIO N:OV imported with variants + metafields filled
- [ ] Collections, menus, pages, policies created
- [ ] Locations + staff + 2FA configured
- [ ] Foundation apps installed
