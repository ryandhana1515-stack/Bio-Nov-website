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
| 6 | Google Merchant Center & SEO infrastructure | ✅ `PHASE-06-google-seo.md` |
| 7 | Email, SMS, CRM & AI agent automation | ✅ `PHASE-07-crm-email-sms-ai.md` |
| 8 | Global affiliate & creator program | ✅ `PHASE-08-affiliate-creator.md` |
| 9 | Analytics & KPI dashboard | ✅ `PHASE-09-analytics-kpi.md` |
| 10 | Global launch checklist & SOPs | ✅ `PHASE-10-launch-sop.md` |

**All ten briefed phases are delivered.** Phases 6-10 absorbed the work originally sketched as phases 11-17 in the first master brief (SEO, analytics, support, QA and launch all live inside the Phase 6-10 documents).

### Still open (not covered by any brief yet)

| Topic | Where it would go |
|---|---|
| CRO testing programme (A/B tests, exit intent, one-click post-purchase upsells) | New phase — worth doing after 30 days of live traffic |
| Wholesale & corporate B2B channel | New phase — needs pricing tiers and net-terms policy first |
| Subscription retention deep-dive (churn flows, dunning) | Extension of Phase 7 |

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
