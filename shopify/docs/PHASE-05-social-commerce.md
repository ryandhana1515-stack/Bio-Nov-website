# Phase 5 — Facebook, Instagram & TikTok Commerce

**Goal:** Product catalog synced everywhere, pixels + server-side events firing, shops live on Meta and TikTok.

> Prerequisite: product live, policies published, domain verified. Supplements are a **restricted-ish category** on both platforms — keep storefront and ad claims to structure/function "supports" language or catalogs/ads get rejected.

## 1. Meta (Facebook + Instagram)

### Connect
1. Install the **Facebook & Instagram** app (Shopify App Store) → log in with the Business Manager that owns the "Bio Green Elixirs" page and @biogreenelixirs IG.
2. Connect: Business Manager → Page → IG business profile → **new Commerce Account** → **Catalog** (auto-created, syncs all published products hourly).
3. **Verify domain** in Business Manager (Settings → Brand Safety → Domains → meta-tag method; the Shopify app injects it).

### Pixel + Conversions API (server-side)
- In the app's settings enable **Maximum data sharing** — this activates both the browser Meta Pixel *and* the **Conversions API** server-side events with automatic deduplication. No code needed; do NOT also paste a manual pixel snippet (double-firing).
- Events flowing: PageView, ViewContent, AddToCart, InitiateCheckout, Purchase (with value/currency).
- Test with Meta Events Manager → Test Events + a live test order.

### Shops
- In Commerce Manager: enable **Facebook Shop + Instagram Shopping**, checkout method = **on website** (checkout on Shopify keeps Markets/currencies/analytics unified; on-Facebook checkout is US-only anyway).
- Instagram: once catalog approves, enable **product tags** in posts, Reels, Stories; add the shop tab to the profile.
- Collections in Commerce Manager: "BIO N:OV", "Bundles & Savings".

### Category compliance
- Catalog category: Health & Beauty → Vitamins & Supplements. No before/after imagery, no disease claims, no personal-attribute targeting copy ("do YOU have high blood pressure?" is not allowed — use "supports healthy circulation" framing).

## 2. TikTok

### Connect
1. Install the **TikTok** app (Shopify App Store) → connect the TikTok For Business account behind @biogreenelixirs.
2. Enable **TikTok Pixel** via the app (choose Advanced/Maximum matching) — this also provisions **Events API** server-side with deduplication.
3. Sync catalog to **TikTok Catalog Manager**.

### TikTok Shop (Singapore first)
1. Register at seller-sg.tiktok.com with ACRA business documents (already in progress per your setup).
2. In Seller Center: **link the Shopify store** via the TikTok Shop connector app (official "TikTok Shop" app in Shopify App Store handles product/order/inventory sync — orders land in Shopify as the master database).
3. Category application: Health/Dietary Supplements requires document review (product certificates, GMP, label). Submit early — approval can take days-weeks.
4. Enable: **product showcase on profile**, **video shopping tags**, **LIVE shopping** once the account has access.

### Affiliate creators (TikTok Shop)
- Seller Center → Affiliate Center → **Open plan**: 15-20% commission (per playbook), free-sample program for 10k-200k-follower health/wellness creators.
- Target plans for top converters at 20-25%.

## 3. UGC & creator flywheel (both platforms)

- Loox/Judge.me review photos → repost to IG/TikTok (with consent checkbox in review form).
- Hashtags: #BioGreenElixirs #BIONOV #NitricOxide #KoreanHealth.
- Whitelist top creator content as Spark Ads (TikTok) / Partnership Ads (Meta) — creator auth via Ads Manager.

## 4. Validation checklist

- [ ] Meta: domain verified, catalog approved, pixel + CAPI events deduplicating (Events Manager shows "server + browser, deduplicated")
- [ ] IG shop tab live, product tagging enabled
- [ ] TikTok pixel + Events API firing (TikTok Events Manager test)
- [ ] TikTok Shop SG approved for supplements category, catalog synced, test order flows into Shopify
- [ ] Affiliate open plan live with commission set
- [ ] All ad/storefront copy compliance-checked (no treatment claims)
