// Pulls page source and static assets from the public GitHub branch at build
// time, so the Vercel deployment payload stays small and every redeploy takes
// the latest committed version of the site.
//
// IMPORTANT: any new file under app/, components/ or public/ must be added to
// the lists below, otherwise the build will reference an asset that 404s.
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname } from "node:path";

const BASE =
  "https://raw.githubusercontent.com/ryandhana1515-stack/Bio-Nov-website/claude/bioexcela-global-ecommerce-qt09tk/";

const SOURCE = [
  "app/layout.tsx",
  "app/page.tsx",
  "app/globals.css",
  "app/product/page.tsx",
  "components/BioNovSite.tsx",
  "components/ProductBuyBox.tsx",
  "components/SystemScenes.tsx",
  "components/XrayJourney.tsx",
  "components/i18n.ts",
  "components/vitality/VitalityEmbed.tsx",
  "components/vitality/VitalityExplorer.tsx",
  "components/vitality/data.ts",
  "components/vitality/useNarration.ts",
  "lib/product.ts"
];

const IMAGES = [
  "cert-cn-patent.jpg",
  "cert-gmp.jpg",
  "cert-kr-patent.jpg",
  "cert-us-patent.jpg",
  "ingredient-garlic.jpg",
  "ingredient-lettuce.jpg",
  "ingredient-soybean.jpg",
  "ingredient-sprouts.jpg",
  "product-showcase.jpg",
  "scene-circulation.jpg",
  "researcher-cheon.png",
  "researcher-han.png",
  "researcher-ju.png",
  "researcher-kim.png",
  "researcher-min.png",
  "researcher-pae.png",
  "researcher-shin.png",
  "researcher-sooah.png",
  "tech-product.jpg",
  "vessel-macro.jpg",
  // The original brochure slides, shown at the foot of the panels rebuilt from
  // them. The rebuilt text carries the meaning into every language; these carry
  // the impact.
  "slide-better-choice.jpg",
  "slide-blood-pressure.jpg",
  "slide-dementia.jpg",
  "slide-diabetes-ease.jpg",
  "slide-diabetes.jpg",
  "slide-fermentation-patents.jpg",
  "slide-hypertension.jpg",
  "slide-raw-materials.jpg",
  "slide-six-systems.jpg",
  "slide-skin.jpg",
  "slide-stroke.jpg",
  "slide-tech-roadmap.jpg",
  "slide-telomeres.jpg",
  "slide-vessel-repair.jpg",
  "slide-vigor.jpg"
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

/* Photoreal renders for the six system scenes.
 *
 * These are pulled straight from the generator's CDN at build time rather than
 * committed, because the sandbox that authors this repo cannot reach those
 * hosts — the build machine can. Each entry names the file it lands as and a
 * fallback already in the repo.
 *
 * A miss here must never fail the build: an expired CDN link would otherwise
 * take the whole site down. On failure we copy the fallback instead and say so
 * in the log, and the scene falls back to its drawn version if even that is
 * missing. */
const RENDERS = [
  // { name: "scene-circulation.jpg", url: "https://…", fallback: "vessel-macro.jpg" },
];

const ALL = [...SOURCE, ...IMAGES, ...VIDEO];

async function grab(path) {
  const res = await fetch(BASE + path, { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to fetch ${path}: HTTP ${res.status}`);
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, Buffer.from(await res.arrayBuffer()));
  console.log("fetched", path);
}

async function grabRender({ name, url, fallback }) {
  const dest = `public/images/${name}`;
  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.byteLength < 1024) throw new Error(`suspiciously small (${buf.byteLength} bytes)`);
    await writeFile(dest, buf);
    console.log("rendered", dest, `(${Math.round(buf.byteLength / 1024)} KB)`);
  } catch (err) {
    console.warn(`WARN  ${name}: ${err.message} — falling back to ${fallback}`);
    await grab(`public/images/${fallback}`);
    await writeFile(dest, await readFile(`public/images/${fallback}`));
  }
}

await Promise.all(ALL.map(grab));
if (RENDERS.length) await Promise.all(RENDERS.map(grabRender));
console.log(
  `Fetched ${ALL.length} files (${SOURCE.length} source, ${IMAGES.length} images, ` +
  `${VIDEO.length} video) plus ${RENDERS.length} renders.`
);
