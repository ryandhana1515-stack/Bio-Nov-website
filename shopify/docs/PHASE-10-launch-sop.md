# Phase 10 — Global Launch Checklist & SOPs

**Goal:** Launch BioExcela Global professionally — Singapore first, then the world — with every system tested, every process written down, and every failure mode having a named owner and a recovery plan.

> ⚠️ **Launch strategy: soft-launch Singapore only for the first 2 weeks.** Open US/EU/AU/CA/UK only after SG has proven fulfilment, checkout, tracking and support end-to-end on real orders. International returns, customs delays and cross-border refunds are expensive lessons to learn at scale. Two weeks of SG-only trading costs almost nothing and de-risks everything.

## 1. Launch blockers — resolve these or do not launch

Not "nice to have". Trading without these creates legal, financial or reputational exposure.

| # | Blocker | Owner | Why it blocks |
|---|---|---|---|
| 1 | **Final pricing confirmed** per pack and per market | Ryan | The $89/$239/$427 ladder is a placeholder. Landed cost + freight + duties + payment fees must be known or you may be selling at a loss, and price changes after launch break Merchant Center feeds and anger early buyers |
| 2 | **Label-approved copy** for ingredients, directions, warnings | Ryan | Storefront copy must match the authorised product label. Mismatch is a regulatory finding in every market |
| 3 | **Genuine reviews only** — placeholders removed | Ryan | Fabricated reviews are illegal under FTC rules (US), unlawful under consumer protection law elsewhere, and grounds for platform bans. **Launch with zero reviews rather than one invented review** |
| 4 | **Legal review of policies** — T&Cs, privacy, refunds, shipping, disclaimers | Ryan + legal | Supplement disclaimers, PDPA/GDPR privacy language and refund rights are market-specific |
| 5 | **HSA / market compliance sweep** of all public copy | Ryan | Every claim on site, ads, email and affiliate assets must be structure-function only |
| 6 | **Payment gateway live-tested with a real transaction** | Ryan | Test-mode success does not prove live capture and payout |
| 7 | **Stock physically in the SG hub and counted** | Ops | Selling stock you don't hold generates refunds and chargebacks |
| 8 | **GTIN/barcode from the manufacturer** | Ryan | Blocks Google Shopping reach (Phase 6 §2.1) |

## 2. T-minus launch timeline

| When | Workstream | Actions |
|---|---|---|
| **T-14** | Freeze | Feature freeze. No new apps, no theme experiments. Final pricing locked. Stock counted and reconciled in Shopify |
| **T-14** | Legal | Policies to legal review. Label copy verified against the authorised label |
| **T-13** | Content | Full copy compliance sweep — site, email flows, SMS, ad drafts, affiliate assets. Every claim checked against the may/must-not table (Phase 8 §7) |
| **T-12** | Tech | Full QA pass on desktop + mobile: every page, every link, every form, 3 browsers |
| **T-11** | Payments | Live S$1 transaction on each method (card, Apple Pay, Google Pay, Shop Pay, PayPal). Refund it. Confirm payout schedule |
| **T-10** | Shipping | Test label + customs docs via Easyship for SG, US, EU, AU addresses. Verify HS code 2106.90 |
| **T-9** | Tracking | Verify Meta pixel+CAPI, TikTok pixel+Events API, GA4, Google Ads conversion — one test order, each fires exactly once |
| **T-8** | Feeds | Merchant Center approved, zero disapprovals. Meta catalog approved. TikTok Shop category approved |
| **T-7** | CRM | All Klaviyo flows live and test-triggered. SMS consent + STOP tested. Quiet hours set |
| **T-6** | AI | Tidio agents live. Adversarial medical-advice test (10+ prompts) — 100% pass required. Escalation to human tested |
| **T-5** | Affiliates | GoAffPro live, terms published, test affiliate order tracked and commission calculated |
| **T-4** | Analytics | Looker Studio dashboard live and reconciling against Shopify. Alerts test-fired |
| **T-3** | Ops | SOPs (§4) written, printed, and walked through with everyone who will use them |
| **T-3** | Support | Knowledge base final. Support inbox monitored. Response SLAs published on the contact page |
| **T-2** | Dry run | **Full rehearsal:** place 3 real orders (1-box, 3-box, 6-box) to real SG addresses. Fulfil them. Ship them. Process one return. Answer one support ticket. Time every step |
| **T-1** | Go/no-go | Review §1 blockers and this timeline. Any red = delay. Confirm inventory. Brief everyone on launch-day roles |
| **T-1** | Comms | Warm the list: "we open tomorrow". Schedule launch social posts. Brief seeded creators |
| **LAUNCH** | Go | Remove password protection. Publish. Enable SG-only. **Do not turn on paid ads for the first 48 h** — validate organic + list traffic through checkout first |
| **Day 1-2** | Watch | Monitor every order individually. Check every tracking event. Respond to every ticket within 2 h |
| **Day 3** | Ads on | Start paid at 25% of planned budget. Scale only when MER holds |
| **Day 3-14** | SG soft-launch | Daily KPI review. Fix what breaks. Collect the first genuine reviews |
| **T+14** | Gate | **Go/no-go for international.** Criteria in §7. If SG fulfilment isn't clean, do not open more markets |
| **T+14** | Expand | Enable US, then EU/UK/AU/CA over the following week — one market at a time, 48 h apart |
| **T+21** | Partners | Open affiliate program publicly. Launch creator seeding round |
| **T+30** | Review | First monthly business review. Retrospective. Improvement backlog prioritised |

## 3. Pre-launch checklist

### 3.1 Shopify configuration

- [ ] Store name, contact email `info@biogreenelixirs.com`, sender email verified (SPF/DKIM)
- [ ] Primary domain `biogreenelixirs.com` connected, SSL active, `www` redirect working
- [ ] All market subfolders resolving (`/en-us/`, `/en-gb/`, …) with correct hreflang
- [ ] Password protection ready to remove (not yet removed)
- [ ] Theme published, no draft/preview themes serving traffic
- [ ] Checkout branding: logo, colours, favicon
- [ ] Customer accounts enabled; order-status page branded
- [ ] Timezone Asia/Singapore, base currency SGD
- [ ] Staff accounts created with least-privilege roles; 2FA enforced
- [ ] Order notification emails routed to a monitored inbox

### 3.2 Products & merchandising

- [ ] BIO N:OV live with **final** pricing on all 3 variants
- [ ] All metafields filled with label-approved copy (benefits, ingredients, directions, warnings, shipping/returns)
- [ ] Media uploaded in order, every image with alt text
- [ ] SKUs `BNOV-001/-003/-006`, barcodes/GTINs populated
- [ ] Inventory tracked, quantities match a physical count
- [ ] Collections built; navigation tested on mobile
- [ ] Subscribe & Save configured and test-purchased
- [ ] Zero fabricated reviews; review app installed and moderation on
- [ ] Compliance sweep: no disease claim anywhere on the PDP

### 3.3 Payments, tax & shipping

- [ ] Shopify Payments live; PayPal connected
- [ ] Apple Pay, Google Pay, Shop Pay rendering on mobile
- [ ] **Live S$1 test transaction on every method, then refunded**
- [ ] Payout bank account verified
- [ ] Tax settings per market (SG GST, EU/UK/AU inclusive display, US no-nexus)
- [ ] Duties/import taxes displayed for EU/UK/AU test addresses
- [ ] All shipping zones + rates + free thresholds match the Phase 4 table
- [ ] Easyship connected; label + commercial invoice generated for SG/US/EU/AU test addresses
- [ ] HS code 2106.90 on customs docs
- [ ] Self-serve returns enabled; return policy live

### 3.4 Legal & policies

- [ ] Terms of Service, Privacy Policy, Refund/Returns, Shipping Policy published and linked in the footer
- [ ] Supplement disclaimer on the PDP and footer ("not intended to diagnose, treat, cure or prevent any disease" — wording per market)
- [ ] Cookie consent banner for EU/UK visitors
- [ ] Company details visible: Bio Green Elixirs Pte Ltd, ACRA number, address, contact email
- [ ] Affiliate Program Terms + Marketing Guidelines published
- [ ] **Legal sign-off recorded in writing**

### 3.5 Analytics & tracking

- [ ] GA4 live, e-commerce events firing, SGD, Asia/Singapore
- [ ] Meta pixel + CAPI deduplicating (verified in Events Manager)
- [ ] TikTok pixel + Events API firing once each
- [ ] Google Ads conversion tracking + enhanced conversions
- [ ] Search Console verified, sitemaps submitted
- [ ] Merchant Center feed 100% approved
- [ ] Looker Studio dashboard reconciling to Shopify within tolerance
- [ ] Post-purchase attribution survey live
- [ ] All alerts configured and test-fired

### 3.6 Marketing readiness

- [ ] Meta catalog approved; FB Shop + IG Shopping live; product tagging enabled
- [ ] TikTok Shop SG approved for supplements; catalog synced; test order flows to Shopify
- [ ] Campaign structures built and paused (Phase 6 §3.2)
- [ ] Creative assets approved: 3 hooks × 3 formats minimum, all compliance-checked
- [ ] Landing pages tested at real mobile speed (LCP <2.5 s)
- [ ] Launch social posts scheduled across @biogreenelixirs on all three platforms
- [ ] Ad copy sweep: no health claims, no personal-attribute targeting

### 3.7 Operational readiness

- [ ] Stock physically received, counted, reconciled
- [ ] Packing materials, inserts, printer, labels ready
- [ ] Fulfilment station set up; someone can pick/pack/ship within 24 h
- [ ] Courier accounts active with pickup scheduled
- [ ] Returns address and process defined
- [ ] Support inbox + Tidio monitored during SG business hours
- [ ] Escalation contacts documented and shared
- [ ] Reorder trigger set with the manufacturer (Korea lead time documented)

### 3.8 AI & automation readiness

- [ ] All 8 Tidio agents live and scoped
- [ ] **Medical-advice guardrail passes 10+ adversarial prompts**
- [ ] Human escalation tested — full transcript + order history delivered
- [ ] All 13 Klaviyo flows live and test-triggered
- [ ] SMS consent, STOP/HELP, quiet hours, frequency cap verified
- [ ] Shopify Flow automations live (low stock, high-risk order, unfulfilled >48 h)
- [ ] GoAffPro live with a tracked test order and calculated commission
- [ ] Adverse-event logging procedure documented and routed to Ryan

## 4. Standard operating procedures

### SOP-01 — Order processing (daily)

1. 09:00 SGT: open Shopify Admin → Orders → filter Unfulfilled.
2. Check Shopify fraud analysis on each order; anything **High risk** → hold, go to SOP-08.
3. Verify the shipping address is complete; for international, confirm phone number present (couriers require it).
4. Pick the correct variant and quantity; verify SKU against the packing slip.
5. Inspect product condition and expiry date; nothing within 6 months of expiry ships.
6. Pack with insert + directions card; seal.
7. Generate the label in Easyship; for international attach the commercial invoice with HS code 2106.90.
8. Mark fulfilled in Shopify and attach the tracking number — **this triggers the customer's shipping email; never mark fulfilled before the parcel is actually ready**.
9. Hand to courier / drop at pickup point before the daily cut-off.
10. Log the day's shipment count. Target: all paid orders fulfilled within 24 business hours.

### SOP-02 — Customer support enquiry

1. Check the queue (Tidio + `info@` inbox) at 09:00, 13:00 and 17:00 SGT.
2. Identify the customer: match email/order number to the Shopify record.
3. Classify: order status · product question · shipping · returns · payment · complaint · **health question**.
4. **Health question → stop.** Reply with the mandated template ("I'm not able to give medical advice… please consult your healthcare professional"), tag `medical-escalation`, notify Ryan. Never answer.
5. Routine question → answer from the knowledge base. If the KB doesn't cover it, escalate rather than improvise.
6. Complaint → acknowledge within 2 h, state what you will do and by when, escalate to Ryan if a refund or replacement is implied.
7. Log the resolution and tag the topic (feeds the KB and the FAQ page).
8. First response within 4 business hours; resolution within 24 h.
9. Any question asked three times in a month gets added to the FAQ page and the KB.

### SOP-03 — Refunds

1. Confirm eligibility: within 30 days, unopened (for change-of-mind), order located in Shopify.
2. Determine reason: change of mind · damaged in transit · wrong item · not delivered · quality complaint.
3. Damaged/wrong/not delivered → refund or replace without requiring a return; recover from the carrier separately.
4. Change of mind → issue an RMA and the returns address; refund on receipt and inspection.
5. **All refunds require human approval — AI may never issue one.** Under S$300: support can approve. Over S$300 or any second refund to the same customer: Ryan approves.
6. Process in Shopify → Refund; refund shipping only where the fault is ours.
7. Notify the customer with the amount, method and expected timing (5–10 business days).
8. Confirm the affiliate commission clawback fired (Phase 8 §5).
9. Tag the order with the reason; review reason patterns monthly.

### SOP-04 — Exchanges

1. Confirm the requested variant is in stock.
2. Issue a return label for the original item (customer pays return shipping for change-of-mind; we pay if it's our error).
3. On receipt and inspection, create a new order at S$0 referencing the original order number.
4. Ship per SOP-01.
5. Adjust inventory for both SKUs.
6. Notify the customer with the new tracking number.

### SOP-05 — Inventory update & reorder

1. Weekly (Monday): physical count vs Shopify inventory. Investigate any discrepancy >2 units.
2. Calculate days of cover: units on hand ÷ 7-day average daily units sold.
3. Cover below **45 days** → raise a purchase order with the Korean manufacturer (lead time covers production + freight + customs; confirm the real number and record it here).
4. Cover below **14 days** → alert fires; pause paid ads on the affected SKU rather than sell into a stockout.
5. Stockout → set the variant to "continue selling when out of stock" **off**, enable back-in-stock notifications, post an honest update.
6. On goods receipt: count, inspect, record batch/lot number and expiry, then update Shopify inventory.
7. Record batch numbers against the date range they shipped in — this is what makes an adverse-event trace or a recall possible.

### SOP-06 — Campaign launch

1. Define the objective, budget, duration and success metric (target ROAS ≥ break-even from Phase 9 §2).
2. Draft copy and creative.
3. **Compliance review before anything is uploaded**: no disease claims, no personal-attribute targeting, no invented data, no before/after.
4. Confirm the landing page is live, fast and consistent with the ad promise.
5. Verify tracking fires on that landing page.
6. Build the campaign; set the budget cap and schedule.
7. Launch at 25% of planned budget for 48–72 h.
8. Review against break-even ROAS; scale by no more than 20–30% per day, or pause.
9. Log the campaign in the performance sheet.
10. Post-mortem at the end: what ran, what it cost, what it returned, what to reuse.

### SOP-07 — Affiliate & creator management

1. Review new applications (daily for the first 100, then twice weekly): verify a real audience, check for competing supplement partnerships and any history of health claims.
2. Approve or reject; approval triggers the onboarding sequence automatically.
3. Weekly compliance sweep: search branded hashtags, coupon codes and the brand name across IG, TikTok, YouTube and Google.
4. Violation found → screenshot it, send the takedown notice, set a 48 h deadline (24 h for health claims), hold commissions.
5. Monthly on the 1st: recalculate tiers.
6. Monthly on the 15th: review the payout queue, manually check anything over S$500, release payouts, issue statements.
7. Handle disputes personally — never via AI.
8. Monthly: contact the top 5 performers with a bespoke offer.

### SOP-08 — High-risk order review

1. Alert fires on Shopify "High risk" fraud analysis.
2. Do not fulfil.
3. Check: billing/shipping mismatch, email age and plausibility, multiple failed payment attempts, freight-forwarder address, order value far above AOV.
4. Contact the customer to verify by replying from the order email address.
5. No response within 48 h, or verification fails → cancel and refund with a polite explanation.
6. Verified → fulfil normally and note the review on the order.
7. Log the outcome; recurring patterns feed the fraud rules.

### SOP-09 — Content publishing

1. Draft against the Phase 6 §4.2 on-page standard (title, meta, H1, URL, internal links, alt text).
2. **Compliance review**: structure-function language only, no clinical data, no condition targeting.
3. Add author byline and a "last reviewed" date (YMYL requirement for health content).
4. Publish; add 3–5 internal links from and to existing content.
5. Request indexing in Search Console.
6. Distribute: email segment, social posts, affiliate media library if it's usable as an asset.
7. Review performance at 30 and 90 days; refresh underperformers rather than adding more.

### SOP-10 — Daily/weekly reporting

1. 08:00 SGT: open the daily pulse email. Check revenue, orders, spend, MER, alerts.
2. Any red alert → act before anything else that day.
3. Confirm yesterday's orders are all fulfilled or explained.
4. Check the support queue depth and oldest ticket age.
5. Monday: full dashboard review + AI summary; set the week's three priorities.
6. Monday: refresh the manual data sources (Klaviyo, GoAffPro, Tidio, Easyship exports).
7. Month-end: run the reconciliation checklist (Phase 9 §10) and the monthly business review.

### SOP-11 — Issue escalation

1. Classify severity: **P1** store down / checkout broken / payments failing · **P2** fulfilment blocked, tracking broken, feed suspended · **P3** individual customer issue · **P4** cosmetic.
2. P1 → notify Ryan immediately by phone, regardless of hour. Post a status note on the site if it will exceed 2 h.
3. P2 → notify Ryan the same day; target resolution within 24 h.
4. P3 → SOP-02. P4 → improvement backlog.
5. Record every P1/P2 in the incident log: time detected, cause, action, time resolved, prevention.
6. Any incident affecting customer orders gets proactive customer communication — before they ask.

## 5. Roles & responsibilities

| Function | Owner | Backup | Decision rights |
|---|---|---|---|
| Overall business, pricing, legal, compliance sign-off | **Ryan Dhana** | — | All |
| Order fulfilment | Ops | Ryan | Ship/hold |
| Customer support | Support | Ryan | Refunds ≤S$300 |
| Refunds >S$300, disputes | Ryan | — | Ryan only |
| Paid media | Marketing | Ryan | Budget changes ≤20%/day |
| Content & SEO | Content | Marketing | Publish after compliance review |
| Affiliate/creator program | Marketing | Ryan | Approvals; payouts = Ryan |
| Analytics & reporting | Analytics | Ryan | — |
| **Medical escalations, adverse events** | **Ryan** | **No backup** | **Ryan only** |
| Inventory & reorder | Ops | Ryan | PO raising = Ryan |

## 6. Risk register

| # | Risk | Likelihood | Impact | Mitigation | Owner |
|---|---|---|---|---|---|
| R1 | Stockout during a demand spike | **High** | High | 45-day reorder trigger; pause ads at 14 days cover; back-in-stock capture; buffer stock before any big campaign | Ops |
| R2 | Ad account or catalog rejected for health claims | **High** | High | Pre-launch compliance sweep; may/must-not table; review every asset before upload; keep a compliant backup ad account | Marketing |
| R3 | Merchant Center suspension | Medium | High | Phase 6 §9 pre-emptive audit; fix all SKUs before appealing; never appeal twice unprepared | Marketing |
| R4 | Affiliate makes a disease claim | **High** | High | Mandatory terms acceptance; weekly sweep; 24 h takedown for health claims; immediate removal on repeat | Ryan |
| R5 | International shipping delay / customs hold | **High** | Medium | Realistic delivery windows quoted; proactive delay emails; Easyship customs docs correct; SG-first soft launch | Ops |
| R6 | Payment gateway failure | Low | **Critical** | PayPal as a second method; zero-orders alert at 6 h; documented support contact | Ryan |
| R7 | Site outage / theme break | Low | High | No live theme edits — duplicate, edit, preview, publish; keep a rollback theme; uptime monitoring | Ryan |
| R8 | Tracking silently breaks, decisions made on bad data | Medium | High | Monthly reconciliation (Phase 9 §10); >10% deviation alert | Analytics |
| R9 | AI gives medical advice | Low | **Critical** | Hard-blocked topics; mandated template; quarterly adversarial testing; monthly transcript audit | Ryan |
| R10 | Adverse event reported by a customer | Low | **Critical** | Never AI-handled; logged with batch/lot; escalated to Ryan; regulator reporting where required | Ryan |
| R11 | Negative review or public complaint | Medium | Medium | Respond publicly within 24 h, factually, never defensively, never with a counter-claim; resolve privately | Support |
| R12 | Chargebacks / fraudulent orders | Medium | Medium | Shopify fraud analysis + SOP-08; delivery confirmation on all orders; respond to every dispute with evidence | Ryan |
| R13 | Supplier delay or quality issue | Medium | High | Documented lead time + safety stock; batch records; inspect on receipt; identify a second source over time | Ryan |
| R14 | Key-person dependency on Ryan | **High** | High | These SOPs; documented credentials in a password manager; cross-train a backup for fulfilment and support | Ryan |
| R15 | Data breach / privacy complaint | Low | High | Least-privilege access, 2FA, audit logs, no health data stored, named processors in the privacy policy | Ryan |
| R16 | Currency/FX erosion on international orders | Medium | Low | Market price adjustments (+5–10% on US/EU per Phase 4); review margin by market monthly | Ryan |

## 7. Post-launch monitoring

**Days 1–14 (SG soft launch), daily at 08:00 and 17:00:** every order individually reviewed · fulfilment lag measured per order · every tracking event confirmed delivered · every support ticket answered within 2 h · checkout completion rate watched hourly on day 1 · GA4 vs Shopify order counts compared daily · all customer feedback logged verbatim.

**International go/no-go criteria at T+14 — all must be true:**

| Criterion | Threshold |
|---|---|
| Orders fulfilled within 24 h | ≥95% |
| Delivered within quoted window | ≥90% |
| Checkout completion rate | ≥50% |
| Payment failures | <2% of attempts |
| Refund rate | <5% |
| Unresolved support tickets | 0 older than 24 h |
| Tracking reconciliation | GA4 vs Shopify within 5% |
| Critical incidents (P1) | 0 unresolved |
| Genuine reviews collected | ≥5 |

Fail any one → fix it, run another week, re-test. Opening more markets on top of a broken process multiplies the breakage.

**Days 15–30:** open markets one at a time, 48 h apart; watch duty/customs complaints closely; monitor CAC per market; start replenishment flow observation (the first day-15 reminders fire around now).

## 8. Continuous improvement

| Ritual | Cadence | Output |
|---|---|---|
| Daily pulse | Daily (weekdays after week 6) | Alerts actioned |
| Weekly review | Monday | Three priorities for the week; backlog groomed |
| Monthly business review | 1st | P&L, cohort LTV, CAC, channel mix, inventory plan |
| Incident retrospective | Per P1/P2 | Root cause + prevention added to an SOP |
| SOP review | Quarterly | Every SOP re-read and corrected against reality |
| Compliance audit | Quarterly | Site, ads, email, affiliate content re-swept; AI adversarial re-test |
| CRO test cycle | Bi-weekly | One test at a time, ≥2 weeks or 200 conversions before calling it |
| Improvement backlog | Continuous | Scored on impact ÷ effort; top item worked each week |

## 9. Deliverables

| Deliverable | Where |
|---|---|
| Launch checklist | §3 |
| T-minus timeline | §2 |
| SOP library (11 SOPs) | §4 — printed and at the fulfilment station |
| Role & responsibility matrix | §5 |
| Risk register | §6 — reviewed monthly |
| Testing plan | §2 T-12 to T-2 + §3 |
| Post-launch monitoring plan | §7 |
| Executive sign-off | Below |

**Executive sign-off:** Ryan Dhana confirms in writing that §1 blockers are cleared, §3 checklists are complete, and the T+14 international gate will be honoured. Date and record it — a written go decision is what keeps a soft launch from quietly becoming a hard one.

## ✅ Phase 10 exit criteria

- [ ] All 8 launch blockers in §1 cleared and documented
- [ ] Final pricing locked per pack and per market, with margin confirmed against landed cost
- [ ] All storefront, email, SMS, ad and affiliate copy compliance-swept — zero disease claims
- [ ] Policies legally reviewed and published; supplement disclaimer live
- [ ] Zero fabricated reviews; only genuine, consented reviews present
- [ ] Every §3 checklist section complete
- [ ] Live payment test on every method, then refunded, on the real gateway
- [ ] Easyship labels + customs docs generated for SG, US, EU and AU test addresses
- [ ] All tracking verified firing exactly once per event (Meta, TikTok, GA4, Google Ads)
- [ ] **T-2 full dry run completed:** 3 real orders placed, fulfilled, shipped, 1 return processed, 1 ticket answered
- [ ] AI medical-advice guardrail passes adversarial testing 100%
- [ ] All 11 SOPs written, walked through, and accessible to the people who use them
- [ ] Risk register reviewed with mitigations assigned to named owners
- [ ] Go/no-go meeting held; written executive sign-off recorded
- [ ] **Singapore-only soft launch live; paid ads held for 48 h**
- [ ] T+14 international gate criteria met before any market beyond SG is opened
- [ ] Daily KPI review running; first monthly business review scheduled
