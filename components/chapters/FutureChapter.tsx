"use client";

import { useCallback } from "react";
import { chapters } from "@/lib/content/chapters";
import { useChapterTimeline } from "@/lib/scroll/useChapterTimeline";
import { profile } from "@/data/profile";
import type { gsap } from "@/lib/scroll/gsap";

const chapter = chapters[9];

/**
 * Chapter 11 — What I Am Building Toward. A long bright horizon opens;
 * the goals read as calm, forward-looking coordinates.
 */
export default function FutureChapter() {
  const ref = useChapterTimeline<HTMLElement>(
    useCallback((tl: gsap.core.Timeline, section: HTMLElement) => {
      const heading = section.querySelector("[data-heading]");
      const goals = section.querySelectorAll("[data-goal]");
      const horizon = section.querySelector("[data-horizon]");

      if (horizon) {
        tl.fromTo(horizon, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3 }, 0.1);
        tl.to(horizon, { autoAlpha: 0, duration: 0.15 }, 0.85);
      }
      if (heading) {
        tl.fromTo(heading, { autoAlpha: 0, y: 60 }, { autoAlpha: 1, y: 0, duration: 0.16 }, 0.06);
        tl.to(heading, { autoAlpha: 0, y: -40, duration: 0.12 }, 0.86);
      }
      tl.fromTo(
        goals,
        { autoAlpha: 0, y: 30 },
        { autoAlpha: 1, y: 0, duration: 0.16, stagger: 0.05 },
        0.3
      );
      tl.to(goals, { autoAlpha: 0, duration: 0.12 }, 0.88);
    }, [])
  );

  return (
    <section
      id={chapter.id}
      data-chapter-index={9}
      ref={ref}
      className="chapter"
      style={{ height: `${chapter.heights}vh` }}
    >
      <div className="chapter-sticky items-center">
        {/* soft horizon light band */}
        <div
          data-horizon
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-[26%] h-40 opacity-0"
          style={{
            background:
              "radial-gradient(60% 100% at 50% 100%, rgba(240,160,90,0.22) 0%, rgba(170,196,212,0.12) 55%, transparent 100%)",
            filter: "blur(6px)",
          }}
        />

        <div className="relative mx-auto grid w-full max-w-[1400px] grid-cols-1 gap-14 px-6 md:grid-cols-2 md:px-14">
          <div data-heading className="self-center">
            <p className="index-label mb-6">
              <span className="tick" />
              {chapter.index}
            </p>
            <h2 className="display text-[clamp(38px,5.4vw,76px)]">What comes next?</h2>
            <p className="body-editorial mt-6">More experiments. More stories. Bigger ideas.</p>
          </div>

          <ul className="self-center">
            {profile.goals.map((goal, i) => (
              <li
                key={goal}
                data-goal
                className="flex items-baseline gap-5 border-b border-[var(--line-soft)] py-4 last:border-b-0"
              >
                <span className="index-label text-[var(--ember)]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-[clamp(14px,1.5vw,18px)] font-light tracking-wide text-[var(--ink)]">
                  {goal}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
