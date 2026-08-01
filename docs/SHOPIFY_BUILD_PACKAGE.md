# Shopify Build Package — BIO N:OV

Everything needed to build the Shopify store so it matches
bio-nov-website.vercel.app exactly. Execute this the moment the store exists.

## 1. Brand kit (pulled from the live site's `globals.css`)

| Token | Hex | Use in Shopify theme |
|---|---|---|
| navy | `#071f61` | Headings, primary buttons, footer |
| blue | `#075bd8` | Links, accents, icons |
| electric | `#168cf2` | Hover states |
| cyan | `#20c7ec` | Highlights, badges, gradient start |
| purple | `#6657d9` | Gradient mid |
| pink | `#e84ca7` | Gradient end, sale badges |
| orange | `#ef7b2d` | Eyebrow/kicker text only |
| ink | `#0a285a` | Body text |
| mist | `#f4f8ff` | Section backgrounds |

- **Font:** Inter (headings 800–900 weight, tight letter-spacing ~-0.05em;
  body 400–500)
- **Signature gradient:** `linear-gradient(130deg, #06226c, #0b65d9 50%, #7161da 80%, #dd54a9)`
- **Cards:** white, 1px `#e2ebf8` border, 24–28px radius,
  `0 20px 55px rgba(17,55,117,.08)` shadow
- **Buttons:** 14px radius, weight 750; primary = navy fill; secondary = glass
  (white 10% + blur + white 35% border)
- **Feel:** premium Korean biotech — big type, deep gradients, generous
  whitespace, soft glows. Not "wellness pastel", not "pharmacy clinical".

Theme recommendation: **Dawn** (free) — closest to the site's clean grid, and
easiest to restyle with the tokens above.

## 2. Product listing

**Title:** BIO N:OV — 3rd Generation Nitric Oxide Support | 60 Tablets

**Vendor:** Bzzworld Korea · **Distributor:** Bio Green Elixirs
**Type:** Health Supplement · **Tags:** nitric oxide, blood pressure support,
Korean supplement, fermented, GMP, anti-aging, energy, 40+

**Description (compliance-safe — use verbatim):**

> ### Clearing The Way To Optimum Health
>
> After 40, the body's natural nitric oxide production declines — roughly 20%
> every decade. Nitric oxide is the molecule that helps blood vessels relax and
> keeps circulation flowing freely.
>
> BIO N:OV is a **3rd generation** nitric oxide supplement, developed in Korea
> using a patented microbial fermentation process (strain KACC91554P, Korea
> Research Institute of Bioscience and Biotechnology) and manufactured in a
> GMP-certified facility.
>
> **Why 3rd generation matters**
> - **1st gen (Arginine):** needs enzymes to convert, unstable
> - **2nd gen (vegetable extracts):** can cause nausea, less suitable past 40
> - **3rd gen (BIO N:OV):** no enzyme conversion needed — releases on contact
>   with stomach acid
>
> **What it supports**
> - Healthy blood pressure and blood sugar balance
> - Everyday energy and vigor
> - A healthy inflammation response
> - Immune function
> - Cognition and skin
>
> **Formula:** Fermented garlic extract · Fermented lettuce extract · Soybean ·
> Soybean sprouts · Contains zinc. 100% natural ingredients.
>
> **How to take:** 1 tablet, 3 times daily with water. 500mg × 60 tablets (30g)
> — approximately a 20-day supply.
>
> **Storage:** Cool, dry place away from heat and direct sunlight.
>
> **Developed with** a research board led by Dr. Cheon Hyun Soo (SunChon
> National University), with professors from Wonkwang University School of
> Medicine, Pusan National University and Jeonbuk National University Medical
> School.
>
> ---
> *This product is a dietary supplement and is not intended to diagnose, treat,
> cure or prevent any disease. If you are pregnant, nursing, taking medication
> or have a medical condition, consult your doctor before use.*

**Variants (bundles):**

| Variant | SKU | Positioning |
|---|---|---|
| 1 Box (20-day supply) | BIONOV-1 | Try it |
| 3 Boxes (2-month supply) | BIONOV-3 | "Most popular" — recommended course |
| 6 Boxes (4-month supply) | BIONOV-6 | "Best value" — free shipping |

Pricing to be set by owner. Standard structure that lifts average order value:
3-box ≈ 10–12% off unit price, 6-box ≈ 18–22% off + free shipping.

**Images needed:** front of box, box + blister pack, tablets close-up,
lifestyle with garlic/lettuce, size reference, certificate/GMP badge.
All available in the product PDF (BIO_NOV_ENG_V1.pdf) — extract at high res.

## 3. Collections

1. **Shop All** — every product
2. **BIO N:OV** — the hero product and bundles
3. **Bundles & Value Packs** — multi-box only

## 4. Pages to create

| Page | Content source |
|---|---|
| The Science | Site's science section + PDF pages 3–22 (NO decline, 3-gen tech, lab data) |
| About Bio Green Elixirs | Singapore distributor story, ACRA registered, Korean partnership |
| Affiliates | Commission program + signup form → n8n webhook `/affiliate-signup` |
| Contact | info@biogreenelixirs.com |
| Shipping & Returns | SG → SEA/global; Korea → US/EU |
| Terms / Privacy / Refund | Shopify defaults, edited |

## 5. Apps to install (in this order)

1. **Easyship** or Shopify Shipping — global rates
2. **Loox** — photo reviews (critical for supplement trust)
3. **GoAffPro** — affiliate program
4. **Klaviyo** — email flows
5. **Meta Pixel + TikTok Pixel** — ad tracking (install BEFORE running ads)

## 6. Linking to the existing website

`bio-nov-website.vercel.app` (soon biogreenelixirs.com) stays as the brand and
ad landing experience. Wire it to Shopify:

- Every "Order Now" / "Buy" button → the Shopify product URL
- Shopify lives at `shop.biogreenelixirs.com` (Shopify → Settings → Domains →
  connect subdomain)
- Main site at `biogreenelixirs.com` (Vercel → Domains)
- Same brand kit on both, so the handoff feels seamless
- Later polish: Shopify Buy Button embed so checkout happens without leaving
  the main site

## 7. Compliance warning — IMPORTANT

The Korean product deck (BIO_NOV_ENG_V1.pdf) is a **B2B distributor deck** and
contains claims that MUST NOT be copied into consumer marketing, the storefront,
or ads in Singapore, the US, the EU or on Meta/TikTok:

Do **not** publish:
- "99.9% of human diseases are NO-related"
- "Prevents cardiovascular disease" / "Repairing blood vessels"
- "Eases diabetes symptoms" / "Controls hypertension"
- "Blood pressure controlled within 30 minutes"
- Disease names as benefits (stroke, dementia, diabetes, hypertension)
- "Slows down aging" / telomerase claims

Safe equivalents already used above: *supports healthy blood pressure*,
*supports blood sugar balance already in the normal range*, *supports
circulation*, *supports energy*. Lab figures (+18% vessel diameter, +42% blood
flow, −25% blood pressure, −8% blood sugar) are in-vitro/lab data from the
manufacturer — they may be referenced on a Science page **clearly labelled as
manufacturer laboratory data with the disclaimer**, but must never appear in
ads or as product promises.

Singapore: health supplements are regulated by HSA. Products must not be
presented as medicines. Get the listing reviewed before scaling ad spend.
