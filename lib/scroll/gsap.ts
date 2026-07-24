"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let registered = false;

/** Register GSAP plugins exactly once, client-side only. */
export function ensureGsap(): typeof gsap {
  if (!registered && typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.config({ ignoreMobileResize: true });
    registered = true;
  }
  return gsap;
}

export { gsap, ScrollTrigger };

/**
 * Build a scrubbed timeline pinned to a chapter section. The section is
 * expected to be tall (n × 100vh) with a `position: sticky` child, so no
 * GSAP pinning is required — only progress scrubbing.
 */
export function createScrubTimeline(
  section: HTMLElement,
  build: (tl: gsap.core.Timeline) => void,
  options?: { start?: string; end?: string; scrub?: number | boolean }
): gsap.core.Timeline {
  ensureGsap();
  const tl = gsap.timeline({
    defaults: { ease: "none" },
    scrollTrigger: {
      trigger: section,
      start: options?.start ?? "top top",
      end: options?.end ?? "bottom bottom",
      scrub: options?.scrub ?? 0.6,
    },
  });
  build(tl);
  return tl;
}
