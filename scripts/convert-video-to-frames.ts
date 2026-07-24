/**
 * Convert an approved fal.ai video into a scroll-scrubbable WebP frame
 * sequence. Requires ffmpeg on PATH.
 *
 *   npx tsx scripts/convert-video-to-frames.ts \
 *     --video public/assets/videos/core-to-strands.mp4 \
 *     --sequence core-to-strands [--fps 24] [--width 1280] [--quality 78]
 *
 * Writes zero-padded frames to public/assets/sequences/<sequence>/ and a
 * poster (first frame). After running, update the matching entry in
 * lib/sequences/manifest.ts with the printed frameCount.
 */
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

function arg(flag: string, fallback?: string): string | undefined {
  const i = process.argv.indexOf(flag);
  return i !== -1 ? process.argv[i + 1] : fallback;
}

function main(): void {
  const video = arg("--video");
  const sequence = arg("--sequence");
  const fps = Number(arg("--fps", "24"));
  const width = Number(arg("--width", "1280"));
  const quality = Number(arg("--quality", "78"));

  if (!video || !sequence) {
    console.error("Usage: --video <file.mp4> --sequence <id> [--fps 24] [--width 1280] [--quality 78]");
    process.exit(1);
  }
  if (!fs.existsSync(video)) {
    console.error(`✗ video not found: ${video}`);
    process.exit(1);
  }
  try {
    execFileSync("ffmpeg", ["-version"], { stdio: "ignore" });
  } catch {
    console.error("✗ ffmpeg is not installed or not on PATH. Install it and re-run.");
    process.exit(1);
  }

  const outDir = path.join("public", "assets", "sequences", sequence);
  fs.mkdirSync(outDir, { recursive: true });

  console.log(`… extracting ${fps}fps WebP frames at ${width}px wide`);
  execFileSync("ffmpeg", [
    "-y",
    "-i", video,
    "-vf", `fps=${fps},scale=${width}:-2:flags=lanczos`,
    "-c:v", "libwebp",
    "-quality", String(quality),
    path.join(outDir, "frame_%04d.webp"),
  ], { stdio: "inherit" });

  const frames = fs.readdirSync(outDir).filter((f) => f.endsWith(".webp"));
  // poster = first frame copied alongside
  const posterDir = path.join("public", "assets", "posters");
  fs.mkdirSync(posterDir, { recursive: true });
  fs.copyFileSync(path.join(outDir, "frame_0001.webp"), path.join(posterDir, `${sequence}.webp`));

  console.log(`✓ ${frames.length} frames → ${outDir}`);
  console.log(`✓ poster → public/assets/posters/${sequence}.webp`);
  console.log(`→ update lib/sequences/manifest.ts: "${sequence}": frameCount: ${frames.length}, poster: "/assets/posters/${sequence}.webp"`);
}

main();
