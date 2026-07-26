"use client";

import { useEffect, useRef, useState } from "react";
import Lenis from "lenis";

/*
 * VELOCE — Tempesta GT
 * Act one: a single 45s film (all six Kling clips joined with crossfades)
 * plays full-screen on arrival. Scroll stays locked until it ends — no play
 * button, no controls. Autoplay starts muted (browser rule); the sound
 * toggle unmutes the film's own soundtrack.
 * Act two: the marque site — story, engineering, gallery, edition,
 * allocation.
 */

const SPECS = [
  { value: "830", unit: "hp", label: "Twin-turbo V8" },
  { value: "2.9", unit: "s", label: "0–100 km/h" },
  { value: "1,380", unit: "kg", label: "Dry weight" },
  { value: "199", unit: "", label: "Pieces, ever" },
];

const ENGINEERING = [
  {
    img: "/veloce/media/rev/frame_100.jpg",
    kicker: "Il cuore",
    title: "A V8 with opinions.",
    body:
      "Four litres, twin turbochargers, a flat-plane crank that revs to 8,400. " +
      "830 horsepower arrives through a titanium exhaust that was tuned like an instrument — " +
      "because it is one. The flames are not a special effect. They are punctuation.",
  },
  {
    img: "/veloce/media/exploded2/frame_060.jpg",
    kicker: "La struttura",
    title: "One piece of carbon. No apologies.",
    body:
      "The monocoque is laid by hand over forty-two hours and cured as a single piece. " +
      "Everything bolts to it — engine, suspension, seats — and nothing flexes. " +
      "1,380 kilograms dry, and every one of them is doing a job.",
  },
  {
    img: "/veloce/media/orbit/frame_045.jpg",
    kicker: "L'aria",
    title: "The wind was consulted.",
    body:
      "Carbon splitter, flat floor, a diffuser that works from 60 km/h. " +
      "The Tempesta does not fight the air — it recruits it. " +
      "Downforce builds quietly until the car feels heavier than physics says it should.",
  },
  {
    img: "/veloce/media/front/frame_050.jpg",
    kicker: "Lo sguardo",
    title: "Light, cut like stone.",
    body:
      "Crystal LED elements with no housings — jewelry that happens to see. " +
      "One thin blade of light across the tail. At night, you will know it from a kilometre away, " +
      "and you will not mistake it for anything else.",
  },
];

const GALLERY = [
  "/veloce/media/hero.jpg",
  "/veloce/media/macro/frame_030.jpg",
  "/veloce/media/orbit/frame_015.jpg",
  "/veloce/media/rev/frame_110.jpg",
  "/veloce/media/exploded2/frame_090.jpg",
  "/veloce/media/front/frame_030.jpg",
];

export default function VeloceSite() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const [locked, setLocked] = useState(true);
  const [progress, setProgress] = useState(0);
  const [soundOn, setSoundOn] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    const root = rootRef.current;
    if (!video || !root) return;

    document.documentElement.classList.add("veloce-html");

    const lenis = new Lenis({ duration: 1.2, smoothWheel: true });
    let raf = 0;
    const tick = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    // ---- the cinema lock: nobody leaves before the credits
    let unlocked = false;
    const unlock = () => {
      if (unlocked) return;
      unlocked = true;
      setLocked(false);
      document.documentElement.classList.remove("vl-locked");
      lenis.start();
    };
    document.documentElement.classList.add("vl-locked");
    lenis.stop();

    video.play().catch(() => unlock()); // autoplay refused → let them in
    video.addEventListener("ended", unlock);
    video.addEventListener("error", unlock);
    const safety = window.setTimeout(unlock, 75_000); // never trap anyone

    const onTime = () => {
      if (video.duration > 0) setProgress(video.currentTime / video.duration);
    };
    video.addEventListener("timeupdate", onTime);

    // ---- reveal-on-scroll for the site below
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("in")),
      { threshold: 0.18 }
    );
    root.querySelectorAll(".rv").forEach((el) => io.observe(el));

    (window as unknown as Record<string, unknown>).__vl = { lenis, video, isLocked: () => !unlocked };

    return () => {
      window.clearTimeout(safety);
      cancelAnimationFrame(raf);
      video.removeEventListener("ended", unlock);
      video.removeEventListener("error", unlock);
      video.removeEventListener("timeupdate", onTime);
      io.disconnect();
      lenis.destroy();
      document.documentElement.classList.remove("veloce-html", "vl-locked");
    };
  }, []);

  return (
    <div ref={rootRef} className="veloce-root">
      <header className="vl-nav">
        <span className="vl-wordmark">VELOCE&nbsp;AUTOMOBILI</span>
        <span className="vl-nav-right">Tempesta&nbsp;GT&nbsp;— MMXXVI</span>
      </header>

      <button
        type="button"
        className={`vl-sound${soundOn ? " on" : ""}`}
        onClick={() => {
          const next = !soundOn;
          setSoundOn(next);
          const v = videoRef.current;
          if (v) {
            v.muted = !next;
            if (next) v.play().catch(() => {});
          }
        }}
      >
        <i /><i /><i /><i />
        <span>{soundOn ? "Sound on" : "Sound off"}</span>
      </button>

      {/* THE FILM — plays once, holds the room */}
      <section className="vl-film">
        <video
          ref={videoRef}
          className="vl-film-video"
          poster="/veloce/media/hero.jpg"
          autoPlay
          muted
          playsInline
          preload="auto"
        >
          <source src="/veloce/film.mp4" type="video/mp4" />
          <source src="/veloce/film.webm" type="video/webm" />
        </video>
        <div className="vl-film-title" aria-hidden>
          <p className="vl-eyebrow">Veloce Automobili presenta</p>
          <h1 className="vl-hero-title">TEMPESTA&nbsp;GT</h1>
          <p className="vl-hero-sub">The storm, held still.</p>
        </div>
        <div className="vl-film-progress" aria-hidden>
          <i style={{ transform: `scaleX(${progress})` }} />
        </div>
        {!locked && (
          <div className="vl-scroll-cue vl-cue-ready"><span /><em>Scroll</em></div>
        )}
      </section>

      {/* THE MARQUE SITE */}
      <main className="vl-site">
        {/* story */}
        <section className="vl-block vl-story">
          <div className="rv">
            <p className="vl-eyebrow">Capitolo I</p>
            <h2 className="vl-serif">Born of Storms</h2>
            <p className="vl-lead">
              On the Adriatic coast, the wind unmakes everything soft. What remains is shape
              without apology. We built one machine from what remained — a grand tourer that
              treats distance as an invitation and weather as company.
            </p>
          </div>
        </section>

        {/* numbers */}
        <section className="vl-block vl-numbers rv">
          {SPECS.map((s) => (
            <div className="vl-spec" key={s.label}>
              <span className="vl-spec-value">{s.value}<em>{s.unit && ` ${s.unit}`}</em></span>
              <span className="vl-spec-label">{s.label}</span>
            </div>
          ))}
        </section>

        {/* engineering — how it works */}
        <section className="vl-block vl-engineering-site">
          <p className="vl-eyebrow rv">Capitolo II — Ingegneria</p>
          <h2 className="vl-serif rv">Assembled from intent.</h2>
          <div className="vl-eng-list">
            {ENGINEERING.map((e, i) => (
              <article className={`vl-eng-row rv${i % 2 ? " flip" : ""}`} key={e.kicker}>
                <div className="vl-eng-img"><img src={e.img} alt={e.title} loading="lazy" /></div>
                <div className="vl-eng-copy">
                  <p className="vl-eyebrow">{e.kicker}</p>
                  <h3 className="vl-serif">{e.title}</h3>
                  <p>{e.body}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* gallery */}
        <section className="vl-block vl-gallery">
          <p className="vl-eyebrow rv">La galleria</p>
          <div className="vl-gallery-grid">
            {GALLERY.map((src) => (
              <figure className="rv" key={src}><img src={src} alt="Tempesta GT" loading="lazy" /></figure>
            ))}
          </div>
        </section>

        {/* edition */}
        <section className="vl-block vl-edition-band rv">
          <p className="vl-eyebrow">L&rsquo;edizione</p>
          <h2 className="vl-serif vl-edition-title">Edition of 199</h2>
          <p className="vl-edition-price">From $420,000</p>
          <p className="vl-edition-note">Each allocation confirmed personally, in Modena.</p>
        </section>

        {/* allocation */}
        <section className="vl-block vl-allocation rv">
          <p className="vl-eyebrow">Configurazione privata</p>
          <h2 className="vl-serif">Request Allocation</h2>
          {sent ? (
            <p className="vl-sent">Received. Our atelier will write to you within 48 hours.</p>
          ) : (
            <form className="vl-form" onSubmit={(e) => { e.preventDefault(); setSent(true); }}>
              <input required type="text" placeholder="Full name" aria-label="Full name" />
              <input required type="email" placeholder="Email" aria-label="Email" />
              <input type="text" placeholder="Country" aria-label="Country" />
              <button type="submit">Begin the Conversation</button>
            </form>
          )}
        </section>

        <footer className="vl-site-footer">
          <span>VELOCE AUTOMOBILI · Modena, Italia</span>
          <span className="vl-fine">A fictional marque. Imagery AI-generated. All figures illustrative.</span>
        </footer>
      </main>
    </div>
  );
}
