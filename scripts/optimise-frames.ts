/**
 * Re-encode an existing frame sequence at a lower resolution/quality to
 * create responsive variants (medium / low tiers). Requires ffmpeg.
 *
 *   npx tsx scripts/optimise-frames.ts --sequence core-to-strands --width 720 --quality 68 --suffix -md
 *
 * Output goes to public/assets/sequences/<sequence><suffix>/ — register it
 * in lib/sequences/manifest.ts under `variants`.
 */
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

function arg(flag: string, fallback?: string): string | undefined {
  const i = process.argv.indexOf(flag);
  return i !== -1 ? process.argv[i + 1] : fallback;
}

function main(): void {
  const sequence = arg("--sequence");
  const width = Number(arg("--width", "720"));
  const quality = Number(arg("--quality", "68"));
  const suffix = arg("--suffix", "-md");

  if (!sequence) {
    console.error("Usage: --sequence <id> [--width 720] [--quality 68] [--suffix -md]");
    process.exit(1);
  }
  const srcDir = path.join("public", "assets", "sequences", sequence);
  if (!fs.existsSync(srcDir)) {
    console.error(`✗ no sequence at ${srcDir}`);
    process.exit(1);
  }
  try {
    execFileSync("ffmpeg", ["-version"], { stdio: "ignore" });
  } catch {
    console.error("✗ ffmpeg is not installed or not on PATH.");
    process.exit(1);
  }

  const outDir = `${srcDir}${suffix}`;
  fs.mkdirSync(outDir, { recursive: true });
  const frames = fs.readdirSync(srcDir).filter((f) => f.endsWith(".webp")).sort();

  for (const frame of frames) {
    execFileSync("ffmpeg", [
      "-y",
      "-i", path.join(srcDir, frame),
      "-vf", `scale=${width}:-2:flags=lanczos`,
      "-quality", String(quality),
      path.join(outDir, frame),
    ], { stdio: "ignore" });
  }
  console.log(`✓ ${frames.length} frames re-encoded → ${outDir}`);
  console.log(`→ register in lib/sequences/manifest.ts under variants for "${sequence}"`);
}

main();
