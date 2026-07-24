"use client";

import { useEffect, useState } from "react";
import { subscribeScroll } from "@/lib/scroll/state";
import { chapters } from "@/lib/content/chapters";

/**
 * The fine gallery chrome: hairline guides, corner labels, coordinates
 * and the current chapter index. Deliberately quiet.
 */
export default function InterfaceLines() {
  const [chapter, setChapter] = useState(0);
  const [coord, setCoord] = useState("000.000");

  useEffect(
    () =>
      subscribeScroll((s) => {
        setChapter(s.chapter);
        setCoord((s.progress * 100).toFixed(3).padStart(7, "0"));
      }),
    []
  );

  const current = chapters[chapter];

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-20 hidden md:block">
      {/* frame guides */}
      <div className="hairline-h absolute left-6 right-6 top-20" />
      <div className="hairline-h absolute bottom-14 left-6 right-6" />
      <div className="hairline-v absolute bottom-14 left-6 top-20" />
      <div className="hairline-v absolute bottom-14 right-6 top-20" />

      {/* corner labels */}
      <span className="micro absolute left-8 top-[86px]">RD — PERSONAL WORLD</span>
      <span className="micro absolute right-8 top-[86px]">SG / {new Date().getFullYear()}</span>
      <span className="micro absolute bottom-[64px] left-8">{current.index}</span>
      <span className="micro absolute bottom-[64px] right-8 tabular-nums">LAT {coord}</span>
    </div>
  );
}
