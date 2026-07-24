"use client";

export type QualityTier = "high" | "medium" | "low" | "static";

export type QualityProfile = {
  tier: QualityTier;
  particleCount: number;
  dprMax: number;
  coreDetail: number;
  mouseParallax: boolean;
};

type NavigatorExtended = Navigator & {
  deviceMemory?: number;
  connection?: { saveData?: boolean; effectiveType?: string };
};

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Decide an adaptive quality profile from screen size, memory, DPR and
 * connection. "static" disables the WebGL scene entirely.
 */
export function getQualityProfile(): QualityProfile {
  if (typeof window === "undefined") {
    return { tier: "high", particleCount: 16384, dprMax: 2, coreDetail: 160, mouseParallax: true };
  }

  if (prefersReducedMotion()) {
    return { tier: "static", particleCount: 0, dprMax: 1, coreDetail: 0, mouseParallax: false };
  }

  const nav = navigator as NavigatorExtended;
  const width = window.innerWidth;
  const memory = nav.deviceMemory ?? 8;
  const saveData = nav.connection?.saveData ?? false;
  const slowNet = /(^|\b)(slow-2g|2g|3g)\b/.test(nav.connection?.effectiveType ?? "");

  if (saveData || slowNet || memory <= 2) {
    return { tier: "low", particleCount: 4096, dprMax: 1, coreDetail: 64, mouseParallax: false };
  }
  if (width < 768 || memory <= 4) {
    return { tier: "low", particleCount: 6144, dprMax: 1.5, coreDetail: 80, mouseParallax: false };
  }
  if (width < 1200) {
    return { tier: "medium", particleCount: 10240, dprMax: 1.5, coreDetail: 120, mouseParallax: true };
  }
  return { tier: "high", particleCount: 16384, dprMax: 2, coreDetail: 160, mouseParallax: true };
}

export function supportsWebGL(): boolean {
  if (typeof window === "undefined") return true;
  try {
    const canvas = document.createElement("canvas");
    return Boolean(
      window.WebGLRenderingContext &&
        (canvas.getContext("webgl2") || canvas.getContext("webgl"))
    );
  } catch {
    return false;
  }
}
