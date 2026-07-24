"use client";

import { useCallback } from "react";
import { chapters } from "@/lib/content/chapters";
import { useChapterTimeline } from "@/lib/scroll/useChapterTimeline";
import { profile } from "@/data/profile";
import type { gsap } from "@/lib/scroll/gsap";

const chapter = chapters[7];

/**
 * Chapter 9 — Story and Timeline. A diagonal line draws itself while
 * the camera rides along it; milestones bloom at their knots.
 */
export default function TimelineChapter() {
  const ref = useChapterTimeline<HTMLElement>(
    useCallback((tl: gsap.core.Timeline, section: HTMLElement) => {
      const heading = section.querySelector("[data-heading]");
      const path = section.querySelector<SVGPathElement>("[data-path]");
      // spatial milestones only — see WorldChapter for why the mobile
      // block is animated separately as a single unit
      const milestones = section.querySelectorAll<HTMLElement>(".spatial[data-milestone]");
      const mobile = section.querySelector("[data-milestone-mobile]");

      if (heading) {
        tl.fromTo(heading, { autoAlpha: 0, y: 50 }, { autoAlpha: 1, y: 0, duration: 0.12 }, 0.02);
        tl.to(heading, { autoAlpha: 0, y: -40, duration: 0.1 }, 0.86);
      }
      if (path) {
        const len = path.getTotalLength();
        tl.set(path, { strokeDasharray: len, strokeDashoffset: len }, 0);
        tl.to(path, { strokeDashoffset: 0, duration: 0.7 }, 0.12);
      }
      milestones.forEach((m, i) => {
        const at = 0.16 + i * 0.105;
        tl.fromTo(m, { autoAlpha: 0, y: 26, scale: 0.96 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.08 }, at);
      });
      if (mobile) {
        tl.fromTo(mobile, { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.12 }, 0.18);
        tl.to(mobile, { autoAlpha: 0, duration: 0.08 }, 0.9);
      }
      tl.to(milestones, { autoAlpha: 0, duration: 0.09 }, 0.9);
    }, [])
  );

  const spots = [
    { left: "6%", top: "70%" },
    { left: "22%", top: "56%" },
    { left: "38%", top: "64%" },
    { left: "54%", top: "42%" },
    { left: "70%", top: "50%" },
    { left: "84%", top: "28%" },
  ];

  return (
    <section
      id={chapter.id}
      data-chapter-index={7}
      ref={ref}
      className="chapter"
      style={{ height: `${chapter.heights}vh` }}
    >
      <div className="chapter-sticky items-center">
        <div data-heading className="absolute left-6 top-24 z-10 md:left-14">
          <p className="index-label mb-5">
            <span className="tick" />
            {chapter.index}
          </p>
          <h2 className="display max-w-xl text-[clamp(32px,4.2vw,58px)]">
            The journey is only beginning.
          </h2>
        </div>

        {/* self-drawing diagonal line */}
        <svg
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 hidden h-full w-full md:block"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <path
            data-path
            d="M 4 76 C 22 68, 30 72, 42 64 S 62 40, 74 46 S 88 30, 96 24"
            fill="none"
            stroke="rgba(20,22,26,0.28)"
            strokeWidth="0.14"
            vectorEffect="non-scaling-stroke"
          />
        </svg>

        {/* milestones — desktop spatial, mobile stacked */}
        {profile.timeline.map((m, i) => (
          <div
            key={m.key}
            data-milestone
            className="spatial absolute hidden w-[190px] md:block"
            style={spots[i]}
          >
            <span className="mb-3 flex items-center gap-2">
              <span className="h-[7px] w-[7px] rounded-full border border-[var(--ink)] bg-[var(--paper)]" />
              <span className="micro">{m.phase.toUpperCase()}</span>
            </span>
            <p className="display-md text-[17px]">{m.title}</p>
            <p className="mt-2 text-[11.5px] leading-relaxed text-[var(--ink-soft)]">{m.text}</p>
          </div>
        ))}

        <div
          data-milestone-mobile
          className="inline-fallback absolute inset-x-6 bottom-10 grid grid-cols-2 gap-x-5 gap-y-4 md:hidden"
        >
          {profile.timeline.map((m) => (
            <div key={m.key}>
              <p className="micro">{m.phase.toUpperCase()}</p>
              <p className="display-md mt-1 text-[15px]">{m.title}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
