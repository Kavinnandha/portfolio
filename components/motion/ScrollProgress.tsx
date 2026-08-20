"use client";

import { motion, useScroll, useSpring } from "motion/react";

/**
 * The 3px accent rule across the top. Driven by `scaleX` on a full-width bar
 * rather than an animated `width`, so it runs on the compositor and never
 * triggers layout.
 */
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 260,
    damping: 40,
    restDelta: 0.0005,
  });

  return (
    <div className="progress-track" aria-hidden="true">
      <motion.div className="progress-bar" style={{ scaleX }} />
    </div>
  );
}
