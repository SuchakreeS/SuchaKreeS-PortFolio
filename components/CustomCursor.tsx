"use client";
import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useTheme } from "./ThemeProvider";
import { themes } from "./themes";

const HOVER_SELECTOR =
  'a, button, input, textarea, select, [role="button"], [role="option"], summary';

const HEAD_SIZE = 8;

// Each tail segment: size, opacity, and blur taper off, and each one trails
// the segment before it with a softer spring — chaining them like this
// (rather than all trailing the raw pointer) is what gives the tail its
// curved, comet-like shape instead of a straight line of dots.
const TAIL_SEGMENTS = [
  { size: 7, opacity: 0.55, blur: 0.5, stiffness: 500 },
  { size: 6, opacity: 0.4, blur: 1, stiffness: 320 },
  { size: 5, opacity: 0.28, blur: 1.5, stiffness: 220 },
  { size: 4, opacity: 0.16, blur: 2, stiffness: 150 },
  { size: 3, opacity: 0.08, blur: 2, stiffness: 100 },
];

export default function CustomCursor() {
  const { theme } = useTheme();
  const meta = themes.find((t) => t.id === theme) ?? themes[0];

  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);

  const headX = useMotionValue(-100);
  const headY = useMotionValue(-100);

  // Chain of springs, each trailing the previous one.
  const s1x = useSpring(headX, { stiffness: 500, damping: 40 });
  const s1y = useSpring(headY, { stiffness: 500, damping: 40 });
  const s2x = useSpring(s1x, { stiffness: 320, damping: 40 });
  const s2y = useSpring(s1y, { stiffness: 320, damping: 40 });
  const s3x = useSpring(s2x, { stiffness: 220, damping: 40 });
  const s3y = useSpring(s2y, { stiffness: 220, damping: 40 });
  const s4x = useSpring(s3x, { stiffness: 150, damping: 40 });
  const s4y = useSpring(s3y, { stiffness: 150, damping: 40 });
  const s5x = useSpring(s4x, { stiffness: 100, damping: 40 });
  const s5y = useSpring(s4y, { stiffness: 100, damping: 40 });

  const tail = [
    { x: s1x, y: s1y, ...TAIL_SEGMENTS[0] },
    { x: s2x, y: s2y, ...TAIL_SEGMENTS[1] },
    { x: s3x, y: s3y, ...TAIL_SEGMENTS[2] },
    { x: s4x, y: s4y, ...TAIL_SEGMENTS[3] },
    { x: s5x, y: s5y, ...TAIL_SEGMENTS[4] },
  ];

  useEffect(() => {
    const isFinePointer = window.matchMedia("(pointer: fine)").matches;
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (!isFinePointer || prefersReducedMotion) return;

    setEnabled(true);
    const originalCursor = document.body.style.cursor;
    document.body.style.cursor = "none";

    const handleMove = (e: MouseEvent) => {
      headX.set(e.clientX);
      headY.set(e.clientY);
      const target = e.target as Element | null;
      setHovering(!!target?.closest(HOVER_SELECTOR));
    };
    window.addEventListener("mousemove", handleMove);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      document.body.style.cursor = originalCursor;
    };
  }, [headX, headY]);

  if (!enabled) return null;

  return (
    <>
      {/* Tail — rendered first so it sits behind the comet head */}
      {tail.map((seg, i) => (
        <motion.div
          key={i}
          aria-hidden
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            x: seg.x,
            y: seg.y,
            marginLeft: -seg.size / 2,
            marginTop: -seg.size / 2,
            width: seg.size,
            height: seg.size,
            borderRadius: "50%",
            background: meta.dot,
            opacity: seg.opacity,
            filter: `blur(${seg.blur}px)`,
            pointerEvents: "none",
            zIndex: 9998,
            mixBlendMode: "screen",
          }}
        />
      ))}

      {/* Comet head — a bright core glued to the exact pointer position */}
      <motion.div
        aria-hidden
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          x: headX,
          y: headY,
          marginLeft: -HEAD_SIZE / 2,
          marginTop: -HEAD_SIZE / 2,
          pointerEvents: "none",
          zIndex: 9999,
        }}
        animate={{ scale: hovering ? 1.7 : 1 }}
        transition={{ type: "spring", stiffness: 350, damping: 22 }}
      >
        <div
          style={{
            width: HEAD_SIZE,
            height: HEAD_SIZE,
            borderRadius: "50%",
            background: "#ffffff",
            boxShadow: `0 0 6px 2px #ffffff, 0 0 16px 4px ${meta.dot}, 0 0 28px 8px ${meta.dot}88`,
            transition: "box-shadow 0.2s ease",
          }}
        />
      </motion.div>
    </>
  );
}
