"use client";

import { useCallback } from "react";
import { chapters } from "@/lib/content/chapters";
import { useChapterTimeline } from "@/lib/scroll/useChapterTimeline";
import type { gsap } from "@/lib/scroll/gsap";

const chapter = chapters[5];

/** anchored roughly to the six particle constellations behind them */
const worlds = [
  { name: "AI", note: "A glowing procedural neural form", left: "16%", top: "26%" },
  { name: "Travel", note: "A floating topographic globe", left: "32%", top: "64%" },
  { name: "Video", note: "A suspended cinematic frame", left: "52%", top: "26%" },
  { name: "Entrepreneurship", note: "A growing geometric structure", left: "68%", top: "58%" },
  { name: "Design", note: "A morphing sculptural form", left: "83%", top: "30%" },
  { name: "Learning", note: "A network of expanding nodes", left: "10%", top: "72%" },
];

/**
 * Chapter 6 — My World. The silhouette dissolves into a constellation
 * of interests; the camera drifts through as labels take focus one by one.
 */
export default function WorldChapter() {
  const ref = useChapterTimeline<HTMLElement>(
    useCallback((tl: gsap.core.Timeline, section: HTMLElement) => {
      const heading = section.querySelector("[data-heading]");
      // desktop spatial labels only — the mobile block animates as one unit,
      // and mixing both would stretch the timeline past its 0..1 positions
      const labels = section.querySelectorAll<HTMLElement>(".spatial[data-world]");
      const mobile = section.querySelector("[data-world-mobile]");
      if (heading) {
        tl.fromTo(heading, { autoAlpha: 0, y: 60 }, { autoAlpha: 1, y: 0, duration: 0.12 }, 0.02);
        tl.to(heading, { autoAlpha: 0, y: -40, duration: 0.12 }, 0.42);
      }
      // sequential focus: each world gets its own moment, then stays readable
      labels.forEach((el, i) => {
        const at = 0.14 + i * 0.12;
        tl.fromTo(el, { autoAlpha: 0, scale: 0.92, y: 20 }, { autoAlpha: 1, scale: 1, y: 0, duration: 0.08 }, at);
        tl.to(el, { autoAlpha: 0.55, scale: 0.98, duration: 0.08 }, at + 0.16);
      });
      if (mobile) {
        tl.fromTo(mobile, { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.12 }, 0.14);
      }
      tl.to(labels, { autoAlpha: 0, duration: 0.07 }, 0.92);
      if (mobile) tl.to(mobile, { autoAlpha: 0, duration: 0.07 }, 0.92);
    }, [])
  );

  return (
    <section
      id={chapter.id}
      data-chapter-index={5}
      ref={ref}
      className="chapter"
      style={{ height: `${chapter.heights}vh` }}
    >
      <div className="chapter-sticky items-center">
        <div data-heading className="relative mx-auto w-full max-w-[1400px] px-6 md:px-14">
          <p className="index-label mb-6">
            <span className="tick" />
            {chapter.index}
          </p>
          <h2 className="display max-w-2xl text-[clamp(34px,4.8vw,68px)]">
            My world is built from questions.
          </h2>
        </div>

        {/* spatial labels — desktop */}
        {worlds.map((w) => (
          <div
            key={w.name}
            data-world
            className="spatial absolute hidden max-w-[200px] md:block"
            style={{ left: w.left, top: w.top }}
          >
            <p className="display-md text-[22px] text-[var(--ink)]">{w.name}</p>
            <p className="micro mt-2 leading-relaxed">{w.note.toUpperCase()}</p>
            <span className="mt-3 block h-px w-10 bg-[var(--ink-faint)]" />
          </div>
        ))}

        {/* mobile: single-column drift */}
        <div
          data-world-mobile
          className="inline-fallback absolute inset-x-6 bottom-16 grid grid-cols-2 gap-x-6 gap-y-4 md:hidden"
        >
          {worlds.map((w) => (
            <div key={w.name}>
              <p className="display-md text-[17px]">{w.name}</p>
              <p className="micro mt-1">{w.note.toUpperCase()}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
