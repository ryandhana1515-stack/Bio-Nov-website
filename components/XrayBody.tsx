"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

/* ------------------------------------------------------------------ *
 * The journey a capsule takes — mouth to every cell.
 * Copy is deliberately structure-function only: no disease claims,
 * no measured-outcome percentages.
 * ------------------------------------------------------------------ */
export const journeyStages = [
  {
    key: "mouth",
    label: "Mouth",
    title: "It begins with one tablet",
    text: "One 500 mg tablet, three times a day. It travels the same route as everything else you swallow — no injections, no clinic visit, nothing unusual.",
    region: "throat"
  },
  {
    key: "stomach",
    label: "Stomach",
    title: "Fermented actives are released",
    text: "The fermented garlic and lettuce extracts have already been transformed before they reach you. That is what the patented fermentation step does — the work happens in the facility, not inside your body.",
    region: "stomach"
  },
  {
    key: "bloodstream",
    label: "Bloodstream",
    title: "Into circulation",
    text: "Absorbed compounds enter the bloodstream — the delivery network that reaches every organ you own. From here, nothing in your body is more than a few cells away from a blood vessel.",
    region: "vessels"
  },
  {
    key: "cells",
    label: "Every cell",
    title: "Supporting the signal, everywhere",
    text: "Nitric oxide signalling helps blood vessels relax so blood moves with less resistance. Brain, heart, muscle, skin — every tissue is served by the same open road.",
    region: "whole"
  }
];

export default function XrayBody({
  stage,
  onStage
}: {
  stage: number;
  onStage: (i: number) => void;
}) {
  const [pulse, setPulse] = useState(0);

  // Gentle heartbeat driving the glow intensity
  useEffect(() => {
    const id = setInterval(() => setPulse((p) => (p + 1) % 2), 900);
    return () => clearInterval(id);
  }, []);

  const active = journeyStages[stage]?.region ?? "whole";
  const lit = (r: string) => active === r || active === "whole";

  return (
    <div className="xray">
      <svg viewBox="0 0 620 860" className="xray__svg" role="img" aria-label="Anatomical illustration of the circulatory system">
        <defs>
          {/* Glows */}
          <filter id="glowSoft" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="9" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="glowHard" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="16" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>

          <linearGradient id="skin" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#5ac8ff" stopOpacity="0.16" />
            <stop offset="55%" stopColor="#3a7fe0" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#2b4fa8" stopOpacity="0.05" />
          </linearGradient>
          <linearGradient id="bone" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#dff3ff" />
            <stop offset="100%" stopColor="#7fc4ff" />
          </linearGradient>
          <linearGradient id="artery" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ff7d9e" />
            <stop offset="100%" stopColor="#ff4f7f" />
          </linearGradient>
          <radialGradient id="organGlow">
            <stop offset="0%" stopColor="#ffb45e" stopOpacity="0.95" />
            <stop offset="70%" stopColor="#ff7d3c" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#ff7d3c" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="coreGlow">
            <stop offset="0%" stopColor="#8fe6ff" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#8fe6ff" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* ambient core light */}
        <ellipse cx="310" cy="400" rx="270" ry="330" fill="url(#coreGlow)" opacity={lit("whole") ? 0.9 : 0.5} />

        {/* ---------- body silhouette ---------- */}
        <g className="xray__body">
          {/* head */}
          <ellipse cx="310" cy="86" rx="52" ry="62" fill="url(#skin)" stroke="#7fc4ff" strokeOpacity="0.35" strokeWidth="1.4" />
          {/* neck */}
          <path d="M288 140 h44 v34 h-44 z" fill="url(#skin)" stroke="#7fc4ff" strokeOpacity="0.28" strokeWidth="1.2" />
          {/* torso */}
          <path
            d="M232 176 q78 -22 156 0 l22 96 q10 92 -6 176 q-8 62 -18 108 h-152 q-10 -46 -18 -108 q-16 -84 -6 -176 z"
            fill="url(#skin)"
            stroke="#7fc4ff"
            strokeOpacity="0.34"
            strokeWidth="1.5"
          />
          {/* arms */}
          <path d="M232 182 q-38 12 -48 62 l-26 168 q-4 26 12 30 q16 3 22 -22 l30 -156 z" fill="url(#skin)" stroke="#7fc4ff" strokeOpacity="0.28" strokeWidth="1.2" />
          <path d="M388 182 q38 12 48 62 l26 168 q4 26 -12 30 q-16 3 -22 -22 l-30 -156 z" fill="url(#skin)" stroke="#7fc4ff" strokeOpacity="0.28" strokeWidth="1.2" />
          {/* legs */}
          <path d="M244 556 l-10 232 q-2 26 18 26 q18 0 20 -26 l16 -232 z" fill="url(#skin)" stroke="#7fc4ff" strokeOpacity="0.28" strokeWidth="1.2" />
          <path d="M376 556 l10 232 q2 26 -18 26 q-18 0 -20 -26 l-16 -232 z" fill="url(#skin)" stroke="#7fc4ff" strokeOpacity="0.28" strokeWidth="1.2" />
        </g>

        {/* ---------- skeleton ---------- */}
        <g className="xray__bone" filter="url(#glowSoft)">
          {/* spine */}
          {Array.from({ length: 17 }).map((_, i) => (
            <rect
              key={i}
              x="298"
              y={182 + i * 22}
              width="24"
              height="15"
              rx="5"
              fill="url(#bone)"
              opacity={0.5 + (i % 2) * 0.14}
            />
          ))}
          {/* ribs */}
          {Array.from({ length: 8 }).map((_, i) => {
            const y = 208 + i * 27;
            const spread = 62 + i * 9 - (i > 5 ? (i - 5) * 16 : 0);
            return (
              <g key={i} opacity={0.62 - i * 0.03}>
                <path d={`M300 ${y} q-${spread} 6 -${spread * 0.86} ${34 + i * 2}`} fill="none" stroke="url(#bone)" strokeWidth="4.6" strokeLinecap="round" />
                <path d={`M320 ${y} q${spread} 6 ${spread * 0.86} ${34 + i * 2}`} fill="none" stroke="url(#bone)" strokeWidth="4.6" strokeLinecap="round" />
              </g>
            );
          })}
          {/* clavicles + pelvis */}
          <path d="M250 190 q60 -16 120 0" fill="none" stroke="url(#bone)" strokeWidth="5" strokeLinecap="round" opacity="0.6" />
          <path d="M250 546 q60 34 120 0 q-14 42 -60 42 q-46 0 -60 -42" fill="none" stroke="url(#bone)" strokeWidth="5" strokeLinecap="round" opacity="0.5" />
        </g>

        {/* ---------- organs ---------- */}
        {/* throat / oesophagus */}
        <g className={`xray__organ ${lit("throat") ? "is-lit" : ""}`}>
          <path d="M310 146 v122" stroke="#ffb45e" strokeWidth="9" strokeLinecap="round" fill="none" opacity={lit("throat") ? 0.95 : 0.2} filter={lit("throat") ? "url(#glowHard)" : undefined} />
        </g>

        {/* stomach */}
        <g className={`xray__organ ${lit("stomach") ? "is-lit" : ""}`}>
          <ellipse cx="345" cy="392" rx="70" ry="52" fill="url(#organGlow)" opacity={lit("stomach") ? 1 : 0.16} />
          <path
            d="M312 348 q54 -8 62 40 q8 52 -44 60 q-46 6 -52 -34 q-4 -30 26 -34"
            fill="none"
            stroke="#ffb45e"
            strokeWidth="5"
            strokeLinecap="round"
            opacity={lit("stomach") ? 0.95 : 0.25}
            filter={lit("stomach") ? "url(#glowHard)" : undefined}
          />
        </g>

        {/* heart */}
        <g className="xray__heart" filter="url(#glowHard)">
          <path
            d="M282 262 q-24 -26 -46 -4 q-22 22 4 50 q20 22 44 40 q26 -18 46 -40 q26 -28 4 -50 q-22 -22 -46 4 z"
            fill="url(#artery)"
            opacity={pulse ? 0.98 : 0.8}
            transform={`translate(28 0) scale(${pulse ? 1.045 : 1}) translate(${pulse ? -13 : 0} ${pulse ? -14 : 0})`}
          />
        </g>

        {/* ---------- vascular tree ---------- */}
        <g className={`xray__vessels ${lit("vessels") ? "is-lit" : ""}`} filter={lit("vessels") ? "url(#glowHard)" : "url(#glowSoft)"}>
          {[
            "M310 300 v-118",                                  // to head
            "M310 190 q-24 -34 -6 -74",
            "M310 190 q24 -34 6 -74",
            "M310 300 q-64 -74 -96 -96 l-34 176",              // left arm
            "M310 300 q64 -74 96 -96 l34 176",                 // right arm
            "M310 320 q-16 122 -46 226 l-8 216",               // left leg
            "M310 320 q16 122 46 226 l8 216",                  // right leg
            "M310 330 q46 34 34 74 q-12 40 -58 26"             // gut loop
          ].map((d, i) => (
            <path
              key={i}
              d={d}
              fill="none"
              stroke="#4fe3ff"
              strokeWidth={i < 3 ? 3.4 : 4.2}
              strokeLinecap="round"
              opacity={lit("vessels") ? 0.9 : 0.42}
              className="xray__vessel-path"
              style={{ animationDelay: `${i * 0.35}s` }}
            />
          ))}
        </g>

        {/* ---------- travelling capsule / actives ---------- */}
        <g className="xray__travel">
          {stage === 0 && (
            <motion.g
              initial={{ y: -30, opacity: 0 }}
              animate={{ y: 110, opacity: 1 }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeIn" }}
            >
              <rect x="300" y="140" width="20" height="34" rx="10" fill="#ffd9a8" stroke="#ff9b3d" strokeWidth="2" />
            </motion.g>
          )}
          {stage >= 2 &&
            Array.from({ length: 14 }).map((_, i) => (
              <circle key={i} r="4.6" fill={i % 3 === 0 ? "#9dffe4" : "#ff7d9e"} className="xray__cell" style={{ animationDelay: `${i * 0.42}s` }}>
                <animateMotion
                  dur={`${5 + (i % 4)}s`}
                  repeatCount="indefinite"
                  path={
                    [
                      "M310 300 v-118",
                      "M310 300 q-64 -74 -96 -96 l-34 176",
                      "M310 300 q64 -74 96 -96 l34 176",
                      "M310 320 q-16 122 -46 226 l-8 216",
                      "M310 320 q16 122 46 226 l8 216"
                    ][i % 5]
                  }
                  begin={`${i * 0.4}s`}
                />
              </circle>
            ))}
        </g>

        {/* cell-level bloom */}
        {stage === 3 && (
          <g className="xray__bloom">
            {Array.from({ length: 26 }).map((_, i) => {
              const a = (i / 26) * Math.PI * 2;
              const r = 150 + (i % 4) * 52;
              return (
                <circle
                  key={i}
                  cx={310 + Math.cos(a) * r * 0.72}
                  cy={400 + Math.sin(a) * r}
                  r="5"
                  fill="#9dffe4"
                  className="xray__spark"
                  style={{ animationDelay: `${(i % 8) * 0.25}s` }}
                />
              );
            })}
          </g>
        )}
      </svg>

      {/* ---------- stage track ---------- */}
      <div className="xray__track">
        <div className="xray__track-line">
          <span className="xray__track-fill" style={{ width: `${(stage / (journeyStages.length - 1)) * 100}%` }} />
        </div>
        <div className="xray__track-stops">
          {journeyStages.map((s, i) => (
            <button
              key={s.key}
              className={`xray__stop ${i === stage ? "is-active" : ""} ${i < stage ? "is-done" : ""}`}
              onClick={() => onStage(i)}
              aria-label={`Stage ${i + 1}: ${s.label}`}
            >
              <i />
              <span>{s.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
