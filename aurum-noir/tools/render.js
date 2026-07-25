/* Headless frame-sequence renderer for the Eclipse rig. */
const { chromium } = require('playwright-core');
const fs = require('fs');
const path = require('path');
const http = require('http');

const TOOLS = __dirname;
const OUT = path.join(TOOLS, '..', 'site', 'frames');

const SEQUENCES = [
  { name: 'hero', frames: 160, quality: 0.7 },
  { name: 'macro', frames: 120, quality: 0.7 },
  { name: 'exploded', frames: 140, quality: 0.7 },
];

// tiny static server for the rig page (file:// blocks ES modules)
function serve(dir, port) {
  const types = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript' };
  return new Promise((resolve) => {
    const srv = http.createServer((req, res) => {
      const p = path.join(dir, decodeURIComponent(req.url.split('?')[0]));
      fs.readFile(p, (err, data) => {
        if (err) { res.writeHead(404); res.end(); return; }
        res.writeHead(200, { 'Content-Type': types[path.extname(p)] || 'application/octet-stream' });
        res.end(data);
      });
    });
    srv.listen(port, () => resolve(srv));
  });
}

(async () => {
  const only = process.argv[2]; // optional: render a single sequence
  const srv = await serve(TOOLS, 4517);
  const browser = await chromium.launch({
    executablePath: '/opt/pw-browsers/chromium',
    args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--disable-gpu-sandbox', '--no-sandbox'],
  });
  const page = await browser.newPage({ viewport: { width: 1600, height: 900 } });
  page.on('console', (m) => { if (m.type() === 'error') console.error('[page]', m.text()); });
  page.on('pageerror', (e) => console.error('[pageerror]', e.message));
  await page.goto('http://127.0.0.1:4517/scene.html');
  await page.waitForFunction('window.rigReady === true', { timeout: 60000 });

  for (const seq of SEQUENCES) {
    if (only && seq.name !== only) continue;
    const dir = path.join(OUT, seq.name);
    fs.mkdirSync(dir, { recursive: true });
    const t0 = Date.now();
    for (let i = 0; i < seq.frames; i++) {
      const t = seq.frames === 1 ? 0 : i / (seq.frames - 1);
      const dataUrl = await page.evaluate(
        ([s, tt, q]) => window.renderFrame(s, tt, q),
        [seq.name, seq.name === 'hero' ? i / seq.frames : t, seq.quality] // hero: exclude t=1 (== t=0) for seamless loop
      );
      const buf = Buffer.from(dataUrl.split(',')[1], 'base64');
      fs.writeFileSync(path.join(dir, `f${String(i).padStart(4, '0')}.jpg`), buf);
      if (i % 20 === 0) console.log(`${seq.name} ${i}/${seq.frames} (${((Date.now() - t0) / 1000).toFixed(1)}s)`);
    }
    console.log(`${seq.name}: ${seq.frames} frames in ${((Date.now() - t0) / 1000).toFixed(1)}s`);
  }

  // hero still (the "reference image" equivalent + og/poster)
  const still = await page.evaluate(() => window.renderFrame('hero', 0.085, 0.85));
  fs.writeFileSync(path.join(OUT, '..', 'eclipse-hero.jpg'), Buffer.from(still.split(',')[1], 'base64'));

  await browser.close();
  srv.close();
  console.log('done');
})().catch((e) => { console.error(e); process.exit(1); });
