/**
 * Rough published price points for the models this project uses.
 * These are estimates for budgeting only — always confirm on fal.ai
 * before large batches. Test generations use the cheapest image model.
 */
export const MODEL_PRICING: Record<string, { unit: "megapixel" | "video-second" | "image"; usd: number }> = {
  "fal-ai/flux/schnell": { unit: "megapixel", usd: 0.003 },
  "fal-ai/flux/dev": { unit: "megapixel", usd: 0.025 },
  "fal-ai/kling-video/v1.6/standard/image-to-video": { unit: "video-second", usd: 0.045 },
  "fal-ai/minimax/video-01/image-to-video": { unit: "image", usd: 0.5 },
};

export function estimateImageCost(model: string, width: number, height: number): number {
  const price = MODEL_PRICING[model];
  if (!price) return 0;
  if (price.unit === "image") return price.usd;
  const megapixels = (width * height) / 1_000_000;
  return Number((price.usd * megapixels).toFixed(4));
}

export function estimateVideoCost(model: string, seconds: number): number {
  const price = MODEL_PRICING[model];
  if (!price) return 0;
  if (price.unit === "image") return price.usd;
  return Number((price.usd * seconds).toFixed(4));
}
