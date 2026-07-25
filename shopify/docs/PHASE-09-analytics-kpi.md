# Phase 9 — Analytics & KPI Dashboard

**Goal:** One executive view of the whole business — Shopify, Meta, TikTok, Google, affiliates and customer ops — with every number defined by a formula nobody argues about, and blended MER as the arbiter of truth.

> ⚠️ **Attribution reality check.** Since iOS 14.5 / ATT and browser ITP, every ad platform over-reports its own contribution. Meta, TikTok and Google will each claim the same sale. Summing platform-reported revenue routinely produces 130–200% of actual Shopify revenue. **Never make budget decisions on platform-reported ROAS alone.** The truth metric is **blended MER** (total revenue ÷ total ad spend), reconciled against Shopify's actual order count. Use platform ROAS only to compare campaigns *within* one platform.

## 1. The stack

Start free, upgrade when the cost of manual reconciliation exceeds the tool price.

| Layer | Tool | Cost | Role |
|---|---|---|---|
| Source of truth — orders/revenue | **Shopify Analytics** | Included | The only authoritative revenue number |
| Behaviour + traffic | **GA4** | Free | Sessions, sources, funnel, country splits |
| Search | **Search Console** | Free | Query/impression data (Phase 6) |
| Ad platforms | Meta Ads Manager, TikTok Ads Manager, Google Ads | Free | Campaign-level spend and in-platform metrics |
| **Unified dashboard** | **Looker Studio** | Free | Blends Shopify + GA4 + Search Console + Ads connectors into one exec view |
| Email/SMS | Klaviyo analytics | Included | Flow and campaign revenue |
| Affiliate | GoAffPro reports | Included | Partner KPIs |
| Cost/margin | Google Sheet (`COGS & Margin Master`) | Free | Landed cost per SKU, feeds contribution margin |
| **Upgrade path** | Triple Whale (~US$129/mo) or Polar Analytics (~US$120/mo) | Paid | Real-time blended attribution, post-purchase survey attribution, cohort LTV out of the box |

**Recommendation:** run Looker Studio for the first 90 days. Move to Triple Whale/Polar when monthly ad spend exceeds ~US$10k — below that, the manual blended-MER sheet is more accurate than most attribution tools anyway and costs nothing.

Add a **post-purchase survey** ("How did you hear about us?" — Shopify checkout or a free app) from day one. Self-reported attribution is crude, but it's the only signal not degraded by privacy changes, and it will contradict the platforms usefully.

## 2. KPI definitions — the formula table

Every number below has exactly one definition. Disputes get settled here, not in a meeting.

| KPI | Formula | Source | Target (launch stage) |
|---|---|---|---|
| **Revenue (net)** | Gross sales − discounts − returns | Shopify | Growth MoM |
| **Orders** | Count of paid orders | Shopify | — |
| **AOV** | Net revenue ÷ orders | Shopify | **≥ S$150** (bundle-driven) |
| **CVR (site)** | Orders ÷ sessions × 100 | Shopify / GA4 | **2.0–3.0%** |
| **Add-to-cart rate** | ATC events ÷ PDP sessions × 100 | GA4 | ≥8% |
| **Checkout completion** | Orders ÷ checkouts started × 100 | Shopify | ≥55% |
| **Cart abandonment** | 1 − checkout completion | Shopify | ≤45% |
| **Ad spend** | Sum of Meta + TikTok + Google spend | Ad platforms | — |
| **Platform ROAS** | Platform-attributed revenue ÷ platform spend | Each platform | Directional only |
| **Blended ROAS / MER** | **Total Shopify revenue ÷ total ad spend** | Shopify + platforms | **≥ 2.5** to scale, **≥ 2.0** floor |
| **CAC (paid)** | Total ad spend ÷ **new** customers acquired | Shopify + platforms | ≤ S$60 |
| **CAC (blended)** | (Ad spend + affiliate commission + app/tool costs) ÷ new customers | All | ≤ S$70 |
| **COGS** | Landed unit cost × units sold | COGS sheet | — |
| **Gross margin %** | (Net revenue − COGS) ÷ net revenue × 100 | Calculated | **≥ 70%** for supplements |
| **Contribution margin** | Net revenue − COGS − shipping − payment fees − ad spend | Calculated | Positive per order |
| **CM per order** | Contribution margin ÷ orders | Calculated | **≥ S$30** |
| **Break-even ROAS** | 1 ÷ gross margin % | Calculated | e.g. 70% margin → **1.43** |
| **Repeat purchase rate** | Customers with ≥2 orders ÷ total customers × 100 | Shopify | **≥25% by month 6** |
| **Time to 2nd order** | Median days between order 1 and order 2 | Shopify | **≤35 days** (20-day supply — see Phase 7 replenishment) |
| **LTV (cohort, 90d)** | Σ net revenue from a month's new customers over 90 days ÷ cohort size | Shopify cohort report | ≥ 1.6 × first-order value |
| **LTV (cohort, 365d)** | Same, 365-day window | Shopify | ≥ 2.5 × first-order value |
| **LTV:CAC** | 365-day cohort LTV ÷ blended CAC | Calculated | **≥ 3:1** |
| **Refund rate** | Refunded order value ÷ gross revenue × 100 | Shopify | **≤3%** |
| **Return rate (units)** | Returned units ÷ units shipped × 100 | Shopify | ≤4% |
| **Subscription rate** | Subscription orders ÷ total orders × 100 | Subscriptions app | ≥15% by month 6 |
| **Subscription churn** | Cancellations ÷ active subscribers × 100 (monthly) | Subscriptions app | ≤10% |
| **Email revenue share** | Klaviyo-attributed revenue ÷ total revenue × 100 | Klaviyo | **20–30%** |
| **Affiliate revenue share** | Affiliate-attributed revenue ÷ total revenue × 100 | GoAffPro | 10–20% by month 6 |
| **On-time delivery** | Orders delivered within quoted window ÷ delivered × 100 | Easyship | ≥90% |
| **Fulfilment lag** | Median hours from order paid to fulfilment | Shopify | **≤24 h** business days |
| **CSAT** | Mean post-resolution score (1–5) | Tidio | ≥4.3 |
| **AI deflection** | Conversations resolved without human ÷ total × 100 | Tidio | 50–70% |

### 2.1 Worked example — is a campaign actually profitable?

```
3-box order, S$239. Landed COGS S$54. Shipping S$12. Payment fee 2.9%+0.30 ≈ S$7.23.
Gross margin  = (239 − 54) / 239 = 77.4%
Break-even ROAS = 1 / 0.774 = 1.29   ← before shipping/fees
"True" break-even including shipping + fees:
  contribution before ads = 239 − 54 − 12 − 7.23 = S$165.77 (69.4%)
  → break-even ROAS = 1 / 0.694 = 1.44
At platform-reported ROAS 2.8 but blended MER 1.6 → still profitable,
but only just, and the platform number is lying by ~75%. Scale on the 1.6.
```

## 3. Data source mapping

| Metric group | Source system | Connector into Looker Studio | Refresh |
|---|---|---|---|
| Revenue, orders, AOV, refunds, customers | Shopify | Shopify → Google Sheets export (scheduled) or a paid Shopify connector | Daily 06:00 SGT |
| Sessions, traffic source, funnel, country, device | GA4 | Native GA4 connector | Every 4 h (GA4 latency ~24 h for some dims) |
| Organic queries, impressions, position | Search Console | Native connector | Daily (SC data lags 2–3 days) |
| Google Ads spend, clicks, conversions | Google Ads | Native connector | Daily |
| Meta spend, impressions, clicks, purchases | Meta Ads | Supermetrics / free community connector / manual sheet | Daily |
| TikTok spend, clicks, purchases | TikTok Ads | Manual sheet or Supermetrics | Daily |
| Merchant Center feed health | MC | Manual check | Weekly |
| Email/SMS performance + attributed revenue | Klaviyo | Klaviyo → Sheets export | Weekly |
| Affiliate clicks, orders, commissions | GoAffPro | CSV export → Sheets | Weekly |
| Support volume, CSAT, AI deflection | Tidio | CSV export → Sheets | Weekly |
| Shipping performance, delivery times | Easyship | CSV export → Sheets | Weekly |
| Inventory on hand, days of cover | Shopify | Same Shopify export | Daily |
| COGS, landed cost, margin | `COGS & Margin Master` sheet | Native Sheets | Manual, on any cost change |

> ⚠️ Manual/weekly sources (Klaviyo, GoAffPro, Tidio, Easyship) are the ones that quietly go stale. Assign a named owner and a fixed day — Monday morning — or the dashboard degrades into a Shopify-plus-ads view within a month.

## 4. Executive dashboard wireframe

Page 1 of the Looker Studio report. Date range control top-right, comparison = previous period.

```
┌──────────────────────────────────────────────────────────────────────────┐
│  BIOEXCELA GLOBAL — EXECUTIVE DASHBOARD      [Date range ▾] [vs prev ▾]  │
├────────────┬────────────┬────────────┬────────────┬──────────┬──────────┤
│ REVENUE    │ ORDERS     │ AOV        │ BLENDED MER│ CVR      │ CM/ORDER │
│ S$48,320   │ 312        │ S$154.87   │ 2.41       │ 2.34%    │ S$38.10  │
│ ▲ 18.2%    │ ▲ 12.4%    │ ▲ 5.1%     │ ▼ 0.19     │ ▲ 0.21pp │ ▲ S$2.40 │
├────────────┴────────────┴────────────┴────────────┴──────────┴──────────┤
│  REVENUE TREND (daily, 90d)              │  REVENUE BY MARKET           │
│  ╭─────────────────────────────────╮     │  SG  ████████████████  52%   │
│  │        ╭╮      ╭─╮      ╭────   │     │  US  █████████         28%   │
│  │   ╭────╯╰──────╯ ╰──────╯       │     │  AU  ████               9%   │
│  │───╯                             │     │  EU  ███                7%   │
│  ╰─────────────────────────────────╯     │  ROW ██                 4%   │
├──────────────────────────────────────────┴──────────────────────────────┤
│  CHANNEL PERFORMANCE                                                     │
│  Channel    Spend    Rev(plat)  Rev(blended share)  ROAS  CAC   Trend    │
│  Meta       12,400   34,100     18,850              2.75  54    ▲        │
│  TikTok      4,200   11,600      6,240              2.76  61    ▲        │
│  Google      3,450    9,800      7,730              2.84  47    ▬        │
│  Organic         0        —      8,200               —     —    ▲        │
│  Email           0        —     10,900               —     —    ▲        │
│  Affiliate   2,180        —      5,410              2.48  49    ▲        │
│  ─────────────────────────────────────────────────────────────────────   │
│  Note: platform-reported revenue sums to 55,500 vs actual 48,320 (115%)  │
├────────────────────────────────┬─────────────────────────────────────────┤
│  OPERATIONS                    │  CUSTOMER                               │
│  Unfulfilled orders      14    │  New vs returning      74% / 26%        │
│  Fulfilment lag         18h    │  Repeat purchase rate      26.1%        │
│  Days of stock cover     41    │  90d cohort LTV        S$248            │
│  Refund rate           2.1%    │  LTV:CAC                 3.4:1          │
│  On-time delivery     92.4%    │  Subscription rate       14.8%          │
│  Abandoned checkouts   38.7%   │  CSAT                      4.5          │
├────────────────────────────────┴─────────────────────────────────────────┤
│  ⚠ ALERTS                                                                │
│  • BNOV-006 stock cover 11 days — below 14-day threshold                 │
│  • Meta campaign "SG-Prospecting-Broad" ROAS 1.31 for 3 consecutive days │
│  • GA4 purchase events 6% below Shopify orders — check tracking          │
└──────────────────────────────────────────────────────────────────────────┘
```

Supporting pages: **P2 Sales** (by country/product/channel/device/customer type, daily-weekly-monthly-yearly trend) · **P3 Marketing** (campaign-level across all platforms) · **P4 Operations** (fulfilment, inventory, shipping, returns) · **P5 Affiliates & Creators** · **P6 CRM & Support** · **P7 Data quality** (event-count reconciliation).

## 5. Sales analytics dimensions

Every revenue figure must be sliceable by: **country/market**, **product & variant** (1/3/6 box), **channel** (Meta, TikTok, Google, organic, direct, email, SMS, affiliate, TikTok Shop), **campaign**, **device**, **currency** (presentment vs SGD settlement), **customer type** (new vs returning), **affiliate/creator**, and **time** (day/week/month/year, with YoY once there's a prior year).

Two views that earn their keep immediately:

- **Variant mix over time** — if 1-box share is climbing, AOV is eroding and the bundle merchandising needs work.
- **New vs returning revenue** — the leading indicator of whether the Phase 7 replenishment machine is working.

## 6. Marketing performance — unified table

Same columns for every platform so they can actually be compared.

| Column | Definition | Notes |
|---|---|---|
| Spend | Platform-reported, in SGD | Convert at the platform's own FX |
| Impressions / Clicks / CTR | Platform | CTR <0.8% on Meta = creative fatigue |
| CPC | Spend ÷ clicks | Rising CPC + flat CTR = audience saturation |
| CPM | Spend ÷ impressions × 1000 | Health category CPMs run high |
| Purchases (platform) | Platform-attributed | Inflated — see the ⚠ at the top |
| ROAS (platform) | Platform revenue ÷ spend | **Within-platform comparison only** |
| CPA / CAC | Spend ÷ new customers | Cross-check against Shopify new-customer count |
| Blended share | Modelled share of actual Shopify revenue | Reconcile monthly against post-purchase survey |
| Frequency (Meta/TikTok) | Impressions ÷ reach | >2.5 in a week on prospecting = refresh creative |

Monthly reconciliation ritual, 30 minutes: sum platform-reported revenue, divide by actual Shopify revenue, record the inflation factor. Track that factor over time — it becomes your discount rate for platform numbers.

## 7. Alerts & thresholds

Configure in Shopify Flow (ops), Google Ads/Meta rules (spend), and Looker Studio scheduled emails (trend).

| Alert | Threshold | Channel | Owner | Action |
|---|---|---|---|---|
| Low inventory | Any SKU <20 units **or** <14 days of cover | Email + Slack | Ryan | Trigger reorder (Korea lead time is long — this is the highest-consequence alert) |
| Out of stock | Any SKU = 0 | Immediate | Ryan | Pause ads for that SKU; enable back-in-stock capture |
| Sales drop | Daily revenue <60% of trailing 7-day average | Email | Ryan | Check tracking first, then site health, then ads |
| Zero orders | No orders in 6 h during SG business hours | Immediate | Ryan | Checkout/payment outage until proven otherwise |
| Ad overspend | Any campaign >130% of daily budget | Platform rule | Marketing | Investigate |
| Campaign underperformance | ROAS < break-even (1.44) for 3 consecutive days at ≥S$100 spend | Email | Marketing | Pause or restructure |
| Payment failure spike | >5 failed payments in 1 h | Email | Ryan | Gateway check |
| Tracking error | GA4 purchases deviate >10% from Shopify orders | Weekly report | Analytics | Audit pixels/tags |
| Feed disapproval | Any Merchant Center item disapproved | Email | Marketing | Phase 6 §9 troubleshooting |
| Refund spike | Daily refunds >5% of daily revenue | Email | Ryan | Quality or expectation-setting problem |
| Shipping delay | Any order unfulfilled >48 h | Flow → email | Ops | Fulfilment intervention |
| Support backlog | >10 unresolved tickets **or** any ticket >24 h | Daily digest | Support | Triage |
| AI escalation spike | Escalation rate >50% in a week | Weekly | Support | Knowledge base gap |
| **Medical escalation** | **Any** `medical-escalation` tag | **Immediate** | **Ryan** | Phase 7 protocol — never batched |
| Affiliate fraud flag | Duplicate IP cluster or self-referral match | Weekly | Ryan | Hold payout, review |

## 8. AI insights layer

Weekly, generate a written summary rather than only charts. Prompt the assistant with the week's dashboard export and ask for: (1) metrics that moved >15% vs prior period and the most likely cause, (2) the three best-performing and three worst-performing campaigns with a recommended action each, (3) inventory risks given current velocity and lead time, (4) data-quality anomalies, (5) three prioritised recommended actions.

> ⚠️ AI reads the numbers; it does not decide the budget. Every AI-recommended action gets a human decision before money moves. And the AI insight layer must never be pointed at customer health information — it sees aggregates and campaign data only.

## 9. Reporting cadence

| Report | Frequency | Audience | Contents |
|---|---|---|---|
| Daily pulse | Daily 08:00 SGT | Ryan | Revenue, orders, spend, MER, alerts. **Daily for the first 6 weeks post-launch**, then weekdays |
| Weekly performance | Monday | Ryan + marketing | Full dashboard + AI summary + actions for the week |
| Monthly business review | 1st of month | Ryan | P&L view, cohort LTV, CAC trend, channel mix, inventory plan, next-month budget |
| Quarterly strategic | Quarterly | Ryan | Market expansion, product roadmap, LTV:CAC trajectory, tool stack review |
| Ad-hoc campaign post-mortem | Per campaign | Marketing | What ran, what it cost, what it returned, what to keep |

All scheduled from Looker Studio as PDF email; the monthly review gets a written executive summary, not just the export.

## 10. Data quality — the reconciliation checklist

Run monthly. Silent tracking breakage is the most common cause of bad decisions.

| Check | Method | Tolerance |
|---|---|---|
| GA4 purchases vs Shopify orders | Compare counts, same date range/timezone | ±5% |
| GA4 revenue vs Shopify net revenue | Compare totals | ±5% |
| Meta pixel + CAPI deduplication | Events Manager → deduplicated event count | No double-count |
| TikTok pixel + Events API | TikTok Events Manager | No double-count |
| Google conversion count vs Shopify | Ads conversions vs orders | ±10% (attribution windows differ legitimately) |
| Klaviyo attributed revenue | Should be ≤ total revenue and stable as a % | Investigate swings >5pp |
| Affiliate orders in GoAffPro vs Shopify tags | Cross-reference order IDs | Exact match |
| Currency conversion | Multi-currency orders settle to SGD correctly | Exact |
| COGS sheet freshness | Landed cost matches latest supplier invoice + freight | Current |

## 11. Deliverables

| Deliverable | Where |
|---|---|
| KPI definitions | §2 — the canonical reference |
| Data source mapping | §3 |
| Dashboard wireframe | §4 |
| Looker Studio report (7 pages) | Built + shared with Ryan |
| `COGS & Margin Master` sheet | Google Drive, owner Ryan |
| Alert configuration | §7, implemented in Flow + platform rules |
| Reporting calendar | §9, scheduled sends live |
| Reconciliation checklist | §10, monthly recurring task |

## ✅ Phase 9 exit criteria

- [ ] `COGS & Margin Master` sheet complete with real landed costs — gross margin and break-even ROAS calculated per SKU
- [ ] KPI definitions table (§2) agreed and treated as canonical
- [ ] Looker Studio report live with all 7 pages, shared to Ryan, auto-refreshing
- [ ] Shopify, GA4, Search Console and Google Ads connectors verified against source numbers
- [ ] Meta and TikTok spend flowing in daily (connector or maintained sheet with a named owner)
- [ ] Klaviyo, GoAffPro, Tidio, Easyship weekly exports assigned to a named owner and day
- [ ] **Blended MER calculated and displayed** as the headline efficiency metric, not platform ROAS
- [ ] Platform-inflation factor measured and recorded for the first full month
- [ ] Post-purchase "how did you hear about us?" survey live
- [ ] Cohort LTV report configured (90d + 365d) in Shopify
- [ ] All §7 alerts configured and test-fired — including the immediate medical-escalation alert
- [ ] Daily pulse + weekly + monthly reports scheduled
- [ ] Monthly reconciliation checklist run once successfully, all checks within tolerance
- [ ] Documented upgrade trigger: move to Triple Whale/Polar above ~US$10k monthly ad spend
