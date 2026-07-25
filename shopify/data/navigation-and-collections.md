# Navigation, Collections & Pages Setup

## Collections to create (Products → Collections)

| Collection | Handle | Type | Rule |
|---|---|---|---|
| All Products | `all` | Automatic | Price > 0 (catch-all) |
| BIO N:OV | `bio-nov` | Manual | The flagship product + future bundles |
| Best Sellers | `best-sellers` | Manual | Curated |
| Bundles & Savings | `bundles` | Automatic | Tag equals `bundle` |
| New Arrivals | `new` | Automatic | Newest first, tag `new` |

## Main menu (Online Store → Navigation → "main-menu")

1. Shop → `/collections/all`
2. BIO N:OV → `/products/bio-nov`
3. Science → `/pages/science`
4. About → `/pages/about`
5. Journal → `/blogs/news`
6. Contact → `/pages/contact`

## Footer menus (create three menus, assign in footer blocks)

**Column 1 — Shop:** All Products · BIO N:OV · Bundles · Gift Cards
**Column 2 — Learn:** Science · Ingredients · FAQ · Journal · Before & After
**Column 3 — Company:** About BioExcela · Affiliate Program · Creator Program · Wholesale · Contact · Track Your Order

## Pages to create (Online Store → Pages)

| Page | Template suffix | Notes |
|---|---|---|
| About BioExcela | `page` | Brand story; company entity: Bio Green Elixirs (Singapore, ACRA) |
| About BIO N:OV | `page` | Product story |
| Science | `page.science` | Auto-includes How-it-works, Ingredients, Comparison, FAQ sections |
| FAQ | `page.faq` | Auto-includes FAQ accordion section |
| Contact | `page.contact` | Wired to Shopify contact form → info@biogreenelixirs.com |
| Affiliate Program | `page` | Links to GoAffPro portal once installed |
| Creator Program | `page` | Application form (use Shopify Forms app or GoAffPro) |
| Wholesale | `page` | B2B enquiry form |
| Shipping Policy / Refund Policy / Privacy / Terms | — | Use Settings → Policies (auto-linked in footer) |

## Blog

Create one blog: **Journal** (`news`). Categories via tags: `science`, `wellness`, `brand`.
