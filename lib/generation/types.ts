export type AssetKind = "reference" | "first-frame" | "final-frame" | "video" | "poster" | "og";

export type AssetStatus = "pending" | "test" | "generated" | "approved" | "failed";

export type AssetEntry = {
  id: string;
  kind: AssetKind;
  status: AssetStatus;
  prompt: string;
  negativePrompt?: string;
  model?: string;
  file?: string;
  width?: number;
  height?: number;
  durationSeconds?: number;
  estimatedCostUsd?: number;
  attempts: number;
  generatedAt?: string;
  notes?: string;
};

export type AssetManifest = {
  version: number;
  assets: Record<string, AssetEntry>;
};

export type CostEntry = {
  assetId: string;
  model: string;
  kind: AssetKind;
  estimatedCostUsd: number;
  at: string;
};

export type CostLedger = {
  totalEstimatedUsd: number;
  entries: CostEntry[];
};
