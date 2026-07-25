"use client";

import { useEffect, useState } from "react";
import { subscribeScroll } from "@/lib/scroll/state";
import { chapters } from "@/lib/content/chapters";

/**
 * Minimal corner marks, as in the reference: a tiny index bottom-left and a
 * scene readout bottom-right. No page frame — the imagery runs edge to edge.
 */
export default function InterfaceLines() {
  const [chapter, setChapter] = useState(0);
  const [pct, setPct] = useState("000");
  const [light, setLight] = useState(true);

  useEffect(
    () =>
      subscribeScroll((s) => {
        setChapter(s.chapter);
        setPct(String(Math.round(s.progress * 100)).padStart(3, "0"));
        setLight(s.chapter <= 4);
      }),
    []
  );

  const tone = light ? "text-white/55" : "text-[var(--ink-faint)]";

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-20 hidden md:block">
      <span className={`absolute bottom-6 left-6 text-[9px] tracking-[0.24em] ${tone}`}>
        {chapters[chapter].index}
      </span>
      <span
        className={`absolute bottom-6 right-6 text-[9px] tabular-nums tracking-[0.24em] ${tone}`}
      >
        SCENE {pct}
      </span>
    </div>
  );
}
