"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { navItems } from "@/lib/content/chapters";
import { scrollToId } from "@/lib/scroll/lenis";
import { subscribeScroll } from "@/lib/scroll/state";
import Monogram from "@/components/ui/Monogram";

/** Compact lockup + sheet menu for touch devices. */
export default function MobileNavigation() {
  const [open, setOpen] = useState(false);
  const [light, setLight] = useState(true);

  useEffect(() => subscribeScroll((s) => setLight(s.chapter <= 4)), []);

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="fixed inset-x-0 top-0 z-50 flex w-full items-center justify-between px-4 pt-4 md:hidden">
      <span
        className={`flex items-center gap-2 transition-colors duration-500 ${
          light ? "text-white" : "text-[var(--ink)]"
        }`}
      >
        <Monogram size={24} />
        <span className="text-left leading-tight">
          <span className="block text-[12px] font-medium">Ryan Dhana</span>
          <span className={`block text-[8px] tracking-[0.16em] ${light ? "text-white/55" : "text-[var(--ink-faint)]"}`}>
            AI EXPLORER · SINGAPORE
          </span>
        </span>
      </span>
      <button
        type="button"
        aria-expanded={open}
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((v) => !v)}
        className="nav-pill grid h-11 w-11 place-items-center !p-0 text-[var(--ink)]"
      >
        {open ? <X size={16} strokeWidth={1.5} /> : <Menu size={16} strokeWidth={1.5} />}
      </button>

      <AnimatePresence>
        {open && (
          <motion.nav
            aria-label="Chapters"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            className="fixed inset-x-3 top-[70px] z-50 rounded-3xl border border-[var(--line)] bg-[rgba(250,249,246,0.94)] p-3 shadow-2xl backdrop-blur-xl"
          >
            {navItems.map((item, i) => (
              <motion.button
                key={item.target}
                type="button"
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 * i }}
                className="block w-full rounded-2xl px-4 py-3.5 text-left text-sm tracking-[0.08em] text-[var(--ink-soft)]"
                onClick={() => {
                  setOpen(false);
                  setTimeout(() => scrollToId(item.target), 60);
                }}
              >
                <span className="micro mr-3">{String(i + 1).padStart(2, "0")}</span>
                {item.label}
              </motion.button>
            ))}
          </motion.nav>
        )}
      </AnimatePresence>
    </div>
  );
}
