"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { scrollState } from "@/lib/scroll/state";

/**
 * Scroll-driven dolly. Camera position and look-target are Catmull-Rom
 * splines keyed to the integer scene states, with pointer micro-parallax
 * layered on top for desktop.
 */
export default function CameraRig({ parallax }: { parallax: boolean }) {
  const smoothScene = useRef(0);

  const { posCurve, lookCurve } = useMemo(() => {
    const positions = [
      new THREE.Vector3(0, 0, 4.4), // 0 core — wide museum shot
      new THREE.Vector3(0.9, 0.25, 3.2), // 1 inside the strand field
      new THREE.Vector3(0.35, 0.1, 3.0), // 2 head — three-quarter
      new THREE.Vector3(0, 0, 2.6), // 3 fingerprint — close
      new THREE.Vector3(0, 0.05, 3.2), // 4 silhouette — respectful distance
      new THREE.Vector3(0.2, 0.3, 4.6), // 5 constellation — wide
      new THREE.Vector3(0, 0.2, 4.2), // 6 journey line
      new THREE.Vector3(0, 0.4, 4.0), // 7 orbit rings
      new THREE.Vector3(0, 0.35, 5.2), // 8 horizon
      new THREE.Vector3(0, 0, 3.6), // 9 collapsed point
      new THREE.Vector3(0, 0, 4.4), // 10 mini core — loop to start
    ];
    const looks = [
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0.6, 0.1, -0.4),
      new THREE.Vector3(0, 0.1, 0),
      new THREE.Vector3(0, 0, 0.2),
      new THREE.Vector3(0, 0.05, 0),
      new THREE.Vector3(0.2, 0.1, -1.4),
      new THREE.Vector3(0, 0.1, -1.4),
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, -0.2, -8),
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, 0, 0),
    ];
    return {
      posCurve: new THREE.CatmullRomCurve3(positions, false, "catmullrom", 0.4),
      lookCurve: new THREE.CatmullRomCurve3(looks, false, "catmullrom", 0.4),
    };
  }, []);

  const tmpPos = useMemo(() => new THREE.Vector3(), []);
  const tmpLook = useMemo(() => new THREE.Vector3(), []);

  useFrame(({ camera }) => {
    smoothScene.current += (scrollState.scene - smoothScene.current) * 0.07;
    const t = THREE.MathUtils.clamp(smoothScene.current / 10, 0, 1);
    posCurve.getPoint(t, tmpPos);
    lookCurve.getPoint(t, tmpLook);

    if (parallax) {
      tmpPos.x += scrollState.pointerX * 0.16;
      tmpPos.y += -scrollState.pointerY * 0.12;
    }
    // subtle push from scroll velocity
    tmpPos.z += THREE.MathUtils.clamp(scrollState.velocity * 0.006, -0.15, 0.15);

    camera.position.lerp(tmpPos, 0.08);
    camera.lookAt(tmpLook);
  });

  return null;
}
