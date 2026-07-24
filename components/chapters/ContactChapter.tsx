"use client";

import { useCallback } from "react";
import { ArrowUp } from "lucide-react";
import { chapters } from "@/lib/content/chapters";
import { useChapterTimeline } from "@/lib/scroll/useChapterTimeline";
import { scrollToTop } from "@/lib/scroll/lenis";
import { profile } from "@/data/profile";
import ContactForm from "@/components/ui/ContactForm";
import Monogram from "@/components/ui/Monogram";
import type { gsap } from "@/lib/scroll/gsap";

const chapter = chapters[10];

const contactLinks = [
  { label: "EMAIL", value: profile.contact.email },
  { label: "INSTAGRAM", value: profile.contact.instagram },
  { label: "TIKTOK", value: profile.contact.tiktok },
  { label: "YOUTUBE", value: profile.contact.youtube },
];

/**
 * Chapter 12 + Final Scene. The visual collapses to a glowing point
 * behind the contact card, then blooms back into a mini curiosity core
 * as the story loops to its beginning.
 */
export default function ContactChapter() {
  const ref = useChapterTimeline<HTMLElement>(
    useCallback((tl: gsap.core.Timeline, section: HTMLElement) => {
      const card = section.querySelector("[data-contact-card]");
      const finale = section.querySelector("[data-finale]");
      if (card) {
        tl.fromTo(card, { autoAlpha: 0, y: 70 }, { autoAlpha: 1, y: 0, duration: 0.1 }, 0.03);
        tl.to(card, { autoAlpha: 0, y: -60, duration: 0.08 }, 0.5);
      }
      if (finale) {
        tl.fromTo(finale, { autoAlpha: 0, scale: 0.96 }, { autoAlpha: 1, scale: 1, duration: 0.12 }, 0.62);
      }
    }, [])
  );

  return (
    <section
      id={chapter.id}
      data-chapter-index={10}
      ref={ref}
      className="chapter"
      style={{ height: `${chapter.heights}vh` }}
    >
      {/* part one — contact */}
      <div className="chapter-sticky items-center">
        <div
          data-contact-card
          className="mx-auto grid w-full max-w-[1200px] grid-cols-1 gap-14 px-6 md:grid-cols-[1fr_1.1fr] md:px-14"
        >
          <div className="self-center">
            <p className="index-label mb-6">
              <span className="tick" />
              {chapter.index}
            </p>
            <h2 className="display text-[clamp(34px,4.6vw,64px)]">
              Let’s create something memorable.
            </h2>
            <p className="body-editorial mt-6">
              For creative collaborations, storytelling projects and future ideas.
            </p>

            <ul className="mt-10 grid gap-3">
              {contactLinks.map((link) => (
                <li key={link.label} className="flex items-baseline gap-5">
                  <span className="micro w-20">{link.label}</span>
                  <code className="rounded bg-[rgba(20,22,26,0.05)] px-2 py-1 text-[11px] tracking-wide text-[var(--ink-soft)]">
                    {link.value}
                  </code>
                </li>
              ))}
            </ul>
            <p className="micro mt-4 max-w-xs leading-relaxed">
              PLACEHOLDERS — REPLACE WITH REAL LINKS IN data/profile.ts BEFORE LAUNCH.
            </p>
          </div>

          <div className="self-center rounded-3xl border border-[var(--line)] bg-[rgba(250,249,246,0.6)] p-7 backdrop-blur-sm md:p-10">
            <ContactForm />
          </div>
        </div>
      </div>

      {/* part two — final scene, looping back to the core */}
      <div className="chapter-sticky place-items-center" style={{ marginTop: "-100vh" }}>
        <div data-finale className="pointer-events-none text-center opacity-0">
          <div className="pointer-events-auto flex flex-col items-center">
            <Monogram size={44} />
            <p className="display mt-10 text-[clamp(36px,5.4vw,84px)]">RYAN DHANA</p>
            <p className="mt-6 text-[13px] font-light tracking-[0.34em] text-[var(--ink-soft)]">
              BORN CURIOUS. BUILDING WHAT COMES NEXT.
            </p>
            <button
              type="button"
              onClick={scrollToTop}
              className="group mt-14 inline-flex items-center gap-2 rounded-full border border-[var(--line)] px-6 py-3 text-[11px] tracking-[0.22em] text-[var(--ink-soft)] transition-colors hover:border-[var(--ink)] hover:text-[var(--ink)]"
            >
              <ArrowUp size={13} strokeWidth={1.5} className="transition-transform group-hover:-translate-y-0.5" />
              BACK TO THE BEGINNING
            </button>
            <p className="micro mt-16">
              © {new Date().getFullYear()} RYAN DHANA — DESIGNED & BUILT AS A LIVING EXPERIMENT
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
