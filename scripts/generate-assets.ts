/**
 * fal.ai asset generation CLI.
 *
 *   npx tsx scripts/generate-assets.ts --list
 *   npx tsx scripts/generate-assets.ts --asset curiosity-core --mode test
 *   npx tsx scripts/generate-assets.ts --asset core-to-strands --mode final --type video
 *   npx tsx scripts/generate-assets.ts --all --mode test
 *   npx tsx scripts/generate-assets.ts --approve curiosity-core
 *
 * Rules baked in:
 *  - test mode uses the cheapest model at modest resolution
 *  - an approved asset is never regenerated without --force
 *  - every run is written to data/asset-manifest.json + generation-costs.json
 *  - videos start from the approved reference image (first-frame workflow)
 */
import path from "node:path";
import fs from "node:fs";
import {
  falConfigured,
  generateImage,
  generateVideo,
  readManifest,
  writeManifest,
  recordCost,
} from "../lib/generation/fal";
import { prompts, getPrompt, NEGATIVE_PROMPT } from "../lib/generation/prompts";

type Args = {
  asset?: string;
  mode: "test" | "final";
  type: "image" | "video";
  all: boolean;
  list: boolean;
  approve?: string;
  force: boolean;
};

function parseArgs(): Args {
  const argv = process.argv.slice(2);
  const get = (flag: string) => {
    const i = argv.indexOf(flag);
    return i !== -1 ? argv[i + 1] : undefined;
  };
  return {
    asset: get("--asset"),
    mode: (get("--mode") as Args["mode"]) ?? "test",
    type: (get("--type") as Args["type"]) ?? "image",
    all: argv.includes("--all"),
    list: argv.includes("--list"),
    approve: get("--approve"),
    force: argv.includes("--force"),
  };
}

async function generateOne(id: string, args: Args): Promise<void> {
  const gen = getPrompt(id);
  if (!gen) {
    console.error(`✗ unknown asset id "${id}" — use --list`);
    process.exitCode = 1;
    return;
  }
  const manifest = readManifest();
  const existing = manifest.assets[gen.id];
  if (existing?.status === "approved" && !args.force) {
    console.log(`↷ ${gen.id}: already approved, skipping (use --force to regenerate)`);
    return;
  }
  if (existing?.status === "generated" && args.mode === "test" && !args.force) {
    console.log(`↷ ${gen.id}: final already generated, not downgrading to test (use --force)`);
    return;
  }

  const fullPrompt = `${gen.prompt} Avoid: ${NEGATIVE_PROMPT}.`;

  try {
    if (args.type === "video") {
      const reference = existing?.file
        ? path.join(process.cwd(), "public", existing.file)
        : undefined;
      if (!reference || !fs.existsSync(reference)) {
        console.error(`✗ ${gen.id}: generate + approve a reference image before the video pass.`);
        process.exitCode = 1;
        return;
      }
      console.log(`… ${gen.id}: image-to-video (${args.mode}) — this can take a few minutes`);
      const seconds = args.mode === "test" ? 5 : 10;
      const outFile = path.join(process.cwd(), "public", "assets", "videos", `${gen.id}.mp4`);
      // Upload our local reference by data URL is not supported by every
      // model — host the file or pass a public URL when deploying. Locally
      // we inline as base64 data URI which @fal-ai/client uploads for us.
      const imageData = fs.readFileSync(reference);
      const imageUrl = `data:image/png;base64,${imageData.toString("base64")}`;
      const cost = await generateVideo(fullPrompt, {
        imageUrl,
        durationSeconds: seconds,
        outFile,
      });
      manifest.assets[`${gen.id}-video`] = {
        id: `${gen.id}-video`,
        kind: "video",
        status: args.mode === "final" ? "generated" : "test",
        prompt: gen.prompt,
        negativePrompt: NEGATIVE_PROMPT,
        model: "fal-ai/kling-video/v1.6/standard/image-to-video",
        file: `/assets/videos/${gen.id}.mp4`,
        durationSeconds: seconds,
        estimatedCostUsd: cost,
        attempts: (manifest.assets[`${gen.id}-video`]?.attempts ?? 0) + 1,
        generatedAt: new Date().toISOString(),
        notes: gen.sequence ? `convert with: npx tsx scripts/convert-video-to-frames.ts --video public/assets/videos/${gen.id}.mp4 --sequence ${gen.sequence}` : undefined,
      };
      writeManifest(manifest);
      recordCost({ assetId: `${gen.id}-video`, model: "fal-ai/kling-video/v1.6/standard/image-to-video", kind: "video", estimatedCostUsd: cost });
      console.log(`✓ ${gen.id}: video saved (est. $${cost})`);
    } else {
      const model = args.mode === "final" ? "fal-ai/flux/dev" : "fal-ai/flux/schnell";
      const size = args.mode === "final" ? 1536 : 1024;
      const outFile = path.join(process.cwd(), "public", "assets", "references", `${gen.id}.png`);
      console.log(`… ${gen.id}: ${model} @ ${size}px (${args.mode})`);
      const cost = await generateImage(fullPrompt, { model, width: size, height: size, outFile });
      manifest.assets[gen.id] = {
        id: gen.id,
        kind: "reference",
        status: args.mode === "final" ? "generated" : "test",
        prompt: gen.prompt,
        negativePrompt: NEGATIVE_PROMPT,
        model,
        file: `/assets/references/${gen.id}.png`,
        width: size,
        height: size,
        estimatedCostUsd: cost,
        attempts: (existing?.attempts ?? 0) + 1,
        generatedAt: new Date().toISOString(),
      };
      writeManifest(manifest);
      recordCost({ assetId: gen.id, model, kind: "reference", estimatedCostUsd: cost });
      console.log(`✓ ${gen.id}: saved public/assets/references/${gen.id}.png (est. $${cost})`);
    }
  } catch (err) {
    manifest.assets[gen.id] = {
      ...(existing ?? { id: gen.id, kind: "reference" as const, prompt: gen.prompt, attempts: 0 }),
      status: "failed",
      attempts: (existing?.attempts ?? 0) + 1,
      notes: err instanceof Error ? err.message : "generation failed",
    };
    writeManifest(manifest);
    console.error(`✗ ${gen.id}: ${err instanceof Error ? err.message : err}`);
    process.exitCode = 1;
  }
}

async function main(): Promise<void> {
  const args = parseArgs();

  if (args.list) {
    const manifest = readManifest();
    console.log("Available assets:\n");
    for (const p of prompts) {
      const st = manifest.assets[p.id]?.status ?? "pending";
      console.log(`  ${p.id.padEnd(20)} ${st.padEnd(10)} ${p.title}`);
    }
    return;
  }

  if (args.approve) {
    const manifest = readManifest();
    const entry = manifest.assets[args.approve];
    if (!entry) {
      console.error(`✗ nothing generated yet for "${args.approve}"`);
      process.exitCode = 1;
      return;
    }
    entry.status = "approved";
    writeManifest(manifest);
    console.log(`✓ ${args.approve} approved`);
    return;
  }

  if (!falConfigured()) {
    console.error("✗ FAL_KEY / FAL_API_KEY not set — cannot generate. Prompts remain ready in lib/generation/prompts.ts.");
    process.exitCode = 1;
    return;
  }

  const ids = args.all ? prompts.map((p) => p.id) : args.asset ? [args.asset] : [];
  if (ids.length === 0) {
    console.log("Nothing to do. Use --asset <id>, --all, --list or --approve <id>.");
    return;
  }
  for (const id of ids) {
    await generateOne(id, args);
  }
}

main();
