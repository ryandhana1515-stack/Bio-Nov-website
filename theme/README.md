# BIO N:OV — Shopify theme

A Shopify theme for Bio Green Elixirs, built on **Dawn 15.5.0**. Every piece
of copy, every price and every video URL is editable in the Theme Editor — you
should never need to open a code file to run this store.

Written for a non-developer. If a step assumes something you have not done,
it is probably in [`PRODUCT_SETUP.md`](PRODUCT_SETUP.md).

---

## Getting it onto your store

You need Node 18+ installed, then:

```bash
npm install -g @shopify/cli
cd theme
shopify theme dev --store sz0gmr-cn.myshopify.com
```

`shopify theme dev` opens a browser to log in, then gives you a preview URL
that live-reloads as files change. Nothing you do here touches your live store.

When it looks right, upload it as an **unpublished** theme:

```bash
shopify theme push --unpublished --theme "BIO N:OV"
```

That creates a new theme in Online Store → Themes, sitting alongside your
current Horizon theme. Horizon stays live and untouched. Preview the new one,
and only click **Publish** when you are happy.

To push changes to it later:

```bash
shopify theme push --theme "BIO N:OV"
```

---

## Before you upload: run the schema check

```bash
python3 scripts/validate-schemas.py
```

Shopify validates section schemas on upload and, when one fails, **silently
drops the file** — and then drops every page template that referenced it, while
still reporting the import as successful. A single bad schema can remove your
whole homepage with no error message anywhere.

This script checks the four rules that bite:

1. A section may declare `presets` or `default`, never both.
2. A `range` default must land exactly on a step (`min: 10, step: 5` allows
   25 or 30, never 28).
3. A setting must not have `"default": ""` — omit the key instead.
4. `theme_name` in `settings_schema.json` is capped at 25 characters.
   Exceed it and Shopify blanks the entire file, leaving the theme with no
   colour schemes at all.

## What is on the homepage

Fifteen sections, in this order. Each one is a separate block in the Theme
Editor that you can reorder, hide or delete.

| # | Section | What it does |
|---|---|---|
| 1 | BGX Hero | Vessel flythrough video, headline, product box, CTAs |
| 2 | BGX NO decline | Self-drawing chart: NO falls 100% → 15% with age |
| 3 | BGX Problem stats | Six body-system cards + global health counters |
| 4 | BGX Vessel aging | **The centrepiece.** Scroll-scrubbed artery aging + reversal |
| 5 | BGX Proof numbers | +18% / +42% / −25% / −8% counter rings |
| 6 | BGX Generations | 1st / 2nd / 3rd gen cards + comparison table |
| 7 | BGX Mechanism | Fermentation explainer, particle field, lab clip |
| 8 | BGX Benefits | Five expanding benefit cards |
| 9 | BGX Ingredients | Four ingredient cards + spec strip |
| 10 | BGX Science team | Lead researcher + seven-person R&D grid |
| 11 | BGX Certifications | Certificate lightbox + badges |
| 12 | BGX Offer bundles | **The money section.** Bundle cards wired to real variants |
| 13 | BGX Testimonials | Auto-scrolling review marquee |
| 14 | BGX FAQ | Accordion with Google FAQ markup |
| 15 | BGX Guarantee CTA | Full-bleed closer |

---

## How to edit the copy

Online Store → Themes → **BIO N:OV** → Customize.

Click any section in the left sidebar and its settings appear. Headings,
body text, button labels, sources and disclaimer toggles are all there.

Sections built from repeating items — benefit cards, FAQ questions, bundle
tiers, team members — use **blocks**. Click a block to edit it, drag to
reorder, use **Add block** for a new one, and the bin icon to delete.

Two things are deliberately *not* editable, because they are legal
requirements rather than marketing copy:

- The laboratory-data disclaimer under the proof numbers.
- The full FDA-style disclaimer in the footer.

Both live in `snippets/bgx-disclaimer.liquid`. If your lawyer changes the
wording, change it there once and it updates everywhere it appears.

---

## How to swap the videos

Read [`VIDEO_PROMPTS.md`](VIDEO_PROMPTS.md) first — it has the seven generation
prompts and the exact `ffmpeg` commands for encoding.

Then, for each video:

1. Content → Files → Upload, and pick your MP4.
2. Click **Copy link** next to it.
3. Customize → the section that uses it → paste into **Video URL (MP4)**.
4. Upload a poster JPG the same way and pick it in **Poster image**.

The poster matters more than you would think: it is what people on slow
connections see, and it is what people with reduced-motion turned on see
*instead of* the video. Make it a frame that looks finished on its own.

Every section works fine with an empty video field — a dark brand gradient
stands in — so you can launch before the videos are ready.

---

## The scroll-scrub section (BGX Vessel aging)

This is the effect the whole page is built around, and the one most likely to
surprise you.

On desktop it pins in place and scroll position drives the video frame by
frame: the artery narrows, decade labels advance, the NO counter falls. Two
thirds of the way through it reverses and the vessel restores.

**On mobile it deliberately does not do that.** Phones, low-power devices,
under 4 CPU cores, save-data mode and reduced-motion all get a static version
where every decade label shows at once. This is not a bug — a stuttering
scrubbed video is worse than no scrub, so it is switched off rather than
shipped badly.

The aging clip must be **one continuous take with no cuts**. Any cut reads as
a glitch when someone scrolls back up.

---

## The offer section

Prices come from Shopify, never from the theme. Change a price in Admin →
Products and it changes on the site. The theme only supplies the labels —
"Save $30", "Most Popular", the free-gift line.

Each bundle card can be pinned to a specific variant via its **Variant ID**
field. Leave it blank and cards map to variants in order. See
[`PRODUCT_SETUP.md`](PRODUCT_SETUP.md) step 2.

The per-box price ("$59 per box") is calculated from the variant price divided
by the **Boxes** number, so keep Boxes accurate.

---

## Turning motion down

Theme settings → **BIO N:OV** → **Performance** → *Disable GSAP / Lenis*.

That switches off smooth scroll, the pinned scrub and parallax site-wide, and
drops about 60KB of JavaScript. Sections fall back to simple fade-up reveals
and everything stays readable. Worth trying if you are chasing a Lighthouse
score and can live without the scrub.

The site also respects each visitor's own **Reduce Motion** setting
automatically — those visitors get instant reveals, no autoplay video and no
scrubbing, without you changing anything.

---

## Marketing pixels

Theme settings → **BIO N:OV** → Marketing pixels. Paste in your Meta Pixel ID,
TikTok Pixel ID and GA4 Measurement ID. Leave any of them blank and that
script simply is not loaded.

---

## Files, if you ever do need to look

```
assets/brand.css          All colours, fonts, spacing. Change tokens here.
assets/motion.js          Reveals, counters, accordions, smooth scroll.
assets/vessel-scene.js    The scroll-scrub, decline chart, particle canvas.
sections/bgx-*.liquid     One file per homepage section.
snippets/bgx-*.liquid     Reused pieces: video background, counter, disclaimer.
templates/*.json          Which sections appear on which page, in what order.
```

The brand colours all live at the top of `assets/brand.css` as CSS variables.
Changing `--bgx-cyan` there restyles the entire site.

---

## Performance and accessibility

Built to the brief's budget:

- Videos below the fold use `preload="none"` and load only when they approach
  the viewport. Off-screen videos pause.
- GSAP, ScrollTrigger and Lenis load deferred from a CDN, and the site works
  correctly if they never arrive — everything falls back to a plain
  IntersectionObserver reveal.
- The particle canvas is capped at 30fps, pauses off-screen, and is disabled
  entirely on save-data or under 4 CPU cores.
- Every interactive element is keyboard-reachable with a visible cyan focus
  ring. Accordions and the bundle selector use proper ARIA.
- Body text is ≥ 5.4:1 contrast against its background everywhere;
  most is above 8:1. The threshold is 4.5:1.
- Videos are decorative: `aria-hidden`, no audio track.

**Not yet measured:** a real Lighthouse run needs the theme live on the store
with real videos in place. Run it against the preview URL once you have
pushed, and drop the screenshot in here. Expect the hero video to be the main
lever on LCP — if it drags, lower the hero video opacity setting and lean on a
well-compressed poster.

**Also not yet tested:** iOS Safari. It is the one browser that reliably
refuses video autoplay (Low Power Mode blocks it outright). The theme handles
that gracefully — the poster stays and nothing retries in a loop — but you
should look at it on a real iPhone before publishing.

---

## Before you go live

- [ ] Replace the six placeholder testimonials with real, consented reviews
- [ ] Upload the four certificate scans and confirm each is currently valid
- [ ] Confirm permission to use all eight researcher portraits
- [ ] Check the price currency question at the top of `PRODUCT_SETUP.md`
- [ ] Write the refund policy so it matches the 30-day guarantee on the site
- [ ] Have the health claims reviewed for every market you ship to —
      see `../CONTENT_VERIFICATION.md`
- [ ] Test checkout end to end with a real card
