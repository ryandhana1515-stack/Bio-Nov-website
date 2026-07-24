"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { navItems, chapters } from "@/lib/content/chapters";
import { subscribeScroll } from "@/lib/scroll/state";
import { scrollToId } from "@/lib/scroll/lenis";
import Monogram from "@/components/ui/Monogram";
import MobileNavigation from "./MobileNavigation";

/**
 * The floating glass pill, top centre. Tracks the active chapter,
 * smooth-scrolls to sections, supports keyboard use, and collapses to
 * a compact menu on mobile.
 */
export default function FloatingNavigation() {
  const [active, setActive] = useState("origin");
  const [scrolled, setScrolled] = useState(false);

  useEffect(
    () =>
      subscribeScroll((s) => {
        setScrolled(s.progress > 0.005);
        const chapter = chapters[s.chapter];
        // resolve the nav group this chapter belongs to
        let owner = navItems[0].target;
        for (const item of navItems) {
          const ownerIndex = chapters.findIndex((c) => c.id === item.target);
          if (ownerIndex !== -1 && ownerIndex <= s.chapter) owner = item.target;
        }
        setActive(chapter.nav ? chapter.id : owner);
      }),
    []
  );

  return (
    <header className="fixed inset-x-0 top-4 z-50 flex items-center justify-center">
      {/* wordmark, top-left */}
      <Link
        href="/"
        aria-label="Ryan Dhana — home"
        className="absolute left-5 top-1 hidden items-center gap-2.5 text-[var(--ink)] md:flex"
        onClick={(e) => {
          e.preventDefault();
          scrollToId("origin");
        }}
      >
        <Monogram />
        <span className="text-[11px] font-medium tracking-[0.28em]">RYAN DHANA</span>
      </Link>

      <nav
        aria-label="Chapters"
        className={`nav-pill hidden items-center gap-[2px] md:flex ${scrolled ? "scrolled" : ""}`}
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

      <MobileNavigation active={active} />
    </header>
  );
}
