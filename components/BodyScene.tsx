"use client";

import { Canvas, useFrame, type ThreeEvent } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import { useMemo, useRef, useState } from "react";
import * as THREE from "three";
import type { Group, Mesh, Points } from "three";

/* ------------------------------------------------------------------ *
 * Vascular routes — heart outward to brain, arms and legs.
 * ------------------------------------------------------------------ */
const HEART = new THREE.Vector3(-0.08, 1.16, 0.16);

const routes = [
  // to the brain
  [HEART, new THREE.Vector3(0, 1.5, 0.1), new THREE.Vector3(0.02, 1.75, 0.06), new THREE.Vector3(0, 1.95, 0)],
  // left arm
  [HEART, new THREE.Vector3(-0.34, 1.36, 0.02), new THREE.Vector3(-0.6, 1.12, 0), new THREE.Vector3(-0.78, 0.6, 0)],
  // right arm
  [HEART, new THREE.Vector3(0.34, 1.36, 0.02), new THREE.Vector3(0.6, 1.12, 0), new THREE.Vector3(0.78, 0.6, 0)],
  // left leg
  [HEART, new THREE.Vector3(-0.12, 0.72, 0.06), new THREE.Vector3(-0.22, 0.05, 0), new THREE.Vector3(-0.25, -0.92, 0)],
  // right leg
  [HEART, new THREE.Vector3(0.12, 0.72, 0.06), new THREE.Vector3(0.22, 0.05, 0), new THREE.Vector3(0.25, -0.92, 0)],
  // gut / metabolic loop
  [HEART, new THREE.Vector3(0.16, 0.98, 0.14), new THREE.Vector3(-0.14, 0.82, 0.16), new THREE.Vector3(0.1, 0.66, 0.12)]
].map((pts) => new THREE.CatmullRomCurve3(pts));

/* Clickable regions, keyed to the six roles listed beside the scene. */
export const bodyHotspots = [
  { key: "Circulation", label: "Heart", pos: [-0.08, 1.16, 0.3] as [number, number, number] },
  { key: "Cognition & Clarity", label: "Brain", pos: [0, 1.95, 0.28] as [number, number, number] },
  { key: "Immune Function", label: "Chest", pos: [0.3, 1.3, 0.3] as [number, number, number] },
  { key: "Metabolic Support", label: "Core", pos: [0.05, 0.74, 0.34] as [number, number, number] },
  { key: "Vitality & Energy", label: "Muscle", pos: [-0.3, -0.42, 0.26] as [number, number, number] },
  { key: "Healthy Ageing", label: "Whole body", pos: [0.72, 0.32, 0.2] as [number, number, number] }
];

/* ------------------------------------------------------------------ *
 * Translucent human form
 * ------------------------------------------------------------------ */
function Body() {
  const glass = {
    color: "#8ecbff",
    transmission: 0.94,
    thickness: 0.85,
    roughness: 0.28,
    ior: 1.3,
    transparent: true,
    opacity: 0.34,
    emissive: "#1d4d9c",
    emissiveIntensity: 0.22
  } as const;

  return (
    <group>
      {/* head */}
      <mesh position={[0, 1.95, 0]}>
        <sphereGeometry args={[0.34, 40, 40]} />
        <meshPhysicalMaterial {...glass} />
      </mesh>
      {/* neck */}
      <mesh position={[0, 1.62, 0]}>
        <capsuleGeometry args={[0.11, 0.16, 8, 20]} />
        <meshPhysicalMaterial {...glass} />
      </mesh>
      {/* torso */}
      <mesh position={[0, 1.06, 0]}>
        <capsuleGeometry args={[0.42, 0.62, 10, 28]} />
        <meshPhysicalMaterial {...glass} />
      </mesh>
      {/* hips */}
      <mesh position={[0, 0.52, 0]}>
        <capsuleGeometry args={[0.33, 0.2, 8, 24]} />
        <meshPhysicalMaterial {...glass} />
      </mesh>
      {/* arms */}
      {[-1, 1].map((s) => (
        <mesh key={`arm${s}`} position={[s * 0.62, 1.02, 0]} rotation={[0, 0, s * 0.16]}>
          <capsuleGeometry args={[0.115, 0.86, 8, 20]} />
          <meshPhysicalMaterial {...glass} />
        </mesh>
      ))}
      {/* legs */}
      {[-1, 1].map((s) => (
        <mesh key={`leg${s}`} position={[s * 0.24, -0.32, 0]} rotation={[0, 0, s * 0.03]}>
          <capsuleGeometry args={[0.155, 1.1, 8, 22]} />
          <meshPhysicalMaterial {...glass} />
        </mesh>
      ))}
    </group>
  );
}

/* ------------------------------------------------------------------ *
 * Glowing vessel network
 * ------------------------------------------------------------------ */
function Vessels() {
  return (
    <group>
      {routes.map((curve, i) => (
        <mesh key={i}>
          <tubeGeometry args={[curve, 64, 0.018, 8, false]} />
          <meshBasicMaterial color="#4fe3ff" transparent opacity={0.5} />
        </mesh>
      ))}
      {/* heart core */}
      <mesh position={HEART.toArray()}>
        <sphereGeometry args={[0.11, 24, 24]} />
        <meshBasicMaterial color="#ff6f95" />
      </mesh>
    </group>
  );
}

/* ------------------------------------------------------------------ *
 * Blood cells + oxygen carried along the routes
 * ------------------------------------------------------------------ */
function FlowParticles({ boosted }: { boosted: boolean }) {
  const ref = useRef<Group>(null);
  const COUNT = 66;

  const seeds = useMemo(
    () =>
      Array.from({ length: COUNT }, (_, i) => ({
        route: i % routes.length,
        t: (i / COUNT) % 1,
        speed: 0.1 + ((i * 7) % 5) * 0.016,
        oxygen: i % 3 === 0
      })),
    []
  );

  useFrame((_, delta) => {
    if (!ref.current) return;
    const mult = boosted ? 1.65 : 1;
    ref.current.children.forEach((child, i) => {
      const s = seeds[i];
      s.t = (s.t + delta * s.speed * mult) % 1;
      const p = routes[s.route].getPointAt(s.t);
      child.position.set(p.x, p.y, p.z);
      const scale = 1 + Math.sin(s.t * Math.PI) * 0.45;
      child.scale.setScalar(scale * (boosted ? 1.15 : 1));
    });
  });

  return (
    <group ref={ref}>
      {seeds.map((s, i) => (
        <mesh key={i}>
          <sphereGeometry args={[s.oxygen ? 0.032 : 0.042, 12, 12]} />
          <meshBasicMaterial color={s.oxygen ? "#9dffe4" : "#ff7d9e"} />
        </mesh>
      ))}
    </group>
  );
}

/* ------------------------------------------------------------------ *
 * Oxygen released into tissue at the extremities
 * ------------------------------------------------------------------ */
function OxygenBloom({ boosted }: { boosted: boolean }) {
  const ref = useRef<Points>(null);

  const positions = useMemo(() => {
    const arr = new Float32Array(180 * 3);
    for (let i = 0; i < 180; i++) {
      const a = Math.random() * Math.PI * 2;
      const r = 0.35 + Math.random() * 1.15;
      arr[i * 3] = Math.cos(a) * r;
      arr[i * 3 + 1] = -1.1 + Math.random() * 3.2;
      arr[i * 3 + 2] = Math.sin(a) * r * 0.5;
    }
    return arr;
  }, []);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    ref.current.rotation.y = t * 0.06;
    const mat = ref.current.material as THREE.PointsMaterial;
    const target = boosted ? 0.62 : 0.26;
    mat.opacity += (target - mat.opacity) * 0.05;
    mat.size = 0.032 + Math.sin(t * 1.4) * 0.006;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#9dffe4" size={0.032} transparent opacity={0.26} sizeAttenuation depthWrite={false} />
    </points>
  );
}

/* ------------------------------------------------------------------ *
 * Clickable pulsing hotspot
 * ------------------------------------------------------------------ */
function Hotspot({
  position,
  active,
  onSelect
}: {
  position: [number, number, number];
  active: boolean;
  onSelect: (e: ThreeEvent<MouseEvent>) => void;
}) {
  const ring = useRef<Mesh>(null);
  const core = useRef<Mesh>(null);
  const [hover, setHover] = useState(false);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const pulse = 1 + Math.sin(t * 2.4) * (active ? 0.3 : 0.14);
    if (ring.current) {
      ring.current.scale.setScalar(pulse * (active || hover ? 1.5 : 1));
      const m = ring.current.material as THREE.MeshBasicMaterial;
      m.opacity = active ? 0.95 : hover ? 0.75 : 0.42;
    }
    if (core.current) core.current.scale.setScalar(active ? 1.35 : hover ? 1.15 : 1);
  });

  return (
    <group
      position={position}
      onClick={onSelect}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHover(true);
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        setHover(false);
        document.body.style.cursor = "auto";
      }}
    >
      {/* generous invisible hit area */}
      <mesh visible={false}>
        <sphereGeometry args={[0.18, 8, 8]} />
      </mesh>
      <mesh ref={core}>
        <sphereGeometry args={[0.045, 18, 18]} />
        <meshBasicMaterial color={active ? "#ffffff" : "#8fe6ff"} />
      </mesh>
      <mesh ref={ring} rotation={[0, 0, 0]}>
        <ringGeometry args={[0.075, 0.1, 32]} />
        <meshBasicMaterial color={active ? "#ffffff" : "#8fe6ff"} transparent opacity={0.42} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

/* ------------------------------------------------------------------ *
 * Scene
 * ------------------------------------------------------------------ */
function Rig({
  activeKey,
  onSelect,
  boosted
}: {
  activeKey: string | null;
  onSelect: (key: string) => void;
  boosted: boolean;
}) {
  const group = useRef<Group>(null);

  useFrame((state) => {
    if (!group.current) return;
    // Gentle turntable, nudged by pointer position
    const px = state.pointer.x * 0.35;
    group.current.rotation.y += (px - group.current.rotation.y) * 0.03 + 0.0016;
  });

  return (
    <Float speed={1} rotationIntensity={0.06} floatIntensity={0.28}>
      <group ref={group} position={[0, -0.35, 0]}>
        <Body />
        <Vessels />
        <FlowParticles boosted={boosted} />
        <OxygenBloom boosted={boosted} />
        {bodyHotspots.map((h) => (
          <Hotspot
            key={h.key}
            position={h.pos}
            active={activeKey === h.key}
            onSelect={(e) => {
              e.stopPropagation();
              onSelect(h.key);
            }}
          />
        ))}
      </group>
    </Float>
  );
}

export default function BodyScene({
  activeKey,
  onSelect,
  boosted = false
}: {
  activeKey: string | null;
  onSelect: (key: string) => void;
  boosted?: boolean;
}) {
  return (
    <Canvas camera={{ position: [0, 0.35, 5.1], fov: 42 }} dpr={[1, 1.6]}>
      <ambientLight intensity={1.5} />
      <pointLight position={[3, 3, 4]} intensity={40} color="#7fe6ff" />
      <pointLight position={[-3, -1, 3]} intensity={26} color="#ff7ad4" />
      <pointLight position={[0, 2, -3]} intensity={22} color="#7c5cff" />
      <Rig activeKey={activeKey} onSelect={onSelect} boosted={boosted} />
    </Canvas>
  );
}
