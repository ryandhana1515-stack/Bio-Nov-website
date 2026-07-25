/* Scroll-verification for the Eclipse site.
   Serves ../site, scrolls through the page in a headless browser, and checks:
   - each pinned canvas actually changes pixels as scroll progresses (scrub works)
   - overlay text (hero lines, captions, specs, reveals) reaches visibility at its window
   - screenshots at key scroll positions for visual review. */
const { chromium } = require('playwright-core');
const fs = require('fs');
const path = require('path');
const http = require('http');

const SITE = path.join(__dirname, '..', 'site');
const SHOTS = process.env.SHOT_DIR || path.join(__dirname, 'shots');

const MIME = {
  '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css',
  '.jpg': 'image/jpeg', '.png': 'image/png', '.woff2': 'font/woff2', '.svg': 'image/svg+xml',
};
function serve(dir, port) {
  return new Promise((resolve) => {
    const srv = http.createServer((req, res) => {
      let p = decodeURIComponent(req.url.split('?')[0]);
      if (p === '/') p = '/index.html';
      const file = path.join(dir, p);
      fs.readFile(file, (err, data) => {
        if (err) { res.writeHead(404); res.end('404'); return; }
        res.writeHead(200, { 'Content-Type': MIME[path.extname(file)] || 'application/octet-stream' });
        res.end(data);
      });
    });
    srv.listen(port, () => resolve(srv));
  });
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

(async () => {
  fs.mkdirSync(SHOTS, { recursive: true });
  const srv = await serve(SITE, 8080);
  const browser = await chromium.launch({
    executablePath: '/opt/pw-browsers/chromium',
    args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--no-sandbox'],
  });
  const page = await browser.newPage({ viewport: { width: 1440, height: 810 } });
  const errors = [];
  page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
  page.on('console', (m) => { if (m.type() === 'error') errors.push('console: ' + m.text()); });
  page.on('requestfailed', (r) => errors.push('requestfailed: ' + r.url()));

  await page.goto('http://127.0.0.1:8080/');
  // wait for loader to finish (hero frames loaded)
  await page.waitForSelector('#loader.done', { timeout: 120000, state: 'attached' });
  await sleep(2600); // let intro timeline play
  const results = [];
  const canvasHash = (id) => page.evaluate((cid) => {
    const c = document.getElementById(cid);
    const x = c.getContext('2d');
    const d = x.getImageData(0, 0, c.width, c.height).data;
    let h = 0, n = 0;
    for (let i = 0; i < d.length; i += 4096) { h = (h * 31 + d[i] + d[i + 1] + d[i + 2]) >>> 0; n += d[i] + d[i + 1] + d[i + 2]; }
    return { h, n };
  }, id);

  const scrollTo = async (y) => {
    await page.evaluate((yy) => window.__lenisScroll(yy), y);
    await sleep(900);
  };
  // expose immediate scroll through lenis
  await page.evaluate(() => {
    window.__lenisScroll = (y) => window.scrollTo(0, y);
  });

  const layout = await page.evaluate(() => {
    const q = (s) => { const el = document.querySelector(s); const r = el.getBoundingClientRect(); return { top: r.top + window.scrollY, height: r.height }; };
    return {
      total: document.documentElement.scrollHeight,
      hero: q('#hero'), story: q('#story'), macro: q('#macro'),
      engineering: q('#engineering'), edition: q('#edition'), waitlist: q('#waitlist'),
    };
  });
  console.log('layout:', JSON.stringify(layout, null, 1));

  const opacity = (sel) => page.evaluate((s) => {
    const el = document.querySelector(s);
    return el ? +getComputedStyle(el).opacity : null;
  }, sel);

  async function checkScrub(name, sectionTop, sectionLen, canvasId, probes) {
    const hashes = [];
    for (const f of probes) {
      await scrollTo(sectionTop + sectionLen * f);
      hashes.push((await canvasHash(canvasId)).h);
    }
    const distinct = new Set(hashes).size;
    const ok = distinct >= Math.max(2, probes.length - 1);
    results.push([`${name}: canvas scrubs (${distinct}/${probes.length} distinct frames)`, ok]);
  }

  // ---- HERO ----
  await scrollTo(0);
  await sleep(400);
  const heroTitleOp = await opacity('.hero-title span');
  results.push(['hero: brand letters tracked in (opacity 1)', heroTitleOp === 1]);
  await page.screenshot({ path: path.join(SHOTS, '01-hero-top.png') });

  const heroLen = layout.hero.height - 810; // pin distance
  await checkScrub('hero orbit', layout.hero.top, heroLen, 'heroCanvas', [0.05, 0.25, 0.5, 0.75, 0.95]);
  await scrollTo(layout.hero.top + heroLen * 0.33);
  const l1 = await opacity('.hero-line-1');
  await page.screenshot({ path: path.join(SHOTS, '02-hero-mid-orbit.png') });
  await scrollTo(layout.hero.top + heroLen * 0.68);
  const l2 = await opacity('.hero-line-2');
  results.push(['hero: pinned text line 1 reveals mid-orbit', l1 > 0.5]);
  results.push(['hero: pinned text line 2 reveals late-orbit', l2 > 0.5]);
  const heroCopyOp = await opacity('.hero-copy');
  results.push(['hero: title recedes once orbit begins', heroCopyOp < 0.2]);

  // ---- STORY ----
  await scrollTo(layout.story.top + 400);
  await sleep(1400);
  const storyOp = await opacity('.story-title');
  results.push(['story: "Crafted in Darkness" reveal fires', storyOp > 0.85]);
  await page.screenshot({ path: path.join(SHOTS, '03-story.png') });

  // ---- MACRO ----
  const macroLen = layout.macro.height - 810;
  await checkScrub('macro fly-through', layout.macro.top, macroLen, 'macroCanvas', [0.05, 0.3, 0.6, 0.9]);
  await scrollTo(layout.macro.top + macroLen * 0.16);
  const c1 = await opacity('.macro-caption-1');
  await page.screenshot({ path: path.join(SHOTS, '04-macro-caption1.png') });
  await scrollTo(layout.macro.top + macroLen * 0.5);
  const c2 = await opacity('.macro-caption-2');
  await scrollTo(layout.macro.top + macroLen * 0.84);
  const c3 = await opacity('.macro-caption-3');
  await page.screenshot({ path: path.join(SHOTS, '05-macro-caption3.png') });
  results.push(['macro: caption 1 pinned reveal', c1 > 0.5]);
  results.push(['macro: caption 2 pinned reveal', c2 > 0.5]);
  results.push(['macro: caption 3 pinned reveal', c3 > 0.5]);

  // ---- EXPLODED ----
  const engLen = layout.engineering.height - 810;
  await checkScrub('exploded assembly', layout.engineering.top, engLen, 'explodedCanvas', [0.05, 0.3, 0.6, 0.95]);
  await scrollTo(layout.engineering.top + engLen * 0.3);
  const s1 = await opacity('.spec-1');
  await page.screenshot({ path: path.join(SHOTS, '06-exploded-spec1.png') });
  await scrollTo(layout.engineering.top + engLen * 0.56);
  const s2 = await opacity('.spec-2');
  await scrollTo(layout.engineering.top + engLen * 0.82);
  const s3 = await opacity('.spec-3');
  await page.screenshot({ path: path.join(SHOTS, '07-exploded-spec3.png') });
  results.push(['exploded: 42mm spec callout', s1 > 0.5]);
  results.push(['exploded: 72h spec callout', s2 > 0.5]);
  results.push(['exploded: 217-component spec callout', s3 > 0.5]);

  // ---- EDITION + WAITLIST ----
  await scrollTo(layout.edition.top + 300);
  await sleep(1400);
  const ed = await opacity('.edition-title');
  results.push(['edition: "Edition of 88 — $48,000" reveal', ed > 0.85]);
  await page.screenshot({ path: path.join(SHOTS, '08-edition.png') });

  await scrollTo(layout.waitlist.top + 200);
  await sleep(1400);
  const wl = await opacity('.waitlist-form');
  results.push(['waitlist: CTA reveal', wl > 0.85]);
  await page.evaluate(() => {
    document.querySelector('.waitlist-form input').value = 'collector@example.com';
    document.querySelector('.waitlist-form button').click();
  });
  await sleep(300);
  const done = await page.evaluate(() => getComputedStyle(document.getElementById('waitlistDone')).display);
  results.push(['waitlist: submit swaps to confirmation', done === 'block']);
  await page.screenshot({ path: path.join(SHOTS, '09-waitlist.png') });

  // smooth-scroll sanity: lenis active
  const lenisActive = await page.evaluate(() => document.documentElement.classList.contains('lenis'));
  results.push(['lenis smooth scroll active', lenisActive]);

  console.log('\n==== RESULTS ====');
  let pass = 0;
  for (const [label, ok] of results) { console.log((ok ? 'PASS' : 'FAIL') + '  ' + label); if (ok) pass++; }
  console.log(`\n${pass}/${results.length} checks passed`);
  if (errors.length) { console.log('\npage errors:'); errors.slice(0, 12).forEach((e) => console.log(' -', e)); }

  await browser.close();
  srv.close();
  process.exit(pass === results.length && errors.length === 0 ? 0 : 1);
})().catch((e) => { console.error(e); process.exit(1); });
