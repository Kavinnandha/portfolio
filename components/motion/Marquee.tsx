"use client";

import { motion, useReducedMotion } from "motion/react";

export type Chip = { label: string; tone?: "accent" | "ink" };

/**
 * Declared at module scope, not inside the render. A component defined during
 * render is a brand-new type on every pass, so React unmounts and remounts the
 * whole list each frame — exactly the subtree that must stay stable for the
 * loop to look seamless.
 */
function Row({ items, clone }: { items: Chip[]; clone?: boolean }) {
  return (
    <div className="marquee-row" aria-hidden={clone || undefined}>
      {items.map((item) => (
        <span className={`chip${item.tone ? ` is-${item.tone}` : ""}`} key={item.label}>
          {item.label}
        </span>
      ))}
    </div>
  );
}

/**
 * An endless ticker of the stack.
 *
 * The track holds the list twice and travels exactly -50%, so the seam lands
 * on an identical frame and the loop is invisible.
 */
export default function Marquee({
  items,
  duration = 34,
  label = "Technologies",
}: {
  items: Chip[];
  duration?: number;
  label?: string;
}) {
  const reduced = useReducedMotion();

  return (
    <section className="marquee" aria-label={label}>
      {reduced ? (
        <div className="marquee-track">
          <Row items={items} />
        </div>
      ) : (
        <motion.div
          className="marquee-track"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration, ease: "linear", repeat: Infinity }}
        >
          <Row items={items} />
          <Row items={items} clone />
        </motion.div>
      )}
    </section>
  );
}
