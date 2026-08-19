"use client";

import { motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import { POINTER_SPRING } from "./easing";

/**
 * Magnetic pull toward the cursor, carried over from the design canvas but
 * rebuilt on springs so the element settles instead of snapping back.
 *
 * Gated on a real hover-capable pointer: on touch, `mousemove` fires once on
 * tap and would leave the control permanently offset. Vertical travel is
 * damped to 55% of horizontal, which keeps rows of buttons on their baseline.
 */
export default function Magnetic({
  children,
  strength = 7,
  className,
}: {
  children: ReactNode;
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();
  const [canHover, setCanHover] = useState(false);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, POINTER_SPRING);
  const y = useSpring(my, POINTER_SPRING);

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const sync = () => setCanHover(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const active = canHover && !reduced;

  const onMove = (e: React.MouseEvent<HTMLSpanElement>) => {
    if (!active || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const dx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
    const dy = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
    mx.set(dx * strength);
    my.set(dy * strength * 0.55);
  };

  const onLeave = () => {
    mx.set(0);
    my.set(0);
  };

  return (
    <motion.span
      ref={ref}
      className={`magnetic ${className ?? ""}`.trim()}
      style={{ x, y }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      {children}
    </motion.span>
  );
}
