"use client";

import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { navItems } from "@/lib/content/chapters";
import { subscribeScroll } from "@/lib/scroll/state";
import { scrollToId } from "@/lib/scroll/lenis";
import Monogram from "@/components/ui/Monogram";

/**
 * Header composition matching the reference: name lockup hard left, a small
 * four-item pill dead centre, and a light action pill with a dark circular
 * arrow hard right. Sits above the full-bleed visual with no page frame.
 */
export default function FloatingNavigation() {
  const [active, setActive] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const [light, setLight] = useState(true);

  useEffect(
    () =>
      subscribeScroll((s) => {
        setScrolled(s.progress > 0.005);
        // the header inverts once the imagery gives way to paper sections
        setLight(s.chapter <= 4);
        const passed = navItems.filter((item) => {
          const el = document.getElementById(item.target);
          return el && el.getBoundingClientRect().top <= window.innerHeight * 0.5;
        });
        setActive(passed.length ? passed[passed.length - 1].target : "");
      }),
    []
  );

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 hidden items-start justify-between px-6 pt-5 md:flex">
      {/* name lockup */}
      <button
        type="button"
        aria-label="Ryan Dhana — back to top"
        onClick={() => scrollToId("origin")}
        className={`pointer-events-auto flex items-center gap-2.5 transition-colors duration-500 ${
          light ? "text-white" : "text-[var(--ink)]"
        }`}
      >
        <Monogram size={26} />
        <span className="text-left leading-tight">
          <span className="block text-[13px] font-medium tracking-[0.02em]">Ryan Dhana</span>
          <span
            className={`block text-[8.5px] tracking-[0.18em] transition-colors duration-500 ${
              light ? "text-white/55" : "text-[var(--ink-faint)]"
            }`}
          >
            AI EXPLORER · SINGAPORE
          </span>
        </span>
      </button>

      {/* centre pill */}
      <nav
        aria-label="Sections"
        className={`nav-pill pointer-events-auto flex items-center gap-[2px] ${scrolled ? "scrolled" : ""}`}
      >
        {navItems.map((item) => (
          <button
            key={item.target}
            type="button"
            className={`nav-item ${active === item.target ? "active" : ""}`}
            aria-current={active === item.target ? "true" : undefined}
            onClick={() => scrollToId(item.target)}
          >
            {item.label}
          </button>
        ))}
      </nav>

      {/* action pill */}
      <button
        type="button"
        onClick={() => scrollToId("contact")}
        className="nav-pill pointer-events-auto flex items-center gap-2.5 !pl-5 !pr-1.5 text-[11px] font-medium tracking-[0.02em] text-[var(--ink)]"
      >
        Let’s talk
        <span className="grid h-9 w-9 place-items-center rounded-full bg-[var(--ink)] text-[var(--paper)]">
          <ArrowRight size={14} strokeWidth={1.75} />
        </span>
      </button>
    </header>
  );
}
