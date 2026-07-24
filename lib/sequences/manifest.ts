export type SequenceMeta = {
  /** folder under /assets/sequences */
  id: string;
  frameCount: number;
  /** printf-style frame name, e.g. "frame_%04d.webp" */
  pattern: string;
  width: number;
  height: number;
  poster?: string;
  fallbackVideo?: string;
  /** sequences may ship at several sizes; key by tier */
  variants?: Partial<Record<"high" | "medium" | "low", { dir: string; width: number }>>;
};

export function frameUrl(meta: SequenceMeta, index: number, variantDir?: string): string {
  const padded = meta.pattern.replace(/%0(\d)d/, (_, w) =>
    String(index).padStart(Number(w), "0")
  );
  return `/assets/sequences/${variantDir ?? meta.id}/${padded}`;
}

/**
 * Manifest of scroll-scrubbed image sequences. Empty entries are declared
 * up-front so the loader, folders and generation scripts agree on ids.
 * `frameCount: 0` marks a sequence whose frames still need generating —
 * SequenceCanvas renders its poster (or nothing) in that case.
 */
export const sequences: Record<string, SequenceMeta> = {
  "core-intro": { id: "core-intro", frameCount: 0, pattern: "frame_%04d.webp", width: 1280, height: 720 },
  "core-to-strands": { id: "core-to-strands", frameCount: 0, pattern: "frame_%04d.webp", width: 1280, height: 720 },
  "strands-to-head": { id: "strands-to-head", frameCount: 0, pattern: "frame_%04d.webp", width: 1280, height: 720 },
  "procedural-face": { id: "procedural-face", frameCount: 0, pattern: "frame_%04d.webp", width: 1280, height: 720 },
  "digital-to-human": { id: "digital-to-human", frameCount: 0, pattern: "frame_%04d.webp", width: 1280, height: 720 },
  "particle-dissolve": { id: "particle-dissolve", frameCount: 0, pattern: "frame_%04d.webp", width: 1280, height: 720 },
  "final-loop": { id: "final-loop", frameCount: 0, pattern: "frame_%04d.webp", width: 1280, height: 720 },
};
