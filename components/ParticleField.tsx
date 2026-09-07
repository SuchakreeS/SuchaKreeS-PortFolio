"use client";
import { useEffect, useMemo, useRef, useState, type MutableRefObject } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";
import { useTheme } from "./ThemeProvider";
import { themes } from "./themes";

// Tracked at the window level (not the canvas) so the parallax still reacts
// even though the canvas itself is pointer-events: none.
function usePointerParallax() {
  const pointer = useRef({ x: 0, y: 0 });
  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);
  return pointer;
}

interface DustProps {
  color: string;
  reducedMotion: boolean;
  pointer: MutableRefObject<{ x: number; y: number }>;
  count: number;
}

function Dust({ color, reducedMotion, pointer, count }: DustProps) {
  const groupRef = useRef<THREE.Group>(null);

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 12;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 8;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 6;
    }
    return arr;
  }, [count]);

  useFrame((_, delta) => {
    const group = groupRef.current;
    if (!group) return;
    if (!reducedMotion) {
      group.rotation.y += delta * 0.015;
    }
    const targetTiltX = pointer.current.y * 0.12;
    const targetTiltY = pointer.current.x * 0.18;
    group.rotation.x += (targetTiltX - group.rotation.x) * 0.03;
    group.rotation.y += (targetTiltY - group.rotation.y) * 0.02;
  });

  return (
    <group ref={groupRef}>
      <Points positions={positions} stride={3}>
        <PointMaterial
          transparent
          color={color}
          size={0.045}
          sizeAttenuation
          depthWrite={false}
          opacity={0.6}
        />
      </Points>
    </group>
  );
}

interface ParticleFieldProps {
  count?: number;
}

// A sparse field of theme-colored dust, drifting slowly and tilting toward
// the cursor. Meant as a section background — absolutely positioned,
// pointer-events: none, so it never blocks the content in front of it.
export default function ParticleField({ count = 220 }: ParticleFieldProps) {
  const { theme } = useTheme();
  const meta = themes.find((t) => t.id === theme) ?? themes[0];
  const [reducedMotion, setReducedMotion] = useState(false);
  const pointer = usePointerParallax();

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(query.matches);
    const handleChange = () => setReducedMotion(query.matches);
    query.addEventListener("change", handleChange);
    return () => query.removeEventListener("change", handleChange);
  }, []);

  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0 }}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        dpr={[1, 1.5]}
        gl={{ alpha: true, antialias: false }}
      >
        <Dust color={meta.dot} reducedMotion={reducedMotion} pointer={pointer} count={count} />
      </Canvas>
    </div>
  );
}
