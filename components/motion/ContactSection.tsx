"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef, type ReactNode } from "react";

/**
 * The accent slab at the foot of the page, with a soft orb that drifts as the
 * section crosses the viewport.
 *
 * `["start end", "end start"]` measures the whole crossing — from the moment
 * the slab's top edge enters at the bottom of the screen to the moment its
 * bottom edge leaves at the top — so the drift is spread across every pixel
 * the reader spends on it rather than finishing before the slab is in view.
 */
export default function ContactSection({
  id,
  children,
}: {
  id?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });

  const x = useTransform(scrollYProgress, [0, 1], [0, -70]);
  const y = useTransform(scrollYProgress, [0, 1], [0, 60]);

  return (
    <section id={id} ref={ref} className="contact">
      {reduced ? (
        <span className="contact-orb" aria-hidden="true" />
      ) : (
        <motion.span className="contact-orb" style={{ x, y }} aria-hidden="true" />
      )}
      <div className="contact-inner">{children}</div>
    </section>
  );
}
