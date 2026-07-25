# Phase 12 — Brand Identity & Design System

**Goal:** One brand system — colour, type, logo, imagery, components and voice — applied identically across the Shopify store, email, ads, social, packaging and every partner asset, so BioExcela reads as a single premium global brand rather than a collection of files.

> ⚠️ **The compliance rule is part of the brand system, not separate from it.** Voice, headlines, CTAs, image captions, ad copy and packaging text all use **structure-function language** ("supports healthy circulation"). Disease-treatment claims ("lowers blood pressure", "treats hypertension") are prohibited in every medium under HSA (SG), FDA/FTC (US) and EFSA (EU) rules. A beautiful asset that carries a disease claim is a liability, not an asset. §8 is enforceable, not advisory.

## 1. Brand vision & positioning

| Dimension | Position |
|---|---|
| Category | Premium, science-backed nitric oxide support |
| Brand | **BioExcela Global**, operated by Bio Green Elixirs (Singapore, ACRA-registered) |
| Hero product | **BIO N:OV** — third-generation, patented microbial fermentation (KACC91554P), GMP-certified, made in Korea |
| Positioning line | *Third-generation nitric oxide support, fermented in Korea.* |
| Feels like | Apple retail meets a Japanese pharmacy — restrained, precise, quietly expensive |
| Does not feel like | Bodybuilding supplements, discount pharmacy, clinical/medical, wellness-influencer pastel |
| Proof pillars | Patented fermentation · GMP certification · Korean manufacturing · ingredient transparency |

### 1.1 Brand personality

| Trait | Expressed as | Not |
|---|---|---|
| Professional | Precise numbers, plain sentences, no hype punctuation | Corporate, stiff |
| Innovative | "Third generation", fermentation technology, the science page | Futuristic gimmickry, fake lab imagery |
| Premium | Space, restraint, one accent per screen, high-grade photography | Gold foil, luxury clichés, ornate type |
| Caring | Direct answers, honest shipping times, real support hours | Saccharine, over-familiar |
| Evidence-informed | Names ingredients and processes; cites nothing it cannot source | Quoting studies, implying trials, invented statistics |
| Customer-focused | Fast answers, clear policies, no dark patterns | Countdown timers, fake scarcity |
| Modern | Glassmorphism, fluid type, dark navy canvas | Skeuomorphism, drop shadows on text |

## 2. Logo system

| Variant | File | Use | Minimum size |
|---|---|---|---|
| Primary lockup | `bioexcela-primary.svg` | Horizontal wordmark + mark. Site header, email header, invoices, decks | 140 px wide digital · 30 mm print |
| Secondary stacked | `bioexcela-stacked.svg` | Square/vertical spaces: packaging panels, IG profile, app icons | 96 px wide · 22 mm print |
| Icon / mark only | `bioexcela-mark.svg` | Favicon, social avatars, app icon, watermark, packaging seal | 32 px · 10 mm print |
| Monochrome white | `bioexcela-white.svg` | Any dark background at <40% luminance | As above |
| Monochrome black | `bioexcela-black.svg` | Light backgrounds, single-colour print, fax/customs docs | As above |
| Product wordmark | `bio-nov-wordmark.svg` | The **product** mark. Never used as the company logo | 120 px · 26 mm |

**Clear space:** on all sides, equal to the height of the "B" in the wordmark (or the full height of the mark for icon-only use). Nothing — text, image edge, button, other logos — enters that zone.

**Approved backgrounds:** `#050A18` navy (preferred), `#071F61` deep blue, `#0A1428` elevated, white `#FFFFFF`, and photography with a solid tonal area behind the lockup. On busy photography, place the white logo on a 40% navy scrim.

| Incorrect usage — never | Why |
|---|---|
| Recolour the wordmark to pink, orange or a gradient other than the approved cyan→violet | Breaks recognition |
| Stretch, condense, rotate, or outline | Distorts the mark |
| Add drop shadow, bevel, glow or stroke | Not in the system |
| Place on a mid-tone background (40–70% luminance) | Fails contrast in both directions |
| Recreate the wordmark by typing it in Sora | The lockup has custom spacing |
| Use the BIO N:OV product wordmark as the company logo | Confuses brand and product |
| Lock the logo up with a partner logo without clear space | Reads as co-branding |

Asset delivery: SVG (master) + PNG at 1×/2×/3× on transparent + a 1024 px square PNG for marketplaces. Stored in the DAM under `/01-brand/logos/` (Phase 14 §7).

## 3. Colour system

### 3.1 Full palette

CMYK values are naive process conversions for reference only — **request a print-proof from the packaging supplier before any physical print run**; navy in particular shifts on uncoated stock.

| Role | Name | HEX | RGB | CMYK | Primary use |
|---|---|---|---|---|---|
| Primary | **Abyss Navy** | `#050A18` | 5, 10, 24 | 79 / 58 / 0 / 91 | Page background, packaging base, ad canvas |
| Primary | **Deep Ocean** | `#071F61` | 7, 31, 97 | 93 / 68 / 0 / 62 | Gradient base, hero fields, print backgrounds |
| Surface | **Elevated Navy** | `#0A1428` | 10, 20, 40 | 75 / 50 / 0 / 84 | Cards, header, footer, modals |
| Accent | **Signal Cyan** | `#00DCFF` | 0, 220, 255 | 100 / 14 / 0 / 0 | Primary CTA, links, key highlights, icons |
| Accent | **Aqua Cyan** | `#20C7EC` | 32, 199, 236 | 86 / 16 / 0 / 7 | Secondary cyan, gradient stop, print-safe cyan |
| Accent | **Electric Blue** | `#168CF2` | 22, 140, 242 | 91 / 42 / 0 / 5 | Charts, infographics, secondary links |
| Accent | **Core Blue** | `#075BD8` | 7, 91, 216 | 97 / 58 / 0 / 15 | Buttons on light backgrounds, print CTA |
| Accent | **Violet Pulse** | `#7C5CFF` | 124, 92, 255 | 51 / 64 / 0 / 0 | Gradient partner, decorative glow — **decorative only** |
| Accent | **Violet Deep** | `#6657D9` | 102, 87, 217 | 53 / 60 / 0 / 15 | Muted violet for surfaces |
| Accent | **Violet Ink** | `#4B32C3` | 75, 50, 195 | 62 / 74 / 0 / 24 | The only violet allowed **behind white text** (7.6:1) |
| Highlight | **Bloom Pink** | `#E84CA7` | 232, 76, 167 | 0 / 67 / 28 / 9 | Campaign accents, sale badges, social graphics |
| Highlight | **Ember Orange** | `#EF7B2D` | 239, 123, 45 | 0 / 49 / 81 / 6 | Urgency, limited-stock badges, warnings |
| Text | **Ice White** | `#F2F6FF` | 242, 246, 255 | 5 / 4 / 0 / 0 | Primary text on navy |
| Text | **Mist Grey** | `#9BA9C4` | 155, 169, 196 | 21 / 14 / 0 / 23 | Body copy, captions, muted labels |
| Neutral | **Cloud Mist** | `#F4F8FF` | 244, 248, 255 | 4 / 3 / 0 / 0 | Light-mode surfaces, email bodies, print |
| Neutral | **Ink Navy** | `#0A285A` | 10, 40, 90 | 89 / 56 / 0 / 65 | Text on light backgrounds |
| Semantic | Success | `#2FD196` | 47, 209, 150 | 78 / 0 / 28 / 18 | In stock, order confirmed |
| Semantic | Warning | `#EF7B2D` | 239, 123, 45 | 0 / 49 / 81 / 6 | Low stock, delay notice |
| Semantic | Error | `#FF5C6C` | 255, 92, 108 | 0 / 64 / 58 / 0 | Payment failure, form error |

### 3.2 The 60 / 30 / 10 rule

Every surface — web page, ad, email, packaging panel, slide — allocates colour as:

| Share | Role | Colours |
|---|---|---|
| **60%** | Canvas | Abyss Navy / Deep Ocean (or Cloud Mist in light contexts) |
| **30%** | Structure | Elevated Navy surfaces, glass panels, Ice White and Mist Grey type |
| **10%** | Accent | Signal Cyan **plus at most one** of violet / pink / orange |

Hard rules: **one accent hue dominates per composition.** Pink and orange never appear in the same asset. Violet is decorative — gradients, glows, borders — and never carries body text. Cyan owns every primary CTA; if cyan is used decoratively elsewhere on the screen, the CTA loses its meaning.

### 3.3 Accessibility contrast — WCAG 2.1 AA

Targets: **4.5:1** normal text · **3:1** large text (≥24 px, or ≥18.66 px bold) and UI components/focus indicators.

| Foreground | Background | Ratio | Verdict |
|---|---|---|---|
| Ice White `#F2F6FF` | Abyss Navy `#050A18` | **18.3:1** | Pass AAA |
| Mist Grey `#9BA9C4` | Abyss Navy | **8.3:1** | Pass AAA — safe for body copy |
| Signal Cyan `#00DCFF` | Abyss Navy | **11.9:1** | Pass AAA — links, headings |
| Ember Orange `#EF7B2D` | Abyss Navy | **7.1:1** | Pass AAA |
| Bloom Pink `#E84CA7` | Abyss Navy | **5.7:1** | Pass AA |
| Violet Pulse `#7C5CFF` | Abyss Navy | **4.5:1** | Marginal — large text and graphics only |
| Dark ink `#001018` | Signal Cyan `#00DCFF` | **11.7:1** | Pass AAA — the primary button |
| Dark ink `#001018` | Violet Pulse `#7C5CFF` | **4.4:1** | **FAIL** |
| Ice White `#F2F6FF` | Violet Pulse `#7C5CFF` | **4.0:1** | **FAIL** |
| Ice White `#F2F6FF` | Violet Ink `#4B32C3` | **7.6:1** | Pass AAA |

> ⚠️ **The gradient button trap.** `.btn--primary` uses `linear-gradient(120deg, #00DCFF, #7C5CFF)` with dark `#001018` label text. Contrast is 11.7:1 at the cyan end but drops to **4.4:1** at the violet end — a fail. Fix by ending the gradient at ~60% (`linear-gradient(120deg, #00DCFF 0%, #20C7EC 55%, #6657D9 140%)`) so the label always sits over cyan, or by keeping button labels inside the left 60% of the fill. Never put white text on `#7C5CFF` — use `#4B32C3`.

Also required: visible focus rings (`outline: 2px solid #00DCFF; outline-offset: 1px` — already in `base.css`), never colour alone to convey state (pair with icon or label), and respect `prefers-reduced-motion` (already handled by `.reveal`).

## 4. Typography

Heading: **Sora** (600/700). Body: **Inter** (400/500/600). Fallbacks: `"Segoe UI", -apple-system, sans-serif`.

> ⚠️ `base.css` sets `html { font-size: 62.5% }`, so **1rem = 10px**. Every rem value below reflects that. If anyone removes the 62.5% rule, the entire scale breaks. Self-host Sora and Inter as woff2 in `assets/` with `@font-face` and `font-display: swap` — never a render-blocking Google Fonts `<link>` (Phase 2).

| Token | Element | Size (rem → px) | Weight | Line height | Letter spacing |
|---|---|---|---|---|---|
| `display` | Hero H1 | `clamp(3.4rem, 6vw, 6.4rem)` → 34–64 px | 700 | 1.15 | −0.02em |
| `h2` | Section heading | `clamp(2.6rem, 4vw, 4.2rem)` → 26–42 px | 600 | 1.15 | −0.02em |
| `h3` | Sub-heading, card title | `clamp(2rem, 2.6vw, 2.6rem)` → 20–26 px | 600 | 1.2 | −0.01em |
| `h4` | Footer heading, label | 1.3rem → 13 px | 600 | 1.4 | 0.16em, uppercase |
| `lead` | Hero paragraph | 1.8rem → 18 px | 400 | 1.6 | 0 |
| `body` | Default paragraph | 1.6rem → 16 px | 400 | 1.7 | 0 |
| `body-sm` | Card copy, table cells | 1.4rem → 14 px | 400 | 1.6 | 0 |
| `caption` | Legal, disclaimer, meta | 1.2rem → 12 px | 400 | 1.5 | 0 |
| `button` | All CTAs | 1.5rem → 15 px | 600 (Sora) | 1 | 0.04em |
| `eyebrow` | Kicker above headings | 1.2rem → 12 px | 600 | 1 | 0.28em, uppercase |
| `price` | PDP price | 2.4rem → 24 px | 700 | 1.2 | −0.01em |
| `badge` | Pills, tags | 1.1rem → 11 px | 700 | 1 | 0.08em, uppercase |

Rules: max **2 type sizes** per component · body measure 60–75 characters (`max-width: 54ch` on leads, `72ch` on section headers) · never centre more than 3 lines of body copy · never set body text below 14 px on any surface including packaging back panels · headings sentence case, never ALL CAPS except eyebrows and badges.

## 5. Design tokens

Canonical values, matching `shopify/theme/assets/base.css` and `app/globals.css`. Anything added to either file must be added here first.

```css
:root {
  /* — Colour ————————————————————————————————— */
  --color-bg:            #050A18;  /* Abyss Navy    */
  --color-bg-deep:       #071F61;  /* Deep Ocean    */
  --color-surface:       #0A1428;  /* Elevated Navy */
  --color-text:          #F2F6FF;  /* Ice White     */
  --color-text-muted:    #9BA9C4;  /* Mist Grey     */
  --color-accent:        #00DCFF;  /* Signal Cyan   */
  --color-accent-soft:   #20C7EC;  /* Aqua Cyan     */
  --color-electric:      #168CF2;
  --color-blue:          #075BD8;
  --color-accent-2:      #7C5CFF;  /* Violet Pulse — decorative only */
  --color-violet-deep:   #6657D9;
  --color-violet-ink:    #4B32C3;  /* only violet safe behind white text */
  --color-pink:          #E84CA7;
  --color-orange:        #EF7B2D;
  --color-mist:          #F4F8FF;
  --color-ink:           #0A285A;
  --color-success:       #2FD196;
  --color-warning:       #EF7B2D;
  --color-error:         #FF5C6C;
  --color-on-accent:     #001018;  /* label colour on cyan fills */

  /* — Type ——————————————————————————————————— */
  --font-heading: "Sora", "Segoe UI", -apple-system, sans-serif;
  --font-body:    "Inter", "Segoe UI", -apple-system, sans-serif;
  --fs-display:   clamp(3.4rem, 6vw, 6.4rem);
  --fs-h2:        clamp(2.6rem, 4vw, 4.2rem);
  --fs-h3:        clamp(2rem, 2.6vw, 2.6rem);
  --fs-lead:      1.8rem;
  --fs-body:      1.6rem;
  --fs-sm:        1.4rem;
  --fs-caption:   1.2rem;
  --lh-tight:     1.15;
  --lh-body:      1.7;
  --ls-tight:     -0.02em;
  --ls-eyebrow:   0.28em;

  /* — Space (4px base, expressed in the 62.5% rem scale) ———— */
  --space-1: 0.4rem;  --space-2: 0.8rem;  --space-3: 1.2rem;
  --space-4: 1.6rem;  --space-5: 2.4rem;  --space-6: 3.2rem;
  --space-7: 4.8rem;  --space-8: 7.2rem;  --space-9: 11rem;
  --page-width: 128rem;

  /* — Shape, glass, motion ————————————————————— */
  --radius:        1.2rem;                       /* cards ×2 = 24px, pills 999px */
  --radius-pill:   999px;
  --glass-bg:      rgba(255, 255, 255, 0.05);
  --glass-border:  rgba(255, 255, 255, 0.12);
  --glass-blur:    18px;
  --shadow-soft:   0 20px 60px rgba(0, 0, 0, 0.45);
  --shadow-cta:    0 12px 34px rgba(0, 220, 255, 0.35);
  --transition:    0.35s cubic-bezier(0.22, 1, 0.36, 1);
  --gradient-accent: linear-gradient(120deg, #00DCFF 0%, #20C7EC 55%, #6657D9 140%);
  --gradient-hero:   radial-gradient(1200px 700px at 80% -10%, rgba(0,220,255,.10), transparent 60%),
                     radial-gradient(1000px 600px at -10% 40%, rgba(124,92,255,.08), transparent 55%);
}
```

The Next.js landing page (`app/globals.css`) runs a **light** variant of the same brand — white canvas, `--ink` text, navy CTAs. That is permitted as a campaign surface, but it must use the same hues, type scale and component shapes. Two colour modes, one system.

## 6. Photography & imagery

| Category | Direction | Specification |
|---|---|---|
| Product hero | Pack shot floating on Abyss Navy, cyan rim-light from upper-left, soft violet fill from lower-right | Square 2048×2048 and 4:5 2048×2560, WebP, ≤400 KB |
| Product detail | Blister/tablet macro, focus on texture; label legible and **accurate to the approved label** | 3:2, ≤250 KB |
| Ingredient | Fermented garlic, fermented lettuce, soybean, soybean sprouts — macro on navy, desaturated, one cyan highlight | Square, ≤200 KB |
| Lifestyle | 40+ adults, active but ordinary: morning routine, walking, cooking, travel. Natural light, shallow depth | 4:5 and 9:16, ≤300 KB |
| Editorial / science | Fermentation vessels, Korean facility, GMP context — **factual documentary only** | 16:9, ≤350 KB |
| Social 9:16 | Product or person, subject in the upper 60%, safe zones clear of TikTok/IG UI | 1080×1920, ≤500 KB |
| UGC | Real customers, real phones, minimal grading — deliberately less polished | Native, unretouched beyond crop |

**Lighting:** one key + one rim; deep but never crushed shadows; no on-camera flash look. **Composition:** generous negative space, subject off-centre on thirds, horizon level. **Backgrounds:** navy gradient, matte concrete, warm neutral linen. Never white seamless (reads pharmacy), never marble (reads influencer).

**Model diversity:** cast across Singaporean/Malaysian Chinese, Malay, Indian, Caucasian and Korean subjects, 35–70, mixed gender, mixed body type — the customer base is genuinely global. Every model on a signed release covering paid media and affiliate reuse.

**Retouching:** colour, exposure, dust and blemish removal only. **Never** slim, smooth or reshape a body, and **never** produce before/after imagery, medical settings, lab coats, stethoscopes, pill-organiser-and-blood-pressure-cuff staging, or anything implying clinical treatment.

> ⚠️ AI-generated imagery is permitted for **backgrounds, textures and abstract science motifs only**. Never AI-generate a person presented as a customer, never AI-generate the product packaging (the label must be photographically accurate), and never AI-generate a facility presented as the real manufacturer.

## 7. Iconography, illustration & motion

| Attribute | Standard |
|---|---|
| Icon family | One only — **Lucide** (open source, MIT). No mixing with Font Awesome, Material or stock icon packs |
| Stroke | 1.5 px at 24 px; scales proportionally (2 px at 32 px) |
| Corner radius | 2 px on icon geometry; `--radius` (12 px) on containers; 999px on pills |
| Icon sizes | 20 / 24 / 28 px inline · 56 px in `.benefit-card__icon` tiles |
| Icon colour | `--color-accent` on navy; `--color-ink` on light. Never multicolour, never gradient-filled |
| Illustration | Line-and-glow: 1.5 px cyan strokes over navy, single violet radial glow, no fills, no characters, no mascots |
| Data viz | Sequential cyan→violet ramp; categorical: cyan, electric blue, violet, pink, orange in that order |
| Motion | `--transition` (0.35s, `cubic-bezier(0.22,1,0.36,1)`). Entrances: 24 px rise + fade. Hover: −2 to −4 px translate. Never bounce, never spin, never parallax on mobile |
| Reduced motion | All entrance animation disabled under `prefers-reduced-motion: reduce` |

## 8. Brand voice & messaging

**Tone:** confident, plain, specific. Short sentences. Numbers over adjectives. Never shouty, never mystical, never medical.

**Writing rules:** second person ("you") · active voice · one idea per sentence · no exclamation marks in body copy (one maximum per email, in the subject line only) · no emoji on-site or in transactional email; sparingly on social · British-influenced Singapore English on the SG storefront, US spelling on `/en-us/`.

### 8.1 We say / we never say — enforceable

| ✅ We say | ❌ We never say | Why |
|---|---|---|
| "Supports healthy circulation" | "Lowers blood pressure" | Disease claim |
| "Helps maintain normal blood flow" | "Treats hypertension" / "for high blood pressure" | Disease claim |
| "Supports everyday energy and vitality" | "Cures fatigue" / "fixes chronic fatigue" | Disease claim |
| "Third-generation nitric oxide support" | "Clinically proven to raise nitric oxide by X%" | Unsubstantiated efficacy claim |
| "Produced by patented microbial fermentation (KACC91554P)" | "Patented formula proven in trials" | Implies clinical evidence we are not citing |
| "Manufactured in a GMP-certified facility in Korea" | "Pharmaceutical grade" / "medical grade" | Implies drug status |
| "Take 1 tablet three times daily" | "Take more for faster results" | Dosage advice beyond the label |
| "Many customers take it as part of a daily routine" | "Doctors recommend" / "Recommended by cardiologists" | Unsubstantiated endorsement |
| "If you take medication or have a health condition, speak with your healthcare professional first" | "Safe to take with any medication" | Medical advice |
| "Ingredients: fermented garlic extract, fermented lettuce extract, soybean, soybean sprouts" | "Contains clinically dosed actives" | Implies clinical dosing |
| "Results vary from person to person" | "Works in 7 days" / "guaranteed results" | Outcome promise |
| "60 tablets — a 20-day supply at 3 tablets daily" | "One month supply" | Factually wrong (20 days) |

Two further absolutes: **no fabricated reviews or testimonials, ever** (Phase 10 §1) and **no invented statistics** — if a number cannot be sourced to the label, the manufacturer's documentation or Shopify's own data, it does not go in an asset.

### 8.2 Headline patterns

| Pattern | Example |
|---|---|
| Category + origin | "Third-generation nitric oxide support, fermented in Korea." |
| Mechanism, not outcome | "Patented microbial fermentation. KACC91554P." |
| Honest specificity | "500 mg × 60 tablets. Three a day. Twenty days." |
| Ingredient-led | "Fermented garlic. Fermented lettuce. Soybean. Nothing hidden." |
| Standards-led | "GMP-certified. Made in Korea. Shipped worldwide." |

### 8.3 Approved CTA copy library

| Context | Approved | Banned |
|---|---|---|
| PDP primary | `Add to Cart` · `Add to Bag` | `Buy Now Before It's Gone` |
| PDP express | `Buy it now` (Shopify native) | — |
| Bundle upgrade | `Upgrade to 3 Boxes — Save 10%` · `Get 6 Boxes — Save 20%` | `Best Deal Ever` |
| Subscription | `Subscribe & Save 15%` | `Never Run Out — Lock In Now` |
| Homepage hero | `Shop BIO N:OV` · `See the Science` | `Fix Your Circulation` |
| Collection | `View Bundles` · `Shop All` | — |
| Cart | `Checkout` · `Continue Shopping` | `Secure My Order Now!!` |
| Email | `Reorder in One Tap` · `Read the Ingredients` · `Track Your Order` | `Don't Miss Out` |
| Lead capture | `Get 10% Off` · `Join the List` | `Claim Your Free Gift` |
| Support | `Contact Support` · `Track My Order` · `Start a Return` | — |
| Affiliate | `Apply to the Program` · `Get Your Link` | `Earn Passive Income Fast` |

Rules: sentence case or title case consistently per surface · maximum 4 words on mobile CTAs · one primary (cyan) CTA per viewport · never two competing primaries on one screen.

## 9. UI component standards

| Component | Class | Spec | States |
|---|---|---|---|
| Primary button | `.btn--primary` | Gradient fill, `#001018` label, 16/32 px padding, pill radius, `--shadow-cta` | hover −2 px + deeper shadow · focus 2 px cyan ring · disabled 50% opacity, no transform |
| Secondary button | `.btn--secondary` | Glass fill, 1 px glass border, Ice White label | hover: cyan border + cyan label |
| Full-width button | `.btn--full` | 100% width — mobile buy box, cart | — |
| Glass card | `.glass-card` | `rgba(255,255,255,.05)`, 1 px border, 18 px blur, 24 px radius, 32 px padding | hover −4 px, border → `rgba(0,220,255,.35)` |
| Product card | `.product-card` | 1:1 media, 24 px radius, title 17 px, price cyan 600 | hover: image scale 1.05 over 0.6 s |
| Badge / pill | `.product-card__badge` | Gradient fill, 11 px 700 uppercase, 0.08em tracking | Variants: bestseller (cyan), new (violet), sale (pink), low stock (orange) |
| Eyebrow | `.eyebrow` | 12 px 600, 0.28em tracking, cyan, 32 px gradient rule before | — |
| Trust badge | `.trust-strip__item` | Pill, glass fill, 20 px cyan icon, 13 px 600 label | — |
| Form field | `.field` | 14/18 px padding, glass fill, 12 px radius, 15 px text, label 13 px 600 muted | focus: 2 px cyan outline · error: `#FF5C6C` border + message + icon |
| Accordion | `.faq-item` | Native `<details>`, 18 px radius, `+` → `×` rotate on open | keyboard accessible by default |
| Sticky ATC | `.sticky-atc` | Fixed bottom bar, 90% navy + 20 px blur, slides in when buy box exits viewport | — |
| Nav / header | `.site-header` | Sticky, 72 px min height, 72% navy + 20 px blur, 1 px bottom border | — |
| Announcement bar | `.announcement-bar` | Gradient fill, `#001018` text, 13 px 600, ≤60 characters | — |
| Testimonial | `.testimonial__*` | `#ffc857` stars, 16 px quote in Ice White, 13 px muted attribution | Genuine reviews only |
| Alert / inline message | to build | Glass card + 4 px left border in the semantic colour + matching icon + text label | success / warning / error / info |
| Pop-up / modal | to build | Max 480 px, 24 px radius, glass, focus-trapped, ESC closes | **One per session maximum. No exit-intent on mobile. Never a countdown timer** |
| Table | `.comparison` | 64 rem min width in an `overflow-x` wrapper, uppercase 13 px headers, 1 px row rules | Highlight column `rgba(0,220,255,.08)` |
| Comparison / data viz | — | Cyan→violet ramp per §7 | — |

## 10. Visual consistency & governance

| Surface | Owner | Review before publish |
|---|---|---|
| Shopify storefront | Ryan | Design + compliance |
| Klaviyo email & SMS | Marketing | Design + compliance |
| Meta / TikTok / Google ads | Marketing | **Compliance mandatory** (Phase 10 SOP-06) |
| Organic social | Marketing | Design |
| Packaging & inserts | Ryan | **Compliance + regulatory + print proof** |
| Affiliate & creator assets | Marketing | Compliance — assets are pre-approved so partners cannot improvise |
| Decks, PDFs, invoices | Ryan | Design |
| Retail / marketplace listings | Ryan | Compliance |

**Design QC checklist — run on every asset before it ships:**

- [ ] Correct logo variant, correct clear space, approved background
- [ ] Colours drawn from §3.1 only; 60/30/10 respected; one accent hue
- [ ] Type from the §4 scale; no size invented; body ≥14 px
- [ ] Text contrast ≥4.5:1 (≥3:1 for large text and UI)
- [ ] One primary CTA, copy taken from the §8.3 library
- [ ] Imagery meets §6; no clinical staging, no before/after, no AI-generated people
- [ ] Icons are Lucide at the correct stroke weight
- [ ] **Compliance pass: structure-function language only, zero disease claims, no invented data, no fabricated testimonial**
- [ ] Supplement disclaimer present where required (PDP, packaging, ads in regulated placements)
- [ ] Company identity correct: BioExcela Global, operated by Bio Green Elixirs (Singapore)
- [ ] Exported at spec, filed in the DAM with the correct naming convention (Phase 14 §7)

Quarterly brand audit: sweep site, email, ads, social, affiliate library and packaging against this document; log drift; fix or update the standard — never leave a rule that reality has already overtaken.

## 11. Deliverables

| Deliverable | Where |
|---|---|
| Brand style guide (this document) | Phase 12 |
| Logo usage manual + asset pack | §2 → DAM `/01-brand/logos/` |
| Colour palette (HEX/RGB/CMYK) + 60/30/10 rule | §3 |
| Accessibility contrast reference | §3.3 |
| Typography guide & type scale | §4 |
| Design tokens (CSS custom properties) | §5 → `base.css`, `globals.css` |
| Photography & imagery guide | §6 |
| Icon library spec | §7 |
| Brand voice, we say/we never say, CTA library | §8 |
| Component library spec | §9 |
| Design QC checklist | §10 |

## ✅ Phase 12 exit criteria

- [ ] All six logo variants produced as SVG + PNG (1×/2×/3×) and filed in the DAM
- [ ] Logo usage manual written, including the incorrect-usage table
- [ ] Full colour palette documented with HEX, RGB and CMYK; print proof requested from the packaging supplier
- [ ] 60/30/10 rule applied across storefront, email templates and ad templates
- [ ] **Every text/background pair on the live site measured at ≥4.5:1** (≥3:1 large text/UI)
- [ ] Gradient-button contrast fix applied — no label text sits over `#7C5CFF`
- [ ] Sora + Inter self-hosted as woff2 with `font-display: swap`; no render-blocking font requests
- [ ] Type scale in §4 implemented; nothing on the site uses an off-scale size
- [ ] Design tokens in §5 reconciled with `base.css` and `app/globals.css` — single source of truth
- [ ] Photography guide issued to every photographer, retoucher and creator; model releases signed
- [ ] Lucide adopted as the single icon family; all non-Lucide icons removed
- [ ] Brand voice guide published, including the we say / we never say table
- [ ] CTA copy library adopted; no off-library button text anywhere on the site
- [ ] Component specs match the live theme; alert and modal components built to spec
- [ ] Design QC checklist attached to the publishing workflow for site, email, ads, social and packaging
- [ ] **Full compliance sweep of every existing brand asset — zero disease claims, zero invented statistics, zero fabricated testimonials**
- [ ] Quarterly brand audit scheduled with a named owner
