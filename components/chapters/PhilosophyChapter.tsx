"use client";

import { useCallback } from "react";
import { chapters } from "@/lib/content/chapters";
import { useChapterTimeline } from "@/lib/scroll/useChapterTimeline";
import { profile } from "@/data/profile";
import type { gsap } from "@/lib/scroll/gsap";

const chapter = chapters[8];

/**
 * Chapter 10 — Personal Philosophy. Five values orbit a small glowing
 * core, converge briefly into one structure, then release.
 */
export default function PhilosophyChapter() {
  const ref = useChapterTimeline<HTMLElement>(
    useCallback((tl: gsap.core.Timeline, section: HTMLElement) => {
      const words = section.querySelectorAll<HTMLElement>("[data-value-word]");
      const quote = section.querySelector("[data-quote]");
      const support = section.querySelector("[data-support]");

      // place on orbit, then drift in
      tl.set(
        words,
        {
          x: (i: number, el: HTMLElement) => Number(el.dataset.ox),
          y: (i: number, el: HTMLElement) => Number(el.dataset.oy),
        },
        0
      );
      tl.fromTo(
        words,
        { autoAlpha: 0, scale: 0.9 },
        { autoAlpha: 1, scale: 1, duration: 0.14, stagger: 0.03 },
        0.05
      );
      // converge into one structure at the centre…
      tl.to(words, { x: 0, y: 0, duration: 0.2, stagger: 0.015 }, 0.34);
      // …and separate again
      tl.to(
        words,
        {
          x: (i: number, el: HTMLElement) => Number(el.dataset.ox),
          y: (i: number, el: HTMLElement) => Number(el.dataset.oy),
          duration: 0.2,
          stagger: 0.015,
        },
        0.58
      );
      if (quote) {
        tl.fromTo(quote, { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: 0.15 }, 0.3);
      }
      if (support) {
        tl.fromTo(support, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.15 }, 0.44);
      }
      tl.to([words, quote, support], { autoAlpha: 0, duration: 0.1 }, 0.9);
    }, [])
  );

  const positions = [
    { x: -240, y: -110 },
    { x: 230, y: -140 },
    { x: -290, y: 90 },
    { x: 260, y: 120 },
    { x: 0, y: -210 },
  ];

  return (
    <section
      id={chapter.id}
      data-chapter-index={8}
      ref={ref}
      className="chapter"
      style={{ height: `${chapter.heights}vh` }}
    >
      <div className="chapter-sticky place-items-center">
        <div className="relative text-center">
          <p className="index-label mb-8">
            <span className="tick" />
            {chapter.index}
          </p>
          <h2 data-quote className="display max-w-3xl px-6 text-[clamp(32px,4.6vw,64px)]">
            Born curious. <span className="text-[var(--ink-soft)]">Guided by vision.</span>
          </h2>
          <p data-support className="body-editorial mx-auto mt-7 px-6 text-center">
            I believe the future belongs to people who are willing to keep learning, experimenting
            and creating.
          </p>

          {profile.values.map((value, i) => (
            <span
              key={value}
              data-value-word
              data-ox={positions[i].x}
              data-oy={positions[i].y}
              className="spatial pointer-events-none absolute left-1/2 top-1/2 hidden md:block"
            >
              <span className="display-md block -translate-x-1/2 -translate-y-1/2 text-[clamp(15px,1.6vw,22px)] text-[var(--ink-soft)]">
                {value}
              </span>
            </span>
          ))}

          <p className="inline-fallback micro mt-10 flex flex-wrap justify-center gap-x-4 md:hidden">
            {profile.values.map((v) => (
              <span key={v}>{v.toUpperCase()}</span>
            ))}
          </p>
        </div>
      </div>
    </section>
  );
}
