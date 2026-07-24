"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { scrollState } from "@/lib/scroll/state";

const vertexShader = /* glsl */ `
uniform float uTime;
varying vec3 vNormal;
varying vec3 vView;
varying float vRidge;

float hash(vec3 p) {
  return fract(sin(dot(p, vec3(12.9898, 78.233, 37.719))) * 43758.5453);
}

void main() {
  vec3 n = normalize(position);
  float theta = atan(n.z, n.x);
  float phi = acos(clamp(n.y, -1.0, 1.0));

  // fibrous meridian ridges, slowly crawling
  float ridge = sin(theta * 42.0 + sin(phi * 6.0 + uTime * 0.25) * 2.2 + uTime * 0.12);
  float ridge2 = sin(phi * 38.0 + theta * 3.0 - uTime * 0.18);
  float bump = 0.028 * ridge + 0.02 * ridge2 + 0.012 * sin(theta * 9.0 + phi * 11.0);

  // breathing
  float breathe = 0.015 * sin(uTime * 1.1);

  vec3 displaced = position * (1.0 + bump + breathe);
  vRidge = ridge * 0.5 + 0.5;
  vNormal = normalMatrix * n;
  vec4 mv = modelViewMatrix * vec4(displaced, 1.0);
  vView = -mv.xyz;
  gl_Position = projectionMatrix * mv;
}
`;

const fragmentShader = /* glsl */ `
uniform float uGlow;
uniform float uAlpha;
uniform float uTime;
varying vec3 vNormal;
varying vec3 vView;
varying float vRidge;

void main() {
  vec3 n = normalize(vNormal);
  vec3 v = normalize(vView);
  vec3 lightDir = normalize(vec3(-0.5, 0.8, 0.6));

  float lambert = dot(n, lightDir) * 0.5 + 0.5;
  float fresnel = pow(1.0 - max(dot(n, v), 0.0), 2.4);
  float facing = pow(max(dot(n, v), 0.0), 2.0);

  vec3 porcelain = mix(vec3(0.82, 0.82, 0.83), vec3(0.97, 0.965, 0.95), lambert);
  porcelain -= vRidge * 0.085;             // ridge shading
  vec3 ember = vec3(0.95, 0.52, 0.2);
  vec3 blue = vec3(0.72, 0.79, 0.85);

  // warm inner energy escaping through the fibres facing the camera
  float innerGlow = facing * uGlow * (0.55 + 0.45 * sin(uTime * 0.9));
  vec3 color = porcelain;
  color = mix(color, ember, innerGlow * 0.55);
  color += fresnel * blue * 0.28;

  // dissolve breakup driven by alpha
  float noise = fract(sin(dot(n.xy + vRidge, vec2(12.9, 78.2))) * 43758.5);
  if (noise > uAlpha) discard;

  gl_FragColor = vec4(color, 1.0);
}
`;

/**
 * The hero "Curiosity Core" — a fibrous porcelain sphere with a warm
 * internal energy source. Lives through chapters 1–2, then dissolves as
 * the particle system takes over the story.
 */
export default function CuriosityCore({ detail }: { detail: number }) {
  const mesh = useRef<THREE.Mesh>(null);
  const material = useRef<THREE.ShaderMaterial>(null);
  const glowRef = useRef<THREE.Sprite>(null);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uGlow: { value: 0.4 },
      uAlpha: { value: 1 },
    }),
    []
  );

  const glowTexture = useMemo(() => {
    const size = 128;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d")!;
    const grad = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    grad.addColorStop(0, "rgba(240, 150, 70, 0.9)");
    grad.addColorStop(0.35, "rgba(235, 130, 58, 0.35)");
    grad.addColorStop(1, "rgba(235, 130, 58, 0)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, size, size);
    const tex = new THREE.CanvasTexture(canvas);
    return tex;
  }, []);

  useFrame((state) => {
    const scene = scrollState.scene;
    const t = state.clock.elapsedTime;
    if (material.current) {
      material.current.uniforms.uTime.value = t;
      // glow intensifies as the camera approaches during chapter 1
      const approach = THREE.MathUtils.clamp(scene / 0.35, 0, 1);
      material.current.uniforms.uGlow.value = 0.35 + approach * 0.65;
      // dissolve through chapter 2 (scene 0.5 → 1.4)
      const dissolve = THREE.MathUtils.clamp((scene - 0.5) / 0.9, 0, 1);
      material.current.uniforms.uAlpha.value = 1 - dissolve;
    }
    if (mesh.current) {
      mesh.current.rotation.y = t * 0.06 + scene * 0.8;
      mesh.current.rotation.z = Math.sin(t * 0.1) * 0.05;
      const dissolve = THREE.MathUtils.clamp((scene - 0.5) / 0.9, 0, 1);
      const s = 1 + dissolve * 0.35;
      mesh.current.scale.setScalar(s);
      mesh.current.visible = dissolve < 0.999;
    }
    if (glowRef.current) {
      const scene10 = scene;
      // glow present at core, contact point and final mini core
      const core = 1 - THREE.MathUtils.clamp((scene10 - 0.5) / 0.9, 0, 1);
      const point = THREE.MathUtils.clamp(1 - Math.abs(scene10 - 9) / 0.6, 0, 1);
      const finale = THREE.MathUtils.clamp((scene10 - 9.4) / 0.6, 0, 1);
      const philosophy = THREE.MathUtils.clamp(1 - Math.abs(scene10 - 7) / 0.5, 0, 1) * 0.5;
      const intensity = Math.max(core, Math.max(point, Math.max(finale * 0.8, philosophy)));
      const mat = glowRef.current.material as THREE.SpriteMaterial;
      mat.opacity = intensity * (0.5 + 0.14 * Math.sin(t * 1.3));
      const scale = 1.6 + intensity * 1.2 + 0.08 * Math.sin(t * 1.1);
      glowRef.current.scale.set(scale, scale, 1);
    }
  });

  return (
    <group>
      <mesh ref={mesh}>
        <icosahedronGeometry args={[1.02, Math.max(24, Math.min(96, detail))]} />
        <shaderMaterial
          ref={material}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={uniforms}
        />
      </mesh>
      <sprite ref={glowRef} renderOrder={-1}>
        <spriteMaterial
          map={glowTexture}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          opacity={0.5}
        />
      </sprite>
    </group>
  );
}
