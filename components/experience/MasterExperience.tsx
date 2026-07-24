"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import { chapters } from "@/lib/content/chapters";
import { ensureGsap, ScrollTrigger } from "@/lib/scroll/gsap";
import { destroyLenis, initLenis } from "@/lib/scroll/lenis";
import { notifyScroll, scrollState } from "@/lib/scroll/state";
import { prefersReducedMotion } from "@/lib/performance/quality";
import { ExperienceContext } from "./context";
import FloatingNavigation from "@/components/navigation/FloatingNavigation";
import InterfaceLines from "./InterfaceLines";
import SceneProgress from "./SceneProgress";
import CustomCursor from "./CustomCursor";
import { StaticCoreFallback } from "@/components/three/SceneCanvas";
import HeroChapter from "@/components/chapters/HeroChapter";
import CuriosityChapter from "@/components/chapters/CuriosityChapter";
import DigitalMindChapter from "@/components/chapters/DigitalMindChapter";
import AIChapter from "@/components/chapters/AIChapter";
import PersonalChapter from "@/components/chapters/PersonalChapter";
import WorldChapter from "@/components/chapters/WorldChapter";
import ProjectsChapter from "@/components/chapters/ProjectsChapter";
import TimelineChapter from "@/components/chapters/TimelineChapter";
import PhilosophyChapter from "@/components/chapters/PhilosophyChapter";
import FutureChapter from "@/components/chapters/FutureChapter";
import ContactChapter from "@/components/chapters/ContactChapter";

const SceneCanvas = dynamic(() => import("@/components/three/SceneCanvas"), {
  ssr: false,
  loading: () => <StaticCoreFallback />,
});

/**
 * The conductor. Owns Lenis, the master ScrollTriggers that translate
 * page scroll into the shared scene timeline, pointer tracking, and the
 * chapter stack. Chapters attach their own scrubbed text timelines.
 */
export default function MasterExperience() {
  const [motionOk, setMotionOk] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setMotionOk(!prefersReducedMotion());
  }, []);

  // master scroll wiring
  useEffect(() => {
    if (!mounted || !motionOk) return;
    ensureGsap();
    const lenis = initLenis();

    const sections = Array.from(
      document.querySelectorAll<HTMLElement>("[data-chapter-index]")
    );
    const triggers: ScrollTrigger[] = sections.map((section) => {
      const idx = Number(section.dataset.chapterIndex);
      const chapter = chapters[idx];
      return ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => {
          scrollState.chapter = idx;
          scrollState.chapterProgress = self.progress;
          scrollState.scene =
            chapter.scene[0] + (chapter.scene[1] - chapter.scene[0]) * self.progress;
          notifyScroll();
        },
      });
    });

    const global = ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => {
        scrollState.progress = self.progress;
        scrollState.velocity = self.getVelocity() / 1000;
        if (self.progress > 0.002) scrollState.hasScrolled = true;
        notifyScroll();
      },
    });

    const onPointer = (e: PointerEvent) => {
      scrollState.pointerX = (e.clientX / window.innerWidth) * 2 - 1;
      scrollState.pointerY = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onPointer, { passive: true });

    ScrollTrigger.refresh();

    return () => {
      window.removeEventListener("pointermove", onPointer);
      triggers.forEach((t) => t.kill());
      global.kill();
      destroyLenis();
      void lenis;
    };
  }, [mounted, motionOk]);

  const ctx = useMemo(() => ({ motionOk: mounted ? motionOk : true }), [mounted, motionOk]);

  return (
    <ExperienceContext.Provider value={ctx}>
      {motionOk && mounted ? <SceneCanvas /> : <StaticCoreFallback />}
      <FloatingNavigation />
      {ctx.motionOk && (
        <>
          <InterfaceLines />
          <SceneProgress />
          <CustomCursor />
        </>
      )}
      <main className="relative z-10" data-motion={ctx.motionOk ? "full" : "static"}>
        <HeroChapter />
        <CuriosityChapter />
        <DigitalMindChapter />
        <AIChapter />
        <PersonalChapter />
        <WorldChapter />
        <ProjectsChapter />
        <TimelineChapter />
        <PhilosophyChapter />
        <FutureChapter />
        <ContactChapter />
      </main>
    </ExperienceContext.Provider>
  );
}
