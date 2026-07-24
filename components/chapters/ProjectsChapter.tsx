"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback } from "react";
import { ArrowUpRight } from "lucide-react";
import { chapters } from "@/lib/content/chapters";
import { useChapterTimeline } from "@/lib/scroll/useChapterTimeline";
import { projects } from "@/data/projects";
import type { gsap } from "@/lib/scroll/gsap";

const chapter = chapters[6];

/**
 * Chapter 7 — Selected Projects. One full-screen editorial slide per
 * project; each transition uses a different transformation so the
 * showcase never repeats itself.
 */
export default function ProjectsChapter() {
  const ref = useChapterTimeline<HTMLElement>(
    useCallback((tl: gsap.core.Timeline, section: HTMLElement) => {
      const slides = section.querySelectorAll<HTMLElement>("[data-slide]");
      const n = slides.length;
      const window = 1 / n;

      slides.forEach((slide, i) => {
        const start = i * window;
        const inD = window * 0.14;
        const holdEnd = start + window * 0.84;
        const meta = slide.querySelectorAll("[data-meta]");
        const poster = slide.querySelector("[data-poster]");

        // varied entrances — depth zoom, slice, lateral, focus pull, rise
        const enters: gsap.TweenVars[] = [
          { autoAlpha: 0, scale: 1.12, y: 60 },
          { autoAlpha: 0, clipPath: "inset(12% 42% 12% 42%)" },
          { autoAlpha: 0, x: 140, rotate: 1.5 },
          { autoAlpha: 0, filter: "blur(14px)", scale: 0.96 },
          { autoAlpha: 0, y: 160, skewY: 2.5 },
        ];
        const enterTo: gsap.TweenVars[] = [
          { autoAlpha: 1, scale: 1, y: 0 },
          { autoAlpha: 1, clipPath: "inset(0% 0% 0% 0%)" },
          { autoAlpha: 1, x: 0, rotate: 0 },
          { autoAlpha: 1, filter: "blur(0px)", scale: 1 },
          { autoAlpha: 1, y: 0, skewY: 0 },
        ];
        const exits: gsap.TweenVars[] = [
          { autoAlpha: 0, scale: 0.94, y: -80 },
          { autoAlpha: 0, clipPath: "inset(0% 0% 100% 0%)" },
          { autoAlpha: 0, x: -140, rotate: -1.5 },
          { autoAlpha: 0, filter: "blur(12px)", scale: 1.05 },
          { autoAlpha: 0, y: -120 },
        ];

        tl.fromTo(slide, enters[i % 5], { ...enterTo[i % 5], duration: inD }, start);
        tl.fromTo(
          meta,
          { autoAlpha: 0, y: 24 },
          { autoAlpha: 1, y: 0, duration: inD * 0.8, stagger: 0.02 },
          start + inD * 0.35
        );
        if (poster) {
          tl.fromTo(poster, { yPercent: 6 }, { yPercent: -6, duration: window * 0.9 }, start);
        }
        if (i < n - 1) {
          tl.to(slide, { ...exits[i % 5], duration: window * 0.16 }, holdEnd);
        }
      });
    }, [])
  );

  return (
    <section
      id={chapter.id}
      data-chapter-index={6}
      ref={ref}
      className="chapter"
      style={{ height: `${chapter.heights}vh` }}
    >
      <div className="chapter-sticky">
        <p className="index-label absolute left-6 top-24 z-10 md:left-14">
          <span className="tick" />
          {chapter.index} — SELECTED WORK
        </p>

        {projects.map((p, i) => (
          <article
            key={p.slug}
            data-slide
            className="project-slide absolute inset-0 grid place-items-center"
          >
            <div className="mx-auto grid w-full max-w-[1300px] grid-cols-1 items-center gap-10 px-6 md:grid-cols-[1.1fr_0.9fr] md:px-14">
              <div>
                <p data-meta className="micro mb-5 flex flex-wrap items-center gap-x-4 gap-y-1">
                  <span className="text-[var(--ember)]">{p.index}</span>
                  <span>{p.category.toUpperCase()}</span>
                  <span aria-hidden="true">·</span>
                  <span>{p.year.toUpperCase()}</span>
                  <span aria-hidden="true">·</span>
                  <span>{p.role.toUpperCase()}</span>
                </p>
                <h3 data-meta className="display text-[clamp(40px,6vw,88px)] text-[var(--ink)]">
                  {p.title}
                </h3>
                <p data-meta className="body-editorial mt-6">
                  {p.description}
                </p>
                <p data-meta className="mt-8">
                  <Link
                    href={`/projects/${p.slug}`}
                    className="group inline-flex items-center gap-2 border-b border-[var(--ink)] pb-1 text-[12px] tracking-[0.18em] text-[var(--ink)]"
                  >
                    VIEW PROJECT
                    <ArrowUpRight
                      size={14}
                      strokeWidth={1.5}
                      className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    />
                  </Link>
                </p>
              </div>

              <div
                data-poster
                className="relative hidden aspect-[4/3] overflow-hidden rounded-2xl border border-[var(--line)] shadow-[0_40px_90px_-40px_rgba(20,22,26,0.35)] md:block"
                style={{ background: `linear-gradient(150deg, ${p.accent}14, transparent 60%)` }}
              >
                <Image
                  src={p.poster}
                  alt={`${p.title} — visual`}
                  fill
                  sizes="(min-width: 768px) 40vw, 90vw"
                  className="object-cover"
                />
                <span className="micro absolute bottom-4 left-4 rounded-full border border-[var(--line)] bg-[rgba(250,249,246,0.8)] px-3 py-1 backdrop-blur">
                  {p.status.toUpperCase()}
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
