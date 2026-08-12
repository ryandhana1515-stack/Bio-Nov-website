# Phase 6 — Google Merchant Center & SEO Infrastructure

**Goal:** Own the Google surface — free Shopping listings + paid campaigns feeding from a clean product feed, and organic rankings for nitric oxide supplement intent across all 8 markets.

> ⚠️ Supplements are a **restricted category** on Google Shopping and Google Ads. Feeds get scrutinised, ads get manually reviewed, and disease-treatment language triggers instant disapproval under the Healthcare & Medicines policy. Every title, description, landing page and ad asset in this phase must use **"supports / helps maintain"** structure-function language. No "lowers blood pressure", no "treats", no percentages from lab data.

## 1. Google account architecture

Create/claim in this order — each one depends on the previous.

| # | Account | Identity to use | Purpose | Gotcha |
|---|---|---|---|---|
| 1 | **Google Account** | `info@biogreenelixirs.com` (Google Workspace, not a personal Gmail) | Root owner of everything below | Never build the stack on a personal Gmail — it can't be transferred cleanly |
| 2 | **Google Search Console** | Domain property `biogreenelixirs.com` | Indexing, sitemaps, query data | Use **Domain** property (DNS TXT), not URL-prefix — it covers www + all subfolders `/en-us/`, `/en-gb/` |
| 3 | **Google Analytics 4** | New GA4 property, SGD reporting currency, timezone Asia/Singapore | Behaviour + conversion reporting | Reporting currency must match Shopify payout currency (SGD) or revenue reconciliation breaks |
| 4 | **Google Tag Manager** | Optional container | Only needed for non-standard tags | Shopify's Google & YouTube app installs GA4 + Ads tags natively — **do not** double-install via GTM |
| 5 | **Google Merchant Center** | Business name **Bio Green Elixirs Pte Ltd**, website `biogreenelixirs.com` | Product feed → free listings + Shopping ads | Requires verified + claimed website |
| 6 | **Google Ads** | Linked to MC + GA4 | Search / Shopping / PMax / remarketing | Set account currency SGD, billing to the SG entity |

Link map (all links are two-way approvals — accept the invite on both sides):

```
Google Account (info@biogreenelixirs.com)
   ├── Search Console  ── verified DNS ──► biogreenelixirs.com
   ├── GA4 property ◄──── linked ────► Google Ads (audiences + conversions import)
   ├── Merchant Center ◄─ linked ──► Google Ads (Shopping/PMax inventory)
   └── Shopify "Google & YouTube" app ──► pushes feed + tags + conversions
```

## 2. Merchant Center via the Google & YouTube app

Do not build a manual feed. The official app maintains it.

1. Shopify Admin → **Apps → Google & YouTube** (free, by Google) → Install.
2. Connect the `info@` Google Account → connect/create the Merchant Center account.
3. **Claim and verify** `biogreenelixirs.com` — app handles the meta-tag; confirm in MC → Business info → Website (must show "Claimed").
4. Business info: legal name **Bio Green Elixirs Pte Ltd**, ACRA-registered address, `info@biogreenelixirs.com`, support phone.
5. **Shipping:** the app can sync Shopify shipping settings. Verify each MC shipping service matches the Phase 4 rate table exactly (SG S$5, US flat US$12, EU €12 …). Mismatched shipping cost is the #1 silent cause of "Item disapproved: shipping".
6. **Tax:** US destination tax = "no nexus / not collected" until registered. SG GST inclusive if registered. EU/UK/AU prices display tax-inclusive — MC must be told the price *includes* tax for those countries or you get price-mismatch errors.
7. Target countries: add SG first, then US, GB, DE, FR, NL, AU, CA, MY. One feed, multi-country via the app's market settings (mirrors Shopify Markets).
8. Turn on **free listings (Surfaces across Google)** — zero cost, no reason not to.
9. Wait 3–5 business days for initial product review. Supplements often sit in "Pending review" longer than average.

### 2.1 Required feed attributes for supplements

| Attribute | Value for BIO N:OV | Why it matters |
|---|---|---|
| `id` | `BNOV-001` / `BNOV-003` / `BNOV-006` | Must equal Shopify SKU; never reuse an id |
| `title` | `BIO N:OV Nitric Oxide Support Supplement — Fermented Garlic, 60 Tablets (20-Day Supply)` | Front-load keyword + form + count. ≤150 chars |
| `description` | Structure-function copy, ingredients, count, directions | No claims. First 160 chars carry the weight |
| `link` | Market-correct URL (`/products/bio-nov`, `/en-us/products/bio-nov`) | Must resolve without redirect |
| `image_link` | Hero pack shot, ≥800×800, white/neutral bg, no text overlay | Promo text burned into images = disapproval |
| `availability` | `in_stock` | Auto from Shopify inventory |
| `price` | Per-market, tax handling per country | Must match landing page **exactly**, to the cent |
| `brand` | `BioExcela` | Required |
| `gtin` | Barcode from the Korean manufacturer | **Get this from the supplier.** Missing GTIN suppresses reach badly |
| `mpn` | Manufacturer part no. | Fallback if no GTIN (then set `identifier_exists: no` — last resort) |
| `condition` | `new` | Required |
| `google_product_category` | **2984 — Health & Beauty > Health Care > Vitamins & Supplements** | Wrong category = policy misclassification and disapproval |
| `product_type` | `Supplements > Nitric Oxide Support` | Your own taxonomy, used for campaign segmentation |
| `adult` | `no` | Explicit is safer for health SKUs |
| `shipping` | Per-country from Phase 4 table | See above |
| `age_group` | `adult` | Supplements are adult-intended |
| `multipack` | `3` / `6` on the bundle variants | Bundle SKUs mis-flagged as single units get price-comparison penalties |

> ⚠️ **GTIN is a real blocker.** Request the barcode/EAN from the Korean manufacturer now — it has a lead time and Shopping performance without it is materially worse.

## 3. Google Ads readiness

Do not launch campaigns in this phase — build the scaffolding so Phase 9 can measure them.

### 3.1 Conversion tracking

1. Google & YouTube app → enable **conversion tracking** (installs the Google tag + enhanced conversions).
2. In Google Ads → Goals → Conversions, confirm: `Purchase` (primary, value + currency), `Begin checkout`, `Add to cart`, `Page view` (secondary).
3. Turn on **Enhanced conversions for web** (hashed email from checkout) — recovers 5–15% of attribution lost to iOS/ITP.
4. Import GA4 events only if not already tracked natively — **never double-count Purchase**. Pick one source of truth: the Google tag.
5. Attribution model: **data-driven**, 30-day click / 1-day engaged-view.

### 3.2 Account structure (build now, fund later)

| Campaign | Type | Targeting | Budget signal | Notes |
|---|---|---|---|---|
| `SG-Search-Brand` | Search | "bio nov", "bioexcela", brand misspellings | Low, always-on | Cheap defensive coverage |
| `SG-Search-Generic` | Search | Non-brand keyword map below | Test S$30/day | Exact + phrase only at first |
| `SG-Shopping-Standard` | Standard Shopping | All SKUs | Test S$20/day | Run standard before PMax so you get query data |
| `SG-PMax-Retail` | Performance Max | Feed + assets | After 30 days of data | PMax is a black box — only run it once Shopping/Search have proven the offer |
| `Remarketing-Display` | Display | GA4 audiences: cart abandoners 30d, PDP viewers 14d, purchasers 60d (exclude) | Low | See policy note below |
| `US-*` / `EU-*` | Mirror of SG set | Per market, separate budgets | After SG soft-launch validates | Phase 10 gates this |

### 3.3 Audiences

Build in GA4, share to Ads: `All PDP viewers (14d)`, `Add-to-cart no purchase (30d)`, `Checkout abandoners (7d)`, `Purchasers (60d — exclusion + replenishment at day 15+)`, `Blog readers (30d)`.

> ⚠️ **Personalised-advertising policy.** Google forbids remarketing built around inferred health conditions, and forbids ad copy that implies knowledge of the user's health ("Struggling with high blood pressure?"). Audiences must be behaviour-based (visited page X), never condition-based. Copy addresses the *product*, not the *person's* condition.

## 4. SEO foundation

### 4.1 Keyword map

One target page per keyword cluster. No two pages compete for the same head term.

| Keyword | Est. intent | Difficulty | Target page |
|---|---|---|---|
| `nitric oxide supplement` | Commercial | High | `/products/bio-nov` (PDP) |
| `best nitric oxide supplement` | Commercial investigation | High | `/blogs/journal/how-to-choose-a-nitric-oxide-supplement` |
| `korean nitric oxide supplement` | Commercial, low competition | Low | `/products/bio-nov` (secondary H2 + FAQ) |
| `nitric oxide supplement singapore` | Local commercial | Low | `/pages/singapore-delivery` or PDP `/` market page |
| `NO supplement for circulation` | Commercial | Medium | `/blogs/journal/nitric-oxide-and-healthy-circulation` |
| `fermented garlic extract benefits` | Informational | Low | `/blogs/journal/fermented-garlic-extract-explained` |
| `fermented lettuce extract nitrate` | Informational, very low comp | Low | `/blogs/journal/dietary-nitrates-and-nitric-oxide` |
| `what is nitric oxide` | Informational, top-of-funnel | Medium | `/blogs/journal/what-is-nitric-oxide` |
| `nitric oxide supplement side effects` | Informational, high-trust | Medium | `/pages/faq` + PDP FAQ block |
| `L-arginine vs fermented nitrate` | Comparison | Low | `/blogs/journal/three-generations-of-nitric-oxide-technology` |
| `nitric oxide supplement for men over 40` | Commercial long-tail | Low | `/blogs/journal/nitric-oxide-support-after-40` |
| `GMP certified supplement korea` | Trust/verification | Low | `/pages/quality-and-certifications` |
| `bio nov` / `bioexcela` | Brand navigational | — | Homepage + PDP |

Cadence: 2 articles/month, 1,200–1,800 words, each internally linking to the PDP with descriptive anchor text ("nitric oxide support supplement"), never "click here".

### 4.2 On-page standards

| Element | Rule | BIO N:OV example |
|---|---|---|
| Title tag | ≤60 chars, keyword first, brand last | `Nitric Oxide Supplement — Fermented Garlic 60 Tablets \| BioExcela` |
| Meta description | 140–158 chars, benefit + differentiator + soft CTA, structure-function only | `BIO N:OV supports healthy circulation with patented Korean fermented garlic and lettuce extracts. GMP-certified. 60 tablets, worldwide shipping.` |
| H1 | Exactly one, contains primary keyword | `BIO N:OV — Third-Generation Nitric Oxide Support` |
| H2/H3 | Question-form where possible (feeds AI overviews + FAQ schema) | `How does fermented garlic support nitric oxide?` |
| URL | Lowercase, hyphenated, ≤5 words, no dates | `/blogs/journal/what-is-nitric-oxide` |
| Image alt | Descriptive, keyword-natural, no stuffing | `BIO N:OV nitric oxide supplement box with 60 tablets` |
| Internal links | 3–5 contextual links per article, ≥1 to PDP | — |
| Canonical | Self-referencing on every page | Shopify emits by default; verify on variant URLs (`?variant=`) |

### 4.3 Schema (already shipped in the theme)

The **BioExcela Prestige** theme already emits JSON-LD:

- `Product` with per-variant `offers` (price, currency, availability) on the PDP
- `FAQPage` on the PDP FAQ section and `/pages/faq`
- `Organization` + `BreadcrumbList` sitewide

Still to add manually: `Article` schema on blog posts (theme blog template), and `AggregateRating` — which switches on automatically once Loox/Judge.me has **genuine** reviews.

> ⚠️ Never hand-code `AggregateRating` with invented numbers. It is structured-data spam, it earns a manual action, and for a health product it is a consumer-protection exposure under FTC and HSA rules alike.

### 4.4 Sitemap & robots

- Shopify auto-generates `/sitemap.xml`. Submit it in Search Console once out of password mode.
- Submit market sitemaps too: `/en-us/sitemap.xml`, `/en-gb/sitemap.xml`, etc.
- `robots.txt.liquid`: block `/search`, `/cart`, `/checkout`, `/account`, and internal filter/sort URLs (`?sort_by=`, `?filter.`) to preserve crawl budget.
- Verify `hreflang` tags render across market subfolders (Shopify Markets emits these automatically — confirm in page source).

## 5. Technical SEO / Core Web Vitals

| Metric | Target | Lever |
|---|---|---|
| LCP | < 2.5 s mobile | Hero image as `preload` + WebP, no hero carousel, no above-fold video |
| INP | < 200 ms | Defer non-critical JS; cap apps — every app injects script |
| CLS | < 0.1 | Explicit width/height on all images; reserve space for review widget + sticky ATC bar |
| Page weight | < 2 MB mobile | Compress product photography to ≤200 KB each; Shopify `image_url: width:` params |
| Requests | < 60 | Audit installed apps quarterly; uninstall anything unused (script tags linger) |

Checks: PageSpeed Insights (real URL, mobile), Search Console → Core Web Vitals report, Shopify Admin → Online Store → Speed report (directional only). Lazy-load everything below the fold except the LCP element — never lazy-load the hero.

## 6. Content strategy

| Content type | Cadence | Purpose | Compliance rule |
|---|---|---|---|
| PDP (SEO-optimised) | Once, then quarterly refresh | Commercial capture | Label-approved copy only |
| Ingredient deep-dives | 1/month | Long-tail + E-E-A-T | Describe the ingredient and traditional/nutritional context. No efficacy claims |
| "How to choose" comparison | 1 evergreen, refreshed | Mid-funnel capture | Compare *formats and technology generations*, never competitor efficacy |
| FAQ page | Once + additions from support tickets | Featured snippets + FAQ schema | Mirror the AI knowledge base (Phase 7) so answers never diverge |
| Quality & certifications page | Once | Trust: patent KACC91554P, GMP, Korean manufacturing | State facts (patent no., certification) — facts are safe, claims are not |
| Wellness/lifestyle | 1/month | Top-of-funnel + email fodder | General wellness education, product mentioned as support, not solution |

E-E-A-T for a health brand: publish an About page with the real entity (Bio Green Elixirs Pte Ltd, ACRA no.), a contactable address and email, named author bylines, and a "last reviewed" date on health content. Google's YMYL standards apply to supplements.

## 7. Analytics & reporting

| Question | Source | Report |
|---|---|---|
| Organic sessions + revenue by country | GA4 | Traffic acquisition, filter `Organic Search`, dimension Country |
| Which queries earn impressions/clicks | Search Console | Performance → Queries, 28-day rolling |
| Which pages gain/lose rankings | Search Console | Performance → Pages, compare period-over-period |
| Shopping/free-listing performance | Merchant Center | Performance → Free listings + Ads |
| Feed health | Merchant Center | Diagnostics → Item issues |
| Paid conversions + ROAS | Google Ads | Campaigns, conversions = Purchase |
| Indexing coverage | Search Console | Pages → Indexed vs Not indexed |

Link Search Console **to GA4** (Admin → Product links) so query data appears alongside behaviour data.

## 8. Operational dashboard (weekly, 20 minutes)

| Panel | Metric | Green | Investigate |
|---|---|---|---|
| Feed health | Active vs disapproved items | 100% active | Any disapproval |
| Indexing | Indexed pages vs submitted | ≥95% | Sudden drop >10% |
| Search performance | Impressions, clicks, avg position | Week-over-week growth | Impressions flat 4+ weeks |
| Shopping | Clicks, CTR, conversion rate | CTR >0.8% | CTR <0.4% (title/image problem) |
| Campaign performance | Spend, conv., ROAS | ROAS ≥ target from Phase 9 | 3 days below break-even |
| Technical SEO | CWV pass rate, crawl errors | All URLs "Good" | Any "Poor" group |

## 9. Merchant Center troubleshooting — supplement-specific

| Disapproval / warning | Real cause | Fix |
|---|---|---|
| **Unapproved pharmaceuticals and supplements** | An ingredient or phrasing matched a restricted list, or copy implies treatment | Remove all condition/efficacy language from title, description and landing page. Ingredients stated plainly. Re-request review |
| **Misleading claims (Healthcare & medicines)** | "lowers blood pressure", "clinically proven", percentages | Rewrite to "supports healthy circulation", "helps maintain". Purge the landing page too — reviewers read it |
| **Personalised advertising policy violation** | Copy addresses a health condition in second person | Rewrite to product-centric framing |
| **Price mismatch** | MC price ≠ landing page price (tax-inclusive markets, or a live discount) | Align tax settings per country; let the app resync; never run a price change without letting the feed refresh |
| **Image issues: promotional overlay** | Sale badge/text burned into the product image | Use a clean pack shot as `image_link`; put badges in `additional_image_link` or nowhere |
| **Missing GTIN / identifier** | Supplier barcode not populated | Obtain EAN from manufacturer; interim: set `mpn` + `identifier_exists: no` |
| **Shipping cost mismatch** | MC shipping ≠ checkout shipping | Rebuild MC shipping services to mirror the Phase 4 table exactly |
| **Website not claimed** | Verification lost after domain/theme change | Re-verify via the Google & YouTube app; re-claim in MC |
| **Landing page not working / country mismatch** | Market redirect sends US traffic away from the `/en-us/` URL | Ensure feed links use the market URL and Shopify's geo-redirect doesn't bounce Googlebot |
| **Account suspended: policy violation** | Repeat/severe health-claim breach | Fix *every* SKU and the whole site, then submit one carefully documented appeal. Repeated failed appeals are hard to recover from |

> ⚠️ Merchant Center suspension for a supplement account is genuinely difficult to reverse. Audit copy **before** the first feed submission, not after a disapproval.

## 10. Deliverables from this phase

| Deliverable | Format | Owner |
|---|---|---|
| Account connection workflow | This doc §1 + screenshots of each link confirmed | Ryan |
| Merchant Center config guide | §2 + the feed attribute table signed off | Ryan |
| Keyword map | §4.1, maintained as a sheet with rank tracking | Marketing |
| SEO on-page standard | §4.2, applied to every new page before publish | Content |
| Reporting framework | §7 + Looker Studio template (built in Phase 9) | Analytics |
| Troubleshooting guide | §9 | Ops |
| QA checklist | Exit criteria below | Ryan |

## ✅ Phase 6 exit criteria

- [ ] Google Workspace account `info@biogreenelixirs.com` owns all Google properties
- [ ] Search Console **Domain** property verified; sitemap + all market sitemaps submitted and processing
- [ ] GA4 property live, SGD, Asia/Singapore, linked to both Ads and Search Console
- [ ] Google & YouTube app installed; Merchant Center claimed and verified
- [ ] Feed live with **zero disapprovals**; `google_product_category` = 2984 on every SKU
- [ ] GTIN obtained from the Korean manufacturer and populated (or documented exception)
- [ ] MC shipping + tax settings byte-match the Phase 4 shipping table and market tax display rules
- [ ] Free listings enabled and serving
- [ ] Conversion tracking verified with a real test order (Purchase fires once, correct value + currency)
- [ ] Enhanced conversions enabled
- [ ] Google Ads account structured (campaigns built, paused, unfunded) with data-driven attribution
- [ ] GA4 audiences created and shared to Ads — all behaviour-based, zero condition-based
- [ ] Every title/meta/H1 across the site written to the §4.2 standard
- [ ] JSON-LD Product + FAQPage validated in Rich Results Test; Article schema added to blog
- [ ] Core Web Vitals: LCP <2.5 s, INP <200 ms, CLS <0.1 on mobile PDP
- [ ] First 4 SEO articles published with internal links to the PDP
- [ ] Full compliance sweep: no disease-treatment claim anywhere in feed, site, or ad drafts
