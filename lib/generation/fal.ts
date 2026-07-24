/**
 * Server-side fal.ai wrapper. SERVER / SCRIPTS ONLY — never import this
 * from a client component. The API key is read from the environment
 * (FAL_KEY or FAL_API_KEY) and never logged or returned to a browser.
 */
import { fal } from "@fal-ai/client";
import fs from "node:fs";
import path from "node:path";
import { AssetEntry, AssetManifest, CostLedger } from "./types";
import { estimateImageCost, estimateVideoCost } from "./costs";

const MANIFEST_PATH = path.join(process.cwd(), "data", "asset-manifest.json");
const COSTS_PATH = path.join(process.cwd(), "data", "generation-costs.json");

export function falConfigured(): boolean {
  return Boolean(process.env.FAL_KEY || process.env.FAL_API_KEY);
}

let configured = false;
function ensureConfigured(): void {
  if (configured) return;
  const key = process.env.FAL_KEY || process.env.FAL_API_KEY;
  if (!key) throw new Error("FAL_KEY / FAL_API_KEY is not set in the environment.");
  fal.config({ credentials: key });
  configured = true;
}

export function readManifest(): AssetManifest {
  try {
    return JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf8")) as AssetManifest;
  } catch {
    return { version: 1, assets: {} };
  }
}

export function writeManifest(manifest: AssetManifest): void {
  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2));
}

export function readCosts(): CostLedger {
  try {
    return JSON.parse(fs.readFileSync(COSTS_PATH, "utf8")) as CostLedger;
  } catch {
    return { totalEstimatedUsd: 0, entries: [] };
  }
}

export function recordCost(entry: { assetId: string; model: string; kind: AssetEntry["kind"]; estimatedCostUsd: number }): void {
  const ledger = readCosts();
  ledger.entries.push({ ...entry, at: new Date().toISOString() });
  ledger.totalEstimatedUsd = Number(
    ledger.entries.reduce((s, e) => s + e.estimatedCostUsd, 0).toFixed(4)
  );
  fs.writeFileSync(COSTS_PATH, JSON.stringify(ledger, null, 2));
}

async function download(url: string, outFile: string): Promise<void> {
  fs.mkdirSync(path.dirname(outFile), { recursive: true });
  if (url.startsWith("data:")) {
    // sync_mode responses inline the file as a data URI
    const base64 = url.slice(url.indexOf(",") + 1);
    fs.writeFileSync(outFile, Buffer.from(base64, "base64"));
    return;
  }
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Download failed (${res.status}) for ${url}`);
  fs.writeFileSync(outFile, Buffer.from(await res.arrayBuffer()));
}

type ImageResult = { images?: { url: string; width?: number; height?: number }[] };
type VideoResult = { video?: { url: string } };

export type GenerateImageOptions = {
  model?: string;
  width?: number;
  height?: number;
  outFile: string;
  negativePrompt?: string;
};

/** Generate a single image and save it to outFile. Returns estimated cost. */
export async function generateImage(prompt: string, opts: GenerateImageOptions): Promise<number> {
  ensureConfigured();
  const model = opts.model ?? "fal-ai/flux/schnell";
  const width = opts.width ?? 1024;
  const height = opts.height ?? 1024;

  const result = await fal.subscribe(model, {
    input: {
      prompt,
      image_size: { width, height },
      num_images: 1,
      enable_safety_checker: true,
      // return the image inline (data URI) — survives networks that
      // block the fal CDN, and avoids a second round-trip
      sync_mode: true,
    },
    logs: false,
  });

  const data = result.data as ImageResult;
  const image = data.images?.[0];
  if (!image?.url) throw new Error(`No image returned by ${model}`);
  await download(image.url, opts.outFile);
  return estimateImageCost(model, width, height);
}

export type GenerateVideoOptions = {
  model?: string;
  imageUrl?: string;
  durationSeconds?: number;
  outFile: string;
};

/**
 * Generate an image-to-video clip and save it to outFile.
 * Uses the queue API via subscribe so long renders are polled safely.
 */
export async function generateVideo(prompt: string, opts: GenerateVideoOptions): Promise<number> {
  ensureConfigured();
  const model = opts.model ?? "fal-ai/kling-video/v1.6/standard/image-to-video";
  const seconds = opts.durationSeconds ?? 5;

  const result = await fal.subscribe(model, {
    input: {
      prompt,
      image_url: opts.imageUrl,
      duration: String(seconds),
    },
    logs: false,
  });

  const data = result.data as VideoResult;
  if (!data.video?.url) throw new Error(`No video returned by ${model}`);
  await download(data.video.url, opts.outFile);
  return estimateVideoCost(model, seconds);
}
