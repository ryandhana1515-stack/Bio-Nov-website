"use client";

import { useCallback } from "react";
import { chapters } from "@/lib/content/chapters";
import { useChapterTimeline } from "@/lib/scroll/useChapterTimeline";
import { profile } from "@/data/profile";
import type { gsap } from "@/lib/scroll/gsap";

const chapter = chapters[1];

/** hand-tuned anchors so labels ride alongside the strand field */
const labelSpots = [
  { left: "58%", top: "22%" },
  { left: "74%", top: "36%" },
  { left: "62%", top: "56%" },
  { left: "80%", top: "68%" },
  { left: "50%", top: "76%" },
  { left: "70%", top: "12%" },
];

/**
 * Chapter 2 — Curiosity Expands. The core unfolds into strands; each
 * interest label surfaces as an HTML overlay along the flow.
 */
export default function CuriosityChapter() {
  const ref = useChapterTimeline<HTMLElement>(
    useCallback((tl: gsap.core.Timeline, section: HTMLElement) => {
      const heading = section.querySelector("[data-heading]");
      const labels = section.querySelectorAll(".spatial[data-strand-label]");
      const mobile = section.querySelector("[data-strand-mobile]");
      if (heading) {
        tl.fromTo(heading, { autoAlpha: 0, y: 60 }, { autoAlpha: 1, y: 0, duration: 0.18 }, 0.04);
        tl.to(heading, { autoAlpha: 0, y: -50, duration: 0.16 }, 0.8);
      }
      tl.fromTo(
        labels,
        { autoAlpha: 0, x: 60 },
        { autoAlpha: 1, x: 0, duration: 0.24, stagger: 0.05 },
        0.28
      );
      tl.to(labels, { autoAlpha: 0, x: -40, duration: 0.12, stagger: 0.015 }, 0.82);
      if (mobile) {
        tl.fromTo(mobile, { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.2 }, 0.3);
        tl.to(mobile, { autoAlpha: 0, duration: 0.12 }, 0.84);
      }
    }, [])
  );

  return (
    <section
      id={chapter.id}
      data-chapter-index={1}
      ref={ref}
      className="chapter"
      style={{ height: `${chapter.heights}vh` }}
    >
      <div className="chapter-sticky items-center">
        <div className="relative mx-auto w-full max-w-[1400px] px-6 md:px-14">
          <div data-heading className="max-w-md">
            <p className="index-label mb-6">
              <span className="tick" />
              {chapter.index}
            </p>
            <h2 className="display text-[clamp(34px,4.6vw,64px)]">Curiosity connects everything.</h2>
            <p className="body-editorial mt-6">
              Every question becomes a path toward a new skill, idea or possibility.
            </p>
          </div>

          {profile.interests.map((interest, i) => (
            <span
              key={interest}
              data-strand-label
              className="spatial micro absolute hidden items-center gap-2 md:flex"
              style={labelSpots[i]}
            >
              <span className="inline-block h-px w-8 bg-[var(--ink-faint)]" />
              {interest.toUpperCase()}
            </span>
          ))}

          {/* mobile: quiet inline list instead of spatial labels */}
          <ul className="inline-fallback mt-10 flex flex-wrap gap-x-5 gap-y-2 md:hidden" data-strand-mobile>
            {profile.interests.map((interest) => (
              <li key={interest} className="micro">
                {interest.toUpperCase()}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
