"use client";
import { motion, useScroll, useSpring } from "framer-motion";

// A slim fixed bar at the very top of the viewport tracking scroll progress
// through the whole document. Gives visitors a sense of how much site is
// left without needing to add a full section-dot indicator.
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 200,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      aria-hidden
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: "2px",
        background: "var(--clr-primary)",
        transformOrigin: "0%",
        scaleX,
        zIndex: 1200,
        pointerEvents: "none",
      }}
    />
  );
}
