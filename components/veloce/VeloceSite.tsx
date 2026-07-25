"use client";

import { useEffect, useRef, useState } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TempestaScene } from "./TempestaScene";

const MACRO_CAPTIONS = [
  ["Light, cut like stone.", "Nine crystal elements. No housings. Jewelry that happens to see."],
  ["The mark of the storm.", "One badge, milled from a single gram of 18-karat gold."],
  ["Gold, where it counts.", "Monobloc calipers, six pistons, finished by hand in Modena."],
  ["Carbon, laid by hand.", "Forty-two hours of weave beneath eleven coats of lacquer."],
  ["The last thing most will see.", "A single blade of light, edge to edge."],
];

const SPECS = [
  { value: "830", unit: "hp", label: "Twin-turbo V8" },
  { value: "2.9", unit: "s", label: "0–100 km/h" },
  { value: "1,380", unit: "kg", label: "Dry weight" },
  { value: "1", unit: "piece", label: "Carbon monocoque" },
];

export default function VeloceSite() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const [macroIdx, setMacroIdx] = useState(0);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const root = rootRef.current;
    if (!canvas || !root) return;

    document.documentElement.classList.add("veloce-html");
    const scene = new TempestaScene(canvas);

    gsap.registerPlugin(ScrollTrigger);
    const lenis = new Lenis({ duration: 1.35, smoothWheel: true });
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    const q = (sel: string) => root.querySelector(sel) as HTMLElement;
    const triggers: ScrollTrigger[] = [];
    const tweens: gsap.core.Tween[] = [];

    // ---- scene phase drivers: one trigger per act
    const phases = [".vl-hero", ".vl-storms", ".vl-macro", ".vl-engineering", ".vl-edition", ".vl-cta"];
    phases.forEach((sel, i) => {
      triggers.push(
        ScrollTrigger.create({
          trigger: q(sel),
          start: i === 0 ? "top top" : "top 60%",
          end: i === phases.length - 1 ? "bottom bottom" : "bottom 60%",
          onUpdate: (self) => scene.setPhase(i, self.progress),
        })
      );
    });

    // ---- hero: marque tracks in, then title recedes as the orbit continues
    tweens.push(
      gsap.fromTo(".vl-hero-title",
        { letterSpacing: "0.3em", opacity: 0.25 },
        {
          letterSpacing: "0.06em", opacity: 1, ease: "none",
          scrollTrigger: { trigger: q(".vl-hero"), start: "top top", end: "22% top", scrub: true },
        })
    );
    tweens.push(
      gsap.to(".vl-hero-stage", {
        opacity: 0, y: -60, ease: "none",
        scrollTrigger: { trigger: q(".vl-hero"), start: "38% top", end: "62% top", scrub: true },
      })
    );

    // ---- storms: lines surface one by one
    gsap.utils.toArray<HTMLElement>(".vl-storm-line").forEach((line, i) => {
      tweens.push(
        gsap.fromTo(line, { yPercent: 120, opacity: 0 }, {
          yPercent: 0, opacity: 1, ease: "none",
          scrollTrigger: {
            trigger: q(".vl-storms"),
            start: `${8 + i * 16}% bottom`, end: `${30 + i * 16}% bottom`, scrub: true,
          },
        })
      );
    });

    // ---- macro captions
    triggers.push(
      ScrollTrigger.create({
        trigger: q(".vl-macro"),
        start: "top 60%", end: "bottom 60%",
        onUpdate: (self) =>
          setMacroIdx(Math.min(MACRO_CAPTIONS.length - 1, Math.floor(self.progress * MACRO_CAPTIONS.length))),
      })
    );

    // ---- engineering: spec callouts land as the car assembles
    gsap.utils.toArray<HTMLElement>(".vl-spec").forEach((el, i) => {
      tweens.push(
        gsap.fromTo(el, { opacity: 0, y: 40 }, {
          opacity: 1, y: 0, ease: "none",
          scrollTrigger: {
            trigger: q(".vl-engineering"),
            start: `${12 + i * 15}% bottom`, end: `${26 + i * 15}% bottom`, scrub: true,
          },
        })
      );
    });

    // ---- edition: price reveal
    tweens.push(
      gsap.fromTo(".vl-edition-stage", { opacity: 0, scale: 0.94 }, {
        opacity: 1, scale: 1, ease: "none",
        scrollTrigger: { trigger: q(".vl-edition"), start: "top 70%", end: "45% 50%", scrub: true },
      })
    );

    // ---- cta reveal
    tweens.push(
      gsap.fromTo(".vl-cta-stage", { opacity: 0, y: 60 }, {
        opacity: 1, y: 0, ease: "none",
        scrollTrigger: { trigger: q(".vl-cta"), start: "top 75%", end: "40% 55%", scrub: true },
      })
    );

    const onResize = () => scene.resize();
    window.addEventListener("resize", onResize);
    ScrollTrigger.refresh();
    (window as unknown as Record<string, unknown>).__vl = { lenis, scene };

    return () => {
      window.removeEventListener("resize", onResize);
      tweens.forEach((t) => t.scrollTrigger?.kill());
      tweens.forEach((t) => t.kill());
      triggers.forEach((t) => t.kill());
      gsap.ticker.remove(tick);
      lenis.destroy();
      scene.dispose();
      document.documentElement.classList.remove("veloce-html");
    };
  }, []);

  return (
    <div ref={rootRef} className="veloce-root">
      <canvas ref={canvasRef} className="vl-canvas" aria-hidden />

      <header className="vl-nav">
        <span className="vl-wordmark">VELOCE&nbsp;AUTOMOBILI</span>
        <span className="vl-nav-right">Tempesta&nbsp;GT&nbsp;— MMXXVI</span>
      </header>

      {/* ACT I — HERO ORBIT */}
      <section className="vl-hero">
        <div className="vl-sticky vl-hero-stage">
          <p className="vl-eyebrow">Veloce Automobili presenta</p>
          <h1 className="vl-hero-title">TEMPESTA&nbsp;GT</h1>
          <p className="vl-hero-sub">The storm, held still.</p>
          <div className="vl-scroll-cue"><span /><em>Scroll</em></div>
        </div>
      </section>

      {/* ACT II — BORN OF STORMS */}
      <section className="vl-storms">
        <div className="vl-sticky vl-storms-stage">
          <p className="vl-eyebrow">Capitolo I</p>
          <h2 className="vl-serif">Born of Storms</h2>
          <div className="vl-storm-lines">
            {[
              "On the Adriatic coast, the wind unmakes everything soft.",
              "What remains is shape without apology.",
              "We built one machine from what remained.",
            ].map((l) => (
              <div className="vl-line-mask" key={l}><p className="vl-storm-line">{l}</p></div>
            ))}
          </div>
        </div>
      </section>

      {/* ACT III — MACRO */}
      <section className="vl-macro">
        <div className="vl-sticky vl-macro-stage">
          <p className="vl-eyebrow">Capitolo II — Dettagli</p>
          <div className="vl-caption" key={macroIdx}>
            <h3 className="vl-serif">{MACRO_CAPTIONS[macroIdx][0]}</h3>
            <p>{MACRO_CAPTIONS[macroIdx][1]}</p>
          </div>
          <div className="vl-caption-index">
            {MACRO_CAPTIONS.map((_, i) => (
              <i key={i} className={i === macroIdx ? "on" : ""} />
            ))}
          </div>
        </div>
      </section>

      {/* ACT IV — ENGINEERING / EXPLODED */}
      <section className="vl-engineering">
        <div className="vl-sticky vl-eng-stage">
          <p className="vl-eyebrow">Capitolo III — Ingegneria</p>
          <h2 className="vl-serif vl-eng-title">Assembled from intent.</h2>
          <div className="vl-specs">
            {SPECS.map((s) => (
              <div className="vl-spec" key={s.label}>
                <span className="vl-spec-value">{s.value}<em>{s.unit === "piece" ? "" : ` ${s.unit}`}</em></span>
                <span className="vl-spec-label">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ACT V — EDITION */}
      <section className="vl-edition">
        <div className="vl-sticky vl-edition-stage">
          <p className="vl-eyebrow">L&rsquo;edizione</p>
          <h2 className="vl-serif vl-edition-title">Edition of 199</h2>
          <p className="vl-edition-price">From $420,000</p>
          <p className="vl-edition-note">Each allocation confirmed personally, in Modena.</p>
        </div>
      </section>

      {/* ACT VI — CTA */}
      <section className="vl-cta">
        <div className="vl-sticky vl-cta-stage">
          <p className="vl-eyebrow">Configurazione privata</p>
          <h2 className="vl-serif">Request Allocation</h2>
          {sent ? (
            <p className="vl-sent">Received. Our atelier will write to you within 48 hours.</p>
          ) : (
            <form
              className="vl-form"
              onSubmit={(e) => { e.preventDefault(); setSent(true); }}
            >
              <input required type="text" placeholder="Full name" aria-label="Full name" />
              <input required type="email" placeholder="Email" aria-label="Email" />
              <input type="text" placeholder="Country" aria-label="Country" />
              <button type="submit">Begin the Conversation</button>
            </form>
          )}
          <footer className="vl-footer">
            <span>VELOCE AUTOMOBILI · Modena, Italia</span>
            <span className="vl-fine">A fictional marque, rendered in real time. All figures illustrative.</span>
          </footer>
        </div>
      </section>
    </div>
  );
}
