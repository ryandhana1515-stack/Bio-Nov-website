"use client";

import { useEffect, useRef } from "react";
import { SequenceLoader } from "@/lib/sequences/loader";
import { sequences } from "@/lib/sequences/manifest";

type Props = {
  sequenceId: string;
  /** returns current progress 0..1 — sampled every animation frame */
  getProgress: () => number;
  className?: string;
  tier?: "high" | "medium" | "low";
};

/**
 * Scroll-scrubbed image-sequence player. Progress selects the frame:
 * nothing autoplays, reversing scroll reverses the sequence, and when
 * scrolling stops the image simply holds. Renders the poster until frames
 * exist, and degrades to nothing if the sequence has not been generated.
 */
export default function SequenceCanvas({ sequenceId, getProgress, className, tier = "high" }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const meta = sequences[sequenceId];
    const canvas = canvasRef.current;
    if (!meta || !canvas) return;

    const loader = new SequenceLoader(meta, tier);
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let lastDrawn = -1;
    const poster = meta.poster ? new Image() : null;
    if (poster && meta.poster) poster.src = meta.poster;
    if (loader.ready) loader.warm();

    const draw = () => {
      raf = requestAnimationFrame(draw);
      const progress = Math.max(0, Math.min(1, getProgress()));
      const frameIndex = progress * Math.max(0, meta.frameCount - 1);
      loader.focus(Math.round(frameIndex));
      const img = loader.frameAt(frameIndex) ?? (poster?.complete ? poster : null);
      if (!img) return;
      const key = frameIndex | 0;
      if (key === lastDrawn && img !== poster) return;
      lastDrawn = key;

      const cw = canvas.clientWidth;
      const ch = canvas.clientHeight;
      if (canvas.width !== cw || canvas.height !== ch) {
        canvas.width = cw;
        canvas.height = ch;
      }
      // cover-fit while preserving aspect ratio
      const scale = Math.max(cw / img.width, ch / img.height);
      const w = img.width * scale;
      const h = img.height * scale;
      ctx.clearRect(0, 0, cw, ch);
      ctx.drawImage(img, (cw - w) / 2, (ch - h) / 2, w, h);
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      loader.destroy();
    };
  }, [sequenceId, getProgress, tier]);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
}
