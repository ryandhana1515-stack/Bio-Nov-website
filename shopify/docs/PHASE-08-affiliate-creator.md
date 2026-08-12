# Phase 8 — Global Affiliate & Creator Program

**Goal:** A transparent partner program anyone can join in five minutes, where BioExcela handles payment, fulfilment and service, and partners only have to send traffic — with commissions calculated automatically and compliance enforced before it becomes a regulator's problem.

> ⚠️ Affiliates are the single largest compliance risk a supplement brand carries. In the US, the **FTC holds the advertiser liable for claims its affiliates make** — an affiliate writing "cured my blood pressure" is your violation, not just theirs. Every partner must accept the marketing rules in §7 at signup, and you must monitor and enforce them. This is why the program terms and the takedown process below are not optional paperwork.

## 1. Platform stack

| Platform | Role | Cost |
|---|---|---|
| **GoAffPro** | Core affiliate + creator program: registration, links, coupons, tracking, tiers, commission engine, payouts, partner dashboard | Free tier to start; Pro ~US$24/mo for tiers, MLM-off, custom domains |
| **TikTok Shop Affiliate Center** | TikTok-native creators — commission is handled inside TikTok Shop, not GoAffPro | % commission only |
| Shopify Collabs | Optional secondary creator discovery | Free |
| Klaviyo | Partner onboarding + nudge emails (segment tagged `affiliate`) | Existing |
| Shopify Flow | Fraud flags, partner tagging, payout-window automation | Free |

> ⚠️ Do **not** run the same creator through both GoAffPro and TikTok Shop Affiliate for the same sale. Rule: **TikTok Shop orders are attributed in TikTok. Everything else is attributed in GoAffPro.** Write this into the terms so you never pay twice on one order.

## 2. Member registration & onboarding

1. Public landing page at `/pages/affiliates` — earnings, tiers, what you get, one CTA.
2. Signup form (GoAffPro): name, email, country, socials/website, audience size, promotion method, payout method, **tick to accept Program Terms + Marketing Guidelines**.
3. **Manual approval** for the first 100 partners (fraud control), then auto-approve applicants with a verifiable audience and manual review of the rest.
4. On approval, the partner receives: unique member ID, referral link `biogreenelixirs.com/?ref=XXXX`, personal coupon code (`RYAN10` pattern: partner handle + discount), dashboard login, media library access.
5. Onboarding email series (Klaviyo, 4 emails over 10 days): how tracking works → what you may and may not say → the media library and briefs → first-sale congratulations / nudge.
6. Partner tagged in Shopify + Klaviyo as `affiliate` or `creator` — **suppress consumer promo emails** to partners.

## 3. Commission tiers

| Tier | Qualification (rolling 90 days) | Commission | Extras |
|---|---|---|---|
| **Starter** | Default on approval | **15%** | Referral link + coupon, media library |
| **Pro** | 10 approved orders **or** S$1,500 referred revenue | **20%** | Custom coupon code, early promo access, quarterly bonus eligibility |
| **Elite** | 40 approved orders **or** S$6,000 referred revenue | **25%** | Dedicated contact, custom landing page, product seeding, campaign co-planning |

Tier review runs monthly; tiers never drop mid-month, and a demotion requires two consecutive review periods below threshold.

Commission is calculated on **net product subtotal** — excluding shipping, taxes/duties, and any discount applied. Example: 3-box at S$239 with a 10% coupon → net subtotal S$215.10 → Pro tier 20% → **S$43.02** commission.

## 4. Tracking & attribution rules

| Rule | Setting | Rationale |
|---|---|---|
| Cookie window | **60 days**, last-click | Supplements have a considered purchase cycle; 30 days under-credits creators |
| Attribution model | Last click, affiliate-vs-affiliate | Simple, defensible, industry standard |
| Coupon attribution | Coupon code always wins over cookie | Prevents double payment; a code is explicit intent |
| Paid-ads traffic vs affiliate | Store's own paid click **overrides** an expired-cookie affiliate | You don't pay twice for traffic you bought |
| Cross-device | Coupon codes only | Cookie tracking cannot follow device switches — this is why every partner gets a code |
| Self-referral | Blocked | See fraud rules |
| Subscription orders | First order commissionable; recurring renewals at **5%** for 12 months | Rewards partners who bring subscribers |
| Refunded/cancelled orders | Commission reversed automatically | Non-negotiable |

Real-time metrics visible to the partner: clicks, orders, referred revenue, conversion rate, commission pending/approved/paid, refund adjustments.

## 5. Commission engine & payouts

| Parameter | Value |
|---|---|
| Commission state machine | `Pending` → (after 30-day return window) → `Approved` → (next payout run) → `Paid` |
| Hold period | **30 days** from delivery, matching the returns policy |
| Payout schedule | **Monthly, net-30** — the 15th of each month, covering commissions approved in the prior calendar month |
| Minimum payout | **S$50** (rolls forward if unmet) |
| Payout methods | PayPal (default, global), bank transfer (SG/MY), Wise (EU/UK/AU/CA) |
| Currency | SGD; partners bear FX/receiving fees on their side |
| Refund handling | Automatic clawback from the next payout; if balance goes negative it carries forward |
| Tax | Partners are independent contractors, responsible for their own tax. Collect W-9/W-8BEN for US-payable partners once annual payout exceeds US$600 |
| Statements | Auto-generated per payout, downloadable from the dashboard |

Order-to-payout flow:

```
Customer clicks affiliate link / uses coupon
 → buys on Shopify (BioExcela's gateway, BioExcela's checkout)
 → Bio Green Elixirs fulfils and ships from the Singapore hub
 → GoAffPro records the order + commission as Pending
 → 30-day return window elapses, no refund → Approved
 → Monthly payout run on the 15th → Paid + statement issued
```

The partner never handles payment, stock, shipping or customer service. That is the entire pitch — say it plainly on the landing page.

## 6. Fraud rules & enforcement

| Rule | Detection | Action |
|---|---|---|
| **No self-referral** | Partner email/address/payment instrument matches customer | Commission voided, first offence = warning, second = removal |
| **No coupon/deal sites** | Domain check on referral source; "biogreenelixirs coupon" search monitoring | Rejected at application; removed if discovered |
| **No trademark bidding** | Monthly search for "BIO N:OV", "BioExcela", "Bio Green Elixirs" on Google/Bing | Immediate removal + commission forfeit |
| **Duplicate IP / device clusters** | 3+ orders from one IP across different customers | Manual review, payouts held pending review |
| **Cookie stuffing** | Click-to-order ratio wildly out of band (e.g. >2,000 clicks, 0 orders, or bot-shaped click timing) | Traffic audit, hold payout |
| **Stolen card orders** | Shopify fraud analysis high-risk + affiliate attribution | Commission voided on any charged-back order |
| **Fake/incentivised reviews** | Review app moderation | Removal from program; review deleted |
| **Unauthorised marketplace listing** | Amazon/Lazada/Shopee monitoring | Immediate removal; MAP/channel policy breach |

All payouts above S$500 in a single run get a manual eyeball before release.

## 7. Marketing rules — what partners MAY and MUST NOT say

This table goes verbatim into the Program Terms, the onboarding email, and the media library. Partners tick to accept it.

| ✅ MAY say | ❌ MUST NOT say |
|---|---|
| "supports healthy circulation" | "lowers blood pressure by 25%" — or any number |
| "helps maintain healthy nitric oxide levels" | "treats hypertension / diabetes / erectile dysfunction" |
| "third-generation nitric oxide support from Korea" | "clinically proven to cure…" |
| "made with patented microbial fermentation (KACC91554P)" | "FDA approved" (supplements are not FDA-approved) |
| "GMP-certified manufacturing" | "doctor recommended" (unless a named, disclosed, real doctor) |
| "500 mg × 60 tablets, a 20-day supply at 3 tablets daily" | "replace your medication" / "stop taking your prescription" |
| "part of my daily routine" | "it healed my…" / personal medical testimonials framed as outcomes |
| Genuine personal experience of *taking* the product | Fabricated or borrowed before/after photos of any kind |
| Ingredients: fermented garlic extract, fermented lettuce extract, soybean, soybean sprouts | Invented clinical trial data, fake studies, misquoted research |
| Shipping, pricing and guarantee facts | "Do you suffer from high blood pressure?" — personal-attribute targeting, banned on Meta |
| **`#ad` / `#sponsored` / "paid partnership"** disclosure, clear and up-front | Burying the disclosure in a hashtag wall or below the fold |
| Their own honest opinion | Claims about competitors' products |

Hard rules layered on top:

1. **Disclosure is mandatory and non-negotiable** — FTC Endorsement Guides (US), ASA (UK), ACCC (AU), and Meta/TikTok branded-content tools. `#ad` at the *start* of the caption, verbal disclosure in video within the first 5 seconds.
2. **No trademark bidding** on Google/Bing paid search.
3. **No unauthorised marketplace listings** (Amazon, Shopee, Lazada, eBay).
4. **No email marketing to purchased lists**; spam complaints terminate the partnership.
5. **No impersonating the brand** — no accounts named "BioExcela Official", no branded email addresses.
6. **No medical advice.** If a follower asks a health question, the required answer is "check with your healthcare professional" — same rule as the AI agents in Phase 7.

Enforcement ladder: warning + 48 h takedown → commission hold → removal from program + forfeit. Health-claim breaches skip straight to takedown-within-24-h; repeat health-claim breaches are immediate removal.

## 8. Creator program

Affiliates send traffic. Creators make content. Overlapping but distinct — creators get product, briefs and usage rights; affiliates just get a link.

### 8.1 Seeding workflow

| Step | Action | Detail |
|---|---|---|
| 1. Target | Identify creators | **10k–200k followers**, health/wellness/fitness/longevity, engagement rate >3%, audience in SG/US/AU/UK. Micro beats mega for supplements — trust and CPM economics both favour it |
| 2. Vet | Check before sending | Real engagement (not bot-shaped), no competing supplement partnership in the last 90 days, no history of unsafe health claims |
| 3. Outreach | DM or email | Short, specific, name a reason you chose them, offer free product with no obligation |
| 4. Ship | Send 1 box + brief | Include a printed one-pager: what it is, how to take it, what you may/may not say, `#ad` requirement |
| 5. Follow up | Day 7 and day 21 | Day 7: "did it arrive?" Day 21: they've finished the 20-day supply — best moment to ask for content |
| 6. Convert | Offer affiliate terms | Good content → Pro tier (20%) + custom code + campaign brief |
| 7. Amplify | Whitelist top performers | Spark Ads (TikTok) / Partnership Ads (Meta) — see Phase 5. Get written usage rights first |

Budget rule: seed 20 creators/month at roughly S$25 landed cost each ≈ S$500/month. Expect 40–60% to post; 2–3 to produce genuinely usable content. That is a normal and acceptable hit rate.

### 8.2 Campaign brief template

```
CAMPAIGN: [name]            DATES: [live] – [end]
CREATOR: [@handle]          TIER/RATE: [20% + code CREATOR20]

THE PRODUCT
BIO N:OV — third-generation nitric oxide support from Korea.
Patented microbial fermentation (KACC91554P). GMP-certified.
500 mg × 60 tablets = 20-day supply at 1 tablet, 3× daily.
Ingredients: fermented garlic extract, fermented lettuce extract,
soybean, soybean sprouts.

WHAT WE WANT
Format: [Reel / TikTok / Story set / static carousel]
Length: [15–30 s]
Hook idea (yours is better — this is a starting point):
  "Third-generation nitric oxide support — here's what that means."
Must include: product visible + legible, your honest experience,
  the code, #ad at the START of the caption.
Must NOT include: any health claim, any medical outcome, any
  before/after, any mention of a condition or medication.
Language to use: "supports healthy circulation", "helps maintain".

DELIVERABLES + DATES
[1× Reel by DD/MM] · [3× Stories by DD/MM] · [raw files for whitelisting]

USAGE RIGHTS
[90 days paid amplification across Meta + TikTok] — signed separately.

APPROVAL
Send a draft 48 h before posting. We review for compliance only —
we will not change your voice, only flag language we cannot run.
```

The compliance-only review promise matters: creators resist brand control of their voice, and they accept a narrow legal review. It also gives you a documented pre-publication check, which is exactly what an FTC or HSA enquiry would ask about.

### 8.3 Media library

Hosted in the GoAffPro partner dashboard: pack shots on transparent + white + navy, lifestyle imagery, 3-generations infographic, logo pack, brand colours/fonts, approved copy blocks (headlines, captions, the may/must-not table), 15/30/60 s b-roll, and the FTC disclosure guide. Everything pre-cleared — if it's in the library, it's safe to post.

## 9. AI automation for partners

Reuse the Phase 7 architecture with a partner-facing agent:

| Question type | AI handles | Escalates |
|---|---|---|
| "How do I get my link?" | ✅ Dashboard walkthrough | — |
| "How much do I earn?" | ✅ Tier table + calculation example | Custom rate requests |
| "When do I get paid?" | ✅ Payout schedule, minimum, hold period | Missing/failed payment → human |
| "Can I say X in my video?" | ✅ Reads back the may/must-not table | Anything ambiguous → human, always |
| "Which assets should I use?" | ✅ Recommends from the library by format | — |
| "Why was my commission reversed?" | ✅ Explains refund clawback | Disputed reversal → human |
| "I want a custom code / landing page" | ❌ | Elite tier / partnerships → human |
| Payment disputes, policy appeals, fraud allegations | ❌ | Always human — Ryan |

Same guardrail as Phase 7: the partner agent never gives medical advice and never invents a permissible claim. On any "can I say…" question it is safer to escalate than to approve.

## 10. Administration & analytics

| Task | Cadence | Owner |
|---|---|---|
| Approve/reject applications | Daily (first 100), then 2×/week | Ryan |
| Fraud review queue | Weekly | Ryan |
| Content compliance sweep — search branded hashtags and coupon codes across IG/TikTok/YouTube/Google | **Weekly** | Marketing |
| Tier recalculation | Monthly | Automated + verified |
| Payout run + statements | Monthly, the 15th | Ryan |
| Top-performer outreach | Monthly | Marketing |
| Country performance review | Monthly | Marketing |
| Program terms review | Quarterly | Ryan + legal |
| Creator seeding round | Monthly | Marketing |

Program KPIs (rolled into the Phase 9 dashboard): total/active partners (active = ≥1 click in 30 d), % of partners producing ≥1 sale, clicks, referred revenue, affiliate share of total revenue, blended commission %, effective CAC vs paid ads, top 10 partners by revenue, revenue by partner country, seeded-creator post rate and content-to-sale conversion.

Healthy benchmark for a launch-stage supplement brand: affiliate/creator revenue reaching **10–20% of total revenue by month 6**, with effective affiliate CAC below paid-social CAC.

## ✅ Phase 8 exit criteria

- [ ] GoAffPro installed, branded, connected to Shopify with test order tracked end-to-end
- [ ] `/pages/affiliates` landing page live with tiers, terms and a single signup CTA
- [ ] Program Terms + Marketing Guidelines published; acceptance is a required checkbox at signup
- [ ] Tiers configured: Starter 15% / Pro 20% / Elite 25% with the stated thresholds
- [ ] 60-day last-click cookie set; coupon-over-cookie precedence tested
- [ ] Commission calculated on net product subtotal, verified against the worked example
- [ ] Payout config live: monthly on the 15th, net-30 after the 30-day hold, S$50 minimum
- [ ] Refund clawback tested with a real refunded affiliate order
- [ ] All fraud rules in §6 documented, with self-referral and trademark-bidding checks running
- [ ] TikTok Shop Affiliate Center open plan live at 15–20%; no double-attribution with GoAffPro
- [ ] Media library populated with pre-cleared assets and the copy block
- [ ] Campaign brief template in use; first creator seeding round (20 creators) shipped
- [ ] Weekly content compliance sweep scheduled with a documented takedown ladder
- [ ] Partner AI agent live, escalating all "can I say…" ambiguity and all payment disputes
- [ ] Partners tagged in Klaviyo and suppressed from consumer promo sends
- [ ] Program KPIs feeding the Phase 9 dashboard
