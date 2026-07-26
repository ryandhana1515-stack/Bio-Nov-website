"use client";

import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

/*
 * TempestaScene — real-time cinematic renderer for the VELOCE Tempesta GT.
 * The car is sculpted procedurally (extruded bezier silhouette + parts) so the
 * machine is pixel-identical in every phase, and scroll scrubs a continuous
 * camera timeline: orbit → storm drift → macro fly-through → exploded assembly
 * → edition beauty shot → finale.
 */

const GOLD = 0xc9a227;
const GRAPHITE = 0x35383e;

interface ExplodePart {
  object: THREE.Object3D;
  basePos: THREE.Vector3;
  baseRot: THREE.Euler;
  offset: THREE.Vector3;
  spin: THREE.Vector3;
  stagger: number; // 0..0.5 — later parts land later
}

interface CamState {
  pos: THREE.Vector3;
  target: THREE.Vector3;
  fov: number;
  smoke: number;
  assembly: number; // 0 assembled … 1 exploded
  carSpin: number;
  wrap: number; // 0 film on … 1 film fully flown off
}

interface WrapSlice {
  group: THREE.Group;
  mat: THREE.MeshPhysicalMaterial;
  basePlanes: THREE.Plane[];
  livePlanes: THREE.Plane[];
  fly: THREE.Vector3;
  spin: THREE.Vector3;
  stagger: number;
}

const easeInOut = (t: number) => t * t * (3 - 2 * t);
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

export class TempestaScene {
  private renderer: THREE.WebGLRenderer;
  private scene = new THREE.Scene();
  private camera: THREE.PerspectiveCamera;
  private car = new THREE.Group();
  private smokeGroup = new THREE.Group();
  private smokeSprites: { s: THREE.Sprite; seed: number; base: THREE.Vector3 }[] = [];
  private parts: ExplodePart[] = [];
  private wrapSlices: WrapSlice[] = [];
  private raf = 0;
  private clock = new THREE.Clock();
  private phase = 0;
  private phaseT = 0;
  private cur: CamState;
  private macroPath!: THREE.CatmullRomCurve3;
  private macroTargets!: THREE.CatmullRomCurve3;
  private disposed = false;

  constructor(private canvas: HTMLCanvasElement) {
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: "high-performance" });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.0;
    this.renderer.localClippingEnabled = true;

    this.camera = new THREE.PerspectiveCamera(40, 1, 0.1, 80);
    this.camera.position.set(5.8, 1.35, 0);

    this.scene.background = new THREE.Color(0x050506);
    this.scene.fog = new THREE.Fog(0x050506, 9, 26);

    const pmrem = new THREE.PMREMGenerator(this.renderer);
    this.scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    pmrem.dispose();

    this.buildLights();
    this.buildCar();
    this.buildWrap();
    this.buildSmoke();
    this.buildMacroPath();

    this.cur = {
      pos: new THREE.Vector3(5.8, 1.35, 0),
      target: new THREE.Vector3(0, 0.55, 0),
      fov: 40,
      smoke: 1,
      assembly: 0,
      carSpin: 0,
      wrap: 0,
    };

    this.resize();
    this.loop();
  }

  /* ------------------------------------------------------------- lights */
  private buildLights() {
    const rim = new THREE.DirectionalLight(0xfff1da, 2.6);
    rim.position.set(-4, 6, -5);
    this.scene.add(rim);

    const fill = new THREE.DirectionalLight(0xdfe8ff, 0.85);
    fill.position.set(5, 2.4, 4);
    this.scene.add(fill);

    const goldKick = new THREE.PointLight(GOLD, 26, 12, 2);
    goldKick.position.set(2.6, 0.35, 2.2);
    this.scene.add(goldKick);

    const topBlade = new THREE.DirectionalLight(0xffffff, 0.9);
    topBlade.position.set(0, 8, 0.5);
    this.scene.add(topBlade);

    this.scene.add(new THREE.AmbientLight(0x1a1c22, 0.7));
  }

  /* ---------------------------------------------------------- materials */
  private matBody() {
    return new THREE.MeshPhysicalMaterial({
      color: 0x1e2126,
      metalness: 0.85,
      roughness: 0.3,
      clearcoat: 1,
      clearcoatRoughness: 0.08,
      envMapIntensity: 0.45,
    });
  }
  private matCarbon() {
    const c = document.createElement("canvas");
    c.width = c.height = 64;
    const g = c.getContext("2d")!;
    g.fillStyle = "#08090b";
    g.fillRect(0, 0, 64, 64);
    g.fillStyle = "#121317";
    for (let y = 0; y < 8; y++)
      for (let x = 0; x < 8; x++) if ((x + y) % 2 === 0) g.fillRect(x * 8, y * 8, 8, 8);
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(6, 2);
    return new THREE.MeshPhysicalMaterial({
      map: tex, color: 0xffffff, metalness: 0.2, roughness: 0.42,
      clearcoat: 0.5, clearcoatRoughness: 0.2, envMapIntensity: 0.22,
    });
  }
  private matGold(rough = 0.28) {
    return new THREE.MeshStandardMaterial({ color: GOLD, metalness: 1, roughness: rough, envMapIntensity: 1.1 });
  }
  private matGlass() {
    return new THREE.MeshPhysicalMaterial({
      color: 0x030406, metalness: 0.7, roughness: 0.05, clearcoat: 1,
      clearcoatRoughness: 0.03, envMapIntensity: 0.3,
    });
  }
  private matDark(rough = 0.6) {
    return new THREE.MeshStandardMaterial({ color: 0x0c0d10, metalness: 0.5, roughness: rough });
  }

  /* --------------------------------------------------------------- car */
  private addPart(object: THREE.Object3D, offset: THREE.Vector3, spin: THREE.Vector3, stagger: number) {
    this.car.add(object);
    this.parts.push({
      object,
      basePos: object.position.clone(),
      baseRot: object.rotation.clone(),
      offset,
      spin,
      stagger,
    });
  }

  private makeBodyShape(): THREE.Shape {
    const s = new THREE.Shape();
    // silhouette — long bonnet, low fastback tail (x forward, y up)
    s.moveTo(2.3, 0.17);
    s.lineTo(1.93, 0.17);
    s.absarc(1.45, 0.17, 0.48, 0, Math.PI, false); // front arch
    s.lineTo(-0.97, 0.17);
    s.absarc(-1.45, 0.17, 0.48, 0, Math.PI, false); // rear arch
    s.lineTo(-2.26, 0.17);
    s.lineTo(-2.36, 0.52);
    s.quadraticCurveTo(-2.37, 0.8, -2.12, 0.84); // kamm tail
    s.bezierCurveTo(-1.2, 0.93, -0.1, 0.9, 0.8, 0.79); // deck + belt line
    s.quadraticCurveTo(1.7, 0.62, 2.16, 0.5); // bonnet fall
    s.quadraticCurveTo(2.44, 0.44, 2.43, 0.3); // nose
    s.lineTo(2.3, 0.17);
    return s;
  }

  private makeCanopyShape(): THREE.Shape {
    const gs = new THREE.Shape();
    gs.moveTo(1.02, 0.76);
    gs.quadraticCurveTo(0.55, 0.82, 0.22, 1.14); // windshield
    gs.quadraticCurveTo(-0.1, 1.22, -0.5, 1.16); // roof
    gs.quadraticCurveTo(-1.2, 1.0, -1.75, 0.8); // fastback
    gs.lineTo(1.02, 0.76);
    return gs;
  }

  private bodyShell(): THREE.Group {
    const shell = new THREE.Group();
    const geo = new THREE.ExtrudeGeometry(this.makeBodyShape(), {
      depth: 1.5, bevelEnabled: true, bevelThickness: 0.24, bevelSize: 0.2,
      bevelSegments: 24, curveSegments: 96, steps: 1,
    });
    geo.translate(0, 0, -0.75);
    const body = new THREE.Mesh(geo, this.matBody());
    shell.add(body);

    // greenhouse — black glass canopy
    const ggeo = new THREE.ExtrudeGeometry(this.makeCanopyShape(), {
      depth: 0.98, bevelEnabled: true, bevelThickness: 0.14, bevelSize: 0.12,
      bevelSegments: 16, curveSegments: 64,
    });
    ggeo.translate(0, 0, -0.49);
    shell.add(new THREE.Mesh(ggeo, this.matGlass()));

    // headlights — jewel clusters
    for (const side of [1, -1]) {
      const cluster = new THREE.Group();
      for (let i = 0; i < 3; i++) {
        const jewel = new THREE.Mesh(
          new THREE.SphereGeometry(0.034, 16, 16),
          new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xfff6e0, emissiveIntensity: 6, roughness: 0.1, metalness: 0.2 })
        );
        jewel.position.set(-i * 0.09, -i * 0.018, 0);
        cluster.add(jewel);
      }
      const drl = new THREE.Mesh(
        new THREE.BoxGeometry(0.02, 0.012, 0.24),
        new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 4 })
      );
      drl.position.set(0.05, -0.07, side * 0.02);
      cluster.add(drl);
      cluster.position.set(2.52, 0.52, side * 0.68);
      cluster.rotation.y = side * -0.35;
      shell.add(cluster);
    }

    // taillight blade
    const tail = new THREE.Mesh(
      new THREE.BoxGeometry(0.015, 0.018, 1.42),
      new THREE.MeshStandardMaterial({ color: 0x1a0000, emissive: 0xd8140c, emissiveIntensity: 2.4 })
    );
    tail.position.set(-2.575, 0.68, 0);
    shell.add(tail);

    // nose badge — gold ring
    const badge = new THREE.Group();
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.045, 0.011, 12, 32), this.matGold(0.18));
    const core = new THREE.Mesh(new THREE.SphereGeometry(0.02, 12, 12), this.matGold(0.15));
    badge.add(ring, core);
    badge.rotation.y = Math.PI / 2;
    badge.position.set(2.65, 0.42, 0);
    shell.add(badge);

    // exhaust tips
    for (const side of [1, -1]) {
      const tip = new THREE.Mesh(
        new THREE.CylinderGeometry(0.035, 0.04, 0.1, 20),
        new THREE.MeshStandardMaterial({ color: 0x6e5c30, metalness: 1, roughness: 0.45, envMapIntensity: 0.7 })
      );
      tip.rotation.z = Math.PI / 2;
      tip.position.set(-2.5, 0.28, side * 0.3);
      shell.add(tip);
    }
    return shell;
  }

  private wheel(): THREE.Group {
    const w = new THREE.Group();
    const tire = new THREE.Mesh(
      new THREE.CylinderGeometry(0.37, 0.37, 0.28, 40),
      new THREE.MeshStandardMaterial({ color: 0x0a0a0c, roughness: 0.92, metalness: 0 })
    );
    tire.rotation.x = Math.PI / 2;
    w.add(tire);
    const rim = new THREE.Mesh(
      new THREE.CylinderGeometry(0.24, 0.24, 0.29, 32),
      new THREE.MeshStandardMaterial({ color: 0x2a2c31, metalness: 1, roughness: 0.25 })
    );
    rim.rotation.x = Math.PI / 2;
    w.add(rim);
    const spokeMat = new THREE.MeshStandardMaterial({ color: 0x3a3d43, metalness: 1, roughness: 0.3 });
    for (let i = 0; i < 7; i++) {
      const sp = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.42, 0.05), spokeMat);
      sp.rotation.z = (i / 7) * Math.PI * 2;
      sp.position.z = 0.13;
      w.add(sp);
    }
    const disc = new THREE.Mesh(
      new THREE.CylinderGeometry(0.21, 0.21, 0.03, 32),
      new THREE.MeshStandardMaterial({ color: 0x55565c, metalness: 1, roughness: 0.45 })
    );
    disc.rotation.x = Math.PI / 2;
    w.add(disc);
    const caliper = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.17, 0.09), this.matGold(0.3));
    caliper.position.set(0.14, 0.1, 0.02);
    caliper.rotation.z = -0.5;
    w.add(caliper);
    const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.31, 16), this.matGold(0.2));
    hub.rotation.x = Math.PI / 2;
    w.add(hub);
    return w;
  }

  private engine(): THREE.Group {
    const e = new THREE.Group();
    const block = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.34, 0.5), this.matDark(0.4));
    e.add(block);
    for (const side of [1, -1]) {
      const bank = new THREE.Group();
      for (let i = 0; i < 4; i++) {
        const cyl = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.2, 14), this.matDark(0.3));
        cyl.position.set(-0.26 + i * 0.17, 0.22, 0);
        bank.add(cyl);
      }
      const cover = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.05, 0.16), this.matGold(0.35));
      cover.position.set(0, 0.34, 0);
      bank.add(cover);
      bank.rotation.x = side * 0.5;
      bank.position.z = side * 0.14;
      e.add(bank);
      const turbo = new THREE.Mesh(new THREE.TorusGeometry(0.09, 0.045, 12, 24), this.matDark(0.25));
      turbo.position.set(-0.45, 0.05, side * 0.2);
      e.add(turbo);
    }
    return e;
  }

  private seat(): THREE.Group {
    const st = new THREE.Group();
    const mat = new THREE.MeshStandardMaterial({ color: 0x17130f, roughness: 0.8, metalness: 0.05 });
    const base = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.1, 0.4), mat);
    const back = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.52, 0.4), mat);
    back.position.set(-0.2, 0.26, 0);
    back.rotation.z = 0.28;
    const stitch = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.5, 0.03), this.matGold(0.5));
    stitch.position.set(-0.16, 0.27, 0);
    stitch.rotation.z = 0.28;
    st.add(base, back, stitch);
    return st;
  }

  private buildCar() {
    // shell (body + glass + lights + badge)
    const shell = this.bodyShell();
    this.addPart(shell, new THREE.Vector3(0, 2.6, 0), new THREE.Vector3(0.12, 0.25, -0.18), 0.42);

    // monocoque
    const tub = new THREE.Group();
    const slab = new THREE.Mesh(new THREE.BoxGeometry(3.5, 0.1, 1.4), this.matCarbon());
    slab.position.y = 0.3;
    const rail1 = new THREE.Mesh(new THREE.BoxGeometry(3.5, 0.12, 0.12), this.matCarbon());
    rail1.position.set(0, 0.38, 0.58);
    const rail2 = rail1.clone();
    rail2.position.z = -0.58;
    tub.add(slab, rail1, rail2);
    this.addPart(tub, new THREE.Vector3(0, -0.9, 0), new THREE.Vector3(-0.1, 0, 0.1), 0.02);

    // engine
    const eng = this.engine();
    eng.position.set(-0.9, 0.55, 0);
    this.addPart(eng, new THREE.Vector3(-1.6, 1.7, 0), new THREE.Vector3(0.4, 0.8, 0.3), 0.16);

    // seats
    for (const side of [1, -1]) {
      const st = this.seat();
      st.position.set(0.25, 0.5, side * 0.38);
      this.addPart(st, new THREE.Vector3(0.7, 1.3, side * 1.5), new THREE.Vector3(0.3, -side * 0.7, 0.2), 0.24);
    }

    // wheels
    const wheelPos: [number, number][] = [[1.45, 0.82], [1.45, -0.82], [-1.45, 0.82], [-1.45, -0.82]];
    wheelPos.forEach(([x, z], i) => {
      const w = this.wheel();
      w.position.set(x, 0.33, z);
      if (z < 0) w.rotation.y = Math.PI;
      this.addPart(
        w,
        new THREE.Vector3(x * 0.7, 0.7 + i * 0.18, Math.sign(z) * 2.1),
        new THREE.Vector3(0, 0, Math.sign(z) * 1.6),
        0.08 + i * 0.045
      );
    });

    // aero — carbon splitter / skirts / diffuser / wing
    const carbon = this.matCarbon();
    const splitter = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.04, 1.6), carbon);
    splitter.position.set(2.42, 0.0, 0);
    this.addPart(splitter, new THREE.Vector3(1.6, 0.5, 0), new THREE.Vector3(0.5, 0, 0), 0.3);

    for (const side of [1, -1]) {
      const skirt = new THREE.Mesh(new THREE.BoxGeometry(2.3, 0.08, 0.12), carbon);
      skirt.position.set(0, 0.02, side * 1.05);
      this.addPart(skirt, new THREE.Vector3(0, 0.25, side * 1.3), new THREE.Vector3(0, 0, side * 0.4), 0.34);
    }

    const diffuser = new THREE.Group();
    const dbase = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.06, 1.7), carbon);
    diffuser.add(dbase);
    for (let i = -2; i <= 2; i++) {
      const fin = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.09, 0.015), carbon);
      fin.position.set(0, 0.06, i * 0.3);
      diffuser.add(fin);
    }
    diffuser.position.set(-2.48, 0.06, 0);
    this.addPart(diffuser, new THREE.Vector3(-1.4, 0.4, 0), new THREE.Vector3(-0.5, 0, 0), 0.36);

    const wing = new THREE.Group();
    const blade = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.03, 1.62), carbon);
    blade.rotation.z = -0.12;
    wing.add(blade);
    for (const side of [0.62, -0.62]) {
      const strut = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.14, 0.03), carbon);
      strut.position.set(0.02, -0.08, side);
      wing.add(strut);
    }
    wing.position.set(-2.25, 1.12, 0);
    this.addPart(wing, new THREE.Vector3(-1.1, 1.9, 0), new THREE.Vector3(0.7, 0.4, 0), 0.46);

    this.scene.add(this.car);
  }

  /* --------------------------------------------------------------- wrap */
  private buildWrap() {
    // one shared low-res copy of the body + canopy, worn slightly proud of the paint
    const bodyGeo = new THREE.ExtrudeGeometry(this.makeBodyShape(), {
      depth: 1.5, bevelEnabled: true, bevelThickness: 0.26, bevelSize: 0.22,
      bevelSegments: 8, curveSegments: 40, steps: 1,
    });
    bodyGeo.translate(0, 0, -0.75);
    const canopyGeo = new THREE.ExtrudeGeometry(this.makeCanopyShape(), {
      depth: 1.0, bevelEnabled: true, bevelThickness: 0.16, bevelSize: 0.13,
      bevelSegments: 6, curveSegments: 28,
    });
    canopyGeo.translate(0, 0, -0.5);

    // seven film strips, nose to tail
    const cuts = [-2.95, -2.15, -1.32, -0.5, 0.35, 1.2, 2.1, 3.1];
    for (let i = 0; i < cuts.length - 1; i++) {
      const basePlanes = [
        new THREE.Plane(new THREE.Vector3(1, 0, 0), -cuts[i]),      // keep x >= cuts[i]
        new THREE.Plane(new THREE.Vector3(-1, 0, 0), cuts[i + 1]),  // keep x <= cuts[i+1]
      ];
      const livePlanes = basePlanes.map((p) => p.clone());
      const mat = new THREE.MeshPhysicalMaterial({
        color: 0x08090a, metalness: 0.05, roughness: 0.72,
        clearcoat: 0.12, clearcoatRoughness: 0.4, envMapIntensity: 0.15,
        transparent: true, opacity: 1, clippingPlanes: livePlanes,
      });
      const group = new THREE.Group();
      const b = new THREE.Mesh(bodyGeo, mat);
      b.scale.set(1.015, 1.03, 1.03);
      const cpy = new THREE.Mesh(canopyGeo, mat);
      cpy.scale.set(1.02, 1.04, 1.04);
      group.add(b, cpy);
      this.car.add(group);

      const side = i % 2 === 0 ? 1 : -1;
      this.wrapSlices.push({
        group, mat, basePlanes, livePlanes,
        fly: new THREE.Vector3(
          (i < 3 ? -1 : 1) * (1.2 + (i % 3) * 0.5),
          2.4 + (i % 3) * 0.7,
          side * (1.0 + (i % 2) * 0.6)
        ),
        spin: new THREE.Vector3(side * 1.3, side * 0.5, (i < 3 ? -1 : 1) * 1.0),
        stagger: ((cuts.length - 2 - i) / (cuts.length - 1)) * 0.55, // nose peels first
      });
    }
  }

  private updateWrap() {
    const w = this.cur.wrap;
    for (const sl of this.wrapSlices) {
      const local = easeInOut(clamp01((w - sl.stagger) / 0.45));
      if (local >= 0.999 || w >= 0.999) {
        sl.group.visible = false;
        continue;
      }
      sl.group.visible = true;
      sl.group.position.set(sl.fly.x * local, sl.fly.y * local, sl.fly.z * local);
      sl.group.rotation.set(sl.spin.x * local, sl.spin.y * local, sl.spin.z * local);
      sl.mat.opacity = 1 - easeInOut(clamp01((local - 0.55) / 0.45));
      // keep the slab clip glued to the flying strip
      sl.group.updateMatrixWorld();
      for (let k = 0; k < 2; k++) {
        sl.livePlanes[k].copy(sl.basePlanes[k]).applyMatrix4(sl.group.matrixWorld);
      }
    }
  }

  /* -------------------------------------------------------------- smoke */
  private buildSmoke() {
    const c = document.createElement("canvas");
    c.width = c.height = 128;
    const g = c.getContext("2d")!;
    const grad = g.createRadialGradient(64, 64, 4, 64, 64, 62);
    grad.addColorStop(0, "rgba(220,224,235,0.65)");
    grad.addColorStop(0.5, "rgba(200,205,220,0.22)");
    grad.addColorStop(1, "rgba(200,205,220,0)");
    g.fillStyle = grad;
    g.fillRect(0, 0, 128, 128);
    const tex = new THREE.CanvasTexture(c);

    for (let i = 0; i < 18; i++) {
      const mat = new THREE.SpriteMaterial({ map: tex, transparent: true, opacity: 0.06, depthWrite: false });
      const s = new THREE.Sprite(mat);
      const ang = (i / 18) * Math.PI * 2;
      const r = 2.4 + Math.random() * 2.6;
      const base = new THREE.Vector3(Math.cos(ang) * r, 0.12 + Math.random() * 0.25, Math.sin(ang) * r);
      s.position.copy(base);
      const sc = 2.2 + Math.random() * 2.4;
      s.scale.set(sc, sc * 0.62, 1);
      this.smokeGroup.add(s);
      this.smokeSprites.push({ s, seed: Math.random() * 100, base });
    }
    this.scene.add(this.smokeGroup);
  }

  /* --------------------------------------------------------- macro path */
  private buildMacroPath() {
    this.macroPath = new THREE.CatmullRomCurve3([
      new THREE.Vector3(3.35, 0.7, 1.5),    // headlight
      new THREE.Vector3(3.3, 1.0, -0.45),   // badge over bonnet
      new THREE.Vector3(2.15, 0.6, 1.8),    // wheel + caliper
      new THREE.Vector3(0.4, 0.55, 2.0),    // carbon sill
      new THREE.Vector3(-3.7, 1.1, 1.7),    // tail blade
    ], false, "catmullrom", 0.35);
    this.macroTargets = new THREE.CatmullRomCurve3([
      new THREE.Vector3(2.52, 0.52, 0.62),
      new THREE.Vector3(2.6, 0.44, 0),
      new THREE.Vector3(1.45, 0.37, 0.85),
      new THREE.Vector3(0.1, 0.25, 1.0),
      new THREE.Vector3(-2.55, 0.68, 0),
    ], false, "catmullrom", 0.35);
  }

  /* --------------------------------------------------- phase → cam state */
  setPhase(phase: number, t: number) {
    this.phase = phase;
    this.phaseT = clamp01(t);
  }

  private targetState(out: CamState) {
    const t = this.phaseT;
    switch (this.phase) {
      case 0: { // HERO ORBIT — full 360°, the film tears off mid-orbit
        const th = Math.PI * 0.72 + t * Math.PI * 2;
        const r = 6.9 - t * 0.5;
        out.pos.set(Math.sin(th) * r, 1.55 - easeInOut(t) * 0.5, Math.cos(th) * r);
        out.target.set(0, 0.5, 0);
        out.fov = 38; out.smoke = 1; out.assembly = 0; out.carSpin = 0;
        out.wrap = clamp01((t - 0.42) / 0.5); // covered until ~half the orbit, bare by t≈0.92
        break;
      }
      case 1: { // BORN OF STORMS — slow menacing drift, front 3/4 low
        out.pos.set(4.6 - t * 1.1, 0.85 - t * 0.3, 3.9 - t * 0.7);
        out.target.set(0.4, 0.55, 0);
        out.fov = 35; out.smoke = 0.75; out.assembly = 0; out.carSpin = 0;
        out.wrap = 1;
        break;
      }
      case 2: { // MACRO FLY-THROUGH
        const k = easeInOut(t);
        this.macroPath.getPoint(k, out.pos);
        this.macroTargets.getPoint(k, out.target);
        out.fov = 30; out.smoke = 0; out.assembly = 0; out.carSpin = 0;
        out.wrap = 1;
        break;
      }
      case 3: { // EXPLODED ASSEMBLY — converges as you scroll
        const th = 0.9 + t * 1.15;
        const r = 7.4 - t * 1.1;
        out.pos.set(Math.sin(th) * r, 2.7 - t * 0.9, Math.cos(th) * r);
        out.target.set(0, 0.95 - t * 0.35, 0);
        out.fov = 42; out.smoke = 0.15;
        out.assembly = 1 - easeInOut(clamp01(t * 1.18)); // fully assembled slightly before phase end
        out.carSpin = t * 0.35;
        out.wrap = 1;
        break;
      }
      case 4: { // EDITION — slow gold-lit turntable beauty shot
        out.pos.set(5.9 - t * 0.9, 1.0, 4.3 - t * 0.5);
        out.target.set(0.2, 0.5, 0);
        out.fov = 37; out.smoke = 0.6; out.assembly = 0;
        out.carSpin = 0.35 + t * 0.55;
        out.wrap = 1;
        break;
      }
      default: { // CTA — receding rear 3/4, the car waits
        out.pos.set(-5.1, 1.45, 4.8 + t * 0.9);
        out.target.set(0, 0.5, 0);
        out.fov = 40; out.smoke = 0.5; out.assembly = 0;
        out.carSpin = 0.9 + t * 0.12;
        out.wrap = 1;
      }
    }
  }

  /* ---------------------------------------------------------------- loop */
  private tmp: CamState = {
    pos: new THREE.Vector3(), target: new THREE.Vector3(),
    fov: 40, smoke: 1, assembly: 0, carSpin: 0, wrap: 0,
  };

  private loop = () => {
    if (this.disposed) return;
    this.raf = requestAnimationFrame(this.loop);
    const dt = Math.min(this.clock.getDelta(), 0.05);
    const time = this.clock.elapsedTime;

    // damped pursuit of the target camera state → seamless phase blending
    this.targetState(this.tmp);
    const k = 1 - Math.exp(-dt * 5.2);
    this.cur.pos.lerp(this.tmp.pos, k);
    // outside the macro fly-through, never let the lagging camera cut through the car
    if (this.phase !== 2) {
      const flat = Math.hypot(this.cur.pos.x, this.cur.pos.z);
      if (flat < 3.3) {
        const push = 3.3 / Math.max(flat, 0.001);
        this.cur.pos.x *= push;
        this.cur.pos.z *= push;
      }
    }
    this.cur.target.lerp(this.tmp.target, k);
    this.cur.fov += (this.tmp.fov - this.cur.fov) * k;
    this.cur.smoke += (this.tmp.smoke - this.cur.smoke) * k;
    this.cur.assembly += (this.tmp.assembly - this.cur.assembly) * k;
    this.cur.carSpin += (this.tmp.carSpin - this.cur.carSpin) * k;
    this.cur.wrap += (this.tmp.wrap - this.cur.wrap) * k;
    this.updateWrap();

    this.camera.position.copy(this.cur.pos);
    this.camera.lookAt(this.cur.target);
    if (Math.abs(this.camera.fov - this.cur.fov) > 0.01) {
      this.camera.fov = this.cur.fov;
      this.camera.updateProjectionMatrix();
    }

    // exploded assembly — staggered convergence
    const a = this.cur.assembly;
    for (const p of this.parts) {
      const local = easeInOut(clamp01((a - p.stagger) / (1 - p.stagger)));
      p.object.position.set(
        p.basePos.x + p.offset.x * local,
        p.basePos.y + p.offset.y * local,
        p.basePos.z + p.offset.z * local
      );
      p.object.rotation.set(
        p.baseRot.x + p.spin.x * local,
        p.baseRot.y + p.spin.y * local,
        p.baseRot.z + p.spin.z * local
      );
    }

    this.car.rotation.y = this.cur.carSpin;
    this.car.position.y = Math.sin(time * 0.7) * 0.015; // floating in the void

    // smoke drift
    for (const sp of this.smokeSprites) {
      const { s, seed, base } = sp;
      s.position.x = base.x + Math.sin(time * 0.11 + seed) * 0.55;
      s.position.z = base.z + Math.cos(time * 0.09 + seed * 1.7) * 0.55;
      s.position.y = base.y + Math.sin(time * 0.15 + seed * 2.3) * 0.06;
      (s.material as THREE.SpriteMaterial).opacity =
        this.cur.smoke * (0.045 + 0.035 * Math.abs(Math.sin(time * 0.13 + seed * 3.1)));
    }

    this.renderer.render(this.scene, this.camera);
  };

  resize() {
    const w = this.canvas.clientWidth || window.innerWidth;
    const h = this.canvas.clientHeight || window.innerHeight;
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
  }

  dispose() {
    this.disposed = true;
    cancelAnimationFrame(this.raf);
    this.scene.traverse((o) => {
      const m = o as THREE.Mesh;
      if (m.geometry) m.geometry.dispose();
      const mat = m.material as THREE.Material | THREE.Material[] | undefined;
      if (Array.isArray(mat)) mat.forEach((x) => x.dispose());
      else mat?.dispose();
    });
    this.renderer.dispose();
  }
}
