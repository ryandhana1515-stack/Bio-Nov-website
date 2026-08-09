# Bio Green Elixirs — BIO N:OV

This repository holds two separate builds of the BIO N:OV site. They are
independent — neither imports from the other.

| Folder | What it is | Status |
|---|---|---|
| [`theme/`](theme/) | **Shopify theme** (Dawn 15.5.0 fork). Real cart and checkout, Theme Editor editable. | Primary build |
| `app/`, `components/` | Next.js marketing site, the earlier build. | Kept as a reference / fallback landing page |

**Start here: [`theme/README.md`](theme/README.md)** — how to preview it, push
it to the store, edit copy, and swap the videos.

Supporting docs in `theme/`:

- [`PRODUCT_SETUP.md`](theme/PRODUCT_SETUP.md) — one validated GraphQL call to
  create the BIO N:OV product with its three bundle variants, plus the Admin
  settings still to configure.
- [`VIDEO_PROMPTS.md`](theme/VIDEO_PROMPTS.md) — the seven video generation
  prompts, encoding commands and upload instructions.
- [`CONTENT_VERIFICATION.md`](CONTENT_VERIFICATION.md) — what still needs legal,
  scientific and regulatory sign-off before launch. **Read this one.**

---

## The Shopify theme in one paragraph

A Dawn fork with fifteen custom `bgx-*` sections telling the BIO N:OV story:
nitric oxide declines with age → here is what that costs you → here is a
3rd-generation Korean answer → here is the lab data, the patent and the
research team → choose your supply. It is dark, cinematic and scroll-driven,
with six signature motion moments including a pinned artery-aging sequence
scrubbed by scroll position. Everything degrades gracefully: no GSAP, no
videos, reduced motion, or a low-power phone all still produce a complete,
readable page.

## The Next.js site

Still builds and runs:

```bash
npm install && npm run dev
```

Useful if you want a fast static landing page on a separate domain, or as a
reference for the visual language. The 13 images in `public/images/` were
extracted from the product deck and are reused by the Shopify theme (copied
into `theme/assets/` with a `bgx-` prefix).
