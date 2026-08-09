# Content requiring verification before publication

---

## ⚠️ Shopify theme (`theme/`) — specific flags

These came up while building the theme. Ordered by how much they matter.

### 1. The skin percentages are from a different product

The 78% / 84% / 68% / 68% figures in the "Improving Cognition & Skin" benefit
come from Gregory Chernoff, *The Utilization of a Topical Nitric Oxide
Generating Serum in Aesthetic Medicine* — a study of a **topical serum applied
to skin**, not an oral supplement. The deck cites it on page 25 for exactly
these numbers.

Presenting them as results for BIO N:OV attributes another product's findings
to yours. The theme currently shows them with the full source cited and the
laboratory-data disclaimer attached, and the copy says "reported by a
100-person tester panel" rather than claiming BIO N:OV produced them — but
**this is a legal decision, not a copywriting one.** Either substantiate the
numbers for BIO N:OV specifically, or remove that stats block. It is one
Theme Editor field (BGX Benefits → last block → Stats) and deleting it leaves
the rest of the benefit intact.

### 2. Deck claims deliberately NOT carried into the site

The source deck makes several disease claims that cannot ship on a supplement
storefront. All were dropped. **Do not restore them** without specific legal
approval:

| Deck page | Claim | Why it was dropped |
|---|---|---|
| 4 | "99.9% Human Diseases Are NO-Related" | Unsupportable, and frames the product as a disease intervention |
| 19 | "Prevent Cardiovascular Disease" | Explicit disease-prevention claim |
| 20 | "Control Hypertension" | Names a disease and claims control of it |
| 21 | "Prohibit Complications from Diabetes" | Disease-prevention claim |
| 22 | "BIO N:OV Eases Diabetes Symptom" | Treatment claim |
| 24 | Telomere length "determines lifespan"; "people die when telomeres reach a critical length" | Overstated; softened to "supports slower cellular aging" |

The population statistics from deck pages 5–8 (1.28B hypertension, 537M
diabetes, 15M strokes) **are** used, but strictly as cited global-health
context with a disclaimer stating they do not describe the effects of
BIO N:OV. That framing is load-bearing — do not edit it out.

### 3. Claims that need manufacturer substantiation on file

- **"40–400% more effective than other NO supplements"** — a comparative
  efficacy claim against named competitor categories. Get the underlying
  comparison from Bzzworld in writing.
- **"Zero reported side effects"** — an absence-of-evidence claim. Needs
  documentation of what adverse-event monitoring actually exists.
- **"Works across age groups"** / heart-patient suitability — the deck says
  1st-gen arginine is "prohibited for heart disease patients" and BIO N:OV
  "works on EVERYONE". The site states this as a product characteristic. Any
  implication that a heart patient can take it without medical advice is
  dangerous — the FAQ answer directing people to their doctor must stay.
- **"−25% blood pressure within 30 minutes"** and **"−8% blood sugar within
  1 hour"** — carried with the Bzzworld Smart Lab source and the mandatory lab
  disclaimer. Confirm the lab report exists and says this.

### 4. Source attribution to confirm

- The NO-decline chart is labelled `Source: Circulation` (from the build
  brief). The deck's own source line for that chart (page 3) is **blank**.
  Confirm the actual citation or remove the source line.
- `Dr. Nathan Bryan, Functional Nitric Oxide Nutrition` and
  `Dr. Ferid Murad, Magical Nitric Oxide` are named in the deck. Confirm
  permission to cite them by name.

### 5. Placeholders shipped intentionally

- **Six testimonials** are placeholders, each prefixed `PLACEHOLDER` and
  written to mention only taste, packaging, routine and delivery — never a
  health outcome. Fabricated medical testimonials are both non-compliant and
  useless. Replace with consented, verified reviews or connect Loox/Judge.me.
- **Four certificate slots** are empty by design, showing "Certificate image
  pending". Upload the real scans and confirm each certificate is currently
  valid before publishing.
- **Eight researcher portraits** are cropped from the deck. Permission to use
  each portrait, and each person's current title and affiliation, must be
  confirmed.

### 6. Affiliate program

`page.affiliates` states 15–25% commission, a 30-day cookie window and a free
product for accepted affiliates. Those terms came from the brand brief, not
from a signed program — confirm them before publishing, since they read as an
offer. The page also carries affiliate claim rules; make sure the creative
guidelines it promises actually exist before recruiting.

---

## Product and regulatory

- Confirm legal product classification in every market where BIO N:OV is promoted.
- Confirm the authorised full ingredient list, allergen statement, warnings, country of origin and manufacturer/distributor details.
- Confirm the visible specification `500 mg × 60 tablets (30 g)` against the current authorised label.
- Replace the How to Use placeholder only with authorised label directions.
- Verify patent number, microbial strain reference, ownership, GMP certificate and all certificate validity.
- Obtain approval for all product-packaging images and translated packaging text.

## Scientific

- Add approved primary references for nitric oxide physiology, ageing, circulation, cognition, metabolic processes, immune function, respiratory and digestive physiology.
- Review every `supports`, `may support` and `designed to support` statement under local health-claims rules.
- Do not restore the PDF’s disease-treatment, blood-pressure, blood-sugar, anti-ageing, skin-result or comparative effectiveness claims without specific legal approval and robust evidence.
- Do not use laboratory or marketing data as clinical proof.

## People and organisations

- Verify spelling, current titles, professional roles, specialities, affiliations and permission to use each researcher portrait.
- Verify permission to display university, laboratory, patent-office and certification marks.

## Business and privacy

- Add confirmed official distributor, email, phone, address and social links.
- Replace placeholder testimonials with authenticated, consented reviews that comply with advertising rules.
- Add final Privacy Policy, Terms and Conditions, Cookie Policy and market-specific medical disclaimer.
- Connect the enquiry form to an approved secure processor and document consent/data retention.
