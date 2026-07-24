import { NextRequest, NextResponse } from "next/server";
import { falConfigured, generateImage, readManifest, writeManifest, recordCost } from "@/lib/generation/fal";
import { getPrompt, NEGATIVE_PROMPT } from "@/lib/generation/prompts";
import path from "node:path";

export const runtime = "nodejs";

/**
 * Admin-only asset generation endpoint. Guarded twice:
 *  - refuses to run unless FAL_KEY is configured server-side
 *  - outside development it requires ASSET_ADMIN_TOKEN via x-admin-token
 * The API key itself never leaves the server and is never echoed back.
 */
export async function POST(req: NextRequest) {
  if (!falConfigured()) {
    return NextResponse.json({ error: "fal.ai is not configured on the server." }, { status: 503 });
  }
  const adminToken = process.env.ASSET_ADMIN_TOKEN;
  if (process.env.NODE_ENV !== "development") {
    if (!adminToken || req.headers.get("x-admin-token") !== adminToken) {
      return NextResponse.json({ error: "Unauthorised." }, { status: 401 });
    }
  }

  let body: { promptId?: string; mode?: "test" | "final" };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const gen = body.promptId ? getPrompt(body.promptId) : undefined;
  if (!gen) {
    return NextResponse.json({ error: "Unknown promptId." }, { status: 400 });
  }

  const mode = body.mode ?? "test";
  const manifest = readManifest();
  const existing = manifest.assets[gen.id];
  if (existing?.status === "approved") {
    return NextResponse.json({ ok: true, skipped: "already approved", asset: existing });
  }

  const model = mode === "final" ? "fal-ai/flux/dev" : "fal-ai/flux/schnell";
  const size = mode === "final" ? 1536 : 1024;
  const file = path.join(process.cwd(), "public", "assets", "references", `${gen.id}.png`);

  try {
    const cost = await generateImage(`${gen.prompt} Avoid: ${NEGATIVE_PROMPT}.`, {
      model,
      width: size,
      height: size,
      outFile: file,
    });
    manifest.assets[gen.id] = {
      id: gen.id,
      kind: "reference",
      status: mode === "final" ? "generated" : "test",
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
    return NextResponse.json({ ok: true, asset: manifest.assets[gen.id] });
  } catch (err) {
    manifest.assets[gen.id] = {
      ...(existing ?? { id: gen.id, kind: "reference", prompt: gen.prompt, attempts: 0 }),
      status: "failed",
      attempts: (existing?.attempts ?? 0) + 1,
      notes: err instanceof Error ? err.message : "generation failed",
    };
    writeManifest(manifest);
    return NextResponse.json({ error: "Generation failed. See manifest for details." }, { status: 502 });
  }
}
