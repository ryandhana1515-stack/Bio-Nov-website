"use client";

/*
 * TempestaFrames — cinematic scroll engine driven by real Kling-generated
 * footage, extracted to JPEG frame sequences under /veloce/media.
 *
 * Acts (phase → visual):
 *   0 hero        wrap-tear reveal sequence, scrubbed by scroll
 *   1 storms      hero still, slow push-in
 *   2 orbit       360° turntable sequence, scrubbed
 *   3 front       head-on approach diving into the headlight, scrubbed + audio
 *   4 macro       macro fly-through sequence, scrubbed
 *   5 rev         rear view, V8 revs with exhaust flames + smoke, scrubbed + audio
 *   6 engineering exploded-assembly (engine glowing, fire) scrubbed + audio,
 *                 spec callouts on top
 *   7 edition     hero still, slow pull-back
 *   8 cta         wrapped still, deep darken — the next one waits
 *
 * Acts with an audio name play their Kling-generated soundtrack (looped,
 * volume-crossfaded per act) once the visitor enables sound.
 */

const MEDIA = "/veloce/media";

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const easeInOut = (t: number) => t * t * (3 - 2 * t);

interface Sequence {
  images: (HTMLImageElement | undefined)[];
  count: number;
  loaded: number;
  requested: Set<number>;
}

interface Visual {
  kind: "seq" | "still";
  seq?: string;
  still?: string;
  // ken burns for stills: [scaleFrom, scaleTo, panX, panY], pan in canvas fractions
  kb?: [number, number, number, number];
  darken: number;
  audio?: string;
  reverse?: boolean;
  range?: [number, number]; // scrub only a slice of the sequence
}

/* every act is live footage — stills remain only as loading fallbacks */
const VISUALS: Visual[] = [
  { kind: "seq", seq: "wrap", darken: 0.12 },
  { kind: "seq", seq: "macro", range: [0, 0.18], darken: 0.45 },        // storms: slow creep in the dark
  { kind: "seq", seq: "orbit", darken: 0.1 },
  { kind: "seq", seq: "front", darken: 0.08, audio: "front" },
  { kind: "seq", seq: "macro", range: [0.2, 1], darken: 0.08 },
  { kind: "seq", seq: "rev", darken: 0.1, audio: "rev" },
  { kind: "seq", seq: "exploded2", darken: 0.28, audio: "exploded2" },
  { kind: "seq", seq: "orbit", reverse: true, range: [0.3, 0.75], darken: 0.3 }, // edition: slow counter-turn
  { kind: "seq", seq: "wrap", reverse: true, darken: 0.45 },            // cta: the cover returns
];

export class TempestaFrames {
  phase = 0;
  phaseT = 0;
  onProgress?: (pct: number) => void;
  soundEnabled = false;
  private audios = new Map<string, HTMLAudioElement>();

  private ctx: CanvasRenderingContext2D;
  private seqs = new Map<string, Sequence>();
  private stills = new Map<string, HTMLImageElement>();
  private raf = 0;
  private disposed = false;
  private curT = 0; // damped scrub position within act
  private lastTime = 0;
  // crossfade state
  private fade = 1;
  private prevVisual = 0;
  private curVisual = 0;
  private vignette: { w: number; h: number; grad: CanvasGradient } | null = null;

  constructor(private canvas: HTMLCanvasElement) {
    this.ctx = canvas.getContext("2d")!;
    this.resize();
    this.boot();
    this.lastTime = performance.now();
    this.loop(this.lastTime);
  }

  /* ------------------------------------------------------------ loading */
  private async boot() {
    // stills first — they are the instant fallback for every act
    await Promise.all(
      ["hero", "hero-wrapped"].map(
        (n) =>
          new Promise<void>((res) => {
            const img = new Image();
            img.onload = () => { this.stills.set(n, img); res(); };
            img.onerror = () => res();
            img.src = `${MEDIA}/${n}.jpg`;
          })
      )
    );

    let counts: Record<string, number> = {};
    try {
      counts = await (await fetch(`${MEDIA}/frames.json`)).json();
    } catch {
      counts = {};
    }
    for (const [name, count] of Object.entries(counts)) {
      this.seqs.set(name, { images: new Array(count), count, loaded: 0, requested: new Set() });
    }
    // per-act Kling soundtracks (only for acts that declare one)
    for (const v of VISUALS) {
      if (!v.audio || this.audios.has(v.audio)) continue;
      const a = new Audio(`${MEDIA}/${v.audio}.m4a`);
      a.loop = true;
      a.preload = "auto";
      a.volume = 0;
      this.audios.set(v.audio, a);
    }

    // priority: strictly in the order the visitor meets the footage.
    // storms (act 1) scrubs the head of the macro sequence, so that slice
    // loads immediately after the wrap reveal — no still-image fallback.
    const macroCount = this.seqs.get("macro")?.count ?? 0;
    const stormsSlice = Math.min(macroCount, Math.ceil(macroCount * 0.18) + 4);
    const queue: [string, number, number][] = [
      ["wrap", 0, Infinity],
      ["macro", 0, stormsSlice],
      ["orbit", 0, Infinity],
      ["front", 0, Infinity],
      ["macro", stormsSlice, Infinity],
      ["rev", 0, Infinity],
      ["exploded2", 0, Infinity],
    ];
    for (const [name, from, to] of queue) {
      if (!this.seqs.has(name)) continue;
      await this.loadRange(name, from, to);
    }
  }

  setSound(on: boolean) {
    this.soundEnabled = on;
    if (!on) {
      for (const a of this.audios.values()) {
        a.volume = 0;
        a.pause();
      }
    }
  }

  private async loadRange(name: string, from: number, to: number) {
    const seq = this.seqs.get(name)!;
    const end = Math.min(seq.count, to);
    const batch = 6;
    for (let i = from; i < end && !this.disposed; i += batch) {
      const jobs: Promise<void>[] = [];
      for (let idx = i; idx < Math.min(i + batch, end); idx++) {
        if (seq.requested.has(idx)) continue;
        seq.requested.add(idx);
        jobs.push(
          (async () => {
            const img = new Image();
            img.src = `${MEDIA}/${name}/frame_${String(idx + 1).padStart(3, "0")}.jpg`;
            try {
              // decode() finishes the JPEG off the render path, so drawing a
              // freshly arrived frame never stalls the scroll
              await img.decode();
              seq.images[idx] = img;
            } catch {
              /* skip broken frame */
            }
            seq.loaded++;
            this.reportProgress();
          })()
        );
      }
      await Promise.all(jobs);
    }
  }

  private reportProgress() {
    const wrap = this.seqs.get("wrap");
    if (!wrap || !this.onProgress) return;
    this.onProgress(Math.round((wrap.loaded / wrap.count) * 100));
  }

  /* ------------------------------------------------------------- update */
  setPhase(phase: number, t: number) {
    if (phase !== this.phase) {
      this.prevVisual = this.curVisual;
      this.curVisual = phase;
      this.fade = 0;
    }
    this.phase = phase;
    this.phaseT = clamp01(t);
  }

  private frameFor(name: string, t: number): HTMLImageElement | undefined {
    const seq = this.seqs.get(name);
    if (!seq || seq.count === 0) return undefined;
    let idx = Math.round(clamp01(t) * (seq.count - 1));
    // fall back to the nearest loaded earlier frame while streaming in
    while (idx > 0 && !seq.images[idx]) idx--;
    return seq.images[idx];
  }

  private visualImage(v: Visual, t: number): HTMLImageElement | undefined {
    if (v.kind === "seq") {
      let tt = v.reverse ? 1 - t : t;
      if (v.range) tt = v.range[0] + tt * (v.range[1] - v.range[0]);
      return this.frameFor(v.seq!, tt) ?? this.stills.get("hero");
    }
    return this.stills.get(v.still!);
  }

  private drawVisual(vIdx: number, t: number, alpha: number, zoom = 1) {
    const v = VISUALS[vIdx] ?? VISUALS[0];
    const img = this.visualImage(v, t);
    if (!img) return;
    const { canvas, ctx } = this;
    const cw = canvas.clientWidth || window.innerWidth;
    const ch = canvas.clientHeight || window.innerHeight;

    let scale = Math.max(cw / img.naturalWidth, ch / img.naturalHeight) * zoom;
    let dx = 0, dy = 0;
    if (v.kind === "still" && v.kb) {
      const [s0, s1, px, py] = v.kb;
      const k = easeInOut(t);
      scale *= s0 + (s1 - s0) * k;
      dx = px * cw * k;
      dy = py * ch * k;
    }
    const w = img.naturalWidth * scale;
    const h = img.naturalHeight * scale;
    ctx.globalAlpha = alpha;
    ctx.drawImage(img, (cw - w) / 2 + dx, (ch - h) / 2 + dy, w, h);
    if (v.darken > 0) {
      ctx.fillStyle = `rgba(5,5,6,${v.darken * alpha})`;
      ctx.fillRect(0, 0, cw, ch);
    }
    ctx.globalAlpha = 1;
  }

  private loop = (now: number) => {
    if (this.disposed) return;
    this.raf = requestAnimationFrame(this.loop);
    const dt = Math.min((now - this.lastTime) / 1000, 0.05);
    this.lastTime = now;

    // damped scrub — keeps fast scrolling silky
    this.curT += (this.phaseT - this.curT) * (1 - Math.exp(-dt * 5.5));
    this.fade = Math.min(1, this.fade + dt * 1.5);

    // act soundtrack crossfade
    if (this.soundEnabled) {
      const active = VISUALS[this.curVisual]?.audio;
      for (const [name, a] of this.audios) {
        const target = name === active ? 0.85 : 0;
        const vol = a.volume + (target - a.volume) * Math.min(1, dt * 3);
        a.volume = Math.max(0, Math.min(1, vol));
        if (target > 0 && a.paused) a.play().catch(() => {});
        if (target === 0 && a.volume < 0.02 && !a.paused) a.pause();
      }
    }

    const { ctx, canvas } = this;
    const cw = canvas.clientWidth || window.innerWidth;
    const ch = canvas.clientHeight || window.innerHeight;
    ctx.fillStyle = "#050506";
    ctx.fillRect(0, 0, cw, ch);

    if (this.fade < 1) {
      // cinematic zoom-through: the old act drifts toward camera while the
      // new one settles back into place
      const k = easeInOut(this.fade);
      this.drawVisual(this.prevVisual, 1, 1, 1 + 0.08 * k);
      this.drawVisual(this.curVisual, this.curT, k, 1.06 - 0.06 * k);
    } else {
      this.drawVisual(this.curVisual, this.curT, 1);
    }

    // soft vignette (gradient cached per canvas size)
    if (!this.vignette || this.vignette.w !== cw || this.vignette.h !== ch) {
      const g = ctx.createRadialGradient(cw / 2, ch / 2, Math.min(cw, ch) * 0.42, cw / 2, ch / 2, Math.max(cw, ch) * 0.78);
      g.addColorStop(0, "rgba(0,0,0,0)");
      g.addColorStop(1, "rgba(3,3,4,0.55)");
      this.vignette = { w: cw, h: ch, grad: g };
    }
    ctx.fillStyle = this.vignette.grad;
    ctx.fillRect(0, 0, cw, ch);
  };

  resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    this.vignette = null;
    const w = this.canvas.clientWidth || window.innerWidth;
    const h = this.canvas.clientHeight || window.innerHeight;
    this.canvas.width = Math.round(w * dpr);
    this.canvas.height = Math.round(h * dpr);
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  dispose() {
    this.disposed = true;
    cancelAnimationFrame(this.raf);
    for (const a of this.audios.values()) {
      a.pause();
      a.src = "";
    }
  }
}
