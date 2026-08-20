"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useEffect, useState, type ReactNode } from "react";

/**
 * The hero copy sinks, shrinks and fades as the page moves off it, so the
 * ticker below arrives over the top of it rather than after it.
 *
 * Driven off raw `scrollY` rather than an element-relative progress: the
 * effect has to be finished by 90% of a viewport regardless of how tall the
 * hero grew on a given device, which is a window measurement, not a hero one.
 */
export default function HeroInner({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion();
  const { scrollY } = useScroll();
  const [span, setSpan] = useState(1);

  useEffect(() => {
    const measure = () => setSpan(Math.max(1, window.innerHeight * 0.9));
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const y = useTransform(scrollY, [0, span], reduced ? [0, 0] : [0, -70], { clamp: true });
  const scale = useTransform(scrollY, [0, span], reduced ? [1, 1] : [1, 0.955], { clamp: true });
  const opacity = useTransform(scrollY, [0, span], reduced ? [1, 1] : [1, 0.1], { clamp: true });

  return (
    <motion.div className="hero-inner" style={{ y, scale, opacity }}>
      {children}
    </motion.div>
  );
}
