"use client";

import { useEffect, useState } from "react";
import { subscribeScroll } from "@/lib/scroll/state";

/** Bottom-centre scroll cue that retires after the first scroll. */
export default function SceneProgress() {
  const [hasScrolled, setHasScrolled] = useState(false);
  const [light, setLight] = useState(true);

  useEffect(
    () =>
      subscribeScroll((s) => {
        setHasScrolled(s.hasScrolled);
        setLight(s.chapter <= 4);
      }),
    []
  );

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none fixed bottom-6 left-1/2 z-30 -translate-x-1/2 transition-opacity duration-700 ${
        hasScrolled ? "opacity-0" : "opacity-100"
      }`}
    >
      <span
        className={`pulse-soft text-[9px] tracking-[0.3em] ${
          light ? "text-white/70" : "text-[var(--ink-faint)]"
        }`}
      >
        SCROLL TO EXPLORE
      </span>
    </div>
  );
}
