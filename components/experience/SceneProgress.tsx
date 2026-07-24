"use client";

import { useEffect, useState } from "react";
import { subscribeScroll } from "@/lib/scroll/state";
import { chapters } from "@/lib/content/chapters";

/**
 * Right-edge progress instrument: thin track, chapter ticks and a live
 * percentage readout. Doubles as a "scroll to explore" cue before the
 * first scroll.
 */
export default function SceneProgress() {
  const [progress, setProgress] = useState(0);
  const [chapter, setChapter] = useState(0);
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(
    () =>
      subscribeScroll((s) => {
        setProgress(s.progress);
        setChapter(s.chapter);
        setHasScrolled(s.hasScrolled);
      }),
    []
  );

  return (
    <>
      {/* vertical instrument — desktop */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed right-10 top-1/2 z-30 hidden -translate-y-1/2 flex-col items-center gap-3 md:flex"
      >
        <span className="micro">{String(chapter + 1).padStart(2, "0")}</span>
        <div className="relative h-44 w-px bg-[var(--line)]">
          <div
            className="absolute left-0 top-0 w-px bg-[var(--ink)] transition-[height] duration-150"
            style={{ height: `${progress * 100}%` }}
          />
          {chapters.map((c, i) => (
            <span
              key={c.id}
              className="absolute -left-[2.5px] h-[5px] w-[5px] rounded-full border border-[var(--line)] bg-[var(--paper)]"
              style={{ top: `${(i / (chapters.length - 1)) * 100}%` }}
            />
          ))}
        </div>
        <span className="micro tabular-nums">{Math.round(progress * 100)}%</span>
      </div>

      {/* thin top progress line — all sizes */}
      <div aria-hidden="true" className="fixed left-0 right-0 top-0 z-40 h-px bg-transparent">
        <div className="h-px bg-[var(--ink)] opacity-40" style={{ width: `${progress * 100}%` }} />
      </div>

      {/* scroll cue */}
      <div
        aria-hidden="true"
        className={`pointer-events-none fixed bottom-5 left-1/2 z-30 -translate-x-1/2 transition-opacity duration-700 ${
          hasScrolled ? "opacity-0" : "opacity-100"
        }`}
      >
        <span className="micro pulse-soft tracking-[0.3em]">SCROLL TO EXPLORE</span>
      </div>
    </>
  );
}
