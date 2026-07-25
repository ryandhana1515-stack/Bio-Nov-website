/* AURUM & NOIR — Eclipse
   Lenis smooth scroll + GSAP ScrollTrigger + canvas frame-sequence scrubbing. */

(function () {
  'use strict';

  gsap.registerPlugin(ScrollTrigger);

  const SEQ = {
    hero:     { dir: 'frames/hero',     count: 160, canvas: 'heroCanvas' },
    macro:    { dir: 'frames/macro',    count: 120, canvas: 'macroCanvas' },
    exploded: { dir: 'frames/exploded', count: 140, canvas: 'explodedCanvas' },
  };
  const FW = 1600, FH = 900;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- frame sequences ---------- */
  function makeSequence(cfg) {
    const canvas = document.getElementById(cfg.canvas);
    const ctx = canvas.getContext('2d');
    const images = new Array(cfg.count);
    let loaded = 0, current = -1, pending = -1;

    const src = (i) => `${cfg.dir}/f${String(i).padStart(4, '0')}.jpg`;

    function size() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = canvas.clientWidth, h = canvas.clientHeight;
      if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
        canvas.width = w * dpr; canvas.height = h * dpr;
        current = -1; // force redraw
      }
    }

    function draw(i) {
      const img = images[i];
      if (!img || !img.complete) { pending = i; return; }
      if (i === current) return;
      size();
      // cover fit
      const cw = canvas.width, ch = canvas.height;
      const s = Math.max(cw / FW, ch / FH);
      const dw = FW * s, dh = FH * s;
      ctx.drawImage(img, (cw - dw) / 2, (ch - dh) / 2, dw, dh);
      current = i; pending = -1;
    }

    function load(onProgress) {
      return new Promise((resolve) => {
        for (let i = 0; i < cfg.count; i++) {
          const img = new Image();
          img.onload = img.onerror = () => {
            loaded++;
            if (onProgress) onProgress(loaded / cfg.count);
            if (pending === i) draw(i);
            if (loaded === cfg.count) resolve();
          };
          img.src = src(i);
          images[i] = img;
        }
      });
    }

    window.addEventListener('resize', () => { size(); const c = current; current = -1; if (c >= 0) draw(c); });
    return { draw, load, count: cfg.count, canvas };
  }

  const hero = makeSequence(SEQ.hero);
  const macro = makeSequence(SEQ.macro);
  const exploded = makeSequence(SEQ.exploded);

  /* ---------- loader: hero first, then the rest in the background ---------- */
  const loaderEl = document.getElementById('loader');
  const fillEl = document.getElementById('loaderFill');

  hero.load((p) => { fillEl.style.width = Math.round(p * 100) + '%'; }).then(() => {
    hero.draw(0);
    loaderEl.classList.add('done');
    introTimeline();
    macro.load().then(() => macro.draw(0));
    exploded.load().then(() => exploded.draw(0));
  });

  /* ---------- Lenis smooth scroll, driven by GSAP's ticker ---------- */
  const lenis = new Lenis({
    duration: 1.35,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
  });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      e.preventDefault();
      lenis.scrollTo(a.getAttribute('href'), { duration: 2.2 });
    });
  });

  /* ---------- intro: brand letters track in ---------- */
  function introTimeline() {
    const letters = document.querySelectorAll('.hero-title span');
    if (reduceMotion) { gsap.set(letters, { opacity: 1 }); return; }
    gsap.timeline()
      .fromTo(letters,
        { opacity: 0, x: (i, el, arr) => (i - (arr.length - 1) / 2) * 130, filter: 'blur(14px)' },
        { opacity: 1, x: 0, filter: 'blur(0px)', duration: 2.2, ease: 'power3.out', stagger: { each: 0.06, from: 'center' } })
      .fromTo('.hero-sub', { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 1.4, ease: 'power2.out' }, '-=1.2');
  }

  /* ---------- scrub helper ---------- */
  function scrub(sectionSel, seq, lengthPct, onUpdate) {
    const proxy = { frame: 0 };
    ScrollTrigger.create({
      trigger: sectionSel,
      start: 'top top',
      end: '+=' + lengthPct + '%',
      pin: sectionSel + ' .pin-frame',
      pinSpacing: true,
      scrub: reduceMotion ? false : 0.6,
      onUpdate(self) {
        const i = Math.min(seq.count - 1, Math.round(self.progress * (seq.count - 1)));
        if (i !== proxy.frame || i === 0) { proxy.frame = i; seq.draw(i); }
        if (onUpdate) onUpdate(self.progress);
      },
      onRefresh(self) { seq.draw(Math.min(seq.count - 1, Math.round(self.progress * (seq.count - 1)))); },
    });
  }

  /* ---------- 1 · HERO: 360° orbit ---------- */
  scrub('#hero', hero, 350, (p) => {
    // title recedes as the orbit begins
    gsap.set('.hero-copy', {
      opacity: 1 - Math.min(1, p * 3.2),
      y: p * -140,
      scale: 1 + p * 0.12,
    });
    setWindow('.hero-line-1', p, 0.22, 0.46);
    setWindow('.hero-line-2', p, 0.56, 0.82);
  });

  /* ---------- 3 · MACRO: dial fly-through ---------- */
  scrub('#macro', macro, 320, (p) => {
    setWindow('.macro-caption-1', p, 0.05, 0.30);
    setWindow('.macro-caption-2', p, 0.38, 0.62);
    setWindow('.macro-caption-3', p, 0.72, 0.96);
  });

  /* ---------- 4 · EXPLODED: assembly + spec callouts ---------- */
  scrub('#engineering', exploded, 340, (p) => {
    setWindow('.exploded-kicker', p, 0.02, 0.24);
    setWindow('.spec-1', p, 0.16, 0.44);
    setWindow('.spec-2', p, 0.42, 0.70);
    setWindow('.spec-3', p, 0.68, 0.97);
  });

  /* fade a pinned overlay in and out inside a progress window */
  function setWindow(sel, p, a, b) {
    const el = document.querySelector(sel);
    if (!el) return;
    const fade = 0.28 * (b - a);
    let o = 0;
    if (p >= a && p <= b) {
      o = Math.min(1, (p - a) / fade, (b - p) / fade);
    }
    const dir = el.classList.contains('macro-caption-2') || el.classList.contains('spec-2') ? -1 : 1;
    gsap.set(el, { opacity: o, y: (1 - o) * 26 * dir, x: 0 });
  }

  /* ---------- pinned-section text is above; simple reveals elsewhere ---------- */
  document.querySelectorAll('.reveal').forEach((el) => {
    gsap.fromTo(el,
      { opacity: 0, y: 46 },
      {
        opacity: 1, y: 0, duration: reduceMotion ? 0 : 1.6, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 82%', once: true },
      });
  });

  /* ---------- waitlist ---------- */
  document.getElementById('waitlistForm').addEventListener('submit', (e) => {
    e.preventDefault();
    e.target.style.display = 'none';
    document.getElementById('waitlistDone').style.display = 'block';
  });

  /* keep ScrollTrigger measurements honest once media settles */
  window.addEventListener('load', () => ScrollTrigger.refresh());
})();
