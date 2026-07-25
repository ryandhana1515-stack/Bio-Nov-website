# Phase 11 — Collections & Checkout Optimization

**Goal:** A collection architecture that a non-developer can merchandise from the Shopify admin forever, and a checkout that removes every avoidable reason to abandon — measured, not guessed.

> ⚠️ **Honest starting position:** today BioExcela sells **one product in three pack sizes**. Collections currently do almost nothing for discovery — a customer can reach the PDP in one click from anywhere. Build the structure now anyway, because (a) bundles and subscriptions need their own landing surfaces for ads and email, (b) Google Merchant Center and Meta catalog feed off collection URLs, and (c) retro-fitting a tag taxonomy after 5 SKUs are live is painful. Do not, however, pretend the store needs faceted navigation on day one. Ship the skeleton, fill it as SKUs arrive.

## 1. Collection architecture

Two rules that keep this manageable:

1. **Automated (smart) collections wherever a rule can express the intent.** Manual collections only where human curation is the point (Best Sellers, campaign edits).
2. **Tags are the control surface.** Ryan changes a tag, the site re-merchandises itself. No theme edits, no developer.

### 1.1 Tag taxonomy — set this before creating anything

Prefixed tags, lowercase, hyphenated. Prefixes stop the tag list turning into soup at 30 SKUs.

| Prefix | Purpose | Examples |
|---|---|---|
| `pack-` | Pack size / format | `pack-1`, `pack-3`, `pack-6` |
| `benefit-` | Structure-function benefit area | `benefit-circulation`, `benefit-energy`, `benefit-vitality` |
| `ingredient-` | Key actives for filtering | `ingredient-fermented-garlic`, `ingredient-fermented-lettuce`, `ingredient-soy` |
| `format-` | Delivery format | `format-tablet`, `format-capsule`, `format-powder` |
| `badge-` | Merchandising flags | `badge-bestseller`, `badge-new`, `badge-bundle`, `badge-subscription`, `badge-limited` |
| `market-` | Market restriction (rare) | `market-sg-only` |

> ⚠️ `benefit-` tags are **navigational labels, not claims**. A collection titled "Circulation Support" is acceptable structure-function language; "Blood Pressure" is a disease claim and must never appear as a tag, collection title, handle or filter value.

### 1.2 Collections and their exact rules

Products → Collections → Create. Conditions written as they appear in the Shopify condition builder.

| Collection | Handle | Type | Conditions (ALL/ANY) | Sort |
|---|---|---|---|---|
| All Products | `all` | Automated | ANY: `Product price` `is greater than` `0` | Manually / Best selling |
| Shop Supplements | `supplements` | Automated | ALL: `Product type` `is equal to` `Supplement` | Best selling |
| BIO N:OV | `bio-nov` | Automated | ALL: `Product title` `contains` `BIO N:OV` | Manually |
| Bundles & Savings | `bundles` | Automated | ALL: `Product tag` `is equal to` `badge-bundle` | Price: high to low |
| Best Sellers | `best-sellers` | **Manual** | Curated — reorder on the 1st monthly from the Sales-by-product report | Manually |
| New Arrivals | `new-arrivals` | Automated | ALL: `Product tag` `is equal to` `badge-new` | Created: newest first |
| Offers & Promotions | `offers` | Automated | ALL: `Compare at price` `is greater than` `0` | Percentage saved |
| Subscribe & Save | `subscriptions` | Automated | ALL: `Product tag` `is equal to` `badge-subscription` | Manually |
| Circulation Support | `circulation-support` | Automated | ALL: `Product tag` `is equal to` `benefit-circulation` | Best selling |
| Fermented Actives | `fermented-actives` | Automated | ANY: `Product tag` `is equal to` `ingredient-fermented-garlic` · `Product tag` `is equal to` `ingredient-fermented-lettuce` | Best selling |
| Back in Stock | `back-in-stock` | Automated | ALL: `Product tag` `is equal to` `badge-restock` **AND** `Inventory stock` `is greater than` `0` | Created: newest first |
| Gift Cards | `gift-cards` | Automated | ALL: `Product type` `is equal to` `Gift Card` | Price: low to high |

Automation to keep tags honest (Shopify Flow, free):

| Flow | Trigger | Action |
|---|---|---|
| Auto-expire "new" | Scheduled, daily | If product `created_at` > 60 days ago → remove tag `badge-new` |
| Auto-flag restock | Inventory quantity changed | If quantity moves 0 → >0, add `badge-restock`; remove after 14 days |
| Bundle tagging | Product created/updated | If variant title contains `3 Boxes` or `6 Boxes` → add `badge-bundle` |

> ⚠️ Shopify's automated-collection condition set covers price, tag, type, vendor, weight, inventory, title and variant fields; **metafield conditions are limited and version-dependent**. Do not architect a collection whose only possible rule is a metafield — always give the product a tag as well. Tags are the durable lever.

### 1.3 Single-product reality check

With only `BNOV-001/-003/-006` live, six of the twelve collections above will contain the same one product. That is fine and expected. What they actually buy you today:

- `/collections/bundles` — a real landing page for "save 20%" ad creative
- `/collections/subscriptions` — a landing page for the Subscribe & Save flow in Phase 7
- `/collections/offers` — the promotion surface that Klaviyo and Meta link into during sales
- `/collections/all` — the Merchant Center and Meta catalog anchor

The other eight are scaffolding. Leave them **unpublished from the Online Store sales channel** until they hold ≥2 products, so the site never shows a one-item "category". Publish them the day SKU #2 lands.

## 2. Navigation & product discovery

| Surface | Implementation | Notes |
|---|---|---|
| Main menu | `Shop` → dropdown: All Products, BIO N:OV, Bundles & Savings, Subscribe & Save | Keep to 6 top-level items; mobile drawer already built in the theme |
| Homepage | Hero → featured product → benefits → bundles strip → reviews → FAQ | One conversion path (Phase 2 §UX 1) |
| Footer | Shop / Learn / Company columns per `data/navigation-and-collections.md` | Every collection reachable in ≤2 clicks |
| Predictive search | Online Store → **Search & Discovery** app → Search → enable product, collection, page and article results; show product images and price | Free app, required |
| Search synonyms | Add: `nitric oxide` → BIO N:OV · `NO booster` → BIO N:OV · `bio nov`, `bionov`, `bio-nov` → BIO N:OV · `garlic` → BIO N:OV | Customers mistype the product name constantly |
| Related products | Search & Discovery → Product recommendations → set **complementary** products manually per SKU | Falls back to Shopify's ML "related" when unset |
| Breadcrumbs | `Home / Collection / Product` on PDP and collection templates, with `BreadcrumbList` JSON-LD | Feeds Google rich results (Phase 6) |
| Collection SEO | Unique meta title + description per published collection; 40–80 word intro paragraph above the grid | Thin collection pages get ignored by Google |

### 2.1 Search & Discovery filter configuration

Online Store → Search & Discovery → **Filters**. Only enable a filter once it has ≥2 distinct values in the catalog, otherwise it renders a useless single-option control.

| Filter | Source | Values | Enable when | Display |
|---|---|---|---|---|
| Availability | Built-in | In stock / Out of stock | Now | Checkbox, "Hide out of stock" default on |
| Price | Built-in | Range slider | Now | Slider, market currency |
| Pack Size | Variant option `Pack Size` | 1 Box / 3 Boxes / 6 Boxes | Now | Button group |
| Product Type | Built-in | Supplement, Gift Card | ≥2 types | Checkbox |
| Benefit | Product tag `benefit-*` | Circulation, Energy, Vitality | ≥2 SKUs | Checkbox, relabelled to friendly names |
| Key Ingredient | Product tag `ingredient-*` | Fermented Garlic, Fermented Lettuce, Soy | ≥3 SKUs | Checkbox |
| Format | Product tag `format-*` | Tablet, Capsule, Powder | ≥2 formats | Checkbox |
| Vendor | Built-in | BioExcela Global | Never (single vendor) | Off |

Filter group order: Availability → Pack Size → Price → Benefit → Key Ingredient → Format. Rename raw tag values to human labels in the app (customers must never see `benefit-circulation`).

## 3. Merchandising rules — what Ryan can change without a developer

| Task | Where | How |
|---|---|---|
| Feature a product on the homepage | Theme editor → Featured Product section | Pick product, save |
| Pin a best seller to position 1 | Collection → Sort: Manually → drag | Manual sort only works on manual sort order |
| Re-order a smart collection | Collection → Sort: Best selling / Manually | Switching an automated collection to "Manually" keeps the rule but lets you drag |
| Schedule a promotion | Discounts → Create → set start/end datetime | Discount goes live and expires automatically |
| Schedule a homepage change | Theme editor → duplicate theme → edit → publish at the time | Shopify has no native scheduled publish on Basic; use a duplicate + calendar reminder, or an app like Theme Scheduler (~US$10/mo) |
| Add a seasonal campaign collection | New manual collection + a menu item | Delete the menu item after; keep the collection unpublished for reuse next year |
| Change a collection banner/copy | Collection → Description + Image | Theme renders both |
| Swap the announcement bar | Theme editor → Announcement bar | 60-char limit before it wraps on mobile |

Merchandising cadence: Best Sellers re-ranked monthly (1st) · Offers audited weekly for expired compare-at prices · New Arrivals auto-managed by Flow · seasonal collection built T-14 before any campaign.

## 4. Checkout configuration

Settings → Checkout. Exact toggles:

| Setting | Value | Why |
|---|---|---|
| Customer accounts | **Optional** at checkout | Forcing account creation is the single largest self-inflicted abandonment cause |
| Customer contact method | Email (phone optional) | Email is the CRM key for Klaviyo |
| Full name | Require **first and last name** | Couriers and customs need both |
| Company name | **Hidden** | Not relevant to DTC; removes a field |
| Address line 2 | **Optional** | Keep it — SG addresses need unit numbers |
| Shipping address phone | **Required** | International couriers reject label creation without a phone |
| Address autocomplete | **On** | Fewer typos → fewer failed deliveries |
| Tipping | **Off** | Inappropriate for a product store |
| Marketing consent checkbox | Shown, **NOT pre-selected** | Pre-ticking is unlawful under GDPR/PECR and PDPA |
| SMS consent | Separate, unticked (Phase 7 §4.1) | TCPA requires express written consent, separately captured |
| Abandoned checkout email | **Off in Shopify** | Klaviyo owns recovery (Phase 7 §3.3) — two senders means duplicate emails |
| Order status page | Branded; Klaviyo + review-app blocks only | Do not clutter it with upsell widgets that break the tracking experience |
| Checkout language | Per market via Markets | US English for US, en-GB for UK |
| Duties & import taxes | Collect at checkout for EU/UK/AU (Phase 4) | Surprise customs fees are the #1 cross-border refund reason |
| Checkout branding | Brand → Checkout editor: logo, `#050A18` background, `#00DCFF` primary button, Sora/Inter fallbacks | Visual continuity from PDP to payment |

> ⚠️ Deep checkout customisation (checkout UI extensions, custom fields, branding API beyond the editor) is largely **Shopify Plus** territory. On Basic/Shopify plans, use the Checkout Editor and app blocks only. Verify what your plan exposes before promising a custom checkout step to anyone.

### 4.1 Payment methods by market

| Method | SG | US | UK/EU | AU | CA | MY | Notes |
|---|---|---|---|---|---|---|---|
| Shop Pay | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | Highest-converting accelerated checkout on Shopify; enable first |
| Apple Pay | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | Renders only on Safari/iOS — test on a real device |
| Google Pay | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | Chrome/Android |
| Cards (Shopify Payments) | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | Primary gateway |
| PayPal | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | Second gateway = outage insurance (Risk R6, Phase 10) |
| PayNow | ✅ | — | — | — | — | — | SG-local trust signal; via Shopify Payments or a PayNow app |
| Klarna / Afterpay | — | Optional | Optional | Optional | Optional | — | Only if AOV justifies the fee; test, don't assume |

Express checkout buttons must appear **above** the standard checkout button on cart and PDP, and on the PDP buy box (already wired in the theme, `.product__buy`).

### 4.2 Volume & bundle discounting

Pack sizes are **variants**, so the ladder is priced directly — no discount engine required. When SKU #2 arrives and mixed-cart volume pricing is needed:

| Need | Mechanism | Plan requirement |
|---|---|---|
| Fixed pack pricing (today) | Variant prices + compare-at | Any plan |
| "Buy 3 of anything, save 10%" | Shopify Discounts → Amount off products, minimum quantity | Any plan |
| Tiered mixed-cart volume breaks | **Shopify Functions** discount app (e.g. Discount Ninja, Regios, or a custom Function) | Any plan via app; custom Function needs a Partner app |
| Bundle as one SKU with linked inventory | **Shopify Bundles** (free, first-party) | Any plan |
| Subscription pricing | Shopify Subscriptions (free) — 15% off, 30-day cycle | Any plan |

> ⚠️ **Shopify Scripts are retired.** Any tutorial, agency proposal or app referencing `Scripts` / `Script Editor` for cart logic is out of date. Everything is Shopify Functions now. Do not buy a Scripts-based solution.

## 5. Cart & checkout upsell matrix

Offer by cart value. Keep it to **one** offer per surface — stacking upsells reduces conversion.

| Cart state | Cart-drawer offer | Post-purchase offer (Shopify Post-Purchase / Selleasy ~US$10–30/mo) | Rationale |
|---|---|---|---|
| 1 Box, < S$89 | "Add 2 more boxes and save 10% — upgrade to 3 Boxes" (one-tap variant swap) | Subscribe & Save 15% on the next box | Variant upgrade is the highest-yield upsell in a pack ladder |
| 1 Box, subscription selected | None — protect the subscription | Offer 3-box one-time at 10% | Never disturb a converting subscription |
| 3 Boxes | "Go to 6 Boxes, save 20% — S$427 (S$71/box)" with per-box maths shown | 1 extra box at 15% off | Per-unit price framing converts better than % off |
| 6 Boxes | None — do not push further | Refer-a-friend credit | The 6-box buyer is already maximal; upsell reads as greed |
| Below free-shipping threshold | Progress bar: "S$X away from free shipping" | — | Threshold nudges reliably lift AOV |
| Any cart, > 30 s idle | Nothing (no exit-intent pop-up on mobile) | — | Mobile exit-intent is unreliable and hurts CWV |

Free-shipping threshold: set at roughly **1.3× AOV** per market (Phase 4 rates). Recalculate quarterly.

## 6. Conversion features — build checklist

| Feature | Status in theme | Configuration |
|---|---|---|
| Sticky add-to-cart | ✅ `.sticky-atc` | Appears when the buy box scrolls out; verify on iPhone SE viewport |
| Express checkout on PDP | ✅ dynamic checkout button | Settings → Checkout → enable all wallets |
| Trust badge row | ✅ `.trust-strip` | GMP-certified · Patented fermentation (KACC91554P) · Worldwide shipping · Secure checkout |
| Delivery estimate on PDP | To build | "Order by 2pm SGT → delivered {date range}" from the Phase 4 shipping table, per market |
| Secure-payment messaging | To build | Card logos + "Encrypted, PCI-compliant checkout by Shopify" under the ATC button |
| Cart drawer | ✅ | Upsell block per §5; free-shipping progress bar |
| Discount code field | Native | Visible at checkout; never mention "discount code" on the PDP — it sends people hunting |
| Abandoned checkout recovery | Klaviyo (Phase 7 §3.3) | 30 min / 12 h / 36 h |
| Back-in-stock capture | Klaviyo or Shopify Forms | Replaces "sold out" dead ends |
| Reviews on PDP + cart | Loox/Judge.me | Genuine reviews only (Phase 10 §1 blocker 3) |
| Order summary persistence | Native | Verify line items, shipping and duties show on every checkout step |

## 7. Customer confidence — what must be visible, and where

| Information | PDP | Cart | Checkout | Order status |
|---|---|---|---|---|
| Price incl./excl. tax by market | ✅ | ✅ | ✅ | ✅ |
| Shipping cost or "calculated at checkout" | ✅ | ✅ | ✅ | — |
| Estimated delivery window | ✅ | ✅ | ✅ | ✅ |
| Duties/import tax note (EU/UK/AU) | ✅ | ✅ | ✅ | — |
| Return/refund policy link | ✅ | ✅ | ✅ (footer) | ✅ |
| Support contact (`info@biogreenelixirs.com`, chat) | ✅ | ✅ | ✅ | ✅ |
| Payment security statement | ✅ | ✅ | ✅ | — |
| Supplement disclaimer | ✅ | — | — | — |
| Company identity (Bio Green Elixirs, ACRA no.) | Footer | Footer | Footer | Footer |

## 8. AI & automation in the funnel

Cross-reference Phase 7 §5 for agent scoping and the medical-advice guardrail — it applies verbatim here.

| Automation | Tool | Behaviour | Guardrail |
|---|---|---|---|
| Complementary product recommendation | Search & Discovery + theme block | Manually curated pairs; ML fallback | Never recommend based on inferred health status |
| Cart-abandonment flag | Shopify Flow → Klaviyo event | Cart >S$200 abandoned → tag customer `high-value-abandon` | No discount auto-issued above 10% |
| Checkout assistance | Tidio Sales Agent | Answers shipping cost, delivery time, pack differences, payment methods | **Any health question → mandated escalation template** |
| Personalised offer | Klaviyo segment → dynamic code | Offer strength by lifecycle stage, not by browsing behaviour on health content | No offers to affiliate/creator profiles |
| Stockout guard | Flow | Inventory < 14 days cover → pause ads, enable back-in-stock capture | Never "continue selling when out of stock" |

## 9. CRO checklist

Impact ranges below are **industry-typical hypotheses for DTC supplement stores, not measured BioExcela results**. Test one at a time, ≥2 weeks or 200 conversions before calling a winner (Phase 10 §8).

| # | Test | Typical lift range | Effort | Priority |
|---|---|---|---|---|
| 1 | Enable Shop Pay + all wallets above the fold | 5–10% CVR | Low | **Now** |
| 2 | Show delivery date range on PDP + cart | 2–6% CVR | Low | **Now** |
| 3 | Free-shipping progress bar in cart drawer | 5–15% AOV | Low | **Now** |
| 4 | Per-box price framing on the pack ladder ("S$71/box") | 3–8% AOV | Low | **Now** |
| 5 | Trust badge row directly under ATC | 1–4% CVR | Low | Now |
| 6 | Remove company field + shorten checkout | 1–3% CVR | Low | Now |
| 7 | Duties-included pricing for EU/UK | 5–12% intl CVR | Medium | Month 2 |
| 8 | One-tap 1-box → 3-box upgrade in cart | 8–20% AOV | Medium | Month 2 |
| 9 | Post-purchase one-click subscription offer | 3–8% subscriber rate | Medium | Month 2 |
| 10 | Review widget above the fold on PDP | 3–10% CVR | Low | After 20 genuine reviews |
| 11 | PDP video in gallery position 2 | 2–7% CVR | Medium | Month 3 |
| 12 | Sticky ATC copy test ("Add to cart" vs "Get BIO N:OV") | 1–3% CTR | Low | Month 3 |

> ⚠️ Do not run more than one test at a time on a store doing under ~500 orders/month. You will not reach significance, and you will make decisions on noise. Below that volume, prefer the "obviously correct" changes (#1–6) and skip A/B testing entirely.

## 10. Analytics framework

| Metric | Source | Where | Cadence | Healthy |
|---|---|---|---|---|
| Collection sessions & CVR | GA4 (page path `/collections/*`) | Looker Studio | Weekly | Bundles collection CVR ≥ site CVR |
| Revenue by collection | Shopify Analytics → Sales by product + GA4 landing page | Looker Studio | Monthly | Bundles ≥30% of revenue |
| Product-page → cart rate | Shopify Analytics funnel | Dashboard | Weekly | ≥8% |
| Cart → checkout rate | Shopify Analytics funnel | Dashboard | Weekly | ≥55% |
| Checkout completion rate | Shopify Analytics | Dashboard | **Daily first 14 days** | ≥50% (Phase 10 gate) |
| Cart abandonment rate | 1 − (orders ÷ carts created) | Dashboard | Weekly | <75% |
| Checkout abandonment rate | 1 − (orders ÷ checkouts started) | Dashboard | Weekly | <45% |
| Payment success rate | Shopify Payments → failed vs captured | Dashboard | Weekly | ≥98% |
| AOV overall + by market | Shopify | Dashboard | Weekly | Trending up with bundle mix |
| Pack mix (1/3/6 box share) | Sales by variant | Dashboard | Weekly | 3-box ≥40% of units |
| Bundle attach / upsell take rate | Post-purchase app + cart events | Dashboard | Monthly | ≥8% |
| Subscription attach rate | Shopify Subscriptions | Dashboard | Monthly | ≥15% of first orders |
| Recovered checkout revenue | Klaviyo flow attribution | Dashboard | Weekly | ≥5% of total revenue |
| Site search: top terms + zero-result terms | Search & Discovery report | Monthly | Zero-result rate <5% |
| Filter usage | Search & Discovery report | Monthly | Retire filters under 2% usage |

## 11. QA checklist before this phase is signed off

- [ ] Every published collection renders with ≥2 products, correct sort, and a written intro paragraph
- [ ] Unpublished scaffolding collections return 404 to shoppers but exist in admin
- [ ] Tag taxonomy applied to all three BIO N:OV variants; Flow rules test-fired
- [ ] Predictive search returns BIO N:OV for `bionov`, `bio nov`, `nitric oxide`, `garlic`
- [ ] Filters render human labels, never raw tags
- [ ] Breadcrumbs + `BreadcrumbList` schema validate in Rich Results Test
- [ ] Every wallet button renders on a **real** iOS device and a real Android device
- [ ] Live S$1 order completed on card, Shop Pay, Apple Pay, Google Pay, PayPal, then refunded
- [ ] Duties display correctly on an EU, UK and AU test address
- [ ] Free-shipping progress bar calculates against the correct market threshold
- [ ] Shopify's own abandoned-checkout email is OFF; Klaviyo's is ON; exactly one email arrives
- [ ] Discount code applies and displays correctly at checkout in every market currency
- [ ] Checkout branding matches the theme (logo, navy, cyan CTA)
- [ ] Order status page shows tracking, support contact and policy links

## 12. Deliverables

| Deliverable | Where |
|---|---|
| Collection architecture + exact smart rules | §1.2 |
| Tag taxonomy | §1.1 |
| Navigation & discovery spec | §2 |
| Search & Discovery filter config | §2.1 |
| Merchandising runbook (no-code) | §3 |
| Checkout settings table | §4 |
| Payment method matrix by market | §4.1 |
| Discounting mechanism decision table | §4.2 |
| Cart/checkout upsell matrix | §5 |
| Conversion feature build checklist | §6 |
| Customer confidence visibility matrix | §7 |
| CRO checklist with prioritisation | §9 |
| Analytics framework | §10 |
| QA checklist | §11 |

## ✅ Phase 11 exit criteria

- [ ] Tag taxonomy documented and applied; no ad-hoc tags in the catalog
- [ ] All 12 collections created with the exact rules in §1.2; scaffolding collections unpublished
- [ ] Three Shopify Flow merchandising automations live and test-fired
- [ ] `bundles`, `subscriptions`, `offers` and `all` published and linked from nav, footer and homepage
- [ ] Search & Discovery installed: predictive search, synonyms, complementary products, filter set configured
- [ ] Breadcrumbs and collection SEO copy live on every published collection
- [ ] Every checkout setting in §4 matches the table, verified in admin
- [ ] Marketing consent checkbox is **not** pre-selected in any market
- [ ] Shopify abandoned-checkout email disabled; Klaviyo recovery confirmed as the only sender
- [ ] All express wallets live-tested on real iOS and Android devices, then refunded
- [ ] Duties/import tax display verified for EU, UK and AU
- [ ] Cart upsell matrix implemented; only one offer shown per surface
- [ ] Free-shipping threshold set per market at ~1.3× AOV
- [ ] Delivery estimate and secure-payment messaging live on PDP, cart and checkout
- [ ] CRO items #1–6 shipped; test backlog prioritised with a single active test
- [ ] Analytics framework built in Looker Studio and reconciling to Shopify within 5%
- [ ] No collection title, handle, filter label or tag contains a disease claim
