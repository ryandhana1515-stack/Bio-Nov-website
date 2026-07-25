"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { buildTargets, TARGET_COUNT, TEX_WIDTH } from "./targets";
import { scrollState } from "@/lib/scroll/state";

const vertexShader = /* glsl */ `
uniform sampler2D uTargets;
uniform float uScene;
uniform float uTime;
uniform float uRows;
uniform float uSize;
uniform float uVelocity;

in float aIndex;
in float aRand;

out float vShade;
out float vEmber;
out float vSpark;

vec3 readTarget(int target, int index) {
  int row = index / ${TEX_WIDTH};
  int col = index - row * ${TEX_WIDTH};
  return texelFetch(uTargets, ivec2(col, target * int(uRows) + row), 0).xyz;
}

void main() {
  int idx = int(aIndex);
  float scene = clamp(uScene, 0.0, float(${TARGET_COUNT} - 1));
  int a = int(floor(scene));
  int b = min(a + 1, ${TARGET_COUNT} - 1);
  float f = smoothstep(0.0, 1.0, fract(scene));

  vec3 pa = readTarget(a, idx);
  vec3 pb = readTarget(b, idx);
  vec3 pos = mix(pa, pb, f);

  // transition turbulence — strongest mid-morph, calm at rest
  float agitation = 4.0 * f * (1.0 - f);
  float swirl = agitation * (0.22 + min(abs(uVelocity) * 0.04, 0.25));
  pos += swirl * vec3(
    sin(pos.y * 3.1 + uTime * 0.7 + aRand * 6.28),
    sin(pos.z * 2.7 + uTime * 0.6 + aRand * 4.0),
    sin(pos.x * 2.3 + uTime * 0.5 + aRand * 8.0)
  );

  // gentle breathing while resting as the core
  float coreness = 1.0 - smoothstep(0.0, 1.2, scene);
  float finale = smoothstep(9.2, 10.0, scene);
  float breathe = (coreness + finale) * 0.018 * sin(uTime * 1.1 + length(pos) * 3.0);
  pos *= 1.0 + breathe;

  // idle drift so stillness never looks frozen
  pos += 0.012 * vec3(
    sin(uTime * 0.4 + aRand * 40.0),
    cos(uTime * 0.33 + aRand * 30.0),
    sin(uTime * 0.28 + aRand * 20.0)
  );

  vec4 mv = modelViewMatrix * vec4(pos, 1.0);
  float dist = length(pos);

  // ember warmth radiates from the centre in core / point / final states
  float emberStates = max(coreness, max(finale, smoothstep(8.4, 9.0, scene) * (1.0 - smoothstep(9.4, 9.9, scene))));
  vEmber = emberStates * smoothstep(1.25, 0.15, dist);

  // occasional gold sparks travelling along strands
  float sparkPhase = fract(aRand * 7.13 + uTime * 0.06);
  float strandness = smoothstep(0.3, 1.0, scene) * (1.0 - smoothstep(1.6, 2.4, scene));
  vSpark = strandness * smoothstep(0.985, 1.0, sparkPhase);

  vShade = aRand;

  // distant, sparse states (worlds → horizon) read better with larger points
  float farBoost = 1.0 + 0.6 * smoothstep(4.2, 5.0, scene) * (1.0 - smoothstep(8.6, 9.2, scene));
  float size = uSize * farBoost * (0.7 + aRand * 0.9 + vEmber * 1.2 + vSpark * 1.8);
  gl_PointSize = size * (9.0 / max(-mv.z, 0.1));
  gl_Position = projectionMatrix * mv;
}
`;

const fragmentShader = /* glsl */ `
uniform float uGlobalFade;

in float vShade;
in float vEmber;
in float vSpark;
out vec4 outColor;

void main() {
  vec2 uv = gl_PointCoord - 0.5;
  float d = length(uv);
  float alpha = smoothstep(0.5, 0.12, d);
  if (alpha < 0.02) discard;

  vec3 silver = vec3(0.8, 0.81, 0.83);
  vec3 charcoal = vec3(0.42, 0.44, 0.48);
  vec3 ember = vec3(0.94, 0.55, 0.24);
  vec3 gold = vec3(0.89, 0.7, 0.33);

  vec3 color = mix(silver, charcoal, vShade * 0.85);
  color = mix(color, ember, vEmber * 0.9);
  color = mix(color, gold, vSpark);

  float a = alpha * (0.3 + vShade * 0.2 + vEmber * 0.5 + vSpark * 0.55) * uGlobalFade;
  outColor = vec4(color, a);
}
`;

type Props = { count: number };

/**
 * The single continuous particle system that carries the whole story —
 * core, strands, head, contour face, silhouette, worlds, journey line,
 * orbit rings, horizon, point and final mini-core — morphed by scroll.
 */
export default function MorphPoints({ count }: Props) {
  const material = useRef<THREE.ShaderMaterial>(null);

  const { geometry, uniforms } = useMemo(() => {
    const { texture, rowsPerTarget } = buildTargets(count);
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3); // real positions come from the texture
    const index = new Float32Array(count);
    const rnd = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      index[i] = i;
      rnd[i] = ((i * 2654435761) % 4294967296) / 4294967296;
    }
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("aIndex", new THREE.BufferAttribute(index, 1));
    geo.setAttribute("aRand", new THREE.BufferAttribute(rnd, 1));
    geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(0, 0, 0), 30);
    const uni = {
      uTargets: { value: texture },
      uScene: { value: 0 },
      uTime: { value: 0 },
      uRows: { value: rowsPerTarget },
      uSize: { value: 1.2 },
      uVelocity: { value: 0 },
      uGlobalFade: { value: 0.2 },
    };
    return { geometry: geo, uniforms: uni };
  }, [count]);

  useFrame((state) => {
    if (!material.current) return;
    const u = material.current.uniforms;
    u.uTime.value = state.clock.elapsedTime;
    // ease toward the scroll-driven scene value for buttery reversals
    u.uScene.value += (scrollState.scene - u.uScene.value) * 0.09;
    u.uVelocity.value += (scrollState.velocity - u.uVelocity.value) * 0.1;
    // while the AI imagery owns the stage (scenes 0–4.5) the particles are
    // quiet ambient dust; once it dissolves they carry the story alone
    const dustTarget = scrollState.scene < 4.1 ? 0.18 : 1;
    u.uGlobalFade.value += (dustTarget - u.uGlobalFade.value) * 0.06;
  });

  return (
    <points geometry={geometry} frustumCulled={false}>
      <shaderMaterial
        ref={material}
        glslVersion={THREE.GLSL3}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.NormalBlending}
      />
    </points>
  );
}
