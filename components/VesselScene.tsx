"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import { useMemo, useRef } from "react";
import type { Group, Mesh } from "three";

const LENGTH = 9;
const CELL_COUNT = 26;

/* Blood cells travelling down the vessel. Speed and spread both respond to
   how open the vessel is, so "restricted" visibly bunches and slows them. */
function BloodCells({ open }: { open: boolean }) {
  const ref = useRef<Group>(null);

  const cells = useMemo(
    () =>
      Array.from({ length: CELL_COUNT }, (_, i) => ({
        offset: (i / CELL_COUNT) * LENGTH,
        lane: (i % 5) / 4 - 0.5,
        depth: (((i * 7) % 5) / 4 - 0.5),
        spin: (i % 3) * 0.6
      })),
    []
  );

  useFrame((state, delta) => {
    if (!ref.current) return;
    const speed = open ? 2.4 : 0.85;
    const spread = open ? 0.62 : 0.24;

    ref.current.children.forEach((child, i) => {
      const cell = cells[i];
      child.position.x += delta * speed;
      if (child.position.x > LENGTH / 2) child.position.x = -LENGTH / 2;

      // Cells hug the centre line when the vessel is constricted.
      const target = cell.lane * spread;
      child.position.y += (target - child.position.y) * 0.06;
      child.position.z += (cell.depth * spread - child.position.z) * 0.06;
      child.rotation.z = state.clock.elapsedTime * (open ? 1.4 : 0.5) + cell.spin;
    });
  });

  return (
    <group ref={ref}>
      {cells.map((cell, i) => (
        <mesh key={i} position={[cell.offset - LENGTH / 2, cell.lane * 0.4, cell.depth * 0.4]} scale={[1, 1, 0.42]}>
          <sphereGeometry args={[0.2, 20, 20]} />
          <meshPhysicalMaterial color="#ff5f7e" emissive="#c81f4a" emissiveIntensity={0.45} roughness={0.25} clearcoat={0.8} />
        </mesh>
      ))}
    </group>
  );
}

/* The vessel itself — a translucent tube whose radius eases between states. */
function Vessel({ open }: { open: boolean }) {
  const wall = useRef<Mesh>(null);
  const inner = useRef<Mesh>(null);
  const glow = useRef<Mesh>(null);

  useFrame((state, delta) => {
    const target = open ? 1 : 0.44;
    const ease = Math.min(1, delta * 3);

    [wall, inner].forEach((r, idx) => {
      if (!r.current) return;
      const scale = idx === 0 ? target : target * 0.88;
      r.current.scale.x += (scale - r.current.scale.x) * ease;
      r.current.scale.z += (scale - r.current.scale.z) * ease;
    });

    if (glow.current) {
      const t = open ? 1 : 0;
      const mat = glow.current.material as { opacity: number };
      mat.opacity += (t * 0.5 - mat.opacity) * ease;
      glow.current.scale.x += (target * 1.25 - glow.current.scale.x) * ease;
      glow.current.scale.z += (target * 1.25 - glow.current.scale.z) * ease;
      glow.current.rotation.y = state.clock.elapsedTime * 0.4;
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 2]}>
      {/* nitric-oxide signal halo — brightens when the vessel relaxes */}
      <mesh ref={glow}>
        <cylinderGeometry args={[1.15, 1.15, LENGTH, 40, 1, true]} />
        <meshBasicMaterial color="#4fe3ff" transparent opacity={0} side={2} depthWrite={false} />
      </mesh>

      {/* outer vessel wall */}
      <mesh ref={wall}>
        <cylinderGeometry args={[1, 1, LENGTH, 44, 1, true]} />
        <meshPhysicalMaterial
          color="#e0537f"
          emissive="#5c0f34"
          emissiveIntensity={0.28}
          roughness={0.35}
          transmission={0.55}
          thickness={0.6}
          transparent
          opacity={0.55}
          side={2}
        />
      </mesh>

      {/* endothelial inner lining */}
      <mesh ref={inner}>
        <cylinderGeometry args={[0.92, 0.92, LENGTH, 44, 1, true]} />
        <meshStandardMaterial color="#8d2050" emissive="#3d0b24" emissiveIntensity={0.4} roughness={0.6} side={1} />
      </mesh>
    </group>
  );
}

export default function VesselScene({ open }: { open: boolean }) {
  return (
    <Canvas camera={{ position: [0, 1.4, 6.4], fov: 46 }} dpr={[1, 1.6]}>
      <ambientLight intensity={1.5} />
      <pointLight position={[3, 4, 5]} intensity={45} color="#7fe6ff" />
      <pointLight position={[-4, -2, 3]} intensity={28} color="#ff6ea8" />
      <Float speed={1.1} rotationIntensity={0.14} floatIntensity={0.35}>
        <group rotation={[0.12, 0, 0]}>
          <Vessel open={open} />
          <BloodCells open={open} />
        </group>
      </Float>
    </Canvas>
  );
}
