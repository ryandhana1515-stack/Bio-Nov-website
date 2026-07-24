"use client";

import { useEffect, useRef } from "react";
import { createScrubTimeline, gsap } from "./gsap";
import { useExperience } from "@/components/experience/context";

/**
 * Attach a scrubbed GSAP timeline to a chapter <section>. The build
 * callback must be referentially stable (wrap in useCallback). With
 * reduced motion the timeline is skipped entirely and content renders
 * in normal document flow.
 */
export function useChapterTimeline<T extends HTMLElement = HTMLElement>(
  build: (tl: gsap.core.Timeline, section: T) => void
) {
  const ref = useRef<T | null>(null);
  const { motionOk } = useExperience();

  useEffect(() => {
    const section = ref.current;
    if (!motionOk || !section) return;
    const tl = createScrubTimeline(section, (t) => build(t, section));
    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, [motionOk, build]);

  return ref;
}
