"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame, useLoader } from "@react-three/fiber";
import { scrollState } from "@/lib/scroll/state";

/**
 * The reference-style central visual: full-viewport AI-generated imagery
 * scrubbed by scroll. Six story states crossfade through a displacement
 * dissolve — core → strands → wireframe head → fingerprint face →
 * human portrait → dissolving head — then the layer fades out and hands
 * the stage to the particle constellation.
 *
 * Layout mirrors the reference videos: the square image is contained at
 * full viewport height while a blurred, oversized copy of itself fills
 * the margins, so the frame always feels edge-to-edge.
 */

export const STORY_IMAGES = [
  "/assets/story/00-core.webp",
  "/assets/story/01-strands.webp",
  "/assets/story/02-head.webp",
  "/assets/story/03-fingerprint.webp",
  "/assets/story/04-portrait.webp",
  "/assets/story/05-dissolve.webp",
];

const PLANE_DIST = 3;

const vertexShader = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragmentShader = /* glsl */ `
uniform sampler2D uTexA;
uniform sampler2D uTexB;
uniform sampler2D uNoise;
uniform float uMix;
uniform float uTime;
uniform float uOpacity;
uniform float uAspect;   // viewport width / height
uniform vec3 uPaper;
varying vec2 vUv;

// sample a square texture "contained" by height at the viewport centre
vec2 containUv(vec2 uv) {
  return vec2((uv.x - 0.5) * uAspect + 0.5, uv.y);
}
vec4 sampleState(sampler2D tex, vec2 uv, vec2 off) {
  vec2 fg = containUv(uv) + off;
  vec2 bgUv = (uv - 0.5) * 0.8 + 0.5 + off * 0.5;
  vec4 bg = texture2D(tex, bgUv, 5.0);           // heavy mip blur backdrop
  float inside = step(0.0, fg.x) * step(fg.x, 1.0);
  vec4 fgc = texture2D(tex, clamp(fg, 0.0, 1.0));
  float edge = smoothstep(0.0, 0.02, fg.x) * smoothstep(1.0, 0.98, fg.x);
  return mix(bg, fgc, inside * edge);
}

void main() {
  vec2 uv = vUv;
  // slow breathing drift so stillness never freezes
  uv += 0.003 * vec2(sin(uTime * 0.5 + uv.y * 4.0), cos(uTime * 0.4 + uv.x * 4.0));

  float n = texture2D(uNoise, uv * 1.4 + uTime * 0.008).r;
  float f = uMix;

  // displacement dissolve: pixels tear toward/away from centre mid-morph
  vec2 dir = uv - 0.5;
  float amt = 0.22 * f * (1.0 - f) * 4.0;
  vec2 offA = dir * (n - 0.5) * amt * f;
  vec2 offB = -dir * (n - 0.5) * amt * (1.0 - f);

  vec4 a = sampleState(uTexA, uv, offA);
  vec4 b = sampleState(uTexB, uv, offB);

  float t = clamp(smoothstep(0.12, 0.88, f) + (n - 0.5) * 0.55 * f * (1.0 - f) * 4.0, 0.0, 1.0);
  vec3 color = mix(a.rgb, b.rgb, t);

  // settle the frame into the site's paper tone at the edges
  float r = length((vUv - 0.5) * vec2(1.0, 1.25)) * 1.55;
  float vignette = smoothstep(1.25, 0.55, r);
  color = mix(uPaper, color, clamp(vignette + 0.55, 0.0, 1.0));

  gl_FragColor = vec4(color, uOpacity);
}
`;

function makeNoiseTexture(): THREE.DataTexture {
  const size = 256;
  const data = new Uint8Array(size * size * 4);
  const rand = (() => {
    let s = 1234567;
    return () => {
      s = (s * 16807) % 2147483647;
      return s / 2147483647;
    };
  })();
  const base = new Float32Array(size * size).map(() => rand());
  const sample = (x: number, y: number) =>
    base[((y & (size - 1)) * size + (x & (size - 1))) | 0];
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      // two octaves of smoothed value noise
      let v = 0;
      let amp = 0.65;
      for (let o = 0; o < 3; o++) {
        const sc = 1 << (o + 2);
        const xs = (x / size) * sc;
        const ys = (y / size) * sc;
        const xi = Math.floor(xs);
        const yi = Math.floor(ys);
        const xf = xs - xi;
        const yf = ys - yi;
        const stride = size / sc;
        const s00 = sample(xi * stride, yi * stride);
        const s10 = sample((xi + 1) * stride, yi * stride);
        const s01 = sample(xi * stride, (yi + 1) * stride);
        const s11 = sample((xi + 1) * stride, (yi + 1) * stride);
        const sx = xf * xf * (3 - 2 * xf);
        const sy = yf * yf * (3 - 2 * yf);
        v += amp * THREE.MathUtils.lerp(
          THREE.MathUtils.lerp(s00, s10, sx),
          THREE.MathUtils.lerp(s01, s11, sx),
          sy
        );
        amp *= 0.5;
      }
      const i = (y * size + x) * 4;
      const byte = Math.min(255, v * 255);
      data[i] = data[i + 1] = data[i + 2] = byte;
      data[i + 3] = 255;
    }
  }
  const tex = new THREE.DataTexture(data, size, size);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.needsUpdate = true;
  return tex;
}

export default function ImageMorph() {
  const mesh = useRef<THREE.Mesh>(null);
  const material = useRef<THREE.ShaderMaterial>(null);
  const smooth = useRef(0);

  const textures = useLoader(THREE.TextureLoader, STORY_IMAGES);
  useMemo(() => {
    textures.forEach((t) => {
      t.colorSpace = THREE.SRGBColorSpace;
      t.wrapS = t.wrapT = THREE.ClampToEdgeWrapping;
      t.generateMipmaps = true;
      t.minFilter = THREE.LinearMipmapLinearFilter;
    });
  }, [textures]);

  const uniforms = useMemo(
    () => ({
      uTexA: { value: textures[0] },
      uTexB: { value: textures[1] },
      uNoise: { value: makeNoiseTexture() },
      uMix: { value: 0 },
      uTime: { value: 0 },
      uOpacity: { value: 1 },
      uAspect: { value: 1.6 },
      uPaper: { value: new THREE.Color("#f5f4f1") },
    }),
    [textures]
  );

  const fwd = useMemo(() => new THREE.Vector3(), []);

  useFrame(({ camera, clock, size }) => {
    if (!mesh.current || !material.current) return;

    // glue the plane to the camera so it always fills the viewport
    camera.getWorldDirection(fwd);
    mesh.current.position.copy(camera.position).addScaledVector(fwd, PLANE_DIST);
    mesh.current.quaternion.copy(camera.quaternion);

    const persp = camera as THREE.PerspectiveCamera;
    const h = 2 * PLANE_DIST * Math.tan(THREE.MathUtils.degToRad(persp.fov / 2));
    const aspect = size.width / size.height;
    mesh.current.scale.set(h * aspect * 1.02, h * 1.02, 1);

    smooth.current += (scrollState.scene - smooth.current) * 0.08;
    const scene = smooth.current;
    const last = STORY_IMAGES.length - 1;
    const i = THREE.MathUtils.clamp(Math.floor(scene), 0, last - 1);
    const f = THREE.MathUtils.clamp(scene - i, 0, 1);

    const u = material.current.uniforms;
    u.uTexA.value = textures[i];
    u.uTexB.value = textures[Math.min(i + 1, last)];
    u.uMix.value = f;
    u.uTime.value = clock.elapsedTime;
    u.uAspect.value = aspect;
    // hand off to the particle constellation through the worlds chapter
    u.uOpacity.value = 1 - THREE.MathUtils.smoothstep(scene, 4.3, 4.95);
    mesh.current.visible = u.uOpacity.value > 0.002;
  });

  return (
    <mesh ref={mesh} renderOrder={-2} frustumCulled={false}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        ref={material}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        depthTest={false}
      />
    </mesh>
  );
}
