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
  "components/MoleculeScene.tsx",
  "components/VesselScene.tsx",
  "components/BodyScene.tsx"
];

const IMAGES = [
  "bio-nov-hero.jpg",
  "body-systems.png",
  "garlic-product.jpg",
  "lettuce-product.jpg",
  "product-showcase.jpg",
  "researcher-cheon.png",
  "researcher-han.png",
  "researcher-ju.png",
  "researcher-kim.png",
  "researcher-min.png",
  "researcher-pae.png",
  "researcher-shin.png",
  "researcher-sooah.png"
].map((name) => `public/images/${name}`);

const VIDEO = ["bio-nov-hero.mp4", "bio-nov-hero-poster.jpg"].map(
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
