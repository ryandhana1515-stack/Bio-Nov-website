"use client";

import { useCallback, useRef, useState } from "react";
import { motion, useScroll, useTransform, useSpring, MotionValue } from "framer-motion";
import { ArrowRight, ArrowDown, Plus } from "lucide-react";
import StageVisual, { Variant } from "./StageVisual";

const nav = ["Work", "Topics", "About", "Contact"];

const stages: { variant: Variant; src: string }[] = [
  { variant: "portrait", src: "/images/nomadatoast/stage-1.jpg" },
  { variant: "mesh", src: "/images/nomadatoast/stage-2.jpg" },
  { variant: "dissolve", src: "/images/nomadatoast/stage-3.jpg" },
  { variant: "sculpture", src: "/images/nomadatoast/stage-4.jpg" },
  { variant: "fibers", src: "/images/nomadatoast/stage-5.jpg" },
];

type Run = { t: string; em?: boolean };

const chapters: { chip: string; lines: Run[][]; copy: string }[] = [
  {
    chip: "Jo Mendes · Nomadatoast",
    lines: [[{ t: "Creating content" }], [{ t: "that " }, { t: "connects.", em: true }]],
    copy: "Practical AI tutorials for creators who want to grow, ship, and monetise.",
  },
  {
    chip: "Audience",
    lines: [[{ t: "Over " }, { t: "one million", em: true }], [{ t: "curious people." }]],
    copy: "Across YouTube, TikTok, Reels and Shorts. Creators, engineers, founders swapping notes.",
  },
];

const rail = [
  { kind: "meta", lines: ["Tutorials · Tool breakdowns · Monetisation"] },
  { kind: "meta", lines: ["Amsterdam · Lisbon"] },
  { kind: "block", label: "Currently", lines: ["Filming a breakdown of"], feature: "Nano Banana Pro" },
  { kind: "block", label: "This week", lines: ["Kling 2.6 audio rig", "Higgsfield Earn deep-dive", "AI influencer playbook"] },
  { kind: "block", label: "Follow", lines: ["YouTube", "TikTok", "Instagram", "Threads", "X"], link: true },
  { kind: "block", label: "Contact", lines: ["hi@nomadatoast.com"], link: true },
  { kind: "meta", lines: ["Est. 2023 — 2026"] },
] as const;

/** Cross-fading hero visual: real render when present, procedural stand-in otherwise. */
function Stage({ index, progress }: { index: number; progress: MotionValue<number> }) {
  const [hasArt, setHasArt] = useState(true);
  // A 404 usually resolves before hydration, so onError alone never fires.
  const probe = useCallback((el: HTMLImageElement | null) => {
    if (el?.complete && el.naturalWidth === 0) setHasArt(false);
  }, []);
  const span = 1 / stages.length;
  const start = index * span;
  const opacity = useTransform(
    progress,
    [start - span * 0.75, start, start + span * 0.85, start + span * 1.6],
    index === 0 ? [1, 1, 1, 0] : [0, 1, 1, index === stages.length - 1 ? 1 : 0]
  );
  const scale = useTransform(progress, [start - span, start + span * 1.6], [1.12, 1]);

  return (
    <motion.div className="nt-stage" style={{ opacity, scale }}>
      <StageVisual variant={stages[index].variant} />
      {hasArt && (
        // eslint-disable-next-line @next/next/no-img-element
        <img ref={probe} src={stages[index].src} alt="" onError={() => setHasArt(false)} />
      )}
    </motion.div>
  );
}

function Chapter({ index, progress, data }: { index: number; progress: MotionValue<number>; data: (typeof chapters)[number] }) {
  const ranges: [number, number, number, number] = index === 0 ? [0, 0, 0.3, 0.42] : [0.5, 0.62, 1, 1];
  const opacity = useTransform(progress, ranges, index === 0 ? [1, 1, 1, 0] : [0, 1, 1, 1]);
  const y = useTransform(progress, ranges, index === 0 ? [0, 0, 0, -40] : [40, 0, 0, 0]);

  return (
    <motion.div className="nt-chapter" style={{ opacity, y }}>
      <span className="nt-chip">{data.chip}</span>
      <h1 className="nt-headline">
        {data.lines.map((line, li) => (
          <span className="nt-headline-line" key={li}>
            {line.map((run, ri) => (run.em ? <em key={ri}>{run.t}</em> : <span key={ri}>{run.t}</span>))}
          </span>
        ))}
      </h1>
      <p className="nt-lede">{data.copy}</p>
    </motion.div>
  );
}

export default function NomadatoastSite() {
  const track = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: track, offset: ["start start", "end end"] });
  const progress = useSpring(scrollYProgress, { stiffness: 180, damping: 40, restDelta: 0.001 });
  const railY = useTransform(progress, [0, 1], ["0%", "-58%"]);
  const cueOpacity = useTransform(progress, [0, 0.06], [1, 0]);

  return (
    <div className="nt-root">
      <header className="nt-chrome">
        <a className="nt-brand" href="#top">
          <Plus size={26} strokeWidth={1.5} />
          <span>
            <b>Jo Mendes</b>
            <small>Nomadatoast</small>
          </span>
        </a>

        <nav className="nt-nav" aria-label="Primary">
          {nav.map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`}>
              {item}
            </a>
          ))}
        </nav>

        <a className="nt-subscribe" href="#subscribe">
          Subscribe
          <i>
            <ArrowRight size={16} strokeWidth={2.25} />
          </i>
        </a>
      </header>

      <section className="nt-track" ref={track} id="top">
        <div className="nt-pin">
          <div className="nt-visual">
            {stages.map((_, i) => (
              <Stage key={i} index={i} progress={progress} />
            ))}
          </div>

          <div className="nt-copy">
            {chapters.map((c, i) => (
              <Chapter key={c.chip} index={i} progress={progress} data={c} />
            ))}
          </div>

          <aside className="nt-rail" aria-label="Channel details">
            <motion.div className="nt-rail-inner" style={{ y: railY }}>
              {rail.map((group, i) => (
                <div className={`nt-rail-group nt-rail-${group.kind}`} key={i}>
                  {"label" in group && group.label ? <span className="nt-rail-label">{group.label}</span> : null}
                  {group.lines.map((line) =>
                    "link" in group && group.link ? (
                      <a className="nt-rail-line" href="#contact" key={line}>
                        {line}
                      </a>
                    ) : (
                      <span className="nt-rail-line" key={line}>
                        {line}
                      </span>
                    )
                  )}
                  {"feature" in group && group.feature ? <span className="nt-rail-feature">{group.feature}</span> : null}
                </div>
              ))}
            </motion.div>

            <motion.span className="nt-cue" style={{ opacity: cueOpacity }}>
              <ArrowDown size={13} strokeWidth={1.75} /> Scroll to explore
            </motion.span>
          </aside>
        </div>
      </section>
    </div>
  );
}
