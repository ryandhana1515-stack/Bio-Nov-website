"use client";

/**
 * "Inside the body" — the Vitality Explorer, embedded from its published
 * Lovable deployment rather than re-implemented here.
 *
 * WHY AN EMBED AND NOT A PORT. A hand-port of this player was tried first and
 * was rejected: the studio narration became a browser voice, and the shot
 * timing drifted so the footage cut in the wrong places. The player is not
 * really a component — it is a film engine whose clock is driven by the
 * position of a streaming voice, and reproducing that faithfully in a second
 * codebase is a losing game. Embedding the deployment that was actually signed
 * off means the video, the voice, the cuts and the captions are the real ones,
 * and any future edit made in Lovable appears here without a code change.
 *
 * THE TRADE. This section is a separate document, so the page's language
 * switcher does not reach inside it — its text stays English when the rest of
 * the page translates. That is the accepted cost of it being identical.
 *
 * HEIGHT. An iframe cannot size itself to its content. The published page is
 * asked to post its height (see `bionov:height`), and until or unless that
 * arrives the CSS breakpoint heights below are used, set from the real layout:
 * two columns on desktop, stacked on narrow screens.
 */

import { useEffect, useRef, useState } from "react";

const SRC = "https://bionov-vitality-explorer.lovable.app";

/** Only accept height messages from the deployment we actually embedded. */
const ORIGIN = new URL(SRC).origin;

export default function VitalityEmbed() {
  const frameRef = useRef<HTMLIFrameElement>(null);
  const [height, setHeight] = useState<number | null>(null);

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (event.origin !== ORIGIN) return;
      const data = event.data as unknown;
      if (typeof data === "object" && data !== null && "bionovHeight" in data) {
        const next = Number((data as { bionovHeight: unknown }).bionovHeight);
        // Ignore nonsense values so a bad message cannot collapse the section.
        if (Number.isFinite(next) && next > 400 && next < 6000) setHeight(next);
      }
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  return (
    <div className="viz-embed-wrap">
      <div className="viz-embed" style={height ? { height: `${height}px` } : undefined}>
        {/* Sits behind the frame. If the host ever refuses to be embedded, the
            frame renders blank and this is what the visitor sees instead —
            cross-origin means the failure cannot be detected in script, so the
            fallback has to be there from the start rather than swapped in. */}
        <div className="viz-embed-fallback">
          <p>Interactive body visualization</p>
          <a href={SRC} target="_blank" rel="noopener noreferrer">Open the explorer &#8599;</a>
        </div>
        <iframe
          ref={frameRef}
          src={SRC}
          title="BIO N:OV — interactive body visualization"
          loading="lazy"
          allow="autoplay; fullscreen; encrypted-media"
          allowFullScreen
        />
      </div>
      <a className="viz-embed-link" href={SRC} target="_blank" rel="noopener noreferrer">
        Open the full-screen experience &#8599;
      </a>
    </div>
  );
}
