"use client";

import { useCallback } from "react";
import { chapters } from "@/lib/content/chapters";
import { useChapterTimeline } from "@/lib/scroll/useChapterTimeline";
import type { gsap } from "@/lib/scroll/gsap";

const chapter = chapters[4];

/**
 * Chapter 5 — The Human Behind the Ideas. The surface calms into a
 * neutral silhouette (no invented face) and the light turns warmer.
 */
export default function PersonalChapter() {
  const ref = useChapterTimeline<HTMLElement>(
    useCallback((tl: gsap.core.Timeline, section: HTMLElement) => {
      const quote = section.querySelector("[data-quote]");
      const warmth = section.querySelector("[data-warmth]");
      if (warmth) {
        tl.fromTo(warmth, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4 }, 0.15);
        tl.to(warmth, { autoAlpha: 0, duration: 0.2 }, 0.8);
      }
      if (quote) {
        tl.fromTo(quote, { autoAlpha: 0, y: 50, scale: 0.98 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.25 }, 0.2);
        tl.to(quote, { autoAlpha: 0, y: -40, duration: 0.16 }, 0.82);
      }
    }, [])
  );

  return (
    <section
      id={chapter.id}
      data-chapter-index={4}
      ref={ref}
      className="chapter over-image"
      style={{ height: `${chapter.heights}vh` }}
    >
      <div className="chapter-sticky items-center">
        {/* warm wash while the story turns human */}
        <div
          data-warmth
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-0"
          style={{
            background:
              "radial-gradient(60% 55% at 50% 55%, rgba(240,160,90,0.13) 0%, rgba(240,160,90,0.04) 45%, transparent 75%)",
          }}
        />
        <figure
          data-quote
          className="relative mx-auto w-full max-w-[1400px] px-6 md:px-14"
        >
          <p className="index-label mb-6">
            <span className="tick" />
            {chapter.index}
          </p>
          <blockquote className="display max-w-xl text-[clamp(26px,3.4vw,46px)]">
            “Technology is only meaningful when it helps people create, learn and connect.”
          </blockquote>
          <figcaption className="micro mt-7">RYAN DHANA — SINGAPORE</figcaption>
        </figure>
      </div>
    </section>
  );
}
