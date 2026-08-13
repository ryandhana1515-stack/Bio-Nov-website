"use client";

/* Six scenes for "See It Work Inside Your Body" — one per role in the list
 * beside them. Clicking a role swaps the scene, so the picture always shows
 * the thing the words are describing.
 *
 * These are drawn rather than filmed for three reasons that matter here:
 * a rendered clip could not react to which role is selected, it would cost a
 * megabyte per system, and its labels would stay English in every language.
 * Depth comes from offset radial gradients on the cells, cylindrical
 * gradients along the vessels, and a blur-based bloom — the same tricks a
 * medical render uses, kept as vector so they stay sharp at any size.
 */

import { motion, AnimatePresence } from "framer-motion";
import type { ReactElement } from "react";

/* Shared gradients and filters. Rendered once inside every scene's <svg>,
   since defs cannot be referenced across separate SVG roots. */
function SceneDefs() {
  return (
    <defs>
      {/* A sphere reads as a sphere because the highlight sits off-centre. */}
      <radialGradient id="rbc" cx="38%" cy="32%" r="72%">
        <stop offset="0%" stopColor="#ff9d8a" />
        <stop offset="45%" stopColor="#e8443f" />
        <stop offset="100%" stopColor="#7d1418" />
      </radialGradient>
      <radialGradient id="wbc" cx="38%" cy="30%" r="72%">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="50%" stopColor="#d8e6ff" />
        <stop offset="100%" stopColor="#7d97c4" />
      </radialGradient>
      <radialGradient id="noDot" cx="40%" cy="34%" r="70%">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="40%" stopColor="#5fe0ff" />
        <stop offset="100%" stopColor="#0b6f96" />
      </radialGradient>
      <radialGradient id="gold" cx="38%" cy="30%" r="72%">
        <stop offset="0%" stopColor="#fff2cf" />
        <stop offset="45%" stopColor="#ffb545" />
        <stop offset="100%" stopColor="#8a4a06" />
      </radialGradient>

      {/* Cylindrical shading: dark rim, lit centre, dark rim. */}
      <linearGradient id="tube" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#4a1420" />
        <stop offset="18%" stopColor="#c0555c" />
        <stop offset="42%" stopColor="#f0a2a2" />
        <stop offset="62%" stopColor="#b8474f" />
        <stop offset="100%" stopColor="#3d0f1a" />
      </linearGradient>
      <linearGradient id="lumen" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#1d0510" />
        <stop offset="50%" stopColor="#43091c" />
        <stop offset="100%" stopColor="#15040c" />
      </linearGradient>
      <linearGradient id="tissue" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#123a63" />
        <stop offset="100%" stopColor="#0a1f3d" />
      </linearGradient>
      <linearGradient id="fibre" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#5b2030" />
        <stop offset="35%" stopColor="#a8434f" />
        <stop offset="65%" stopColor="#8e3341" />
        <stop offset="100%" stopColor="#4a1826" />
      </linearGradient>

      <filter id="bloom" x="-60%" y="-60%" width="220%" height="220%">
        <feGaussianBlur stdDeviation="7" result="b" />
        <feMerge>
          <feMergeNode in="b" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
      <filter id="soft" x="-40%" y="-40%" width="180%" height="180%">
        <feGaussianBlur stdDeviation="2.6" />
      </filter>
      <filter id="lift" x="-40%" y="-40%" width="180%" height="180%">
        <feDropShadow dx="0" dy="4" stdDeviation="5" floodColor="#02060f" floodOpacity=".65" />
      </filter>
    </defs>
  );
}

/* A red blood cell travelling a path, shrinking as it recedes. The scale
   animation is what sells the depth — a cell that stays the same size reads
   as a flat sprite sliding across a picture. */
function Cell({
  path,
  delay,
  dur = 7,
  fill = "url(#rbc)",
  r = 13,
  near = 1,
  far = 0.42
}: {
  path: string;
  delay: number;
  dur?: number;
  fill?: string;
  r?: number;
  near?: number;
  far?: number;
}) {
  return (
    <g>
      <animateMotion dur={`${dur}s`} begin={`${delay}s`} repeatCount="indefinite" path={path} rotate="auto" />
      <g>
        <animateTransform
          attributeName="transform"
          type="scale"
          dur={`${dur}s`}
          begin={`${delay}s`}
          repeatCount="indefinite"
          values={`${near};${(near + far) / 2};${far}`}
          keyTimes="0;0.5;1"
        />
        <ellipse rx={r} ry={r * 0.66} fill={fill} filter="url(#lift)" />
        <ellipse rx={r * 0.4} ry={r * 0.26} fill="#000" opacity=".22" />
      </g>
    </g>
  );
}

/* ---------------------------------------------------------------- 1 */
function Circulation() {
  const flow = "M 40,330 C 180,300 300,250 400,196 S 570,120 610,104";
  return (
    <svg viewBox="0 0 640 440" role="img" aria-label="A relaxed artery seen in perspective, red blood cells flowing freely as nitric oxide is released from the vessel lining">
      <SceneDefs />
      {/* vessel receding to the upper right: near end tall, far end small */}
      <g className="sc-vessel">
        <path d="M 20,392 C 170,362 296,308 398,252 S 576,166 620,146 L 620,64 C 576,84 494,124 398,178 S 170,268 20,286 Z"
          fill="url(#tube)" opacity=".95" filter="url(#lift)" />
        <path d="M 26,362 C 172,332 296,280 398,224 S 574,140 616,120 L 616,92 C 574,112 494,150 398,204 S 172,296 26,318 Z"
          fill="url(#lumen)" />
        {/* endothelial lining: the thin bright edge where NO is made */}
        <path d="M 26,362 C 172,332 296,280 398,224 S 574,140 616,120" fill="none" stroke="#5fe0ff" strokeWidth="2.4" opacity=".55" />
        <path d="M 26,318 C 172,296 296,248 398,204 S 574,112 616,92" fill="none" stroke="#5fe0ff" strokeWidth="2.4" opacity=".55" />
      </g>

      {/* NO released from the wall, blooming inward */}
      {[0, 1, 2, 3, 4].map(i => (
        <circle key={i} r="6" fill="url(#noDot)" filter="url(#bloom)" cx={90 + i * 118} cy={i % 2 ? 300 - i * 34 : 340 - i * 40}>
          <animate attributeName="opacity" values="0;.95;0" dur="3.4s" begin={`${i * 0.62}s`} repeatCount="indefinite" />
          <animate attributeName="r" values="3;9;3" dur="3.4s" begin={`${i * 0.62}s`} repeatCount="indefinite" />
        </circle>
      ))}

      {[0, 1.4, 2.8, 4.2, 5.6].map((d, i) => (
        <Cell key={i} path={flow} delay={d} dur={7} near={1.05} far={0.4} />
      ))}
    </svg>
  );
}

/* ---------------------------------------------------------------- 2 */
function Vitality() {
  return (
    <svg viewBox="0 0 640 440" role="img" aria-label="Oxygen arriving from a capillary into muscle mitochondria, which brighten as energy is produced">
      <SceneDefs />
      {/* muscle fibre bands, striated */}
      <g opacity=".9">
        <rect x="0" y="96" width="640" height="118" rx="26" fill="url(#fibre)" filter="url(#lift)" />
        <rect x="0" y="252" width="640" height="118" rx="26" fill="url(#fibre)" filter="url(#lift)" opacity=".8" />
        {Array.from({ length: 16 }).map((_, i) => (
          <g key={i} opacity=".24">
            <rect x={18 + i * 39} y="102" width="3" height="106" fill="#ffd9d9" />
            <rect x={18 + i * 39} y="258" width="3" height="106" fill="#ffd9d9" />
          </g>
        ))}
      </g>

      {/* capillary threading between the fibres */}
      <path d="M -10,232 C 140,214 220,250 330,232 S 520,206 650,228" fill="none" stroke="#6b1f2c" strokeWidth="26" strokeLinecap="round" />
      <path d="M -10,232 C 140,214 220,250 330,232 S 520,206 650,228" fill="none" stroke="#2a0812" strokeWidth="17" strokeLinecap="round" />

      {/* mitochondria — capsules with cristae, pulsing as they fire */}
      {[[128, 152], [372, 152], [250, 310], [492, 310]].map(([x, y], i) => (
        <g key={i} className="sc-mito" style={{ animationDelay: `${i * 0.7}s`, transformOrigin: `${x}px ${y}px` }}>
          <rect x={x - 52} y={y - 24} width="104" height="48" rx="24" fill="url(#gold)" filter="url(#bloom)" opacity=".92" />
          {[0, 1, 2, 3].map(c => (
            <path key={c} d={`M ${x - 34 + c * 23},${y - 18} q 12,18 0,36`} fill="none" stroke="#7a3c04" strokeWidth="3.4" opacity=".65" />
          ))}
        </g>
      ))}

      {/* oxygen leaving the capillary and entering the mitochondria */}
      {[0, 1, 2, 3].map(i => (
        <Cell key={i} path="M -20,236 C 150,216 240,248 340,230 S 520,208 660,226" delay={i * 1.6} dur={6.4} fill="url(#noDot)" r={9} near={1} far={0.85} />
      ))}
    </svg>
  );
}

/* ---------------------------------------------------------------- 3 */
function Cognition() {
  const branches = [
    "M 320,392 C 300,330 268,296 226,262 S 168,206 158,158",
    "M 320,392 C 340,330 372,296 414,262 S 472,206 482,158",
    "M 320,392 C 318,320 316,258 318,190",
    "M 226,262 C 196,246 172,232 140,226",
    "M 414,262 C 444,246 468,232 500,226"
  ];
  return (
    <svg viewBox="0 0 640 440" role="img" aria-label="A brain with its blood supply lighting up as pulses travel along the vessels">
      <SceneDefs />
      {/* brain mass */}
      <path d="M 320,54 C 214,54 138,116 138,196 c 0,44 20,78 50,100 -6,36 18,64 58,64 h 148 c 40,0 64,-28 58,-64 30,-22 50,-56 50,-100 C 502,116 426,54 320,54 Z"
        fill="url(#tissue)" stroke="#2f68a8" strokeWidth="2.5" filter="url(#lift)" />
      {/* folds */}
      {[[190, 140, 96], [250, 106, 120], [330, 98, 130], [412, 116, 110], [462, 158, 88]].map(([x, y, w], i) => (
        <path key={i} d={`M ${x},${y} q ${w / 2},34 ${w},0`} fill="none" stroke="#3c7fc9" strokeWidth="3" opacity=".38" />
      ))}

      {/* vasculature with a light pulse running along each branch */}
      {branches.map((d, i) => (
        <g key={i}>
          <path d={d} fill="none" stroke="#8d2b3c" strokeWidth="7" strokeLinecap="round" opacity=".85" />
          <path d={d} fill="none" stroke="#5fe0ff" strokeWidth="4" strokeLinecap="round"
            strokeDasharray="26 300" filter="url(#bloom)" className="sc-pulse"
            style={{ animationDelay: `${i * 0.55}s` }} />
        </g>
      ))}

      {/* the bloom of arrival at the cortex */}
      {[[158, 158], [482, 158], [318, 190]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="12" fill="url(#noDot)" filter="url(#bloom)">
          <animate attributeName="opacity" values=".15;1;.15" dur="3s" begin={`${0.9 + i * 0.55}s`} repeatCount="indefinite" />
          <animate attributeName="r" values="7;20;7" dur="3s" begin={`${0.9 + i * 0.55}s`} repeatCount="indefinite" />
        </circle>
      ))}
    </svg>
  );
}

/* ---------------------------------------------------------------- 4 */
function Metabolic() {
  const cells: [number, number][] = [[96, 118], [212, 92], [330, 116], [452, 96], [548, 128], [140, 340], [268, 356], [396, 338], [520, 352]];
  return (
    <svg viewBox="0 0 640 440" role="img" aria-label="Nutrients crossing a capillary wall into surrounding tissue cells, which brighten as they receive them">
      <SceneDefs />
      {/* tissue cells waiting on both sides */}
      {cells.map(([x, y], i) => (
        <g key={i} className="sc-feed" style={{ animationDelay: `${(i % 5) * 0.8}s`, transformOrigin: `${x}px ${y}px` }}>
          <circle cx={x} cy={y} r="40" fill="url(#tissue)" stroke="#3c7fc9" strokeWidth="2" filter="url(#lift)" />
          <circle cx={x - 8} cy={y - 8} r="13" fill="#5fe0ff" opacity=".28" />
        </g>
      ))}

      {/* the capillary itself */}
      <path d="M -20,236 C 150,206 250,262 380,232 S 540,198 660,224" fill="none" stroke="#a8434f" strokeWidth="46" strokeLinecap="round" filter="url(#lift)" />
      <path d="M -20,236 C 150,206 250,262 380,232 S 540,198 660,224" fill="none" stroke="url(#lumen)" strokeWidth="32" strokeLinecap="round" />

      {/* nutrient particles leaving the capillary and crossing into a cell */}
      {cells.slice(0, 5).map(([x, y], i) => (
        <circle key={i} cx={x} cy="228" r="7" fill="url(#gold)" filter="url(#bloom)">
          <animate attributeName="cy" values={`228;${y + 34}`} dur="4s" begin={`${i * 0.8}s`} repeatCount="indefinite" />
          <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.2;0.75;1" dur="4s" begin={`${i * 0.8}s`} repeatCount="indefinite" />
        </circle>
      ))}

      {[0, 1.5, 3, 4.5].map((d, i) => (
        <Cell key={i} path="M -20,236 C 150,206 250,262 380,232 S 540,198 660,224" delay={d} dur={6} near={1} far={0.9} />
      ))}
    </svg>
  );
}

/* ---------------------------------------------------------------- 5 */
function Immune() {
  const stream = "M -20,300 C 130,268 240,330 380,292 S 540,246 660,282";
  return (
    <svg viewBox="0 0 640 440" role="img" aria-label="A white blood cell travelling the bloodstream to reach a site that needs it">
      <SceneDefs />
      {/* the vessel */}
      <path d={stream} fill="none" stroke="#8e3341" strokeWidth="96" strokeLinecap="round" filter="url(#lift)" opacity=".95" />
      <path d={stream} fill="none" stroke="url(#lumen)" strokeWidth="76" strokeLinecap="round" />
      <path d={stream} fill="none" stroke="#5fe0ff" strokeWidth="1.8" opacity=".3" transform="translate(0,-40)" />
      <path d={stream} fill="none" stroke="#5fe0ff" strokeWidth="1.8" opacity=".3" transform="translate(0,40)" />

      {/* the site under threat, waiting up ahead */}
      <g>
        <circle cx="556" cy="118" r="34" fill="#3b1030" stroke="#ff7ab6" strokeWidth="2.5" filter="url(#lift)" />
        <circle cx="556" cy="118" r="34" fill="none" stroke="#ff7ab6" strokeWidth="2">
          <animate attributeName="r" values="34;54;34" dur="2.6s" repeatCount="indefinite" />
          <animate attributeName="opacity" values=".9;0;.9" dur="2.6s" repeatCount="indefinite" />
        </circle>
      </g>

      {/* red cells in the current */}
      {[0, 1.1, 2.2, 3.3, 4.4].map((d, i) => (
        <Cell key={i} path={stream} delay={d} dur={6.6} r={11} near={1} far={0.9} />
      ))}

      {/* the patrol itself — larger, paler, with a soft irregular edge */}
      <g>
        <animateMotion dur="9s" repeatCount="indefinite" path={stream} />
        <g className="sc-wbc">
          <circle r="27" fill="url(#wbc)" filter="url(#lift)" />
          <circle r="27" fill="none" stroke="#ffffff" strokeWidth="2" opacity=".5" filter="url(#soft)" />
          <circle r="11" cx="-5" cy="-4" fill="#8fb2e8" opacity=".7" />
        </g>
      </g>
    </svg>
  );
}

/* ---------------------------------------------------------------- 6 */
function Ageing() {
  const decades = ["20s", "30s", "40s", "50s", "60+"];
  return (
    <svg viewBox="0 0 640 440" role="img" aria-label="The same vessel across five decades, narrowing as natural nitric oxide production falls">
      <SceneDefs />
      {decades.map((label, i) => {
        const x = 78 + i * 122;
        const wall = 74 - i * 11;      // the vessel closes as the decades pass
        const glow = 0.95 - i * 0.19;  // and the signal fades with it
        return (
          <g key={label}>
            <ellipse cx={x} cy="196" rx={wall / 2 + 16} ry={wall / 2 + 16} fill="url(#tube)" filter="url(#lift)" />
            <ellipse cx={x} cy="196" rx={wall / 2} ry={wall / 2} fill="url(#lumen)" />
            <ellipse cx={x} cy="196" rx={wall / 2} ry={wall / 2} fill="none" stroke="#5fe0ff" strokeWidth="2.4" opacity={glow} />
            <circle cx={x} cy="196" r={wall / 3} fill="url(#noDot)" filter="url(#bloom)" opacity={glow}>
              <animate attributeName="opacity" values={`${glow * 0.35};${glow};${glow * 0.35}`} dur="3.2s" begin={`${i * 0.4}s`} repeatCount="indefinite" />
            </circle>
            <text x={x} y="306" textAnchor="middle" fill="#bcd4ff" fontSize="19" fontWeight="800" letterSpacing="1">{label}</text>
            <rect x={x - 26} y="326" width="52" height="5" rx="2.5" fill="#5fe0ff" opacity={glow} />
          </g>
        );
      })}
      <text x="320" y="382" textAnchor="middle" fill="rgba(190,214,255,.66)" fontSize="15">
        Illustrative. Individual results vary.
      </text>
    </svg>
  );
}

/* Each role can carry a photoreal render as `photo`. When one is present it
   becomes the scene — the drawn version stays as the fallback, so a role
   without a photo yet still shows something rather than an empty frame, and a
   render that fails to fetch at build time never leaves a hole in the page. */
type SceneDef = {
  Scene: () => ReactElement;
  eyebrow: string;
  caption: string;
  photo?: string;
  /** What the render shows, for anyone using a screen reader. */
  alt?: string;
};

const SCENES: Record<string, SceneDef> = {
  "Circulation": {
    Scene: Circulation,
    eyebrow: "Artery · relaxed",
    caption: "Wide open — blood moves freely",
    photo: "scene-circulation.jpg",
    alt: "A relaxed artery cut away, packed with red blood cells, nitric oxide glowing blue along the vessel lining"
  },
  "Vitality & Energy":{ Scene: Vitality,    eyebrow: "Muscle · mitochondria",   caption: "Oxygen arrives — the cell makes energy" },
  "Cognition & Clarity":{ Scene: Cognition, eyebrow: "Brain · blood supply",    caption: "Blood reaches the hungriest organ you own" },
  "Metabolic Support":{ Scene: Metabolic,   caption: "Nutrients cross into the tissue that needs them", eyebrow: "Capillary · exchange" },
  "Immune Function":  { Scene: Immune,      eyebrow: "Bloodstream · patrol",    caption: "Your defences travel by bloodstream" },
  "Healthy Ageing":   { Scene: Ageing,      eyebrow: "The same vessel · five decades", caption: "Production falls with each decade" }
};

/* A photoreal render, treated the way the Blood Flow section treats its own:
   filled to the frame, drifting slowly so it reads as alive rather than as a
   still, with the nitric oxide signal glowing over it and the label in the
   corner. The label is markup, so it translates — the render carries no words
   of its own, which is the whole reason this works in every market. */
function PhotoScene({ photo, alt, caption }: { photo: string; alt: string; caption: string }) {
  return (
    <div className="sysphoto">
      <img className="sysphoto__img" src={`/images/${photo}`} alt={alt} loading="lazy" decoding="async" />
      <span className="sysphoto__vignette" aria-hidden="true" />
      <svg className="sysphoto__no" viewBox="0 0 640 440" aria-hidden="true">
        <defs>
          <radialGradient id="pno" cx="40%" cy="34%" r="70%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="40%" stopColor="#5fe0ff" />
            <stop offset="100%" stopColor="#0b6f96" />
          </radialGradient>
          <filter id="pbloom" x="-70%" y="-70%" width="240%" height="240%">
            <feGaussianBlur stdDeviation="8" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        {[[118, 306], [214, 214], [330, 330], [418, 172], [502, 268], [268, 118]].map(([cx, cy], i) => (
          <circle key={i} cx={cx} cy={cy} r="7" fill="url(#pno)" filter="url(#pbloom)">
            <animate attributeName="opacity" values="0;.9;0" dur="3.6s" begin={`${i * 0.58}s`} repeatCount="indefinite" />
            <animate attributeName="r" values="3;11;3" dur="3.6s" begin={`${i * 0.58}s`} repeatCount="indefinite" />
          </circle>
        ))}
      </svg>
      <span className="sysphoto__chip">{caption}</span>
    </div>
  );
}

const ORDER = Object.keys(SCENES);

export default function SystemScene({ role }: { role: string | null }) {
  const key = role && SCENES[role] ? role : ORDER[0];
  const { Scene, eyebrow, caption, photo, alt } = SCENES[key];

  return (
    <div className="sysscene">
      <span className="sysscene__eyebrow">{eyebrow}</span>

      <div className="sysscene__stage">
        <AnimatePresence mode="wait">
          <motion.div
            key={key}
            className="sysscene__art"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.03 }}
            transition={{ duration: 0.38, ease: "easeOut" }}
          >
            {photo ? <PhotoScene photo={photo} alt={alt ?? caption} caption={caption} /> : <Scene />}
          </motion.div>
        </AnimatePresence>
      </div>

      <AnimatePresence mode="wait">
        <motion.p
          key={key}
          className="sysscene__cap"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3 }}
        >
          {caption}
        </motion.p>
      </AnimatePresence>

      {/* which of the six is showing, and a way to step through them without
          having to go back to the list */}
      <div className="sysscene__dots" aria-hidden="true">
        {ORDER.map(name => <i key={name} className={name === key ? "is-on" : ""} />)}
      </div>
    </div>
  );
}
