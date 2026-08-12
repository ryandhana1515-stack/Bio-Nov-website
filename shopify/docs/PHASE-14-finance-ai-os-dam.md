# Phase 14 — Finance, AI Operating System & Digital Asset Management

**Goal:** Know exactly what BioExcela earns and what it costs; run a governed set of AI agents that do real work under explicit permissions; and keep every brand asset in one findable, versioned, permissioned library.

> ⚠️ **Read this before anything else in this phase.** An 18-agent AI operating system is a **12-month build**, not a launch-week deliverable. Attempting it before finance and asset hygiene exist produces agents that confidently reason over wrong numbers and publish off-brand files. Build in the order of §9: books first, then reporting, then a small number of high-value agents, then the rest. Anyone who tells you this can be stood up in a sprint is selling something.

## 1. Accounting stack

**Recommendation: Xero + A2X.** Xero is the dominant cloud ledger in Singapore and Australia, handles multi-currency, and files IRAS GST cleanly. A2X converts Shopify payouts into accurate summarised journals so the bank feed actually reconciles — without it, someone hand-matches thousands of transactions and the books quietly become fiction.

| Layer | Tool | Approx. cost | Why |
|---|---|---|---|
| General ledger | **Xero** (Starter → Standard → Premium multi-currency) | ~S$25 / S$60 / S$85 per month | SG/AU standard, strong bank feeds, IRAS GST returns, multi-currency on Premium |
| Alternative ledger | QuickBooks Online | ~US$30–90/mo | Better if the accountant already lives in QBO. Pick one and stop debating |
| **Shopify → ledger reconciliation** | **A2X for Shopify** | ~US$29–79/mo by order volume | Summarised, payout-matched journals including fees, refunds, gift cards, taxes |
| Expense capture | Hubdoc (included with Xero) or Dext | Free–US$25/mo | Supplier invoices, freight bills, ad receipts |
| Inventory valuation | Batch Register (Phase 13 §4.1) → manual monthly journal | Free | Upgrade to Katana/Cin7 only at multi-SKU scale |
| Payouts & FX | Wise Business / Airwallex | Per-transfer FX ~0.4–0.6% | Paying a Korean supplier and international affiliates from SGD |
| Analytics layer | Looker Studio (Phase 9) | Free | Finance panels alongside marketing |

Cadence: bank + Shopify reconciliation **weekly** · management accounts by the **10th** of the following month · GST return per IRAS filing period · annual statutory accounts and ECI per ACRA/IRAS deadlines with the appointed accountant.

## 2. Chart of accounts — supplement importer/distributor

Xero-style numbering. Keep revenue and ad spend split by market and channel from day one; splitting retrospectively is miserable.

| Code | Account | Type | Notes |
|---|---|---|---|
| 200 | Sales — Singapore | Revenue | Excl. GST |
| 201 | Sales — United States | Revenue | |
| 202 | Sales — Europe | Revenue | |
| 203 | Sales — United Kingdom | Revenue | |
| 204 | Sales — Australia | Revenue | |
| 205 | Sales — Canada | Revenue | |
| 206 | Sales — Malaysia | Revenue | |
| 207 | Sales — Rest of world | Revenue | |
| 210 | Subscription revenue | Revenue | Track separately — it is the LTV engine |
| 240 | Shipping income | Revenue | What customers paid for delivery |
| 250 | Discounts & promotions | Contra-revenue | Codes, sales, loyalty redemptions |
| 255 | Refunds & returns | Contra-revenue | Never net against sales |
| 300 | COGS — Product (FOB) | COGS | Manufacturer invoice |
| 301 | COGS — Inbound freight | COGS | Capitalise into landed cost |
| 302 | COGS — Import duty & customs | COGS | |
| 303 | COGS — Packaging & inserts | COGS | |
| 304 | COGS — Outbound shipping | COGS | Actual carrier cost |
| 305 | COGS — Payment processing fees | COGS | Shopify Payments, PayPal, wallets |
| 306 | COGS — Fulfilment labour / 3PL | COGS | |
| 310 | Inventory shrinkage & write-off | COGS | Damage, theft, count variance |
| 311 | **Inventory expiry write-off** | COGS | **Supplement-specific — watch this monthly** |
| 400 | Advertising — Meta | Opex | |
| 401 | Advertising — Google | Opex | |
| 402 | Advertising — TikTok | Opex | |
| 403 | Advertising — Other | Opex | |
| 410 | Affiliate commissions | Opex | GoAffPro payouts |
| 411 | Creator & influencer fees | Opex | Cash + product value |
| 412 | Content & creative production | Opex | Photography, video, design |
| 420 | Software, apps & subscriptions | Opex | Shopify, Klaviyo, apps, AI tokens |
| 421 | AI & LLM usage | Opex | Broken out so agent ROI is measurable |
| 430 | Professional fees | Opex | Legal, accounting, regulatory |
| 431 | Regulatory & compliance costs | Opex | Testing, certifications, filings |
| 440 | Bank charges & FX losses | Opex | |
| 450 | Salaries & contractors | Opex | |
| 460 | Office, travel, other | Opex | |
| 470 | Chargebacks & disputes | Opex | |
| 630 | **Inventory asset — on hand** | Asset | Valued at landed cost, weighted average |
| 631 | Inventory in transit | Asset | Goods paid for, not yet received |
| 640 | Prepayments (supplier deposits) | Asset | |
| 650 | **Merchant clearing — Shopify Payments** | Asset | A2X posts here; clears on payout |
| 651 | Merchant clearing — PayPal | Asset | |
| 800 | GST payable | Liability | IRAS |
| 810 | Accounts payable — suppliers | Liability | |
| 820 | **Loyalty points liability** | Liability | Unredeemed points at redemption value |
| 830 | Affiliate commissions payable | Liability | Approved, not yet paid |
| 840 | Refund provision | Liability | Expected returns on recent orders |

## 3. Unit economics — ILLUSTRATIVE MODEL

> ⚠️ **Every number in §3 is an assumption, not a fact.** Landed cost, freight and fee rates are placeholders. Ryan must replace them with the manufacturer's real FOB price, the real freight invoice, the real duty rate and the real Shopify Payments rate **before** this model is used to set a price, a budget or an ad bid. Phase 10 §1 blocker 1 is not cleared until that happens.

### 3.1 Per-order model, single market (SGD, illustrative)

| Line | 1 Box | 3 Boxes | 6 Boxes |
|---|---|---|---|
| Retail price | **89.00** | **239.00** | **427.00** |
| Boxes | 1 | 3 | 6 |
| Effective price per box | 89.00 | 79.67 | 71.17 |
| Product landed cost per box *(FOB 18.00 + freight 2.50 + duty/handling 0.50)* | 21.00 | 21.00 | 21.00 |
| **Total landed cost** | 21.00 | 63.00 | 126.00 |
| **Gross profit** | **68.00** | **176.00** | **301.00** |
| Gross margin % | 76.4% | 73.6% | 70.5% |
| Payment processing (2.9% + 0.30) | 2.88 | 7.23 | 12.68 |
| Outbound shipping (blended SG/intl) | 7.00 | 9.00 | 14.00 |
| Packaging + insert | 1.50 | 2.00 | 2.50 |
| Fulfilment labour | 1.50 | 1.50 | 1.50 |
| **Contribution before marketing** | **55.12** | **156.27** | **270.32** |
| Contribution margin % | **61.9%** | **65.4%** | **63.3%** |
| **Break-even ROAS** (1 ÷ contribution %) | **1.62** | **1.53** | **1.58** |
| CAC allowance @ 30% of revenue | 26.70 | 71.70 | 128.10 |
| Contribution after marketing | 28.42 | 84.57 | 142.22 |
| Platform/app fees @ ~3% | 2.67 | 7.17 | 12.81 |
| **Net contribution per order** | **25.75** | **77.40** | **129.41** |
| Net contribution % | 28.9% | 32.4% | 30.3% |

### 3.2 What this model tells you (if the assumptions hold)

| Insight | Implication |
|---|---|
| Break-even ROAS ≈ **1.6** across the ladder | Any campaign below 1.6× ROAS loses money before overheads. Target ≥2.5× to fund fixed costs |
| The 3-box has the **best contribution margin** | Merchandise it as the hero (Phase 11 §5). Every AOV point here is nearly free |
| The 6-box gives the most cash per order but the thinnest % | Good for cash cycle and retention, worse for margin — don't over-discount it further |
| Shipping is 8–16% of an order | The largest controllable non-product cost. Renegotiate carrier rates before cutting price |
| A 1-box customer needs ~1 repeat order to be genuinely profitable | Replenishment and subscriptions (Phase 7 §3.7) are not "nice to have" |

Track monthly: blended CAC · CAC by channel · contribution margin by pack and market · MER · 90/180/365-day LTV by cohort · **LTV:CAC ≥ 3:1** · payback period target **≤60 days**.

## 4. Executive finance dashboard

| Panel | Metrics | Source | Cadence |
|---|---|---|---|
| Revenue | Gross, net, by market, by channel, by pack, subscription vs one-time | Shopify + Xero | Daily / weekly |
| Margin | Gross margin %, contribution margin by pack and market | Xero + unit model | Weekly |
| P&L | Revenue → COGS → gross profit → opex → EBITDA | Xero | Monthly by the 10th |
| Marketing efficiency | Spend by channel, CAC, MER, ROAS vs the 1.6 break-even | Ads platforms + Shopify | Daily |
| Cash | Bank balances, Shopify payout pipeline, 13-week rolling cash forecast | Xero + bank | Weekly |
| Working capital | Inventory value, inventory days, in-transit value, supplier payables | Xero + Batch Register | Weekly |
| Refunds & disputes | Refund rate, refund value, chargeback rate and value | Shopify | Weekly |
| Affiliate | Commissions accrued, approved, paid, clawed back | GoAffPro → Xero | Monthly |
| Tax | GST collected vs payable, filing status, market tax exposure | Xero | Per filing period |
| Receivables/invoices | Outstanding B2B/wholesale invoices, ageing | Xero | Weekly |
| Liabilities | Loyalty points liability, refund provision | Smile.io + Xero | Monthly |
| Forecast | 3- and 12-month revenue and cash forecast; inventory reorder funding | Model | Monthly |
| Financial health | Runway, gross margin trend, LTV:CAC, contribution trend | Composite | Monthly |

## 5. AI autonomy levels

Every agent operates at a declared level. The level is a property of the **agent + task**, written down, not improvised.

| Level | Name | What the agent may do | Human involvement |
|---|---|---|---|
| **L0** | **Suggest** | Analyse and recommend only. Produces text, never touches a system | Human does everything |
| **L1** | **Draft** | Prepares the artefact — a draft email, a draft PO, a proposed budget change — in a staging state | Human reviews and executes every item |
| **L2** | **Execute with approval** | Can perform the action itself, but each action is queued and released by a human | Human approves per action |
| **L3** | **Autonomous** | Acts within hard, pre-set limits; human reviews after the fact via logs and exception alerts | Human audits, does not approve |

> ⚠️ **The Finance AI and every ads-spend agent are capped at L1 and may never exceed it without an explicit, written, per-case human approval.** No agent moves money, changes a budget, issues a refund, approves a payout, releases a supplier PO, or publishes a price change on its own — regardless of how well it has performed. This cap is not a maturity stage to grow out of. It is the control.

Also permanently human-only, at any maturity: refunds and credits · affiliate payouts · supplier commitments · price changes · **any health-related customer answer** (Phase 7 §5.1) · adverse-event handling · recall decisions (Phase 13 §4.6) · legal and regulatory responses · publishing to the live theme.

## 6. The 18-agent framework

Agents 9–16 of Phase 13 and 1–8 of Phase 7 map into this operating model; this table is the master register.

| # | Agent | Core responsibility | Permissions | Autonomy | Escalation trigger | Data sources |
|---|---|---|---|---|---|---|
| 1 | **CEO AI** | Synthesises every other agent's output into a weekly business picture; proposes the three priorities | Read-only across all dashboards | **L0** | Any recommendation involving spend, price, headcount or legal → Ryan | All dashboards, P&L, KPI warehouse |
| 2 | **Marketing AI** | Owns the calendar, channel mix, budget allocation proposals, campaign briefs | Read ads + analytics; write to the planning doc | **L1** | Any budget reallocation; any new channel | GA4, Shopify, ad platforms, Klaviyo |
| 3 | **Facebook AI** | Meta campaign monitoring, creative fatigue detection, audience and bid recommendations | Read Ads Manager; draft campaigns paused | **L1** *(spend-capped)* | **Every** budget/bid change; every new creative; any policy warning | Meta Ads, CAPI, Shopify orders |
| 4 | **Instagram AI** | IG organic calendar, caption drafts, Reels hooks, comment triage | Draft posts; read insights | **L1** | Any post going live; any comment implying a health outcome | IG Insights, asset DAM, brand guide |
| 5 | **TikTok AI** | TikTok organic + Shop, trend spotting, hook variants, creator brief drafts | Draft posts; read analytics | **L1** | Any post going live; any Shop listing change | TikTok Analytics, TikTok Shop, DAM |
| 6 | **Google Ads AI** | Search/PMax monitoring, negative keywords, feed-quality issues, bid recommendations | Read Google Ads + Merchant Center; draft changes | **L1** *(spend-capped)* | **Every** budget/bid change; any disapproval | Google Ads, GMC, GA4, Search Console |
| 7 | **SEO AI** | Keyword research, content briefs, technical-SEO issue detection, internal-link suggestions | Read GSC + site; draft briefs | **L1** | Any live page publish (compliance review first) | Search Console, GA4, site crawl, KB |
| 8 | **CRM AI** | Segment health, lifecycle-stage anomalies, flow performance, list hygiene recommendations | Read Klaviyo; draft segments and flows | **L1** | Any send; any suppression change; any consent-related action | Klaviyo, Shopify, Tidio |
| 9 | **Inventory AI** | Cover days, reorder timing, **expiry-window watch**, demand forecast | Read Shopify inventory + Batch Register | **L1** | Every PO; every stock adjustment; every write-off | Shopify, Batch Register, sales velocity |
| 10 | **Warehouse AI** | Fulfilment queue health, dispatch lag, mis-pick patterns, carrier performance | Read Shopify orders + Easyship | **L2** *(alerts only)* | Any hold, override, or delivery exception | Shopify, Easyship, WH SOP logs |
| 11 | **Finance AI** | Reconciliation checks, margin analysis, variance explanation, cash forecast, anomaly detection | **Read-only** Xero, Shopify, ad platforms | **L1 — hard cap** | **Every** journal, payment, payout, budget or price change | Xero, A2X, Shopify, GoAffPro, banks |
| 12 | **Affiliate AI** | Partner performance, tier calculation, commission checks, **compliance sweeps of partner content** | Read GoAffPro + public partner content | **L1** | **Every** payout; every dispute; **any health claim by a partner → Ryan immediately** | GoAffPro, Shopify orders, social search |
| 13 | **Creator AI** | Creator discovery, brief drafting, seeding logistics, UGC cataloguing into the DAM | Draft briefs; write UGC metadata to the DAM | **L1** | Any contract, payment or product gift; any content going live | Social platforms, DAM, brand guide |
| 14 | **Customer Support AI** | Front-line resolution per Phase 7 §5 agents 1–8 | Read orders; limited pre-fulfilment edits | **L2** | **Health topics, refunds, complaints, adverse events — always** | Shopify, KB, Tidio, Easyship |
| 15 | **Email AI** | Campaign and flow copy drafts within brand voice; subject-line variants | Draft in Klaviyo, never send | **L1** | **Every send.** Any claim language → compliance review | Klaviyo, brand guide, approved-language KB |
| 16 | **SMS AI** | SMS copy drafts, quiet-hour and frequency-cap compliance checks | Draft in Klaviyo, never send | **L1** | **Every send**; any consent question | Klaviyo, consent records, market rules |
| 17 | **Analytics AI** | Data-quality monitoring, tracking-break detection, cohort and attribution analysis | Read GA4, Shopify, ad platforms | **L2** *(reporting only)* | Any metric deviating >10% from reconciliation (Phase 9 §10) | GA4, Shopify, ad platforms, Looker |
| 18 | **Executive Reporting AI** | Assembles the daily pulse, weekly review pack and monthly business review | Read all dashboards; write to the report doc | **L2** *(reporting only)* | Any figure it cannot source; any red KPI | All of the above |

### 6.1 Common contract for every agent

Each agent gets a written spec containing:

| Element | Requirement |
|---|---|
| **Responsibilities** | 3–7 bullets. If it needs more, it is two agents |
| **Permissions** | Named systems, named scopes, read vs write, explicitly enumerated |
| **Autonomy level** | L0–L3 per §5, with any spend or volume cap stated numerically |
| **Workflow** | Trigger → inputs → steps → output artefact → who receives it |
| **Escalation rules** | Conditions that stop work and hand to a named human, with the packet contents |
| **Knowledge base** | The exact corpus it may draw on. **Product and claim language comes only from the locked approved-language KB** (Phase 7 §5.3) |
| **Prompt library** | Versioned system prompt + task prompts, stored in the DAM under `/06-ai/prompts/`, `vN` filenames, changelog |
| **Memory strategy** | Session-only by default. Persistent memory only for non-personal operational context (SOPs, brand rules, past decisions). **Never store customer health information, never store PII in agent memory** |
| **Evaluation** | What "good" looks like, how it is sampled, how often |

### 6.2 Governance

| Control | Implementation |
|---|---|
| Role-based access | Agents inherit the Phase 13 §8.1 permission matrix — an agent can never exceed the human role it acts for |
| Audit logging | Every agent run logged: prompt version, inputs, outputs, action taken, human approver |
| Prompt version control | Prompts in git or the DAM with `vN` versioning; no live editing of a production prompt |
| Approval workflows | L1/L2 queues with a named approver and an SLA; nothing sits unreviewed >48 h |
| Human review for critical decisions | The permanent human-only list in §5 |
| Performance monitoring | Monthly per agent: acceptance rate of drafts, error/hallucination rate, escalation accuracy, hours saved, token cost (account 421) |
| Kill switch | Any agent can be disabled by Ryan in one action; documented and tested |
| Adversarial testing | Quarterly, all customer-facing agents, medical-advice prompts, 100% correct escalation required (Phase 7 §5.1) |
| Cost control | Monthly token budget per agent; alert at 80% |
| Retirement | An agent whose draft-acceptance rate is <50% after 3 months is retired or re-scoped, not tolerated |

## 7. Digital asset management

**Recommendation: start with a properly structured Google Drive (Workspace Business Standard ~US$14/user/mo).** Naming and folder discipline delivers 80% of the value at near-zero cost. Upgrade to a real DAM — **Air (~US$10–30/user/mo)** or **Brandfolder / Bynder (enterprise, four figures/mo)** — when asset count passes ~2,000, when creators and affiliates need self-serve access, or when version confusion starts causing off-brand publishing. Do not buy an enterprise DAM at 200 assets.

### 7.1 Folder structure

```
BioExcela-DAM/
├── 00-inbox/                        # unsorted drop zone, emptied weekly
├── 01-brand/
│   ├── logos/                       # svg + png @1x/2x/3x, all 6 variants
│   ├── colour/                      # swatch files, ASE, print proofs
│   ├── typography/                  # Sora + Inter woff2, licences
│   ├── icons/                       # Lucide set, custom additions
│   ├── guidelines/                  # PHASE-12 pdf, logo manual, tone guide
│   └── templates/                   # deck, invoice, social, email templates
├── 02-product/
│   └── bio-nov/
│       ├── packaging/               # dielines, approved label artwork, print files
│       ├── photography/
│       │   ├── hero/  ├── detail/  ├── ingredient/  └── lifestyle/
│       ├── video/                   # master + cutdowns
│       ├── 3d-renders/
│       └── documents/               # COA, GMP cert, spec sheet, patent ref
├── 03-marketing/
│   ├── campaigns/
│   │   └── 2026-Q1-launch-sg/       # brief, creative, results
│   ├── paid/
│   │   ├── meta/  ├── google/  └── tiktok/
│   ├── organic-social/
│   │   ├── instagram/  ├── tiktok/  └── facebook/
│   ├── email/                       # Klaviyo graphics, headers, banners
│   └── landing-pages/
├── 04-partners/
│   ├── affiliate-media-kit/         # pre-approved banners, copy, disclosures
│   ├── creator-briefs/
│   └── ugc/                         # by creator, with signed release attached
├── 05-corporate/
│   ├── legal/                       # ACRA, policies, contracts, releases
│   ├── regulatory/                  # HSA/FDA/EFSA correspondence, claim approvals
│   ├── finance/                     # invoices, POs, statements
│   └── decks/
├── 06-ai/
│   ├── prompts/                     # versioned system + task prompts per agent
│   ├── knowledge-base/              # locked approved-language corpus
│   └── outputs/                     # notable agent outputs kept for evaluation
└── 99-archive/                      # superseded assets, never deleted
```

### 7.2 Naming convention

```
YYYYMMDD_brand_product_assettype_market_variant_vNN.ext
```

Examples:
`20260315_bioexcela_bionov_hero_global_navy-rimlight_v03.png`
`20260401_bioexcela_bionov_ad-9x16_sg_hook-fermentation_v02.mp4`
`20260210_bioexcela_brand_logo-primary_global_white_v01.svg`

Rules: lowercase, hyphens inside a segment, underscores between segments · no spaces, no `final`, no `FINAL-v2-REALLY` · version always `vNN` · superseded files move to `99-archive/`, never get deleted (recall and regulatory traceability) · every asset gets metadata: campaign, market, product, approval status, usage rights expiry, photographer/creator, release on file (Y/N).

### 7.3 Lifecycle & permissions

| Status | Meaning | Who can publish |
|---|---|---|
| `draft` | In production | Nobody |
| `in-review` | Awaiting design + compliance sign-off | Nobody |
| `approved` | Cleared for use in the stated market | Marketing |
| `restricted` | Approved for one market only (claim wording differs) | Ryan only |
| `expired` | Usage rights or claim approval lapsed | Nobody — archive it |

| Role | Access |
|---|---|
| Ryan | Full |
| Marketing | Read/write `01`–`04`; read `05` |
| Ops | Read `02` (documents), `05/finance` |
| Creators / affiliates | **Read-only, `04-partners/affiliate-media-kit/` only**, via a shared link that expires |
| Contractors | Time-boxed access to a single campaign folder |

> ⚠️ Affiliates and creators may only ever use assets from the pre-approved media kit. That folder is the compliance boundary: if the only images and copy they can reach are approved, most claim violations never happen. Anything they produce themselves goes through the Phase 8 review process before it runs.

## 8. Integrations

| Connection | Method | Purpose |
|---|---|---|
| Shopify → Xero | **A2X** | Payout-matched revenue, fees, refunds, tax journals |
| Shopify → Looker Studio | Connector / BigQuery | Finance and ops panels (Phase 9) |
| Ad platforms → Looker Studio | Native connectors | Spend, CAC, ROAS |
| GoAffPro → Xero | Monthly CSV → journal | Commission accrual and payout |
| Smile.io → Xero | Monthly liability journal | Loyalty points liability (account 820) |
| Batch Register → Xero | Monthly inventory journal | Inventory valuation, expiry write-offs |
| Bank / Wise → Xero | Bank feed | Cash position |
| DAM → Shopify / Klaviyo / ad platforms | Manual export at approved status | Single source of creative truth |
| Agents → source systems | Read-only API keys, scoped per agent | Least privilege; keys rotated quarterly |
| Agents → humans | Approval queue (email/Slack) with SLA | L1/L2 execution path |

Integration rules: one direction of truth per data type · every API key scoped and rotated · no agent shares a key with another agent · every integration documented with owner, scope, and what breaks if it fails.

## 9. Phased implementation roadmap

Honest sequencing. Month 1 is finance hygiene and two agents, not eighteen.

| Month | Finance | AI | DAM |
|---|---|---|---|
| **1** | Xero + A2X live · chart of accounts built · **real landed cost replaces §3 assumptions** · weekly reconciliation running | Phase 7 customer-facing agents only (already live) · **Agent 18 Executive Reporting (L2)** for the daily pulse · **Agent 11 Finance AI (L1)** for reconciliation checks | Google Drive structure per §7.1 · naming convention adopted · brand + product folders populated |
| **3** | First 3 monthly management accounts closed by the 10th · CAC, MER and contribution margin by pack and market · 13-week cash forecast | **Agent 9 Inventory · Agent 17 Analytics · Agent 2 Marketing** · governance framework live: prompt versioning, audit logs, approval queues | Campaign folders in use · metadata + approval status enforced · affiliate media kit published read-only |
| **6** | Cohort LTV and payback by channel · loyalty and refund provisions posted · supplier PO and inventory valuation automated | **Agents 3, 5, 6 (Facebook, TikTok, Google Ads — all L1, spend-capped)** · **Agents 15, 16 (Email, SMS — draft only)** · first quarterly adversarial re-test | Assess DAM upgrade (Air) against asset count and creator self-serve need |
| **12** | Full P&L by market · 12-month forecast · monthly agent-ROI review against account 421 · statutory accounts filed | **Agents 1, 4, 7, 8, 10, 12, 13 complete the set** · CEO AI running the weekly synthesis · agent retirement review (<50% acceptance → cut) | DAM migration if triggered · full asset audit · expired rights archived |

> ⚠️ **Do not add an agent while an existing one is unreviewed.** The failure mode is not a bad agent — it is fifteen unmonitored agents producing plausible output nobody checks. Cap the register at the number Ryan can actually audit monthly, and grow that number only as the review process proves itself.

## 10. Deliverables

| Deliverable | Where |
|---|---|
| Accounting stack recommendation + costs | §1 |
| Chart of accounts | §2 |
| Unit economics model (illustrative) | §3 |
| Executive finance dashboard spec | §4 |
| Autonomy level definitions + hard caps | §5 |
| 18-agent register with permissions and escalation | §6 |
| Agent specification contract | §6.1 |
| AI governance framework | §6.2 |
| DAM structure, naming, lifecycle, permissions | §7 |
| Integration map | §8 |
| Phased implementation roadmap | §9 |

## ✅ Phase 14 exit criteria

- [ ] Xero (or QBO) live with the §2 chart of accounts; A2X reconciling Shopify payouts
- [ ] Bank feeds connected; weekly reconciliation running; management accounts closed by the 10th
- [ ] **The §3 illustrative unit economics replaced with real landed cost, real freight, real duty and real fee rates**
- [ ] Break-even ROAS recalculated from real numbers and shared with everyone who touches ad budgets
- [ ] Contribution margin tracked by pack size and by market
- [ ] Loyalty points liability and refund provision posted monthly
- [ ] Executive finance dashboard live in Looker Studio, reconciling to Xero
- [ ] Autonomy levels L0–L3 documented; **Finance AI and all ads-spend agents capped at L1 in writing**
- [ ] Permanent human-only decision list published and understood by everyone
- [ ] Every deployed agent has a written spec covering all eight §6.1 elements
- [ ] Prompt library versioned in `/06-ai/prompts/` with a changelog; no live prompt editing
- [ ] Audit logging on for every agent run, including the human approver
- [ ] Approval queues live with named owners and a <48 h SLA
- [ ] Monthly agent performance review running; AI cost tracked in account 421
- [ ] Kill switch documented and tested
- [ ] Quarterly adversarial medical-advice testing scheduled for all customer-facing agents
- [ ] **No agent has write access to money, inventory, prices, payouts or the live theme**
- [ ] DAM structure built per §7.1; naming convention adopted; `00-inbox` emptied weekly
- [ ] Approval-status metadata enforced; only `approved` assets published
- [ ] Affiliate media kit published read-only with expiring links
- [ ] Model releases and usage-rights expiry recorded against every person-featuring asset
- [ ] Integration map documented with owners; API keys scoped per agent and rotation scheduled
- [ ] Month-1 roadmap column complete before any month-3 agent is started
