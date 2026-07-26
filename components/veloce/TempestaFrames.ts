"use client";

/*
 * TempestaFrames — cinematic scroll engine driven by real Kling-generated
 * footage, extracted to JPEG frame sequences under /veloce/media.
 *
 * Acts (phase → visual):
 *   0 hero        wrap-tear reveal sequence, scrubbed by scroll
 *   1 storms      hero still, slow push-in
 *   2 orbit       360° turntable sequence, scrubbed
 *   3 macro       macro fly-through sequence, scrubbed
 *   4 engineering hero still, drift + darken, spec callouts on top
 *   5 edition     hero still, slow pull-back
 *   6 cta         hero still, deep darken — the car waits
 *
 * Same public surface as the old TempestaScene (setPhase / resize / dispose)
 * so VeloceSite treats them interchangeably.
 */

const MEDIA = "/veloce/media";

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const easeInOut = (t: number) => t * t * (3 - 2 * t);

interface Sequence {
  images: (HTMLImageElement | undefined)[];
  count: number;
  loaded: number;
}

interface Visual {
  kind: "seq" | "still";
  seq?: string;
  still?: string;
  // ken burns for stills: [scaleFrom, scaleTo, panX, panY], pan in canvas fractions
  kb?: [number, number, number, number];
  darken: number;
}

const VISUALS: Visual[] = [
  { kind: "seq", seq: "wrap", darken: 0.12 },
  { kind: "still", still: "hero", kb: [1.04, 1.14, -0.02, 0.01], darken: 0.35 },
  { kind: "seq", seq: "orbit", darken: 0.1 },
  { kind: "seq", seq: "macro", darken: 0.08 },
  { kind: "still", still: "hero", kb: [1.18, 1.08, 0.03, -0.01], darken: 0.5 },
  { kind: "still", still: "hero", kb: [1.12, 1.03, 0, 0.01], darken: 0.3 },
  { kind: "still", still: "hero-wrapped", kb: [1.05, 1.12, 0, 0], darken: 0.45 },
];

export class TempestaFrames {
  phase = 0;
  phaseT = 0;
  onProgress?: (pct: number) => void;

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
      this.seqs.set(name, { images: new Array(count), count, loaded: 0 });
    }
    // priority: the act you see first loads first
    const order = ["wrap", "orbit", "macro"].filter((n) => this.seqs.has(n));
    for (const name of order) await this.loadSequence(name);
  }

  private loadSequence(name: string) {
    const seq = this.seqs.get(name)!;
    const batch = 8;
    let i = 0;
    return new Promise<void>((resolve) => {
      const next = () => {
        if (this.disposed || i >= seq.count) return resolve();
        const end = Math.min(i + batch, seq.count);
        let pending = end - i;
        for (; i < end; i++) {
          const idx = i;
          const img = new Image();
          img.onload = img.onerror = () => {
            seq.images[idx] = img.complete && img.naturalWidth > 0 ? img : undefined;
            seq.loaded++;
            this.reportProgress();
            if (--pending === 0) next();
          };
          img.src = `${MEDIA}/${name}/frame_${String(idx + 1).padStart(3, "0")}.jpg`;
        }
      };
      next();
    });
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
      return this.frameFor(v.seq!, t) ?? this.stills.get("hero");
    }
    return this.stills.get(v.still!);
  }

  private drawVisual(vIdx: number, t: number, alpha: number) {
    const v = VISUALS[vIdx] ?? VISUALS[0];
    const img = this.visualImage(v, t);
    if (!img) return;
    const { canvas, ctx } = this;
    const cw = canvas.clientWidth || window.innerWidth;
    const ch = canvas.clientHeight || window.innerHeight;

    let scale = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
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
    this.curT += (this.phaseT - this.curT) * (1 - Math.exp(-dt * 7));
    this.fade = Math.min(1, this.fade + dt * 2.4);

    const { ctx, canvas } = this;
    const cw = canvas.clientWidth || window.innerWidth;
    const ch = canvas.clientHeight || window.innerHeight;
    ctx.fillStyle = "#050506";
    ctx.fillRect(0, 0, cw, ch);

    if (this.fade < 1) {
      this.drawVisual(this.prevVisual, 1, 1);
      this.drawVisual(this.curVisual, this.curT, easeInOut(this.fade));
    } else {
      this.drawVisual(this.curVisual, this.curT, 1);
    }

    // soft vignette
    const g = ctx.createRadialGradient(cw / 2, ch / 2, Math.min(cw, ch) * 0.42, cw / 2, ch / 2, Math.max(cw, ch) * 0.78);
    g.addColorStop(0, "rgba(0,0,0,0)");
    g.addColorStop(1, "rgba(3,3,4,0.55)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, cw, ch);
  };

  resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = this.canvas.clientWidth || window.innerWidth;
    const h = this.canvas.clientHeight || window.innerHeight;
    this.canvas.width = Math.round(w * dpr);
    this.canvas.height = Math.round(h * dpr);
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  dispose() {
    this.disposed = true;
    cancelAnimationFrame(this.raf);
  }
}
