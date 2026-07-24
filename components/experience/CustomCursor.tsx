"use client";

import { useEffect, useRef, useState } from "react";
import { useExperience } from "./context";

/**
 * Subtle desktop cursor: a small ink dot with a trailing ring that
 * expands over interactive elements. Fine-pointer devices only.
 */
export default function CustomCursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const { motionOk } = useExperience();

  useEffect(() => {
    if (!motionOk) return;
    const fine = window.matchMedia("(pointer: fine)").matches;
    if (!fine) return;
    setEnabled(true);
    document.documentElement.classList.add("has-custom-cursor");

    let x = -100;
    let y = -100;
    let rx = -100;
    let ry = -100;
    let hovering = false;
    let raf = 0;

    const move = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      const target = e.target as HTMLElement;
      hovering = Boolean(target.closest("a, button, input, textarea, [data-cursor]"));
    };

    const loop = () => {
      raf = requestAnimationFrame(loop);
      rx += (x - rx) * 0.16;
      ry += (y - ry) * 0.16;
      if (dot.current) dot.current.style.transform = `translate(${x - 2}px, ${y - 2}px)`;
      if (ring.current) {
        const s = hovering ? 1.9 : 1;
        ring.current.style.transform = `translate(${rx - 14}px, ${ry - 14}px) scale(${s})`;
        ring.current.style.opacity = hovering ? "0.9" : "0.45";
      }
    };

    window.addEventListener("pointermove", move, { passive: true });
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("pointermove", move);
      cancelAnimationFrame(raf);
      document.documentElement.classList.remove("has-custom-cursor");
    };
  }, [motionOk]);

  if (!enabled) return null;

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[100] hidden md:block">
      <div
        ref={dot}
        className="absolute h-1 w-1 rounded-full bg-[var(--ink)]"
        style={{ willChange: "transform" }}
      />
      <div
        ref={ring}
        className="absolute h-7 w-7 rounded-full border border-[var(--ink-faint)] transition-opacity duration-300"
        style={{ willChange: "transform" }}
      />
    </div>
  );
}
