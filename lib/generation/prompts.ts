/**
 * All fal.ai generation prompts for the site, kept in one place so the
 * visual direction can be reviewed and versioned before credits are spent.
 */

export const NEGATIVE_PROMPT = [
  "logo",
  "watermark",
  "text",
  "copied person",
  "public figure",
  "celebrity",
  "dark cyberpunk background",
  "gaming interface",
  "horror",
  "damaged face",
  "distorted anatomy",
  "extra facial features",
  "violent explosion",
  "smoke",
  "fire",
  "chaotic debris",
  "heavy neon",
  "low-resolution texture",
  "cheap stock-website appearance",
  "cartoon style",
  "generic corporate stock imagery",
].join(", ");

export type GenPrompt = {
  id: string;
  title: string;
  prompt: string;
  /** target sequence folder when this becomes a video */
  sequence?: string;
};

export const prompts: GenPrompt[] = [
  {
    id: "curiosity-core",
    title: "Asset 1 — Curiosity Core",
    sequence: "core-intro",
    prompt:
      "Create an original premium abstract 3D organic sphere representing curiosity and creative intelligence. The sphere is formed from hundreds of soft white and silver procedural ridges and flowing filaments, with a subtle warm orange energy source glowing from the centre. Bright warm-white studio background, minimal futuristic gallery aesthetic, soft realistic shadows, elegant technological sculpture, highly detailed, calm and refined, original design, no text, no logo, no people.",
  },
  {
    id: "core-to-strands",
    title: "Asset 2 — Core to Strands",
    sequence: "core-to-strands",
    prompt:
      "The original white organic curiosity sphere slowly unfolds into hundreds of long flowing white and silver strands. Soft warm-orange light travels through selected strands. The strands extend elegantly across a bright minimal background. Premium technological motion design, controlled transformation, smooth camera, no explosion, no debris, no text.",
  },
  {
    id: "strands-to-head",
    title: "Asset 3 — Strands to Digital Head",
    sequence: "strands-to-head",
    prompt:
      "Hundreds of flowing white procedural strands and particles gradually assemble into an original symbolic human-head silhouette. The head is made from point clouds, fine mesh fragments, transparent scan lines and delicate digital structures. Neutral identity, not based on a recognisable real person, bright soft-grey studio background, subtle warm highlights, premium experimental technology artwork.",
  },
  {
    id: "procedural-face",
    title: "Asset 4 — Procedural Face Surface",
    sequence: "procedural-face",
    prompt:
      "An original neutral digital human-head sculpture covered by fine fingerprint-like and topographic contour lines. White and silver surface, partial transparency, subtle particle distortion, soft pale-blue reflections, bright minimal background, elegant procedural 3D art, high-end creative technology portfolio, no text, no recognisable person.",
  },
  {
    id: "digital-to-human",
    title: "Asset 5 — Human and Digital Transition",
    sequence: "digital-to-human",
    prompt:
      "An original artistic human silhouette transitioning between a realistic soft photographic surface, a fingerprint-like procedural mesh and fine digital particles. Bright neutral background, monochrome white, silver and soft charcoal tones, calm editorial lighting, premium experimental portfolio visual, no recognisable public figure, no text.",
  },
  {
    id: "particle-dissolve",
    title: "Asset 6 — Particle Dissolve",
    sequence: "particle-dissolve",
    prompt:
      "An elegant digital head sculpture dissolving into thousands of fine white and silver particles that travel outward and become a constellation of abstract creative worlds. Bright minimal background, subtle pale-blue and warm-orange accents, smooth controlled motion, premium technological storytelling, no violent explosion, no text.",
  },
  {
    id: "og-image",
    title: "Open Graph share image",
    prompt:
      "Minimal premium hero image for a personal creative-technology portfolio: an abstract white organic sphere made of soft procedural filaments with a warm orange inner glow, centred on a bright warm-white studio background with generous empty space, editorial museum-gallery lighting, soft realistic shadow beneath, elegant and calm, no text, no logo, no people.",
  },
];

export function getPrompt(id: string): GenPrompt | undefined {
  return prompts.find((p) => p.id === id);
}
