# BioExcela Global — Master Implementation Plan

**Brand:** BioExcela Global (operated by Bio Green Elixirs, Singapore/ACRA)
**Hero product:** BIO N:OV — 3rd-generation nitric oxide support, 500 mg × 60 tablets
**Platform:** Shopify (master database for orders, inventory, customers)
**Primary markets:** Singapore, US, Europe → then AU, CA, MY, UK → worldwide

## What's in this repo

| Path | Contents |
|---|---|
| `shopify/theme/` | Complete custom OS 2.0 theme "BioExcela Prestige" — push with Shopify CLI |
| `shopify/data/` | BIO N:OV import CSV, metafield architecture, navigation/collections plan |
| `shopify/docs/PHASE-01…05` | Click-by-click playbooks for the five delivered phases |
| `app/`, `components/` | Original Next.js BIO N:OV landing page (kept; usable as a standalone campaign page on Vercel) |

## Phase status

| # | Phase | Status |
|---|---|---|
| 1 | Store architecture & technical setup | ✅ Playbook + theme + data delivered |
| 2 | Theme / UX / UI design system | ✅ Theme built + playbook |
| 3 | Product catalog & BIO N:OV PDP | ✅ CSV + metafields + PDP built |
| 4 | Global payments, shipping, Markets | ✅ Playbook delivered |
| 5 | Facebook / Instagram / TikTok commerce | ✅ Playbook delivered |
| 6 | Google ecosystem (Merchant Center, GA4, GTM, PMax, Search Console) | ⏳ Awaiting your next PDF batch |
| 7 | Email & SMS automation (Klaviyo flows: welcome, abandoned cart, browse, post-purchase, winback, VIP, birthday) | ⏳ Awaiting PDFs |
| 8 | Affiliate program (GoAffPro: links, dashboards, commissions, payouts, leaderboard) | ⏳ Awaiting PDFs |
| 9 | Creator program (application, approval, content library, Spark/Partnership ads) | ⏳ Awaiting PDFs |
| 10 | SEO (schema done in theme; keyword map, blog engine, internal linking, CWV) | ⏳ Awaiting PDFs |
| 11 | Analytics & dashboards (GA4 + server-side, ROAS/CAC/LTV/AOV reporting) | ⏳ Awaiting PDFs |
| 12 | CRO program (A/B tests, exit intent, bundles/upsell apps, one-click upsells) | ⏳ Awaiting PDFs |
| 13 | Customer support (Tidio AI, WhatsApp, helpdesk, returns portal) | ⏳ Awaiting PDFs |
| 14 | Automation (Shopify Flow library, segmentation, review requests, payouts) | ⏳ Awaiting PDFs |
| 15 | Wholesale & corporate | ⏳ Awaiting PDFs |
| 16 | Testing & QA | ⏳ Awaiting PDFs |
| 17 | Launch checklist | ⏳ Awaiting PDFs |

Upload the next 10 PDFs and each remaining phase gets the same treatment: playbook + any code/data artifacts.

## Launch-critical decisions for Ryan (owner input needed)

1. **Primary domain:** biogreenelixirs.com or buy bioexcela.com? (Pick before pixels/SEO/Markets go live.)
2. **Final pricing** per pack size and per market (CSV uses a placeholder $89 / $239 / $427 USD-equivalent ladder).
3. **Legal/label copy:** ingredients, directions, warnings must come from the authorised label; storefront keeps "supports" language — the aggressive lab-data claims (25% BP drop etc.) need regulatory sign-off per market before public use.
4. **Reviews:** provide genuine, consented customer reviews to seed Loox — placeholders must be replaced before launch.
5. **Shopify plan level** and whether to activate Managed Markets for duties-paid international selling.

## Quick-start order of operations

1. Phase 1 playbook top to bottom (store, domain, settings, theme push)
2. Import product CSV → fill metafields → upload media
3. Phase 4 (payments/Markets/shipping) — needed before any test order
4. Phase 3 apps (reviews, subscriptions)
5. Phase 5 (Meta + TikTok) once the store is out of password mode
6. Then Phases 6-17 as the next briefs arrive
