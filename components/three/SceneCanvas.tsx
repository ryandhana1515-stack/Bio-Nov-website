"use client";

import { Component, ReactNode, Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { getQualityProfile, supportsWebGL, QualityProfile } from "@/lib/performance/quality";
import MorphPoints from "./MorphPoints";
import CuriosityCore from "./CuriosityCore";
import CameraRig from "./CameraRig";

/** Static, no-WebGL / reduced-motion stand-in for the core. */
export function StaticCoreFallback() {
  return (
    <div aria-hidden="true" className="fixed inset-0 z-0 pointer-events-none">
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          width: "min(62vmin, 560px)",
          height: "min(62vmin, 560px)",
          background:
            "radial-gradient(circle at 50% 45%, rgba(240,150,70,0.35) 0%, rgba(240,150,70,0.12) 22%, rgba(255,255,255,0.9) 46%, rgba(226,228,230,0.85) 70%, rgba(226,228,230,0) 100%)",
          boxShadow: "0 60px 120px -40px rgba(20,22,26,0.18)",
          filter: "blur(0.3px)",
        }}
      />
    </div>
  );
}

class SceneErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    if (this.state.failed) return <StaticCoreFallback />;
    return this.props.children;
  }
}

/**
 * Fixed full-viewport WebGL layer that lives behind every chapter.
 * Falls back to a static gradient when WebGL is missing, the GPU dies,
 * or the visitor prefers reduced motion.
 */
export default function SceneCanvas() {
  const [profile, setProfile] = useState<QualityProfile | null>(null);
  const [webgl, setWebgl] = useState(true);

  useEffect(() => {
    setProfile(getQualityProfile());
    setWebgl(supportsWebGL());
  }, []);

  if (!profile) return null;
  if (!webgl || profile.tier === "static") return <StaticCoreFallback />;

  return (
    <div className="fixed inset-0 z-0 pointer-events-none" aria-hidden="true">
      <SceneErrorBoundary>
        <Canvas
          dpr={[1, profile.dprMax]}
          camera={{ fov: 42, near: 0.1, far: 60, position: [0, 0, 4.4] }}
          gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
          onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
        >
          <Suspense fallback={null}>
            <CameraRig parallax={profile.mouseParallax} />
            <group scale={0.85}>
              <MorphPoints count={profile.particleCount} />
              <CuriosityCore detail={profile.coreDetail} />
            </group>
          </Suspense>
        </Canvas>
      </SceneErrorBoundary>
    </div>
  );
}
