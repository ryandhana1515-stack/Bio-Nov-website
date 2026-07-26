"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Html, Line } from "@react-three/drei";
import { useMemo, useRef } from "react";
import type { Group, Mesh, Points } from "three";

/* ---- The central N=O molecule ---- */
function Molecule() {
  const ref = useRef<Group>(null);
  const glowN = useRef<Mesh>(null);
  const glowO = useRef<Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (ref.current) {
      ref.current.rotation.y = t * 0.28;
      ref.current.rotation.x = Math.sin(t * 0.3) * 0.12;
    }
    // Breathing halo — the molecule feels alive rather than static
    const pulse = 1 + Math.sin(t * 1.6) * 0.08;
    if (glowN.current) glowN.current.scale.setScalar(pulse);
    if (glowO.current) glowO.current.scale.setScalar(1 + Math.sin(t * 1.6 + 1) * 0.08);
  });

  return (
    <Float speed={1.4} rotationIntensity={0.22} floatIntensity={0.5}>
      <group ref={ref}>
        {/* Nitrogen */}
        <mesh position={[-0.85, 0, 0]}>
          <sphereGeometry args={[0.58, 48, 48]} />
          <meshPhysicalMaterial color="#21c5ff" emissive="#007bea" emissiveIntensity={0.6} roughness={0.1} metalness={0.15} clearcoat={1} />
        </mesh>
        <mesh ref={glowN} position={[-0.85, 0, 0]}>
          <sphereGeometry args={[0.74, 32, 32]} />
          <meshBasicMaterial color="#4fe3ff" transparent opacity={0.16} depthWrite={false} />
        </mesh>

        {/* Oxygen */}
        <mesh position={[0.85, 0, 0]}>
          <sphereGeometry args={[0.58, 48, 48]} />
          <meshPhysicalMaterial color="#b14cff" emissive="#ff4fa3" emissiveIntensity={0.48} roughness={0.1} clearcoat={1} />
        </mesh>
        <mesh ref={glowO} position={[0.85, 0, 0]}>
          <sphereGeometry args={[0.74, 32, 32]} />
          <meshBasicMaterial color="#ff7ad4" transparent opacity={0.15} depthWrite={false} />
        </mesh>

        {/* Double bond */}
        <Line points={[[-0.35, 0.12, 0], [0.35, 0.12, 0]]} color="#ffffff" lineWidth={4} />
        <Line points={[[-0.35, -0.12, 0], [0.35, -0.12, 0]]} color="#9eeaff" lineWidth={4} />

        <Html center>
          <span className="molecule-label">NO</span>
        </Html>
      </group>
    </Float>
  );
}

/* ---- Electron shells orbiting the pair ---- */
function Shells() {
  const a = useRef<Group>(null);
  const b = useRef<Group>(null);
  const c = useRef<Group>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (a.current) a.current.rotation.z = t * 0.5;
    if (b.current) b.current.rotation.x = t * 0.42;
    if (c.current) c.current.rotation.y = t * 0.36;
  });

  const ring = (r: number) => {
    const pts: [number, number, number][] = [];
    for (let i = 0; i <= 72; i++) {
      const th = (i / 72) * Math.PI * 2;
      pts.push([Math.cos(th) * r, Math.sin(th) * r, 0]);
    }
    return pts;
  };

  return (
    <>
      <group ref={a}><Line points={ring(2.1)} color="#4fe3ff" lineWidth={1.1} transparent opacity={0.35} /></group>
      <group ref={b} rotation={[1.2, 0, 0]}><Line points={ring(2.45)} color="#7c5cff" lineWidth={1.1} transparent opacity={0.28} /></group>
      <group ref={c} rotation={[0, 1.1, 0.4]}><Line points={ring(2.75)} color="#ff7ad4" lineWidth={1.1} transparent opacity={0.22} /></group>
    </>
  );
}

/* ---- Ambient molecular dust ---- */
function Dust() {
  const ref = useRef<Points>(null);
  const positions = useMemo(() => {
    const arr = new Float32Array(260 * 3);
    for (let i = 0; i < 260; i++) {
      const r = 3 + Math.random() * 3.2;
      const th = Math.random() * Math.PI * 2;
      const ph = Math.acos(2 * Math.random() - 1);
      arr[i * 3] = r * Math.sin(ph) * Math.cos(th);
      arr[i * 3 + 1] = r * Math.sin(ph) * Math.sin(th) * 0.6;
      arr[i * 3 + 2] = r * Math.cos(ph);
    }
    return arr;
  }, []);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.045;
      ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.12) * 0.1;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.055} color="#8fe6ff" transparent opacity={0.55} sizeAttenuation depthWrite={false} />
    </points>
  );
}

export default function MoleculeScene() {
  return (
    <Canvas camera={{ position: [0, 0, 6.2], fov: 44 }} dpr={[1, 1.6]}>
      <ambientLight intensity={1.7} />
      <pointLight position={[2, 2, 4]} intensity={38} color="#65ddff" />
      <pointLight position={[-3, -1.5, 2]} intensity={22} color="#ff6ea8" />
      <Dust />
      <Shells />
      <Molecule />
    </Canvas>
  );
}
