"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Activity, ArrowRight, Check, Heart, Pill, Sparkles } from "lucide-react";

/* What actually happens after you take BIO N:OV — one stage per click.
   The body copy explains the mechanism so a first-time reader understands
   why any of it matters. */
export const stages = [
  {
    key: "mouth",
    label: "Mouth",
    at: 0.04,
    Icon: Pill,
    kicker: "Stage 01",
    title: "You take one tablet",
    lead: "500 mg, three times a day, with water.",
    body: "Nothing clinical, nothing complicated. The tablet goes down the same way as everything else you swallow and begins its journey through your digestive tract. One box is a 20-day supply at this serving.",
    points: [
      "500 mg tablet, taken three times daily",
      "Swallowed with water — no injections, no clinic",
      "Travels the oesophagus into the stomach",
      "One box = 20 days at the standard serving"
    ]
  },
  {
    key: "stomach",
    label: "Stomach",
    at: 0.36,
    Icon: Sparkles,
    kicker: "Stage 02",
    title: "Fermented actives release",
    lead: "The hard work already happened — before it ever reached you.",
    body: "This is what makes BIO N:OV third-generation. The fermented garlic and lettuce extracts were transformed by a patented microbial process (KACC91554P) inside a GMP-certified Korean facility. Earlier supplements depend on your body converting a precursor — a step that becomes less efficient with age. Here, that conversion is already done.",
    points: [
      "Fermented garlic and fermented lettuce extracts",
      "Patented microbial fermentation — KACC91554P",
      "GMP-certified Korean manufacturing",
      "No enzyme conversion needed inside your body",
      "Why it works the same way at 60 as at 30"
    ]
  },
  {
    key: "bloodstream",
    label: "Bloodstream",
    at: 0.68,
    Icon: Heart,
    kicker: "Stage 03",
    title: "Into your circulation",
    lead: "Now it joins the only road that reaches everywhere.",
    body: "Absorbed compounds enter the bloodstream and support your body's natural nitric oxide pathway. Nitric oxide is the signal that tells the smooth muscle wrapped around every blood vessel to relax. Vessels widen. Resistance falls. The same heartbeat moves blood further, more easily.",
    points: [
      "Absorbed compounds enter the bloodstream",
      "Supports your natural nitric oxide pathway",
      "Nitric oxide signals vessel muscle to relax",
      "Wider vessels mean less resistance to flow",
      "No cell in your body sits far from a vessel"
    ]
  },
  {
    key: "cells",
    label: "Every cell",
    at: 0.97,
    Icon: Activity,
    kicker: "Stage 04",
    title: "Delivered — everywhere",
    lead: "Brain. Heart. Muscle. Skin. All served by one network.",
    body: "Oxygen-rich blood arrives where it was always needed. Your brain takes about a fifth of your oxygen and stores almost none of it. Working muscle needs a continuous supply to sustain effort and recover afterwards. Skin is fed by the same network. This is why circulation is a whole-body story rather than a single-target one.",
    points: [
      "Brain uses ~20% of your oxygen, stores almost none",
      "Muscle needs continuous supply for stamina and recovery",
      "Skin and immune tissue share the same network",
      "Supports energy, clarity and healthy ageing",
      "One system serving every organ you own"
    ]
  }
] as const;

export default function XrayJourney({ videoSrc }: { videoSrc: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stage, setStage] = useState(0);
  const [ready, setReady] = useState(false);

  /* Ease the X-ray footage to the frame matching the selected stage. */
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid || !ready || !vid.duration) return;
    let raf = 0;
    const target = stages[stage].at * vid.duration;
    const step = () => {
      const diff = target - vid.currentTime;
      if (Math.abs(diff) < 0.03) return;
      vid.currentTime += diff * 0.16;
      raf = requestAnimationFrame(step);
    };
    step();
    return () => cancelAnimationFrame(raf);
  }, [stage, ready]);

  const current = stages[stage];
  const Icon = current.Icon;

  return (
    <section id="journey" className="journey-section">
      <div className="journey-head">
        <span className="journey-kicker">X-Ray Vision</span>
        <h2>
          See It Work <span>Inside Your Body.</span>
        </h2>
        <p>Click each stage to follow one BIO N:OV tablet from your mouth to every cell you own.</p>
      </div>

      <div className="journey-grid">
        {/* ---------- the body ---------- */}
        <div className="journey-viz">
          <video
            ref={videoRef}
            src={videoSrc}
            poster="/video/xray-journey-poster.jpg"
            muted
            playsInline
            preload="auto"
            className="journey-video"
            onLoadedMetadata={() => setReady(true)}
          />
          <div className="journey-stagetag">
            <Icon size={15} />
            {current.label}
          </div>
        </div>

        {/* ---------- the explanation ---------- */}
        <div className="journey-panel">
          <div className="journey-steps">
            {stages.map((s, i) => (
              <button
                key={s.key}
                className={`journey-step ${i === stage ? "is-active" : ""} ${i < stage ? "is-done" : ""}`}
                onClick={() => setStage(i)}
              >
                <span className="journey-step__num">{String(i + 1).padStart(2, "0")}</span>
                <span className="journey-step__label">{s.label}</span>
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={current.key}
              className="journey-detail"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="journey-detail__kicker">
                <Icon size={14} /> {current.kicker}
              </span>
              <h3>{current.title}</h3>
              <p className="journey-detail__lead">{current.lead}</p>
              <p className="journey-detail__body">{current.body}</p>
              <ul>
                {current.points.map((pt) => (
                  <li key={pt}>
                    <Check size={15} />
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </AnimatePresence>

          <div className="journey-nav">
            <button onClick={() => setStage(Math.max(0, stage - 1))} disabled={stage === 0}>
              &larr; Back
            </button>
            <button
              className="is-next"
              onClick={() => setStage(stage < stages.length - 1 ? stage + 1 : 0)}
            >
              {stage < stages.length - 1 ? "Next stage" : "Start again"} <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
