# Ryan Dhana — Immersive 3D Portfolio

A scroll-driven, cinematic personal portfolio for **Ryan Dhana** — one continuous
interactive film in which a central "Curiosity Core" morphs through eleven story
chapters as the visitor scrolls: fibrous sphere → flowing strands → symbolic
digital head → fingerprint contour face → calm silhouette → constellation of
interests → project showcase → journey line → orbiting values → horizon → a
single glowing point that loops back to the beginning.

Built with **Next.js (App Router) · TypeScript · Tailwind · GSAP ScrollTrigger ·
Three.js / React Three Fiber · Lenis · fal.ai**.

## How the experience works

- **One particle system, eleven morph targets.** `components/three/targets.ts`
  procedurally generates every story state and packs them into a float
  DataTexture; a GLSL3 vertex shader (`MorphPoints.tsx`) blends adjacent
  targets from the scroll position, adding turbulence mid-morph, breathing at
  rest, ember glow near the core and gold sparks along the strands.
- **A fibrous porcelain "Curiosity Core"** (`CuriosityCore.tsx`) carries the
  opening chapters with ridged displacement, fresnel rim and a warm internal
  glow, then dissolves into the particle story.
- **Scroll is the only clock.** Lenis smooth-scrolls the page, GSAP
  ScrollTrigger writes progress into a shared `scrollState`
  (`lib/scroll/state.ts`), and the Three.js scene reads it every frame.
  Scrolling backwards reverses the film; stopping freezes it.
- **Chapters** (`components/chapters/*`) are tall sections with sticky
  100vh stages; each attaches a scrubbed GSAP timeline for its copy.
  The chapter map (ids, nav groups, scene ranges, heights) lives in
  `lib/content/chapters.ts`.
- **Adaptive quality** (`lib/performance/quality.ts`) scales particle count,
  DPR and parallax by viewport, device memory and connection; WebGL failure
  and `prefers-reduced-motion` fall back to a static, fully readable
  document-flow experience (`main[data-motion="static"]` rules in
  `globals.css`).

## Local development

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build (lint + types included)
npm start
npm run typecheck  # tsc --noEmit
npm run lint
```

## Content editing

| What | Where |
| --- | --- |
| Name, taglines, intro, interests, values, goals, timeline | `data/profile.ts` |
| Contact links (currently `EMAIL_ADDRESS_HERE` etc. placeholders) | `data/profile.ts` → `contact` |
| Projects (titles, copy, posters, accent colours) | `data/projects.ts` |
| Chapter order / lengths / nav | `lib/content/chapters.ts` |
| SEO metadata + canonical domain | `app/layout.tsx`, `app/sitemap.ts`, `app/robots.ts` (replace `ryandhana.example`) |

The contact form validates client-side and is intentionally not wired to a
backend; connect a form handler or server action in
`components/ui/ContactForm.tsx` (marked with a comment) before launch.

## fal.ai asset pipeline

All generation prompts (including the negative prompt) live in
`lib/generation/prompts.ts`. The pipeline records every run in
`data/asset-manifest.json` and estimated spend in
`data/generation-costs.json`, never regenerates an approved asset without
`--force`, and requires `FAL_KEY` (server-side only — see `.env.example`).

```bash
npm run assets:list                                        # status of every asset
npx tsx scripts/generate-assets.ts --asset curiosity-core --mode test   # cheap draft (flux/schnell)
npx tsx scripts/generate-assets.ts --asset curiosity-core --mode final  # high quality (flux/dev)
npx tsx scripts/generate-assets.ts --approve curiosity-core             # lock it
npx tsx scripts/generate-assets.ts --asset core-to-strands --type video # image-to-video from the approved still
```

Test references for all six story assets plus the Open Graph image are already
generated in `public/assets/references/` (total estimated spend so far ≈ $0.03).

### Image sequences (scroll-scrubbed video)

Approved videos become WebP frame sequences that the scroll position scrubs
(`components/sequences/SequenceCanvas.tsx` + `lib/sequences/*`):

```bash
npx tsx scripts/convert-video-to-frames.ts --video public/assets/videos/core-to-strands.mp4 --sequence core-to-strands
npx tsx scripts/optimise-frames.ts --sequence core-to-strands --width 720 --suffix -md   # responsive variant
```

Both scripts require **ffmpeg** on PATH. After converting, update the matching
entry in `lib/sequences/manifest.ts` (the script prints the exact line). The
loader preloads a sparse skeleton first, densifies around the current frame,
tolerates missing frames, and shows the poster until frames exist.

### Still to generate (listed honestly)

The real-time Three.js scene is the primary experience and ships complete.
The optional generated-video enhancements remain pending because video
outputs could not be downloaded from this build environment's network:

- image-to-video clips for the six transformation prompts (`--type video`)
- frame-sequence conversion of those clips (needs ffmpeg)
- final-quality (`--mode final`) re-runs of the six references once the
  test drafts are approved

## Deploy to Vercel

1. Import the repository in Vercel (framework auto-detects as Next.js).
2. Add `FAL_KEY` (and optionally `ASSET_ADMIN_TOKEN`) as server environment
   variables — never as `NEXT_PUBLIC_*`.
3. Set the production domain, then replace `ryandhana.example` in
   `app/layout.tsx`, `app/sitemap.ts` and `app/robots.ts`.
4. Build command `npm run build`, output default. Deploy.

## Accessibility

Semantic landmarks, keyboard-reachable nav with visible focus rings, labelled
form fields with inline errors, `aria-hidden` on all decorative layers, and a
complete reduced-motion experience: no pinning, no scrubbing, content in
normal flow, nothing essential delivered only through animation.
