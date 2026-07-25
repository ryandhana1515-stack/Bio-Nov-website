"use client";

/**
 * Procedural stand-ins for the five hero renders.
 *
 * The live site uses photographic/3D renders of the subject. Those files are not
 * in this repo, so each stage falls back to an SVG that carries the same visual
 * beat (portrait -> mesh -> dissolve -> sculpture -> fibre optics). Drop the real
 * artwork into /public/images/nomadatoast/stage-1..5.jpg and it is used instead.
 */

export type Variant = "portrait" | "mesh" | "dissolve" | "sculpture" | "fibers";

// Seeded so server and client render identical markup.
function seeded(seed: number) {
  let s = seed;
  return () => ((s = (s * 1103515245 + 12345) % 2147483648) / 2147483648);
}

const HEAD = "M200 78c66 0 118 60 118 148 0 74-52 136-118 136S82 300 82 226C82 138 134 78 200 78Z";
const BODY = "M62 600c0-118 62-168 138-168s138 50 138 168Z";

const meshDots = (() => {
  const r = seeded(7);
  const out: { x: number; y: number; s: number; o: number }[] = [];
  for (let y = 70; y < 380; y += 13)
    for (let x = 78; x < 326; x += 13)
      out.push({ x: x + r() * 5, y: y + r() * 5, s: 0.7 + r() * 1.1, o: 0.25 + r() * 0.5 });
  return out;
})();

const shards = (() => {
  const r = seeded(23);
  return Array.from({ length: 90 }, () => {
    const t = r();
    return {
      x: 150 + t * 260 + r() * 40,
      y: 90 + r() * 330,
      s: 2 + r() * 12 * (1 - t * 0.5),
      o: 0.15 + r() * 0.7,
      a: r() * 90,
    };
  });
})();

const strands = (() => {
  const r = seeded(41);
  return Array.from({ length: 30 }, (_, i) => {
    const off = i * 11 - 40;
    return {
      d: `M${-60 + off} ${640 + r() * 60} C ${120 + off} ${430 - r() * 90}, ${250 + off} ${300 - r() * 120}, ${430 + off} ${40 + r() * 120}`,
      w: 1.6 + r() * 2.6,
      o: 0.3 + r() * 0.55,
    };
  });
})();

const contours = Array.from({ length: 16 }, (_, i) => ({
  rx: 122 - i * 6.5,
  ry: 152 - i * 8.4,
  o: 0.16 + i * 0.035,
}));

export default function StageVisual({ variant }: { variant: Variant }) {
  return (
    <svg className="nt-stage-svg" viewBox="0 0 400 600" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
      <defs>
        <radialGradient id={`nt-glow-${variant}`} cx="0.5" cy="0.38" r="0.62">
          <stop offset="0" stopColor="#f2f7fc" stopOpacity="0.85" />
          <stop offset="1" stopColor="#7d93ab" stopOpacity="0" />
        </radialGradient>
        <clipPath id={`nt-clip-${variant}`}>
          <path d={HEAD} />
        </clipPath>
        <filter id={`nt-soft-${variant}`}>
          <feGaussianBlur stdDeviation="9" />
        </filter>
      </defs>

      <ellipse cx="200" cy="250" rx="190" ry="250" fill={`url(#nt-glow-${variant})`} />

      {variant !== "fibers" && (
        <g filter={variant === "portrait" ? `url(#nt-soft-${variant})` : undefined}>
          <path d={HEAD} fill="#c3d1de" opacity={variant === "dissolve" ? 0.55 : 0.82} />
          <path d={BODY} fill="#aebecd" opacity={variant === "dissolve" ? 0.4 : 0.66} />
        </g>
      )}

      {variant === "mesh" && (
        <g clipPath={`url(#nt-clip-${variant})`}>
          {meshDots.map((d, i) => (
            <circle key={i} cx={d.x} cy={d.y} r={d.s} fill="#f4f9ff" opacity={d.o} />
          ))}
        </g>
      )}

      {variant === "dissolve" && (
        <>
          <g clipPath={`url(#nt-clip-${variant})`}>
            {meshDots.map((d, i) => (
              <circle key={i} cx={d.x} cy={d.y} r={d.s * 1.1} fill="#eaf3ff" opacity={d.o * 0.9} />
            ))}
          </g>
          {shards.map((s, i) => (
            <rect
              key={i}
              x={s.x}
              y={s.y}
              width={s.s}
              height={s.s}
              fill="#eef5fd"
              opacity={s.o}
              transform={`rotate(${s.a} ${s.x} ${s.y})`}
            />
          ))}
        </>
      )}

      {variant === "sculpture" && (
        <>
          <g clipPath={`url(#nt-clip-${variant})`} stroke="#e8f1fb" fill="none">
            {contours.map((c, i) => (
              <ellipse key={i} cx="200" cy="226" rx={c.rx} ry={c.ry} strokeWidth="1.5" opacity={c.o} />
            ))}
          </g>
          {shards.slice(0, 46).map((s, i) => (
            <rect key={i} x={s.x} y={s.y} width={s.s * 1.3} height={s.s * 1.3} fill="#f0f6fd" opacity={s.o * 0.8} />
          ))}
        </>
      )}

      {(variant === "sculpture" || variant === "fibers") && (
        <g fill="none">
          {strands.slice(0, variant === "fibers" ? 30 : 12).map((s, i) => (
            <g key={i}>
              <path d={s.d} stroke="#dce8f5" strokeWidth={s.w} opacity={s.o} strokeLinecap="round" />
            </g>
          ))}
        </g>
      )}

      {variant === "fibers" &&
        strands.map((s, i) => {
          const x = 430 + i * 11 - 40;
          return <circle key={i} cx={x} cy={60 + (i % 7) * 26} r={2.4} fill="#fff4d8" opacity="0.9" />;
        })}
    </svg>
  );
}
