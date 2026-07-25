"use client";

import { useCallback } from "react";
import { motion } from "framer-motion";
import { chapters } from "@/lib/content/chapters";
import { useChapterTimeline } from "@/lib/scroll/useChapterTimeline";
import { profile } from "@/data/profile";
import type { gsap } from "@/lib/scroll/gsap";

const chapter = chapters[0];

/**
 * Chapter 1 — The Curiosity Core. The camera slowly approaches the
 * sphere; the copy drifts away as the object takes over.
 */
export default function HeroChapter() {
  const ref = useChapterTimeline<HTMLElement>(
    useCallback((tl: gsap.core.Timeline, section: HTMLElement) => {
      const copy = section.querySelector("[data-hero-copy]");
      if (copy) {
        tl.to(copy, { y: -110, autoAlpha: 0, duration: 0.45 }, 0.4);
      }
    }, [])
  );

  return (
    <section
      id={chapter.id}
      data-chapter-index={0}
      ref={ref}
      className="chapter over-image"
      style={{ height: `${chapter.heights}vh` }}
    >
      <div className="chapter-sticky items-center">
        <div className="relative mx-auto grid w-full max-w-[1400px] grid-cols-1 items-center px-6 md:grid-cols-2 md:px-14">
          <motion.div
            data-hero-copy
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="relative z-10 max-w-xl pt-24 md:pt-0"
          >
            <span className="mb-7 inline-flex items-center gap-2 rounded-full bg-[rgba(20,22,26,0.72)] px-3 py-1.5 text-[9px] font-medium tracking-[0.22em] text-white/85 backdrop-blur-sm">
              <span className="h-1 w-1 rounded-full bg-[var(--ember)]" />
              PERSONAL WORLD
            </span>
            <h1 className="display text-[clamp(40px,6.4vw,96px)]">
              <span className="dim">{profile.taglineA}</span>
              <br />
              {profile.taglineB}
            </h1>
            <p className="body-editorial mt-7 max-w-sm text-[13px] leading-[1.75]">
              I’m Ryan Dhana — exploring artificial intelligence, storytelling, business and the
              future of digital creation.
            </p>
          </motion.div>

          {/* the sphere occupies the right column on desktop, centre on mobile */}
          <div aria-hidden="true" className="hidden md:block" />

        </div>
      </div>
    </section>
  );
}
