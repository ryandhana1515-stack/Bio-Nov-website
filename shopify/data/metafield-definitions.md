# Metafield Architecture — BioExcela Global

Create these in **Shopify Admin → Settings → Custom data → Products**.
The theme's product template (`main-product.liquid`) renders these automatically as premium accordions, and they scale to every future product — no theme edits needed when you launch product #2.

## Product metafields (namespace: `custom`)

| Definition name | Namespace & key | Type | Used for |
|---|---|---|---|
| Tagline | `custom.tagline` | Single line text | Short benefit line under the product title and on product cards |
| Key benefits | `custom.benefits` | Rich text | "Key benefits" accordion |
| Full ingredients | `custom.ingredients_list` | Rich text | "Full ingredients" accordion (authorised label list only) |
| How to use | `custom.directions` | Rich text | "How to use" accordion (authorised label directions only) |
| Warnings | `custom.warnings` | Rich text | "Warnings" accordion |
| Shipping & returns | `custom.shipping_info` | Rich text | "Shipping & returns" accordion |
| Certifications | `custom.certifications` | List of single line text | Badge row (GMP, patent number, etc.) |
| Scientific summary | `custom.science_summary` | Rich text | Science page / PDP science block |

## Suggested starting values for BIO N:OV

- **Tagline:** "Third-generation nitric oxide support from patented Korean fermentation."
- **Key benefits:** Supports healthy circulation & cardiovascular balance · Supports natural energy & vitality · Supports immune defenses · Supports cognitive wellness · Naturally derived, fermented botanicals
- **Full ingredients:** Fermented garlic extract, fermented lettuce extract, soybean, soybean sprout. *(Confirm against the authorised label before publishing.)*
- **How to use:** Take 1 tablet (500 mg), 3 times daily with water. One box (60 tablets) is a 20-day supply. *(Confirm against the authorised label.)*
- **Warnings:** Consult your healthcare professional before use if you are pregnant, nursing, taking medication or have a medical condition. Keep out of reach of children. Do not exceed the recommended serving.
- **Shipping & returns:** Tracked worldwide shipping from our Singapore hub. 30-day satisfaction guarantee on unopened products — see Refund Policy.
- **Certifications:** `GMP Certified (Korea)`, `Patented fermentation KACC91554P`, `US Patent`

## Metaobjects to create (Settings → Custom data → Metaobjects)

1. **Ingredient** — fields: name (text), image (file), description (rich text), sourcing note (text). Lets the Ingredients page/section pull from one source of truth.
2. **Researcher** — fields: name, title, institution, portrait (file). Powers the Science/Clinical Research page. *(Get written permission before publishing portraits.)*
3. **Testimonial** — fields: quote, author, rating (integer), country, verified (boolean). Only load verified, consented reviews.
4. **FAQ item** — fields: question (text), answer (rich text), category (text). Single source for PDP + FAQ page.

## ⚠️ Compliance note (important)

All pre-filled copy in the theme uses "supports / designed to support" language on purpose. Do **not** publish disease-treatment claims (blood-pressure reduction percentages, blood-sugar drops, comparisons like "40-400% more effective") on the storefront without documented legal/regulatory approval in each market — Singapore (HSA), US (FDA/FTC), EU (EFSA) all restrict these. The lab data can live in approved B2B/clinical contexts instead. See `CONTENT_VERIFICATION.md` in the repo root.
