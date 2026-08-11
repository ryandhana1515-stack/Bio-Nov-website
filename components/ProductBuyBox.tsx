"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Minus, Plus, ShieldCheck, ShoppingBag, Truck } from "lucide-react";
import { PRODUCT, VARIANTS, cartUrl, formatPrice, pricePerBox, savings, savingsPercent } from "@/lib/product";

const MAX_QUANTITY = 10;

export default function ProductBuyBox() {
  // Default to the 3-box bundle: the mid tier is the one most buyers land on.
  const [variantId, setVariantId] = useState(VARIANTS[1].id);
  const [quantity, setQuantity] = useState(1);
  const variant = VARIANTS.find((v) => v.id === variantId) ?? VARIANTS[0];

  return (
    <div className="buy-box">
      <span className="eyebrow">{PRODUCT.subtitle}</span>
      <h1>{PRODUCT.title}</h1>
      <div className="specs">
        <span>{PRODUCT.spec}</span>
        <span>{PRODUCT.netWeight}</span>
      </div>

      <fieldset className="bundles">
        <legend>Choose your bundle</legend>
        {VARIANTS.map((v) => {
          const saved = savings(v);
          return (
            <label key={v.id} className={v.id === variantId ? "bundle selected" : "bundle"}>
              <input
                type="radio"
                name="bundle"
                value={v.id}
                checked={v.id === variantId}
                onChange={() => setVariantId(v.id)}
              />
              <span className="bundle-check">{v.id === variantId && <Check size={13} />}</span>
              <span className="bundle-name">
                <b>{v.title}</b>
                <small>{formatPrice(pricePerBox(v))} per box</small>
              </span>
              <span className="bundle-price">
                <b>{formatPrice(v.price)}</b>
                {saved > 0 && <small>Save {formatPrice(saved)}</small>}
              </span>
              {savingsPercent(v) > 0 && <span className="bundle-badge">−{savingsPercent(v)}%</span>}
            </label>
          );
        })}
      </fieldset>

      <div className="buy-actions">
        <div className="qty" role="group" aria-label="Quantity">
          <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} aria-label="Decrease quantity" disabled={quantity <= 1}>
            <Minus size={15} />
          </button>
          <span aria-live="polite">{quantity}</span>
          <button onClick={() => setQuantity((q) => Math.min(MAX_QUANTITY, q + 1))} aria-label="Increase quantity" disabled={quantity >= MAX_QUANTITY}>
            <Plus size={15} />
          </button>
        </div>
        <motion.a
          className="button primary add-to-cart"
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.98 }}
          href={cartUrl(variant.id, quantity)}
        >
          <ShoppingBag size={18} /> Add to cart — {formatPrice(variant.price * quantity)}
        </motion.a>
      </div>

      <div className="buy-trust">
        <span><ShieldCheck size={15} /> Secure checkout via Shopify</span>
        <span><Truck size={15} /> Ships from Singapore</span>
      </div>

      <dl className="buy-facts">
        <div><dt>Usage</dt><dd>{PRODUCT.usage}</dd></div>
        <div><dt>Ingredients</dt><dd>{PRODUCT.ingredients.join(", ")}</dd></div>
        <div><dt>Storage</dt><dd>{PRODUCT.storage}</dd></div>
      </dl>

      <p className="buy-disclaimer">
        This is a food supplement and is not intended to diagnose, treat, cure or prevent any
        disease. Use only according to the authorised product label. Consult a qualified
        healthcare professional if you are pregnant, breastfeeding, taking medication or
        managing a medical condition.
      </p>
    </div>
  );
}
