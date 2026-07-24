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
  nav?: "World" | "Story" | "Projects" | "Vision" | "Contact";
  label: string;
  index: string;
  heights: number;
  scene: [number, number];
};

export const chapters: Chapter[] = [
  { id: "origin", nav: "World", label: "Origin", index: "01 / ORIGIN", heights: 220, scene: [0, 0.35] },
  { id: "curiosity", label: "Curiosity", index: "02 / CURIOSITY", heights: 220, scene: [0.35, 1] },
  { id: "digital-mind", nav: "Story", label: "Digital Mind", index: "03 / DIGITAL MIND", heights: 240, scene: [1, 2] },
  { id: "ai-imagination", label: "AI × Imagination", index: "04 / AI", heights: 240, scene: [2, 3] },
  { id: "human", label: "Human", index: "05 / HUMAN", heights: 200, scene: [3, 4] },
  { id: "world", label: "My World", index: "06 / WORLD", heights: 320, scene: [4, 5] },
  { id: "projects", nav: "Projects", label: "Projects", index: "07 / PROJECTS", heights: 520, scene: [5, 5.35] },
  { id: "story", label: "Journey", index: "08 / JOURNEY", heights: 240, scene: [5.35, 6] },
  { id: "philosophy", label: "Philosophy", index: "09 / PHILOSOPHY", heights: 220, scene: [6, 7] },
  { id: "vision", nav: "Vision", label: "Vision", index: "10 / VISION", heights: 220, scene: [7, 8] },
  { id: "contact", nav: "Contact", label: "Contact", index: "11 / CONTACT", heights: 240, scene: [8, 10] },
];

export const totalHeights = chapters.reduce((sum, c) => sum + c.heights, 0);

export const navItems = chapters
  .filter((c) => c.nav)
  .map((c) => ({ label: c.nav as string, target: c.id }));

export function chapterByIndex(i: number): Chapter {
  return chapters[Math.max(0, Math.min(chapters.length - 1, i))];
}
