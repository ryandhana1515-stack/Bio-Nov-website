# AURUM & NOIR — Eclipse

Cinematic 3D scroll launch site for the Eclipse tourbillon chronograph.
Static site — no build step, no framework. Lenis smooth scroll + GSAP ScrollTrigger,
with all three product films scrubbed as canvas frame sequences.

## Run

```bash
cd aurum-noir/site
python3 -m http.server 8080
# open http://localhost:8080
```

(Any static file server works — `npx serve`, nginx, etc.)

## Structure

- `site/` — the deliverable. `index.html`, `css/`, `js/main.js`, self-hosted fonts, vendored GSAP/Lenis.
- `site/frames/{hero,macro,exploded}/` — the three clips as JPEG frame sequences (1600×900):
  1. `hero` — 160 frames, 360° studio turntable, gold dust drifting
  2. `macro` — 120 frames, extreme close-up glide across the dial to the spinning tourbillon
  3. `exploded` — 140 frames, the watch assembling itself from floating components
- `tools/` — the render rig that produced the frames: a procedural Three.js model of the
  Eclipse (brushed black titanium, gold tourbillon under sapphire) rendered headlessly
  via Chromium. `node tools/render.js [hero|macro|exploded]` re-renders.

## Swapping in Seedance 2.0 footage

The Higgsfield MCP was not connected in the session that built this, so the three clips
were rendered from a single procedural 3D model (which also guarantees the product is
identical across clips). To replace them with Seedance 2.0 generations, extract each
~8s clip to the matching folder and update the counts in `site/js/main.js` (`SEQ`):

```bash
ffmpeg -i hero.mp4 -vf "scale=1600:900" -q:v 4 site/frames/hero/f%04d.jpg -start_number 0
```

Prompts to use (std mode, 1080p, 16:9, no audio, ~8s, hero image as reference in every clip):

1. **Hero image** — "Luxury wristwatch product photo, brushed black titanium case,
   gold tourbillon visible through sapphire glass at 6 o'clock, black dial, gold indices,
   floating in a black void, dramatic rim lighting, studio photography."
2. **Hero orbit** — "Slow, perfectly smooth 360° studio turntable of the watch floating
   in a black void, dramatic rim lighting, faint gold dust drifting."
3. **Macro fly-through** — "Extreme close-up glide across the dial: engraved indices,
   the tourbillon cage spinning, light rippling across brushed metal."
4. **Exploded assembly** — "The watch assembling itself from floating components — gears,
   springs, bezel, strap — converging into the finished piece."
