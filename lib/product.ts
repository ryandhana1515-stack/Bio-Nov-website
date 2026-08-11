/**
 * BIO N:OV product + variant data.
 *
 * Variant IDs, SKUs and prices mirror the Shopify catalogue (shop: Bio Elixirs,
 * SGD). Keep them in sync with Shopify — a stale variant ID sends the customer
 * to an empty cart.
 */

export type Variant = {
  /** Numeric Shopify variant ID, as used in cart permalinks. */
  id: string;
  sku: string;
  title: string;
  /** Number of boxes in the bundle. */
  boxes: number;
  /** Bundle price in SGD. */
  price: number;
};

export const CURRENCY = "SGD";

/** Storefront domain used to build cart permalinks. */
export const SHOP_DOMAIN =
  process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN ?? "sz0gmr-cn.myshopify.com";

export const VARIANTS: Variant[] = [
  { id: "50045773545722", sku: "BGX-NOV-1", title: "1 Box", boxes: 1, price: 69 },
  { id: "50045773578490", sku: "BGX-NOV-3", title: "3 Boxes", boxes: 3, price: 177 },
  { id: "50045773611258", sku: "BGX-NOV-6", title: "6 Boxes", boxes: 6, price: 294 },
];

/** The single-box price every bundle is discounted against. */
const UNIT_PRICE = VARIANTS[0].price / VARIANTS[0].boxes;

export const PRODUCT = {
  title: "BIO N:OV",
  subtitle: "3rd Generation Nitric Oxide Supplement",
  /** Per the authorised label. */
  spec: "500 mg × 60 tablets",
  netWeight: "30 g",
  /** Source: supplied product presentation, p.29. */
  usage: "3 times per day, 1 tablet per time",
  storage: "Store in a cool, dry place away from heat and direct sunlight.",
  /** Source: supplied product presentation, p.28. */
  strain: "KACC91554P",
  strainOwner: "Korea Research Institute of Bioscience and Biotechnology",
  ingredients: ["Fermented Garlic", "Fermented Lettuce", "Soybean", "Soybean Sprouts"],
};

export function pricePerBox(variant: Variant): number {
  return variant.price / variant.boxes;
}

/** Amount saved against buying the same number of boxes singly. */
export function savings(variant: Variant): number {
  return UNIT_PRICE * variant.boxes - variant.price;
}

export function savingsPercent(variant: Variant): number {
  const full = UNIT_PRICE * variant.boxes;
  return full === 0 ? 0 : Math.round((savings(variant) / full) * 100);
}

/**
 * Prices carry an explicit "S$" prefix. Intl formats SGD as a bare "$" in both
 * en-SG and en-US narrowSymbol, which reads as USD to overseas visitors.
 */
export function formatPrice(amount: number): string {
  const digits = Number.isInteger(amount) ? 0 : 2;
  const value = new Intl.NumberFormat("en-SG", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
  return `S$${value}`;
}

export function findVariant(id: string): Variant | undefined {
  return VARIANTS.find((v) => v.id === id);
}

/**
 * Build a Shopify cart permalink that drops the customer straight into
 * checkout. Chosen over the Storefront API because it needs no access token;
 * swap in a Storefront cart mutation if an on-site cart is ever needed.
 *
 * Rejects unknown variants and non-positive quantities rather than sending a
 * customer to a broken cart.
 */
export function cartUrl(variantId: string, quantity: number): string {
  if (!findVariant(variantId)) {
    throw new Error(`Unknown variant: ${variantId}`);
  }
  if (!Number.isInteger(quantity) || quantity < 1) {
    throw new Error(`Quantity must be a positive integer, got: ${quantity}`);
  }
  return `https://${SHOP_DOMAIN}/cart/${variantId}:${quantity}`;
}
