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
      const aside = section.querySelector("[data-hero-aside]");
      if (copy) {
        tl.to(copy, { y: -110, autoAlpha: 0, duration: 0.45 }, 0.4);
      }
      if (aside) {
        tl.to(aside, { y: -40, autoAlpha: 0, duration: 0.35 }, 0.5);
      }
    }, [])
  );

  return (
    <section
      id={chapter.id}
      data-chapter-index={0}
      ref={ref}
      className="chapter"
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
            <p className="index-label mb-7">
              <span className="tick" />
              {chapter.index}
            </p>
            <h1 className="display text-[clamp(44px,7.2vw,108px)] text-[var(--ink)]">
              {profile.taglineA}
              <br />
              <span className="text-[var(--ink-soft)]">{profile.taglineB}</span>
            </h1>
            <p className="body-editorial mt-8">
              I’m Ryan Dhana — exploring artificial intelligence, storytelling, business and the
              future of digital creation.
            </p>
          </motion.div>

          {/* the sphere occupies the right column on desktop, centre on mobile */}
          <div aria-hidden="true" className="hidden md:block" />

          <motion.div
            data-hero-aside
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.9 }}
            className="micro absolute bottom-24 right-2 hidden max-w-[180px] text-right leading-relaxed md:block"
          >
            AN INTERACTIVE PORTRAIT
            <br />
            OF A CURIOUS MIND
            <br />
            <span className="text-[var(--ember)]">● LIVE OBJECT 001</span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
