"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Narration engine for the visualization viewer.
 *
 * The Lovable original streamed a studio voice from its own `/api/tts` route.
 * That needs a server and an API key, so this uses the browser's own speech
 * engine instead — the fallback the project's video brief already documents.
 * Swap in real voiceover by passing `audioSrc`; an MP3 always wins over the
 * synthetic voice.
 *
 * `charIndex` is what drives the picture: the viewer maps how far through the
 * script the voice has read onto the storyboard clock, so a cut lands on the
 * sentence it illustrates rather than on a fixed timer.
 *
 * Nothing ever autoplays with sound. Playback only starts from a user click,
 * which is both the browser rule and the polite thing to do.
 */
export function useNarration({ text, audioSrc }: { text: string; audioSrc?: string }) {
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [charIndex, setCharIndex] = useState(0);
  const [supported, setSupported] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const utterRef = useRef<SpeechSynthesisUtterance | null>(null);
  /** Bumped on every stop/play so a late callback cannot revive a dead read. */
  const genRef = useRef(0);
  const mutedRef = useRef(false);

  useEffect(() => {
    setSupported(typeof window !== "undefined" && "speechSynthesis" in window);
  }, []);

  const stop = useCallback(() => {
    if (typeof window === "undefined") return;
    genRef.current += 1;
    audioRef.current?.pause();
    audioRef.current = null;
    utterRef.current = null;
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    setPlaying(false);
    setCharIndex(0);
  }, []);

  // Stop when the script changes (topic switch) or on unmount, so two voices
  // can never talk over each other.
  useEffect(() => stop, [text, audioSrc, stop]);

  /**
   * Picks the most natural available voice. Browsers ship a lot of robotic
   * ones; the named families below are the warm, full-quality voices, and
   * anything local-only tends to be the buzzy fallback.
   */
  const pickVoice = () => {
    const voices = window.speechSynthesis.getVoices().filter(v => v.lang.startsWith("en"));
    if (!voices.length) return null;
    const preferred = [
      "Google UK English Female", "Google US English", "Samantha",
      "Microsoft Libby Online", "Microsoft Sonia Online", "Microsoft Aria Online",
    ];
    for (const name of preferred) {
      const hit = voices.find(v => v.name.includes(name));
      if (hit) return hit;
    }
    return voices.find(v => !v.localService) ?? voices[0];
  };

  /**
   * Starts narration. `fromRatio` (0–1) resumes from a position in the script,
   * snapped back to the nearest sentence start, so skipping or scrubbing the
   * film moves the voice to the matching sentence rather than mid-word.
   */
  const play = useCallback((fromRatio = 0) => {
    if (typeof window === "undefined") return;
    stop();

    const generation = genRef.current;
    const current = () => generation === genRef.current;

    const target = Math.min(Math.max(fromRatio, 0), 0.98) * text.length;
    let offset = 0;
    if (target > 0) {
      const boundary = text.slice(0, Math.round(target)).lastIndexOf(". ");
      offset = boundary > 0 ? boundary + 2 : 0;
    }
    setCharIndex(offset);

    if (audioSrc) {
      const audio = new Audio(audioSrc);
      audio.muted = mutedRef.current;
      audio.addEventListener("loadedmetadata", () => {
        if (audio.duration) audio.currentTime = (offset / text.length) * audio.duration;
      });
      audio.addEventListener("timeupdate", () => {
        if (audio.duration) setCharIndex(Math.round((audio.currentTime / audio.duration) * text.length));
      });
      audio.addEventListener("ended", () => {
        if (!current()) return;
        setCharIndex(text.length);
        setPlaying(false);
      });
      audio.addEventListener("error", () => current() && setPlaying(false));
      audioRef.current = audio;
      void audio.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
      return;
    }

    if (!("speechSynthesis" in window)) return;

    const utter = new SpeechSynthesisUtterance(text.slice(offset));
    const voice = pickVoice();
    if (voice) utter.voice = voice;
    utter.rate = 0.94;   // documentary pace, not the default gabble
    utter.pitch = 1;
    utter.volume = mutedRef.current ? 0 : 1;
    // `boundary` fires per word, which is a far truer read position than a
    // timer — the picture stays locked to the voice even if the engine drifts.
    utter.onboundary = (event) => {
      if (!current()) return;
      setCharIndex(offset + (event.charIndex ?? 0));
    };
    utter.onend = () => {
      if (!current()) return;
      setCharIndex(text.length);
      setPlaying(false);
    };
    utter.onerror = () => current() && setPlaying(false);

    utterRef.current = utter;
    setPlaying(true);
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
  }, [audioSrc, stop, text]);

  const toggleMute = useCallback(() => {
    setMuted((prev) => {
      const next = !prev;
      mutedRef.current = next;
      if (audioRef.current) audioRef.current.muted = next;
      if (utterRef.current) utterRef.current.volume = next ? 0 : 1;
      // The speech engine reads volume once at speak() time, so a live mute
      // means restarting the utterance from where it had reached.
      if (utterRef.current && typeof window !== "undefined" && "speechSynthesis" in window) {
        const ratio = text.length ? charIndex / text.length : 0;
        window.setTimeout(() => play(ratio), 0);
      }
      return next;
    });
  }, [charIndex, play, text.length]);

  return { supported, playing, muted, charIndex, play, stop, toggleMute };
}
