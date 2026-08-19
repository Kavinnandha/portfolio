"use client";

import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import type { ReactNode } from "react";
import { useRef } from "react";
import { SCROLL_SPRING } from "./easing";

/**
 * Depth on a photograph without the usual gap at the edges.
 *
 * The frame clips, and the inner layer is inset *past* the frame on both axes,
 * so translating it can never expose background. The translation is expressed
 * in percentages of the inner layer, which keeps the effect identical at every
 * viewport size instead of overshooting on tall phones.
 */
export default function Parallax({
  children,
  className,
  /** Travel as a percentage of the frame height. */
  amount = 6,
}: {
  children: ReactNode;
  className?: string;
  amount?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const raw = useTransform(
    scrollYProgress,
    [0, 1],
    reduced ? ["0%", "0%"] : [`${amount}%`, `-${amount}%`],
  );
  const y = useSpring(raw, SCROLL_SPRING);

  return (
    <div
      ref={ref}
      className={`parallax ${className ?? ""}`.trim()}
      data-motion="parallax"
      // The bleed lives on the frame, not on the moving layer: custom
      // properties inherit, and Motion's style type only accepts real
      // animatable keys.
      style={{ "--parallax-bleed": `${amount}%` } as React.CSSProperties}
    >
      <motion.div className="parallax-inner" style={{ y }}>
        {children}
      </motion.div>
    </div>
  );
}
