# BioExcela Global — BIO N:OV E-commerce Ecosystem

Global Shopify e-commerce build for **BioExcela Global** (Bio Green Elixirs, Singapore), launching **BIO N:OV** — a third-generation nitric oxide support supplement made in Korea with patented microbial fermentation.

## Repository map

| Path | What it is |
|---|---|
| `shopify/theme/` | **BioExcela Prestige** — complete custom Shopify OS 2.0 theme (navy/cyan glassmorphism, mobile-first, CRO-optimized PDP with sticky ATC, JSON-LD schema, metafield-driven accordions) |
| `shopify/data/` | BIO N:OV product import CSV · metafield architecture · navigation/collections plan |
| `shopify/docs/` | Phase 1-10 implementation playbooks + `MASTER-PLAN.md` |
| `app/`, `components/`, `public/` | Original Next.js BIO N:OV landing page (deployable to Vercel as a campaign page) |
| `CONTENT_VERIFICATION.md` | Legal/scientific claims checklist — review before publishing any copy |

## Deploy the Shopify theme

```bash
npm install -g @shopify/cli @shopify/theme
cd shopify/theme
shopify theme push --store=YOUR-STORE.myshopify.com --unpublished --theme="BioExcela Prestige"
```

Then publish from Admin → Online Store → Themes. Start with `shopify/docs/PHASE-01-architecture.md`.

## Run the Next.js landing page

```bash
npm install
npm run dev   # http://localhost:3000
```

## Status

All 10 briefed phases delivered: architecture, design system, catalog/PDP, Markets/payments/shipping, Meta+TikTok commerce, Google/SEO, CRM+email+SMS+AI agents, affiliate/creator program, analytics/KPI dashboards, and launch checklist + SOPs. See `shopify/docs/MASTER-PLAN.md`.
