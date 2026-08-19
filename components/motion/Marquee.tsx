"use client";

import { motion, useReducedMotion } from "motion/react";

/**
 * Declared at module scope, not inside the render. A component defined during
 * render is a brand-new type on every pass, so React unmounts and remounts the
 * whole list each frame — which is exactly the subtree that must stay stable
 * for the loop to look seamless.
 */
function MarqueeList({ items, clone }: { items: string[]; clone?: boolean }) {
  return (
    <ul className="marquee-list" aria-hidden={clone || undefined}>
      {items.map((item) => (
        <li key={item} className="marquee-item">
          <span className="marquee-dot" aria-hidden="true" />
          {item}
        </li>
      ))}
    </ul>
  );
}

/**
 * An endless ticker of the stack, set in the same uppercase micro-type as the
 * section labels so it reads as structure rather than ornament.
 *
 * The track holds the list twice and travels exactly -50%, so the seam lands on
 * an identical frame and the loop is invisible. Duration scales with item
 * count, which keeps pixels-per-second constant however long the list grows.
 */
export default function Marquee({
  items,
  secondsPerItem = 2.6,
  reverse = false,
}: {
  items: string[];
  secondsPerItem?: number;
  reverse?: boolean;
}) {
  const reduced = useReducedMotion();
  const duration = items.length * secondsPerItem;

  if (reduced) {
    return (
      <div className="marquee" data-motion="marquee">
        <div className="marquee-track">
          <MarqueeList items={items} />
        </div>
      </div>
    );
  }

  return (
    <div className="marquee" data-motion="marquee">
      <motion.div
        className="marquee-track"
        animate={{ x: reverse ? ["-50%", "0%"] : ["0%", "-50%"] }}
        transition={{ duration, ease: "linear", repeat: Infinity }}
      >
        <MarqueeList items={items} />
        <MarqueeList items={items} clone />
      </motion.div>
    </div>
  );
}
