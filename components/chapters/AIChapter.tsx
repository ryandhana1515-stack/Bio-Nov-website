"use client";

import { useCallback } from "react";
import { chapters } from "@/lib/content/chapters";
import { useChapterTimeline } from "@/lib/scroll/useChapterTimeline";
import { profile } from "@/data/profile";
import type { gsap } from "@/lib/scroll/gsap";

const chapter = chapters[3];

/**
 * Chapter 4 — AI and Imagination. The head becomes a fingerprint-like
 * contour surface; disciplines are typeset as an editorial list, not cards.
 */
export default function AIChapter() {
  const ref = useChapterTimeline<HTMLElement>(
    useCallback((tl: gsap.core.Timeline, section: HTMLElement) => {
      const heading = section.querySelector("[data-heading]");
      const items = section.querySelectorAll("[data-discipline]");
      if (heading) {
        tl.fromTo(heading, { autoAlpha: 0, y: 60 }, { autoAlpha: 1, y: 0, duration: 0.18 }, 0.06);
        tl.to(heading, { autoAlpha: 0, y: -50, duration: 0.15 }, 0.84);
      }
      tl.fromTo(
        items,
        { autoAlpha: 0, y: 26 },
        { autoAlpha: 1, y: 0, duration: 0.22, stagger: 0.06 },
        0.3
      );
      tl.to(items, { autoAlpha: 0, y: -20, duration: 0.09, stagger: 0.015 }, 0.85);
    }, [])
  );

  return (
    <section
      id={chapter.id}
      data-chapter-index={3}
      ref={ref}
      className="chapter over-image"
      style={{ height: `${chapter.heights}vh` }}
    >
      <div className="chapter-sticky items-center">
        <div className="relative mx-auto grid w-full max-w-[1400px] grid-cols-1 gap-12 px-6 md:grid-cols-[1fr_auto] md:px-14">
          <div data-heading className="max-w-lg self-center">
            <p className="index-label mb-6">
              <span className="tick" />
              {chapter.index}
            </p>
            <h2 className="display text-[clamp(30px,4.4vw,62px)]">
              Human imagination.
              <br />
              <span className="dim">Amplified by AI.</span>
            </h2>
            <p className="body-editorial mt-6">
              I use artificial intelligence as a creative tool for visual storytelling, websites,
              videos and business ideas.
            </p>
          </div>

          <ol className="self-center md:pr-16">
            {profile.disciplines.map((d, i) => (
              <li
                key={d}
                data-discipline
                className="flex items-baseline gap-5 border-b border-[var(--line-soft)] py-4 last:border-b-0"
              >
                <span className="index-label">{String(i + 1).padStart(2, "0")}</span>
                <span className="display-md text-[clamp(18px,2vw,26px)] text-[var(--ink)]">{d}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
