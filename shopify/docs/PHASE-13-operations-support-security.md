# Phase 13 — Customer Ecosystem, Operations, Support, Security & Compliance

**Goal:** One connected operational ecosystem with Shopify at the centre — every customer record, order, inventory movement, support request and security control reachable from a single backend, with written procedures that survive Ryan being unavailable.

> ⚠️ **Supplements are not ordinary retail.** Every unit that leaves the warehouse must be traceable to a **batch/lot number and an expiry date**, picked **first-expired-first-out**, and recoverable in a recall. Shopify does not do this natively. §4 defines the workaround and it is mandatory, not optional — without it an adverse-event report or a supplier recall becomes unanswerable, which is a regulatory failure in every market BioExcela sells into.

> ℹ️ **Relationship to Phase 7.** Phase 7 defines the eight customer-facing AI agents, the medical-advice guardrail and the escalation packet. Those definitions are authoritative and are **not repeated here**. This phase covers the **operations-side** agents (§6) and the human systems around all of them.

## 1. System of record — who owns what

| Domain | Master system | Writes into it | Read-only consumers |
|---|---|---|---|
| Customers, orders, inventory, products | **Shopify** | Checkout, admin, Flow | Klaviyo, Easyship, GoAffPro, Tidio, accounting |
| Communication + consent | Klaviyo | Klaviyo, checkout consent | Tidio, reporting |
| Conversations & tickets | Tidio | Tidio, email inbox | Klaviyo (suppression events) |
| Loyalty points & tiers | Smile.io / Rivo | Loyalty app, manual adjustment | Shopify (tag sync), Klaviyo |
| Affiliate commissions | GoAffPro | GoAffPro | Finance (Phase 14) |
| Shipping labels & tracking | Easyship | Easyship | Shopify, Klaviyo |
| **Batch / lot / expiry** | **Batch Register** (Airtable or Google Sheet) | Ops on receipt and dispatch | Recall procedure, adverse-event log |
| Assets | DAM (Phase 14 §7) | Marketing | Everyone |

Nothing else writes customer data. Every integration is one-way out of Shopify unless listed above.

## 2. Customer account & membership portal

Shopify **new customer accounts** (passwordless email code) is the baseline. It gives order history, saved addresses, profile and subscription management for free. Everything else is added by app or by a portal app.

| Feature | Native Shopify | App required | Notes |
|---|---|---|---|
| Login (email code / passkey) | ✅ | — | No password to leak — a genuine security win |
| Order history + status | ✅ | — | — |
| Reorder in one tap | ✅ (new accounts) | — | Drives the Phase 7 replenishment flow |
| Saved addresses | ✅ | — | — |
| Subscription management (skip, pause, swap, cancel) | ✅ Shopify Subscriptions | — | Self-serve cancel is required — hiding it causes chargebacks |
| Downloadable invoices | ❌ | Order Printer (free) or Sufio (~US$19–40/mo) | Required for corporate and MY/EU buyers |
| Wishlist | ❌ | Wishlist King / Growave (~US$10–50/mo) | **Low value at one SKU — defer** |
| Loyalty points balance & history | ❌ | Smile.io / Rivo | §3 |
| Referral status & rewards | ❌ | Smile.io / Rivo (consumer) + GoAffPro (partner) | Keep the two programmes strictly separate |
| Communication preferences | Partial | Klaviyo preference centre | Must allow email/SMS granularity, not just "unsubscribe all" |
| Returns portal | ✅ Shopify self-serve returns | — | Enable it; it removes the largest support ticket category |

> ⚠️ Never store health information in a customer profile. If a customer volunteers a condition in chat or email, do not write it to a field, tag or note — it becomes special-category personal data under GDPR/PDPA with a materially higher compliance burden (Phase 7 §7).

## 3. Loyalty & membership

**Recommendation: Smile.io.** Deep Shopify + Klaviyo integration, tier and referral engines, admin-editable rules, no code. Approximate pricing: **Free** (points + referrals, limited branding) → **Starter ~US$49/mo** → **Growth ~US$199/mo** (tiers, advanced branding) → **Pro ~US$599/mo**. **Rivo** is the cheaper alternative (~US$49/mo for tiers) with a smaller integration surface. Start on Smile.io Free at launch; move to Growth when tiers actually matter (~500 repeat customers). Verify current pricing before committing.

### 3.1 Tier structure

Earning: **1 point per S$1 spent** (net of discounts, excluding shipping and tax). Redemption: **100 points = S$5** — a 5% base return.

| Tier | Entry (rolling 12-month spend) | Earn rate | Effective return | Benefits |
|---|---|---|---|---|
| **Member** | S$0 | 1×  (1 pt / S$1) | 5% | Points, birthday 100 pts, early-access emails |
| **Silver** | S$250 | 1.15× | 5.75% | Above + free SG standard shipping, early access to new products |
| **Gold** | S$700 | 1.3× | 6.5% | Above + free worldwide standard shipping, priority support queue, member-only 3-box price |
| **Platinum** | S$1,500 | 1.5× | 7.5% | Above + annual thank-you gift, direct line to Ryan, first access to limited batches |

### 3.2 Earning and redemption rules

| Action | Points | Cap / condition |
|---|---|---|
| Purchase | 1 pt per S$1 net | Awarded on **fulfilment**, not order placement — prevents points on cancelled orders |
| Create an account | 50 | Once |
| Subscribe to email | 50 | Once, on confirmed opt-in |
| Subscribe to SMS | 75 | Once, express consent only |
| Birthday | 100 | Annually; date captured ≥30 days in advance to stop gaming |
| Photo review (verified purchase) | 150 | One per order · **never conditioned on the review being positive** (FTC) |
| Text review (verified purchase) | 75 | One per order |
| Referral — referrer | S$15 credit | On the friend's **first fulfilled** order |
| Referral — friend | S$15 off first order | Minimum spend S$89 |
| Subscription active 3 months | 200 | Retention bonus |

Redemption guards: minimum 500 points before first redemption · maximum **20% of order value** payable in points · points expire after **18 months of account inactivity** (with a warning email at 17) · points are void on refunded orders · **loyalty rewards never stack with an affiliate/creator discount code** — one discount mechanism per order.

> ⚠️ Reviews earn points for *submitting*, never for rating. Incentivising positive reviews is unlawful under FTC rules (US) and unfair-practice law elsewhere. The reward copy must read "leave a review — positive or not".

### 3.3 Admin controls (no code)

Smile.io admin lets Ryan change earn rates, tier thresholds, reward values, birthday bonuses, campaign multipliers (e.g. 2× points weekend) and expiry — all without touching the theme. Tier changes sync a Shopify customer tag (`tier-silver`, `tier-gold`, `tier-platinum`) which Klaviyo segments on. Review the programme's cost as a % of revenue monthly; if it exceeds **6% of net revenue**, cut earn rates before cutting margin elsewhere.

## 4. Inventory, batch control & fulfilment operations

### 4.1 The batch/expiry problem — and the fix

Shopify tracks *quantity*, not *lots*. For a supplement you must track lot and expiry. Options:

| Option | Cost | When |
|---|---|---|
| **Batch Register** — Airtable base (or Google Sheet) keyed to Shopify order IDs, maintained by Ops | Free–US$20/mo | **Start here.** Adequate to ~500 orders/month |
| Batch/expiry app (e.g. lot-tracking apps in the Shopify App Store) | ~US$20–60/mo | When manual entry becomes the bottleneck |
| Full WMS / IMS (Katana, SKULabs, Cin7) | ~US$200–600/mo | Multi-location, multi-SKU, >1,000 orders/month |

**Batch Register minimum fields:** Batch/Lot no. · Manufacture date · **Expiry date** · Supplier · PO number · Qty received · Qty remaining · Location/bin · COA received (Y/N) · Date range shipped · Shopify order IDs shipped against.

**FEFO rule:** always pick the **earliest expiry** batch on hand, regardless of when it was received. Never FIFO by receipt date — a later PO can carry an earlier expiry.

**Shelf-life gates:**

| Remaining shelf life | Action |
|---|---|
| > 12 months | Sell normally |
| 6–12 months | Sell normally; do not use for 6-box bundles (customer holds it 120 days) |
| **< 6 months** | **Do not ship** (Phase 10 SOP-01 step 5). Quarantine, consider staff/sampling use where lawful |
| Expired | Quarantine, record, dispose per local rules, write off in accounting (Phase 14) |

### 4.2 WH-01 — Goods receiving

1. Confirm the delivery against the open purchase order (PO number, SKU, quantity).
2. Photograph the pallet/cartons **before** opening; note any damage on the courier's proof of delivery.
3. Count every carton. Count units in a random 10% of cartons; if any carton is short, count all.
4. Record **batch/lot number, manufacture date and expiry date** from the carton and from the retail box — they must match.
5. Obtain and file the **Certificate of Analysis (COA)** for the batch from the manufacturer. No COA → do not release the batch to sellable stock.
6. Inspect: seals intact, label matches the approved artwork exactly, no crushing, no moisture, no discolouration.
7. Create the Batch Register row. Assign a bin location; label the bin with the expiry date in large type.
8. Move to sellable stock in Shopify (Inventory → adjust, reason "Received", reference the PO).
9. Reconcile: Shopify quantity must equal the physical count. Investigate any variance >2 units before proceeding.
10. Mark the PO received in the finance system (Phase 14) and file the supplier invoice.

### 4.3 WH-02 — Pick, pack, dispatch (daily)

1. 09:00 SGT: Shopify Admin → Orders → filter **Unfulfilled**. Check the Shopify fraud analysis; anything **High risk** → hold (Phase 10 SOP-08).
2. Print the day's picking list, sorted by SKU.
3. Pick **FEFO** — earliest expiry first. Record the batch number picked against each order.
4. Verify: SKU, variant (1/3/6 box), quantity, and that remaining shelf life is >6 months.
5. Pack: product + directions insert + thank-you card. Void fill for 3- and 6-box orders. Seal.
6. Weigh; confirm against the Easyship rate quoted at checkout.
7. Generate the label in Easyship. International: attach the commercial invoice, **HS code 2106.90**, declared value = order value, description "food supplement — tablets".
8. Write the batch number and Shopify order number into the Batch Register dispatch row.
9. Mark fulfilled in Shopify **with tracking attached** — this fires the customer's shipping email. Never mark fulfilled before the parcel is physically ready.
10. Hand to the courier before the daily cut-off. Log the day's shipment count.
11. **Target: 100% of paid orders dispatched within 24 business hours.**

### 4.4 WH-03 — Returns & exchanges processing

1. Return arrives (customer used the self-serve returns portal → RMA number on the parcel).
2. Match the RMA to the Shopify return record. Unidentified parcel → quarantine, do not open beyond identification, contact recent return requesters.
3. Photograph the returned item on arrival.
4. Inspect: is the outer seal **unbroken**?
5. **Sealed and unopened, within 30 days, >6 months shelf life** → return to sellable stock, record the batch back into the Batch Register, restock in Shopify.
6. **Opened, damaged, tampered, or unknown storage history** → **destroy. Never resell.** Record the write-off. This is absolute for an ingestible product.
7. Approve the refund per Phase 10 SOP-03 (all refunds human-approved; >S$300 → Ryan).
8. Confirm the affiliate commission clawback fired (Phase 8 §5) and reverse any loyalty points awarded.
9. Tag the order with the return reason. Review reason patterns monthly — three of the same reason is a product or listing problem, not a customer problem.

### 4.5 WH-04 — Cycle count & replenishment

1. Weekly (Monday): physical count by batch vs Batch Register vs Shopify. Investigate variance >2 units.
2. Monthly: full count, reconciled and signed off by Ryan.
3. Days of cover = units on hand ÷ 7-day average daily units sold.
4. Cover < **45 days** → raise a PO with the Korean manufacturer (production + freight + customs lead time — record the real number).
5. Cover < **14 days** → alert; pause paid ads on the affected SKU rather than sell into a stockout.
6. Stockout → "continue selling when out of stock" **off**, back-in-stock capture on, honest on-site notice.
7. Expiry watch: any batch entering the <6-month window flags 30 days ahead so it can be sold through first.

### 4.6 WH-05 — Product recall / withdrawal

Triggered by a supplier notice, a regulator notice, a COA failure, or a cluster of adverse-event reports.

1. **Stop selling immediately** — unpublish the product, pause all ads, halt fulfilment of the affected batch.
2. Identify the affected batch(es) in the Batch Register; extract the full list of Shopify order IDs shipped against them.
3. Quarantine all remaining physical stock of the batch; label it clearly, segregate it physically.
4. Notify Ryan and the manufacturer within **2 hours** of the trigger.
5. Notify the regulator where required — **HSA (Singapore)** for products supplied in SG; the equivalent authority in any affected market. Take advice; do this quickly.
6. Contact every affected customer directly (email + SMS + phone for high-value): what the issue is, what to do with the product, how the refund/replacement works. Plain language, no minimising.
7. Publish a notice on the website and social channels if the recall is public.
8. Process refunds/replacements without requiring a return unless the regulator requires the product back.
9. Record everything: timeline, decisions, communications, quantities recovered, disposal certificates.
10. Post-incident review within 14 days: root cause, supplier corrective action, prevention.

> ⚠️ **Rehearse this once before launch.** Pick a batch, pull the order list from the Batch Register, and time it. If you cannot produce the affected-customer list in under 30 minutes, your batch tracking is not fit for purpose — fix it before you sell.

## 5. Supplier & purchasing

| Element | Standard |
|---|---|
| Supplier record | Legal name, address, contact, GMP certificate + expiry, licences, bank details, incoterms, lead time, MOQ, payment terms |
| Purchase order | Sequential `PO-YYYY-NNN`; SKU, qty, unit cost, currency, incoterm, expected ship + arrival dates, agreed batch shelf life at delivery (**minimum 18 months**) |
| Documents per shipment | Commercial invoice · packing list · **COA per batch** · GMP certificate · airway bill / BL · import permit where required |
| Inventory valuation | Weighted average cost, including freight, duty and inbound handling → landed cost per box (Phase 14 §3) |
| Replenishment trigger | 45 days of cover (WH-04) |
| Safety stock | 30 days of forecast demand, raised to 60 before any major campaign |
| Supplier review | Quarterly: on-time %, quantity accuracy, documentation completeness, quality incidents, price movement |
| Second source | Identify a qualified alternate manufacturer within 12 months (Risk R13, Phase 10) |

## 6. Customer support centre

| Channel | Tool | Hours | First-response SLA |
|---|---|---|---|
| Help Centre / FAQ (searchable) | Shopify pages + Search & Discovery | 24/7 | — |
| AI chat | Tidio (Lyro) | 24/7 | <30 s |
| Live chat (human) | Tidio | SG business hours | <15 min in hours |
| WhatsApp | Tidio WhatsApp channel | SG business hours | <4 h |
| Email | `info@biogreenelixirs.com` | SG business hours | <4 business hours |
| Order tracking | Shopify order status + Easyship | 24/7 | — |
| Returns | Shopify self-serve returns portal | 24/7 | Approval <24 h |
| Escalation to Ryan | Phone / direct | P1 any hour | Immediate |

Ticketing: start with the shared inbox + Tidio. Move to **Gorgias (~US$10–60/mo entry tiers)** only once volume exceeds ~150 tickets/month (Phase 7 §1). Publish the SLAs on the contact page and honour them.

Help Centre structure: Orders & Shipping · Returns & Refunds · Product & Ingredients · Directions for Use · Subscriptions · Loyalty & Referrals · Account & Privacy · Contact. Every article single-sourced from the Phase 7 §5.3 knowledge base so the FAQ page, the AI and the email flows never diverge.

## 7. Operations AI agents

Phase 7 §5 defines agents 1–8 (customer-facing) and the medical-advice guardrail — **that guardrail applies to every agent in this table too**. Below are the internal, operations-side agents. All are **staff-facing**; none may message a customer without human review.

| # | Agent | Scope | Allowed actions | Data access | Escalates to human when |
|---|---|---|---|---|---|
| 9 | **Inventory Agent** | Stock levels, cover days, expiry watch | Report cover days, flag <45/<14 day thresholds, list batches entering the 6-month window, draft a PO | Shopify inventory, Batch Register (read), sales velocity | Any PO raised · any stock adjustment · any write-off |
| 10 | **Warehouse Agent** | Fulfilment queue health | Report unfulfilled >24 h, mis-pick patterns, dispatch counts, courier delays | Shopify orders, Easyship | Any hold, any fulfilment override |
| 11 | **Returns Ops Agent** | Return queue triage | Match RMAs, check eligibility, summarise reason patterns, draft the refund recommendation | Shopify returns, order data | **Every refund** — money movement is always human |
| 12 | **Membership Agent** | Loyalty and tier questions, internal | Explain tier rules, check a balance, draft a goodwill points adjustment | Smile.io, Shopify tags | Any manual points award · any tier override |
| 13 | **Affiliate Support Agent** | Partner queries, internal drafting | Explain terms, check commission status, draft partner replies | GoAffPro, order data | **Every payout** · any dispute · any compliance violation (→ Ryan) |
| 14 | **Supplier & Purchasing Agent** | PO and delivery tracking | Track expected deliveries, flag late shipments, check documentation completeness, draft supplier emails | PO log, supplier records | Any commitment to a supplier · any price negotiation |
| 15 | **Internal Ops Assistant** | Staff-facing catch-all | Draft (never send) replies, summarise tickets, retrieve SOPs, flag anomalies | Full internal KB, ticket history | Output is always human-reviewed before it leaves the building |
| 16 | **Compliance Monitor Agent** | Language sweeps | Scan storefront, email, ad and affiliate copy for banned phrasings against the Phase 12 §8.1 table; produce a findings list | Public content, approved-language KB | **Every finding goes to Ryan.** The agent never edits live copy |

Shared rules for all operations agents: read-mostly by default · no write access to Shopify orders, inventory, payouts or customer records · every recommendation carries its data source · all outputs logged · **no agent may ever answer a health question** (Phase 7 §5.1 template applies verbatim).

## 8. Security & access control

### 8.1 Role-permission matrix (Shopify staff permissions)

| Capability | Owner (Ryan) | Ops | Support | Marketing | Finance | Contractor |
|---|---|---|---|---|---|---|
| Orders — view | ✅ | ✅ | ✅ | ❌ | ✅ | ❌ |
| Orders — edit / fulfil | ✅ | ✅ | ✅ (pre-fulfilment address only) | ❌ | ❌ | ❌ |
| **Refunds** | ✅ | ❌ | ✅ **≤S$300 only** | ❌ | ❌ | ❌ |
| Draft orders | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Products — view | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Products — edit | ✅ | ✅ | ❌ | ✅ (copy/media) | ❌ | Time-boxed |
| Inventory — adjust | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Customers — view | ✅ | ✅ | ✅ | Segments only | ✅ | ❌ |
| **Customers — export** | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Discounts | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ |
| Apps — install/remove | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Themes — edit | ✅ | ❌ | ❌ | ✅ | ❌ | Time-boxed |
| **Themes — publish** | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Settings (payments, checkout, markets) | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **Payouts & bank details** | ✅ | ❌ | ❌ | ❌ | View only | ❌ |
| Reports & analytics | ✅ | ✅ | ❌ | ✅ | ✅ | ❌ |
| Staff management | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Klaviyo — campaigns | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ |
| **Klaviyo — PII export** | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| GoAffPro — approve payouts | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Batch Register — edit | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |

Principles: least privilege by default · **2FA mandatory for every account, no exceptions** · contractors get time-boxed access revoked on a calendar reminder, not on trust · credentials live in a shared password manager (1Password/Bitwarden, ~US$8–20/mo), never in chat or a spreadsheet · access reviewed quarterly and immediately on any departure.

### 8.2 Security checklist

| # | Control | Implementation | Cadence |
|---|---|---|---|
| 1 | 2FA on all Shopify, Klaviyo, Google, bank and app accounts | Settings → Users → enforce | At onboarding |
| 2 | Password manager for all shared credentials | 1Password/Bitwarden | Continuous |
| 3 | Least-privilege staff roles | §8.1 | Quarterly review |
| 4 | Contractor access time-boxed and revoked | Calendar reminder + checklist | Per engagement |
| 5 | Audit logs enabled and reviewed | Shopify, Klaviyo, Tidio, Google Workspace | Quarterly |
| 6 | Alert on bulk customer export | Shopify Flow / log review | Monthly |
| 7 | Fraud screening on every order | Shopify fraud analysis + SOP-08 | Per order |
| 8 | Chargeback response pack (proof of delivery, comms) | Documented template | Per dispute |
| 9 | Payment data never touches BioExcela systems | Shopify Payments is PCI-DSS compliant; never record card details in tickets | Continuous |
| 10 | Cookie consent (EU/UK) | Pandectes / Consentmo (~free–US$15/mo), blocking mode | Before EU ads |
| 11 | Privacy policy names every processor | Shopify, Klaviyo, Tidio, Easyship, GoAffPro, Smile.io, analytics | On any app change |
| 12 | Data-subject request procedure (access, deletion, correction) | Shopify's built-in GDPR/CCPA request tools + a written runbook | Per request |
| 13 | Backups | Shopify is SaaS-backed, **but not for your data model** — use Rewind or Shopify's backup app (~US$10–40/mo) for products, collections, themes, metafields | Daily automated |
| 14 | Theme change control | Never edit the live theme — duplicate, edit, preview, publish; keep a known-good rollback theme | Per change |
| 15 | Disaster recovery runbook | Store down · payments down · app breaks catalog · account compromise · warehouse inaccessible | Tested twice yearly |
| 16 | Incident log | Every P1/P2: detection, cause, action, resolution, prevention (Phase 10 SOP-11) | Per incident |
| 17 | Vendor/app review before install | Permissions requested, data accessed, reviews, developer track record | Per install |
| 18 | Offboarding checklist | Revoke Shopify, Klaviyo, email, DAM, password-manager, courier and bank access same day | Per departure |

**Disaster recovery targets:** storefront restore **<2 h** (rollback theme published) · catalog/metafield restore **<4 h** (Rewind) · full data restore **<24 h** · fulfilment continuity — a documented manual process using courier web portals if Easyship is unavailable.

## 9. Regulatory & privacy compliance

| Obligation | **PDPA (Singapore)** | **GDPR / UK GDPR (EU, UK)** | **CCPA/CPRA (California, US)** |
|---|---|---|---|
| Lawful basis / notice | Notify purpose, obtain consent | Consent or legitimate interest; documented | Notice at collection |
| Marketing consent | Opt-in; **check the DNC Registry** before marketing SMS/calls | Explicit, granular, unbundled, never pre-ticked | Opt-out model, but honour Global Privacy Control |
| Access request | Respond within **30 days** | **1 month** (extendable to 3) | **45 days** (extendable to 90) |
| Deletion / erasure | On withdrawal, subject to retention law | Right to erasure | Right to delete |
| Correction | Right to correction | Right to rectification | Right to correct |
| Portability | Limited | Machine-readable export | Portability on request |
| Opt-out of sale/share | — | — | **"Do Not Sell or Share My Personal Information" link required** if ad pixels are treated as sharing |
| Children | Under 13 consent rules | Under 16 (member-state variable) | Under 16 opt-in required |
| Breach notification | Notify PDPC + affected individuals for significant breaches (**3 calendar days** to PDPC once assessed) | Supervisory authority within **72 hours** | Notify affected residents without unreasonable delay |
| Cookies / tracking | Consent for non-essential | **Prior consent**, blocking banner required | Notice + opt-out |
| Data Protection Officer | **Mandatory** — appoint and publish contact details | Only if large-scale/sensitive processing | Not required |
| Cross-border transfer | Comparable-protection obligation | SCCs / adequacy | Contractual |
| Retention | No longer than necessary | Documented retention schedule | Documented retention schedule |

**Product regulatory:** Singapore **HSA** — health supplements are not pre-approved but must not carry disease claims, must comply with labelling and prohibited-substance rules, and the dealer is responsible for safety. **US FDA/FTC** — DSHEA structure-function claims only; the disclaimer "This statement has not been evaluated by the FDA. This product is not intended to diagnose, treat, cure, or prevent any disease" is required alongside any structure-function claim; FTC requires claims be truthful and substantiated. **EU EFSA** — only authorised health claims from the EU Register may be used; unauthorised claims are prohibited outright, which is stricter than the US position. Applied rule across all markets: **structure-function language only** (Phase 12 §8.1).

**Retention schedule:** orders and tax records **5 years** (IRAS) · consent records for the life of the relationship **+3 years** · support transcripts **24 months** · **Batch Register and COAs: shelf life + 3 years minimum** · **adverse-event logs: indefinitely** · marketing analytics 26 months.

> ⚠️ **Adverse events are never AI-handled and never resolved in chat** (Phase 7 §5.2). Log date, product, **batch/lot number**, customer, symptoms as reported verbatim, and action taken; escalate to Ryan; assess regulator reporting per market. The Batch Register is what makes that log meaningful.

## 10. Executive operations dashboard

| Panel | Metrics | Source | Cadence | Healthy |
|---|---|---|---|---|
| Customer accounts | Accounts created, % of orders with an account, repeat rate | Shopify | Weekly | Repeat rate ≥25% by month 6 |
| Loyalty | Enrolled members, points issued vs redeemed, liability, tier distribution, programme cost as % of revenue | Smile.io | Monthly | Cost <6% of net revenue |
| Inventory | Units on hand, days of cover, batches in the 6-month expiry window, stockouts | Shopify + Batch Register | **Daily** | Cover 45–120 days, zero stockouts |
| Fulfilment | Orders unfulfilled >24 h, dispatch lag, mis-pick rate, on-time delivery | Shopify + Easyship | Daily | ≥95% within 24 h |
| Returns | Return rate, reason mix, restock vs destroy ratio, refund value | Shopify | Weekly | Return rate <5% |
| Support | Volume, first-response time, resolution time, reopen rate, CSAT | Tidio | Weekly | FRT <4 h, CSAT ≥4.3 |
| AI performance | Deflection rate, escalation rate, confidence distribution, unhelpful votes | Tidio | Weekly | Deflection 50–70% |
| **Compliance** | `medical-escalation` tag count, 20-transcript audit, adverse-event count | Tidio + log | **Monthly, mandatory** | Zero unescalated medical answers |
| Supplier | Open POs, expected arrivals, late shipments, COA completeness | PO log | Weekly | 100% COA before release |
| Security | Failed logins, permission changes, bulk exports, app installs, backup status | Audit logs | Monthly | Zero unexplained events |
| Operational health | Composite: fulfilment + support + inventory + security status | Looker Studio | Daily | All green |

## 11. Deliverables

| Deliverable | Where |
|---|---|
| System-of-record map | §1 |
| Customer portal specification | §2 |
| Loyalty tiers, earning rules, admin controls | §3 |
| Batch/expiry control model + FEFO rule | §4.1 |
| Warehouse SOPs WH-01 … WH-05 | §4.2–4.6 |
| Supplier & purchasing standards | §5 |
| Support centre architecture + SLAs | §6 |
| Operations AI agent responsibilities (agents 9–16) | §7 |
| Role-permission matrix | §8.1 |
| Security checklist + DR targets | §8.2 |
| PDPA / GDPR / CCPA obligations table | §9 |
| Executive operations dashboard | §10 |

## ✅ Phase 13 exit criteria

- [ ] Shopify new customer accounts live; returns portal, subscription self-management and invoices working
- [ ] Klaviyo preference centre allows granular email/SMS choices, not just unsubscribe-all
- [ ] Loyalty programme live with the §3.1 tiers; tier tags syncing to Shopify and Klaviyo
- [ ] Review rewards worded to reward submission, never a positive rating
- [ ] Loyalty and affiliate discounts confirmed non-stackable
- [ ] **Batch Register live with lot, expiry, COA and shipped-order fields for every batch on hand**
- [ ] **FEFO picking in force; nothing with <6 months shelf life is shippable**
- [ ] WH-01 to WH-05 written, printed, and walked through at the fulfilment station
- [ ] **Recall rehearsal completed — affected-customer list produced from a batch number in under 30 minutes**
- [ ] Supplier records complete with GMP certificate and expiry; PO numbering live; 18-month minimum shelf life agreed
- [ ] Help Centre published, single-sourced from the Phase 7 knowledge base; SLAs published on the contact page
- [ ] Operations agents 9–16 scoped, read-only by default, with escalation triggers documented
- [ ] Compliance Monitor Agent sweeping public copy monthly; findings routed to Ryan
- [ ] Role-permission matrix applied in Shopify; 2FA enforced on every account
- [ ] Customer export restricted to Ryan; bulk-export alert configured
- [ ] All 18 security controls implemented; audit logs on and reviewed
- [ ] Automated daily backup of products, collections, metafields and themes verified by a test restore
- [ ] Disaster recovery runbook written and tested; rollback theme in place
- [ ] Privacy policy names every processor; cookie consent blocking in EU/UK
- [ ] Data-subject request runbook written; response windows (30 d / 1 mo / 45 d) documented
- [ ] Singapore **DPO appointed and published**; DNC Registry check in the SMS workflow
- [ ] Retention schedule implemented, including indefinite adverse-event retention
- [ ] Executive operations dashboard live with the compliance panel audited monthly
