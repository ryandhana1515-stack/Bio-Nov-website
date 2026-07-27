"use client";

import { useEffect, useRef, useState } from "react";
import { Activity, Brain, Heart, Sparkles } from "lucide-react";

/* Scroll-driven stages. Copy per Ryan's direction (Lovable version).
   Figures are manufacturer laboratory data — labelled as such on the page. */
const STAGES = [
  { at: 0.18, Icon: Heart, title: "Blood Pressure Controlled", desc: "Vessels relax — pressure drops within 30 minutes.", side: "left", top: "30%" },
  { at: 0.42, Icon: Brain, title: "Brain Clarity", desc: "Oxygen-rich blood floods cognitive pathways.", side: "right", top: "12%" },
  { at: 0.66, Icon: Activity, title: "Muscle Vigor", desc: "More O₂ delivered. Endurance and recovery boosted.", side: "left", top: "56%" },
  { at: 0.88, Icon: Sparkles, title: "Skin Renewal", desc: "Microcirculation revives glow and elasticity.", side: "right", top: "76%" }
] as const;

const TRACK = ["Mouth", "Stomach", "Bloodstream", "Cells"];

export default function XrayJourney({ videoSrc }: { videoSrc?: string }) {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [progress, setProgress] = useState(0);
  const [hasVideo, setHasVideo] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect();
        const total = rect.height - window.innerHeight;
        const p = total > 0 ? Math.max(0, Math.min(1, -rect.top / total)) : 0;
        setProgress(p);

        // Scrub the video frame-by-frame with scroll position
        const vid = videoRef.current;
        if (vid && vid.duration && !Number.isNaN(vid.duration)) {
          vid.currentTime = p * vid.duration * 0.999;
        }
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);


  return (
    <section ref={sectionRef} id="journey" className="journey-section">
      <div className="journey-sticky">
        <video
            ref={videoRef}
            src={videoSrc}
            poster="/video/xray-journey-poster.jpg"
            muted
            playsInline
            preload="auto"
            className="journey-video"
          onLoadedMetadata={() => setHasVideo(true)}
        />

        {/* cinematic grade */}
        <div className="journey-vignette" />
        <div className="journey-grid" />

        {/* scanline follows scroll */}
        <div className="journey-scanline" style={{ top: `${10 + progress * 80}%` }} />

        {/* header */}
        <div className="journey-head">
          <span className="journey-kicker">X-Ray Vision</span>
          <h2>
            See It Work <span>Inside Your Body.</span>
          </h2>
          <p>Scroll to follow a single capsule from your mouth to every cell.</p>
        </div>

        {/* stage callouts */}
        {STAGES.map((s, i) => {
          const active = progress >= s.at;
          const visible = progress >= s.at - 0.06;
          return (
            <div
              key={s.title}
              className={`journey-stage journey-stage--${s.side} ${visible ? "is-visible" : ""} ${active ? "is-active" : ""}`}
              style={{ top: s.top }}
            >
              <div className="journey-stage__row">
                <span className="journey-stage__icon">
                  <s.Icon size={22} />
                </span>
                <i className="journey-stage__rule" />
              </div>
              <b>{s.title}</b>
              <p>{s.desc}</p>
              <span className="journey-stage__no">STAGE 0{i + 1}</span>
            </div>
          );
        })}

        {/* progress track */}
        <div className="journey-track">
          <div className="journey-track__labels">
            {TRACK.map((t) => (
              <span key={t}>{t}</span>
            ))}
          </div>
          <div className="journey-track__line">
            <span className="journey-track__fill" style={{ width: `${progress * 100}%` }} />
            <span className="journey-track__dot" style={{ left: `${progress * 100}%` }} />
          </div>
          <div className="journey-track__note">
            {hasVideo ? "Scroll to scrub" : "Scroll to follow the journey"}
          </div>
        </div>
      </div>
    </section>
  );
}
