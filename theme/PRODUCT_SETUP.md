# BIO N:OV — Product setup

The theme is ready; it just needs a product to sell. This creates it in one
call, with the three bundle variants the offer section expects.

> **Currency note.** Your store's base currency is **SGD** (Bio Elixirs,
> `sz0gmr-cn.myshopify.com`). The prices below are the USD figures from the
> brief entered as-is, so they will be created as **S$69 / S$177 / S$294**.
>
> Pick one before running it:
> - **Sell in USD** — change the store's base currency to USD *first*
>   (Settings → Store details). This is only possible while the store has no
>   orders. It currently has none, so this window is open now and closes on
>   your first sale.
> - **Sell in SGD** — swap the prices below for `92.00 / 237.00 / 394.00`
>   (~1.34 rate) and turn on multi-currency so overseas buyers see their own
>   currency at checkout.

---

## 1. Create the product

Paste into the **Shopify GraphiQL App** (Admin → Apps → GraphiQL), or ask
Claude to run it against your store.

The mutation has been validated against the live Admin API schema.

**Operation:**

```graphql
mutation CreateBioNov($input: ProductSetInput!) {
  productSet(synchronous: true, input: $input) {
    product {
      id
      handle
      title
      variants(first: 10) {
        nodes { id title price compareAtPrice sku }
      }
    }
    userErrors { field message }
  }
}
```

**Variables:**

```json
{
  "input": {
    "title": "BIO N:OV — 3rd Generation Nitric Oxide Supplement",
    "handle": "bio-nov",
    "vendor": "Bio Green Elixirs",
    "productType": "Health Supplement",
    "status": "DRAFT",
    "templateSuffix": "bgx",
    "tags": [
      "nitric-oxide",
      "blood-pressure",
      "korean-supplement",
      "gmp-certified",
      "anti-aging",
      "circulation"
    ],
    "descriptionHtml": "<p>BIO N:OV is a 3rd-generation nitric oxide supplement produced by patented Korean microbial fermentation, using the proprietary strain KACC91554P held by the Korea Research Institute of Bioscience and Biotechnology.</p><p>Unlike 1st-generation arginine products, no enzyme conversion is required — NO is released on contact with stomach acid. Supports healthy blood pressure, blood sugar, circulation, everyday energy and vitality.</p><p><strong>Ingredients:</strong> Fermented garlic extract, fermented lettuce extract, soybean, soybean sprouts.</p><p><strong>Directions:</strong> 3 tablets daily, 1 tablet per serving, with water.</p><p><strong>Storage:</strong> Store in a cool, dry place away from heat and direct sunlight.</p><p><em>These statements have not been evaluated by the FDA or any equivalent regulatory authority. This product is not intended to diagnose, treat, cure or prevent any disease. Consult your physician before use, particularly if you are pregnant, nursing, taking medication or under medical supervision.</em></p>",
    "seo": {
      "title": "BIO N:OV | 3rd-Gen Korean Nitric Oxide Supplement | Bio Green Elixirs",
      "description": "Patented Korean microbial fermentation. Supports healthy blood pressure, circulation and energy. GMP certified. 500mg × 60 tablets. Free worldwide shipping over $99."
    },
    "productOptions": [
      {
        "name": "Supply",
        "position": 1,
        "values": [{ "name": "1 Box" }, { "name": "3 Boxes" }, { "name": "6 Boxes" }]
      }
    ],
    "variants": [
      {
        "optionValues": [{ "optionName": "Supply", "name": "1 Box" }],
        "price": "69.00",
        "sku": "BGX-NOV-1",
        "position": 1,
        "taxable": true,
        "inventoryPolicy": "CONTINUE",
        "inventoryItem": {
          "tracked": false,
          "requiresShipping": true,
          "countryCodeOfOrigin": "KR",
          "measurement": { "weight": { "value": 50.0, "unit": "GRAMS" } }
        }
      },
      {
        "optionValues": [{ "optionName": "Supply", "name": "3 Boxes" }],
        "price": "177.00",
        "compareAtPrice": "207.00",
        "sku": "BGX-NOV-3",
        "position": 2,
        "taxable": true,
        "inventoryPolicy": "CONTINUE",
        "inventoryItem": {
          "tracked": false,
          "requiresShipping": true,
          "countryCodeOfOrigin": "KR",
          "measurement": { "weight": { "value": 150.0, "unit": "GRAMS" } }
        }
      },
      {
        "optionValues": [{ "optionName": "Supply", "name": "6 Boxes" }],
        "price": "294.00",
        "compareAtPrice": "414.00",
        "sku": "BGX-NOV-6",
        "position": 3,
        "taxable": true,
        "inventoryPolicy": "CONTINUE",
        "inventoryItem": {
          "tracked": false,
          "requiresShipping": true,
          "countryCodeOfOrigin": "KR",
          "measurement": { "weight": { "value": 300.0, "unit": "GRAMS" } }
        }
      }
    ],
    "metafields": [
      {
        "namespace": "bgx",
        "key": "ingredients",
        "type": "single_line_text_field",
        "value": "Fermented garlic extract, fermented lettuce extract, soybean, soybean sprouts"
      },
      {
        "namespace": "bgx",
        "key": "dosage",
        "type": "single_line_text_field",
        "value": "3 tablets daily, 1 tablet per serving, with water"
      },
      {
        "namespace": "bgx",
        "key": "certifications",
        "type": "single_line_text_field",
        "value": "Korea GMP; Health Functional Food (건강기능식품)"
      },
      {
        "namespace": "bgx",
        "key": "patent_number",
        "type": "single_line_text_field",
        "value": "US 10,517,912 B2 (strain KACC91554P)"
      },
      {
        "namespace": "bgx",
        "key": "spec",
        "type": "single_line_text_field",
        "value": "500mg × 60 tablets (30g)"
      }
    ]
  }
}
```

**Notes on the choices made here:**

- `"status": "DRAFT"` — it will not be publicly buyable until you flip it to
  Active. Do that once you have checked the price, currency and label copy.
- `"templateSuffix": "bgx"` — binds it to `templates/product.bgx.json`, the
  cinematic product page. Remove this to use Dawn's default product template
  instead.
- `"tracked": false` + `"inventoryPolicy": "CONTINUE"` — sells without stock
  counts while you set up fulfilment. Turn tracking on once inventory is real.
- Weight is per the brief: 50g per box, scaled by bundle, so shipping rates
  calculate correctly.

---

## 2. Copy the variant IDs into the offer section

`productSet` returns the three variant IDs. They look like
`gid://shopify/ProductVariant/1234567890` — you want **just the number**.

Theme Editor → the page with **BGX Offer bundles** → open each tier block →
paste the number into **Variant ID**.

You can skip this: leave Variant ID blank and each card falls back to the
variant in the same position (card 1 → variant 1, and so on). Fill them in
when you want the mapping to survive someone reordering variants in Admin.

Also set the section's **Product** field to BIO N:OV on the homepage — on the
product page it picks up the page's product automatically.

---

## 3. Point the buy bar at it

Theme settings → **BIO N:OV** → **Buy bar product** → BIO N:OV.

That is what the sticky mobile bar adds to cart on pages that are not the
product page.

---

## 4. Create the pages

Content → Pages → Add page. Create these four, then assign each one its
template from the **Theme template** dropdown on the right:

| Title | Handle | Template |
|---|---|---|
| Science | `science` | `page.science` |
| About | `about` | `page.about` |
| Affiliates | `affiliates` | `page.affiliates` |
| FAQ | `faq` | `page.faq` |

The page body can stay empty — all content lives in the template sections.

Then build the nav: Content → Menus → Main menu →
Science · Benefits · Ingredients · About · Affiliates.

---

## 5. Still to configure in Admin

These are outside the theme and need doing before launch:

- **Markets** — enable worldwide selling and multi-currency.
- **Payments** — Shopify Payments + PayPal.
- **Shipping** — a free-shipping rate over $99, plus rates from Singapore and
  Korea.
- **Policies** — refund, privacy, terms, shipping. Settings → Policies.
  The 30-day money-back guarantee promised on the site must match what the
  refund policy actually says.
- **Pixels** — paste the Meta, TikTok and GA4 IDs into Theme settings →
  BIO N:OV.
