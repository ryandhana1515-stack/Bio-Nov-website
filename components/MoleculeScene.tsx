"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Html, Line } from "@react-three/drei";
import { useRef } from "react";
import type { Group } from "three";

function Molecule() {
  const ref = useRef<Group>(null);
  useFrame((state) => { if (ref.current) { ref.current.rotation.y = state.clock.elapsedTime * .25; ref.current.rotation.x = Math.sin(state.clock.elapsedTime * .3) * .12; } });
  return <Float speed={1.5} rotationIntensity={.25} floatIntensity={.5}><group ref={ref}>
    <mesh position={[-.85, 0, 0]}><sphereGeometry args={[.58, 40, 40]} /><meshPhysicalMaterial color="#21c5ff" emissive="#007bea" emissiveIntensity={.55} roughness={.12} metalness={.1} /></mesh>
    <mesh position={[.85, 0, 0]}><sphereGeometry args={[.58, 40, 40]} /><meshPhysicalMaterial color="#b14cff" emissive="#ff4fa3" emissiveIntensity={.42} roughness={.12} /></mesh>
    <Line points={[[-.35, .12, 0], [.35, .12, 0]]} color="#ffffff" lineWidth={4} />
    <Line points={[[-.35, -.12, 0], [.35, -.12, 0]]} color="#9eeaff" lineWidth={4} />
    <Html center><span className="molecule-label">NO</span></Html>
  </group></Float>;
}

export default function MoleculeScene() { return <Canvas camera={{ position: [0, 0, 5], fov: 42 }} dpr={[1, 1.5]}><ambientLight intensity={1.8} /><pointLight position={[2, 2, 4]} intensity={3} color="#65ddff" /><Molecule /></Canvas>; }
