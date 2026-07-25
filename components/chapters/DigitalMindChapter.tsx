"use client";

import { useCallback } from "react";
import { chapters } from "@/lib/content/chapters";
import { useChapterTimeline } from "@/lib/scroll/useChapterTimeline";
import type { gsap } from "@/lib/scroll/gsap";

const chapter = chapters[2];

/**
 * Chapter 3 — The Digital Mind. Strands gather into the symbolic head;
 * fine scan lines sweep the frame while the copy holds the left edge.
 */
export default function DigitalMindChapter() {
  const ref = useChapterTimeline<HTMLElement>(
    useCallback((tl: gsap.core.Timeline, section: HTMLElement) => {
      const copy = section.querySelector("[data-copy]");
      const scan = section.querySelector("[data-scanlines]");
      const status = section.querySelectorAll("[data-status]");
      if (copy) {
        tl.fromTo(copy, { autoAlpha: 0, y: 70 }, { autoAlpha: 1, y: 0, duration: 0.2 }, 0.08);
        tl.to(copy, { autoAlpha: 0, y: -60, duration: 0.16 }, 0.82);
      }
      if (scan) {
        tl.fromTo(scan, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.2 }, 0.25);
        tl.to(scan, { yPercent: 30, duration: 0.55 }, 0.25);
        tl.to(scan, { autoAlpha: 0, duration: 0.15 }, 0.85);
      }
      tl.fromTo(
        status,
        { autoAlpha: 0, x: -20 },
        { autoAlpha: 1, x: 0, duration: 0.2, stagger: 0.08 },
        0.35
      );
      tl.to(status, { autoAlpha: 0, duration: 0.12 }, 0.85);
    }, [])
  );

  return (
    <section
      id={chapter.id}
      data-chapter-index={2}
      ref={ref}
      className="chapter over-image"
      style={{ height: `${chapter.heights}vh` }}
    >
      <div className="chapter-sticky items-center">
        {/* fine horizontal scan lines over the assembling head */}
        <div
          data-scanlines
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-[15%] top-[18%] h-[55%] opacity-0"
          style={{
            backgroundImage:
              "repeating-linear-gradient(to bottom, rgba(20,22,26,0.05) 0 1px, transparent 1px 9px)",
            maskImage: "radial-gradient(ellipse 55% 60% at 50% 50%, black 40%, transparent 75%)",
            WebkitMaskImage: "radial-gradient(ellipse 55% 60% at 50% 50%, black 40%, transparent 75%)",
          }}
        />

        <div className="relative mx-auto w-full max-w-[1400px] px-6 md:px-14">
          <div data-copy className="max-w-sm">
            <p className="index-label mb-6">
              <span className="tick" />
              {chapter.index}
            </p>
            <h2 className="display text-[clamp(30px,4.2vw,58px)]">Learning in public.</h2>
            <p className="body-editorial mt-6">
              I explore ideas, experiment with new tools and turn what I learn into real projects.
            </p>
          </div>

          <div className="micro absolute right-0 top-1/2 hidden -translate-y-1/2 flex-col gap-3 text-right lg:flex">
            <span data-status>ASSEMBLY — PARTICLES</span>
            <span data-status>LAYER — POINT CLOUD</span>
            <span data-status>LAYER — MESH FRAGMENTS</span>
            <span data-status className="text-[var(--ember)]">
              STATE — UNFINISHED, ON PURPOSE
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
