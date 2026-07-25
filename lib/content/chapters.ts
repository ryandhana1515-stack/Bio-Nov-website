/**
 * Master chapter map. Each chapter owns:
 *  - a DOM section id (deep-linkable, used by the nav)
 *  - an index label displayed in the interface chrome
 *  - a height in viewport-heights (drives scroll length)
 *  - a scene range [from, to] on the 3D morph timeline (see components/three).
 *
 * Scene timeline integers:
 *  0 core · 1 strands · 2 head · 3 fingerprint · 4 silhouette · 5 constellation
 *  6 timeline-line · 7 orbit ring · 8 horizon · 9 point · 10 mini core
 */
export type Chapter = {
  id: string;
  label: string;
  index: string;
  heights: number;
  scene: [number, number];
  /** chapters 0–4 play over the full-bleed imagery and use light copy */
  overImage?: boolean;
};

export const chapters: Chapter[] = [
  { id: "origin", label: "Origin", index: "01 / ORIGIN", heights: 220, scene: [0, 0.35], overImage: true },
  { id: "curiosity", label: "Curiosity", index: "02 / CURIOSITY", heights: 220, scene: [0.35, 1], overImage: true },
  { id: "digital-mind", label: "Digital Mind", index: "03 / DIGITAL MIND", heights: 240, scene: [1, 2], overImage: true },
  { id: "ai-imagination", label: "AI × Imagination", index: "04 / AI", heights: 240, scene: [2, 3], overImage: true },
  { id: "human", label: "Human", index: "05 / HUMAN", heights: 200, scene: [3, 4], overImage: true },
  { id: "world", label: "My World", index: "06 / WORLD", heights: 320, scene: [4, 5] },
  { id: "projects", label: "Projects", index: "07 / PROJECTS", heights: 520, scene: [5, 5.35] },
  { id: "story", label: "Journey", index: "08 / JOURNEY", heights: 240, scene: [5.35, 6] },
  { id: "philosophy", label: "Philosophy", index: "09 / PHILOSOPHY", heights: 220, scene: [6, 7] },
  { id: "vision", label: "Vision", index: "10 / VISION", heights: 220, scene: [7, 8] },
  { id: "contact", label: "Contact", index: "11 / CONTACT", heights: 240, scene: [8, 10] },
];

export const totalHeights = chapters.reduce((sum, c) => sum + c.heights, 0);

/** Four-item nav, ordered as in the reference composition. */
export const navItems: { label: string; target: string }[] = [
  { label: "Work", target: "projects" },
  { label: "Topics", target: "world" },
  { label: "About", target: "digital-mind" },
  { label: "Contact", target: "contact" },
];

export function chapterByIndex(i: number): Chapter {
  return chapters[Math.max(0, Math.min(chapters.length - 1, i))];
}
