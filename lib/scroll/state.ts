/**
 * Shared mutable scroll state. Written by the GSAP master timeline every
 * scroll frame, read by the Three.js scene inside its render loop.
 * A plain mutable object (not React state) keeps this allocation-free
 * and avoids re-render storms at 120 Hz.
 */
export type ScrollState = {
  /** whole-page progress 0..1 */
  progress: number;
  /** continuous position on the scene morph timeline (0..10) */
  scene: number;
  /** index of the chapter currently on screen */
  chapter: number;
  /** progress 0..1 inside the current chapter */
  chapterProgress: number;
  /** smoothed scroll velocity (px/frame, signed) */
  velocity: number;
  /** normalised pointer, -1..1, centre origin */
  pointerX: number;
  pointerY: number;
  /** true once the user scrolls at all */
  hasScrolled: boolean;
};

export const scrollState: ScrollState = {
  progress: 0,
  scene: 0,
  chapter: 0,
  chapterProgress: 0,
  velocity: 0,
  pointerX: 0,
  pointerY: 0,
  hasScrolled: false,
};

type Listener = (s: ScrollState) => void;
const listeners = new Set<Listener>();

/** Subscribe UI (nav, progress readouts) at a throttled cadence. */
export function subscribeScroll(fn: Listener): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

let scheduled = false;
export function notifyScroll(): void {
  if (scheduled) return;
  scheduled = true;
  requestAnimationFrame(() => {
    scheduled = false;
    listeners.forEach((fn) => fn(scrollState));
  });
}
