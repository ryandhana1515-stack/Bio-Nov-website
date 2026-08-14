"use client";

/**
 * BIO N:OV — "Inside the body" interactive visualization.
 *
 * Ported from the Vitality Explorer Lovable project. Left menu selects a body
 * system; the right viewer plays that system's storyboard as a shot-by-shot
 * film, cutting to dedicated footage for each sentence the narrator speaks so
 * the picture always shows the structure being described.
 *
 * Two video layers exist at all times so a cut crossfades rather than flashing
 * black. The clock follows the narrator when the voice is playing, and runs on
 * real time otherwise.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Activity, Brain, Droplet, Hourglass, Maximize2, Minimize2, Pause, Play,
  RotateCcw, Shield, SkipBack, SkipForward, Sparkles, Volume2, VolumeX, Wind,
} from "lucide-react";

import {
  bodyVisualizations, shotAt, shotClip, shotTimecode, transitionNarration,
  visualizationOrder, type Framing, type VisualizationId,
} from "./data";
import { useNarration } from "./useNarration";

const icons = { droplet: Droplet, wind: Wind, brain: Brain, activity: Activity, shield: Shield, hourglass: Hourglass };

/** Synthetic camera per shot type — scale/offset applied to the media layer. */
const camera: Record<Framing, { scale: number; x: number; y: number }> = {
  wide: { scale: 1, x: 0, y: 0 },
  approach: { scale: 1.22, x: -2, y: 2 },
  inside: { scale: 1.45, x: 3, y: -1 },
  micro: { scale: 1.9, x: -3, y: -3 },
  pullback: { scale: 1.06, x: 0, y: 0 },
};

const clock = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduced(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);
  return reduced;
}

export default function VitalityExplorer() {
  const [active, setActive] = useState<VisualizationId>("circulation");
  const [previous, setPrevious] = useState<VisualizationId | null>(null);
  const buttonsRef = useRef<(HTMLButtonElement | null)[]>([]);

  const select = (id: VisualizationId) => {
    if (id === active) return;
    setPrevious(active);
    setActive(id);
  };

  const onKeyDown = (event: React.KeyboardEvent, index: number) => {
    const keys = ["ArrowDown", "ArrowUp", "ArrowRight", "ArrowLeft", "Home", "End"];
    if (!keys.includes(event.key)) return;
    event.preventDefault();
    const last = visualizationOrder.length - 1;
    let next = index;
    if (event.key === "ArrowDown" || event.key === "ArrowRight") next = index === last ? 0 : index + 1;
    if (event.key === "ArrowUp" || event.key === "ArrowLeft") next = index === 0 ? last : index - 1;
    if (event.key === "Home") next = 0;
    if (event.key === "End") next = last;
    select(visualizationOrder[next]);
    buttonsRef.current[next]?.focus();
  };

  return (
    <div className="viz-grid">
      <div className="viz-menu" role="tablist" aria-label="Body systems" aria-orientation="vertical">
        <p className="viz-menu-hint"><Sparkles size={16} aria-hidden /> Select a system &middot; travel through one human body</p>
        {visualizationOrder.map((id, index) => {
          const item = bodyVisualizations[id];
          const Icon = icons[item.icon];
          const selected = id === active;
          return (
            <button
              key={id}
              ref={(node) => { buttonsRef.current[index] = node; }}
              role="tab"
              type="button"
              aria-selected={selected}
              tabIndex={selected ? 0 : -1}
              onClick={() => select(id)}
              onKeyDown={(event) => onKeyDown(event, index)}
              className={`viz-menu-item${selected ? " is-active" : ""}`}
            >
              <span className="viz-menu-icon"><Icon size={20} aria-hidden /></span>
              <span className="viz-menu-txt">
                <b>{item.title}</b>
                <small>{item.menuDescription}</small>
              </span>
              <span className="viz-menu-progress" aria-hidden />
            </button>
          );
        })}
      </div>

      <Viewer active={active} previous={previous} />
    </div>
  );
}

function Viewer({ active, previous }: { active: VisualizationId; previous: VisualizationId | null }) {
  const reducedMotion = useReducedMotion();
  const shellRef = useRef<HTMLDivElement>(null);
  const frontRef = useRef<HTMLVideoElement>(null);
  const backRef = useRef<HTMLVideoElement>(null);
  const lastTick = useRef<number | null>(null);
  const seekTarget = useRef<number | null>(null);

  const [frontReady, setFrontReady] = useState(false);
  const [backReady, setBackReady] = useState(false);
  const [captionVisible, setCaptionVisible] = useState(false);
  const [time, setTime] = useState(0);
  const [paused, setPaused] = useState(true);
  const [scrubbing, setScrubbing] = useState(false);
  const [detached, setDetached] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);

  const item = bodyVisualizations[active];
  const narration = useNarration({ text: item.narration });

  const shot = shotAt(item.storyboard, time);
  const shotIndex = item.storyboard.indexOf(shot);
  const progress = Math.min(time / item.duration, 1);
  const clip = shotClip(shot, item.poster);

  const [layers, setLayers] = useState<{ front: string; back: string | null }>({ front: clip, back: null });

  const transition = previous && previous !== active
    ? transitionNarration[`${previous}->${active}`]
    : undefined;

  // Reset on topic change. The media layers are deliberately NOT torn down —
  // the new opening clip is queued on the back layer below and crossfaded in,
  // so switching never shows black or a frozen frame from the old topic.
  useEffect(() => {
    setCaptionVisible(false);
    setTime(0);
    setPaused(true);
    setScrubbing(false);
    setDetached(false);
    lastTick.current = null;
    const reveal = window.setTimeout(() => setCaptionVisible(true), 560);
    return () => window.clearTimeout(reveal);
  }, [active]);

  // Queue the shot's clip on the back layer. If the shot cuts back to what is
  // already on screen, drop the queued layer so a stale clip cannot fade in.
  useEffect(() => {
    setLayers((current) => {
      if (clip === current.front) {
        if (!current.back) return current;
        setBackReady(false);
        return { front: current.front, back: null };
      }
      if (clip === current.back) return current;
      setBackReady(false);
      return { front: current.front, back: clip };
    });
  }, [clip]);

  // Promote the back layer once it has fully faded in. It is already buffered,
  // so the front layer is marked ready in the same tick — otherwise the remount
  // drops the picture to black for a frame.
  useEffect(() => {
    if (!backReady || !layers.back) return;
    const id = window.setTimeout(() => {
      setLayers((current) => {
        if (!current.back) return current;
        setFrontReady(true);
        return { front: current.back, back: null };
      });
      setBackReady(false);
    }, 780);
    return () => window.clearTimeout(id);
  }, [backReady, layers.back]);

  // Storyboard clock. While the voice reads it follows the spoken position, so
  // cuts land on the sentence they illustrate; otherwise it runs in real time
  // and loops. Pausing or dragging freezes it; a manual seek detaches it from
  // the voice so the drag is never fought.
  useEffect(() => {
    if (reducedMotion) { setTime(0); return; }
    const id = window.setInterval(() => {
      if (paused || scrubbing) { lastTick.current = null; return; }
      if (narration.playing && !detached && item.narration.length) {
        const ratio = narration.charIndex / item.narration.length;
        setTime(Math.min(ratio * item.duration, item.duration - 0.01));
        return;
      }
      const now = performance.now();
      const delta = (now - (lastTick.current ?? now)) / 1000;
      lastTick.current = now;
      setTime((value) => (value + delta) % item.duration);
    }, 100);
    return () => window.clearInterval(id);
  }, [active, reducedMotion, paused, scrubbing, detached, narration.playing,
      narration.charIndex, item.duration, item.narration.length]);

  useEffect(() => {
    for (const ref of [frontRef, backRef]) {
      const video = ref.current;
      if (!video) continue;
      if (paused) video.pause();
      else void video.play().catch(() => undefined);
    }
  }, [paused, layers.front, layers.back, frontReady, backReady]);

  // Warm only the next shot. These clips stream from a CDN, so limiting this to
  // one prevents competing downloads from starving the clip now playing.
  useEffect(() => {
    if (reducedMotion || typeof window === "undefined" || window.innerWidth < 900) return;
    const upcoming = item.storyboard.slice(shotIndex + 1, shotIndex + 2).map(e => shotClip(e, item.poster));
    const links = Array.from(new Set(upcoming))
      .filter(href => href !== layers.front && href !== layers.back)
      .map((href) => {
        const link = document.createElement("link");
        link.rel = "prefetch";
        link.href = href;
        document.head.appendChild(link);
        return link;
      });
    return () => links.forEach(link => link.remove());
  }, [reducedMotion, shotIndex, item, layers.front, layers.back]);

  useEffect(() => {
    const onChange = () => setFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  const replayScene = useCallback(() => {
    setCaptionVisible(false);
    window.setTimeout(() => setCaptionVisible(true), 420);
    setTime(0);
    setPaused(false);
    setDetached(false);
    lastTick.current = null;
    const video = frontRef.current;
    if (video) { video.currentTime = 0; void video.play().catch(() => undefined); }
    narration.play();
  }, [narration]);

  /** Master transport: picture and voice start and stop together. */
  const togglePlay = useCallback(() => {
    if (paused) {
      setPaused(false);
      lastTick.current = null;
      if (!narration.playing) narration.play();
    } else {
      setPaused(true);
      narration.stop();
    }
  }, [paused, narration]);

  const resyncVoice = useCallback((seconds: number) => {
    if (paused) return;
    setDetached(false);
    narration.play(Math.min(Math.max(seconds / item.duration, 0), 0.98));
  }, [narration, item.duration, paused]);

  /**
   * Moves the footage itself to the requested position. The clock alone only
   * decides which shot is on screen, so without this the picture stays frozen
   * on its old frame when the scrubber or skip buttons are used.
   */
  const syncPicture = useCallback((seconds: number) => {
    const video = frontRef.current;
    if (!video) return;
    const target = shotAt(item.storyboard, seconds);
    const offset = Math.max(seconds - target.start, 0);
    const length = Number.isFinite(video.duration) ? video.duration : 0;
    if (length > 0.2) {
      try { video.currentTime = offset % length; } catch { /* metadata not ready; next sync catches it */ }
    }
    if (!paused) void video.play().catch(() => undefined);
  }, [item.storyboard, paused]);

  const seek = useCallback((seconds: number) => {
    lastTick.current = null;
    setDetached(true);
    const next = Math.min(Math.max(seconds, 0), item.duration - 0.01);
    seekTarget.current = next;
    setTime(next);
    syncPicture(next);
    // If the seek crossed into another shot, sync again once that clip is up.
    window.setTimeout(() => syncPicture(next), 320);
    window.setTimeout(() => syncPicture(next), 900);
  }, [item.duration, syncPicture]);

  const seekTo = useCallback((seconds: number) => { seek(seconds); resyncVoice(seconds); }, [seek, resyncVoice]);
  const skip = useCallback((delta: number) => {
    const next = Math.min(Math.max(time + delta, 0), item.duration - 0.01);
    seek(next);
    resyncVoice(next);
  }, [time, item.duration, seek, resyncVoice]);

  const toggleFullscreen = useCallback(() => {
    if (document.fullscreenElement) void document.exitFullscreen();
    else void shellRef.current?.requestFullscreen?.().catch(() => undefined);
  }, []);

  const cam = useMemo(() => camera[shot.framing], [shot.framing]);

  const mediaLayer = (src: string, isBack: boolean) => (
    <video
      key={src}
      ref={isBack ? backRef : frontRef}
      className={`viz-video${(isBack ? backReady : frontReady) ? " is-on" : ""}`}
      muted loop playsInline preload="auto" controls={false}
      disablePictureInPicture
      poster={item.poster}
      aria-label={`${item.label} — ${shot.shot}`}
      // Slightly slowed footage reads as a documentary camera move and hides
      // the loop point on shots that outlast their clip.
      onLoadedMetadata={(e) => { e.currentTarget.playbackRate = 0.85; }}
      onLoadedData={() => (isBack ? setBackReady(true) : setFrontReady(true))}
      onCanPlay={() => (isBack ? setBackReady(true) : setFrontReady(true))}
      onError={() => (isBack ? setBackReady(false) : setFrontReady(false))}
    >
      <source src={src} type="video/mp4" />
      <source src={src.replace("/hd/", "/hd-webm/").replace(/\.mp4$/, ".webm")} type="video/webm" />
    </video>
  );

  return (
    <div className="viz-shell" ref={shellRef}>
      <div className="viz-stage">
        {!reducedMotion && (
          <div className="viz-camera" style={{ transform: `scale(${cam.scale}) translate(${cam.x}%, ${cam.y}%)` }}>
            {mediaLayer(layers.front, false)}
            {layers.back && mediaLayer(layers.back, true)}
          </div>
        )}
        {reducedMotion && <img className="viz-video is-on" src={item.poster} alt={`${item.label} — ${shot.shot}`} />}

        {/* Callout naming exactly what the narrator is describing */}
        {!reducedMotion && (
          <div className="viz-annotation" key={`${active}-${shotIndex}`} aria-hidden>
            <span className="viz-annotation-target" style={{ left: `${shot.annotation.x}%`, top: `${shot.annotation.y}%` }} />
            <div
              className="viz-annotation-wrap"
              style={{
                left: `${shot.annotation.x}%`,
                top: `${shot.annotation.y}%`,
                transform: `translate(${shot.annotation.x > 58 ? "-100%" : "0"}, ${shot.annotation.y > 62 ? "-100%" : "0"})`,
                flexDirection: shot.annotation.x > 58 ? "row-reverse" : "row",
              }}
            >
              <span className="viz-annotation-leader" />
              <div className="viz-annotation-card">
                <p className="viz-annotation-label">{shot.annotation.label}</p>
                <p className="viz-annotation-note">{shot.annotation.note}</p>
              </div>
            </div>
          </div>
        )}

        {/* Fast light sweep on every cut */}
        <div className="viz-cut" key={`cut-${active}-${shotIndex}`} aria-hidden />
        <div className="viz-vignette" aria-hidden />

        <div className="viz-live">
          <span className="viz-dot" aria-hidden />
          {reducedMotion ? "Static view" : `Shot ${String(shotIndex + 1).padStart(2, "0")} · ${shot.shot}`}
        </div>

        <div className="viz-topic">
          <p>{transition ?? `Inside the body · ${item.label}`}</p>
          <h3 className={captionVisible ? "is-in" : ""}>{item.label}</h3>
        </div>

        {paused && (
          <button type="button" onClick={togglePlay} className="viz-start" aria-label={`Play ${item.label} explanation`}>
            <span><Play size={16} aria-hidden /> Play explanation</span>
          </button>
        )}

        <button type="button" onClick={toggleFullscreen} className="viz-icon-btn viz-fs"
          aria-label={fullscreen ? "Exit fullscreen" : "View fullscreen"}>
          {fullscreen ? <Minimize2 size={16} aria-hidden /> : <Maximize2 size={16} aria-hidden />}
        </button>
      </div>

      {/* Transport bar, outside the picture */}
      <div className="viz-transport">
        <button type="button" onClick={togglePlay} className="viz-icon-btn" aria-label={paused ? "Play" : "Pause"}>
          {paused ? <Play size={16} aria-hidden /> : <Pause size={16} aria-hidden />}
        </button>
        <button type="button" onClick={() => skip(-8)} className="viz-icon-btn" aria-label="Back 8 seconds">
          <SkipBack size={16} aria-hidden />
        </button>
        <button type="button" onClick={() => skip(8)} className="viz-icon-btn" aria-label="Forward 8 seconds">
          <SkipForward size={16} aria-hidden />
        </button>
        <button type="button" onClick={narration.toggleMute} className="viz-icon-btn"
          aria-label={narration.muted ? "Unmute narration" : "Mute narration"}>
          {narration.muted ? <VolumeX size={16} aria-hidden /> : <Volume2 size={16} aria-hidden />}
        </button>
        <span className="viz-time">{clock(time)} / {clock(item.duration)}</span>
        <input
          className="viz-scrub" type="range" min={0} max={item.duration} step={0.1} value={time}
          aria-label="Scrub the film"
          onMouseDown={() => setScrubbing(true)}
          onTouchStart={() => setScrubbing(true)}
          onChange={(e) => seek(Number(e.target.value))}
          onMouseUp={() => { setScrubbing(false); resyncVoice(seekTarget.current ?? time); }}
          onTouchEnd={() => { setScrubbing(false); resyncVoice(seekTarget.current ?? time); }}
        />
        <button type="button" onClick={replayScene} className="viz-icon-btn" aria-label="Replay from the start">
          <RotateCcw size={16} aria-hidden />
        </button>
      </div>

      <div className="viz-timeline">
        <div className="viz-timeline-fill" style={{ width: `${Math.max(progress * 100, 2)}%` }} />
        {item.storyboard.slice(1).map((mark) => (
          <span key={mark.start} style={{ left: `${(mark.start / item.duration) * 100}%` }} aria-hidden />
        ))}
      </div>

      {/* Subtitle box — under the picture, never over it */}
      <div className="viz-sub">
        <div className="viz-sub-head">
          <p>{narration.playing ? "Now narrating" : "Explanation"}</p>
          <p>{shotTimecode(shot)}</p>
        </div>
        <p className="viz-sub-line" key={`line-${active}-${shotIndex}`}>{shot.line}</p>
        <p className="viz-sub-visual">{shot.visual}</p>
      </div>

      <div className={`viz-below${captionVisible ? " is-in" : ""}`}>
        <p className="viz-caption">{item.caption}</p>

        <ol className="viz-chapters">
          {item.storyboard.map((entry, index) => (
            <li key={entry.shot}>
              <button type="button" onClick={() => seekTo(entry.start)} className={index === shotIndex ? "is-now" : ""}>
                <span>{shotTimecode(entry)}</span>{entry.shot}
              </button>
            </li>
          ))}
        </ol>

        <div className="viz-actions">
          <button type="button" className="viz-cta is-primary"
            onClick={() => { setPaused(false); setDetached(false); lastTick.current = null; narration.play(); }}>
            <Volume2 size={16} aria-hidden /> Play explanation
          </button>
          <button type="button" className="viz-cta" onClick={narration.toggleMute}>
            {narration.muted ? <VolumeX size={16} aria-hidden /> : <Volume2 size={16} aria-hidden />}
            {narration.muted ? "Sound off" : "Sound on"}
          </button>
          <button type="button" className="viz-cta" onClick={replayScene}>
            <RotateCcw size={16} aria-hidden /> Replay scene
          </button>
        </div>

        <p className="viz-disclaimer">
          Educational representation of normal human biology. Not a depiction of treatment,
          diagnosis or medical outcomes.
        </p>
      </div>
    </div>
  );
}
