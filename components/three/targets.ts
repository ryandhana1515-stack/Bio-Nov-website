import * as THREE from "three";

/**
 * Procedurally builds the eleven morph targets of the master particle
 * system and packs them into one float DataTexture (sampled by index in
 * the vertex shader). Everything is seeded so server/client and repeat
 * visits agree.
 *
 * Targets:
 *  0 fibrous curiosity core      6 journey line
 *  1 flowing strands             7 philosophy orbit rings
 *  2 symbolic head point cloud   8 future horizon field
 *  3 fingerprint contour face    9 collapsed point
 *  4 calm silhouette            10 mini core (final loop)
 */

export const TARGET_COUNT = 11;
const TEX_WIDTH = 256;

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** cheap value noise for shaping (not rendered directly) */
function vnoise(x: number, y: number, z: number): number {
  const s = Math.sin(x * 12.9898 + y * 78.233 + z * 37.719) * 43758.5453;
  return s - Math.floor(s);
}

function fbm(x: number, y: number, z: number): number {
  return (
    0.6 * Math.sin(x * 1.7 + Math.sin(y * 2.3)) +
    0.3 * Math.sin(y * 3.1 + Math.sin(z * 1.9)) +
    0.1 * Math.sin(z * 5.3 + Math.sin(x * 2.7))
  );
}

// ---------------------------------------------------------------- head SDF

function sdEllipsoid(px: number, py: number, pz: number, cx: number, cy: number, cz: number, rx: number, ry: number, rz: number): number {
  const x = (px - cx) / rx;
  const y = (py - cy) / ry;
  const z = (pz - cz) / rz;
  const k0 = Math.sqrt(x * x + y * y + z * z);
  return (k0 - 1) * Math.min(rx, Math.min(ry, rz));
}

/** symbolic, deliberately non-identifiable head: skull + jaw + neck */
function headSdf(x: number, y: number, z: number): number {
  const skull = sdEllipsoid(x, y, z, 0, 0.28, -0.05, 0.62, 0.72, 0.7);
  const jaw = sdEllipsoid(x, y, z, 0, -0.38, 0.12, 0.42, 0.5, 0.5);
  const neck = sdEllipsoid(x, y, z, 0, -0.95, -0.05, 0.26, 0.5, 0.28);
  // smooth union
  const k = 0.18;
  const su = (a: number, b: number) => {
    const h = Math.max(k - Math.abs(a - b), 0) / k;
    return Math.min(a, b) - h * h * k * 0.25;
  };
  return su(su(skull, jaw), neck);
}

function sampleHead(rand: () => number, count: number): Float32Array {
  const pts = new Float32Array(count * 3);
  let placed = 0;
  let guard = 0;
  while (placed < count && guard < count * 400) {
    guard++;
    const x = (rand() * 2 - 1) * 0.9;
    const y = (rand() * 2 - 1) * 1.5 - 0.1;
    const z = (rand() * 2 - 1) * 0.9;
    const d = headSdf(x, y, z);
    if (Math.abs(d) < 0.035) {
      const i = placed * 3;
      // rotate toward a three-quarter view and lift to eye line
      const a = -0.55;
      const rx = x * Math.cos(a) + z * Math.sin(a);
      const rz = -x * Math.sin(a) + z * Math.cos(a);
      pts[i] = rx * 1.05;
      pts[i + 1] = y * 1.05 + 0.1;
      pts[i + 2] = rz * 1.05;
      placed++;
    }
  }
  // fill any shortfall deterministically on the skull ellipsoid
  for (; placed < count; placed++) {
    const t = placed / count;
    const i = placed * 3;
    const phi = t * Math.PI * 2 * 13.7;
    const ct = 1 - 2 * ((placed * 0.618) % 1);
    const st = Math.sqrt(Math.max(0, 1 - ct * ct));
    pts[i] = 0.62 * st * Math.cos(phi);
    pts[i + 1] = 0.72 * ct + 0.28;
    pts[i + 2] = 0.7 * st * Math.sin(phi) - 0.05;
  }
  return pts;
}

// ---------------------------------------------------------------- targets

export function buildTargets(count: number): { texture: THREE.DataTexture; rowsPerTarget: number } {
  const rand = mulberry32(20260724);
  const targets: Float32Array[] = [];

  // 0 — fibrous core: points strung along meridian filaments
  {
    const t = new Float32Array(count * 3);
    const strands = 220;
    for (let i = 0; i < count; i++) {
      const strand = i % strands;
      const along = (i / count + rand() * 0.002) % 1;
      const phi = (strand / strands) * Math.PI * 2 + fbm(strand, along * 4, 0) * 0.12;
      const theta = along * Math.PI;
      const ridge = 0.05 * Math.sin(along * 46 + strand * 1.7) + 0.03 * fbm(phi * 3, theta * 3, strand);
      const r = 1.12 + ridge;
      t[i * 3] = r * Math.sin(theta) * Math.cos(phi);
      t[i * 3 + 1] = r * Math.cos(theta);
      t[i * 3 + 2] = r * Math.sin(theta) * Math.sin(phi);
    }
    targets.push(t);
  }

  // 1 — flowing strands sweeping to the upper right
  {
    const t = new Float32Array(count * 3);
    const strands = 130;
    for (let i = 0; i < count; i++) {
      const k = i % strands;
      const u = Math.pow((Math.floor(i / strands) * strands) / count + rand() * 0.004, 0.82);
      const x = -3.6 + u * 8.2;
      const sway = Math.sin(u * 5.2 + k * 0.55) * (0.5 + k * 0.002);
      const y = -1.3 + u * 2.3 + sway * 0.5 + (k / strands - 0.5) * 1.7 * (1 - u * 0.55);
      const z = -1.4 + (vnoise(k, 3, 7) - 0.5) * 2.2 + Math.sin(u * 3.1 + k) * 0.25;
      t[i * 3] = x;
      t[i * 3 + 1] = y;
      t[i * 3 + 2] = z;
    }
    targets.push(t);
  }

  // 2 — symbolic head
  const head = sampleHead(rand, count);
  targets.push(head);

  // 3 — fingerprint contour face: head snapped into contour bands
  {
    const t = new Float32Array(count * 3);
    const bands = 26;
    for (let i = 0; i < count; i++) {
      const x = head[i * 3];
      const y = head[i * 3 + 1];
      const z = head[i * 3 + 2];
      const len = Math.hypot(x, y - 0.1, z) || 1;
      const field = y * 1.6 + 0.45 * fbm(x * 2.2, y * 2.2, z * 2.2);
      const snapped = Math.round(field * bands) / bands;
      const delta = (snapped - field) * 0.55;
      // push along the radial normal so bands read as raised contour lines
      t[i * 3] = x + (x / len) * delta;
      t[i * 3 + 1] = y + ((y - 0.1) / len) * delta;
      t[i * 3 + 2] = z * 0.92 + (z / len) * delta + 0.06;
    }
    targets.push(t);
  }

  // 4 — calm silhouette: head relaxed toward a smooth shell
  {
    const t = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const x = head[i * 3];
      const y = head[i * 3 + 1];
      const z = head[i * 3 + 2];
      const len = Math.hypot(x, y - 0.15, z) || 1;
      const smooth = 0.78;
      t[i * 3] = x * (1 - 0.35) + (x / len) * smooth * 0.35;
      t[i * 3 + 1] = y * (1 - 0.2) + (0.15 + ((y - 0.15) / len) * smooth) * 0.2;
      t[i * 3 + 2] = z * (1 - 0.35) + (z / len) * smooth * 0.35;
    }
    targets.push(t);
  }

  // 5 — constellation of six interest worlds
  {
    const t = new Float32Array(count * 3);
    const centers: [number, number, number][] = [
      [-2.7, 0.9, -1.2],
      [-1.1, -0.7, -2.2],
      [0.4, 0.8, -1.6],
      [1.9, -0.3, -1.0],
      [3.3, 0.8, -2.4],
      [-3.6, -1.0, -2.8],
    ];
    for (let i = 0; i < count; i++) {
      const w = i % 6;
      const [cx, cy, cz] = centers[w];
      const j = Math.floor(i / 6);
      const u = (j * 0.618) % 1;
      const v = (j * 0.377) % 1;
      let px = 0;
      let py = 0;
      let pz = 0;
      const R = 0.55;
      if (w === 0) {
        // neural form — gaussian cloud
        px = (rand() + rand() + rand() - 1.5) * 0.42;
        py = (rand() + rand() + rand() - 1.5) * 0.42;
        pz = (rand() + rand() + rand() - 1.5) * 0.42;
      } else if (w === 1) {
        // topographic globe — latitude rings
        const lat = (Math.floor(v * 9) / 9 - 0.5) * Math.PI;
        const lon = u * Math.PI * 2;
        px = R * Math.cos(lat) * Math.cos(lon);
        py = R * Math.sin(lat);
        pz = R * Math.cos(lat) * Math.sin(lon);
      } else if (w === 2) {
        // cinematic frame — rectangle outline
        const per = u * 4;
        const side = Math.floor(per);
        const f = per - side;
        const wdt = 0.72;
        const hgt = 0.44;
        if (side === 0) [px, py] = [-wdt + f * 2 * wdt, hgt];
        else if (side === 1) [px, py] = [wdt, hgt - f * 2 * hgt];
        else if (side === 2) [px, py] = [wdt - f * 2 * wdt, -hgt];
        else [px, py] = [-wdt, -hgt + f * 2 * hgt];
        pz = (v - 0.5) * 0.05;
      } else if (w === 3) {
        // growing structure — rising spiral of steps
        const step = Math.floor(v * 12);
        const ang = u * Math.PI * 2 + step * 0.5;
        const rr = 0.14 + step * 0.03;
        px = rr * Math.cos(ang);
        pz = rr * Math.sin(ang);
        py = -0.45 + step * 0.085;
      } else if (w === 4) {
        // sculptural form — torus knot
        const p = 2;
        const q = 3;
        const ang = u * Math.PI * 2;
        const rr = 0.34 + 0.12 * Math.cos(q * ang);
        px = rr * Math.cos(p * ang);
        py = rr * Math.sin(p * ang);
        pz = 0.12 * Math.sin(q * ang) + (v - 0.5) * 0.06;
      } else {
        // learning network — nested node shells
        const shell = 0.22 + Math.floor(v * 3) * 0.16;
        const ct = 1 - 2 * u;
        const st = Math.sqrt(Math.max(0, 1 - ct * ct));
        const ph = v * 40;
        px = shell * st * Math.cos(ph);
        py = shell * ct;
        pz = shell * st * Math.sin(ph);
      }
      t[i * 3] = cx + px;
      t[i * 3 + 1] = cy + py;
      t[i * 3 + 2] = cz + pz;
    }
    targets.push(t);
  }

  // 6 — journey line with milestone knots
  {
    const t = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const u = i / count;
      const knot = i % 9 === 0;
      const m = Math.floor(u * 6) / 6 + 1 / 12;
      const uu = knot ? m + (rand() - 0.5) * 0.02 : u;
      const x = -4.2 + uu * 8.4;
      const y = -1.4 + uu * 2.6 + Math.sin(uu * 6.28) * 0.12;
      const spread = knot ? 0.16 : 0.05;
      t[i * 3] = x + (rand() - 0.5) * spread;
      t[i * 3 + 1] = y + (rand() - 0.5) * spread;
      t[i * 3 + 2] = -1.6 + (rand() - 0.5) * spread * 2;
    }
    targets.push(t);
  }

  // 7 — philosophy: three tilted orbit rings + small core
  {
    const t = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const g = i % 4;
      const u = ((i * 0.618) % 1) * Math.PI * 2;
      if (g === 3) {
        // core cluster
        t[i * 3] = (rand() + rand() - 1) * 0.16;
        t[i * 3 + 1] = (rand() + rand() - 1) * 0.16;
        t[i * 3 + 2] = (rand() + rand() - 1) * 0.16;
      } else {
        const radius = [1.5, 1.15, 0.85][g];
        const tilt = [0.45, -0.35, 0.9][g];
        const x = radius * Math.cos(u);
        const y = radius * Math.sin(u) * Math.sin(tilt);
        const z = radius * Math.sin(u) * Math.cos(tilt);
        const wob = 0.02 * Math.sin(u * 9 + g * 4);
        t[i * 3] = x + wob;
        t[i * 3 + 1] = y + wob;
        t[i * 3 + 2] = z;
      }
    }
    targets.push(t);
  }

  // 8 — horizon field: receding ground lines + distant spires
  {
    const t = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const spire = i % 37 === 0;
      if (spire) {
        const sx = (vnoise(i, 1, 2) - 0.5) * 9;
        const sz = -6 - vnoise(i, 5, 9) * 14;
        t[i * 3] = sx;
        t[i * 3 + 1] = -1 + rand() * (0.6 + vnoise(i, 3, 1) * 1.6);
        t[i * 3 + 2] = sz;
      } else {
        const lineX = Math.round(((rand() * 2 - 1) * 6) / 0.6) * 0.6;
        const z = -1 - Math.pow(rand(), 1.6) * 22;
        t[i * 3] = lineX + (rand() - 0.5) * 0.03;
        t[i * 3 + 1] = -1.05 + (rand() - 0.5) * 0.02;
        t[i * 3 + 2] = z;
      }
    }
    targets.push(t);
  }

  // 9 — collapsed point
  {
    const t = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      t[i * 3] = (rand() + rand() - 1) * 0.05;
      t[i * 3 + 1] = (rand() + rand() - 1) * 0.05;
      t[i * 3 + 2] = (rand() + rand() - 1) * 0.05;
    }
    targets.push(t);
  }

  // 10 — mini core (final loop): target 0 at half scale
  {
    const t = new Float32Array(count * 3);
    const core = targets[0];
    for (let i = 0; i < count * 3; i++) t[i] = core[i] * 0.5;
    targets.push(t);
  }

  // ------------------------------------------------------------ pack
  const rowsPerTarget = Math.ceil(count / TEX_WIDTH);
  const height = rowsPerTarget * TARGET_COUNT;
  const data = new Float32Array(TEX_WIDTH * height * 4);
  for (let target = 0; target < TARGET_COUNT; target++) {
    const src = targets[target];
    for (let i = 0; i < count; i++) {
      const row = Math.floor(i / TEX_WIDTH);
      const col = i % TEX_WIDTH;
      const o = ((target * rowsPerTarget + row) * TEX_WIDTH + col) * 4;
      data[o] = src[i * 3];
      data[o + 1] = src[i * 3 + 1];
      data[o + 2] = src[i * 3 + 2];
      data[o + 3] = 1;
    }
  }
  const texture = new THREE.DataTexture(data, TEX_WIDTH, height, THREE.RGBAFormat, THREE.FloatType);
  texture.needsUpdate = true;
  texture.minFilter = THREE.NearestFilter;
  texture.magFilter = THREE.NearestFilter;
  texture.generateMipmaps = false;
  return { texture, rowsPerTarget };
}

export { TEX_WIDTH };
