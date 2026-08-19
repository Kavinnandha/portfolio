"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import { EASE_IN_OUT } from "./easing";

/**
 * A short accent curtain that wipes off the top of the page on load.
 *
 * Deliberately brief. A curtain is a first-impression device, not a loading
 * screen — anything past ~800ms reads as latency and costs real LCP. It is
 * removed from the tree once it finishes so it can never trap a click, and the
 * `<noscript>` rule in the layout hides it outright, since without JavaScript
 * it would otherwise sit over the page forever.
 */
export default function Intro() {
  const reduced = useReducedMotion();
  const [done, setDone] = useState(false);

  // No synchronous setState here: the reduced-motion case is handled by the
  // early return below, so the effect only ever schedules the dismissal.
  useEffect(() => {
    const t = setTimeout(() => setDone(true), 900);
    return () => clearTimeout(t);
  }, []);

  if (reduced) return null;

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="intro"
          aria-hidden="true"
          initial={{ y: 0 }}
          exit={{ y: "-100%" }}
          transition={{ duration: 0.75, ease: EASE_IN_OUT }}
        >
          <motion.span
            className="intro-mark"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            transition={{ duration: 0.5, ease: EASE_IN_OUT }}
          >
            Kavin Nandha M K
          </motion.span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
