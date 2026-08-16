"use client";

/**
 * Embeds a published Lovable deployment as a section of this page.
 *
 * WHY EMBED RATHER THAN PORT. These sections are film engines, not components:
 * their clocks are driven by the read position of a streaming voice, and their
 * footage is hundreds of megabytes hosted elsewhere. A hand-port of the first
 * one was tried and rejected — the studio narration became a browser voice and
 * the shot timing drifted, so the video cut in the wrong places. Embedding the
 * deployment that was actually signed off means the video, the voice, the cuts
 * and the captions are the real ones, and any later edit made in Lovable
 * appears here with no code change.
 *
 * THE TRADE. An embedded document is a separate page, so the site's language
 * switcher does not reach inside it — embedded sections stay English while the
 * rest of the page translates. That is the accepted cost of being identical.
 *
 * HEIGHT. An iframe cannot size itself to its content. Each embedded page is
 * asked to post its height as `bionovHeight`; until that arrives the CSS
 * fallback height for the given `size` applies.
 */

import { useEffect, useState } from "react";

type Props = {
  /** Published deployment URL, e.g. https://name.lovable.app */
  src: string;
  /** Accessible frame title, and the label on the fallback link. */
  title: string;
  /**
   * Fallback height profile while no height message has arrived.
   * "tall" suits a two-column player, "atlas" a list beside a figure.
   */
  size?: "tall" | "atlas";
};

export default function LovableEmbed({ src, title, size = "tall" }: Props) {
  const [height, setHeight] = useState<number | null>(null);
  const origin = new URL(src).origin;

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (event.origin !== origin) return;
      const data = event.data as unknown;
      if (typeof data === "object" && data !== null && "bionovHeight" in data) {
        const next = Number((data as { bionovHeight: unknown }).bionovHeight);
        // Ignore nonsense so a bad message cannot collapse the section.
        if (Number.isFinite(next) && next > 400 && next < 6000) setHeight(next);
      }
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [origin]);

  return (
    <div className="viz-embed-wrap">
      <div
        className={`viz-embed viz-embed--${size}`}
        style={height ? { height: `${height}px` } : undefined}
      >
        {/* Sits behind the frame. Cross-origin means a refusal to be embedded
            cannot be detected in script, so the fallback has to be present from
            the start rather than swapped in on an error that never fires. */}
        <div className="viz-embed-fallback">
          <p>{title}</p>
          <a href={src} target="_blank" rel="noopener noreferrer">Open it &#8599;</a>
        </div>
        <iframe
          src={src}
          title={title}
          loading="lazy"
          allow="autoplay; fullscreen; encrypted-media"
          allowFullScreen
        />
      </div>
      <a className="viz-embed-link" href={src} target="_blank" rel="noopener noreferrer">
        Open the full-screen experience &#8599;
      </a>
    </div>
  );
}
