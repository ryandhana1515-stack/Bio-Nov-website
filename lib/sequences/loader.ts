"use client";

import { SequenceMeta, frameUrl } from "./manifest";

/**
 * Progressive frame loader. Strategy:
 *  1. decode the poster / first frame immediately,
 *  2. load a sparse "skeleton" of every Nth frame,
 *  3. densify outward from the current scroll position first.
 * Failed frames resolve to null and the canvas draws the nearest
 * successfully loaded neighbour, so a missing file never blanks the screen.
 */
export class SequenceLoader {
  private frames: (HTMLImageElement | null | undefined)[];
  private inFlight = new Set<number>();
  private meta: SequenceMeta;
  private variantDir?: string;
  private destroyed = false;

  constructor(meta: SequenceMeta, tier: "high" | "medium" | "low" = "high") {
    this.meta = meta;
    this.variantDir = meta.variants?.[tier]?.dir;
    this.frames = new Array(meta.frameCount);
  }

  get ready(): boolean {
    return this.meta.frameCount > 0;
  }

  private load(i: number): void {
    if (this.destroyed || i < 0 || i >= this.meta.frameCount) return;
    if (this.frames[i] !== undefined || this.inFlight.has(i)) return;
    this.inFlight.add(i);
    const img = new Image();
    img.decoding = "async";
    img.onload = () => {
      this.inFlight.delete(i);
      if (!this.destroyed) this.frames[i] = img;
    };
    img.onerror = () => {
      this.inFlight.delete(i);
      if (!this.destroyed) this.frames[i] = null; // permanent miss
    };
    img.src = frameUrl(this.meta, i, this.variantDir);
  }

  /** kick off the sparse skeleton pass */
  warm(stride = 6): void {
    for (let i = 0; i < this.meta.frameCount; i += stride) this.load(i);
    this.load(this.meta.frameCount - 1);
  }

  /** densify around the frame the user is currently on */
  focus(center: number, radius = 12): void {
    for (let d = 0; d <= radius; d++) {
      this.load(center + d);
      this.load(center - d);
    }
  }

  /** best displayable frame at or near index */
  frameAt(index: number): HTMLImageElement | null {
    const n = this.meta.frameCount;
    if (n === 0) return null;
    const i = Math.max(0, Math.min(n - 1, Math.round(index)));
    const direct = this.frames[i];
    if (direct) return direct;
    for (let d = 1; d < n; d++) {
      const lo = this.frames[i - d];
      if (lo) return lo;
      const hi = this.frames[i + d];
      if (hi) return hi;
    }
    return null;
  }

  destroy(): void {
    this.destroyed = true;
    this.frames = [];
    this.inFlight.clear();
  }
}
