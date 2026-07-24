"use client";

import Lenis from "lenis";
import { ensureGsap, ScrollTrigger, gsap } from "./gsap";

let lenis: Lenis | null = null;

/**
 * Create the shared Lenis instance and drive it from GSAP's ticker so
 * Lenis, ScrollTrigger and the Three.js scene all share one clock.
 */
export function initLenis(): Lenis {
  if (lenis) return lenis;
  ensureGsap();

  lenis = new Lenis({
    duration: 1.15,
    smoothWheel: true,
    syncTouch: false,
    anchors: false,
  });

  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => {
    lenis?.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);

  return lenis;
}

export function getLenis(): Lenis | null {
  return lenis;
}

export function destroyLenis(): void {
  lenis?.destroy();
  lenis = null;
}

/** Smooth-scroll to a section id, respecting the fixed nav. */
export function scrollToId(id: string): void {
  const el = document.getElementById(id);
  if (!el) return;
  if (lenis) lenis.scrollTo(el, { offset: 0, duration: 1.6 });
  else el.scrollIntoView({ behavior: "smooth" });
}

export function scrollToTop(): void {
  if (lenis) lenis.scrollTo(0, { duration: 2 });
  else window.scrollTo({ top: 0, behavior: "smooth" });
}
