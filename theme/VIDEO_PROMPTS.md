# BIO N:OV — Video Assets

Seven video slots. Every one already has a working `<video>` element, a poster
fallback and a Theme Editor field for its URL — the site looks finished before
any of these exist. Generate them, encode them, upload them, paste the URLs in.

Recommended generators: **Kling 3.0**, **Veo 3.1**, **Seedance 2.0**.

---

## Where each slot lives

| Slot | Section | Theme Editor field | Length |
|---|---|---|---|
| `hero-vessel-loop` | BGX Hero | Video URL (MP4) | 8s seamless loop |
| `vessel-aging-scrub` | BGX Vessel aging | Aging video URL | 12s, one continuous take |
| `vessel-restore` | BGX Vessel aging | Restore video URL | 6s |
| `molecule-field` | BGX Mechanism | Molecule field → Video URL | 10s loop |
| `fermentation-lab` | BGX Mechanism | Fermentation lab clip → Video URL | 6s |
| `ingredients-macro` | BGX Ingredients | Video URL (MP4) | 8s |
| `product-rotate` | BGX Guarantee CTA (or Hero) | Video URL (MP4) | 6s loop |

---

## The prompts

### 1. `hero-vessel-loop` — Hero

> Cinematic macro camera flythrough inside a healthy human artery, glossy
> translucent red-pink vessel walls, red blood cells drifting past, glowing
> electric-cyan nitric oxide molecules pulsing and streaming forward,
> volumetric light, shallow depth of field, medical 3D render, dark
> background, ultra detailed, 8k, seamless loop.

**Must loop seamlessly** — it sits behind the headline at 55% opacity and runs
forever. Generate a few takes and pick the one whose first and last frames
match. Keep motion slow; fast camera movement fights the text on top of it.

### 2. `vessel-aging-scrub` — The centrepiece (M3)

> Slow continuous 3D medical animation of a cross-sectioned artery aging over
> time: begins wide open, smooth and elastic with vivid blood flow; gradually
> the walls thicken, yellow plaque accumulates along the interior, the channel
> narrows and blood flow slows to a crawl; single continuous camera, no cuts,
> dark clinical background, photoreal medical render.

**This is the one that matters most.** Scroll position drives
`video.currentTime`, so the clip must be a **single continuous take with no
cuts and a linear progression** — any cut or camera jump will read as a glitch
when someone scrolls back up. Aim for even pacing: the change from 0→6s should
feel the same magnitude as 6→12s.

### 3. `vessel-restore` — The reversal

> 3D medical animation: a narrowed plaque-lined artery is flooded with glowing
> cyan nitric oxide molecules; the vessel walls relax and expand outward,
> plaque recedes, blood flow accelerates and brightens, healthy vivid red flow
> returns, cyan light bloom, photoreal medical render, dark background.

Its first frame should roughly match the **last** frame of
`vessel-aging-scrub` — that is where the cross-fade happens.

### 4. `molecule-field` — Mechanism background

> Abstract dark medical background, thousands of tiny glowing cyan nitric
> oxide molecules drifting and connecting with faint light threads, slow
> parallax, depth of field, seamless loop.

Can be low-resolution — it sits at 35% opacity under a live particle canvas.
720p is fine here and saves weight.

### 5. `fermentation-lab` — Technology

> Premium Korean biotech laboratory, microbial fermentation tanks with softly
> glowing cyan liquid, condensation on glass, slow dolly push-in, clean white
> and blue palette, cinematic commercial lighting, shallow depth of field.

Framed in a 4:5 glass card, so compose vertically or expect a centre crop.

### 6. `ingredients-macro` — Ingredients

> Extreme macro slow-motion of fresh garlic bulbs, crisp green lettuce leaves,
> soybeans and soybean sprouts on a clean white marble surface, water
> droplets, soft daylight, rotating slowly, premium food commercial
> cinematography.

Sits at 28% opacity behind cards — keep it bright and low-contrast so the card
text stays readable.

### 7. `product-rotate` — Product / offer

> Studio product shot of a white and blue Korean supplement box rotating
> slowly on a clean surface, soft gradient blue-to-violet backdrop, subtle rim
> light, premium pharmaceutical commercial, 8k.

⚠️ AI generators will not reproduce the real BIO N:OV packaging text
accurately. Use this only as an abstract background, or film the real box.
**Do not publish AI-generated packaging as if it were the real product.**

---

## Encoding rules

Run every clip through these before uploading:

| Rule | Value |
|---|---|
| Max resolution | 1080p (720p for `molecule-field`) |
| Target size | **under 3 MB per loop** |
| Formats | H.264 MP4 (required) + VP9 WebM (optional, ~30% smaller) |
| Audio | **strip it** — the videos are decorative and `aria-hidden` |
| Poster | JPG at 1200px wide, under 150 KB |

```bash
# MP4 (H.264) — the required one
ffmpeg -i input.mp4 -an -vf "scale=1920:-2" -c:v libx264 -preset slow \
  -crf 26 -movflags +faststart -pix_fmt yuv420p hero-vessel-loop.mp4

# WebM (VP9) — optional, served first when present
ffmpeg -i input.mp4 -an -vf "scale=1920:-2" -c:v libvpx-vp9 \
  -crf 34 -b:v 0 -row-mt 1 hero-vessel-loop.webm

# Poster from the first frame
ffmpeg -i input.mp4 -vf "scale=1200:-2" -frames:v 1 -q:v 4 hero-vessel-loop.jpg
```

If a clip lands over 3 MB, raise `-crf` (26 → 30) before you drop resolution.
These sit behind a dark scrim at reduced opacity, so compression artefacts are
far less visible than they would be on a normal video.

### `vessel-aging-scrub` needs one extra flag

Scrubbing seeks constantly, so it needs keyframes packed much closer together
than a normal clip. Without this it will feel sticky when scrolled:

```bash
ffmpeg -i aging.mp4 -an -vf "scale=1600:-2" -c:v libx264 -preset slow \
  -crf 27 -g 12 -keyint_min 12 -sc_threshold 0 \
  -movflags +faststart -pix_fmt yuv420p vessel-aging-scrub.mp4
```

`-g 12` puts a keyframe every 12 frames so any seek lands near one.

---

## Loading behaviour (already built)

- Only the hero video uses `preload="metadata"`. Everything else is
  `preload="none"` with `data-src`, swapped to `src` by an IntersectionObserver
  300px before it enters the viewport.
- Off-screen videos are paused automatically.
- Under `prefers-reduced-motion: reduce`, **no video is ever fetched** — the
  poster is the final design. Posters therefore need to look finished on their
  own, not like a paused frame.
- If a poster is missing, a dark brand gradient stands in, so an empty slot
  never looks broken.

---

## Uploading

**Shopify Files** (Content → Files) is the recommended host: free, on
Shopify's CDN, and it serves the HTTP range requests that scrubbing depends
on. The 20 MB per-file limit is far above the 3 MB target.

Upload, click **Copy link**, then paste into the matching Theme Editor field.

Bunny CDN or Cloudinary work identically — every slot is a plain URL field, so
you can move hosts later without touching code. Whatever you use must serve
`Accept-Ranges: bytes`, or the scrub will stall.
