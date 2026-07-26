#!/usr/bin/env python3
"""Join the Kling clips into one hero film with crossfades and mixed audio.

Reads veloce-media/film.json, downloads each segment, normalizes to
1920x1080@24, chains xfade transitions, overlays each audio-bearing
segment's soundtrack at its position on the timeline, and writes
public/veloce/film.mp4 (faststart for progressive playback).
"""
import json
import os
import subprocess
import sys


def sh(args):
    print("+", " ".join(args[:8]), "..." if len(args) > 8 else "")
    subprocess.run(args, check=True)


def duration(path):
    out = subprocess.run(
        ["ffprobe", "-v", "quiet", "-show_entries", "format=duration", "-of", "csv=p=0", path],
        capture_output=True, text=True, check=True,
    ).stdout.strip()
    return float(out)


def main():
    if not os.path.exists("public/veloce/film.mp4"):
        build_mp4()
    if not os.path.exists("public/veloce/film.webm"):
        # VP9 fallback for browsers without the proprietary H.264 codec
        sh([
            "ffmpeg", "-y", "-i", "public/veloce/film.mp4",
            "-c:v", "libvpx-vp9", "-crf", "34", "-b:v", "0",
            "-deadline", "good", "-cpu-used", "4", "-row-mt", "1",
            "-c:a", "libopus", "-b:a", "96k",
            "public/veloce/film.webm",
        ])
    print("film duration:", duration("public/veloce/film.mp4"))


def build_mp4():
    cfg = json.load(open("veloce-media/film.json"))
    segs = cfg["segments"]
    fade = float(cfg.get("fade", 0.7))

    norm = []
    for i, s in enumerate(segs):
        raw = f"/tmp/raw{i}.mp4"
        sh(["curl", "-fsSL", s["url"], "-o", raw])
        out = f"/tmp/norm{i}.mp4"
        sh([
            "ffmpeg", "-y", "-i", raw,
            "-vf", "scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,fps=24",
            "-an", "-c:v", "libx264", "-preset", "fast", "-crf", "20", "-pix_fmt", "yuv420p",
            out,
        ])
        norm.append({"file": out, "raw": raw, "dur": duration(out), "audio": bool(s.get("audio"))})

    n = len(norm)
    inputs = []
    for seg in norm:
        inputs += ["-i", seg["file"]]

    # video crossfade chain
    filt = []
    offsets = []
    cum = 0.0
    last = "[0:v]"
    for i in range(1, n):
        cum += norm[i - 1]["dur"] - fade
        offsets.append(cum)
        lbl = "[vout]" if i == n - 1 else f"[v{i}]"
        filt.append(f"{last}[{i}:v]xfade=transition=fade:duration={fade}:offset={cum:.3f}{lbl}")
        last = lbl

    # audio: place each audio-bearing raw clip at its timeline position
    acmds = []
    amix = []
    ai = n
    for i, seg in enumerate(norm):
        if not seg["audio"]:
            continue
        inputs += ["-i", seg["raw"]]
        start = 0.0 if i == 0 else offsets[i - 1]
        delay = int(start * 1000)
        fade_out_at = max(0.0, seg["dur"] - 0.8)
        acmds.append(
            f"[{ai}:a]afade=t=in:d=0.6,afade=t=out:st={fade_out_at:.2f}:d=0.8,"
            f"adelay={delay}|{delay}[a{ai}]"
        )
        amix.append(f"[a{ai}]")
        ai += 1

    if amix:
        acmds.append("".join(amix) + f"amix=inputs={len(amix)}:normalize=0[aout]")
        fc = ";".join(filt + acmds)
        maps = ["-map", "[vout]", "-map", "[aout]"]
        audio_args = ["-c:a", "aac", "-b:a", "160k"]
    else:
        fc = ";".join(filt)
        maps = ["-map", "[vout]"]
        audio_args = []

    sh(
        ["ffmpeg", "-y"] + inputs + ["-filter_complex", fc] + maps
        + ["-c:v", "libx264", "-preset", "medium", "-crf", "23", "-pix_fmt", "yuv420p"]
        + audio_args + ["-movflags", "+faststart", "public/veloce/film.mp4"]
    )


if __name__ == "__main__":
    sys.exit(main())
