// Pulls page source and static assets from the public GitHub branch at build
// time, so the Vercel deployment payload stays small and every redeploy takes
// the latest committed version of the site.
//
// IMPORTANT: any new file under app/, components/ or public/ must be added to
// the lists below, otherwise the build will reference an asset that 404s.
import { mkdir, writeFile } from "node:fs/promises";
import { dirname } from "node:path";

const BASE =
  "https://raw.githubusercontent.com/ryandhana1515-stack/Bio-Nov-website/claude/bioexcela-global-ecommerce-qt09tk/";

const SOURCE = [
  "app/layout.tsx",
  "app/page.tsx",
  "app/globals.css",
  "components/BioNovSite.tsx",
  "components/XrayJourney.tsx"
];

const IMAGES = [
  "bio-nov-hero.jpg",
  "garlic-product.jpg",
  "lettuce-product.jpg",
  "product-showcase.jpg",
  "ingredient-garlic.jpg",
  "ingredient-lettuce.jpg",
  "ingredient-sprouts.jpg",
  "ingredient-soybean.jpg",
  "vessel-macro.jpg",
  "tech-product.jpg",
  "slide-blood-pressure.jpg",
  "slide-vessel-repair.jpg",
  "slide-hypertension.jpg",
  "slide-stroke.jpg",
  "slide-dementia.jpg",
  "slide-telomeres.jpg",
  "slide-skin.jpg",
  "slide-raw-materials.jpg",
  "slide-fermentation-patents.jpg",
  "slide-tech-roadmap.jpg",
  "slide-better-choice.jpg",
  "researcher-cheon.png",
  "researcher-han.png",
  "researcher-ju.png",
  "researcher-kim.png",
  "researcher-min.png",
  "researcher-pae.png",
  "researcher-shin.png",
  "researcher-sooah.png"
].map((name) => `public/images/${name}`);

const VIDEO = [
  "bio-nov-hero.mp4",
  "bio-nov-hero-poster.jpg",
  "xray-journey.mp4",
  "xray-journey-poster.jpg",
  "blood-flow.mp4",
  "blood-flow-poster.jpg"
].map(
  (name) => `public/video/${name}`
);

const ALL = [...SOURCE, ...IMAGES, ...VIDEO];

async function grab(path) {
  const res = await fetch(BASE + path, { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to fetch ${path}: HTTP ${res.status}`);
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, Buffer.from(await res.arrayBuffer()));
  console.log("fetched", path);
}

await Promise.all(ALL.map(grab));
console.log(`Fetched ${ALL.length} files (${SOURCE.length} source, ${IMAGES.length} images, ${VIDEO.length} video).`);
