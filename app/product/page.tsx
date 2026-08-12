import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft, Award, FlaskConical, Leaf } from "lucide-react";
import ProductBuyBox from "@/components/ProductBuyBox";
import { CURRENCY, PRODUCT, SHOP_DOMAIN, VARIANTS, formatPrice } from "@/lib/product";

export const metadata: Metadata = {
  title: "BIO N:OV — 3rd Generation Nitric Oxide Supplement",
  description:
    "BIO N:OV is a fermentation-based food supplement made with naturally fermented garlic, lettuce and soybean. 500 mg × 60 tablets. Bundles from S$49 per box.",
};

// Product schema drives rich results for search and shopping ads. Claims are
// kept to verifiable product facts — no health or disease statements.
const productSchema = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: `${PRODUCT.title} — ${PRODUCT.subtitle}`,
  description:
    "A fermentation-based food supplement produced with a proprietary microbial strain and naturally fermented plant ingredients.",
  brand: { "@type": "Brand", name: "Bio Green Elixirs" },
  offers: VARIANTS.map((v) => ({
    "@type": "Offer",
    name: v.title,
    sku: v.sku,
    price: v.price.toFixed(2),
    priceCurrency: CURRENCY,
    availability: "https://schema.org/InStock",
    url: `https://${SHOP_DOMAIN}/cart/${v.id}:1`,
  })),
};

const credentials = [
  [FlaskConical, "Patented fermentation", `Developed with proprietary microbial strain ${PRODUCT.strain}, owned by the ${PRODUCT.strainOwner}.`],
  [Award, "GMP certified", "Manufactured under Good Manufacturing Practice certification. Certificates available on request."],
  [Leaf, "Naturally fermented", "A fermented composition of natural vegetables and herbs, with no synthetic actives."],
] as const;

export default function ProductPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />
      <main className="product-page">
        <header className="product-page-nav">
          <Link href="/" className="brand" aria-label="BIO N:OV home">
            <span className="brand-mark">V</span>
            <span>BIO N:OV</span>
          </Link>
          <Link href="/" className="back-link">
            <ArrowLeft size={15} /> Back to site
          </Link>
        </header>

        <div className="product-layout">
          {/* Only one usable product photograph exists today: product-showcase.jpg
              is a corrupt PNG, and the garlic/lettuce files are presentation
              slides rather than product shots. Add more once real photography
              is available. */}
          <div className="product-gallery">
            <Image src="/images/product-showcase.jpg" alt="BIO N:OV product box, blister pack and tablets" width={1920} height={1080} priority />
          </div>
          <ProductBuyBox />
        </div>

        <section className="product-credentials">
          {credentials.map(([Icon, title, copy]) => (
            <article key={title}>
              <Icon />
              <h2>{title}</h2>
              <p>{copy}</p>
            </article>
          ))}
        </section>

        <footer className="product-page-footer">
          <p>
            Prices shown in Singapore dollars. Orders are fulfilled through the Bio Green Elixirs
            Shopify store, where shipping and taxes are calculated at checkout.
          </p>
          <p className="medical-disclaimer">
            This website provides general educational and product information only. It is not
            intended as medical advice, diagnosis or treatment. Always follow the authorised
            product label and consult a qualified healthcare professional when appropriate.
          </p>
          <small>© {new Date().getFullYear()} BIO N:OV. Bundles from {formatPrice(VARIANTS[2].price / VARIANTS[2].boxes)} per box.</small>
        </footer>
      </main>
    </>
  );
}
