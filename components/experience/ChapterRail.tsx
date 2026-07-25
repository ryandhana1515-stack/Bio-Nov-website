"use client";

import { useEffect, useState } from "react";
import { chapters } from "@/lib/content/chapters";
import { subscribeScroll } from "@/lib/scroll/state";
import { scrollToId } from "@/lib/scroll/lenis";

/**
 * The right-edge rail from the reference: a vertical stack of short hairlines,
 * one per chapter. The active line extends and solidifies; hovering reveals
 * the chapter name. Doubles as chapter navigation.
 */
export default function ChapterRail() {
  const [current, setCurrent] = useState(0);
  const [light, setLight] = useState(true);

  useEffect(
    () =>
      subscribeScroll((s) => {
        setCurrent(s.chapter);
        setLight(s.chapter <= 4);
      }),
    []
  );

  return (
    <nav
      aria-label="Chapter rail"
      className="fixed right-6 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-end gap-[9px] md:flex"
    >
      {chapters.map((chapter, i) => {
        const isActive = i === current;
        return (
          <button
            key={chapter.id}
            type="button"
            title={chapter.label}
            aria-label={chapter.label}
            aria-current={isActive ? "true" : undefined}
            onClick={() => scrollToId(chapter.id)}
            className="group flex items-center justify-end gap-3 py-[3px]"
          >
            <span
              className={`whitespace-nowrap text-[9px] tracking-[0.2em] opacity-0 transition-opacity duration-300 group-hover:opacity-100 ${
                light ? "text-white/80" : "text-[var(--ink-faint)]"
              }`}
            >
              {chapter.label.toUpperCase()}
            </span>
            <span
              className={`block h-px transition-all duration-500 ${
                isActive ? "w-8" : "w-4 group-hover:w-6"
              } ${
                light
                  ? isActive
                    ? "bg-white"
                    : "bg-white/40"
                  : isActive
                    ? "bg-[var(--ink)]"
                    : "bg-[rgba(20,22,26,0.25)]"
              }`}
            />
          </button>
        );
      })}
    </nav>
  );
}
