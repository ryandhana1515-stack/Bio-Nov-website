# Phase 4 — Global Payments, Shipping & Shopify Markets

**Goal:** Sell in SGD at home and localized currency/payment/shipping everywhere else.

## 1. Shopify Payments + methods

Settings → Payments:

1. Activate **Shopify Payments** (Singapore entity: ACRA number, bank account, director ID required).
2. Enabled automatically: Visa, Mastercard, Amex, **Apple Pay, Google Pay, Shop Pay**.
3. Add **PayPal Express** as additional method (strong for US/EU trust).
4. In Markets, local methods surface automatically where eligible (e.g. iDEAL/Bancontact in EU via Shopify Payments when supported for SG merchants — verify in admin; otherwise consider a secondary gateway for EU local methods later).
5. Turn on **Shop Pay Installments** availability check (US) — BNPL lifts supplement AOV.
6. Payout currency: SGD. Enable payment capture: automatic.

## 2. Shopify Markets (Settings → Markets)

| Market | Countries | Currency | Notes |
|---|---|---|---|
| **Singapore (primary)** | SG | SGD | Base pricing |
| **United States** | US | USD | Price ladder ends in .00/.99; enable duties estimate |
| **Europe** | DE, FR, NL, IT, ES, IE, + rest of EU | EUR | GDPR banner + OSS VAT once registered |
| **United Kingdom** | GB | GBP | UK VAT if > £70k or register voluntarily |
| **Australia** | AU | AUD | GST on low-value imports handled by Shopify checkout settings |
| **Canada** | CA | CAD | |
| **Malaysia** | MY | MYR | Later: fulfil from KL hub |
| **International (rest of world)** | Everything else | USD | Catch-all |

Per market enable: **local currency**, **rounding rules** (x.00 / x.99), **price adjustment** (start +0%; raise US/EU +5-10% to absorb shipping subsidy), **duties & import taxes estimation** (Advanced plan / Managed Markets), **URL structure:** subfolders (`/en-us/`, `/en-gb/` …) — best for SEO.

Languages: English default now. Add via Translate & Adapt app later (German/French/Spanish for EU market growth).

## 3. Taxes (Settings → Taxes and duties)

- **Singapore:** GST-registered? If yes enter GST number, charge 9% domestically.
- **US:** No nexus initially → don't collect; monitor economic nexus per state in the admin's US tax insights; register as thresholds approach.
- **EU/UK:** Under distance-selling thresholds initially; when EU volume grows register **IOSS** (consignments ≤ €150 → charge VAT at checkout, faster customs). UK: register for VAT and charge at checkout for ≤ £135 consignments.
- **AU/NZ:** GST on low-value goods once over AUD 75k/year threshold.
- Enable "Include tax in prices" per-market as legally required (EU/UK/AU display inclusive).

## 4. Shipping (Settings → Shipping and delivery)

**Origin:** Singapore hub. Strategy per the brand playbook: SG hub → SEA/global; KL hub → MY/TH (added as location later); Korea 3PL → US/EU volume later (Amazon FBA path separate).

### Zones & rates (General Profile)

| Zone | Service | Rate | Free threshold |
|---|---|---|---|
| Singapore | Local courier (1-3 days) | S$5 flat | Free > S$80 |
| Malaysia | J&T / SPX (3-6 days) | S$8 | Free > S$100 |
| SEA (TH, PH, ID, VN) | Easyship best-rate (5-10 days) | live rates | Free > S$120 |
| US / CA | Easyship express (6-12 days) | live rates or US$12 flat | Free > US$99 |
| EU / UK | Easyship (6-12 days) | live rates or €12 flat | Free > €99 |
| AU / NZ | Easyship (6-10 days) | live rates or A$15 flat | Free > A$120 |
| Rest of world | Easyship standard | live rates | Free > US$150 |

- Install **Easyship**: connects DHL/FedEx/SG couriers, generates labels + customs docs (HS code for supplements: **2106.90**; check per market), returns pre-paid labels.
- Turn on **estimated delivery dates** at checkout (Easyship/Shopify native).
- **Tracking:** enable Shopify shipping notification emails (confirmation, out-for-delivery, delivered) — customize branding.
- **Returns:** enable self-serve returns in customer accounts; policy: 30-day unopened. Set Return rules (Settings → Policies + customer accounts).

### Checkout conversion settings

- Express checkout buttons on (Shop Pay/Apple/Google Pay render automatically in the theme's payment button).
- Address autocomplete on. Show duties/taxes at checkout for EU/UK/AU to kill surprise-fee abandonment.

## ✅ Phase 4 exit criteria

- [ ] Shopify Payments live (test + real transaction), PayPal connected
- [ ] All 8 markets active with local currency + rounding
- [ ] Shipping zones with rates + free-shipping thresholds
- [ ] Easyship producing labels + customs docs with correct HS code
- [ ] Test orders: SG, US, EU addresses (use Shopify Bogus Gateway first, then $1 live test)
- [ ] Duties/taxes displayed correctly for EU/UK test addresses
